import { test, expect } from "playwright/test";
import { delay } from "../src/lib/utils";

const productWithVariantOnSale =
  "https://fei-alumiermd-test.myshopify.com/products/the-complete-snowboard";

test("product variant on sale should have 'On Sale' badge", async ({
  page,
}) => {
  await page.goto(productWithVariantOnSale);
  await delay(2000);

  // enter password if redirected to password page
  if (page.url().includes("password")) {
    await page
      .getByRole("textbox", { name: "Enter store password" })
      .fill("alumier");
    await page.getByRole("button", { name: "Enter" }).click();
    await page.goto(productWithVariantOnSale);
  }

  // expect variant selector
  expect(await page.locator("variant-selects").isVisible()).toBeTruthy();

  // check each variant
  for (const variant of await page.locator("variant-selects label").all()) {
    await variant.click();
    if (await page.locator(".product .price-item--sale").isVisible()) {
      // expect "On Sale" badge if discounted
      expect(
        await page.locator(".product .badge:has-text('On Sale')").isVisible()
      ).toBeTruthy();
    } else {
      // expect no "On Sale" badge if not discounted
      expect(
        await page.locator(".product .badge:has-text('On Sale')").isVisible()
      ).toBeFalsy();
    }
  }
});
