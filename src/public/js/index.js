const socket = io();

        socket.on("products", (products) => {
        const productList = document.querySelector("ul");
        productList.innerHTML = "";
        products.forEach((product) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
            <hr>
            <p><span class="text-danger text-decoration-underline">-ID: </span> ${product.id}</p>
            <p><span class="text-danger text-decoration-underline">-Titulo: </span> ${product.title}</p>
            <p><span class="text-danger text-decoration-underline">-Descripcion: </span> ${product.description}</p>
            <p><span class="text-danger text-decoration-underline">-Precio:</span> ${product.price}</p>
            <p><span class="text-danger text-decoration-underline">-Img:</span> ${product.thumbnail}</p>
            <p><span class="text-danger text-decoration-underline">-Codigo:</span> ${product.code}</p>
            <p><span class="text-danger text-decoration-underline">-Stock:</span> ${product.stock}</p>
            <hr>
            <hr>
            `;
            productList.appendChild(listItem);
        });
        });

        document.getElementById('deleteProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const productId = document.getElementById('productId').value;

        try {
            const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
            });

            if (response.ok) {
            alert('El producto se ha eliminado correctamente.');
            } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.error);
            }
        } catch (error) {
            alert('Ocurrió un error al eliminar el producto.');
        }
        });