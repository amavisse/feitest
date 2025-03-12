import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { SERVER_KEY, SHOPIFY_WEBHOOK_SECRET } from "../../../config";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== SERVER_KEY)
    return res.status(403).json({ message: "Access Denied" });

  next();
}

export const verifyShopifyWebhook = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const hmacHeader = req.headers["x-shopify-hmac-sha256"] as string;
  if (!hmacHeader) {
    console.error("Missing HMAC signature.");
    return res.status(401).send("Unauthorized");
  }

  const generatedHmac = crypto
    .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("base64");

  if (
    !crypto.timingSafeEqual(Buffer.from(generatedHmac), Buffer.from(hmacHeader))
  ) {
    console.error("Invalid Shopify webhook signature.");
    return res.status(401).send("Unauthorized");
  }

  next();
};
