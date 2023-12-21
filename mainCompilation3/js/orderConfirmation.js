// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    // Retrieve order details from session storage
    let orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));


    // Calculate total order price by summing up the prices of each item
    let totalOrderPrice = orderDetails.items.reduce((total, item) => total + item.price, 0);

    // Display order details on the confirmation page
    let orderDetailsContainer = document.getElementById("order-details");

    // Populate the order details container with the retrieved information
    orderDetailsContainer.innerHTML = `
        <p>Table: ${orderDetails.table}</p>
        <p>Name: ${orderDetails.name}</p>
        <p>Comments: ${orderDetails.comments}</p>
        <h2>Ordered Items:</h2>
        <ul>
            ${orderDetails.items.map(item => `<li>${item.quantity} x ${item.name} <!--(ID: ${item.id})--> - $${item.price.toFixed(2)}</li>`).join('')}
        </ul>
        <p><strong>Total Order Price: $${totalOrderPrice.toFixed(2)}</strong></p>
    `;

    // Clear order and cart details from session storage
    // // // sessionStorage.removeItem("orderDetails");
    // // // sessionStorage.removeItem("cart");

});