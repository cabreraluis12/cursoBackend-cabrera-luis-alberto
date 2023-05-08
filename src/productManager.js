const fs = require('fs');

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

    updateProduct(id, { title, description, price, thumbnail, code, stock }) {
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
    
    addProduct({ title, description, price, thumbnail, code, stock }) {
        const productExists = this.products.some(product => product.code === code);
        if (productExists) {
            throw new Error("Product code already exists");
        }
        const Product = {
            id: ++this.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(Product);
        const productsString = JSON.stringify(this.products);
        fs.writeFileSync("products.json", productsString);
        return Product;

        
    }
}

const productManager = new ProductManager();

module.exports = { productManager };



// AGRAGAR PRODUCTO

/*productManager.addProduct({
    title: "producto prueba 10",
    description: "Este es un producto prueba 10",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abcd1234567890",
    stock: 25,
});*/



//EDITAR PRODUCTO

/*productManager.updateProduct(1,{
    title: "producto prueba 1 modficado",
    
});*/

//BORRAR PRODUCTO POR ID

/*productManager.deleteProduct(2)*/



console.log(productManager.getProducts());


