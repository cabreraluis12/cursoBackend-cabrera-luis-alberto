import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { routerCarts } from "./Dao/routes/cart.router.js"
import { routerProducts } from "./Dao/routes/products.router.js";
import { routerRealTimeProducts } from "./Dao/routes/realTime.products.router.js";
import { routerViewProducts } from "./Dao/routes/view.products.router.js";
import { __dirname } from "./utils.js";
import { initRealTimeProducts } from "./Dao/routes/realTime.products.router.js";
import { connectMongo } from "./utils.js";
import { MessageModel } from "./Dao/models/message.model.js";
import { routerViewCart } from "./Dao/routes/view.cart.router.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import { loginRouter } from "./Dao/routes/login.router.js";
import { viewsRouter } from "./Dao/routes/view.router.js";
import { iniPassport } from "./config/passport.config.js";
import passport from "passport";
import dotenv from "dotenv";
import { checkUser, checkAdmin } from "./Dao/middlewares/auth.js";
import { loginController } from "./Dao/controller/login.controller.js";
import { routerMock} from "./Dao/routes/mocking.router.js"
import errorHandler from "./Dao/middlewares/error.js";


dotenv.config();

const app = express();
const port = process.env.PORT

connectMongo();

const dbUrl = process.env.MONGO_DB_URI;
const sessionSecret = process.env.SESSION_SECRET;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    store: MongoStore.create({ mongoUrl: dbUrl, ttl: 1000 }),
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
}))

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/sessions",loginRouter)
app.use('/', viewsRouter);
app.use("/mockingproducts", routerMock);

app.use(errorHandler);

app.get("/chat", checkUser, async (req, res) => {
  console.log("User accessing /chat:", req.session.user);
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
      console.log("User sending new message:", socket.handshake.session.user); // Agrega este console.log
      if (socket.handshake.session.user) { 
        try {
          const createdMessage = await MessageModel.create(message);
          socketServer.emit("messages", [createdMessage]);
        } catch (error) {
          console.error("Error creating message:", error);
        }
      } else {
        console.log("User is not authenticated, message not sent.");
      }
    });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
