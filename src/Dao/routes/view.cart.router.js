import express from "express";
import { CartService } from "../services/cart.service.js";

export const routerViewCart = express.Router();

routerViewCart.get("/:cid", async (req, res) => {
    try {
      const cartId = req.params.cid;
  
      const cart = await CartService.getCartById(cartId);

      const user = req.session.user;
  
      return res.render("cart", {
        cart,
        user: user,
        products: cart.products,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  });