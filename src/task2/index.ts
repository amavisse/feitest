import { select } from "@inquirer/prompts";
import { getAllProductsId, getOrders } from "../lib/shopify";
import { Order } from "../lib/shopify/types";

export async function getProductSelection(): Promise<string> {
  const productsId = await getAllProductsId();
  const productChoice = await select({
    message: "Select a product",
    choices: productsId.map((product) => ({
      name: product.title,
      value: product.id,
    })),
  });
  return productChoice;
}

export async function getLastXDaysOrders(
  days: number,
  filterByProductId?: string
): Promise<Order[]> {
  const searchQuery = `created_at:>=${new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString()}`;

  const orders = await getOrders(undefined, [], searchQuery);

  if (filterByProductId) {
    // only return orders that contain specific product id
    return orders.filter((order) =>
      order.lineItems.some((item) => item.product?.id === filterByProductId)
    );
  }

  return orders;
}

export default async function runTask2() {
  // get input from inquirer
  const productSelection = await getProductSelection();
  console.log(`Selected id: ${productSelection}`);

  // get orders from last 30 days, that contains specific product
  const orders = await getLastXDaysOrders(30, productSelection);
  console.log(`Found ${orders.length} orders`);

  if (orders.length) console.log(JSON.stringify(orders, null, 2));
}
