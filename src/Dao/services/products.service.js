import { ProductModel } from "../models/products.models.js";

class ProductService {
  async getAllProducts(limit) {
    try {
      let query = ProductModel.find();

      if (limit) {
        query = query.limit(limit);
      }

      const products = await query.exec();
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    return ProductModel.findOne({ id }).exec();
  }

  async productExists(code) {
    const product = await ProductModel.findOne({ code }).exec();
    return !!product;
  }

  async updateProduct(id, { title, description, code, price, stock, category, thumbnail }) {
    try {
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { id: id },
        {
          $set: {
            title: title || undefined,
            description: description || undefined,
            code: code || undefined,
            price: price || undefined,
            stock: stock || undefined,
            category: category || undefined,
            thumbnail: thumbnail || undefined,
          },
        },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      return updatedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findOneAndDelete({ id: id });

      if (!deletedProduct) {
        throw new Error("Product not found");
      }

      return deletedProduct;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProduct({ title, description, code, price, status, stock, category, thumbnail = [] }) {
    try {
      const lastProduct = await ProductModel.findOne().sort({ id: -1 }).exec();

      const newId = lastProduct ? lastProduct.id + 1 : 1;

      const product = new ProductModel({
        id: newId,
        title,
        description,
        code,
        price,
        status,
        thumbnail,
        stock,
        category,
      });

      return product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const productService = new ProductService();