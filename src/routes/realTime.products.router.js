import express from "express";
import { productManager } from "../productManager.js";

export const routerRealTimeProducts = express.Router();
const products = productManager.getProducts();

export const initRealTimeProducts = (socketServer) => {
  routerRealTimeProducts.get("/", (req, res) => {
    return res.render("realTimeProducts", { products });
  });


  socketServer.on("connection", (socket) => {
    console.log("A user connected");

    socket.emit("products", products);


    socket.on("createProduct", (product) => {
      products.push(product);

      socketServer.emit("products", products);
    });

    socket.on("deleteProduct", (productId) => {

      const index = products.findIndex((product) => product.id === productId);
      if (index !== -1) {
        products.splice(index, 1);

        socketServer.emit("products", products);

        console.log("Updated products list:", products);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};