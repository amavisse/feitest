import 'dotenv/config'
import { cleanEnv, str, url } from "envalid";

const env = cleanEnv(process.env, {
  SHOPIFY_STORE_URL: url(),
  SHOPIFY_ADMIN_API_ACCESS_TOKEN: str(),
});

export const SHOPIFY_STORE_URL = env.SHOPIFY_STORE_URL;
export const SHOPIFY_ADMIN_API_ACCESS_TOKEN = env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
export const ADMIN_GRAPHQL_ENDPOINT = `${SHOPIFY_STORE_URL}/admin/api/2025-01/graphql.json`;
