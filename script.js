"use strict";
import { menuArray } from "./data.js";

console.log(menuArray);

document.addEventListener("click", (e) => {
	if (e.target.dataset.add) {
		addToOrder(Number(e.target.dataset.add));
	} else if (e.target.dataset.remove) {
		removeFromOrder(Number(e.target.dataset.remove));
	} else if (e.target.id === "complete-order-btn") {
		console.log("Complete order clicked");
		createPaymentModal();
	}
});

let orders = [];

function addToOrder(orderId) {
	const selectedItem = menuArray.find((item) => item.id === orderId);
	if (selectedItem) {
		orders.push(selectedItem);
	}
	render();
}

function removeFromOrder(orderId) {
	orders = orders.filter((order) => order.id !== orderId);
	render();
}

function getOrderSummary() {
	if (orders.length === 0) return "";

	const orderHTML = orders
		.map(
			(order) => `
			<article class="order-item">
				<div class="order-name-remove">
					<h3>${order.name}</h3>
					<button class="remove-btn" data-remove="${order.id}">remove</button>
				</div>
				<p class="price">$${order.price}</p>
			</article>
		`
		)
		.join("");

	const totalPrice = orders.reduce((total, order) => total + order.price, 0);

	return `
    <h2 id="order-summary-header">Your order</h2>
    ${orderHTML}</article>
    <article class="order-total">
        <h2 class="order-total-header">Total price:</h2>
        <p class="price">$${totalPrice}</p>
    </article>
    <button id="complete-order-btn">Complete order</button>
	`;
}

function getMenuItems() {
	return menuArray
		.map(({ emoji, name, ingredients, price, id }) => {
			return `
        <article class="menu-item">
        <div class="menu-item-info">
            <p id="emoji">${emoji}</p>
            <div class="menu-item-text">
                <h3>${name}</h3>
                <p id="ingredients">${ingredients.join(", ")}</p>
                <p id="price"><strong>$${price}</strong></p>
            </div>
            </div>
            <button class="add-to-basket-btn" data-add="${id}">+</button>
        </article>
  `;
		})
		.join("");
}

function render() {
	document.getElementById("menu").innerHTML = getMenuItems();
	document.getElementById("order-summary").innerHTML = getOrderSummary();
}

function createPaymentModal() {
	if (document.querySelector(".payment-modal")) return;
	const backdrop = document.createElement("div");
	backdrop.classList.add("modal-backdrop");
	const modal = document.createElement("div");
	modal.classList.add("payment-modal");
	const header = document.createElement("h2");
	header.textContent = "Enter card details";
	header.classList.add("payment-modal-header");
	const form = document.createElement("form");
	form.classList.add("payment-form");

	function createInput(placeholder, id, type, ariaLabel, maxLength = "") {
		const input = document.createElement("input");
		input.type = type;
		input.id = id;
		input.required = true;
		input.placeholder = placeholder;
		input.classList.add("input-field");
		input.setAttribute("aria-label", ariaLabel);
		if (maxLength) input.setAttribute("maxlength", maxLength);
		if (id === "card-number") {
			input.setAttribute("pattern", "\\d{16}");
			input.setAttribute("inputmode", "numeric");
			input.addEventListener("input", (e) => {
				e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16); // Only digits, limit to 16
			});
		} else if (id === "cvv") {
			input.setAttribute("pattern", "\\d{3}");
			input.addEventListener("input", (e) => {
				e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
			});
		}
		form.appendChild(input);
	}

	createInput("Enter your name", "full-name", "text", "Enter your name");
	createInput(
		"Enter card number",
		"card-number",
		"text",
		"Enter card number",
		16
	);
	createInput("Enter CVV", "cvv", "text", "Enter CVV", 3);
	const submitButton = document.createElement("button");
	submitButton.type = "submit";
	submitButton.textContent = "Pay";
	submitButton.classList.add("submit-payment-btn");
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		alert("Payment successful! Thank you for your order.");
		document.body.removeChild(backdrop);
		orders = [];
		render();
	});
	form.appendChild(submitButton);
	modal.appendChild(header);
	modal.appendChild(form);
	backdrop.appendChild(modal);
	console.log("Modal added to DOM");
	document.body.appendChild(backdrop);

	backdrop.addEventListener("click", (e) => {
		if (!modal.contains(e.target)) {
			backdrop.remove();
		}
	});
}

// Initial render
render();
