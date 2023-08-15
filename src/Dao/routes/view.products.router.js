import express from "express";
import { productService } from "../services/products.service.js";

export const routerViewProducts = express.Router();

routerViewProducts.get("/", async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    return res.render("home", { 
      products,
      user: req.session.user
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});
