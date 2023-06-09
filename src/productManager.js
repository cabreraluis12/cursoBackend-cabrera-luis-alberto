import fs from 'fs';
import { ProductModel } from "./Dao/models/products.models.js";
import mongoose from 'mongoose';


class ProductManager {
    constructor() {
        this.products = [];
        const productsString = fs.readFileSync("./products.json", "utf8");
        const products = JSON.parse(productsString);
        this.products = products;
        this.lastId = Math.max(...products.map(product => product.id), 0);
    }


    getProducts() {
      return ProductModel.find({});
    }

    async getProducts(limit) {
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
              thumbnail: thumbnail || undefined
            }
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
    
    
    addProduct({ title, description, code, price, status, stock, category, thumbnail = [] }) {
  const product = new ProductModel({
    id: ++this.lastId,
    title,
    description,
    price,
    status,
    thumbnail,
    code,
    stock,
    category
  });

  return product.save();
}
}

export const productManager = new ProductManager();
