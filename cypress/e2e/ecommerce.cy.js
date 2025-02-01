describe('Authentication Tests', () => {
  const apiURL = 'http://localhost:3000';

  beforeEach(() => {
    cy.visit("/login.html");
  });

  it('Should display the correct page title and UI elements', () => {
    cy.title().should('eq', 'E-commerce App');
    cy.get('.intro p').should('contain', 'You need to register or log in to make purchases.');
    cy.get('#loginForm').should('be.visible');
  });

  it('Should toggle between login and registration forms', () => {
    cy.get('#registerForm').should('not.have.class', 'active');
    cy.get('#loginForm').should('have.class', 'active');

    cy.get('.toggle-link').contains("Don't have an account? Register").click();
    cy.get('#registerForm').should('have.class', 'active');
    cy.get('#loginForm').should('not.have.class', 'active');

    cy.get('.toggle-link').contains('Already have an account? Login').click();
    cy.get('#loginForm').should('have.class', 'active');
    cy.get('#registerForm').should('not.have.class', 'active');
  });

  it('Should register a new user successfully', () => {
    cy.get('.toggle-link').contains("Don't have an account? Register").click();

    cy.get('#name').type('Shadow');
    cy.get('#email').type('shadow1@gmail.com');
    cy.get('#password').type('password');

    cy.intercept('POST', `${apiURL}/users`, {
      statusCode: 201,
      body: { id: 1, name: 'Test User', email: 'testuser@example.com', role: 'user' }
    }).as('registerRequest');

    cy.get('#registerForm button').click();
    cy.wait('@registerRequest').its('response.statusCode').should('eq', 201);
  });

  it('Should log in an existing user successfully', () => {
    cy.clearLocalStorage();
    cy.get('#loginEmail').type('shadow1@gmail.com');
    cy.get('#loginPassword').type('password');

    cy.intercept('GET', `${apiURL}/users`, {
      statusCode: 200,
      body: [{ id: 1, name: 'Test User', email: 'testuser@example.com', password: 'Test@123', role: 'user' }]
    }).as('loginRequest');

    cy.get('#loginForm button').click();
    cy.wait('@loginRequest');
    // cy.window().its('localStorage.userId').should('eq', '1');
  });

  it('Should show an alert for invalid login credentials', () => {
    cy.get('#loginEmail').type('wronguser@example.com');
    cy.get('#loginPassword').type('wrongpass');

    cy.intercept('GET', `${apiURL}/users`, {
      statusCode: 200,
      body: []
    }).as('invalidLogin');

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid credentials!');
    });

    cy.get('#loginForm button').click();
    cy.wait('@invalidLogin');
  });
});


describe("Cart Functionality", () => {
  const apiURL = 'http://localhost:3000';

  beforeEach(() => {
    cy.visit("/index.html");
    cy.clearLocalStorage();

    cy.window().then((win) => {
        win.localStorage.setItem(
          'user',
          JSON.stringify({"name":"Dominic","email":"dominicmburu034@gmail.com","id":"306e","password":"123456"})
        );
      });
    
      cy.reload();
  });

  it("Should add multiple items to the cart and update the cart count", () => {
    cy.request(`${apiURL}/items`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length.greaterThan(0);
    });
  
    cy.visit("/index.html");
  
    cy.get(".add-to-cart-button").eq(0).click();
    cy.get(".add-to-cart-button").eq(1).click();
  
    cy.get(".cart").should("have.text", "Cart (1)");
  });
  

  // it("Should increase quantity, decrease quantity, and remove items", () => {
  //   cy.get(".product").eq(3).find("button").click();

  //   cy.visit("/cart.html");

  //   cy.get(".cart-item").eq(2).find(".quantity .add").contains("+").click();
  //   cy.get(".cart-item").eq(2).find(".quantity span").should("contain", "2");

  //   cy.get(".cart-item").eq(2).find(".quantity .sub").contains("-").click();
  //   cy.get(".cart-item").eq(2).find(".quantity span").should("contain", "1");

  //   cy.get(".cart-item").eq(2).find("button").contains("Remove").click();
  //   cy.get(".cart-item").should("not.exist");
  // });


  it("Should proceed to checkout with items in the cart", () => {

    cy.visit("/cart.html");

    cy.get("button").contains("Proceed to Checkout").click();

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Your order has been placed successfully!");
    });

    cy.get(".cart").should("contain", "Cart (0)");
  });

});


describe('Admin Dashboard Tests', () => {
  const apiUrl = 'http://localhost:3000';
  
  let adminUser = {
    email: 'admin@admin.com',
    password: 'admin123'
  };


  it('Should log in with valid admin credentials', () => {
    cy.clearLocalStorage();
    cy.visit('/login.html');
    cy.get('#loginEmail').type(adminUser.email);
    cy.get('#loginPassword').type(adminUser.password);

    cy.get('#loginForm button').click();

    cy.url().should('include', '/admin.html');
    cy.contains('Admin Dashboard').should('be.visible');
  });

  beforeEach(() => {
    cy.visit('/admin.html');
  });

  it('Should allow admin to create a new product', () => {
    cy.get('#product-name').type('Test Product');
    cy.get('#product-price').type('100');
    cy.get('#product-description').type('This is a test product.');
    cy.get('#product-image').type('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiKqt1gxUhlrGQETU6KKxJdHpfV-WXLTcOsQ&s');

    cy.get('#create-product-form button').click();

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Product created successfully!");
    });
  });

  it('Should show the new product in the product list', () => {
    cy.contains('Manage Product').click();

    cy.contains('Test Product').should('be.visible');
    cy.contains('100').should('be.visible');
    cy.contains('This is a test product.').should('be.visible');
  });
});


