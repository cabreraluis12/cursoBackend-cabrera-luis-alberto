import express from "express";
import { ProductModel } from "../Dao/models/products.models.js";

export const routerRealTimeProducts = express.Router();

export const initRealTimeProducts = (socketServer) => {
  routerRealTimeProducts.get("/", async (req, res) => {
    try {
      const products = await ProductModel.find().exec();
      res.render("realTimeProducts", { products });
    } catch (error) {
      res.status(500).send("Error retrieving products");
    }
  });

  socketServer.on("connection", (socket) => {
    console.log("A user connected");

    // Emitir productos al cliente al conectar
    ProductModel.find().exec()
      .then((products) => {
        socket.emit("products", products);
      })
      .catch((error) => {
        console.error("Error retrieving products:", error);
      });

    socket.on("createProduct", async (product) => {
      try {
        const createdProduct = await ProductModel.create(product);
        socketServer.emit("products", [createdProduct]);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    });

    socket.on("deleteProduct", async (productId) => {
      try {
        const deletedProduct = await ProductModel.findByIdAndDelete(productId).exec();
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