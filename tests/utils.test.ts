import { describe, it, expect } from "vitest";

import { Money } from "../src/lib/shopify/types";
import {
  delay,
  removeEdgesAndNodes,
  reshapeOrders,
  reshapeProduct,
  reshapeProducts,
  compareDates,
  isDiscountHigherThanThreshold,
  findDiscountPercentage,
} from "../src/lib/utils";
import {
  ordersConnection,
  reshapedTestOrders,
  reshapedTestProducts,
  testOrders,
  testProducts,
} from "./test-variables";

describe("utils", () => {
  it("delay should wait for specified time", async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });

  it("removeEdgesAndNodes should extract nodes from order connection", () => {
    expect(removeEdgesAndNodes(ordersConnection)).toEqual(testOrders);
  });

  it("reshapeOrders should reshape Shopify orders", () => {
    expect(reshapeOrders(testOrders)).toEqual(reshapedTestOrders);
  });

  it("reshapeProduct should reshape Shopify product", () => {
    expect(reshapeProduct(testProducts[0])).toEqual(reshapedTestProducts[0]);
  });

  it("reshapeProducts should reshape Shopify products", () => {
    expect(reshapeProducts(testProducts)).toEqual(reshapedTestProducts);
  });

  it("compareDates should compare two dates", () => {
    const date1 = "2023-01-01";
    const date2 = "2023-01-02";
    expect(compareDates(date1, date2)).toBeLessThan(0);
  });

  it("isDiscountHigherThanThreshold should return true if discount is higher than threshold", () => {
    const price: Money = "50";
    const compareAtPrice: Money = "100";
    expect(isDiscountHigherThanThreshold(price, compareAtPrice)).toBe(true);
  });

  it("findDiscountPercentage should return correct discount percentage", () => {
    const price: Money = "50";
    const compareAtPrice: Money = "100";
    expect(findDiscountPercentage(price, compareAtPrice)).toBe("50.00");
  });
});
