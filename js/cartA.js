// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    // Check if browser supports session storage
    if (typeof Storage === "undefined") {
        console.error("Sorry, your browser does not support session storage.");
        return;
    }

    // Get the container for rendering products
    let cartContainer = document.getElementById("cartProducts");

    // Retrieve cart data from session storage or initialize an empty object
    let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};

    // Define the categories to display
    const allowedCategories = ["bbqs", "drinks"];


    // Add a function to handle the buy button click
    document.getElementById("buy-button").addEventListener("click", function () {
        handleBuy();
    });



    // Iterate through product categories in the database and render them, shows all categories
    for (let category in db) {
        if (allowedCategories.includes(category)) {
            let categorySection = document.createElement("div");
            categorySection.className = "category-section";

            let categoryProductsDiv = document.createElement("div");
            categoryProductsDiv.className = "category-products-div";

            let productsInCart = db[category].filter(product => cartData[product.id]);

            // Add category title (not currently used)
            // const categoryTitle = document.createElement("h2");
            // categoryTitle.textContent = category;
            // categorySection.appendChild(categoryTitle);

        productsInCart.forEach(product => {
            // Create product container
            const productContainer = document.createElement("div");
            productContainer.className = "product-container";

            // Add product image
            const productImage = document.createElement("img");
            productImage.className = "product-image";
            // productImage.width = "300";
            // productImage.height = "300";
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
            // Add quantity button
            const quantityCounter = document.createElement("span");
            quantityCounter.className = "quantity-counter";
            quantityCounter.textContent = cartData[product.id].quantity;

            // Add buy button
            const buyButton = document.createElement("button");
            buyButton.className = "product-button";
            buyButton.textContent = "Buy";
            buyButton.addEventListener("click", function () {
                addToCart(product, quantityCounter);
            });

            // Add remove button
            const removeButton = document.createElement("button");
            removeButton.className = "product-button";
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

        // Append products div to the category section
        categorySection.appendChild(categoryProductsDiv);

        // Append category section to the products container
        cartContainer.appendChild(categorySection);

        console.log(typeof db[category]);
    }

    // Update the total cost on page load
    updateTotalCost();

    }



    // Save cart data to session storage before unloading the page
    window.addEventListener("beforeunload", function () {
        sessionStorage.setItem("cart", JSON.stringify(cartData));
    });

    // Function to add a product to the cart
    function addToCart(product, quantityCounter) {
        cartData = JSON.parse(sessionStorage.getItem("cart")) || {};
        let quantityData = cartData[product.id] || { id: product.id, quantity: 0 };

        quantityData.quantity++;
        cartData[product.id] = quantityData;
        sessionStorage.setItem("cart", JSON.stringify(cartData));

        quantityCounter.textContent = quantityData.quantity;

        console.log(`Added ${product.name} to the cart. Quantity: ${quantityData.quantity}`);
        updateTotalCost(); // Update the total cost when adding to the cart
    }

    // Function to remove a product from the cart
    function removeFromCart(product, quantityCounter, productContainer) {
        // Retrieve the existing cart data from sessionStorage
        cartData = JSON.parse(sessionStorage.getItem("cart")) || {};
        let quantityData = cartData[product.id] || { id: product.id, quantity: 0 };

        if (quantityData.quantity > 0) {
            quantityData.quantity--;

            // Update the quantity for the product in the cart
            cartData[product.id] = quantityData;

            // Save the updated cart data to sessionStorage
            sessionStorage.setItem("cart", JSON.stringify(cartData));

            // Update the quantity counter
            quantityCounter.textContent = quantityData.quantity;

            if (quantityData.quantity === 0) {
                delete cartData[product.id];
                sessionStorage.setItem("cart", JSON.stringify(cartData));

                console.log(`Removed ${product.name} from the cart. Quantity: 0`);
                productContainer.remove();
                updateTotalCost(); // Update the total cost when removing from the cart
            } else {
                console.log(`Removed ${product.name} from the cart. Quantity: ${quantityData.quantity}`);
                updateTotalCost(); // Update the total cost when removing from the cart
            }
        } else {
            // If quantity is already 0, no need to update sessionStorage, just update the counter
            quantityCounter.textContent = 0;
            console.log(`Item ${product.name} already at 0 quantity.`);
        }
    }

    // Function to update the total cost on the page
    function updateTotalCost() {
        let totalCost = 0;

        for (let category in db) {
            if (allowedCategories.includes(category)) {
                let productsInCart = db[category].filter(product => cartData[product.id]);

                productsInCart.forEach(product => {
                    let quantityData = cartData[product.id];
                    totalCost += product.price * quantityData.quantity;
                });
            }
        }

        // Display the total cost in the specified div
        let totalCostElement = document.getElementById("total-cost");
        totalCostElement.textContent = `Total Cost: $${totalCost.toFixed(2)}`;
    }

        window.addEventListener("beforeunload", function () {
        sessionStorage.setItem("cart", JSON.stringify(cartData));
    });


// Function to handle the buy button click
function handleBuy() {
    // Get selected table, name, and comments
    const tableSelect = document.getElementById("table-select");
    const selectedTable = tableSelect.options[tableSelect.selectedIndex].text;
    const nameInput = document.getElementById("name-input").value;
    const commentInput = document.getElementById("comment-input").value;

    // Define the allowed categories for the order confirmation
    const allowedCategories = ["bbqs", "drinks"];

    // Prepare data for order confirmation page
    let orderDetails = {
        table: selectedTable,
        name: nameInput,
        comments: commentInput,
        items: [],
    };

    // Iterate through allowed categories
    allowedCategories.forEach(category => {
        if (Array.isArray(db[category])) {
            let productsInCart = db[category].filter(product => cartData[product.id]);

            productsInCart.forEach(product => {
                let quantityData = cartData[product.id];
                orderDetails.items.push({
                    name: product.name,
                    // id: product.id,
                    quantity: quantityData.quantity,
                    price: product.price * quantityData.quantity,
                });
            });
        }
    });

    // Save order details to session storage
    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    // Redirect to the order confirmation page
    window.location.href = "order-confirmation.html";
}


});