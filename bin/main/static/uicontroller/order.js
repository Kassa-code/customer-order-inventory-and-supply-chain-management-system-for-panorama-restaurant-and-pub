// Create a browser window load event listener
// This code runs only after the entire page (HTML, CSS, JS) has fully loaded
window.addEventListener("load", () => {

  // Call the function to refresh or load the order table data
  refreshOrderTable();

  // Call the function to reset or prepare the order form for new input
  refreshOrderForm();
});


// Call refreshOrderTable() inside browser load, submit, update, and delete functions
const refreshOrderTable = () => {

  // Fetch order data from the backend using a reusable service function
  // The function getServiceRequest sends a GET request to the endpoint and returns the data
  let orders = getServiceRequest("/order/alldata");

  // Define the list of properties (columns) to be shown in the order table
  // Each object specifies what property to show and how to handle its data
  // - "string", "decimal" are standard types handled directly
  // - "function" means a custom function will generate the value for that column
  let propertyList = [
    { propertyName: "order_code", dataType: "string" },
    { propertyName: "date", dataType: "string" },
    { propertyName: generateOrderType, dataType: "function" },
    { propertyName: generateCustomerName, dataType: "function" },
    { propertyName: generateCustomerContactNo, dataType: "function" },
    { propertyName: "total_amount", dataType: "decimal" },
    { propertyName: "net_charge", dataType: "decimal" },
    { propertyName: generateOrderStatus, dataType: "function" }
  ];

  // Fill the HTML table with the retrieved data
  // Parameters:
  // - tableOrderBody: the HTML table body where rows will be added
  // - orders: the order data list
  // - propertyList: list of column definitions
  // - OrderFormRefill: function to refill form when editing
  // - orderDelete: function to delete an order
  // - OrderView: function to view order details
  fillDataIntoTable(
    tableOrderBody,
    orders,
    propertyList,
    OrderFormRefill,
    orderDelete,
    OrderView
  );

  // Iterate over each liquormenu entry to check for special conditions
  for (const index in orders) {
    // If the liquormenu status is "Discontinued", hide its update button in the row
    if (orders[index].order_status_id.name === "Complete" || orders[index].order_status_id.name === "Cancelled") {
      // Traverse DOM to find the update button for this row and hide it using "d-none" class
      tableOrderBody.children[index].lastChild.children[0].children[1].children[0]
        .children[1].classList.add("d-none");
    }
    if (orders[index].order_status_id.name === "Complete" || orders[index].order_status_id.name === "Cancelled") {
      // Traverse DOM to find the update button for this row and hide it using "d-none" class
      tableOrderBody.children[index].lastChild.children[0].children[1].children[0]
        .children[0].classList.add("d-none");
    }
    if (orders[index].order_type_id.name === "Take Away") {
      // Traverse DOM to find the update button for this row and hide it using "d-none" class
      tableOrderBody.children[index].lastChild.children[0].children[1].children[0]
        .children[0].classList.add("d-none");
    }
  }

  // Initialize DataTables plugin for this table (adds features like search, pagination, sorting)
  $("#tableOrder").DataTable();
}

// Function to generate the order type from the data object
const generateOrderType = (dataOb) => {
  // Access and return the order type name using the order_type_id reference
  return dataOb.order_type_id.name;
}

// Function to generate the customer name from the data object
const generateCustomerName = (dataOb) => {
  // Access and return the customer's name using the customer_id reference
  return dataOb.customer_id.name;
}

// Function to generate the customer contact number from the data object
const generateCustomerContactNo = (dataOb) => {
  // Access and return the customer's contact number using the customer_id reference
  return dataOb.customer_id.contactno;
}




// Function to generate the order status icon based on the status name
const generateOrderStatus = (dataOb) => {

  // Check if the order status is "Pending"
  if (dataOb.order_status_id.name == "New") {
    return (
      // Return an orange receipt icon to indicate "Pending" status
      "<i class='fa-solid fa-circle-dot fa-lg text-primary'></i>"
    );
  }
  if (dataOb.order_status_id.name == "In Progress") {
    return (
      // Return an orange receipt icon to indicate "Pending" status
      "<i class='fa-solid fa-spinner fa-lg text-warning'></i>"
    );
  }
  if (dataOb.order_status_id.name == "Ready") {
    return (
      // Return an orange receipt icon to indicate "Pending" status
      "<i class='fa-solid fa-bell fa-lg text-info'></i>"
    );
  }

  // Check if the order status is "Completed"
  if (dataOb.order_status_id.name == "Complete") {
    return (
      // Return a green receipt icon to indicate "Completed" status
      "<i class='fa-solid fa-check-circle fa-lg text-success'></i>"
    );
  }

  // Check if the order status is "Cancelled"
  if (dataOb.order_status_id.name == "Cancelled") {
    return (
      // Return a red receipt icon to indicate "Cancelled" status
      "<i class='fa-solid fa-times-circle fa-lg text-danger'></i>"
    );
  }
}


// Create refresh form area function
const refreshOrderForm = () => {

  // Initialize a new object to store the Order details
  order = new Object();
  order.orderHasitemList = new Array(); // Prepare array to hold cart items
  order.orderHasIngredientList = new Array(); // Prepare array to hold cart items

  cart = [];

  // Fetch submenu, liquormenu, and menu data from backend
  let submenus = getServiceRequest('/submenu/activelist');
  let liquormenus = getServiceRequest('/liquormenu/activelist');
  let menus = getServiceRequest('/menu/activelist');

  // Generate menu cards dynamically and render them in their respective containers
  // Parameters: (data, container ID, item type)
  createMenuCard(submenus, 'subMenuCardContainer', 'submenu');
  createMenuCard(liquormenus, 'liquorMenuCardContainer', 'liquormenu');
  createMenuCard(menus, 'menuCardContainer', 'menu');

  // Reset the HTML form (clear all inputs)
  formorder.reset();

  // Assign form input elements to variables for easier access
  const dteOrderDate = document.getElementById("dteOrderDate");
  const selectOrderType = document.getElementById("selectOrderType");
  const textMobile = document.getElementById("textMobile");
  const textCustomerName = document.getElementById("textCustomerName");
  const selectTable = document.getElementById("selectTable");
  const selectWaitor = document.getElementById("selectWaitor");
  const textAddress = document.getElementById("textAddress");
  const textCityName = document.getElementById("textCityName");
  const textServiceCharge = document.getElementById("textServiceCharge");
  const textDeliveryCharge = document.getElementById("textDeliveryCharge");
  const textTotalAmount = document.getElementById("textTotalAmount");
  const textNetAmount = document.getElementById("textNetAmount");
  const selectOrderStatus = document.getElementById("selectOrderStatus");
  const textNote = document.getElementById("textNote");

  // Reset all specified fields to default state using helper function
  setDefault([
    dteOrderDate,
    selectOrderType,
    textMobile,
    textCustomerName,
    selectTable,
    selectWaitor,
    textAddress,
    textCityName,
    textServiceCharge,
    textDeliveryCharge,
    textTotalAmount,
    textNetAmount,
    selectOrderStatus,
    textNote
  ]);

  // Fetch dropdown data from backend for select options
  let ordertypes = getServiceRequest("ordertype/alldata");
  let tables = getServiceRequest("dineintable/alldata");
  let waitors = getServiceRequest("/employee/waitorlistbyunassigned");
  let orderstatuses = getServiceRequest("orderstatus/alldata");

  // Fill order type dropdown with data
  fillDataIntoSelect(selectOrderType, "Please Select Order Type", ordertypes, "name");

  // Fill table dropdown with data
  fillDataIntoSelect(selectTable, "Please Select Table", tables, "number");

  // Fill waitor dropdown with data
  fillDataIntoSelect(selectWaitor, "Please Select Waitor", waitors, "fullname");

  // Fill order status dropdown with data
  fillDataIntoSelect(selectOrderStatus, "Please Select Status", orderstatuses, "name");

  // Set default selected status as the first one and assign it to the order object
  selectOrderStatus.value = JSON.stringify(orderstatuses[0]);
  order.order_status_id = orderstatuses[0];

  // Style the order status dropdown to appear valid
  selectOrderStatus.classList.remove("is-invalid");
  selectOrderStatus.classList.add("is-valid");
  selectOrderStatus.style.border = "2px solid green";
  selectOrderStatus.style.backgroundColor = "#c6f6d5";

  // Show the Submit button and hide the Update button
  btnOrderUpdate.classList.add("d-none");
  btnOrderSubmit.classList.add("d-none");

  // Get today's date and format it as yyyy-mm-dd
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Add leading zero if month/day is single digit
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  const formattedToday = `${year}-${month}-${day}`;

  // Set order date input field to today's date and restrict to today only
  dteOrderDate.min = formattedToday;
  dteOrderDate.max = formattedToday;
  dteOrderDate.value = formattedToday;
  order.date = dteOrderDate.value;

  // Style the date field to appear valid
  dteOrderDate.classList.remove("is-invalid");
  dteOrderDate.classList.add("is-valid");
  dteOrderDate.style.border = "2px solid green";
  dteOrderDate.style.backgroundColor = "#c6f6d5";

  // Disable the input field to prevent editing since it's system-generated
  textTotalAmount.value = "";
  textTotalAmount.disabled = "disabled";

  textNetAmount.value = "";
  textNetAmount.disabled = "disabled";

  textServiceCharge.value = "";
  textServiceCharge.disabled = "disabled";

  textDeliveryCharge.value = "";
  textDeliveryCharge.disabled = "disabled";

}


// Function to create menu cards dynamically and render them inside a container
const createMenuCard = (items, containerId, itemType) => {
  // Get the container element by its ID where cards will be placed
  const cardWrapper = document.getElementById(containerId);

  // Clear any existing content inside the container before adding new cards
  cardWrapper.innerHTML = '';

  // Loop over each menu item in the given list
  items.forEach((item) => {
    // Create a column div with Bootstrap classes for layout
    const col = document.createElement("div");
    col.className = "col-md-3";

    // Create the card container div with custom styling and shadow
    const card = document.createElement("div");
    card.className = "card custom-menu-card shadow-sm mb-3";

    // Determine which image and price fields to use based on the item type
    let photoField, priceField;
    switch (itemType) {
      case 'submenu':
        photoField = item.submenu_photo;
        priceField = item.submenu_price;
        break;
      case 'liquormenu':
        photoField = item.liquormenuphoto;
        priceField = item.liquormenuprice;
        break;
      case 'menu':
        photoField = item.menu_photo;
        priceField = item.price;
        break;
      default:
        photoField = '';
        priceField = 0;
    }

    // Decode the base64 encoded image string for displaying the image
    let imgSrc = atob(photoField);

    // Create an image element and set its source and styling
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "card-img-top";
    img.alt = item.name || "Image";  // Provide alt text for accessibility

    // Create a div for the card body with padding
    const cardBody = document.createElement("div");
    cardBody.className = "card-body p-2";

    // Create an element for the item name/title with truncation for long text
    const titleElem = document.createElement("h6");
    titleElem.className = "card-title text-truncate mb-1";
    titleElem.style.fontSize = "0.75rem";
    titleElem.textContent = item.name;

    // Create a paragraph element to show the price with styling
    const priceElem = document.createElement("p");
    priceElem.className = "text-muted small mb-2 fw-bold";
    priceElem.textContent = `Rs. ${priceField}`;

    // Create the "Add to Cart" shopping cart icon with styles
    const addToCart = document.createElement("i");
    addToCart.className = "fa-solid fa-cart-shopping float-end";
    addToCart.style.color = "#007bff";
    addToCart.style.cursor = "pointer";
    addToCart.title = "Add to Cart"; // Tooltip on hover

    // Define the click event for the Add-to-Cart icon
    addToCart.onclick = () => {
      // Prepare item details object to send to cart handler
      const itemDetails = {
        name: item.name,
        price: priceField,
        photo: photoField,
        item_type: itemType,
        is_confirm: false
      };
      // Call the function to open the main cart and add this item
      openMainCart(itemDetails);
    };

    // Build the card by appending title, price, and cart icon to card body
    cardBody.appendChild(titleElem);
    cardBody.appendChild(priceElem);
    cardBody.appendChild(addToCart);

    // Append the image and card body to the card container
    card.appendChild(img);
    card.appendChild(cardBody);

    // Append the card to the column wrapper
    col.appendChild(card);

    // Append the column to the main card wrapper container in the DOM
    cardWrapper.appendChild(col);
  });
}


// --- CART FUNCTIONALITY ---

// Array to hold the cart items; each item is an object with details and quantity
let cart = [];

// Function to add an item to the cart and display the cart UI
const openMainCart = (item) => {
  // Check if the item already exists in the cart by matching the name
  /* const existingItem = cart.find(c => c.name === item.name);
 
    if (existingItem) {
     // If item exists, increase its quantity by 1
     existingItem.qty += 1;
   } else {
     // If item doesn't exist, add a new item object with quantity set to 1
     cart.push({ ...item, qty: 1 });
   } */

  cart.push({ ...item, qty: 1 });
  // Refresh the cart UI to show updated items and quantities
  displayCartItems();

  // Open the cart panel (offcanvas) using Bootstrap's Offcanvas component
  const cartOffCanvas = new bootstrap.Offcanvas(document.getElementById('cartOffCanvas'));
  cartOffCanvas.show();
}

// Render cart items in the cart UI container
const displayCartItems = () => {
  // Get the container element where cart items will be displayed
  const container = document.getElementById("cartItemsContainer");

  // Clear any existing cart content before rendering new items
  container.innerHTML = "";

  // Initialize grand total price for all cart items
  let grandTotal = 0;

  // Loop through each item in the cart array
  cart.forEach((item, index) => {
    // Calculate total price for the current item (price * quantity)
    const itemTotal = item.price * item.qty;
    item.line_price = itemTotal;
    // Add current item's total price to the grand total
    grandTotal += itemTotal;
    let decodedPhoto = "";
    // Decode base64 image string for the item photo
    if (item.photo != null)
      decodedPhoto = atob(item.photo);
    else
      decodedPhoto = "/images/476.jpg"
    // Create a wrapper div for the cart item with flex layout and styling
    const wrapper = document.createElement("div");
    wrapper.className = "d-flex align-items-center mb-3 border-bottom pb-2";

    /*   <button class="btn btn-sm btn-outline-secondary px-2 me-1" onclick="changeQty(${index}, -1)">−</button>*/

    /*  <span class="px-2">${item.qty}</span> */

    /*    <button class="btn btn-sm btn-outline-secondary px-2 ms-1" onclick="changeQty(${index}, 1)">+</button> */

    // Build the inner HTML structure of the cart item
    wrapper.innerHTML = `
      <img src="${decodedPhoto}" alt="${item.name}" width="50" height="50" class="me-2 rounded" />
      <div class="flex-grow-1">
        <div class="fw-semibold small text-truncate">${item.name}</div> <!-- Item name -->
        <div class="text-muted small">Rs. ${item.price}</div>           <!-- Item unit price -->
        <div class="d-flex align-items-center mt-1">
          <!-- Button to decrease quantity -->
       
          <!-- Current quantity display -->


          <!-- Button to increase quantity -->
       
          <!-- Button to remove item from cart -->
          <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeItem(${index})">
            <i class="fa-solid fa-trash"></i>
          </button>

          <!-- Total price for this item -->
          <span class="ms-auto fw-semibold small">Rs. ${itemTotal}</span>
        </div>
      </div>
    `;

    // Append the cart item wrapper div to the container in the DOM
    container.appendChild(wrapper);
  });


  cart.forEach((item, index) => {
    if (item.is_confirm) {
      const buttonElement = cartItemsContainer.children[index].children[1].children[2].children[0];
      buttonElement.disabled = true; // disable button
      buttonElement.classList.add("d-none"); // hide button
    }
  });


  // Update the grand total price display in the UI
  document.getElementById("cartGrandTotal").textContent = `Rs. ${grandTotal}`;
  document.getElementById("textTotalAmount").value = `${grandTotal}`;
  calculateNetAmount();
}

// Adjust quantity of a cart item by delta (can be positive or negative)
const changeQty = (index, delta) => {
  // Update the quantity of the item at the given index
  cart[index].qty += delta;

  // If quantity becomes zero or less, remove the item from the cart
  if (cart[index].qty <= 0) cart.splice(index, 1);

  // Re-render the cart UI to reflect changes
  displayCartItems();
}

// Remove a specific item from the cart by its index
const removeItem = (index) => {
  // Remove the item at the given index from the cart array
  cart.splice(index, 1);

  // Refresh the cart UI after removal
  displayCartItems();
}

// Select the order type dropdown element by its ID
const selectOrderTypeElement = document.querySelector("#selectOrderType");

selectOrderTypeElement.addEventListener("change", () => {
  const orderTypeName = selectOrderTypeElement.options[selectOrderTypeElement.selectedIndex].text.trim().toLowerCase();

  // Visual feedback
  selectOrderTypeElement.classList.remove("is-invalid");
  selectOrderTypeElement.classList.add("is-valid");
  selectOrderTypeElement.style.border = "2px solid green";
  selectOrderTypeElement.style.backgroundColor = "#c6f6d5";

  const dineInFields = ["colTableNo", "colEmployee", "colServiceCharge"];
  const deliveryFields = ["colAddress", "ColCity", "colDeliveryCharge"];
  

  if (orderTypeName === "dine in") {
    // Show dine-in fields
    dineInFields.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
    // Hide delivery fields
    deliveryFields.forEach(id => document.getElementById(id)?.classList.add("d-none"));


    // Show submit, hide payment button
    btnMakePayment.classList.add("d-none");
    btnOrderSubmit.classList.remove("d-none");

  } else if (orderTypeName === "delivery") {
    // Show delivery fields
    deliveryFields.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
    // Hide dine-in fields
    dineInFields.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    // Show submit, hide payment button
    btnMakePayment.classList.add("d-none");
    btnOrderSubmit.classList.remove("d-none");

  } else if (orderTypeName === "pick up") {
    // Hide both dine-in and delivery fields
    dineInFields.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    deliveryFields.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    // Show both buttons
    btnMakePayment.classList.add("d-none");  // Show payment button
    btnOrderSubmit.classList.remove("d-none");     // Hide submit button;

  }else {
    // Unknown order type: hide all specific fields
    dineInFields.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    deliveryFields.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    

    btnMakePayment.classList.remove("d-none");
    btnOrderSubmit.classList.add("d-none");
  }
});


// Define function for waitors who have not been assigned to more than 3 pending orders
/*const filterAvailableWaitors = () => {
  // Fetch all suppliers from the backend API
  let waitors = getServiceRequest("employee/availablewaitors" + JSON.parse(selectWaitor.value).id);
  // Populate the Supplier dropdown with data fetched from the backend

  fillDataIntoSelect(selectWaitor, "Please Select Waitor", waitors, "fullname");
}*/

const calculateNetAmount = () => {

  if (selectOrderTypeElement.value != "") {
    let totalAmount = parseFloat(textTotalAmount.value);
    textTotalAmount.classList.remove("is-invalid");
    textTotalAmount.classList.add("is-valid");
    textTotalAmount.style.border = "2px solid green";
    textTotalAmount.style.backgroundColor = "#c6f6d5";
    const orderType = JSON.parse(selectOrderTypeElement.value).name.trim().toLowerCase();
    console.log(orderType);
    console.log(textTotalAmount.value);

    console.log(totalAmount);


    let serviceAmount = 0;
    let deliveryAmount = 0;

    // Apply order type specific charges
    if (orderType === "dine in") {
      serviceAmount = totalAmount * 0.1; // 10% service charge
      textServiceCharge.classList.remove("is-invalid");
      textServiceCharge.classList.add("is-valid");
      textServiceCharge.style.border = "2px solid green";
      textServiceCharge.style.backgroundColor = "#c6f6d5";
    } else if (orderType === "delivery") {
      deliveryAmount = 200; // Fixed delivery charge
      textDeliveryCharge.classList.remove("is-invalid");
      textDeliveryCharge.classList.add("is-valid");
      textDeliveryCharge.style.border = "2px solid green";
      textDeliveryCharge.style.backgroundColor = "#c6f6d5";
    }
    // Pickup / Takeaway: no charges, both remain 0

    // Update the fields
    textServiceCharge.value = serviceAmount.toFixed(2);
    textDeliveryCharge.value = deliveryAmount.toFixed(2);

    const netAmount = totalAmount + serviceAmount + deliveryAmount;
    textNetAmount.value = netAmount.toFixed(2);

    // Optional: visual feedback
    textNetAmount.classList.remove("is-invalid");
    textNetAmount.classList.add("is-valid");
    textNetAmount.style.border = "2px solid green";
    textNetAmount.style.backgroundColor = "#c6f6d5";

    // Optional: update order object
    if (typeof order !== "undefined") {

      order.total_amount = totalAmount.toFixed(2);
      order.service_charge = serviceAmount.toFixed(2);
      order.delivery_charge = deliveryAmount.toFixed(2);
      order.net_charge = netAmount.toFixed(2);
    }
  }

};

const resetSelectStyle = (selectElement) => {
  selectElement.classList.remove("is-valid", "is-invalid");
  selectElement.style.border = "";
  selectElement.style.backgroundColor = "";
}

// Function to refill the order form when editing an existing order
const OrderFormRefill = (ob, index) => {
  console.log("Edit", ob, index);

  dteOrderDate.value = ob.date;
  resetSelectStyle(dteOrderDate);

  textMobile.value = ob.customer_id.contactno;
  resetSelectStyle(textMobile);

  textCustomerName.value = ob.customer_id.name;
  resetSelectStyle(textCustomerName);

  selectOrderType.value = JSON.stringify(ob.order_type_id);
  selectOrderType.dispatchEvent(new Event("change"));
  resetSelectStyle(selectOrderType);


  if (JSON.parse(selectOrderType.value).name == "Dine In") {
    // Fetch list of available dine-in tables from the server endpoint
    let dineInTables = getServiceRequest("/dineintable/availabletable");
    // Populate the select dropdown with the available tables
    dineInTables.push(ob.dinein_table_id);
    fillDataIntoSelect(selectTable, "Please Select Table", dineInTables, "number");


    if (ob.dinein_table_id) {
      selectTable.value = JSON.stringify(ob.dinein_table_id);
    } else {
      selectTable.value = "";
    }
  }
  if (ob.dinein_table_id && ob.dinein_table_id.employee_id) {
    selectWaitor.value = JSON.stringify(ob.employee_id);
  } else {
    selectWaitor.value = "";
  }

  textAddress.value = ob.delivery_address ? ob.delivery_address : "";
  textCityName.value = ob.city ? ob.city : "";

  textServiceCharge.value = ob.service_charge ? ob.service_charge : "";
  textDeliveryCharge.value = ob.delivery_charge ? ob.delivery_charge : "";

  textTotalAmount.value = ob.total_amount;

  textNetAmount.value = ob.net_charge;
  resetSelectStyle(textNetAmount);

  selectOrderStatus.value = JSON.stringify(ob.order_status_id);
  selectOrderStatus.disabled = "disabled";
  resetSelectStyle(selectOrderStatus);

  textNote.value = ob.note ? ob.note : "";

  order = JSON.parse(JSON.stringify(ob));
  oldOrder = JSON.parse(JSON.stringify(ob));

  btnOrderUpdate.classList.remove("d-none");
  btnOrderSubmit.classList.add("d-none");


  cart = order.orderHasitemList;

  // Refresh the cart UI to show updated items and quantities
  displayCartItems();

  // Open the cart panel (offcanvas) using Bootstrap's Offcanvas component
  const cartOffCanvas = new bootstrap.Offcanvas(document.getElementById('cartOffCanvas'));
  cartOffCanvas.show();

  $("#offcanvasMenuForm").offcanvas("show");
  // $("#offcanvasOrderForm").offcanvas("show");
};


// Define function to delete an order
const orderDelete = (dataOb, index) => {
  // Show confirmation dialog using SweetAlert2 to confirm deletion
  // The dialog displays key order details to the user for clarity
  Swal.fire({
    title: "Are you sure to remove the following Order?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🧾🔢 <b>Order Code No:</b> " + dataOb.order_code + "<br>" +
      "📱🏢 <b>Mobile No:</b> " + dataOb.customer_id.contactno + "<br>" +
      "🙍‍♂️📦 <b>Customer :</b> " + dataOb.customer_id.name + "<br>" +
      "📋📅 <b>Order Type:</b> " + dataOb.order_type_id.name + "<br>" +
      "💵💰 <b>Total Amount:</b> " + dataOb.total_amount +
      "</div>",
    icon: "warning",           // Warning icon for deletion
    showCancelButton: true,    // Show Cancel button alongside Confirm
    width: "20em",             // Dialog width
    confirmButtonColor: "#3085d6", // Confirm button color (blue)
    cancelButtonColor: "#d33",     // Cancel button color (red)
    confirmButtonText: "Yes, Delete Order" // Confirm button text
  }).then((result) => {
    // If user confirms deletion
    if (result.isConfirmed) {
      // Send DELETE HTTP request to backend to delete the order
      let deleteResponse = getHTTPServiceRequest("/order/delete", "DELETE", dataOb);

      if (deleteResponse === "OK") {
        // On successful deletion, show success message for 1.5 seconds without confirmation button
        Swal.fire({
          icon: "success",
          width: "20em",
          title: "Deleted!",
          text: "Order deleted successfully.",
          timer: 1500,
          showConfirmButton: false
        });

        // Refresh the orders table and reset the order form
        refreshOrderTable();
        refreshOrderForm();

        // Hide the order view offcanvas panel
        $("#offcanvasOrderView").offcanvas("hide");
      } else {
        // If deletion failed, show error message with returned response details
        Swal.fire({
          icon: "error",
          width: "20em",
          title: "Delete Failed",
          html: "❌ Something went wrong!<br><br><code>" + deleteResponse + "</code>",
          confirmButtonColor: "#d33"
        });
      }
    }
  });
}

// ===== Cache order info elements =====
const tdOrderCode = document.getElementById("tdOrderCode");
const tdDate = document.getElementById("tdDate");
const tdCustomer = document.getElementById("tdCustomer");
const tdContactNo = document.getElementById("tdContactNo");
const tdOrderType = document.getElementById("tdOrderType");
const tdStatus = document.getElementById("tdStatus");

// ===== OrderView Function =====
const OrderView = (ob, index) => {
  // Set basic order info
  tdOrderCode.innerText = ob.order_code || "-";
  tdDate.innerText = ob.date || "-";
  tdCustomer.innerText = ob.customer_id?.name || "N/A";
  tdContactNo.innerText = ob.customer_id?.contactno || "N/A";
  tdOrderType.innerText = ob.order_type_id?.name || "N/A";
  tdStatus.innerText = ob.order_status_id?.name || "N/A";

  // Containers
  const itemsList = document.getElementById("orderItemsList");
  const chargesSummary = document.getElementById("orderChargesSummary");

  itemsList.innerHTML = "";
  chargesSummary.innerHTML = "";

  const orderType = ob.order_type_id?.name?.toLowerCase() || "";

  if (Array.isArray(ob.orderHasitemList) && ob.orderHasitemList.length > 0) {
    // Header row
    const headerRow = document.createElement("div");
    headerRow.style.display = "flex";
    headerRow.style.justifyContent = "space-between";
    headerRow.style.fontWeight = "bold";
    headerRow.style.borderBottom = "1px solid #ccc";
    headerRow.style.paddingBottom = "5px";
    headerRow.innerHTML = `
      <div style="flex: 4;">Item</div>
      <div style="flex: 1; text-align: center;">Q</div>
      <div style="flex: 2; text-align: right;">U/P</div>
      <div style="flex: 2; text-align: right;">L/P</div>
    `;
    itemsList.appendChild(headerRow);

    // ===== Group same-name items =====
    const groupedItems = {};
    ob.orderHasitemList.forEach(item => {
      if (!groupedItems[item.name]) {
        groupedItems[item.name] = {
          name: item.name,
          qty: 0,
          price: parseFloat(item.price),
          line_price: 0
        };
      }
      groupedItems[item.name].qty += parseFloat(item.qty);
      groupedItems[item.name].line_price += parseFloat(item.line_price);
    });
    const groupedArray = Object.values(groupedItems);

    // Add grouped rows
    groupedArray.forEach(item => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.padding = "5px 0";
      row.style.borderBottom = "1px dotted #ddd";

      row.innerHTML = `
        <div style="flex: 4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
        <div style="flex: 1; text-align: center;">${item.qty}</div>
        <div style="flex: 2; text-align: right;">Rs. ${item.price.toFixed(2)}</div>
        <div style="flex: 2; text-align: right;">Rs. ${item.line_price.toFixed(2)}</div>
      `;
      itemsList.appendChild(row);
    });

    // ===== Charges Summary =====
    let chargesHTML = "";
    if (orderType === "dine in" && ob.service_charge > 0) {
      chargesHTML += `<div>Service Charge: Rs. ${parseFloat(ob.service_charge).toFixed(2)}</div>`;
    }
    if (orderType === "delivery" && ob.delivery_charge > 0) {
      chargesHTML += `<div>Delivery Charge: Rs. ${parseFloat(ob.delivery_charge).toFixed(2)}</div>`;
    }
    chargesHTML += `
      <div style="margin-top: 10px; border-top: 2px solid #000; padding-top: 8px; font-weight: bold;">
        <div>Total Amount: Rs. ${parseFloat(ob.total_amount).toFixed(2)}</div>
        <div>Net Amount: Rs. ${parseFloat(ob.net_charge).toFixed(2)}</div>
      </div>
    `;
    chargesSummary.innerHTML = chargesHTML;

  } else {
    itemsList.innerHTML = "<p>No items found.</p>";
    chargesSummary.innerHTML = "";
  }

  // Show Offcanvas
  $("#offcanvasOrderView").offcanvas("show");
};

// ===== Print Function =====
const buttonPrintRow = () => {
  const offcanvasBody = document.querySelector("#offcanvasOrderView .offcanvas-body");
  if (!offcanvasBody) {
    alert("Order details content not found.");
    return;
  }
  const clone = offcanvasBody.cloneNode(true);
  const printButtonDiv = clone.querySelector("div.text-end.mt-4");
  if (printButtonDiv) printButtonDiv.remove();

  const contentHTML = clone.innerHTML;

  const printHTML = `
    <html>
      <head>
        <title>Print Order Bill</title>
        <style>
          body { font-family: 'Montserrat', sans-serif; background: #f9f9f9; margin: 0; padding: 20px; display: flex; justify-content: center; }
          .print-container { background: #fff; border: 3px solid #333; border-radius: 12px; max-width: 700px; width: 100%; padding: 30px 40px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); box-sizing: border-box; color: #222; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin: 0; font-weight: 700; font-size: 2.2rem; letter-spacing: 2px; color: #2c3e50; }
          .section p { margin: 8px 0; font-size: 1rem; }
          #orderItemsList > div:first-child { font-weight: 700; border-bottom: 2px solid #333; padding-bottom: 6px; margin-bottom: 10px; }
          #orderItemsList > div:not(:first-child) { border-bottom: 1px dotted #bbb; padding: 6px 0; display: flex; justify-content: space-between; font-size: 1rem; color: #333; }
          #orderItemsList > div > div:nth-child(1) { flex: 4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          #orderItemsList > div > div:nth-child(2) { flex: 1; text-align: center; }
          #orderItemsList > div > div:nth-child(3), #orderItemsList > div > div:nth-child(4) { flex: 2; text-align: right; }
          #orderChargesSummary { font-size: 1.15rem; font-weight: 700; margin-top: 20px; padding-top: 15px; border-top: 3px solid #333; color: #2c3e50; }
          .footer { margin-top: 40px; text-align: center; font-style: italic; font-size: 1rem; color: #666; letter-spacing: 0.03em; }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h1>PANAROMA RESTAURANT & PUB</h1>
          </div>
          <div class="section">
            ${contentHTML}
          </div>
          <div class="footer">
            Thank you! Come again.
          </div>
        </div>
      </body>
    </html>
  `;

  const newWindow = window.open();
  newWindow.document.write(printHTML);
  newWindow.document.close();
  setTimeout(() => {
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  }, 700);
};

// Function to validate supplier payment form inputs and collect error messages
const checkFormError = () => {
  // Initialize an empty string to store error messages
  let formInputErrors = "";

  // Check if contact number is missing
  if (order.contactno == null) {
    formInputErrors += "❗📞🏢 Please Enter Contact No...! \n";
  }

  // Check if customer name is missing
  if (order.name == null) {
    formInputErrors += "❗🧾📄 Please Enter Name...! \n";
  }

  // Check if order type is not selected
  if (order.order_type_id == null) {
    formInputErrors += "❗🛒💳 Please Select Order Type...! \n";
  }

  // If order type is "Dine In", validate related fields
  if (order.order_type_id.name === "Dine In") {
    // Check if table number is not selected
    if (order.dinein_table_id == null) {
      formInputErrors += "❗🍽️📝 Please Select Table...! \n";
    }
    // Check if waiter is not selected
    if (order.employee_id == null) {
      formInputErrors += "❗🧑‍🍳📅 Please Select Waitor...! \n";
    }
  }
  if (order.order_type_id.name === "Delivery") {
    // Check if delivery address is missing
    if (order.delivery_address == null) {
      formInputErrors += "❗🏠📝 Please Enter Delivery Address...! \n";
    }
    // Check if city is missing
    if (order.city == null) {
      formInputErrors += "❗🌆📅 Please Enter City...! \n";
    }
  }

  // Check if total amount is missing
  if (order.total_amount == null) {
    formInputErrors += "❗💵💰 Please Enter Total Amount...! \n";
  }

  // Check if net amount is missing
  if (order.net_charge == null) {
    formInputErrors += "❗🧾💰 Please Enter Net Amount...! \n";
  }

  // Return the full string of collected error messages (empty if no errors)
  return formInputErrors;
}


// Function to handle form submission for a new Order (Good Receive Note)
const buttonMenuOrderSubmit = () => {
  // if (order.customer_id != null) {
  //   if (order.name != null && order.contactno != null) {
  //     order.customer_id = { name: order.name, contactno: order.contactno };
  //   }
  // }

  if (order.name != null && order.contactno != null) {
    order.customer_id = { name: order.name, contactno: order.contactno };
  } else {
    order.customer_id = null;
  }

  order.orderHasitemList = cart;
  console.log(order); // Log current order object for debugging

  // Step 1: Validate the form inputs using the checkFormError function
  let errors = checkFormError();

  if (errors === "") {
    // If no validation errors, show confirmation dialog to the user
    Swal.fire({
      title: "Are you sure to add the following Order?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "📱🏢 <b>Mobile No:</b> " + order.contactno + "<br>" +
        "🙍‍♂️📦 <b>Customer :</b> " + order.name + "<br>" +
        "📋📅 <b>Order Type:</b> " + order.order_type_id.name + "<br>" +
        "💵💰 <b>Total Amount:</b> " + order.total_amount +
        "</div>",
      icon: "warning",            // Warning icon to show this is a confirmation step
      width: "20em",              // Set dialog width
      showCancelButton: true,     // Show Cancel button alongside Confirm
      confirmButtonColor: "#3085d6", // Confirm button color (blue)
      cancelButtonColor: "#d33",      // Cancel button color (red)
      confirmButtonText: "Yes, Add Order" // Confirm button text
    }).then((result) => {
      // If user clicks confirm
      if (result.isConfirmed) {
        // Step 3: Send POST request to backend to insert the new order
        let postResponse = getHTTPServiceRequest("/order/insert", "POST", order);

        if (postResponse === "OK") {
          // If submission successful, show success message briefly
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 2000,             // Auto-close after 1.5 seconds
            showConfirmButton: false
          });

          window.location.reload();
          /* // Refresh form and table to reflect new data
          refreshOrderForm();
          refreshOrderTable();


          // Refresh the cart UI to show updated items and quantities
          // displayCartItems();

          // Open the cart panel (offcanvas) using Bootstrap's Offcanvas component

$("#offcanvasOrderForm").offcanvas("hide");
         $("#cartOffCanvas").offcanvas("hide");
          $("#offcanvasMenuForm").offcanvas("hide"); */

        } else {
          // If backend returns error, show error dialog with details
          Swal.fire({
            icon: "error",
            width: "20em",
            title: "Failed to Submit",
            html: "<pre>" + postResponse + "</pre>"
          });
        }
      }
    });
  } else {
    // Step 4: If validation errors exist, show them in a warning dialog
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form has following errors",
      // Display errors, replacing newline characters with HTML line breaks for formatting
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      confirmButtonColor: "#3085d6"
    });
  }
}

// Function to check if any form values have changed compared to the original data
const checkFormUpdate = () => {
  let updates = ""; // String to collect messages about what fields have changed

  // Make sure both the current order and the original order objects exist
  if (order != null && oldOrder != null) {

    // Compare order types
    if (order.order_type_id.name != oldOrder.order_type_id.name) {
      updates += "🛒📅 Order Type is changed..! \n";
    }

    // Compare dine-in table numbers
    if (order.dinein_table_id.number != oldOrder.dinein_table_id.number) {
      updates += "🍽️🧾 Dine In Table is changed..! \n";
    }

    // Compare assigned employee (waiter)
    if (order.dinein_table_id.employee_id.fullname != oldOrder.dinein_table_id.employee_id.fullname) {
      updates += "🧑‍🍳💼 Employee is changed..! \n";
    }

    // Compare delivery addresses
    if (order.delivery_address != oldOrder.delivery_address) {
      updates += "🏠📍 Delivery Address is changed..! \n";
    }

    // Compare cities for delivery
    if (order.city != oldOrder.city) {
      updates += "🌆🏙️ City is changed..! \n";
    }


    // Compare service charges
    if (order.service_charge != oldOrder.service_charge) {
      updates += "🛎️📉 Service Charge is changed..! \n";
    }

    // Compare delivery charges
    if (order.delivery_charge != oldOrder.delivery_charge) {
      updates += "🚚📉 Delivery Charge is changed..! \n";
    }

    // Compare total amounts
    if (order.total_amount != oldOrder.total_amount) {
      updates += "💰📉 Total Amount is changed..! \n";
    }

    // Compare net charge amounts
    if (order.net_charge != oldOrder.net_charge) {
      updates += "🧾💵 Net Amount is changed..! \n";
    }

    // Compare order statuses
    if (order.order_status_id.name != oldOrder.order_status_id.name) {
      updates += "⚙️📊 Status is changed..! \n";
    }
  }

  // Return the string listing all detected changes; empty if no changes found
  return updates;
}


// Function to handle the update action for the order form
const buttonOrderUpdate = () => {
  // Step 0: Assign the current cart items to the order object
  // (Ensures that order has the latest item list from the cart before updating)
  order.orderHasitemList = [];
  order.orderHasitemList = cart;
  if (oldOrder.customer_id != null) {
    order.name = oldOrder.customer_id.name
    order.contactno = oldOrder.customer_id.contactno;
  }

  // Step 1: Validate the form fields
  // If any validation errors are found, they will be returned as a newline-separated string
  let errors = checkFormError();

  if (errors == "") {
    // Step 2: Check if any actual changes were made to the form compared to original data
    // Returns a string with a list of changes, or an empty string if nothing was modified
    let updates = checkFormUpdate();

    if (updates == "") {
      // No changes were detected – show an informational alert and exit
      Swal.fire({
        title: "No Updates",
        text: "Nothing to update..!",
        icon: "info",
        width: "20em",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Changes were detected – ask user for confirmation with a formatted list of changes
      Swal.fire({
        title: "Are you sure you want to update the following changes?",
        html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>", // format line breaks
        icon: "warning",
        width: "20em",
        showCancelButton: true,           // Allow user to cancel the operation
        confirmButtonColor: "#3085d6",    // Blue confirm button
        cancelButtonColor: "#d33",        // Red cancel button
        confirmButtonText: "Yes, Update Order"
      }).then((result) => {
        // If user confirmed the update
        if (result.isConfirmed) {
          // Step 3: Send a PUT request to update the order in the backend
          let putResponse = getHTTPServiceRequest("/order/update", "PUT", order);

          if (putResponse == "OK") {
            // Update succeeded – show success message and refresh UI
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500
            });

            // Refresh the data table and form, then hide the offcanvas form panel
            //refreshOrderTable();
           // refreshOrderForm();
           // $("#offcanvasOrderForm").offcanvas("hide");

            window.location.reload();
          } else {
            // Update failed – show error with response content
            Swal.fire({
              title: "Failed to update!",
              html: "<pre>" + putResponse + "</pre>", // preserves formatting
              icon: "error",
              width: "20em",
              showConfirmButton: false,

            });
          }
        }
      });
    }
  } else {
    // Step 4: Validation errors were found – show them in a formatted warning alert
    Swal.fire({
      title: "Form has following errors!",
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>", // format line breaks
      icon: "warning",
      width: "20em",
      showConfirmButton: false,
      timer: 2000
    });
  }
}


// Function to clear and reset the order form after user confirmation
const clearOrderForm = () => {
  // Show a confirmation dialog to prevent accidental form clearing
  Swal.fire({
    title: "Are you sure to refresh the form?",  // Prompt message
    icon: "question",                            // Question icon to indicate user decision
    width: "20em",                               // Set dialog width for better appearance
    showCancelButton: true,                      // Display cancel button
    confirmButtonColor: "#3085d6",               // Blue color for confirm button
    cancelButtonColor: "#d33",                   // Red color for cancel button
    confirmButtonText: "Yes, Clear Form",        // Label for confirm button
    cancelButtonText: "Cancel"                   // Label for cancel button
  }).then((result) => {
    // If user confirms the action
    if (result.isConfirmed) {
      // Call your predefined function to reset/clear the form fields
      refreshOrderForm();

      // Show a success message indicating the form was cleared
      Swal.fire({
        title: "Form cleared!",                  // Success title
        icon: "success",                         // Success icon
        width: "20em",                           // Consistent width
        timer: 1200,                             // Auto-dismiss after 1.2 seconds
        showConfirmButton: false,                // No confirm button
        draggable: true                          // Allow user to drag the popup
      });
    }
    // If user cancels, nothing happens (form stays as is)
  });
};


// Function to open a new window and print a formatted customer bill
const printBill = () => {
  // Check if the global 'order' object exists
  // If not, alert the user and exit the function
  if (!order) {
    alert("No order selected to print.");
    return;
  }

  // Extract customer name from order, fallback to "N/A" if undefined
  const customerName = order.customer_id?.name || "N/A";
  // Extract customer contact number, fallback to "N/A"
  const contactNo = order.customer_id?.contactno || "N/A";
  // Extract order code or use "-" if not available
  const orderCode = order.order_code || "-";
  // Extract order date or use "-"
  const orderDate = order.date || "-";
  // Extract order type name or use "-"
  const orderType = order.order_type_id?.name || "-";
  const totalAmount = (parseFloat(order.total_amount) || 0).toFixed(2);
  const serviceCharge = (parseFloat(order.service_charge) || 0).toFixed(2);
  const deliveryCharge = (parseFloat(order.delivery_charge) || 0).toFixed(2);
  const netAmount = (parseFloat(order.net_charge) || 0).toFixed(2);

  // Determine payment status: if payment_id exists, mark as "PAID", else "UNPAID"
  const paymentStatus = order.payment_id ? "PAID" : "UNPAID";

  // Open a new browser window/tab to display the printable bill
  let newWindow = window.open();

  // Prepare the HTML content for the printable bill, using template literals to inject data
  let printContent = `
    <html>
      <head>
        <title>Print Bill</title>
        <!-- Link to Bootstrap CSS for styling -->
        <link rel="stylesheet" href="../../Resources/bootstrap-5.2.3/css/bootstrap.min.css">
        <style>
          /* Body styles for the print page */
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 20px;
            background-color: #f5f5f5;
          }
          /* Container for the bill content */
          .bill-container {
            background-color: white;
            padding: 25px;
            border-radius: 10px;
            width: 100%;
            max-width: 600px;
            margin: auto;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          }
          /* Heading styles */
          h2, h4 {
            text-align: center;
            margin-bottom: 20px;
          }
          /* Section spacing */
          .bill-section {
            margin-bottom: 15px;
          }
          /* Label styles within sections */
          .bill-section strong {
            display: inline-block;
            width: 150px;
          }
          /* Styling the summary table */
          .summary-table {
            width: 100%;
            margin-top: 15px;
          }
          /* Table cell padding and border */
          .summary-table td {
            padding: 6px 10px;
            border-top: 1px solid #ccc;
          }
          /* Highlight the last row (usually the total) */
          .summary-table tr:last-child td {
            font-weight: bold;
            font-size: 1.1em;
          }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <!-- Restaurant name and bill title -->
          <h2>PANAROMA RESTAURANT & PUB</h2>
          <h4>Customer Bill</h4>

          <!-- Order details section -->
          <div class="bill-section">
            <strong>Order Code:</strong> ${orderCode}<br>
            <strong>Date:</strong> ${orderDate}<br>
            <strong>Order Type:</strong> ${orderType}<br>
            <strong>Payment Status:</strong> ${paymentStatus}
          </div>

          <!-- Customer details section -->
          <div class="bill-section">
            <strong>Customer:</strong> ${customerName}<br>
            <strong>Contact No:</strong> ${contactNo}
          </div>

          <!-- Price summary table -->
          <table class="summary-table">
            <tr><td>Total Amount</td><td class="text-end">Rs. ${totalAmount}</td></tr>
            <tr><td>Service Charge</td><td class="text-end">Rs. ${serviceCharge}</td></tr>
            <tr><td>Delivery Charge</td><td class="text-end">Rs. ${deliveryCharge}</td></tr>
            <tr><td>Net Amount</td><td class="text-end">Rs. ${netAmount}</td></tr>
          </table>

          <!-- Thank you note centered -->
          <div class="text-center mt-4">
            <p>Thank you come again!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Write the prepared HTML content to the new window's document
  newWindow.document.write(printContent);
  // Close the document stream to finish loading content
  newWindow.document.close();

  // After a short delay, focus the new window, trigger print dialog, then close the window
  setTimeout(() => {
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  }, 1000);
}

// Fetches the list of waitors who are currently not assigned to any table,
// then fills the 'selectWaitor' dropdown with these waitors,
// displaying their full names and adding a default option "Please Select Waitor".
const waitorListBytableUnAssigned = () => {
  // Get the list of unassigned waitors from the server endpoint
  let waitors = getServiceRequest("/employee/waitorlistbyunassigned");
  // Populate the select dropdown with the retrieved waitors
  fillDataIntoSelect(selectWaitor, "Please Select Waitor", waitors, "fullname");
}


// Filters and fetches available tables only if the current order type is "Dine In".
// After fetching, it populates the 'selectTable' dropdown with the available tables,
// showing their table numbers and adding a default "Please Select Table" option.
const filterAvailableTables = () => {
  // Parse the selected order type from the dropdown's value (JSON string)
  if (JSON.parse(selectOrderType.value).name == "Dine In") {
    // Fetch list of available dine-in tables from the server endpoint
    let dineInTables = getServiceRequest("/dineintable/availabletable");
    // Populate the select dropdown with the available tables
    fillDataIntoSelect(selectTable, "Please Select Table", dineInTables, "number");
  }
}


// Function to initialize and refresh the take-away payment section based on the current order
const refreshTakeAwayPayment = () => {
  // Initialize a new payment object and link it to the current order
  customerpayment = new Object();
  order.orderHasitemList = cart;
  if (order.customer_id == null) {

    order.customer_id = { name: order.name, contactno: order.contactno };
  }
  customerpayment.order_process_id = order;

  // Set total amount input field and customerpayment property with formatted order total
  textPTotalAmount.value = parseFloat(order.total_amount).toFixed(2);
  customerpayment.total_amount = parseFloat(order.total_amount).toFixed(2);

  // Fetch all available payment methods from the server
  let paymentmethods = getServiceRequest('customerpaymentmethod/alldata');
  // Fetch all available payment statuses from the server
  let paymentstatuses = getServiceRequest('customerpaymentstatus/alldata');

  // Populate payment method dropdown with 'name' property from fetched data
  fillDataIntoSelect(selectPaymentMethod, "Please Select Payment Method", paymentmethods, "name");
  // Populate payment status dropdown with 'name' property from fetched data
  fillDataIntoSelect(selectPaymentStatus, "Status of the Payment", paymentstatuses, "name");

  // Mark the total amount input field as valid with green border
  textPTotalAmount.classList.remove("is-invalid");
  textPTotalAmount.classList.add("is-valid");
  textPTotalAmount.style.border = "2px solid green";
  textPTotalAmount.style.backgroundColor = "#c6f6d5";


  // Set the payment status dropdown to default to the first status in the list
  selectPaymentStatus.value = JSON.stringify(paymentstatuses[2]);
  // Assign the selected payment status object to the customerpayment
  customerpayment.payment_status_id = paymentstatuses[2];

  // Style the payment status dropdown to indicate a valid selection
  selectPaymentStatus.classList.remove("is-invalid");
  selectPaymentStatus.classList.add("is-valid");
  selectPaymentStatus.style.border = "2px solid green";
  selectPaymentStatus.style.backgroundColor = "#c6f6d5";
}

// Function to calculate and update the paid amount and balance fields based on the selected payment method
const calculatePayAmountAndBalanceBypayMethod = () => {

  // Check if the selected payment method is "Card"
  if (JSON.parse(selectPaymentMethod.value).name == "Card") {

    // Set paid amount equal to total amount and balance to zero, formatted to 2 decimals
    textPaidAmount.value = parseFloat(textPTotalAmount.value).toFixed(2);
    textBalanceAmount.value = parseFloat(0).toFixed(2);

    // Update the customerpayment object accordingly
    customerpayment.paid_amount = parseFloat(textPTotalAmount.value).toFixed(2);
    customerpayment.balance_amount = parseFloat(0).toFixed(2);

    // Disable input fields for paid amount and balance to prevent editing
    textPaidAmount.disabled = "disabled";
    textBalanceAmount.disabled = "disabled";

    // Enable the payment submit button
    buttonPaymentSubmit.disabled = "";

    // Add valid styling to paid amount input
    textPaidAmount.classList.remove("is-invalid");
    textPaidAmount.classList.add("is-valid");
    textPaidAmount.style.border = "2px solid green";
    textPaidAmount.style.backgroundColor = "#c6f6d5";

    // Add valid styling to balance amount input
    textBalanceAmount.classList.remove("is-invalid");
    textBalanceAmount.classList.add("is-valid");
    textBalanceAmount.style.border = "2px solid green";
    textBalanceAmount.style.backgroundColor = "#c6f6d5";

  } else {
    // For payment methods other than card, enable the paid amount input field
    textPaidAmount.disabled = "";
  }
}



// Function to automatically calculate and update the balance amount based on the paid amount input
const calculateBalanceAmount = () => {

  // Check if the paid amount is greater than or equal to the total amount
  if (parseFloat(textPaidAmount.value) >= parseFloat(textPTotalAmount.value)) {

    // Calculate the balance as the difference between paid amount and total amount
    let paid_amount = parseFloat(textPaidAmount.value);
    textBalanceAmount.value = (paid_amount - parseFloat(textPTotalAmount.value)).toFixed(2);

    // Update the customerpayment object's balance_amount with the calculated balance
    customerpayment.balance_amount = parseFloat(textBalanceAmount.value).toFixed(2);

    // Disable the balance amount input field to prevent editing
    textBalanceAmount.disabled = "disabled";

    // Mark the paid amount input as valid with green border
    textPaidAmount.classList.remove("is-invalid");
    textPaidAmount.classList.add("is-valid");
    textPaidAmount.style.border = "2px solid green";
    textPaidAmount.style.backgroundColor = "#c6f6d5";

    // Mark the balance amount input as valid with green border
    textBalanceAmount.classList.remove("is-invalid");
    textBalanceAmount.classList.add("is-valid");
    textBalanceAmount.style.border = "2px solid green";
    textBalanceAmount.style.backgroundColor = "#c6f6d5";

    // Enable the payment submit button since inputs are valid
    buttonPaymentSubmit.disabled = "";

  } else {
    // If paid amount is less than total, clear payment info and mark inputs invalid

    // Reset balance and paid amount in customerpayment object
    customerpayment.balance_amount = null;
    customerpayment.paid_amount = null;

    // Mark the paid amount input as invalid with red border
    textPaidAmount.classList.remove("is-valid");
    textPaidAmount.classList.add("is-invalid");
    textPaidAmount.style.border = "2px solid red";
    textPaidAmount.style.backgroundColor = "#f8d7da";

    // Clear the balance amount input field value
    textBalanceAmount.value = "";

    // Remove any valid/invalid classes and reset border style on balance amount input
    textBalanceAmount.classList.remove("is-valid");
    textBalanceAmount.classList.add("is-invalid");
    textBalanceAmount.style.border = "2px solid red";
    textBalanceAmount.style.backgroundColor = "#f8d7da";

    // Disable the payment submit button due to invalid input
    buttonPaymentSubmit.disabled = "disabled";

  }
}

// Function to validate supplier payment form inputs and gather error messages
const checkPaymentFormError = () => {
  // Initialize an empty string to accumulate error messages
  let formInputErrors = "";

  // Check if order details (order_process_id) are missing
  if (customerpayment.order_process_id == null) {
    formInputErrors += "⚠️📋 Please enter the order details! \n";
  }

  // Check if payment method is not selected
  if (customerpayment.payment_method_id == null) {
    formInputErrors += "⚠️💳 Please select a payment method! \n";
  }

  // Check if total amount is missing
  if (customerpayment.total_amount == null) {
    formInputErrors += "⚠️💵 Please enter the total amount! \n";
  }

  // Check if paid amount is missing
  if (customerpayment.paid_amount == null) {
    formInputErrors += "⚠️💸 Please enter the paid amount! \n";
  }

  // Return the concatenated error messages (empty string if no errors)
  return formInputErrors;
}

const buttonCustomerPaymentSubmit = () => {

  // Log the current customer payment object for debugging
  console.log(customerpayment);

  // Step 1: Validate the form inputs using the checkPaymentFormError function
  let errors = checkPaymentFormError();

  if (errors === "") {
    // If no validation errors, show confirmation dialog to the user
    Swal.fire({
      title: "Are you sure to add the following Order?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "📱🏢 <b>Mobile No:</b> " + customerpayment.order_process_id.contactno + "<br>" +
        "🙍‍♂️📦 <b>Customer :</b> " + customerpayment.order_process_id.name + "<br>" +
        "📋📅 <b>Order Total Amount:</b> " + customerpayment.total_amount + "<br>" +
        "💵💰 <b>Paid Amount:</b> " + customerpayment.paid_amount +
        "</div>",
      icon: "warning",                // Warning icon for confirmation prompt
      width: "20em",                  // Set dialog width for better display
      showCancelButton: true,         // Include cancel button alongside confirm
      confirmButtonColor: "#3085d6",  // Blue confirm button
      cancelButtonColor: "#d33",      // Red cancel button
      confirmButtonText: "Yes, Add Order" // Confirm button text
    }).then((result) => {
      // If user confirms submission
      if (result.isConfirmed) {
        // Step 3: Send POST request to backend to insert the new order payment
        let postResponse = getHTTPServiceRequest("/customerpayment/tworderpaymentinsert", "POST", customerpayment);

        if (postResponse === "OK") {
          // If submission successful, show success message briefly
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,               // Auto-close after 1.5 seconds
            showConfirmButton: false
          });

          // Refresh the form and order table to reflect the new data
          refreshTakeAwayPayment();
          refreshOrderForm();
          refreshOrderTable();

          // Close various UI panels/offcanvas to return user to main view
          $("#offcanvasCustomerPaymentForm").offcanvas("hide");
          $("#cartOffCanvas").offcanvas("hide");
          $("#offcanvasOrderForm").offcanvas("hide");
          $("#offcanvasMenuForm").offcanvas("hide");
        } else {
          // If backend returns an error, show error dialog with the message
          Swal.fire({
            icon: "error",
            width: "20em",
            title: "Failed to Submit",
            html: "<pre>" + postResponse + "</pre>"
          });
        }
      }
    });
  } else {
    // Step 4: If validation errors exist, show them in a warning dialog
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form has following errors",
      // Display errors with line breaks for readability
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      confirmButtonColor: "#3085d6"
    });
  }
}


/* Getcustomer buy constact number */
const customerByContactNo = () => {
  if (order.contactno != null) {
    let customer = getServiceRequest("/customer/bycontactno/" + order.contactno);
    if (customer != null && customer.id != null) {
      console.log(customer);

      order.customer_id = customer;
      textCustomerName.value = customer.name;
      order.name = customer.name;
      textCustomerName.classList.remove("is-invalid");
      textCustomerName.classList.add("is-valid");
      textCustomerName.style.border = "2px solid green";
      textCustomerName.style.backgroundColor = "#c6f6d5";
    }

  }
}