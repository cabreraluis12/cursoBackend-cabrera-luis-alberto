class CartsMemoryModel {
  constructor() {
    this.carts = {};
    this.productsData = {
      123: { id: 1, nombre: "Producto 1", precio: 10.0 },
      456: { id: 2, nombre: "Producto 2", precio: 15.0 },
      789: { id: 3, nombre: "Producto 3", precio: 20.0 },
    };
    this.lastCartId = 0;
  }

  generateCartId() {
    this.lastCartId++;
    return this.lastCartId;
  }

  async createCart() {
    const cid = this.generateCartId();
    this.carts[cid] = { products: [] };
    console.log(`Nuevo carrito creado con el id ${cid}`);
    return {
      status: "success",
      msg: `Se ha creado un nuevo carrito con el id ${cid}`,
      data: { cid },
    };
  }

  async getCartById(cid) {
    const cart = this.carts[cid];
    if (cart) {
      console.log(`Carrito encontrado con id ${cid}`);
      return {
        status: "success",
        msg: `Carrito encontrado`,
        data: { cart },
      };
    } else {
      throw new Error(`Carrito con ID ${cid} no encontrado`);
    }
  }

  async findById(cartId) {
    const cart = this.carts[cartId];
    if (cart) {
      return cart;
    } else {
      throw new Error(`Carrito con ID ${cartId} no encontrado`);
    }
  }

  async getProductById(productId) {
    const product = this.productsData[productId];
    if (product) {
      console.log(`Producto encontrado con id ${productId}`);
      return product;
    } else {
      throw new Error(`Producto con ID ${productId} no encontrado`);
    }
  }

  async getProductsByIds(productIds) {
    const products = productIds.map(id => {
      const product = this.productsData[id];
      if (product) {
        return product;
      } else {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
    });
    return products;
  }

  async addProductToCart(cid, product) {
    const cart = this.carts[cid];
    if (!cart) {
      throw new Error(`Carrito con ID ${cid} no encontrado`);
    }
    cart.products.push(product);
    console.log(`Producto agregado al carrito ${cid}`);
    return {
      status: "success",
      msg: `Producto agregado al carrito ${cid}`,
      data: { cart },
    };
  }

  async removeProductFromCart(cid, productId) {
    const cart = this.carts[cid];
    if (!cart) {
      throw new Error(`Carrito con ID ${cid} no encontrado`);
    }
    const productIndex = cart.products.findIndex(producto => producto.id === productId);
    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
      console.log(`Producto eliminado del carrito ${cid}`);
      return {
        status: "success",
        msg: `Producto eliminado del carrito ${cid}`,
        data: { cart },
      };
    } else {
      throw new Error(`Producto con ID ${productId} no encontrado en el carrito`);
    }
  }

  async updateCart(cid, products) {
    const cart = this.carts[cid];
    if (!cart) {
      throw new Error(`Carrito con ID ${cid} no encontrado`);
    }
    cart.products = products;
    console.log(`Carrito ${cid} actualizado`);
    return {
      status: "success",
      msg: `Carrito ${cid} actualizado`,
      data: { cart },
    };
  }

  async updateProductInCart(cid, productId, cantidad) {
    const cart = this.carts[cid];
    if (!cart) {
      throw new Error(`Carrito con ID ${cid} no encontrado`);
    }
    const producto = cart.products.find(producto => producto.id === productId);
    if (producto) {
      producto.cantidad = cantidad;
      console.log(`Producto actualizado en el carrito ${cid}`);
      return {
        status: "success",
        msg: `Producto actualizado en el carrito ${cid}`,
        data: { cart },
      };
    } else {
      throw new Error(`Producto con ID ${productId} no encontrado en el carrito`);
    }
  }

  async clearCart(cid) {
    delete this.carts[cid];
    console.log(`Carrito ${cid} limpiado`);
    return {
      status: "success",
      msg: `Carrito ${cid} limpiado`,
    };
  }
}

export const cartModel = new CartsMemoryModel();