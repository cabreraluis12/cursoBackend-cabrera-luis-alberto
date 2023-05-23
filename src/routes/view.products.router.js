import express from "express";
import { productManager } from "../productManager.js";

export const routerViewProducts = express.Router();
const products = productManager.getProducts();

routerViewProducts.get("/",(req, res) => {
    return res.render("home",  {products});
});

