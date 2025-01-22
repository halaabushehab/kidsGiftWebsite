const logo = document.querySelector(".logo");
const icon = document.querySelector(".icon");

logo.addEventListener("mouseover", () => {
  icon.style.color = "#EECAD5";
});

logo.addEventListener("mouseout", () => {
  icon.style.color = "#FF69B4";
});

// // ----------------------realtime database----------------------

// استدعاء بيانات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgyWGXCAIR6NiKfkzkWZbBeOMPRDNwMg4",
  authDomain: "contactus-a9d19.firebaseapp.com",
  databaseURL: "https://contactus-a9d19-default-rtdb.firebaseio.com",
  projectId: "contactus-a9d19",
  storageBucket: "contactus-a9d19.firebasestorage.app",
  messagingSenderId: "290565306453",
  appId: "1:290565306453:web:0995f78c2a17d582903cdc",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



function writeUserData(userId, image, name, description, price, rating, color, gender, type) {



// writeUserData(
//   1,
//   "https://cdn3.dumyah.com/image/cache/data/2023/08/16930598521015171335-800x800.webp",
//   "Headphones – Frozen",
//   "Disney Frozen kids' stereo headphones, suitable for ages 3 and up.",
//   15.90,
//   4.6,
//   "blue",
//   "female",
//   "electronics"
// )

    set(ref(db, "products/" + userId), {
      image: image,
      name: name,
      description: description,
      price: price,
      rating: rating,
      color: color,
      gender: gender,
      type: type,
    })
      .then(() => {
        console.log("Data written successfully!");
      })
      .catch((error) => {
        console.error("Error writing data:", error);
      });
  }

  // writeUserData(
  //   1,
  //   "https://cdn3.dumyah.com/image/cache/data/2023/08/16930598521015171335-800x800.webp",
  //   "Headphones – Frozen",
  //   "Disney Frozen kids' stereo headphones, suitable for ages 3 and up.",
  //   15.90,
  //   4.6,
  //   "blue",
  //   "female",b
  //   "electronics"
  // )




// المتغيرات
let cardContainer = document.getElementById("cardContainer");

let firebaseDataArray = [];

// قراءة البيانات من Firebase
function getAllData() {
  const dbRef = ref(db); // الإشارة إلى الجذر (root)
  return get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val(); // جلب كل البيانات
        if (data.products) {
          firebaseDataArray = Object.values(data.products); // تخزين بيانات `products` فقط

        }
        return data;
      } else {
        console.log("No data found!");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      throw error;
    });
}

async function fetchProductsAndLog() {
  await getAllData();
  return firebaseDataArray;
}

fetchProductsAndLog();

// عرض بيانات المنتجات
getAllData().then((data) => {
  if (data && data.products) {
    for (let userId in data.products) {
      let product = data.products[userId];
      let dataItem = document.createElement("div");
      dataItem.innerHTML = `
          <div id="cardItem" class="card">
          <div class="col">
          <div class="card h-100">
            <img id="imgCard" src="${product.image}" class="card-img-top" alt="Product Image">
            <div id="textCardContainer" class="card-body text-center">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <div class="d-flex justify-content-between">
              <span class="fw-bold">$${product.price}</span>
              <span class="text-warning">&#9733;${product.rating}</span>
              </div>
              <div class="justify-content-around d-flex align-items-center">

              <button id="detailsButton" class="m-1 btn btn-pink" style="background-color: #f8d7da; color: #000;" data-id="${userId}"><a style="text-decoration: none; color:black" href="productDetails.html">More Details</a></button>
                <i id="favoriteButton" class="fs-4 fa-regular fa-heart"></i>
                </div>
                </div>
                </div>
                </div>
                </div>
                `;

      cardContainer.appendChild(dataItem);

      // إضافة حدث للزر "More Details"
      dataItem.querySelector("#detailsButton").addEventListener("click", () => {
        displayDetails(product);
      });

      // إضافة حدث للزر "Add to favorite"
      dataItem
        .querySelector("#favoriteButton")
        .addEventListener("click", () => {
          addToFavorites(product);
          dataItem.querySelector("#favoriteButton").style.color = "red";
        });
    }
  } else {
    console.log("No users found!");
  }
});



// add To Favorites
function addToFavorites(product) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.push(product);

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Product Details
let displayDetails = function (product) {
  console.log(product);
  localStorage.setItem("details", JSON.stringify(product));
};


// ----------------------filter feature----------------------

// --------Price filter


const dropDownItemsPrice = document.querySelectorAll(
  ".dropDownItemsPriceValue"
);

dropDownItemsPrice.forEach((item) => {
  item.addEventListener("click", (event) => {
    const selectedPriceValue = event.target.dataset.value;
    console.log(selectedPriceValue);
    PriceValue(selectedPriceValue);
  });
});

async function PriceValue(selectedPriceValue) {
  let filteredData = await fetchProductsAndLog();
  cardContainer.innerHTML = "";
  // تأكد من الفلترة بشكل صحيح قبل التكرار
  let filteredProducts = filteredData.filter(
    (product) => product.price <= selectedPriceValue
  );

  // بعد الفلترة، نضيف فقط المنتجات التي تطابق اللون المحدد
  filteredProducts.forEach((product) => {
    let proData = [product];
    proData.forEach((e) => {
      let dataItem = document.createElement("div");
      dataItem.innerHTML += `
      <div id="cardItem" class="card">
      <div class="col">
      <div class="card h-100">
      <img id="imgCard" src="${e.image}" class="card-img-top" alt="Product Image">
      <div id="textCardContainer" class="card-body text-center">
      <h5 class="card-title">${e.name}</h5>
      <p class="card-text">${e.description}</p>
            <div class="d-flex justify-content-between">
              <span class="fw-bold">$${e.price}</span>
              <span class="text-warning">&#9733;${e.rating}</span>
              </div>
              <div>
              <button id="detailsButton" class="m-1 btn btn-pink" style="background-color: #f8d7da; color: #000;" data-id="">
              <a style="text-decoration: none; color:black" href="productDetails.html">More Details</a>
              </button>
              <i id="favoriteButton" class="fs-4 fa-regular fa-heart"></i>

              </div>
              </div>
              </div>
      </div>
    </div>
    `;
      dataItem

        .querySelector("#favoriteButton")
        .addEventListener("click", () => {
          dataItem.querySelector("#favoriteButton").style.color = "red";
        });
      cardContainer.appendChild(dataItem); // أضف العنصر إلى الحاوية
    });
  });
}


// --------color filter 

const dropDownItems = document.querySelectorAll(".dropDownItemsColorValue");

dropDownItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const selectedValue = event.target.innerText;
    fetchAndPrint(selectedValue);
  });
});
async function fetchAndPrint(selectedValue) {
  let filteredData = await fetchProductsAndLog();
  cardContainer.innerHTML = "";
  // تأكد من الفلترة بشكل صحيح قبل التكرار
  let filteredProducts = filteredData.filter(
    (product) => product.color === selectedValue
  );

  // بعد الفلترة، نضيف فقط المنتجات التي تطابق اللون المحدد
  filteredProducts.forEach((product) => {
    let proData = [product];
    proData.forEach((e) => {
      let dataItem = document.createElement("div");
      dataItem.innerHTML += `
    <div id="cardItem" class="card">
    <div class="col">
        <div class="card h-100">
          <img id="imgCard" src="${e.image}" class="card-img-top" alt="Product Image">
          <div id="textCardContainer" class="card-body text-center">
            <h5 class="card-title">${e.name}</h5>
            <p class="card-text">${e.description}</p>
            <div class="d-flex justify-content-between">
              <span class="fw-bold">$${e.price}</span>
              <span class="text-warning">&#9733;${e.rating}</span>
            </div>
            <div>
              <button id="detailsButton" class="m-1 btn btn-pink" style="background-color: #f8d7da; color: #000;" data-id="">
                <a style="text-decoration: none; color:black" href="productDetails.html">More Details</a>
              </button>
              <i id="favoriteButton" class="fs-4 fa-regular fa-heart"></i>
            </div>
          </div>
          </div>
      </div>
      </div>
      `;
      cardContainer.appendChild(dataItem); // أضف العنصر إلى الحاوية
    });
  });
}


// --------gender filter 

const genderDropdownItems = document.querySelectorAll(".dropDownItemsgenderrValue");

genderDropdownItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const selectedValue = event.target.innerText;
    ColorfetchAndPrint(selectedValue);
  });
});
async function ColorfetchAndPrint(selectedValue) {
  let filteredData = await fetchProductsAndLog();
  cardContainer.innerHTML = "";
  // تأكد من الفلترة بشكل صحيح قبل التكرار
  let filteredProducts = filteredData.filter(
    (product) => product.gender === selectedValue
  );

  // بعد الفلترة، نضيف فقط المنتجات التي تطابق اللون المحدد
  filteredProducts.forEach((product) => {
    let proData = [product];
    proData.forEach((e) => {
      let dataItem = document.createElement("div");
      dataItem.innerHTML += `
      <div id="cardItem" class="card">
      <div class="col">
        <div class="card h-100">
        <img id="imgCard" src="${e.image}" class="card-img-top" alt="Product Image">
        <div id="textCardContainer" class="card-body text-center">
        <h5 class="card-title">${e.name}</h5>
        <p class="card-text">${e.description}</p>
            <div class="d-flex justify-content-between">
              <span class="fw-bold">$${e.price}</span>
              <span class="text-warning">&#9733;${e.rating}</span>
              </div>
              <div>
              <button id="detailsButton" class="m-1 btn btn-pink" style="background-color: #f8d7da; color: #000;" data-id="">
                <a style="text-decoration: none; color:black" href="productDetails.html">More Details</a>
              </button>
              <i id="favoriteButton" class="fs-4 fa-regular fa-heart"></i>

              </div>
              </div>
              </div>
              </div>
              </div>
              `;

      cardContainer.appendChild(dataItem); // أضف العنصر إلى الحاوية
    });
  });
}



// --------gender filter 

const dropDownItemsCityrValue = document.querySelectorAll(".dropDownItemsCityrValue");

dropDownItemsCityrValue.forEach((item) => {
  item.addEventListener("click", (event) => {
    const selectedValue = event.target.innerText;
    CityfetchAndPrint(selectedValue);
  });
});
async function CityfetchAndPrint(selectedValue) {
  let filteredData = await fetchProductsAndLog();
  cardContainer.innerHTML = "";
  // تأكد من الفلترة بشكل صحيح قبل التكرار
  let filteredProducts = filteredData.filter(
    (product) => product.type === selectedValue
  );

  // بعد الفلترة، نضيف فقط المنتجات التي تطابق اللون المحدد
  filteredProducts.forEach((product) => {
    let proData = [product];
    console.log(proData)
    proData.forEach((e) => {
      let dataItem = document.createElement("div");
      dataItem.innerHTML += `
    <div id="cardItem" class="card">
      <div class="col">
      <div class="card h-100">
      <img id="imgCard" src="${e.image}" class="card-img-top" alt="Product Image">
      <div id="textCardContainer" class="card-body text-center">
      <h5 class="card-title">${e.name}</h5>
      <p class="card-text">${e.description}</p>
      <div class="d-flex justify-content-between">
      <span class="fw-bold">$${e.price}</span>
      <span class="text-warning">&#9733;${e.rating}</span>
      </div>
      <div>
      <button id="detailsButton" class="m-1 btn btn-pink" style="background-color: #f8d7da; color: #000;" data-id="">
      <a style="text-decoration: none; color:black" href="productDetails.html">More Details</a>
      </button>
              <i id="favoriteButton" class="fs-4 fa-regular fa-heart"></i>
            </div>
            </div>
        </div>
      </div>
    </div>
    `;
      cardContainer.appendChild(dataItem); // أضف العنصر إلى الحاوية
    });
  });
}
///////////////////////////SearhBar Filr
// const data = [

//   "Vtech",

//   "Magical Fairy",

//   "To The Rescue",

//   "Jakks Pacific Sonic",

//   "Dog Plush with Posable",

//   "Minsa Football",

//   "Little",

//   "Watermelon",



// ];


// searchInput.addEventListener('input', () => {

//   const query = searchInput.value;

//   performSearch(query);

// });


// function displaySearchedProducts(){

//   let allData = getAllData() ;

//   allData.






// }



async function displaySearchedProducts(searchinput) {

  let arr = await fetchProductsAndLog();
  let filteredProducts = arr.filter(searched);

  function searched(prd) {

    if (prd.name == searchinput)
      return prd;

  }


  cardContainer.style.display = "none";
  filteredProducts.map((product) => {

    document.getElementById("searched-products").innerHTML = `<div id="cardItem" class="card">
          <div class="col">
          <div class="card h-100">
          <img id="imgCard" src="${product.image}" class="card-img-top" alt="Product Image">
          <div id="textCardContainer" class="card-body text-center">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <div class="d-flex justify-content-between">
          <span class="fw-bold">$${product.price}</span>
          <span class="text-warning">&#9733;${product.rating}</span>
          </div>
          <div>
          <button id="detailsButton" class="m-1 btn btn-pink" style="background-color: #f8d7da; color: #000;" data-id="">
          <a style="text-decoration: none; color:black" href="productDetails.html">More Details</a>
          </button>
                  <i id="favoriteButton" class="fs-4 fa-regular fa-heart"></i>
                </div>
      </div>
            </div>
          </div>
        </div>
        `;
  });




};

let searchIcon = document.getElementById("search-icn");
let searchinput;
searchIcon.addEventListener("click", () => {

  searchinput = document.getElementById("searchinputt").value;

  displaySearchedProducts(searchinput);

});









