import { CartModel } from "../cart.models.js";
export class cartModel {
    static async createCart() {
      try {
        const cartId = this.generateCartId();
        const newCart = new CartModel({
          id: cartId,
          products: [],
        });
  
        await newCart.save();
  
        return newCart;
      } catch (error) {
        throw new Error("Error interno del servidor");
      }
    }
  
    static async findById(cartId) {
      try {
        const cart = await CartModel.findOne({ id: cartId }).exec();
  
        if (!cart) {
          throw new Error(`El carrito con el ID ${cartId} no existe`);
        }
  
        return cart;
      } catch (error) {
        console.error("Error en findById:", error.message);
        throw new Error(`Error al obtener el carrito: ${error.message}`);
      }
    }
  
    static generateCartId() {
      cartModel.lastCartId++;
      return cartModel.lastCartId;
    }
  }
  