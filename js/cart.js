async function checkUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "login.html"; 
    }
    return user;
  }
  
  async function getCart(userId) {
    const response = await fetch(`http://localhost:3500/carts?userId=${userId}`);
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
      const createResponse = await fetch("http://localhost:3500/carts", {
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
      const uniqueItemCount =
        cart && cart.products
          ? cart.products.reduce((acc, product) => acc + product.quantity, 0)
          : 0;
      const cartCountElement = document.querySelector(".cart");
      cartCountElement.textContent = `Cart (${uniqueItemCount})`;
    });
  }
  
  function displayCartItems(cart) {
    const cartItemsElement = document.getElementById("cart-items");
    cartItemsElement.innerHTML = "";
  
    if (!cart || cart.products.length === 0) {
      cartItemsElement.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
  
    let totalPrice = 0;
  
    cart.products.forEach((product, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="product-details">
            <h4>${product.name}</h4>
            <p>Price: Ksh${product.price}</p>
            <div class="quantity">
              <button onclick="changeQuantity(${index}, -1)">-</button>
              <span>${product.quantity}</span>
              <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <button onclick="removeProduct(${index})">Remove</button>
          </div>
        `;
      cartItemsElement.appendChild(cartItem);
      totalPrice += product.price * product.quantity;
    });
  
    document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
  }
  
  async function changeQuantity(productIndex, change) {
    const user = await checkUserLoggedIn();
    const cart = await getCart(user.id);
  
    if (cart) {
      const product = cart.products[productIndex];
      if (product.quantity + change <= 0) {
        return;
      }
      product.quantity += change;
      await updateCartOnServer(cart);
      displayCartItems(cart);
      updateCartCount(user.id);
    }
  }
  
  async function removeProduct(productIndex) {
    const user = await checkUserLoggedIn();
    const cart = await getCart(user.id);
  
    if (cart) {
      cart.products.splice(productIndex, 1);
      await updateCartOnServer(cart);
      displayCartItems(cart);
      updateCartCount(user.id);
    }
  }
  
  async function proceedToCheckout() {
    const user = await checkUserLoggedIn();
    const cart = await getCart(user.id);
  
    if (!cart || cart.products.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  
    const order = {
      userId: user.id,
      products: cart.products,
      totalPrice: totalPrice,
      date: new Date(),
    };
  
    // Send the order to the server
    const response = await fetch("http://localhost:3500/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
  
    if (!response.ok) {
      console.error("Failed to place the order");
      return;
    }
  
    // Reset cart after successful order placement
    cart.products = [];
    await updateCartOnServer(cart);
  
    alert("Your order has been placed successfully!");
  
    // Redirect user to the home page or order confirmation page
    window.location.href = "index.html";
  }
  
  async function loadCart() {
    const user = await checkUserLoggedIn();
    const cart = await getCart(user.id);
    displayCartItems(cart);
    updateCartCount(user.id);
  }
  
  window.onload = function () {
    loadCart();
  };
  