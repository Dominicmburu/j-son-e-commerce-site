function loadCartItems() {
    const cartItemsDiv = document.getElementById("cart-items");
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;
  
    cartItemsDiv.innerHTML = '';
  
    cartData.forEach(item => {
      totalPrice += item.price * item.quantity;
  
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item');
      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity}</p>
        <p>Price: $${item.price}</p>
      `;
      cartItemsDiv.appendChild(itemDiv);
    });
  
    document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
  }
  
  function proceedToCheckout() {
    const userId = "306e";
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartData.length > 0) {
      const order = {
        userId: userId,
        items: cartData,
        totalAmount: cartData.reduce((acc, item) => acc + item.price * item.quantity, 0),
        status: 'Pending'
      };
  
      console.log("Order saved:", order);
  
      localStorage.setItem('cart', JSON.stringify([]));
      alert("Thank you for your order!");
      window.location.href = "index.html";
    } else {
      alert("Your cart is empty!");
    }
  }
  
  loadCartItems();
  