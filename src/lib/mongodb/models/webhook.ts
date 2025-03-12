import mongoose from "mongoose";

const { Schema, model } = mongoose;

const webhookSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
  },
  { collection: "webhooks" }
);

const Webhook = model("Webhook", webhookSchema);

export default Webhook;
