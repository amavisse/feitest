import { Request, Response } from "express";
import { Product as ProductType, ProductVariant } from "./lib/shopify/types";
import Product from "./lib/mongodb/models/product";
import Webhook from "./lib/mongodb/models/webhook";
import { fetchProduct, tryAddingWebhook, updateProduct } from "./lib/mongodb";
import { isDiscountHigherThanThreshold, compareDates } from "./lib/utils";
import { sendPriceDropAlert } from "./task3";

export async function findProductById(
  req: Request,
  res: Response
): Promise<ProductType | Response> {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  try {
    const product = await Product.findOne({
      id: `gid://shopify/Product/${id}`,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error when finding product", error });
  }
}

export async function findProductByIdAndReplace(
  req: Request,
  res: Response
): Promise<Response> {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  try {
    const product = await Product.findOneAndReplace(
      { id: `gid://shopify/Product/${id}` },
      req.body,
      { returnDocument: "after" }
    );

    return res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error when updating product", error });
  }
}

export async function insertManyProducts(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const result = await Product.insertMany(req.body);
    return res.status(201).json({ message: "Products inserted", result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error when inserting products", error });
  }
}

export async function insertOneWebhook(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const eventId = req.params.id;
    if (!eventId)
      return res.status(400).json({ message: "Event id is required" });

    const webhook = await Webhook.insertOne({ eventId });
    return res.status(201).json({ message: "Webhook inserted", webhook });
  } catch (error) {
    // if it's a duplicate key returns error
    return res
      .status(500)
      .json({ message: "Server error when inserting webhook", error });
  }
}

type ProductWebhook = {
  admin_graphql_api_id: string;
  title: string;
  handle: string;
  updated_at: string;
  variants: [
    {
      title: string;
      admin_graphql_api_id: string;
      compare_at_price?: string;
      price: string;
      updated_at: string;
    }
  ];
};

export async function actionsWithWebhook(req: Request, res: Response) {
  const eventId = req.headers["x-shopify-event-id"] as string;
  if (!eventId)
    return res.status(400).json({ message: "Event id is required" });

  // add webhook to db while checking for duplicates
  const response = await tryAddingWebhook(eventId);
  if (response === 500)
    return res.status(500).json({ message: "Duplicate webhook" });

  const productWebhook = req.body as ProductWebhook;
  const productInDb = await fetchProduct(
    productWebhook.admin_graphql_api_id.replace("gid://shopify/Product/", "")
  );
  if (!productInDb)
    return res.status(404).json({ message: "Product not found" });

  // If the webhook is older than the product in the db, return an error
  if (compareDates(productInDb.updatedAt, productWebhook.updated_at) > 0)
    return res.status(500).json({ message: "Old webhook" });

  const { newVariants, updatedPriceVariant } = findUpdatedVariants(
    productInDb,
    productWebhook
  );

  // update product in db
  const newProduct: ProductType = {
    id: productWebhook.admin_graphql_api_id,
    variants: newVariants,
    updatedAt: productWebhook.updated_at,
    title: productWebhook.title,
    handle: productWebhook.handle,
    featuredMedia: productInDb.featuredMedia,
  };
  try {
    await updateProduct(
      productInDb.id.replace("gid://shopify/Product/", ""),
      newProduct
    );
    // send email
    if (updatedPriceVariant.length)
      await sendPriceDropAlert(updatedPriceVariant, newProduct);

    res.sendStatus(200);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error when updating product", error });
  }
}

function findUpdatedVariants(
  productInDb: ProductType,
  productWebhook: ProductWebhook
) {
  const updatedPriceVariant: ProductVariant[] = [];
  const newVariants: ProductVariant[] = productWebhook.variants.map(
    (newVariant) => {
      const productVariant = productInDb.variants.find(
        (v) => v.id === newVariant.admin_graphql_api_id
      );
      let updatedVariant: ProductVariant;
      if (
        productVariant &&
        compareDates(newVariant.updated_at, productVariant.updatedAt) <= 0
      ) {
        // there are no changes
        return productVariant;
      }
      // there are changes, update the variant
      updatedVariant = {
        id: newVariant.admin_graphql_api_id,
        price: newVariant.price,
        compareAtPrice: newVariant.compare_at_price,
        updatedAt: newVariant.updated_at,
        title: newVariant.title,
      };
      if (!productVariant) {
        return updatedVariant;
      }

      if (
        newVariant.price !== productVariant.price && // price has changed
        newVariant.compare_at_price && // there is a discount
        isDiscountHigherThanThreshold(
          newVariant.price,
          newVariant.compare_at_price
        )
      ) {
        updatedPriceVariant.push(updatedVariant);
      }

      return updatedVariant;
    }
  );

  return { newVariants, updatedPriceVariant };
}
