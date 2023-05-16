//@ts-check
import express  from "express";
import { routerProducts } from "./routes/products.router.js";
import {    routerCarts  } from "./routes/cart.router.js";

const app = express();
const port =8080;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.listen(port, ()=>console.log ("server ON"));