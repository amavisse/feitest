import {
  ADMIN_GRAPHQL_ENDPOINT,
  SHOPIFY_ADMIN_API_ACCESS_TOKEN,
} from "../../../config";
import {
  handleRateLimiting,
  removeEdgesAndNodes,
  reshapeOrders,
} from "../utils";
import { getOrdersQuery, getProductsIdQuery } from "./graphql-admin/queries";
import {
  ExtractVariables,
  MinimalProduct,
  Order,
  ShopifyOrdersOperation,
  ShopifyProductsIdOperation,
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
