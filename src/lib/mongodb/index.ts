import { SERVER_KEY, SERVER_URL } from "../../../config";
import { getAllProducts } from "../shopify";
import { Product } from "../shopify/types";

export async function dbFetch<T>(
  endpointPath: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: any
): Promise<T | void> {
  try {
    const response = await fetch(`${SERVER_URL}${endpointPath}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SERVER_KEY,
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}
export async function fetchProduct(id: string): Promise<Product | null> {
  const product = await dbFetch<Product>(`/products/${id}`);
  if (!product) return null;
  return product;
}

export async function updateProduct(id: string, product: Product) {
  const response = await dbFetch(`/products/update/${id}`, "PUT", product);
  return response;
}

export async function importAllProducts() {
  try {
    const products = await getAllProducts();
    const response = await dbFetch("/products/bulk-add", "POST", products);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

export async function tryAddingWebhook(eventId: string) {
  const response = await dbFetch<{
    message?: string;
    error?: any;
  }>(`/webhook/add/${eventId}`, "POST");
  return response?.error ? 201 : 500;
}

