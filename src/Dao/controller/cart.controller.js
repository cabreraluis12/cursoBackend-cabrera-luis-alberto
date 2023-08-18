import { CartService } from "../services/cart.service.js";
import { TicketService } from "../services/ticket.service.js";

export class CartController {
  static async createCart(req, res) {
    try {
      const response = await CartService.createCart();
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async getCartById(req, res) {
    const { cid } = req.params;
    try {
      const cart = await CartService.getCartById(cid);

      if (cart) {
        res.status(200).json({
          status: "success",
          msg: `Se encontró el carrito con el id ${cid}`,
          data: { cart },
        });
      } else {
        res.status(404).json({
          status: "Error",
          msg: `El carrito con el id ${cid} no existe`,
        });
      }
    } catch (error) {
      console.error("Error en getCartById:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async addProductToCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const result = await CartService.addProductToCart(cid, pid);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async removeProductFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const result = await CartService.removeProductFromCart(cid, pid);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error en removeProductFromCart:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async updateCartProducts(req, res) {
    const { cid } = req.params;
    const { products } = req.body;
    try {
      const result = await CartService.updateCartProducts(cid, products);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async updateProductQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const result = await CartService.updateProductQuantity(cid, pid, quantity);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async removeAllProductsFromCart(req, res) {
    const { cid } = req.params;
    try {
      const result = await CartService.removeAllProductsFromCart(cid);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async purchaseCart(req, res) {
    const { cid } = req.params;
  
    try {
      console.log("Starting purchase process for cart:", cid);
  
      const cart = await CartService.getCartById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: "No se encontró el carrito" });
      }
  
      console.log("Cart retrieved:", cart);
  
      const unavailableProducts = await CartService.checkProductAvailability(cart);
  
      if (unavailableProducts.length > 0) {
        console.log("Unavailability detected. Unavailable products:", unavailableProducts);
        return res.status(400).json({ message: "Productos no disponibles", unavailableProducts });
      }
  
      const totalAmount = CartService.calculateTotalAmount(cart);
  
      if (isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ error: "Monto total inválido" });
      }
  
      console.log("Total amount calculated:", totalAmount);
  
      await CartService.purchaseCart(cart, totalAmount);
      console.log("Cart purchased successfully.");
  
      const purchaserEmail = req.session.user.email;
      if (!purchaserEmail) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }
  
      const ticket = await TicketService.generateTicket(cart, totalAmount, purchaserEmail);
  
      console.log("Ticket generated:", ticket);
  
      return res.status(200).json({ message: "Compra exitosa", cart, ticket });
  
    } catch (error) {
      console.error("Error en purchaseCart:", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
