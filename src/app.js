import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { routerCarts } from "./routes/cart.router.js";
import { routerProducts } from "./routes/products.router.js";
import { routerRealTimeProducts } from "./routes/realTime.products.router.js";
import { routerViewProducts } from "./routes/view.products.router.js";
import { __dirname } from "./utils.js";
import { initRealTimeProducts } from "./routes/realTime.products.router.js";
import { connectMongo } from "./utils.js";
import { MessageModel } from "./Dao/models/message.model.js";


const app = express();
const port = 8080;

connectMongo();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", routerProducts);
app.use("/view/products", routerViewProducts);
app.use("/realtimeproducts", routerRealTimeProducts);
app.use("/api/carts", routerCarts);

app.get("/chat", async (req, res) => {
  try {
    const messages = await MessageModel.find().exec();
    res.render("chat", { messages });
  } catch (error) {
    res.status(500).send("Error retrieving messages");
  }
});


const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export const socketServer = new Server(httpServer);

initRealTimeProducts(socketServer);

socketServer.on("connection", (socket) => {
  console.log("A user connected");

  // Emitir mensajes al cliente al conectar
  MessageModel.find().exec()
    .then((messages) => {
      socket.emit("messages", messages);
    })
    .catch((error) => {
      console.error("Error retrieving messages:", error);
    });

  socket.on("newMessage", async (message) => {
    try {
      const createdMessage = await MessageModel.create(message);
      socketServer.emit("messages", [createdMessage]);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});