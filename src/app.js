//@ts-check
import express  from "express";
import { routerProducts } from "./routes/products.router.js";

const app = express();
const port =8080;


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api/products", routerProducts)

app.listen(port, ()=>console.log ("server ON"));