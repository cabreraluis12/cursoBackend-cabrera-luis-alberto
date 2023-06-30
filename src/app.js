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
import { routerViewCart } from "./routes/view.cart.router.js"
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import { loginRouter } from "./routes/login.router.js";
import { viewsRouter } from "./routes/view.router.js";

const app = express();
const port = 8080;

connectMongo();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    store: MongoStore.create({mongoUrl:"mongodb+srv://luiscabrera1201:5MWWtCtdtCIek3X4@coder.2kfv2rw.mongodb.net/ecommerce?retryWrites=true&w=majority", ttl: 1000}),
    secret:"es-un-secreto",
    resave: true,
    saveUninitialized: true,
}))

app.engine(
  "handlebars",
  handlebars.engine({
    extname: ".handlebars",
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/products", routerProducts);
app.use("/view/products", routerViewProducts);
app.use("/realtimeproducts", routerRealTimeProducts);
app.use("/api/carts", routerCarts);
app.use("/carts", routerViewCart)
app.use("/api/session", loginRouter)
app.use('/', viewsRouter);

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
