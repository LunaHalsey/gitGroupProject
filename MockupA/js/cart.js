document.addEventListener("DOMContentLoaded", function () {
    if (typeof Storage === "undefined") {
        console.error("Sorry, your browser does not support session storage.");
        return;
    }

    let appContainer = document.getElementById("app");

    let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};

    for (let category in db) {
        if (Array.isArray(db[category])) {
            let categorySection = document.createElement("div");
            categorySection.className = "category-section";

            let categoryProductsDiv = document.createElement("div");
            categoryProductsDiv.className = "category-products-div";

            let productsInCart = db[category].filter(product => cartData[product.id]);

        productsInCart.forEach(product => {
            // Create product container
            const productContainer = document.createElement("div");
            productContainer.className = "product-container";

            // Add product image
            const productImage = document.createElement("img");
            productImage.src = product.img;
            productImage.alt = product.name;
            productContainer.appendChild(productImage);

            // Add product details
            const productDetails = document.createElement("div");
            productDetails.className = "product-details";
            productDetails.innerHTML = `<h3>${product.name}</h3>
                                        <p>${product.dsc}</p>
                                        <p>Price: $${product.price}</p>
                                        <p>Rating: ${product.rate}</p>
                                        <p>Country: ${product.country}</p>`;

            // Add buy button, quantity counter, and remove button
            const quantityCounter = document.createElement("span");
            quantityCounter.className = "quantity-counter";
            quantityCounter.textContent = cartData[product.id].quantity;

            const buyButton = document.createElement("button");
            buyButton.textContent = "Buy";
            buyButton.addEventListener("click", function () {
                addToCart(product, quantityCounter);
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "-";
            removeButton.addEventListener("click", function () {
                removeFromCart(product, quantityCounter, productContainer);
            });

            // Append buttons and quantity counter to product details
            productDetails.appendChild(buyButton);
            productDetails.appendChild(quantityCounter);
            productDetails.appendChild(removeButton);

            // Append product details to product container
            productContainer.appendChild(productDetails);

            // Append product container to category products div
            categoryProductsDiv.appendChild(productContainer);
        });

        categorySection.appendChild(categoryProductsDiv);
        appContainer.appendChild(categorySection);

        console.log(typeof db[category]);
    }
    }



    window.addEventListener("beforeunload", function () {
        sessionStorage.setItem("cart", JSON.stringify(cartData));
    });

    function addToCart(product, quantityCounter) {
        let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};
        let quantityData = cartData[product.id] || { id: product.id, quantity: 0 };

        quantityData.quantity++;
        cartData[product.id] = quantityData;
        sessionStorage.setItem("cart", JSON.stringify(cartData));

        quantityCounter.textContent = quantityData.quantity;

        console.log(`Added ${product.name} to the cart. Quantity: ${quantityData.quantity}`);
    }

    function removeFromCart(product, quantityCounter, productContainer) {
        let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};
        let quantityData = cartData[product.id] || { id: product.id, quantity: 0 };

        if (quantityData.quantity > 0) {
            quantityData.quantity--;
            cartData[product.id] = quantityData;
            sessionStorage.setItem("cart", JSON.stringify(cartData));

            quantityCounter.textContent = quantityData.quantity;

            if (quantityData.quantity === 0) {
                delete cartData[product.id];
                sessionStorage.setItem("cart", JSON.stringify(cartData));

                console.log(`Removed ${product.name} from the cart. Quantity: 0`);
                productContainer.remove();
            } else {
                console.log(`Removed ${product.name} from the cart. Quantity: ${quantityData.quantity}`);
            }
        } else {
            quantityCounter.textContent = 0;
            console.log(`Item ${product.name} already at 0 quantity.`);
        }
    }
});