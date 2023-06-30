import express from "express";
import { productManager } from "../productManager.js";

export const routerViewProducts = express.Router();

routerViewProducts.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    return res.render("home", { 
      products,
      user: req.session.user});
  } catch (error) {
    return res.status(500).send(error);
  }
});

