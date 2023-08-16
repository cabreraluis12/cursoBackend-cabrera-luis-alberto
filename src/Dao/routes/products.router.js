
import express from "express";
import { productController } from "../controller/products.controller.js";
import { checkAdmin,checkUser } from "../middlewares/auth.js";

export const routerProducts = express.Router();

routerProducts.get("/", productController.getAllProducts);
routerProducts.get("/:pid", productController.getProductById);
routerProducts.post("/", checkAdmin, productController.createProduct);
routerProducts.put("/:pid",checkAdmin, productController.updateProduct);
routerProducts.delete("/:pid",checkAdmin, productController.deleteProduct);