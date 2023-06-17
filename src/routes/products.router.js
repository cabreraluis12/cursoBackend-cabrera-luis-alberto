import express from "express";
import { productManager } from "../productManager.js";
import { uploader } from "../utils.js";
import { ProductModel } from "../Dao/models/products.models.js";

export const routerProducts = express.Router();


routerProducts.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const query = req.query.query || "";
    const sort = req.query.sort || "";

    const options = {
      page,
      limit,
      sort: sort === "desc" ? { price: -1 } : { price: 1 },
    };


    const filter = {
      $or: [
        { category: { $regex: new RegExp(query, "i") } },
        { availability: { $regex: new RegExp(query, "i") } },
      ],
    };


    const products = await ProductModel.paginate(filter, options);

    res.status(200).json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
      nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null,
    });
  } catch (error) {
    res.status(401).send(error);
  }
});

routerProducts.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    res.send({ product });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});




routerProducts.post("/", async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const status = true;

  try {
    const productExists = await productManager.productExists(code);
    if (productExists) {
      res.status(400).json({ error: "Product code already exists" });
      return;
    }

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail: thumbnails,
    });

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
      res.status(200).json({ status: "success", msg: "Producto modificado exitosamente", data: { product: updatedProduct } });
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
  });



routerProducts.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  
  try {
      const deletedProduct = productManager.deleteProduct(parseInt(pid));
      res.status(200).json({  
      status: "success",
      msg: "El producto se ha eliminado correctamente",
      data: { product: deletedProduct },
      });
      } catch (error) {
      res.status(404).json({ error: error.message });
      }
});



routerProducts.delete("/delete", (req, res) => {
    const { productId } = req.body;
    
    try {
        const deletedProduct = productManager.deleteProduct(parseInt(productId));
        res.status(200).json({  
            status: "success",
            msg: "El producto se ha eliminado correctamente",
            data: { product: deletedProduct },
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });