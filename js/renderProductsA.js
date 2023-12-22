// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.getElementById("products");
    const carouselInner = document.getElementById("carouselInner");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");


    // Retrieve the existing cart data from sessionStorage
    let cartData = JSON.parse(sessionStorage.getItem("cart")) || {};

    // Define the categories to display
    const allowedCategories = ["bbqs", "drinks"];





    // Iterate through each category in the database
    for (const category in db) {

        if (allowedCategories.includes(category)) {

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
                productImage.className = "product-image"
                productImage.src = product.img;
                productImage.alt = product.name;
                productContainer.appendChild(productImage);

                // Add product details
                const productDetails = document.createElement("div");
                productDetails.className = "product-details";
                productDetails.setAttribute("data-product-id", product.id);
                productDetails.innerHTML = `<h3>${product.name}</h3>
                                            <p>${product.dsc}</p>
                                            <p>Price: $${product.price}</p>
                                            <p>Rating: ${product.rate}</p>
                                            <p>Country: ${product.country}</p>`;

            // Add buy button, quantity counter, and remove button
            // Add quantity button
            const quantityCounter = document.createElement("span");
            quantityCounter.className = "quantity-counter";

            // Check if the product is already in the cartData, and set the quantity accordingly
            if (cartData[product.id]) {
                quantityCounter.textContent = cartData[product.id].quantity;
            } else {
                quantityCounter.textContent = "0"; // Initialize the counter to 0
            }

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
}

// Array with product IDs to display in the carousel
const productIds = [
    "ribs-brisket-and-burnt-ends",
    "whole-brisket-sausage-texas-barbecue-bbq-sauce",
    "mesquite-smoked-peppered-beef-tenderloin"
];


// Select products from the database based on their IDs
const carouselProducts = productIds.map(productId => {
    const foundProduct = db.bbqs.find(product => product.id === productId);
    return foundProduct || null; // Return null if product with ID is not found
}).filter(product => product !== null); // Remove null entries



    // Render products in the carousel
    carouselProducts.forEach(product => {

    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item";
    const carouselDataContainer = document.createElement("div");
    carouselDataContainer.className = "carousel-data-container";

    carouselDataContainer.setAttribute("data-product-id", product.id);
    carouselDataContainer.innerHTML = `<img src="${product.img}" alt="${product.name}" class="carousel-image">
                                <h3>${product.name}</h3>
                                <p>${product.dsc}</p>
                                <p>Price: $${product.price}</p>`;


        const carouselButtons = document.createElement("div");
        carouselButtons.className = "carousel-buttons";

    // Add buy button, quantity counter, and remove button to carousel item
    const quantityCounterCarousel = document.createElement("span");
    quantityCounterCarousel.className = "quantity-counter";
    // Initialize the quantity counter for carousel items based on existing cart data
    const initialQuantityCarousel = cartData[product.id] ? cartData[product.id].quantity : 0;
    quantityCounterCarousel.textContent = initialQuantityCarousel;



    const buyButtonCarousel = document.createElement("button");
    buyButtonCarousel.className = "product-button";
    buyButtonCarousel.textContent = "Buy";
    buyButtonCarousel.addEventListener("click", function () {
        addToCart(product, quantityCounterCarousel);
    });

    const removeButtonCarousel = document.createElement("button");
    removeButtonCarousel.className = "product-button";
    removeButtonCarousel.textContent = "-";
    removeButtonCarousel.addEventListener("click", function () {
        removeFromCart(product, quantityCounterCarousel);
    });

    carouselButtons.appendChild(buyButtonCarousel);
    carouselButtons.appendChild(quantityCounterCarousel);
    carouselButtons.appendChild(removeButtonCarousel);

    carouselDataContainer.appendChild(carouselButtons);

    carouselItem.appendChild(carouselDataContainer);
    carouselInner.appendChild(carouselItem);
    });

    let currentIndex = 0;

    // Update the carousel display after rendering products
    updateCarousel();

// Add event listeners for carousel navigation
prevButton.addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + carouselProducts.length) % carouselProducts.length;
    updateCarousel();
});

nextButton.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % carouselProducts.length;
    updateCarousel();
});

// Function to update the carousel display
function updateCarousel() {
    const carouselItems = document.querySelectorAll(".carousel-item");
    carouselItems.forEach((item, index) => {
        item.style.display = index === currentIndex ? "block" : "none";
    });
}



    // Add event listener to save the cartData when the window is unloaded
    window.addEventListener("beforeunload", function () {
        sessionStorage.setItem("cart", JSON.stringify(cartData));
    });

    function addToCart(product, quantityCounter) {
        // Retrieve the existing cart data from sessionStorage
        cartData = JSON.parse(sessionStorage.getItem("cart")) || {};

        let quantityData = cartData[product.id] || { id: product.id, quantity: 0 };

        // Check if the product is already in the cart
        if (quantityData !== "undefined") {
            quantityData.quantity++;
            cartData[product.id] = quantityData;

            sessionStorage.setItem("cart", JSON.stringify(cartData));

            quantityCounter.textContent = quantityData.quantity;

            // Update the quantity counter in the carousel
            updateQuantityCounterCarousel(product.id, quantityData.quantity);
            // Update the quantity counter in the product list
            updateQuantityCounterProductList(product.id, quantityData.quantity);
        } else {
            // Product is not in the cart, add it with initial quantity
            cartData[product.id] = {
                quantity: quantity,
                id: product.id,
            };
        }

        // Save the updated cart data to sessionStorage
        sessionStorage.setItem("cart", JSON.stringify(cartData));

        console.log(`Added ${product.name} to the cart. Quantity: ${quantityData.quantity}`);
    }

    // Function to remove a product from the cart
    function removeFromCart(product, quantityCounter) {
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

            // Update the quantity counter in the carousel
            updateQuantityCounterCarousel(product.id, quantityData.quantity);
            // Update the quantity counter in the product list
            updateQuantityCounterProductList(product.id, quantityData.quantity);

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

    // Function to update the quantity counter in the carousel
    function updateQuantityCounterCarousel(productId, newQuantity) {
        const quantityCounterCarousel = document.querySelector(`[data-product-id="${productId}"] .quantity-counter-carousel`);

        if (quantityCounterCarousel) {
            quantityCounterCarousel.textContent = newQuantity;
        }
    }

    // Function to update the quantity counter in the product list
    function updateQuantityCounterProductList(productId, newQuantity) {
        const quantityCounterProductList = document.querySelector(`[data-product-id="${productId}"] .quantity-counter`);

        if (quantityCounterProductList) {
            quantityCounterProductList.textContent = newQuantity;
        }
    }


});
