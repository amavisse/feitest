import { discountThresholdAlert } from "../task3";
import {
  Connection,
  Extensions,
  Money,
  Order,
  Product,
  ShopifyOrder,
  ShopifyProduct,
} from "./shopify/types";

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

export const reshapeProduct = (shopifyProduct: ShopifyProduct): Product => ({
  ...shopifyProduct,
  variants: removeEdgesAndNodes(shopifyProduct.variants),
});

export const reshapeProducts = (shopifyProducts: ShopifyProduct[]): Product[] =>
  shopifyProducts.map((shopifyProduct) => reshapeProduct(shopifyProduct));

export const compareDates = (date1: string, date2: string): number =>
  new Date(date1).getTime() - new Date(date2).getTime();

export const isDiscountHigherThanThreshold = (
  price: Money,
  compareAtPrice: Money,
  threshold = discountThresholdAlert
): boolean => 1 - Number(price) / Number(compareAtPrice) > threshold / 100;

export const findDiscountPercentage = (
  price: Money,
  compareAtPrice: Money
): string => ((1 - Number(price) / Number(compareAtPrice)) * 100).toFixed(2);
