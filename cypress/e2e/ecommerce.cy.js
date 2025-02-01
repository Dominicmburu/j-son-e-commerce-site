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

  // it("Should add multiple items to the cart and update the cart count", () => {
  //   cy.intercept("GET", `${apiURL}/items`, {
  //     fixture: "db.json",
  //   }).as("getProducts");

  //   cy.visit("/index.html");

  //   cy.wait('@getProducts');

    // cy.get(".product").eq(0).find("button").click();
    // cy.get(".product").eq(1).find("button").click();

    // cy.get(".cart").should("contain", "Cart (2)");

    // cy.visit(`${apiURL}/cart.html`);

    // cy.get(".cart-item").should("have.length", 2);

    // cy.get(".cart-item")
    //   .eq(0)
    //   .find(".price")
    //   .invoke("text")
    //   .then((price1) => {
    //     cy.get(".cart-item")
    //       .eq(1)
    //       .find(".price")
    //       .invoke("text")
    //       .then((price2) => {
    //         const total =
    //           parseFloat(price1.replace("Ksh", "")) +
    //           parseFloat(price2.replace("Ksh", ""));
    //         cy.get("#totalPrice").should("contain", total.toFixed(2));
    //       });
    //   });
  // });

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
  

  it("Should increase quantity, decrease quantity, and remove items", () => {
    cy.get(".product").eq(1).find("button").click();

    cy.visit("/cart.html");

    cy.get(".cart-item").eq(1).find(".quantity .add").contains("+").click();
    cy.get(".cart-item").eq(1).find(".quantity span").should("contain", "2");

    cy.get(".cart-item").eq(1).find(".quantity .sub").contains("-").click();
    cy.get(".cart-item").eq(1).find(".quantity span").should("contain", "1");

    cy.get(".cart-item").eq(1).find("button").contains("Remove").click();
    cy.get(".cart-item").should("not.exist");
  });






  
  // it("Should proceed to checkout with items in the cart", () => {
  //   cy.get(".product").eq(0).find("button").click();
  //   cy.get(".product").eq(1).find("button").click();

  //   cy.visit("http://localhost:3000/cart.html");

  //   cy.get("button").contains("Proceed to Checkout").click();

  //   cy.on("window:alert", (text) => {
  //     expect(text).to.contains("Your order has been placed successfully!");
  //   });

  //   cy.get(".cart").should("contain", "Cart (0)");
  // });

});

