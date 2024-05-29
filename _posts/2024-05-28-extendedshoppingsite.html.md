---
toc: true
comments: true
layout: post
title: Extended Shopping Site
description: Final project for N@TM
courses: {'csp': {'week': 7}}
type: blogs
---
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Extended Shopping Site</title>
    <style>
        .logo {
    font-size: 500%;
}
body, h1, h2, p {
    margin: 0;
    padding: 0;
}
body {
    background-color: black;
    font-family: Arial, sans-serif;
    line-height: 1.6;
}
h1 {
    text-align: center;
    margin: 20px 0;
    color: skyblue;
}
p.creator-info {
    text-align: center;
    font-style: italic;
    color: skyblue;
}
h2 {
    margin-top: 30px;
    color: white;
}
p.categories {
    margin-top: 10px;
    font-weight: bold;
    color: white;
}
a {
    color: skyblue;
    text-decoration: none;
    cursor: pointer;
}
a:hover {
    text-decoration: underline;
}
#pastOrdersList, #discountList, #productList {
    color: white;
}
#result {
    color: white;
}
    </style>
</head>
<body>
    <span class="logo">🛒</span>
    <h1>Welcome to the extended shopping site! Here you can buy as much of what you want any time!</h1>
    <h2>Categories:</h2>
    <select id="categorySelect" onchange="showProducts()">
        <option value="clothing">Clothing</option>
        <option value="food">Food</option>
        <option value="household">Household Items</option>
        <option value="gardening">Garden Products</option>
        <option value="accessories">Accessories</option>
        <option value="musicalinstruments">Musical Instruments</option>
    </select>
    <div id="productList"></div>
    <div id="orderTracking">
        <h2>Order Tracking:</h2>
        <p id="orderStatus"></p>
        <button onclick="placeOrder()">Place Order</button>
    </div>
    <div id="pastOrders">
        <h2>Past Orders:</h2>
        <ul id="pastOrdersList"></ul>
    </div>
    <div id="discounts">
        <h2>Discounts Available</h2>
        <ul id="discountList"></ul>
    </div>
    <p>Already have an account? <a href="login.html">Login</a></p>
    <p>Don't have an account? <a href="signup.html">Sign Up</a></p>
    <div id="result"></div>
    <script>
        const products = {
    clothing: [
        { name: "T-shirt", price: 10 },
        { name: "Jeans", price: 20 },
        { name: "Dress", price: 30 }
    ],
    food: [
        { name: "Bread", price: 2 },
        { name: "Milk", price: 3 },
        { name: "Eggs", price: 4 }
    ],
    household: [
        { name: "Soap", price: 5 },
        { name: "Towel", price: 8 },
        { name: "Dishwasher", price: 50 }
    ],
    gardening: [
        { name: "Shovel", price: 5 },
        { name: "Plant Food", price: 10 },
        { name: "Pot/Plantar", price: 20 }
    ],
    accessories: [
        { name: "Bracelet", price: 50 },
        { name: "Ring", price: 70 },
        { name: "Earrings", price: 100 },
        { name: "Necklace", price: 150}
    ],
    musicalinstruments: [
        { name: "Violin", price: 75 },
        { name: "Piano", price: 100 },
        { name: "Sheet Music", price: 30 }
    ],
};
let selectedProducts = [];
const discounts = [
    { name: "Bread", discount: 0.1 }, 
    { name: "Jeans", discount: 0.15 }, 
    { name: "Violin", discount: 0.2 } 
];
function applyDiscounts() {
    let discountList = document.getElementById('discountList');
    discounts.forEach(discountItem => {
        const discountElement = document.createElement('li');
        discountElement.textContent = `${discountItem.name}: ${discountItem.discount * 100}% off`;
        discountList.appendChild(discountElement);
    });
}
function showProducts() {
    const categorySelect = document.getElementById("categorySelect");
    const selectedCategory = categorySelect.value;
    const productListDiv = document.getElementById("productList");
    const productList = products[selectedCategory];
    if (productList) {
        let html = "<h2>Available Products:</h2><ul>";
        productList.forEach(product => {
            const discount = discounts.find(d => d.name === product.name);
            const finalPrice = discount ? product.price * (1 - discount.discount) : product.price;
            html += `<li><input type="checkbox" value="${product.name}" data-price="${finalPrice}" onchange="toggleProduct(this, ${finalPrice})">${product.name} - $${finalPrice.toFixed(2)}</li>`;
        });
        html += "</ul>";
        productListDiv.innerHTML = html;
    } else {
        productListDiv.innerHTML = "<p>No products available for this category.</p>";
    }
}
function toggleProduct(checkbox, price) {
    const productName = checkbox.value;
    if (checkbox.checked) {
        selectedProducts.push({ name: productName, price: price });
    } else {
        selectedProducts = selectedProducts.filter(item => item.name !== productName);
    }
}
function placeOrder() {
    if (selectedProducts.length === 0) {
        alert("Please select a category and at least one product before placing an order.");
        return;
    }
    const orderStatusElement = document.getElementById("orderStatus");
    orderStatusElement.textContent = "Order placed. Estimated delivery: 3 days.";
    const pastOrdersList = document.getElementById("pastOrdersList");
    let totalCost = 0;
    selectedProducts.forEach(product => {
        totalCost += product.price;
        const newOrder = {date: new Date().toISOString().split('T')[0], product: product.name, price: product.price, status: "Processing"};
        const listItem = document.createElement("li");
        listItem.textContent = `${newOrder.date}: ${newOrder.product} - $${newOrder.price.toFixed(2)} (${newOrder.status})`;
        pastOrdersList.appendChild(listItem);
    });
    const totalElement = document.createElement("p");
    totalElement.textContent = `Total: $${totalCost.toFixed(2)}`;
    pastOrdersList.appendChild(totalElement);
    localStorage.setItem("pastOrders", JSON.stringify(Array.from(pastOrdersList.children).map(item => item.textContent)));
    selectedProducts = [];
}
function resetOrders() {
    localStorage.removeItem("pastOrders");
}
function displayPastOrders() {
    const pastOrdersList = document.getElementById("pastOrdersList");
    const storedOrders = JSON.parse(localStorage.getItem("pastOrders"));
    if (storedOrders) {
        storedOrders.forEach(order => {
            const listItem = document.createElement("li");
            listItem.textContent = order;
            pastOrdersList.appendChild(listItem);
        });
    }
}
window.onload = function() {
    displayPastOrders();
    applyDiscounts();
    resetOrders();
};
    </script>
</body>
</html>