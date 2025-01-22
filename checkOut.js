import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgyWGXCAIR6NiKfkzkWZbBeOMPRDNwMg4",
  authDomain: "contactus-a9d19.firebaseapp.com",
  databaseURL: "https://contactus-a9d19-default-rtdb.firebaseio.com",
  projectId: "contactus-a9d19",
  storageBucket: "contactus-a9d19.firebasestorage.app",
  messagingSenderId: "290565306453",
  appId: "1:290565306453:web:0995f78c2a17d582903cdc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productsRef = ref(db, "products");

// Function to display products in cart

let proDetailsData = JSON.parse(localStorage.getItem("details"));
console.log(proDetailsData.name)
   


let BuyProductContainer = document.querySelector(".BuyProductContainer");
BuyProductContainer.innerHTML = `
<div id="cardItem" class="card my-3">
        <div class="col">
          <div class="card h-100">
            <img id="imgCard" src="${proDetailsData.image}" class="card-img-top" alt="Product Image">
            <div id="textCardContainer" class="card-body text-center">
              <h5 class="card-title">${proDetailsData.name}</h5>
              <p class="card-text">${proDetailsData.description}</p>
              <div class="d-flex justify-content-between">
                <span class="fw-bold">$${proDetailsData.price}</span>
                <span class="text-warning">&#9733;${proDetailsData.rating}</span>
              </div>
              <div class="justify-content-around d-flex align-items-center">
                <button id="detailsButton" class="m-1 btn btn-pink" style="background-color: #f8d7da; color: #000;"><a style="text-decoration: none; color:black" href="productDetails.html">More Details</a></button>
                <i id="favoriteButton" class="fs-4 fa-regular fa-heart"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
`;
















document
  .getElementById("paymentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    clearMessages([
      "cardNumberError",
      "nameOnCardError",
      "expirationError",
      "cvvError",
    ]);

    const cardNumber = document.getElementById("typeText").value;
    const nameOnCard = document.getElementById("typeName").value;
    const expiration = document.getElementById("typeExp").value;
    const cvv = document.getElementById("typeCvv").value;

    let valid = true;

    if (!validateCardNumber(cardNumber)) {
      displayMessage(
        "cardNumberError",
        "Please enter a valid card number.",
        "error"
      );
      valid = false;
    }

    if (!nameOnCard.trim()) {
      displayMessage("nameOnCardError", "Name on card is required.", "error");
      valid = false;
    }

    if (!validateExpiration(expiration)) {
      displayMessage(
        "expirationError",
        "Please enter a valid expiration date (MM/YY).",
        "error"
      );
      valid = false;
    }

    if (!validateCVV(cvv)) {
      displayMessage("cvvError", "CVV must be exactly 3 digits.", "error");
      valid = false;
    }

    if (valid) {
      const successMessage = document.getElementById("paymentSuccessMessage");
      successMessage.textContent = "Payment successful!";
      successMessage.style.display = "block";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    }
  });

function displayMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.style.color = type === "error" ? "red" : "green";
}

function clearMessages(ids) {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    element.textContent = "";
  });
}

function validateCardNumber(cardNumber) {
  return /^\d{16}$/.test(cardNumber.replace(/\s/g, ""));
}

function validateExpiration(expiration) {
  const expPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const [month, year] = expiration.split("/").map(Number);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;
  return (
    expPattern.test(expiration) &&
    (year > currentYear || (year === currentYear && month >= currentMonth))
  );
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

let username = localStorage.getItem("username");
document.getElementById("nav-username").textContent = username;
document.getElementById("nav-username").style.margin = "10px";
