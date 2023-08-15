import express from "express";
import { CartController } from "../controller/cart.controller.js";

export const routerViewCart = express.Router();

routerViewCart.get("/:cid", CartController.getCartById);