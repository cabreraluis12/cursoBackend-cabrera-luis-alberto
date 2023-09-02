import { CartService } from "../services/cart.service.js";
import { TicketService } from "../services/ticket.service.js";
import CustomError from "../services/errors/custom-error.js";
import EErrors from "../services/errors/enums.js";
import { developmentLogger, productionLogger } from "../../config/logger.js";



export class CartController {
  static async createCart(req, res, next) {
    try {
      const response = await CartService.createCart();
      res.status(201).json(response);
    } catch (error) {
      next(new CustomError({
        name: EErrors.INTERNAL_SERVER_ERROR,
        cause: "Error interno del servidor",
      }));
    }
  }

  static async getCartById(req, res, next) {
    const { cid } = req.params;
    try {
      const cart = await CartService.getCartById(cid);

      if (!cart) {
        throw CustomError.createError({
          name: EErrors.CART_NOT_FOUND,
          cause: `El carrito con el id ${cid} no existe`,
          code: 404
        });
      }

      res.status(200).json({
        status: "success",
        msg: `Se encontró el carrito con el id ${cid}`,
        data: { cart },
      });
    } catch (error) {
      next(error);
    }
  }

  static async addProductToCart(req, res, next) {
    const { cid, pid } = req.params;
    try {
      const result = await CartService.addProductToCart(cid, pid);
      res.status(200).json(result);
    } catch (error) {
      next(new CustomError({
        name: EErrors.INTERNAL_SERVER_ERROR,
        cause: "Error interno del servidor",
      }));
    }
  }

  static async removeProductFromCart(req, res) {
    const { cid, pid } = req.params;
    try {
      const result = await CartService.removeProductFromCart(cid, pid);
      developmentLogger.error(`Error en removeProductFromCart: ${error.message}`);
      productionLogger.error(`Error en removeProductFromCart: ${error.message}`);

      res.status(500).json({ error: "Error interno del servidor" });
    } catch (error) {
      next(error);
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

  static async purchaseCart(req, res, next) {
    const { cid } = req.params;

    try {
      const cart = await CartService.getCartById(cid);

      if (!cart) {
        throw new CustomError({
          name: EErrors.CART_NOT_FOUND,
          cause: `El carrito con el id ${cid} no existe`,
        });
      }

      const unavailableProducts = await CartService.checkProductAvailability(cart);

      if (unavailableProducts.length > 0) {
        throw new CustomError({
          name: EErrors.PRODUCT_UNAVAILABLE,
          cause: "Productos no disponibles",
          unavailableProducts,
        });
      }

      const totalAmount = CartService.calculateTotalAmount(cart);

      if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new CustomError({
          name: EErrors.INVALID_TOTAL_AMOUNT,
          cause: "Monto total inválido",
        });
      }

      await CartService.purchaseCart(cart, totalAmount);

      const purchaserEmail = req.session.user.email;
      if (!purchaserEmail) {
        throw new CustomError({
          name: EErrors.UNAUTHENTICATED_USER,
          cause: "Usuario no autenticado",
        });
      }

      const ticket = await TicketService.generateTicket(cart, totalAmount, purchaserEmail);

      return res.status(200).json({ message: "Compra exitosa", cart, ticket });

    } catch (error) {
      next(error);
    }
  }
}