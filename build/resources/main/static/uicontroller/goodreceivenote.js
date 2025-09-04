//Create browser load event
window.addEventListener("load", () => {

  refreshGoodReceiveNoteTable();
  refreshGoodReceiveNoteForm();
});


// Call refreshGoodReceiveNoteTable() in browser, submit, update, delete functions
const refreshGoodReceiveNoteTable = () => {

  // Fetch good receive note data from the backend using a reusable service function
  // The getServiceRequest function sends a GET request to the specified endpoint and returns data
  let goodreceivenotes = getServiceRequest("/goodreceivenote/alldata");

  // Define the list of properties (columns) to be shown in the data table
  // Each object in the array describes a column's property name and data type
  // - "string", "date", "number", "decimal" represent direct properties
  // - "function" means a separate function will generate the value for that column
  let propertyList = [
    { propertyName: "code", dataType: "string" },                    
    { propertyName: generateSupplierName, dataType: "function" },  
    { propertyName: "date_of_receipt", dataType: "string" },     
    { propertyName: "supplier_bill_no", dataType: "string" },    
    { propertyName: "total_amount", dataType: "decimal" },           
    { propertyName: "net_amount", dataType: "decimal" },           
    { propertyName: generateOrderStatus, dataType: "function" } 
  ];

  // Populate the HTML table with the retrieved data using a reusable fillDataIntoTable function
  // Parameters:
  // - tableGrnBody: HTML table body element ID
  // - goodreceivenotes: data list
  // - propertyList: column configurations
  // - GoodReceiveNoteFormRefill: function to refill the form when editing a row
  // - GoodReceiveNoteView: function to view row details in read-only mode
  fillDataIntoTableTwo(
    tableGrnBody, 
    goodreceivenotes, 
    propertyList,
    GoodReceiveNoteFormRefill, 
    GoodReceiveNoteView 
  );

  // Loop to hide edit button 
  for (const key in goodreceivenotes) {
    tableGrnBody.children[key].lastChild.children[0].children[1].children[0].children[0].style.display = "none";
  }

  // Initialize DataTable plugin to enhance table features (pagination, search, sorting)
  $("#tableGrn").DataTable();
}



// Function to generate the supplier name from the data object
const generateSupplierName = (dataOb) => {
  // Access and return the supplier name from the data object
  return dataOb.supplier_id.suppliername;
}


// Function to generate the order status icon based on the status name
const generateOrderStatus = (dataOb) => {
  // Check if the order status is "Pending"
  if (dataOb.grn_status_id.name == "Received") {
    return (
      // Orange list-check icon for "Pending" status
      "<i class='fa-solid fa-clipboard-list fa-lg text-warning'></i>"
    );
  }

  // Check if the order status is "Received"
  if (dataOb.grn_status_id.name == "Partially Completed") {
    return (
      // Blue list-check icon for "Received" status
      "<i class='fa-solid fa-clipboard-list fa-lg text-primary'></i>"
    );
  }

  // Check if the order status is "Completed"
  if (dataOb.grn_status_id.name == "Completed") {
    return (
      // Green list-check icon for "Completed" status
      "<i class='fa-solid fa-clipboard-list fa-lg text-success'></i>"
    );
  }
}

// Create refresh form area function
const refreshGoodReceiveNoteForm = () => {

  // Initialize a new object to store the GRN details
  goodReceiveNote = new Object();
  goodReceiveNote.grnHasItemList = new Array(); // Initialize an empty item list for the GRN
  formgrn.reset(); // Reset the form fields to default

  // Reset form inputs with default placeholders or values using the reusable function
  setDefault([
    selectSupplier,
    selectPurchaseOrder,
    dteReceiptDate,
    textBillNo,
    textTotalAmount,
    textDiscountAmount,
    textNetAmount,
    selectGrnStatus,
    textNote
  ]);

  // Fetch required data from backend
  let suppliers = getServiceRequest("supplier/alldata");                         
  let purchaseOrders = getServiceRequest("purchaseorder/alldata");              
  let goodReceiveNoteStatuses = getServiceRequest("goodreceivenotestatus/alldata");
  // Populate Supplier dropdown
  fillDataIntoSelect(
    selectSupplier,
    "Please Select Supplier",
    suppliers,
    "suppliername"
  );

  // Populate Purchase Order dropdown
  fillDataIntoSelect(
    selectPurchaseOrder,
    "Please Select Purchase Order",
    purchaseOrders,
    "order_code"
  );

  // Populate GRN Status dropdown
  fillDataIntoSelect(
    selectGrnStatus,
    "Please Select Status",
    goodReceiveNoteStatuses,
    "name"
  );

  // Preselect the first status by default
  selectGrnStatus.value = JSON.stringify(goodReceiveNoteStatuses[0]);
  goodReceiveNote.grn_status_id = goodReceiveNoteStatuses[0];

  // Highlight valid selection
  selectGrnStatus.classList.remove("is-invalid");
  selectGrnStatus.classList.add("is-valid");
  selectGrnStatus.style.border = "2px solid green";
  selectGrnStatus.style.backgroundColor = "#c6f6d5";

  // Allow changing supplier (may be disabled during editing)
  selectSupplier.disabled = "";

  // Handle visibility of form buttons
   btnGrnUpdate.classList.add("d-none"); // Hide update button
   btnGrnSubmit.classList.remove("d-none"); // Show submit button

  // ----------------------------
  // Handle date field limits
  // ----------------------------

  let currentDate = new Date(); // Get today

  // Format today's month and day as two digits
  let currentMonth = currentDate.getMonth() + 1;
  if (currentMonth < 10) currentMonth = '0' + currentMonth;

  let currentDay = currentDate.getDate();
  if (currentDay < 10) currentDay = '0' + currentDay;

  // Set the maximum date to today
  dteReceiptDate.max = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay;

  // Go 7 days back to set minimum date
  currentDate.setDate(currentDate.getDate() - 7);

  let MinCurrentMonth = currentDate.getMonth() + 1;
  if (MinCurrentMonth < 10) MinCurrentMonth = '0' + MinCurrentMonth;

  let MinCurrentDay = currentDate.getDate();
  if (MinCurrentDay < 10) MinCurrentDay = '0' + MinCurrentDay;

  // Set minimum date to 7 days ago
  dteReceiptDate.min = currentDate.getFullYear() + "-" + MinCurrentMonth + "-" + MinCurrentDay;

  textNetAmount.value = "";
  textNetAmount.disabled = "disabled";
  // Refresh inner item table or subform
  refreshGrnInnerForm();
}

// Define function for filter items that a supplier supplies
const filterPurchaseOrdersBySupplier = () => {
  // Fetch all suppliers from the backend API
  let purchaseorders = getServiceRequest("purchaseorder/listbysupplier/" + JSON.parse(selectSupplier.value).id);
  // Populate the Supplier dropdown with data fetched from the backend
  fillDataIntoSelect(
    selectPurchaseOrder,
    "Please Select Purchase Order",
    purchaseorders,
    "order_code"
  );
}


// Define function to check if the selected item already exists in the grn list
const checkItemExt = () => {
  // Parse the selected item object from the JSON string stored in the select dropdown's value
  let selectedItem = JSON.parse(selectItem.value);

  // Check if the selected item's ingredient ID already exists in the GRN item list
  // Create an array of ingredient IDs and find the index of the selected item's ID
  let extIndex = goodReceiveNote.grnHasItemList
    .map(poitem => poitem.ingredients_id.id)
    .indexOf(selectedItem.id);

  // If the item already exists in the list (index greater than -1 means found)
  if (extIndex > -1) {
    Swal.fire({
      title: "Selected Item Already Exists..!",
      text: "Please select another item.",
      icon: "warning",
      width: "20em",
      showConfirmButton: false,
      timer: 2000
    });

    // Reset the inner form so the user can choose a different item
    refreshGrnInnerForm();
  } else {
    // If item is not a duplicate, fill the purchase price input with the selected item's purchase price
    textPurchasePrice.value = parseFloat(selectedItem.purchasesprice).toFixed(2);

    // Update the current GRN item object's purchase price to match
    goodReceiveNoteHasItem.purchase_price = parseFloat(textPurchasePrice.value).toFixed(2);

    // Visually indicate valid purchase price by setting a green border on the input
    textPurchasePrice.classList.remove("is-invalid");
    textPurchasePrice.classList.add("is-valid");
    textPurchasePrice.style.border = "2px solid green";
    textPurchasePrice.style.backgroundColor = "#c6f6d5";
  }
}



// Define function to calculate the line price for a grn item
const calculateLinePrice = () => {

  // Check if the entered quantity is greater than zero
  if (textQuantity.value > 0) {

    // Calculate line price as quantity multiplied by unit price
    // Parse both values to float, multiply and fix to 2 decimals
    let linePrice = (parseFloat(textQuantity.value) * parseFloat(textPurchasePrice.value)).toFixed(2);

    // Assign the calculated line price to the current GRN item object
    goodReceiveNoteHasItem.line_price = linePrice;

    // Display the calculated line price in the form input field
    textLinePrice.value = linePrice;

    // Indicate the line price is valid by changing border color to green
    textLinePrice.classList.remove("is-invalid");
    textLinePrice.classList.add("is-valid");
    textLinePrice.style.border = "2px solid green";
    textLinePrice.style.backgroundColor = "#c6f6d5";

  } else {
    // If quantity is zero, empty, or invalid, reset relevant fields

    // Clear the quantity and line price in the GRN item object (Note: there's a small bug here, should be goodReceiveNoteHasItem instead of grnHasItemList)
    grnHasItemList.quantity = null;
    grnHasItemList.line_price = null;

    // Highlight quantity input with a red border to indicate error
    textQuantity.classList.remove("is-valid");
    textQuantity.classList.add("is-invalid");
    textQuantity.style.border = "2px solid red";
    textQuantity.style.backgroundColor = "#f8d7da";


    // Reset line price input border and clear its value
    textLinePrice.style.border = "1px solid #ced4da";
    textLinePrice.value = "";
  }

}


// Define function for filter items that a supplier supplies
const filterItemsBySupplier = () => {
  // Fetch all suppliers from the backend API
  let items = getServiceRequest("ingredient/listbysupplier/" + JSON.parse(selectSupplier.value).id);
  // Populate the Supplier dropdown with data fetched from the backend
  fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");
}


// Function to refresh the inner form of the purchase order
const refreshGrnInnerForm = () => {
  // Create a new empty object to store purchase order items
  goodReceiveNoteHasItem = new Object();

  // Initialize an empty array to hold items
  let items = [];

  // Check if the supplier dropdown has a selected value
  if (selectSupplier.value != "") {
    // Fetch ingredients associated with the selected supplier
    items = getServiceRequest("ingredient/listbysupplier/" + JSON.parse(selectSupplier.value).id);

    // Populate the item selection dropdown with supplier-specific items
    fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");
  } else {

    // If no supplier is selected, fetch all ingredients
    items = getServiceRequest("ingredient/list");
  }

  // Populate the item selection dropdown with the fetched items
  fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");

  // Enable the item selection dropdown for user input
  selectItem.disabled = "";

  // Clear and disable purchase price input field to prevent manual edits
  textPurchasePrice.value = "";
  textPurchasePrice.disabled = "disabled";

  // Clear quantity input field
  textQuantity.value = "";

  // Clear and disable line price input field to prevent manual edits
  textLinePrice.value = "";
  textLinePrice.disabled = "disabled";

  // Reset form fields to their default states or values
  setDefault([selectItem, textQuantity, textPurchasePrice, textLinePrice,textBatchNo,dteMfdDate,dteExpireDate]);

  // Hide the update button (used when editing an existing item)
  buttonInnerUpdate.classList.add("d-none");

  // Show the submit button (used when adding a new item)
  buttonInnerSubmit.classList.remove("d-none");

  // Define the list of properties to display in the inner items table,
  // including a custom function for item name and data types for formatting
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" },
    { propertyName: "grn_quantity", dataType: "string" }, 
    { propertyName: "purchase_price", dataType: "decimal" }, 
    { propertyName: "line_price", dataType: "decimal" }, 
  ];

  // Fill the inner table body with the current list of GRN items
  fillDataIntoInnerTable(
    tableGrnItemBody,
    goodReceiveNote.grnHasItemList,
    propertyList,
    goodReceiveNoteItemFormRefill,
    goodReceiveNoteItemDelete,
    true
  );

  // Initialize total amount to zero before calculation
  let totalAmount = 0.00;

  // Loop through each item in the GRN item list to sum line prices
  for (const orderitem of  goodReceiveNote.grnHasItemList) {
    totalAmount = parseFloat(totalAmount) + parseFloat(orderitem.line_price);
  }

  // If total amount is not zero, update the total amount field and style
  if (totalAmount != 0) {
    textTotalAmount.value = totalAmount.toFixed(2); // format with 2 decimals
    goodReceiveNote.total_amount = textTotalAmount.value; // update main object
    // visual success indicator
    textTotalAmount.classList.remove("is-invalid");
    textTotalAmount.classList.add("is-valid");
    textTotalAmount.style.border = "2px solid green";
    textTotalAmount.style.backgroundColor = "#c6f6d5";
  }

  // Initialize or refresh the DataTable plugin for the GRN items table
  $("#tableGrnItem").DataTable();
}


// Define a function to generate item name
const generateItemName = (ob) => {
  return ob.ingredients_id.itemname;
}


// Define a function to calculate net amount
const calculateNetAmount = () => {
  // Parse total and discount amounts, fallback to 0 if invalid
  let totalAmount = parseFloat(textTotalAmount.value) || 0;
  let discountAmount = parseFloat(textDiscountAmount.value) || 0;

  // Calculate net amount = total - discount, but not less than zero
  let netAmount = totalAmount - discountAmount;
  if (netAmount < 0) netAmount = 0;

  // Update the net amount input, fixed to 2 decimals
  textNetAmount.value = netAmount.toFixed(2);

  // Optionally, give visual feedback for valid calculation
  textNetAmount.classList.remove("is-invalid");
  textNetAmount.classList.add("is-valid");
  textNetAmount.style.border = "2px solid green";
  textNetAmount.style.backgroundColor = "#c6f6d5";

  // Update the main data model if applicable
  if (goodReceiveNote) {
    goodReceiveNote.net_amount = netAmount.toFixed(2);
  }
}


// Define a function to refill the grn inner form when editing an existing item
const goodReceiveNoteItemFormRefill = (ob, index) => {

  // Store the index of the current item being edited
  innerFormIndex = index;

  // Deep clone the selected item to avoid directly modifying the original object
  goodReceiveNoteHasItem = JSON.parse(JSON.stringify(ob));
  oldGoodReceiveNoteHasItem = JSON.parse(JSON.stringify(ob));

  // Fetch the list of available ingredients from backend
  items = getServiceRequest("ingredient/list");

  // Populate the select dropdown with item code and name, with a placeholder
  fillDataIntoSelectTwo(selectItem, "Please Select Items", items, "itemcode", "itemname");


  // Set form fields to the selected item's current data
  selectItem.value = JSON.stringify(goodReceiveNoteHasItem.ingredients_id);  
  // Disable the item dropdown to prevent changing the item during editing
  selectItem.disabled = "disabled";
  textQuantity.value = goodReceiveNoteHasItem.grn_quantity; 
  textPurchasePrice.value = parseFloat(goodReceiveNoteHasItem.purchase_price);    
  textLinePrice.value = parseFloat(goodReceiveNoteHasItem.line_price);
  textBatchNo.value = goodReceiveNoteHasItem.batchno; 
  dteMfdDate.value = goodReceiveNoteHasItem.mfcdate; 
  dteExpireDate.value = goodReceiveNoteHasItem.expdate; 
  // Show the 'Update' button and hide the 'Submit' button for editing mode
  buttonInnerUpdate.classList.remove("d-none");
  buttonInnerSubmit.classList.add("d-none");
}


// Define a function to delete a GRN item from the inner form
const goodReceiveNoteItemDelete = (ob, index) => {
  // Show confirmation dialog using SweetAlert2 with GRN item info
  Swal.fire({
    title: "Are you sure to remove the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🥫 <b>Item Name:</b> " + ob.ingredients_id.itemname + "<br>" +
      "🔢 <b>Quantity:</b> " + ob.grn_quantity + "<br>" +
      "💲 <b>Purchase Price:</b> " + ob.purchase_price + "<br>" +
      "🧾 <b>Line Price:</b> " + ob.line_price + "<br>" +
      "🏷️ Batch No: </b>" + (ob.batchno ? ob.batchno : "-") + "<br>" +
      "🛠️ MFD: </b>" + (ob.mfcdate ? ob.mfcdate : "-") + "<br>" +
      "📅 EXP: </b>" + (ob.expdate ? ob.expdate : "-") + "<br>" +

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

      // Find and remove the item from GRN item list
      let extIndex = goodReceiveNote.grnHasItemList
        .map((orderitem) => orderitem.ingredients_id.id)
        .indexOf(ob.ingredients_id.id);

      if (extIndex !== -1) {
        goodReceiveNote.grnHasItemList.splice(extIndex, 1);
      }

      // Refresh the GRN inner form
      refreshGrnInnerForm();
    }
  });
};


// Define a function to submit grn inner form
const buttonGrnInnerSubmit = () => {
  console.log(goodReceiveNoteHasItem); // Debug log

  // Show confirmation dialog before adding the item
  Swal.fire({
    title: "Are you sure to add the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🥫 <b>Item Name:</b> " + goodReceiveNoteHasItem.ingredients_id.itemname + "<br>" +
      "📦 <b>Quantity:</b> " + goodReceiveNoteHasItem.grn_quantity + "<br>" +
      "💵 <b>Purchase Price:</b> " + goodReceiveNoteHasItem.purchase_price + "<br>" +
      "🧮 <b>Line Price:</b> " + goodReceiveNoteHasItem.line_price + "<br>" +
      "🏷️ Batch No: " + (goodReceiveNoteHasItem.batchno ? goodReceiveNoteHasItem.batchno : "-") + "<br>" +
      "🛠️ MFD: " + (goodReceiveNoteHasItem.mfcdate ? goodReceiveNoteHasItem.mfcdate : "-") + "<br>" +
      "📅 EXP: " + (goodReceiveNoteHasItem.expdate ? goodReceiveNoteHasItem.expdate : "-") + "<br>" +

      "</div>",
    icon: "warning",
    width: "20em",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Add Item"
  }).then((result) => {
    if (result.isConfirmed) {
      // Add item to GRN list
      goodReceiveNote.grnHasItemList.push(goodReceiveNoteHasItem);

      // Success alert
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Added Successfully!",
        timer: 1500,
        showConfirmButton: false
      });

      // Refresh inner form
      refreshGrnInnerForm();
    }
  });
};



// Define a function to update the grn inner form
const buttonGrnInnerUpdate = () => {
  console.log(goodReceiveNoteHasItem);

  // Check if quantity and line price have changed
  if (
    goodReceiveNoteHasItem.grn_quantity != oldGoodReceiveNoteHasItem.grn_quantity &&
    goodReceiveNoteHasItem.line_price != oldGoodReceiveNoteHasItem.line_price
  ) {
    // Build change summary with icons
  let updates = "";

  if (goodReceiveNoteHasItem.grn_quantity != oldGoodReceiveNoteHasItem.grn_quantity)
  updates += "🔢 Quantity is changed..!<br>";

  if (goodReceiveNoteHasItem.line_price != oldGoodReceiveNoteHasItem.line_price)
  updates += "💰 Line Price is changed..!<br>";

  if (goodReceiveNoteHasItem.batchno != oldGoodReceiveNoteHasItem.batchno)
  updates += "🏷️ Batch Number is changed..!<br>";

  if (goodReceiveNoteHasItem.mfcdate != oldGoodReceiveNoteHasItem.mfcdate)
  updates += "🛠️ MFD is changed..!<br>";

  if (goodReceiveNoteHasItem.expdate != oldGoodReceiveNoteHasItem.expdate)
  updates += "📅 EXP is changed..!<br>";

     

    // Show SweetAlert confirmation
    Swal.fire({
      title: "Are you sure you want to update the following Item?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🍽️ Item Name: " + goodReceiveNoteHasItem.ingredients_id.itemname + "<br>" +
        "💸 Purchase Price: " + goodReceiveNoteHasItem.purchase_price + "<br>" +
        "🔢 Quantity: " + goodReceiveNoteHasItem.grn_quantity + "<br>" +
        "💰 Line Price: " + goodReceiveNoteHasItem.line_price + "<br>" +
        "🏷️ Batch No: " + goodReceiveNoteHasItem.batchno + "<br>" +
        "🛠️ MFD: " + goodReceiveNoteHasItem.mfcdate + "<br>" +
        "📅 EXP: " + goodReceiveNoteHasItem.expdate + "<br>" +
        updates +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update Item"
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform update
        goodReceiveNote.grnHasItemList[innerFormIndex] = goodReceiveNoteHasItem;

        // Show success message
        Swal.fire({
          title: "Item Updated Successfully!",
          icon: "success",
          width: "20em",
          showConfirmButton: false,
          timer: 1500
        });

        // Refresh the form UI
        refreshGrnInnerForm();
      }
    });
  } else {
    // No changes
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

// Function to refill the purchase order form when editing an existing grn
const GoodReceiveNoteFormRefill = (ob, index) => {

  // Log the object and index for debugging purposes
  console.log("Edit", ob, index);

  // Set the supplier dropdown value and disable the field to prevent editing
  selectSupplier.value = JSON.stringify(ob.supplier_id);
  selectSupplier.disabled = "disabled";

  // Set the purchase order dropdown value and disable the field
  selectPurchaseOrder.value = JSON.stringify(ob.supplierpurchaseorder_id);
  selectPurchaseOrder.disabled = "disabled";

  // Set receipt date
  dteReceiptDate.value = ob.date_of_receipt;

  // Set supplier bill number
  textBillNo.value = ob.supplier_bill_no;

  // Set discount and net amounts
  textDiscountAmount.value = ob.discount_amount;
  textNetAmount.value = ob.net_amount;

  // Set GRN status
  selectGrnStatus.value = JSON.stringify(ob.grn_status_id);

  // Set note field (handle null or undefined gracefully)
  textNote.value = ob.note ? ob.note : "";

  // Clone the object to avoid modifying the original reference directly
  goodReceiveNote = JSON.parse(JSON.stringify(ob));
  oldGoodReceiveNote = JSON.parse(JSON.stringify(ob));

  // Show the update button and hide the submit button
  btnGrnUpdate.classList.remove("d-none");
  btnGrnSubmit.classList.add("d-none");

  // Show the GRN form using Bootstrap offcanvas
  $("#offcanvasGrnForm").offcanvas("show");

  // Refresh the GRN item section (to load item list or reset the UI)
  refreshGrnInnerForm();
}


 
// Function to display Good Receive Note details in a view panel
const GoodReceiveNoteView = (ob, index) => {
  console.log("View", ob, index); // Log selected object and its index for debugging

  // Set values to corresponding table cells using object properties
  tdSupplierName.innerText = ob.supplier_id.suppliername;             // Display supplier name
  tdPurchaseOrder.innerText = ob.supplierpurchaseorder_id.order_code; // Display purchase order code
  tdReceiptDate.innerText = ob.date_of_receipt;                       // Display receipt date
  tdBillNo.innerText = ob.supplier_bill_no;                           // Display supplier bill number
  tdTotalAmount.innerText = ob.total_amount;                          // Display total amount
  tdDiscountAmount.innerText = ob.discount_amount;                          // Display total amount
  tdNetAmount.innerText = ob.net_amount;                          // Display total amount
  tdStatus.innerText = ob.grn_status_id.name;                         // Display GRN status

  // Define structure for displaying item properties in inner table
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" },         // Use function to generate item name
    { propertyName: "grn_quantity", dataType: "string" },             // GRN quantity
    { propertyName: "purchase_price", dataType: "decimal" },          // Purchase price
    { propertyName: "line_price", dataType: "decimal" },              // Line price
  ];

  // Populate the GRN item table with relevant data
  fillDataIntoInnerTable(
    printTableGrnItemBody,                   // Target table body element
    ob.grnHasItemList,     // Array of GRN items
    propertyList,                       // Column definitions
    goodReceiveNoteItemFormRefill,      // Callback to refill form with selected item data
    goodReceiveNoteItemDelete,          // Callback to delete item
    false                               // Disable editing functionality in view mode
  );

  // Show the offcanvas panel for GRN view
  $("#offcanvasGrnView").offcanvas("show");
}


// Function to handle printing of the Good Receive Note view
const buttonPrintRow = () => {
  // Open a new browser window
  let newWindow = window.open();

  // Get the HTML content of the outer table (which includes the inner table as well)
  const outerTableHTML = tablePurchaseOrderView.outerHTML;

  // Construct the print-friendly HTML structure
  let printView = `
    <html>
      <head>
        <title>Print Good Receive Note</title>
        <!-- Include Bootstrap CSS for styling -->
        <link rel="stylesheet" href="../../Resources/bootstrap-5.2.3/css/bootstrap.min.css">
        <style>
          /* Basic styling for print layout */
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
        <!-- Content wrapper for the printable view -->
        <div class="content">
          <h2>Purchase Order</h2>
          ${outerTableHTML} <!-- Insert the table HTML -->
        </div>
      </body>
    </html>`;

  // Write the print view content to the new window
  newWindow.document.write(printView);

  // Delay printing to allow content to fully render before print dialog shows
  setTimeout(() => {
    newWindow.stop();   // Stop loading resources (if any still pending)
    newWindow.print();  // Trigger print dialog
    newWindow.close();  // Close the print window after printing
  }, 1500); // Delay in milliseconds
}


// Function to validate the Good Receive Note form for required fields
const checkFormError = () => {
  let formInputErrors = "";

  if (goodReceiveNote.supplier_id == null) {
    formInputErrors += "❗🏢 Please Select a Supplier...! \n";
  }

  if (goodReceiveNote.date_of_receipt == null) {
    formInputErrors += "❗📅 Please Select a Receipt Date...! \n";
  }

  if (goodReceiveNote.supplier_bill_no == null) {
    formInputErrors += "❗🧾 Please Enter Supplier Bill No...! \n";
  }

  if (goodReceiveNote.total_amount == null) {
    formInputErrors += "❗💰 Please Enter a Total Amount...! \n";
  }

  if (goodReceiveNote.grn_status_id.name == null) {
    formInputErrors += "❗📶 Please Select Status...! \n";
  }

  if (goodReceiveNote.grnHasItemList.length === 0) {
    formInputErrors += "❗📦 Please Select Order Item(s)...! \n";
  }

  return formInputErrors;
};



// Function to handle form submission for Good Receive Note
const buttonGrnSubmit = () => {
  console.log(goodReceiveNote);

  // Step 1: Validate the form
  let errors = checkFormError();

  if (errors === "") {
    // Step 2: Show confirmation dialog
    Swal.fire({
      title: "Are you sure to add the following GRN?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🏢 <b>Supplier:</b> " + goodReceiveNote.supplier_id.suppliername + "<br>" +
        "📅 <b>Receipt Date:</b> " + goodReceiveNote.date_of_receipt + "<br>" +
        "🧾 <b>Bill No:</b> " + goodReceiveNote.supplier_bill_no + "<br>" +
        "💰 <b>Total Amount:</b> " + goodReceiveNote.total_amount + "<br>" +
        "🎁 <b>Discount Amount:</b> " + goodReceiveNote.discount_amount + "<br>" +
        "🧮 <b>Net Amount:</b> " + goodReceiveNote.net_amount + "<br>" +
        "📶 <b>GRN Status:</b> " + goodReceiveNote.grn_status_id.name +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add GRN"
    }).then((result) => {
      if (result.isConfirmed) {
        // Step 3: Submit to backend
        let postResponse = getHTTPServiceRequest("/goodreceivenote/insert", "POST", goodReceiveNote);

        if (postResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,
            showConfirmButton: false
          });

          refreshGoodReceiveNoteTable();
          refreshGoodReceiveNoteForm();
          $("#offcanvasGrnForm").offcanvas("hide");
        } else {
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
    // Step 4: Show validation errors
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
  let updates = ""; // Initialize a string to store detected changes

  // Ensure both current and original Good Receive Note objects are available
  if (goodReceiveNote != null && oldGoodReceiveNote != null) {

    if (goodReceiveNote.supplier_id.suppliername != oldGoodReceiveNote.supplier_id.suppliername) {
      updates += "🏢 Supplier is changed..! \n";
    }

    if (goodReceiveNote.supplierpurchaseorder_id.order_code != oldGoodReceiveNote.supplierpurchaseorder_id.order_code) {
      updates += "📄 Purchase Order is changed..! \n";
    }

    if (goodReceiveNote.date_of_receipt != oldGoodReceiveNote.date_of_receipt) {
      updates += "📅 Receipt Date is changed..! \n";
    }

    if (goodReceiveNote.supplier_bill_no != oldGoodReceiveNote.supplier_bill_no) {
      updates += "🧾 Supplier Bill No is changed..! \n";
    }

    if (goodReceiveNote.total_amount != oldGoodReceiveNote.total_amount) {
      updates += "💰 Total Amount is changed..! \n";
    }

    if (goodReceiveNote.discount_amount != oldGoodReceiveNote.discount_amount) {
      updates += "📉 Discount Amount is changed..! \n";
    }

    if (goodReceiveNote.net_amount != oldGoodReceiveNote.net_amount) {
      updates += "🧾 Net Amount is changed..! \n";
    }

    if (goodReceiveNote.grn_status_id.name != oldGoodReceiveNote.grn_status_id.name) {
      updates += "⚙️ Status is changed..! \n";
    }
  }

  // Return the list of detected updates (or empty string if no changes)
  return updates;
}



// Handle update action for good receive note form
const buttonGrnUpdate = () => {
  let errors = checkFormError();

  if (errors == "") {
    let updates = checkFormUpdate();

    if (updates == "") {
      // No changes detected
      Swal.fire({
        title: "No Updates",
        text: "Nothing to update..!",
        icon: "info",
        width: "20em",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Confirmation dialog with update summary
      Swal.fire({
        title: "Are you sure you want to update the following changes?",
        html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update GRN"
      }).then((result) => {
        if (result.isConfirmed) {
          let putResponse = getHTTPServiceRequest("/goodreceivenote/update", "PUT", goodReceiveNote);

          if (putResponse == "OK") {
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500
            });

            refreshGoodReceiveNoteTable();
            refreshGoodReceiveNoteForm();
            $("#offcanvasGrnForm").offcanvas("hide");
          } else {
            Swal.fire({
              title: "Failed to update!",
              html: "<pre>" + putResponse + "</pre>",
              icon: "error",
              width: "20em",
              showConfirmButton: false,
              timer: 2000
            });
          }
        }
      });
    }
  } else {
    // Validation errors display
    Swal.fire({
      title: "Form has following errors!",
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      icon: "warning",
      width: "20em",
      showConfirmButton: false,
      timer: 2000
    });
  }
};


// Function to clear the main GRN form after user confirmation
const clearGrnForm = () => {
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
      refreshGoodReceiveNoteForm();
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
const clearGrnInnerForm = () => {
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
      refreshGrnInnerForm();
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

