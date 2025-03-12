import {
  ADMIN_GRAPHQL_ENDPOINT,
  SHOPIFY_ADMIN_API_ACCESS_TOKEN,
} from "../../../config";
import {
  handleRateLimiting,
  removeEdgesAndNodes,
  reshapeOrders,
  reshapeProduct,
  reshapeProducts,
} from "../utils";
import { productVariantsBulkUpdateMutation } from "./graphql-admin/mutations";
import {
  getOrdersQuery,
  getProductByIdQuery,
  getProductsIdQuery,
  getProductsQuery,
} from "./graphql-admin/queries";
import {
  ExtractVariables,
  MinimalProduct,
  Order,
  Product,
  ProductVariantsBulkInput,
  ShopifyOrdersOperation,
  ShopifyProductOperation,
  ShopifyProductsIdOperation,
  ShopifyProductsOperation,
  ShopifyproductVariantsBulkUpdateOperation,
} from "./types";

export async function shopifyFetch<T>({
  query,
  variables,
  endpoint = ADMIN_GRAPHQL_ENDPOINT,
}: {
  query: string;
  variables?: ExtractVariables<T>;
  endpoint?: string;
}): Promise<T | never> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (result.errors) throw result.errors?.[0];

    return result;
  } catch (error) {
    console.error("Shopify fetch error: ", error);
    throw error;
  }
}

export async function getAllProductsId(
  cursor?: string,
  productsIdAccumulator: MinimalProduct[] = []
): Promise<MinimalProduct[]> {
  const variables = { first: 250, after: cursor };
  const result = await shopifyFetch<ShopifyProductsIdOperation>({
    query: getProductsIdQuery,
    variables,
  });

  const newProductsId = removeEdgesAndNodes(result.data.products);

  productsIdAccumulator.push(...newProductsId);

  if (result.data.products.pageInfo.hasNextPage) {
    await handleRateLimiting(result.extensions);

    return getAllProductsId(
      result.data.products.pageInfo.endCursor,
      productsIdAccumulator
    );
  }

  return productsIdAccumulator;
}

export async function getOrders(
  cursor?: string,
  ordersAccumulator: Order[] = [],
  searchQuery?: string
): Promise<Order[]> {
  const variables = { first: 250, query: searchQuery, after: cursor };
  const result = await shopifyFetch<ShopifyOrdersOperation>({
    query: getOrdersQuery,
    variables,
  });

  const newOrders = reshapeOrders(removeEdgesAndNodes(result.data.orders));

  ordersAccumulator.push(...newOrders);

  if (result.data.orders.pageInfo.hasNextPage) {
    await handleRateLimiting(result.extensions);

    return getOrders(
      result.data.orders.pageInfo.endCursor,
      ordersAccumulator,
      searchQuery
    );
  }

  return ordersAccumulator;
}

export async function getAllProducts(
  cursor?: string,
  productsAccumulator: Product[] = []
): Promise<Product[]> {
  const variables = { first: 250, after: cursor };
  const result = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables,
  });

  const newProductsId = reshapeProducts(
    removeEdgesAndNodes(result.data.products)
  );

  productsAccumulator.push(...newProductsId);

  if (result.data.products.pageInfo.hasNextPage) {
    await handleRateLimiting(result.extensions);

    return getAllProducts(
      result.data.products.pageInfo.endCursor,
      productsAccumulator
    );
  }

  return productsAccumulator;
}

export async function getProductById(id: string): Promise<Product> {
  const result = await shopifyFetch<ShopifyProductOperation>({
    query: getProductByIdQuery,
    variables: { id },
  });

  return reshapeProduct(result.data.product);
}

export async function updateProductVariants(
  productId: string,
  productVariantsBulkInput: ProductVariantsBulkInput[]
) {
  if (!productVariantsBulkInput.length) return "No variants to update";
  const result = await shopifyFetch<ShopifyproductVariantsBulkUpdateOperation>({
    query: productVariantsBulkUpdateMutation,
    variables: { productId, variants: productVariantsBulkInput },
  });

  return result.userErrors;
}
