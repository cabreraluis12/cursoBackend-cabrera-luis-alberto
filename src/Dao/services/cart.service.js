import { cartModel } from "../models/Mongo/cart.model.mongo.js";
//import { cartModel } from "../models/Memory/Cart.model.memory.js";
import { ProductModel } from "../models/products.models.js";

export class CartService {
  static lastCartId = 0;

  static async createCart() {
    const newCart = await cartModel.createCart();

    return {
      status: "success",
      msg: `Se ha creado un nuevo carrito con el id ${newCart.id}`,
      data: { cart: newCart },
    };
  }

  static async getCartById(cartId) {
    const cart = await cartModel.findById(cartId);

    return cart;
  }

  static async clearCart(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  static async addProductToCart(cartId, productId) {
    const cart = await cartModel.findById(cartId);
    const product = await ProductModel.findOne({ id: productId }).exec();

    if (!product) {
      throw new Error(`El producto con el id ${productId} no existe`);
    }

    const existingProduct = cart.products.find((item) => item.product === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const newCartItem = {
        product: productId,
        title: product.title,
        quantity: 1,
        price: product.price
      };

      cart.products.push(newCartItem);
    }

    await cart.save();

    return {
      status: "Success",
      msg: `Se agregó el producto al carrito ${cartId}`,
      data: {
        productId,
        productTitle: product.title,
        cart,
      },
    };
  }

  static async removeProductFromCart(cartId, productId) {
    const cart = await cartModel.findById(cartId);

    const productIndex = cart.products.findIndex((item) => item.product === productId);

    if (productIndex === -1) {
      throw new Error(`El producto con el ID ${productId} no existe en el carrito ${cartId}`);
    }
    
    cart.products.splice(productIndex, 1);
    await cart.save();

    return cart;
  }

  static async updateCartProducts(cartId, updatedProducts) {
    const cart = await cartModel.findById(cartId);

    cart.products = updatedProducts;
    
    await cart.save();

    return cart;
  }

  static async updateProductQuantity(cartId, productId, newQuantity) {
    const cart = await cartModel.findById(cartId);

    const product = cart.products.find((item) => item.product === productId);

    if (!product) {
      throw new Error(`El producto con el ID ${productId} no existe en el carrito ${cartId}`);
    }

    product.quantity = newQuantity;
    
    await cart.save();

    return cart;
  }

  static async removeAllProductsFromCart(cartId) {
    const cart = await cartModel.findById(cartId);

    cart.products = [];
    
    await cart.save();

    return cart;
  }

  static async checkProductAvailability(cart) {
    const unavailableProducts = [];

    for (const item of cart.products) {
      const product = await ProductModel.findOne({ id: item.product }).exec();
      if (!product || product.stock < item.quantity) {
        unavailableProducts.push(item.product);
      }
    }

    return unavailableProducts;
  }

  static calculateTotalAmount(cart) {
    let totalAmount = 0;

    for (const item of cart.products) {
      totalAmount += item.quantity * item.price;
    }

    return totalAmount;
  }

  static async purchaseCart(cart, totalAmount) {
    for (const cartItem of cart.products) {
      const product = await ProductModel.findOne({ id: cartItem.product }).exec();
      if (!product) {
        throw new Error(`El producto con el id ${cartItem.product} no existe`);
      }
  
      if (product.stock < cartItem.quantity) {
        throw new Error(`No hay suficiente stock para el producto con el id ${cartItem.product}`);
      }
  
      product.stock -= cartItem.quantity;
      await product.save();
    }
  }

  static generateCartId() {
    CartService.lastCartId++;
    return CartService.lastCartId;
  }
}