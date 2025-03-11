import { Connection, Extensions, Order, ShopifyOrder } from "./shopify/types";

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const removeEdgesAndNodes = <T>(connection: Connection<T>): T[] =>
  connection.edges.map((edge) => edge.node);

export async function handleRateLimiting(extensions: Extensions) {
  const costInfo = extensions.cost;

  console.log(
    `Query Cost: ${costInfo.actualQueryCost}/${costInfo.throttleStatus.maximumAvailable}`
  );
  console.log(
    `Remaining: ${costInfo.throttleStatus.currentlyAvailable} points`
  );

  if (costInfo.throttleStatus.currentlyAvailable < 200) {
    const waitTime = 1000 * 5;
    console.warn(
      `⚠️ Low API points. Waiting ${waitTime}ms before next request...`
    );
    await delay(waitTime);
  }
}

export const reshapeOrders = (shopifyOrders: ShopifyOrder[]): Order[] =>
  shopifyOrders.map((shopifyOrder) => ({
    ...shopifyOrder,
    lineItems: removeEdgesAndNodes(shopifyOrder.lineItems),
  }));
