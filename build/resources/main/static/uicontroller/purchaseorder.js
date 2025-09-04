//Create browser load event
window.addEventListener("load", () => {

  refreshPurchaseOrderTable();
  refreshPurchaseOrderForm();
});

// Create refresh table area function
// Call refreshPurchaseOrderTable() in browser, submit, update, delete functions
const refreshPurchaseOrderTable = () => {


  // Fetch purchase order data using the getServiceRequest common function

  let purchaseorders = getServiceRequest("/purchaseorder/alldata");

  // Create columns array and objects for each column
  // string ===> string / date / number
  // function ===> object / array / boolean
  let propertyList = [
    { propertyName: "order_code", dataType: "string" },
    { propertyName: generateSupplierName, dataType: "function" },
    { propertyName: "delivery_date", dataType: "string" },
    { propertyName: "total_amount", dataType: "decimal" },
    { propertyName: generateOrderStatus, dataType: "function" }

  ];

  // Call fillDataIntoTable(tableBodyId, dataList, propertyList, formRefill, deleteFunction, viewFunction)
  // and pass the parameters;
  fillDataIntoTable(
    tablePurchaseOrderBody, // Table body element ID
    purchaseorders, // Data list containing purchase order records
    propertyList, // List of column configurations
    purchaseOrderFormRefill, // Function to refill form data when editing
    purchaseOrderDelete, // Function to delete a purchase order
    purchaseOrderView // Function to view purchase order details
  );

  // Iterate over each liquormenu entry to check for special conditions
  for (const index in purchaseorders) {
    // If the liquormenu status is "Discontinued", hide its update button in the row
    if (purchaseorders[index].supplierpurchaseorder_status_id.name === "Received") {
      // Traverse DOM to find the update button for this row and hide it using "d-none" class
      tablePurchaseOrderBody.children[index].lastChild.children[0].children[1].children[0].children[0].style.display = "none";
      tablePurchaseOrderBody.children[index].lastChild.children[0].children[1].children[0].children[1].style.display = "none";
    }

    
  }


  $("#tablePurchaseOrder").DataTable(); // Initialize DataTable for the purchase order table

};

// Function to generate the supplier name from the data object
const generateSupplierName = (dataOb) => {
  // Access and return the supplier name from the data object
  return dataOb.supplier_id.suppliername;
}


// Function to generate the order status icon based on the status name
const generateOrderStatus = (dataOb) => {
  // Check if the order status is "Pending"
  if (dataOb.supplierpurchaseorder_status_id.name == "Pending") {
    return (
      // Orange list-check icon for "Pending" status
      "<i class='fa-solid fa-list-check fa-lg text-warning'></i>"
    );
  }

  // Check if the order status is "Completed"
  if (dataOb.supplierpurchaseorder_status_id.name == "Received") {
    return (
      // Green list-check icon for "Completed" status
      "<i class='fa-solid fa-list-check fa-lg text-success'></i>"
    );
  }

  // Check if the order status is "Removed"
  if (dataOb.supplierpurchaseorder_status_id.name == "Cancelled") {
    return (
      // Red list-check icon for "Removed" status
      "<i class='fa-solid fa-list-check fa-lg text-danger'></i>"
    );
  }
}


// Create refresh form area function
const refreshPurchaseOrderForm = () => {
  // Create a new object to store purchase order details
  purchaseOrder = new Object();
  purchaseOrder.purchaseOrderHasItemList = new Array(); // Initialize an empty array to hold items within the purchase order
  formPurchaseOrder.reset(); // Reset all form inputs to their default values

  // Set default values for the form fields using the setDefault function
  setDefault([
    selectSupplier, // Supplier dropdown
    dteRequiredDate, // Date input for the required date
    textTotalAmount, // Text input for the total amount
    selectPurchaseOrderStatus, // Dropdown for purchase order status
    textNote // Text input for additional notes
  ]);

  // Fetch all suppliers from the backend API endpoint
  let suppliers = getServiceRequest("supplier/alldata");

  // Fetch all purchase order statuses from the backend API endpoint
  let purchaseOrderStatuses = getServiceRequest("purchaseorderstatus/alldata");

  // Populate the Supplier dropdown with data fetched from the backend
  fillDataIntoSelect(
    selectSupplier, // The HTML <select> element for Supplier
    "Please Select Supplier", // Default placeholder option
    suppliers, // Data array containing available suppliers
    "suppliername" // The key used to display supplier names in the dropdown
  );

  // Populate the Purchase Order Status dropdown with data fetched from the backend
  fillDataIntoSelect(
    selectPurchaseOrderStatus, // The HTML <select> element for Purchase Order Status
    "Please Select Order Status", // Default placeholder option
    purchaseOrderStatuses, // Data array containing available order statuses
    "name" // The key used to display status names in the dropdown
  );

  // Set the default selected value for the status dropdown to the first status in the list
  selectPurchaseOrderStatus.value = JSON.stringify(purchaseOrderStatuses[0]);
  // Assign the first status object to the purchase order's status field
  purchaseOrder.supplierpurchaseorder_status_id = purchaseOrderStatuses[0];
  
  // Highlight the selected status field with a green border to indicate a valid selection
  selectPurchaseOrderStatus.classList.remove("is-invalid");
  selectPurchaseOrderStatus.classList.add("is-valid");
  selectPurchaseOrderStatus.style.border = "2px solid green";
  selectPurchaseOrderStatus.style.backgroundColor = "#c6f6d5";

  // Enable supplier selection
  selectSupplier.disabled = "";

  // Hide the Update button by adding the "d-none" class (d-none = display: none)
  btnPurchaseOrderUpdate.classList.add("d-none");
  // Show the Submit button by removing the "d-none" class
  btnPurchaseOrderSubmit.classList.remove("d-none");

  // Set the minimum and maximum allowed dates for the required date input field

  // Get the current date
  let currentDate = new Date();

  // Get the current month (adjusting for zero-based month indexing) and format as two digits
  let currentMonth = currentDate.getMonth() + 1; // [0-11] plus 1 because months start from 0 (January)
  if (currentMonth < 10) {
    currentMonth = '0' + currentMonth; // Ensures month is in two-digit format (e.g., 01, 02, ...)
  }

  // Get the current day and format as two digits
  let currentDay = currentDate.getDate(); // Day of the month [1-31]
  if (currentDay < 10) {
    currentDay = '0' + currentDay; // Ensures day is in two-digit format (e.g., 01, 02, ...)
  }

  // Set the minimum allowed date in YYYY-MM-DD format (today's date)
  // The "min" attribute on the date input prevents selecting dates before the current day
  dteRequiredDate.min = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

  // Set the maximum allowed date as 14 days from the current date
  // This is to limit the delivery date within a 2-week period
  currentDate.setDate(currentDate.getDate() + 14); // Add 14 days to the current date

  // Get the month and day for the calculated maximum date and format them as two digits
  let MaxCurrentMonth = currentDate.getMonth() + 1; // [0-11] plus 1 to adjust month
  if (MaxCurrentMonth < 10) {
    MaxCurrentMonth = '0' + MaxCurrentMonth; // Format month as two digits
  }

  let MaxCurrentDay = currentDate.getDate(); // Day of the month [1-31]
  if (MaxCurrentDay < 10) {
    MaxCurrentDay = '0' + MaxCurrentDay; // Format day as two digits
  }

  // Set the maximum allowed date in YYYY-MM-DD format
  // This restricts the user from choosing a date beyond 14 days from today
  dteRequiredDate.max = currentDate.getFullYear() + "-" + MaxCurrentMonth + "-" + MaxCurrentDay;

  // Refresh the inner form elements as well to ensure a complete form reset
  refreshPurchaseOrderInnerForm();
};

// Define function to check if the selected item already exists in the purchase order list
const checkItemExt = () => {
  // Parse the selected item from the dropdown (stored as a JSON string in the value attribute)
  let selectedItem = JSON.parse(selectItem.value);

  // Check if the selected item already exists in the purchase order item list
  // Map the list to extract ingredient IDs and find the index of the selected item ID
  let extIndex = purchaseOrder.purchaseOrderHasItemList
    .map(poitem => poitem.ingredients_id.id)
    .indexOf(selectedItem.id);

    if (extIndex > -1) {
      Swal.fire({
        title: "Selected Item Already Exists..!",
        text: "Please select another item.",
        icon: "warning",
        width: "20em",
        showConfirmButton: false,
        timer: 2000
      });

    // Reset the form and dropdowns to allow selection of a different item
    refreshPurchaseOrderInnerForm();
  } else {
    // If item is not a duplicate, pre-fill the unit price input field with the selected item's purchase price
    textUnitPrice.value = parseFloat(selectedItem.purchasesprice).toFixed(2);

    // Set the purchaseOrderHasItem's unit price to match the selected item's price
    purchaseOrderHasItem.unit_price = parseFloat(textUnitPrice.value).toFixed(2);

    // Color the element
    textUnitPrice.classList.remove("is-invalid");
    textUnitPrice.classList.add("is-valid");
    textUnitPrice.style.border = "2px solid green";
    textUnitPrice.style.backgroundColor = "#c6f6d5";
  }
};

// Define function to calculate the line price for a purchase order item
const calculateLinePrice = () => {

  // Check if the entered quantity is greater than zero
  if (textQuantity.value > 0) {

    // Calculate line price: quantity × unit price, and format to 2 decimal places
    let linePrice = (parseFloat(textQuantity.value) * parseFloat(textUnitPrice.value)).toFixed(2);

    // Assign the calculated line price to the purchase order item object
    purchaseOrderHasItem.line_price = linePrice;

    // Assign the calculated line price to the element
    textLinePrice.value = linePrice;
    textLinePrice.classList.remove("is-invalid");
    textLinePrice.classList.add("is-valid");
    textLinePrice.style.border = "2px solid green";
    textLinePrice.style.backgroundColor = "#c6f6d5";
    // Visually indicate that the line price is valid by setting a green border
  } else {
    // If quantity is zero or invalid, reset relevant values

    // Clear quantity and line price in the purchase order item object
    purchaseOrderHasItem.quantity = null;
    purchaseOrderHasItem.line_price = null;

    // Highlight the quantity input as invalid (red border)
    textQuantity.classList.remove("is-valid");
    textQuantity.classList.add("is-invalid");
    textQuantity.style.border = "2px solid red";
    textQuantity.style.backgroundColor = "#f8d7da";

    // Reset line price input to default border and empty value
    textLinePrice.style.border = "1px solid #ced4da";
    textLinePrice.value = "";
  }

};


// Define function for filter items that a supplier supplies
const filterItemsBySupplier = () => {
  // Fetch all suppliers from the backend API
  let items = getServiceRequest("ingredient/listbysupplier/" + JSON.parse(selectSupplier.value).id);
  // Populate the Supplier dropdown with data fetched from the backend
  fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");

}

// Function to refresh the inner form of the purchase order
const refreshPurchaseOrderInnerForm = () => {
  // Create a new empty object to store purchase order items
  purchaseOrderHasItem = new Object();

  // Initialize an empty array to hold items
  let items = [];

  // Check if the condition is selectSupplier value is not empty
  if (selectSupplier.value != "") {
    // Fetch all ingredients associated with the selected supplier from the backend API
    // Uses the supplier ID extracted from the selected value of the supplier dropdown
    items = getServiceRequest("ingredient/listbysupplier/" + JSON.parse(selectSupplier.value).id);

    // Populate the item selection dropdown with items supplied by the selected supplier
    // fillDataIntoSelectTwo() dynamically updates the dropdown list
    fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");
  } else {
    // If no supplier is selected or the condition is not met,
    // fetch all available ingredients from the backend API
    items = getServiceRequest("ingredient/list");
  }

  // Populate the item selection dropdown with fetched data
  // Uses a utility function to fill the dropdown with item codes and names
  fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");

  // Reset the input fields to blank or default values

  // Enable the item selection dropdown so the user can choose a new item
  selectItem.disabled = "";

  // Clear the unit price field and disable it to prevent manual editing
  textUnitPrice.value = "";
  textUnitPrice.disabled = "disabled";

  // Clear the quantity input field
  textQuantity.value = "";

  // Clear the line price field and disable it to prevent manual editing
  textLinePrice.value = "";
  textLinePrice.disabled = "disabled";


  // Set default values for the item selection and input fields
  setDefault([selectItem, textUnitPrice, textQuantity, textLinePrice]);

  // Toggle visibility of buttons: hide 'Update' and show 'Submit'
  buttonInnerUpdate.classList.add("d-none"); // Hide update button
  buttonInnerSubmit.classList.remove("d-none"); // Show submit button

  // Refresh Inner Table
  // Define a list of properties that will be displayed in the table
  // Each object in the list contains a property name and data type
  // The dataType specifies how the data should be formatted or interpreted
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" }, // Function to generate the item name
    { propertyName: "unit_price", dataType: "decimal" }, // Unit price displayed as a decimal
    { propertyName: "quantity", dataType: "string" }, // Quantity as a string to allow text-like input
    { propertyName: "line_price", dataType: "decimal" }, // Line price formatted as a decimal
  ];

  // Fill the data into the inner table
  // Parameters:
  // - tablePurchaseOrderItemBody: HTML table body element
  // - purchaseOrder.purchaseOrderHasItemList: Array of order items
  // - propertyList: Array specifying how data should be presented
  // - purchaseOrderItemFormRefill: Function to refill form with selected item data
  // - purchaseOrderItemDelete: Function to delete an item from the list
  fillDataIntoInnerTable(
    tablePurchaseOrderItemBody,
    purchaseOrder.purchaseOrderHasItemList,
    propertyList,
    purchaseOrderItemFormRefill,
    purchaseOrderItemDelete,true
  );

  // Initialize the total amount to zero
  let totalAmount = 0.00;

  // Loop through each item in the purchase order list to calculate the total amount
  for (const orderitem of purchaseOrder.purchaseOrderHasItemList) {
    // Accumulate the line price (convert to a float to ensure numeric addition)
    totalAmount = parseFloat(totalAmount) + parseFloat(orderitem.line_price);
  }

  // If the total amount is greater than zero, update the total amount field
  if (totalAmount != 0) {
    textTotalAmount.value = totalAmount.toFixed(2); // Format to two decimal places
    purchaseOrder.total_amount = textTotalAmount.value; // Update the global purchase order object
    textTotalAmount.classList.remove("is-invalid");
    textTotalAmount.classList.add("is-valid");
    textTotalAmount.style.border = "2px solid green";
    textTotalAmount.style.backgroundColor = "#c6f6d5";
  }

  // Initialize DataTable for enhanced table functionalities like sorting and searching
  $("#tablePurchaseOrderItem").DataTable();
}


// Define a function to generate item name
const generateItemName = (ob) => {
  return ob.ingredients_id.itemname;
};

// Define a function to refill the purchase order inner form when editing an existing item
const purchaseOrderItemFormRefill = (ob, index) => {

  // Store the index of the current item being edited
  innerFormIndex = index;

  // Deep clone the selected item to avoid modifying the original object directly
  purchaseOrderHasItem = JSON.parse(JSON.stringify(ob));
  oldPurchaseOrderHasItem = JSON.parse(JSON.stringify(ob));

  // Fetch the list of available ingredients from the backend endpoint
  items = getServiceRequest("ingredient/list");

  // Populate the select dropdown with item data (code and name)
  fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");

  // Disable the item selector to prevent changes during an update operation
  selectItem.disabled = "disabled";

  // Populate the form fields with the selected item's data
  selectItem.value = JSON.stringify(purchaseOrderHasItem.ingredients_id);  // Set the selected item
  textUnitPrice.value = parseFloat(purchaseOrderHasItem.unit_price);       // Set unit price
  textQuantity.value = purchaseOrderHasItem.quantity;                      // Set quantity
  textLinePrice.value = parseFloat(purchaseOrderHasItem.line_price);      // Set line price

  
  // Show the 'Update' button to allow updating the existing item
  buttonInnerUpdate.classList.remove("d-none");

  // Hide the 'Submit' button to avoid duplicate entries
  buttonInnerSubmit.classList.add("d-none");
};


// Define a function to delete purchase order inner form
// Define a function to delete purchase order inner form item
const purchaseOrderItemDelete = (ob, index) => {
  // Show confirmation dialog using SweetAlert2 with item details
  Swal.fire({
    title: "Are you sure to remove the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🥫 <b>Item Name:</b> " + ob.ingredients_id.itemname + "<br>" +
      "💲 <b>Unit Price:</b> " + ob.unit_price + "<br>" +
      "🔢 <b>Quantity:</b> " + ob.quantity + "<br>" +
      "🧾 <b>Line Price:</b> " + ob.line_price +
      "</div>",

    icon: "warning",
    showCancelButton: true,
    width: "20em",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove Item"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Removed!",
        text: "Item removed successfully from the list.",
        timer: 1500,
        showConfirmButton: false
      });

      // Find and remove the item from the purchase order list
      let extIndex = purchaseOrder.purchaseOrderHasItemList
        .map((orderitem) => orderitem.ingredients_id.id)
        .indexOf(ob.ingredients_id.id);

      if (extIndex !== -1) {
        purchaseOrder.purchaseOrderHasItemList.splice(extIndex, 1);
      }

      // Refresh the purchase order form
      refreshPurchaseOrderInnerForm();
    }
  });
};


// Define a function to submit purchase order inner form
const buttonPurchaseOrderInnerSubmit = () => {
  console.log(purchaseOrderHasItem);

  Swal.fire({
    title: "Are you sure to add the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🥫 <b>Item Name:</b> " + purchaseOrderHasItem.ingredients_id.itemname + "<br>" +
      "💲 <b>Unit Price:</b> " + purchaseOrderHasItem.unit_price + "<br>" +
      "🔢 <b>Quantity:</b> " + purchaseOrderHasItem.quantity + "<br>" +
      "📦 <b>Line Price:</b> " + purchaseOrderHasItem.line_price +
      "</div>",
    icon: "warning",
    width: "20em",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Add Item"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Added Successfully!",
        timer: 1500,
        showConfirmButton: false
      });

      purchaseOrder.purchaseOrderHasItemList.push(purchaseOrderHasItem);
      refreshPurchaseOrderInnerForm();
    }
  });
};


// Define a function to update the purchase order inner form
const buttonPurchaseOrderInnerUpdate = () => {
  console.log(purchaseOrderHasItem);

  // Check if quantity and line price have changed
  if (
    purchaseOrderHasItem.quantity != oldPurchaseOrderHasItem.quantity &&
    purchaseOrderHasItem.line_price != oldPurchaseOrderHasItem.line_price
  ) {
    // Format changes with icons
    let updates = "";
    if (purchaseOrderHasItem.quantity != oldPurchaseOrderHasItem.quantity)
      updates += "🔢 Quantity is changed..! <br>";
    if (purchaseOrderHasItem.line_price != oldPurchaseOrderHasItem.line_price)
      updates += "💰 Line Price is changed..! <br>";

    // Confirm update with SweetAlert
    Swal.fire({
      title: "Are you sure you want to update the following Item?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🍽️ Item Name: " + purchaseOrderHasItem.ingredients_id.itemname + "<br>" +
        "💵 Unit Price: " + purchaseOrderHasItem.unit_price + "<br>" +
        "🔢 Quantity: " + purchaseOrderHasItem.quantity + "<br>" +
        "💰 Line Price: " + purchaseOrderHasItem.line_price + "<br><br>" +
        updates +
        "</div>",
      icon: "warning",
      width: "22em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update Item"
    }).then((result) => {
      if (result.isConfirmed) {
        // Update item in the list
        purchaseOrder.purchaseOrderHasItemList[innerFormIndex] = purchaseOrderHasItem;

        // Show success message
        Swal.fire({
          title: "Item Updated Successfully!",
          icon: "success",
          width: "20em",
          showConfirmButton: false,
          timer: 1500
        });

        // Refresh the inner form
        refreshPurchaseOrderInnerForm();
      }
    });
  } else {
    // No updates detected
    Swal.fire({
      title: "No Updates",
      text: "Nothing to update..!",
      icon: "info",
      width: "20em",
      showConfirmButton: false,
      timer: 1500
    });
  }
};



// Function to refill the purchase order form when editing an existing purchase order
const purchaseOrderFormRefill = (ob, index) => {

  // Log the object and index for debugging purposes
  console.log("Edit", ob, index); 

  // Set the supplier dropdown to the selected supplier and disable it to prevent changes
  selectSupplier.value = JSON.stringify(ob.supplier_id);
  selectSupplier.disabled = "disabled";

  // Set the purchase order status
  selectPurchaseOrderStatus.value = JSON.stringify(ob.supplierpurchaseorder_status_id);

  // Set the delivery date
  dteRequiredDate.value = ob.delivery_date;

  // Total Amount is automatically filled when the refreshPurchaseOrderInnerForm() called

  // Set the note field, check for null or undefined
  if (ob.note === undefined || ob.note === null) {
    textNote.value = "";
  } else {
    textNote.value = ob.note;
  }

  // Clone the object to prevent modifying the original reference
  purchaseOrder = JSON.parse(JSON.stringify(ob));
  oldpurchaseOrder = JSON.parse(JSON.stringify(ob));

  // Show the Update button by removing the "d-none" class (making it visible)
  btnPurchaseOrderUpdate.classList.remove("d-none");
  // Hide the Submit button by adding the "d-none" class (hiding it)
  btnPurchaseOrderSubmit.classList.add("d-none");


  // Show the purchase order form (offcanvas component)
  $("#offcanvasPurchaseOrderForm").offcanvas("show");

  // Refresh the inner form to display the item list or reset item section (likely a missing call)
  refreshPurchaseOrderInnerForm(); // <-- Add () to properly invoke the function
};


// Define function to delete an employee record
// Define function to delete a purchase order
const purchaseOrderDelete = (dataOb, index) => {
  // Show confirmation dialog using SweetAlert2 with purchase order info
  Swal.fire({
    title: "Are you sure to remove the following Purchase Order?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🏢 <b>Supplier Name:</b> " + dataOb.supplier_id.suppliername + "<br>" +
      "📅 <b>Required Date:</b> " + dataOb.delivery_date + "<br>" +
      "💰 <b>Total Amount:</b> " + dataOb.total_amount + "<br>" +
      "📶 <b>Status:</b> " + dataOb.supplierpurchaseorder_status_id.name +
      "</div>",

    icon: "warning",
    showCancelButton: true,
    width: "20em",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete Purchase Order"
  }).then((result) => {
    if (result.isConfirmed) {
      // Call the DELETE HTTP service
      let deleteResponse = getHTTPServiceRequest("/purchaseorder/delete", "DELETE", dataOb);

      if (deleteResponse === "OK") {
        Swal.fire({
          icon: "success",
          width: "20em",
          title: "Deleted!",
          text: "Purchase Order deleted successfully.",
          timer: 1500,
          showConfirmButton: false
        });

        // Refresh table and form
        refreshPurchaseOrderTable();
        refreshPurchaseOrderForm();

        // Hide the offcanvas view
        $("#offcanvasPurchaseOrderView").offcanvas("hide");
      } else {
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
};


// View and display selected purchase order details 
const purchaseOrderView = (ob, index) => {
  console.log("View", ob, index); // Log selected object and its index for debugging
 
  tdSupplierName.innerText = ob.supplier_id.suppliername;                           
  tdTotalAmount.innerText = ob.total_amount;                         
  tdRequiredDate.innerText = ob.delivery_date;                        
  tdOrderStatus.innerText = ob.supplierpurchaseorder_status_id.name; 
 
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" }, 
    { propertyName: "unit_price", dataType: "decimal" },
    { propertyName: "quantity", dataType: "string" }, 
    { propertyName: "line_price", dataType: "decimal" },
  ];

 
  fillDataIntoInnerTable(
    tablePrintPurchaseOrderItemBody,
    ob.purchaseOrderHasItemList,
    propertyList,
    purchaseOrderItemFormRefill,
    purchaseOrderItemDelete,false
  );
 
  // Show the offcanvas panel for viewing details
  $("#offcanvasPurchaseOrderView").offcanvas("show");
 
 
};

const buttonPrintRow = () => {
  let newWindow = window.open();

  // Only get the outer table (which already includes the inner table)
  const outerTableHTML = tablePurchaseOrderView.outerHTML;

  let printView = `
    <html>
      <head>
        <title>Print Purchase Order</title>
        <link rel="stylesheet" href="../../Resources/bootstrap-5.2.3/css/bootstrap.min.css">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background-color: #efeeff;
          }
          .content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
          }
          .table th, .table td {
            border: 1px solid #ccc;
            padding: 8px 12px;
          }
          .table th {
            background-color: #f9f9f9;
          }
          h2 {
            text-align: center;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <div class="content">
          <h2>Purchase Order</h2>
          ${outerTableHTML}
        </div>
      </body>
    </html>`;

  newWindow.document.write(printView);

  setTimeout(() => {
    newWindow.stop();
    newWindow.print();
    newWindow.close();
  }, 1500);
};

// Funtion to check form errors
const checkFormError = () => {
  let formInputErrors = "";

  if (purchaseOrder.supplier_id == null) {
    formInputErrors += "❗🏢 Please Select a Supplier...! \n";
  }
  if (purchaseOrder.delivery_date == null) {
    formInputErrors += "❗📅 Please Select a Required Date...! \n";
  }
  if (purchaseOrder.total_amount == null) {
    formInputErrors += "❗💰 Please Enter a Total Amount...! \n";
  }
  if (purchaseOrder.purchaseOrderHasItemList.length === 0) {
    formInputErrors += "❗📦 Please Select Order Item(s)...! \n";
  }

  return formInputErrors;
};


// Function form submit
const buttonPurchaseOrderSubmit = () => {
  console.log(purchaseOrder);

  let errors = checkFormError();
  if (errors === "") {
    Swal.fire({
      title: "Are you sure to add following Purchase Order?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🏢 <b>Supplier:</b> " + purchaseOrder.supplier_id.suppliername + "<br>" +
        "📅 <b>Required Date:</b> " + purchaseOrder.delivery_date + "<br>" +
        "💰 <b>Total Amount:</b> " + purchaseOrder.total_amount + "<br>" +
        "📄 <b>Purchase Order Status:</b> " + purchaseOrder.supplierpurchaseorder_status_id.name +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Purchase Order"
    }).then((result) => {
      if (result.isConfirmed) {
        let postResponse = getHTTPServiceRequest("/purchaseorder/insert", "POST", purchaseOrder);

        if (postResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,
            showConfirmButton: false,
            draggable: true
          });

          refreshPurchaseOrderTable();
          refreshPurchaseOrderForm();
          $("#offcanvasPurchaseOrderForm").offcanvas("hide");
        } else {
          Swal.fire({
            icon: "error",
            width: "20em",
            title: "Failed to Submit",
            html: "<pre>" + postResponse + "</pre>",
            draggable: true
          });
        }
      }
    });
  } else {
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form has following errors",
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      confirmButtonColor: "#3085d6"
    });
  }
};


// Check for any changes between the current form values and the original data
const checkFormUpdate = () => {
  let updates = "";

  // Ensure both current and original purchase order objects are available
  if (purchaseOrder != null && oldpurchaseOrder != null) {

    // Check if supplier is changed
    if (purchaseOrder.supplier_id.suppliername != oldpurchaseOrder.supplier_id.suppliername) {
      updates += "🏢 Supplier is changed..! \n";
    }

    // Check if delivery date is changed
    if (purchaseOrder.delivery_date != oldpurchaseOrder.delivery_date) {
      updates += "📅 Required Date is changed..! \n";
    }

    // Check if total amount is changed
    if (purchaseOrder.total_amount != oldpurchaseOrder.total_amount) {
      updates += "💰 Total Amount is changed..! \n";
    }

    // Check if purchase order status is changed
    if (purchaseOrder.supplierpurchaseorder_status_id.name != oldpurchaseOrder.supplierpurchaseorder_status_id.name) {
      updates += "📄 Purchase Order Status is changed..! \n";
    }
  }

  // Check if the number of items in the new purchase order is different from the old one
  if (purchaseOrder.purchaseOrderHasItemList.length != oldpurchaseOrder.purchaseOrderHasItemList.length) {

    // Log that the list of purchase order items has changed
    updates += "📄 Purchase Order Item is changed..! \n";

  } else {

    // Counter to track how many items are the same between old and new orders
    let equalCount = 0;

    // Loop through each item in the old purchase order
    for (const oldpoitem of oldpurchaseOrder.purchaseOrderHasItemList) {

      // Compare with each item in the new purchase order
      for (const newpoitem of purchaseOrder.purchaseOrderHasItemList) {

        // If the ingredient IDs match, increment the counter
        if (oldpoitem.ingredients_id.id == newpoitem.ingredients_id.id) {
          equalCount = equalCount + 1;
        }
      }
    }

    // If the count of matching items is not equal to the number of new items,
    // it means the items themselves have changed
    if (equalCount != purchaseOrder.purchaseOrderHasItemList.length) {
      updates += "📄 Purchase Order Item is changed..! \n";
    } else {

      // If the items are the same, check if their quantities have changed
      for (const oldpoitem of oldpurchaseOrder.purchaseOrderHasItemList) {
        for (const newpoitem of purchaseOrder.purchaseOrderHasItemList) {

          // If the ingredient IDs match but the quantity is different
          if (oldpoitem.ingredients_id.id == newpoitem.ingredients_id.id &&
            oldpoitem.quantity != newpoitem.quantity) {

            // Log that the quantity has been changed
            updates += "🔢 Purchase Order Qty is changed..! \n";
            break; // No need to check more once a change is found
          }
        }
      }
    }
  }

  
  // Return all update messages
  return updates;
};



// Handle update action for purchase order form
const buttonPurchaseOrderUpdate = () => {
  // Step 1: Validate form errors
  let errors = checkFormError();

  if (errors === "") {
    // Step 2: Check for updates
    let updates = checkFormUpdate();

    if (updates === "") {
      // No updates found
      Swal.fire({
        title: "No Updates",
        text: "Nothing to update..",
        icon: "info",
        width: "20em",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Updates found, ask for confirmation
      Swal.fire({
        title: "Are you sure you want to update following changes?",
        html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update Purchase Order"
      }).then((result) => {
        if (result.isConfirmed) {
          // Perform update request
          let putResponse = getHTTPServiceRequest("/purchaseorder/update", "PUT", purchaseOrder);

          if (putResponse === "OK") {
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500,
              draggable: true
            });

            refreshPurchaseOrderTable();
            refreshPurchaseOrderForm();
            $("#offcanvasPurchaseOrderForm").offcanvas("hide");
          } else {
            Swal.fire({
              title: "Failed to update!",
              html: "<pre>" + putResponse + "</pre>",
              icon: "error",
              width: "20em",
              showConfirmButton: false,
              timer: 2000,
              draggable: true
            });
          }
        }
      });
    }
  } else {
    // Show validation errors
    Swal.fire({
      title: "Form has following errors!",
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      icon: "warning",
      width: "20em",
      showConfirmButton: false,
      timer: 2000,
      draggable: true
    });
  }
};


// Function to clear the main form by confirming the user's intent
const clearPurchaseOrderForm = () => {
  // Show confirmation dialog with SweetAlert2
  Swal.fire({
    title: "Are you sure to refresh the form?",
    icon: "question",
    width: "20em",   
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Clear Form",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      // If user confirms, reset the form fields by calling the refresh function
      refreshPurchaseOrderForm();
      Swal.fire({
        title: "Form cleared!",
        icon: "success",
        width: "20em",   
        timer: 1200,
        showConfirmButton: false,
        draggable: true
      });
    }
  });
};

// Function to clear the inner form by confirming the user's intent
const clearPurchaseOrderInnerForm = () => {
  // Show confirmation dialog with SweetAlert2
  Swal.fire({
    title: "Are you sure to refresh the form?",
    icon: "question",
    width: "20em",   
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Clear Form",
    cancelButtonText: "Cancel"
  }).then((result) => {
    if (result.isConfirmed) {
      // If user confirms, reset the form fields by calling the refresh function
      refreshPurchaseOrderInnerForm();
      Swal.fire({
        title: "Form cleared!",
        icon: "success",
        width: "20em",   
        timer: 1200,
        showConfirmButton: false,
        draggable: true
      });
    }
  });
};
