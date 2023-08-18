import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: { type: Number, alias:"_id"},
  products: [
    {
      product: { type: String, required: true },
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number},
    }
  ]
});

export const CartModel = mongoose.model("Cart", cartSchema);