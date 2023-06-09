import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  status: String,
  thumbnail: [String],
  code: String,
  stock: Number,
  category: String
});

export const ProductModel = mongoose.model('Product', productSchema);