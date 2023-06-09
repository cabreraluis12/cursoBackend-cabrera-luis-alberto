import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: Number,
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }]
});

export const CartModel = mongoose.model('Cart', cartSchema);