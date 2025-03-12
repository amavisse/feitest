import { number } from "@inquirer/prompts";
import { getProductSelection } from "../task2";
import { getProductById, updateProductVariants } from "../lib/shopify";
import {
  Product,
  ProductVariant,
  ProductVariantsBulkInput,
} from "../lib/shopify/types";
import nodemailer from "nodemailer";
import { findDiscountPercentage } from "../lib/utils";
import {
  RECEIVER_EMAIL,
  SENDER_EMAIL,
  SENDER_APP_PASSWORD,
  SHOPIFY_STORE_URL,
} from "../../config";

export async function getDiscountPercentage(): Promise<number> {
  const discountPercentage = await number({
    message: "Enter the discount percentage",
    min: 1,
    max: 99,
    required: true,
  });
  return discountPercentage as number;
}

export const filterOutDiscountedVariants = (
  variants: ProductVariant[],
  discountPercentage: number
): ProductVariant[] =>
  variants.filter((variant) => {
    const discountThreshold = (100 - discountPercentage) / 100;
    return (
      !variant.compareAtPrice ||
      // filter out if prev discount is higher
      Number(variant.price) / Number(variant.compareAtPrice) >=
        discountThreshold
    );
  });

export const applyDiscount = (
  variant: ProductVariant,
  discountPercentage: number
): ProductVariant => {
  let newPrice: string;
  let newCompareAtPrice: string;
  // apply discount by updating price and compareAtPrice
  if (!variant.compareAtPrice) {
    newPrice = (Number(variant.price) * (1 - discountPercentage / 100)).toFixed(
      2
    );
    newCompareAtPrice = variant.price;
  } else {
    newPrice = (Number(variant.compareAtPrice) * (1 - discountPercentage / 100)).toFixed(
      2
    );
    newCompareAtPrice = variant.compareAtPrice;
  }
  return {
    ...variant,
    price: newPrice,
    compareAtPrice: newCompareAtPrice,
  };
};

export const discountThresholdAlert = 20;

export default async function runTask3() {
  // get input from inquirer
  const productSelection = await getProductSelection();
  console.log(`Selected id: ${productSelection}`);

  const product = await getProductById(productSelection);

  const discountPercentage = await getDiscountPercentage();

  const filteredVariants = filterOutDiscountedVariants(
    product.variants,
    discountPercentage
  );

  const input: ProductVariantsBulkInput[] = filteredVariants.map((variant) => {
    const discountedVariant = applyDiscount(variant, discountPercentage);
    return {
      id: variant.id,
      price: discountedVariant.price,
      compareAtPrice: discountedVariant.compareAtPrice!,
    };
  });

  const errors = await updateProductVariants(productSelection, input);

  if (errors?.length) {
    console.log("Error updating variants", errors);
  } else {
    console.log("Successfully updated");
    if (discountPercentage > discountThresholdAlert) {
      console.log(
        `Discount is higher than ${discountThresholdAlert}%, sending email...`
      );
      // email will be sent from the deployed server
    }
  }
}

export async function sendPriceDropAlert(
  productVariants: ProductVariant[],
  product: Product
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SENDER_EMAIL, // Your email
        pass: SENDER_APP_PASSWORD, // App password https://support.google.com/mail/answer/185833?hl=en-GB
      },
    });

    const productHTML = productVariants
      .map((variant) => {
        const imageUrl =
          variant.image?.url || product.featuredMedia.preview.image.url;
        const title =
          variant.title.toLowerCase() === "default title"
            ? product.title
            : variant.title;

        return (
          variant.compareAtPrice &&
          `
      <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 15px;">
        <h3>${title}</h3>
        <p><b>Old Price:</b> <del>$${variant.compareAtPrice}</del></p>
        <p><b>New Price:</b> <span style="color: green;">$${
          variant.price
        }</span> (-${findDiscountPercentage(
            variant.price,
            variant.compareAtPrice
          )}%)</p>
        ${
          imageUrl
            ? `<img src="${imageUrl}" width="200" style="border-radius: 5px;">`
            : ""
        }
      </div>
    `
        );
      })
      .join("");

    const mailOptions = {
      from: `Fei test Shopify Alerts`,
      to: RECEIVER_EMAIL,
      subject: "Price Drop Alert!",
      html: `
          <h2>Price Drop Alert!</h2>
          <p>Some products have had a price drop. Check them out:</p>
          ${productHTML}
          <p><a href="${SHOPIFY_STORE_URL}" style="color: blue;">Visit Store</a></p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent:", info.messageId);
  } catch (error) {
    console.error("Email Error:", error);
  }
}
