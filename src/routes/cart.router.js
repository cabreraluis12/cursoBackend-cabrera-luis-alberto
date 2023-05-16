import express from "express";
import fs from "fs";

let lastCartId = 0;

export const routerCarts = express.Router();

const cartFilePath = "./carrito.json";

function createCartFileIfNotExists() {
    if (!fs.existsSync(cartFilePath)) {
    fs.writeFileSync(cartFilePath, JSON.stringify([]));
    }
}

function loadLastCartId() {
    if (fs.existsSync(cartFilePath)) {
    const cartsString = fs.readFileSync(cartFilePath, "utf8");
    const carts = JSON.parse(cartsString);
    if (carts.length > 0) {
        lastCartId = Math.max(...carts.map((cart) => cart.id));
    }
    }
}

createCartFileIfNotExists();
loadLastCartId();

routerCarts.post("/", (req, res) => {
    try {
    const cartId = generateCartId();
    const newCart = {
        id: cartId,
        products: [],
    };

    saveCart(newCart);

    res.status(201).json({ 
        status: "success",
        msg: "Se a creado un nuevo cart con el id " + cartId,
        data: {cart: newCart} 
        });
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
});

routerCarts.get("/:cid", (req, res) => {
    const { cid } = req.params;
    try {
    const cart = getCartById(cid);
    if (cart) {
        const products = getProducts().filter((product) =>
        cart.products.includes(product.id)
        );
        res.status(200).json({ 
            status: "success",
            msg: "Se econtro el carrito con el id " + cid,
            data:{cart, products} });
    } else {
        res.status(404).json({ 
            status: "Error",
            msg: "El carrito con el id "+ cid +" no existe" });
    }
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
});

routerCarts.post("/:cid/product/:pid", (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = getCartById(cid);
        const product = getProductById(pid);
        
        if (!product) {
            res.status(404).json({ 
                status: "Error",
                msg: "El producto con el id "+ pid +" no existe" });
            return;
        }
    
        const existingProductIndex = cart.products.findIndex(
            (item) => item.product === pid
        );
    
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            const newCartItem = {
                product: pid,
                title: product.title,
                quantity: 1
            };
            cart.products.push(newCartItem);
        }
    
        saveCart(cart);
        res.status(200).json({ 
            status: "Success",
            msg: "Se agregaron productos al carrito " + cid,
            data:{productId: pid, productTitle: product.title},
            cart
            });
    } catch (error) {
        res.status(404).json({ 
            status: "Error",
            msg: "El carrito con el id "+ cid +" no existe"});
    }
});





    //FUNCTIONS//

function generateCartId() {
    lastCartId++;
    return lastCartId;
}

function getCartById(cartId) {
    const cartsString = fs.readFileSync(cartFilePath, "utf8");
    const carts = JSON.parse(cartsString);
    const cart = carts.find((cart) => cart.id === Number(cartId));
    return cart;
}

function saveCart(cart) {
    const cartsString = fs.readFileSync(cartFilePath, "utf8");
    const carts = JSON.parse(cartsString);
    const existingCartIndex = carts.findIndex((c) => c.id === cart.id);
    if (existingCartIndex !== -1) {
    carts[existingCartIndex] = cart;
    } else {
    carts.push(cart);
    }

    fs.writeFileSync(cartFilePath, JSON.stringify(carts));
}

function getProducts() {
    const productsString = fs.readFileSync("./products.json", "utf8");
    const products = JSON.parse(productsString);
    return products;
}

function getProductById(productId) {
    const products = getProducts();
    const product = products.find((p) => p.id === Number(productId));
    return product;
}