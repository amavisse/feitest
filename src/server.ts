import express from "express";
import {
  actionsWithWebhook,
  findProductById,
  findProductByIdAndReplace,
  insertManyProducts,
  insertOneWebhook,
} from "./routes";
import mongoose from "mongoose";
import { MONGODB_URI } from "../config";
import {
  authenticateToken,
  verifyShopifyWebhook,
} from "./lib/mongodb/auth-middleware";

const uri = MONGODB_URI;
mongoose
  .connect(uri)
  .then(() =>
    console.log(
      "Connected to MongoDB database " + mongoose?.connection?.db?.databaseName
    )
  )
  .catch((err) => console.log(err));

const app = express();
const port = 3000;

// Middleware to parse raw request body
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.post(
  "/",
  (req, res, next) => {
    verifyShopifyWebhook(req, res, next);
  },
  async (req, res) => {
    await actionsWithWebhook(req, res);
  }
);

app.post(
  "/webhook/add/:id",
  (req, res, next) => {
    authenticateToken(req, res, next);
  },
  async (req, res) => {
    await insertOneWebhook(req, res);
  }
);

app.get("/products/:id", async (req, res) => {
  await findProductById(req, res);
});

app.put(
  "/products/update/:id",
  (req, res, next) => {
    authenticateToken(req, res, next);
  },
  async (req, res) => {
    await findProductByIdAndReplace(req, res);
  }
);

app.post(
  "/products/bulk-add",
  (req, res, next) => {
    authenticateToken(req, res, next);
  },
  async (req, res) => {
    await insertManyProducts(req, res);
  }
);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
