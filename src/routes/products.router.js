
import express from "express";
import { productManager } from "../productManager.js";

export const routerProducts = express.Router();


routerProducts.get("/",(req, res) => {
    try{
    const q = req.query
    const setLimit = Object.keys(q).length;
    if(setLimit==0){
        res.status(200).send({status:"success", data: productManager.getProducts()});
    }
    else {
        const newArray = productManager.getProducts().slice(0, q.limit)
        res.status(200).send({status:"success", data:newArray});
    }
    }catch(error) {res.status(401).send(error)};
});

routerProducts.get("/:pid", (req, res) => {
    const { pid } = req.params;
    try {
        const product = productManager.getProductById(parseInt(pid));
        res.send({ product });
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

routerProducts.post("/", (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    const status = req.body.status || true;

    try {
        const newProduct = productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
        res.status(201).json({ product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

routerProducts.put("/:pid", (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnail } = req.body;

    try {
        const updatedProduct = productManager.updateProduct(parseInt(pid), { title, description, code, price, stock, category, thumbnail });
        res.status(200).json({ 
            status: "success",
            msg: "producto modificado ok",
            data: {product: updatedProduct} });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

routerProducts.delete("/:pid", (req, res) => {
    const { pid } = req.params;

    try {
        const deletedProduct = productManager.deleteProduct(parseInt(pid));
        res.status(200).json({  status: "success",
        msg: "Eliminamos el producto cuyo id es " + pid,
        data: { product: deletedProduct},
            });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});