const apiUrl = 'http://localhost:3500';

async function listProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = '';

    const response = await fetch(`${apiUrl}/items`);
    const products = await response.json();

    products.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">Ksh ${product.price}</p>
            <p class="desc">${product.description}</p>
            <img src="${product.image}" alt="${product.name}" width="100">
            <button class="edit-product-btn" data-id="${product.id}">Edit</button>
            <button class="delete-product-btn" data-id="${product.id}">Delete</button>
        `;
        productList.appendChild(productItem);
    });

    attachProductEventListeners();
}

function attachProductEventListeners() {
    document.querySelectorAll(".edit-product-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const productId = button.getAttribute("data-id");
            const response = await fetch(`${apiUrl}/items/${productId}`);
            const product = await response.json();

            const name = prompt("Edit Product Name:", product.name);
            const price = prompt("Edit Product Price:", product.price);
            const description = prompt("Edit Product Description:", product.description);
            const image = prompt("Edit Product Image URL:", product.image);

            if (name && price && description && image) {
                await fetch(`${apiUrl}/items/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        price: parseFloat(price),
                        description,
                        image
                    })
                });
                alert("Product updated successfully!");
                listProducts();
            }
        });
    });

    document.querySelectorAll(".delete-product-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const productId = button.getAttribute("data-id");
            const isConfirmed = confirm("Are you sure you want to delete this product?");

            if (isConfirmed) {
                await fetch(`${apiUrl}/items/${productId}`, { method: 'DELETE' });
                alert("Product deleted successfully!");
                listProducts();
            }
        });
    });
}

document.getElementById("create-product-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const description = document.getElementById("product-description").value;
    const image = document.getElementById("product-image").value;

    await fetch(`${apiUrl}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description, image })
    });

    alert("Product created successfully!");
    listProducts();
});

async function listUsers() {
    const userList = document.getElementById("user-list");
    userList.innerHTML = '';

    const response = await fetch(`${apiUrl}/users`);
    const users = await response.json();

    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.classList.add("user-item");
        userItem.innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <button class="edit-user-btn" data-id="${user.id}">Edit</button>
            <button class="delete-user-btn" data-id="${user.id}">Delete</button>
        `;
        userList.appendChild(userItem);
    });

    attachUserEventListeners();
}

function attachUserEventListeners() {
    document.querySelectorAll(".edit-user-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const userId = button.getAttribute("data-id");
            const response = await fetch(`${apiUrl}/users/${userId}`);
            const user = await response.json();

            const name = prompt("Edit User Name:", user.name);
            const email = prompt("Edit User Email:", user.email);

            if (name && email) {
                await fetch(`${apiUrl}/users/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email })
                });
                alert("User updated successfully!");
                listUsers();
            }
        });
    });

    document.querySelectorAll(".delete-user-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const userId = button.getAttribute("data-id");
            const isConfirmed = confirm("Are you sure you want to delete this user?");

            if (isConfirmed) {
                await fetch(`${apiUrl}/users/${userId}`, { method: 'DELETE' });
                alert("User deleted successfully!");
                listUsers();
            }
        });
    });
}

function showForm(formId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.style.display = section.id === formId ? 'block' : 'none';
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const targetFormId = link.getAttribute('href').substring(1);
        showForm(targetFormId);
    });
});

function logout() {
    localStorage.removeItem("user");
    alert("You have been logged out.");
    window.location.href = "login.html";
}

document.querySelector('#logout-button').addEventListener('click', function(event) {
    event.preventDefault();
    logout();
});

showForm('create-product');
listProducts();
listUsers();
