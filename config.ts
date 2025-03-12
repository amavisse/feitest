import "dotenv/config";
import { cleanEnv, str, url } from "envalid";

const env = cleanEnv(process.env, {
  SHOPIFY_STORE_URL: url(),
  SHOPIFY_ADMIN_API_ACCESS_TOKEN: str(),
  MONGODB_URI: str({ devDefault: "" }),
  SERVER_URL: url(),
  SERVER_KEY: str(),
  SHOPIFY_WEBHOOK_SECRET: str(),
  SENDER_EMAIL: str(),
  SENDER_APP_PASSWORD: str(),
  RECEIVER_EMAIL: str(),
});

export const SHOPIFY_STORE_URL = env.SHOPIFY_STORE_URL;
export const SHOPIFY_ADMIN_API_ACCESS_TOKEN = env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
export const ADMIN_GRAPHQL_ENDPOINT = `${SHOPIFY_STORE_URL}/admin/api/2025-01/graphql.json`;
export const MONGODB_URI = env.MONGODB_URI;
export const SERVER_URL = env.SERVER_URL;
export const SERVER_KEY = env.SERVER_KEY;
export const SHOPIFY_WEBHOOK_SECRET = env.SHOPIFY_WEBHOOK_SECRET;
export const SENDER_EMAIL = env.SENDER_EMAIL;
export const SENDER_APP_PASSWORD = env.SENDER_APP_PASSWORD;
export const RECEIVER_EMAIL = env.RECEIVER_EMAIL;