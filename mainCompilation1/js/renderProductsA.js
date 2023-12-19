document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products");

    // Retrieve the existing cart data from sessionStorage
    let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};

    // Iterate through each category in the database
    for (const category in db) {
        const categorySection = document.createElement("div");
        categorySection.className = "category-section";
        const categoryProductsDiv = document.createElement("div");
        categoryProductsDiv.className = "category-products-div";

        // Add category title (currently used)
        const categoryTitle = document.createElement("h2");
        categoryTitle.textContent = category;
        categorySection.appendChild(categoryTitle);

        // Iterate through each product in the category
        db[category].forEach(product => {
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

            // Check if the product is already in the cartData, and set the quantity accordingly
            if (cartData[product.id]) {
                quantityCounter.textContent = cartData[product.id].quantity;
            } else {
                quantityCounter.textContent = "0"; // Initialize the counter to 0
            }

            const buyButton = document.createElement("button");
            buyButton.textContent = "Buy";
            buyButton.addEventListener("click", function () {
                addToCart(product, quantityCounter);
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "-";
            removeButton.addEventListener("click", function () {
                removeFromCart(product, quantityCounter);
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

        // Append products div to the category section
    categorySection.appendChild(categoryProductsDiv);

    // Append category section to the products container
    productsContainer.appendChild(categorySection);
    }

    // Add this event listener to save the cartData when the window is unloaded
    window.addEventListener("beforeunload", function () {
        sessionStorage.setItem("cart", JSON.stringify(cartData));
    });

    function addToCart(product, quantityCounter) {


        // Retrieve the existing cart data from sessionStorage
        let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};

        let quantityData = cartData[product.id] || {  id: product.id, quantity: 0 };

        // Check if the product is already in the cart
        if (quantityData !== "undefined") {
            quantityData.quantity++;
            cartData[product.id] = quantityData;

            sessionStorage.setItem("cart", JSON.stringify(cartData));

            quantityCounter.textContent = quantityData.quantity;

        }
         // Check if the product is already in the cart
        else {
            // Product is not in the cart, add it with initial quantity
            cartData[product.id] = {
                quantity: quantity,
                id: product.id,
                // price: product.price
            };
        }

        // Save the updated cart data to sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(cartData));

        console.log(`Added ${product.name} to the cart. Quantity: ${quantityData.quantity}`);
    }


    // Implement removing from session storage
    function removeFromCart(product, quantityCounter) {
        // Retrieve the existing cart data from sessionStorage
        let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};

        let quantityData = cartData[product.id] || {  id: product.id, quantity: 0 };

        if (quantityData.quantity > 0) {
            quantityData.quantity--;

            // Update the quantity for the product in the cart
            cartData[product.id] = quantityData;

        // Save the updated cart data to sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(cartData));

        // Update the quantity counter
        quantityCounter.textContent = quantityData.quantity;

        // Check if the quantity is now 0, and if so, remove the item from sessionStorage
        if (quantityData.quantity === 0) {
            delete cartData[product.id];
            sessionStorage.setItem("cart", JSON.stringify(cartData));
            console.log(`Removed ${product.name} from the cart. Quantity: 0`);
        } else {
            console.log(`Removed ${product.name} from the cart. Quantity: ${quantityData.quantity}`);
        }
    } else {
        // If quantity is already 0, no need to update sessionStorage, just update the counter
        quantityCounter.textContent = 0;

        console.log(`Item ${product.name} already at 0 quantity.`);
    }
    }



});
