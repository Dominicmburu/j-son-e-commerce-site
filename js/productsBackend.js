function checkUserLoggedIn() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
  }
}

checkUserLoggedIn();

async function getProducts() {
  const response = await fetch("http://localhost:3000/items");
  if (!response.ok) {
    console.error("Failed to fetch products");
    return [];
  }
  const products = await response.json();
  return products;
}

function displayProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product");
    productItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${
        product.description || "Short description of the product goes here."
      }</p>
      <div class="price">Ksh${product.price}</div>
      <button onclick="addToCart(${product.id}, '${product.name}', ${
      product.price
    }, '${product.image}')">Add to Cart</button>
    `;
    productList.appendChild(productItem);
  });
}

async function loadProducts() {
  const products = await getProducts();
  displayProducts(products);
}

async function addToCart(id, name, price, image) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must be logged in to add items to the cart.");
    return;
  }

  let cart = await getCart(user.id);

  if (!cart) {
    cart = { userId: user.id, products: [] };
  }

  const existingProductIndex = cart.products.findIndex(
    (product) => product.id === id
  );
  if (existingProductIndex === -1) {
    cart.products.push({ id, name, price, image, quantity: 1 });
  } else {
    cart.products[existingProductIndex].quantity += 1;
  }

  await updateCartOnServer(cart);

  updateCartCount(user.id);
  alert(`${name} has been added to your cart`);
}

async function getCart(userId) {
  const response = await fetch(`http://localhost:3000/carts?userId=${userId}`);
  if (!response.ok) {
    console.error("Failed to fetch cart");
    return null;
  }
  const carts = await response.json();
  return carts.length > 0 ? carts[0] : null;
}

async function updateCartOnServer(cart) {
  const existingCart = await getCart(cart.userId);

  if (!existingCart) {
    const createResponse = await fetch("http://localhost:3000/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    if (!createResponse.ok) {
      console.error("Failed to create cart on server");
    }
  } else {
    const updateResponse = await fetch(
      `http://localhost:3000/carts/${existingCart.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      }
    );

    if (!updateResponse.ok) {
      console.error("Failed to update cart on server");
    }
  }
}

function updateCartCount(userId) {
  getCart(userId).then((cart) => {
    const uniqueItemCount = cart && cart.products ? cart.products.reduce((acc, product) => acc + product.quantity, 0) : 0; 
    const cartCountElement = document.querySelector(".cart");
    cartCountElement.textContent = `Cart (${uniqueItemCount})`;
  });
}

window.onload = function () {
  loadProducts();
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    updateCartCount(user.id);
  }
};
