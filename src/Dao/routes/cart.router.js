import express from "express";
import { CartController } from "../controller/cart.controller.js";

export const routerCarts = express.Router();

routerCarts.post("/", CartController.createCart);
routerCarts.get("/:cid", CartController.getCartById);
routerCarts.post("/:cid/product/:pid", CartController.addProductToCart);
routerCarts.delete("/:cid/product/:pid", CartController.removeProductFromCart);
routerCarts.put("/:cid", CartController.updateCartProducts);
routerCarts.put("/:cid/product/:pid", CartController.updateProductQuantity);
routerCarts.delete("/:cid", CartController.removeAllProductsFromCart);

export default routerCarts;