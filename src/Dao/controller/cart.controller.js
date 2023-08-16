import { CartService } from "../services/cart.service.js";
import { productService } from "../services/products.service.js";

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
      const cart = await CartService.getCartById(cid);
      const productsInCart = cart.products;

      const productsDetails = await productService.getProductById(productsInCart.map((product) => product.product));

      const productsToPurchase = [];
      const productsNotPurchased = [];

      for (const productInCart of productsInCart) {
        const productDetail = productsDetails.find((product) => product.id === productInCart.product);

        if (productDetail.stock >= productInCart.quantity) {
          productsToPurchase.push({
            productId: productInCart.product,
            quantity: productInCart.quantity,
            totalPrice: productDetail.price * productInCart.quantity,
          });
        } else {
          productsNotPurchased.push(productInCart.productId);
        }
      }

      if (productsToPurchase.length > 0) {
        const updatedProducts = await productService.purchaseProducts(productsToPurchase);
        const purchaseAmount = productsToPurchase.reduce((total, product) => total + product.totalPrice, 0);
        const purchaser = cart.userId;

        const ticket = await TicketService.createTicket(purchaseAmount, purchaser);
        await CartService.removeAllProductsFromCart(cid);

        res.status(200).json({ status: "success", payload: ticket, notPurchased: productsNotPurchased });
      } else {
        res.status(400).json({ error: "No products can be purchased", notPurchased: productsNotPurchased });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
