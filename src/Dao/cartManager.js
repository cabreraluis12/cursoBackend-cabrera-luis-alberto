import { CartModel } from "../Dao/models/cart.models.js";
import { ProductModel } from "../Dao/models/products.models.js";

export class CartManager {
  static lastCartId = 0;

  static async createCart() {
    try {
      const cartId = CartManager.generateCartId();
      const newCart = new CartModel({
        id: cartId,
        products: [],
      });

      await newCart.save();

      return {
        status: "success",
        msg: `Se ha creado un nuevo carrito con el id ${cartId}`,
        data: { cart: newCart },
      };
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  static async getCartById(cartId) {
    try {
      const cart = await CartModel.findOne({ id: cartId }).exec();
      return cart;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  static async saveCart(cart) {
    try {
      await cart.save();
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  static async getProductsByIds(productIds) {
    try {
      const products = await ProductModel.find({ id: { $in: productIds } }).exec();
      return products;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  static async getProductById(productId) {
    try {
      const product = await ProductModel.findOne({ id: productId }).exec();
      return product;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  static generateCartId() {
    CartManager.lastCartId++;
    return CartManager.lastCartId;
  }
}
