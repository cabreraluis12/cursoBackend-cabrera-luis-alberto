
import express from "express";
import { productController } from "../controller/products.controller.js";

export const routerProducts = express.Router();

routerProducts.get("/", productController.getAllProducts);
routerProducts.get("/:pid", productController.getProductById);
routerProducts.post("/", productController.createProduct);
routerProducts.put("/:pid", productController.updateProduct);
routerProducts.delete("/:pid", productController.deleteProduct);