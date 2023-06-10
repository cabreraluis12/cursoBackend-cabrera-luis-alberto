import express from "express";
import { CartModel } from "../Dao/models/cart.models.js";
import { ProductModel } from "../Dao/models/products.models.js";
import mongoose from "mongoose";



let lastCartId = 0;

export const routerCarts = express.Router();

routerCarts.post("/", async (req, res) => {
    try {
        const cartId = generateCartId();
        const newCart = new CartModel({
            id: cartId,
            products: [],
        });

        await newCart.save();

        res.status(201).json({ 
            status: "success",
            msg: "Se ha creado un nuevo carrito con el id " + cartId,
            data: {cart: newCart} 
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

routerCarts.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await getCartById(cid);
        if (cart) {
            const productIds = cart.products.map((item) => item.product);
            const products = await getProductsByIds(productIds);
            res.status(200).json({ 
                status: "success",
                msg: "Se encontró el carrito con el id " + cid,
                data: {cart, products}
            });
        } else {
            res.status(404).json({ 
                status: "Error",
                msg: "El carrito con el id "+ cid +" no existe"
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

routerCarts.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
    const cart = await getCartById(cid);
    const product = await getProductById(pid);

    if (!product) {
        res.status(404).json({ 
            status: "Error",
            msg: "El producto con el id " + pid + " no existe"
        });
        return;
    }

    const existingProduct = cart.products.find(
        (item) => item.product === pid
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        const newCartItem = {
            product: pid,
            title: product.title,
            quantity: 1
        };
        
        cart.products.push(newCartItem);
    }

    await saveCart(cart);

    res.status(200).json({ 
        status: "Success",
        msg: "Se agregó el producto al carrito " + cid,
        data: {
            productId: pid,
            productTitle: product.title,
            cart
        }
    });
    } catch (error) {
        console.log("Error al procesar la solicitud:", error);
        res.status(404).json({ 
        status: "Error",
        msg: "El carrito con el id " + cid + " no existe"
    });
    }
});




function generateCartId() {
    lastCartId++;
    return lastCartId;
}

async function getCartById(cartId) {
    const cart = await CartModel.findOne({ id: cartId }).exec();
    return cart;
}

async function saveCart(cart) {
    await cart.save();
}

async function getProductsByIds(productIds) {
    const products = await ProductModel.find({ id: { $in: productIds } }).exec();
    return products;
}

async function getProductById(productId) {
    const product = await ProductModel.findOne({ id: productId }).exec();
    return product;
}
