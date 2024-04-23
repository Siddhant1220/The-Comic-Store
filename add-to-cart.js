// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Select all the buttons with the class "add-to-cart"
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartTable = document.querySelector(".product-table");
  
    // Add click event listener to each button
    addToCartButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();
  
        // Get the product details from the clicked button's parent element
        const product = {
          image: button.parentElement.parentElement.querySelector("img").src,
          name: button.parentElement.parentElement.querySelector(".product-name").innerText,
          price: parseFloat(button.parentElement.parentElement.querySelector(".product-price").innerText.replace('$', '')),
          quantity: 1 // Default quantity, you can adjust this if needed
        };
  
        // Add the product to the cart
        addToCart(product);
      });
    });
  
    // Function to add the product to the cart
    function addToCart(product) {
      // Get the current cart items from local storage
      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
      // Check if the product is already in the cart
      const existingItemIndex = cartItems.findIndex(item => item.name === product.name);
  
      if (existingItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        cartItems[existingItemIndex].quantity += product.quantity;
      } else {
        // If the product is not in the cart, add it
        cartItems.push(product);
      }
  
      // Save the updated cart items to local storage
      localStorage.setItem("cart", JSON.stringify(cartItems));
  
      // Display the updated cart
      displayCart();
    }
  
    // Function to display the cart
    function displayCart() {
      // Get the cart items from local storage
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
      // Clear the previous cart items from the table
      cartTable.innerHTML = "";
  
      // Populate the table with the cart items
      cartItems.forEach(function (item, index) {
        const row = document.createElement("tr");
        row.classList.add("data");
  
        // Add product image
        const imgCell = document.createElement("td");
        const img = document.createElement("img");
        img.src = item.image;
        imgCell.appendChild(img);
        row.appendChild(imgCell);
  
        // Add product name
        const nameCell = document.createElement("td");
        nameCell.innerText = item.name;
        row.appendChild(nameCell);
  
        // Add product price
        const priceCell = document.createElement("td");
        priceCell.innerText = "$" + item.price.toFixed(2);
        row.appendChild(priceCell);
  
        // Add product quantity input
        const quantityCell = document.createElement("td");
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = 1;
        quantityInput.value = item.quantity;
        quantityInput.addEventListener("change", function () {
          // Update the quantity in the cart when the input changes
          cartItems[index].quantity = parseInt(quantityInput.value);
          localStorage.setItem("cart", JSON.stringify(cartItems));
          displayCart();
        });
        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);
  
        // Calculate total price for this item
        const totalCell = document.createElement("td");
        const total = item.price * item.quantity;
        totalCell.innerText = "$" + total.toFixed(2);
        row.appendChild(totalCell);
  
        // Add delete button
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", function () {
          // Remove the item from the cart and display the updated cart
          cartItems.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cartItems));
          displayCart();
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
  
        cartTable.appendChild(row);
      });
  
      // Update the cart subtotal
      updateSubtotal(cartItems);
    }
  
    // Function to calculate and display the subtotal of the cart
    function updateSubtotal(cartItems) {
      const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const subtotalCell = document.querySelector(".subtotal");
      subtotalCell.innerText = "$" + subtotal.toFixed(2);
  
      // Optionally, you can also update the total price, shipping cost, and any discounts here
      const totalCell = document.querySelector(".total");
      totalCell.innerText = "$" + subtotal.toFixed(2); // For now, let's assume the total is the same as the subtotal
    }
  
    // Display the initial cart when the page loads
    displayCart();
  });
  