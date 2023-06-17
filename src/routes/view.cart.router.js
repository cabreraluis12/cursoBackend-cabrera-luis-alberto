import express from "express";
import { CartManager } from "../Dao/cartManager.js";

export const routerViewCart = express.Router();

routerViewCart.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await CartManager.getCartById(cid);
  
      if (!cart) {
        res.status(404).json({
          status: "Error",
          msg: `El carrito con el id ${cid} no existe`,
        });
        return;
      }
  
      const productIds = cart.products.map((item) => item.product);
      const products = await CartManager.getProductsByIds(productIds);
  
      res.status(200).json({
        status: "Success",
        msg: `Se encontró el carrito con el id ${cid}`,
        data: {
          cart,
          products,
        },
      });
    } catch (error) {
      console.log("Error al procesar la solicitud:", error);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  });
  