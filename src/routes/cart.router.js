import express from "express";
import { CartModel } from "../Dao/models/cart.models.js";
import { ProductModel } from "../Dao/models/products.models.js";
import { CartManager } from "../Dao/cartManager.js";

export const routerCarts = express.Router();

routerCarts.post("/", async (req, res) => {
  try {
    const response = await CartManager.createCart();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

routerCarts.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await CartManager.getCartById(cid);
    if (cart) {
      const productIds = cart.products.map((item) => item.product);
      const products = await CartManager.getProductsByIds(productIds);
      res.status(200).json({
        status: "success",
        msg: `Se encontró el carrito con el id ${cid}`,
        data: { cart, products },
      });
    } else {
      res.status(404).json({
        status: "Error",
        msg: `El carrito con el id ${cid} no existe`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

routerCarts.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await CartManager.getCartById(cid);
    const product = await CartManager.getProductById(pid);

    if (!product) {
      res.status(404).json({
        status: "Error",
        msg: `El producto con el id ${pid} no existe`,
      });
      return;
    }

    const existingProduct = cart.products.find((item) => item.product === pid);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const newCartItem = {
        product: pid,
        title: product.title,
        quantity: 1,
      };

      cart.products.push(newCartItem);
    }

    await CartManager.saveCart(cart);

    res.status(200).json({
      status: "Success",
      msg: `Se agregó el producto al carrito ${cid}`,
      data: {
        productId: pid,
        productTitle: product.title,
        cart,
      },
    });
  } catch (error) {
    console.log("Error al procesar la solicitud:", error);
    res.status(404).json({
      status: "Error",
      msg: `El carrito con el id ${cid} no existe`,
    });
  }
});

routerCarts.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await CartManager.getCartById(cid);

    if (!cart) {
      res.status(404).json({
        status: "Error",
        msg: `El carrito con el id ${cid} no existe`,
      });
      return;
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product === pid
    );

    if (productIndex === -1) {
      res.status(404).json({
        status: "Error",
        msg: `El producto con el id ${pid} no existe en el carrito ${cid}`,
      });
      return;
    }

    cart.products.splice(productIndex, 1);

    await CartManager.saveCart(cart);

    res.status(200).json({
      status: "Success",
      msg: `Se eliminó el producto del carrito ${cid}`,
      data: {
        productId: pid,
        cart,
      },
    });
  } catch (error) {
    console.log("Error al procesar la solicitud:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

routerCarts.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await CartManager.getCartById(cid);

    if (!cart) {
      res.status(404).json({
        status: "Error",
        msg: `El carrito con el id ${cid} no existe`,
      });
      return;
    }

    cart.products = products;

    await CartManager.saveCart(cart);

    res.status(200).json({
      status: "Success",
      msg: `Se actualizó el carrito ${cid}`,
      data: {
        cart,
      },
    });
  } catch (error) {
    console.log("Error al procesar la solicitud:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

routerCarts.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await CartManager.getCartById(cid);

    if (!cart) {
      res.status(404).json({
        status: "Error",
        msg: `El carrito con el id ${cid} no existe`,
      });
      return;
    }

    const product = cart.products.find((item) => item.product === pid);

    if (!product) {
      res.status(404).json({
        status: "Error",
        msg: `El producto con el id ${pid} no existe en el carrito ${cid}`,
      });
      return;
    }

    product.quantity = quantity;

    await CartManager.saveCart(cart);

    res.status(200).json({
      status: "Success",
      msg: `Se actualizó la cantidad del producto en el carrito ${cid}`,
      data: {
        productId: pid,
        cart,
      },
    });
  } catch (error) {
    console.log("Error al procesar la solicitud:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

routerCarts.delete("/:cid", async (req, res) => {
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

    cart.products = [];

    await CartManager.saveCart(cart);

    res.status(200).json({
      status: "Success",
      msg: `Se eliminaron todos los productos del carrito ${cid}`,
      data: {
        cart,
      },
    });
  } catch (error) {
    console.log("Error al procesar la solicitud:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
