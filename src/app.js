import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { routerCarts } from "./routes/cart.router.js";
import { routerProducts } from "./routes/products.router.js";
import { routerRealTimeProducts } from "./routes/realTime.products.router.js";
import { routerViewProducts } from "./routes/view.products.router.js";
import { __dirname } from "./utils.js";
import { initRealTimeProducts } from "./routes/realTime.products.router.js";

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", routerProducts);
app.use("/view/products", routerViewProducts);
app.use("/realtimeproducts", routerRealTimeProducts);
app.use("/api/carts", routerCarts);

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export const socketServer = new Server(httpServer);

initRealTimeProducts(socketServer);