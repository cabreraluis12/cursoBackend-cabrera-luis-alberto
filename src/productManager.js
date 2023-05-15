import fs from 'fs';

class ProductManager {
    constructor() {
        this.products = [];
        const productsString = fs.readFileSync("./products.json", "utf8");
        const products = JSON.parse(productsString);
        this.products = products;
        this.lastId = Math.max(...products.map(product => product.id), 0);
    }


    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
            if (!product) {
        throw new Error("Product not found");
        }
        return product;
    }

    updateProduct(id, { title, description, code, price, stock, category, thumbnail  }) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Product not found");
        }
    
        const updatedProduct = {
            id,
            title: title || this.products[productIndex].title,
            description: description || this.products[productIndex].description,
            price: price || this.products[productIndex].price,
            thumbnail: thumbnail || this.products[productIndex].thumbnail,
            code: code || this.products[productIndex].code,
            stock: stock || this.products[productIndex].stock,
            category: category || this.products[productIndex].category
        };
    
        this.products[productIndex] = updatedProduct;
    
        const productsString = JSON.stringify(this.products);
        fs.writeFileSync("products.json", productsString);
    
        return updatedProduct;
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Product not found");
        }
    
        const deletedProduct = this.products.splice(productIndex, 1)[0];
    
        const productsString = JSON.stringify(this.products);
        fs.writeFileSync("products.json", productsString);
    
        return deletedProduct;
    }
    
    addProduct({ title, description, code, price, status, stock, category, thumbnail = [] }) {
        const productExists = this.products.some(product => product.code === code);
        if (productExists) {
            throw new Error("Product code already exists");
        }
        const Product = {
            id: ++this.lastId,
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock,
            category,
        };
        this.products.push(Product);
        const productsString = JSON.stringify(this.products);
        fs.writeFileSync("products.json", productsString);
        return Product;

        
    }
}

export const productManager = new ProductManager();


