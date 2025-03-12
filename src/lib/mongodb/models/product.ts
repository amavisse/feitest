import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    handle: { type: String, required: true },
    updatedAt: { type: String, required: true },
    variants: [
      {
        id: { type: String, required: true },
        title: { type: String },
        image: { url: { type: String } },
        updatedAt: { type: String, required: true },
        price: { type: String, required: true },
        compareAtPrice: { type: String },
        contextualPricing: {
          compareAtPrice: {
            amount: { type: String },
            currencyCode: { type: String },
          },
          price: {
            amount: { type: String },
            currencyCode: { type: String },
          },
        },
      },
    ],
    featuredMedia: {
      preview: {
        image: { url: { type: String } },
      },
    },
  },
  { collection: "products" }
);

const Product = model("Product", productSchema);

export default Product;
