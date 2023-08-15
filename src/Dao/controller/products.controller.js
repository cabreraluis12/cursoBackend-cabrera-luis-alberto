import { productService } from "../services/products.service.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const products = await productService.getAllProducts(limit);
      res.status(200).json({ status: "success", payload: products });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    const { pid } = req.params;
    try {
      const product = await productService.getProductById(parseInt(pid));
      res.status(200).json({ status: "success", payload: product });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const status = true;

    try {
      const productExists = await productService.productExists(code);
      if (productExists) {
        res.status(400).json({ error: "Product code already exists" });
        return;
      }

      const newProduct = await productService.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail: thumbnails,
      });

      res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnail } = req.body;

    try {
      const updatedProduct = await productService.updateProduct(parseInt(pid), {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
      });
      res.status(200).json({ status: "success", msg: "Product updated successfully", payload: updatedProduct });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { pid } = req.params;

    try {
      const deletedProduct = await productService.deleteProduct(parseInt(pid));
      res.status(200).json({
        status: "success",
        msg: "Product deleted successfully",
        payload: deletedProduct,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export const productController = new ProductController();