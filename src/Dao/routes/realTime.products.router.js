import express from "express";
import { productService } from "../services/products.service.js"; 

export const routerRealTimeProducts = express.Router();

export const initRealTimeProducts = (socketServer) => {
  routerRealTimeProducts.get("/", async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res.status(500).send("Error retrieving products");
    }
  });

  socketServer.on("connection", (socket) => {
    console.log("A user connected");

    // Emitir productos al cliente al conectar
    productService.getAllProducts()
      .then((products) => {
        socket.emit("products", products);
      })
      .catch((error) => {
        console.error("Error retrieving products:", error);
      });

    socket.on("createProduct", async (product) => {
      try {
        const createdProduct = await productService.addProduct(product);
        socketServer.emit("products", [createdProduct]);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    });

    socket.on("deleteProduct", async (productId) => {
      try {
        const deletedProduct = await productService.deleteProduct(productId);
        if (deletedProduct) {
          socketServer.emit("products", [deletedProduct]);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};