// On browser window load event
// Execute these functions once the page fully loads
window.addEventListener("load", () => {
  refreshMenuTable(); // Load and display the menu table data
  refreshMenuForm();  // Reset and initialize the menu form for new entry
});

//Function to Refresh and reload the menu table data after any CRUD operation
const refreshMenuTable = () => {

  // Call backend API via GET request to retrieve all menu records
  let menus = getServiceRequest('/menu/activelist');

  // Define table columns and how each property should be displayed
  let propertyList = [
    { propertyName: "menu_photo", dataType: "image-array" }, 
    { propertyName: "name", dataType: "string" },            
    { propertyName: "price", dataType: "decimal" },          
    { propertyName: getMenuStatus, dataType: "function" }
  ];

  // Inject the data into the table with action buttons (Edit, Delete, View)
  // Uses helper: fillDataIntoTable() to map properties to rows
  fillDataIntoTable(
    tableMenuBody,         // Table body element
    menus,                 // Data list from backend
    propertyList,          // Property mapping
    menuMenuFormRefill,    // Function to refill form for editing
    menuMenuDelete,        // Function to handle delete
    menuMenuView           // Function to handle view/details
  );

  // Loop through each menu item and apply custom UI changes based on status
  for (const index in menus) {
    // If menu item's status is "Discontinued", hide its update/edit button
    if (menus[index].menu_status_id.name === "Discontinued") {
      // Locate the update button DOM node and apply Bootstrap "d-none" to hide
      tableMenuBody.children[index].lastChild.children[0].children[1].children[0]
        .children[1].classList.add("d-none");
    }
  }

  // Apply jQuery DataTables plugin to the table
  // Enables: pagination, search/filtering, sorting, responsive layout
  $("#tableMenu").DataTable();
}


//Function to Reset and initialize the Menu form to its default state
const refreshMenuForm = () => {

  // Initialize the global 'menu' object to store form data
  menu = new Object();

  // Create empty arrays to store submenu and liquor menu associations
  menu.menuHasSubMenuList = new Array();
  menu.menuHasLiquorMenuList = new Array();

  // Reset all form fields to their default values
  formMenu.reset();

  // Clear the photo input field
  menuPhotoInput.value = "";

  // Set the default image for the photo preview
  menuPhotoPreview.src = "/images/foodplate.png";

  // Reset text fields and dropdowns to default values
  setDefault([textMenuName,textPrice,selectStatus]);

  // Get all available menu statuses from the backend
  let menustatuses = getServiceRequest('menustatus/alldata');

  // Populate the status dropdown with retrieved values
  fillDataIntoSelect(selectStatus,"Please Select Status",menustatuses,"name");

  // Hide the Update button (used only when editing an existing item)
  buttonUpdate.classList.add("d-none");

  // Show the Submit button (used when adding a new item)
  buttonSubmit.classList.remove("d-none");

  // Reset and refresh inner submenu and liquor menu sections
  refreshMenuHasSubMenuInnerFom();
  refreshMenuHasLiquorMenuInnerFom();
}

//============================ menuHasSubMenu inner form start =================================================

// Function to check if the selected submenu item already exists 
const checkItemExt = () => {

  // Convert the selected item from dropdown (JSON string) to an object
  let selectedItem = JSON.parse(selectSubMenu.value);

  // Search for the selected item's ID in the current submenu ingredient list
  // Create an array of ingredient IDs and check if the selected item's ID is present
  let extIndex = menu.menuHasSubMenuList
    .map(menuItem => menuItem.submenu_id.id) // Extract IDs from existing liquormenu ingredient items
    .indexOf(selectedItem.id);                               // Find index of selected item ID

  // If the item is found (already exists), show a warning alert to the user
  if (extIndex > -1) {
    Swal.fire({
      title: "Selected Item Already Exists..!",
      text: "Please select another item.",
      icon: "warning",
      width: "20em",
      showConfirmButton: false,
      timer: 2000
    });

    // Clear and reset the inner liquormenu ingredient form to allow selecting a different item
    refreshMenuHasSubMenuInnerFom();
  } else {
    // If item is not a duplicate, pre-fill the unit price input field with the selected item's price
    textSubUnitPrice.value = parseFloat(selectedItem.submenu_price).toFixed(2);

    // Set the purchaseOrderHasItem's unit price to match the selected item's price
    menuHasSubMenu.price = parseFloat(textSubUnitPrice.value).toFixed(2);

    // Color the element
    textSubUnitPrice.classList.remove("is-invalid");
    textSubUnitPrice.classList.add("is-valid");
    textSubUnitPrice.style.border = "2px solid green";
    textSubUnitPrice.style.backgroundColor = "#c6f6d5";
  }
}

// Define function to calculate the line price for a submenu order item
const calculateLinePrice = () => {

  // Check if the entered quantity is greater than zero
  if (textSubQuantity.value > 0) {

    // Calculate line price by multiplying quantity and unit price, then format to 2 decimals
    let linePrice = (parseFloat(textSubQuantity.value) * parseFloat(textSubUnitPrice.value)).toFixed(2);

    // Store the calculated line price in the submenu order item object
    menuHasSubMenu.line_price = linePrice;

    // Update the line price input field with the calculated value
    textSubLinePrice.value = linePrice;

    // Remove any invalid styling and apply valid styles (green border and light green background)
    textSubLinePrice.classList.remove("is-invalid");
    textSubLinePrice.classList.add("is-valid");
    textSubLinePrice.style.border = "2px solid green";
    textSubLinePrice.style.backgroundColor = "#c6f6d5";

    // This visually indicates the line price input is valid
  } else {
    // If quantity is zero, empty, or invalid, reset values and show validation errors

    // Clear quantity and line price in the submenu order item object
    menuHasSubMenu.qty = null;
    menuHasSubMenu.line_price = null;

    // Apply invalid styles to quantity input (red border and light red background)
    textSubQuantity.classList.remove("is-valid");
    textSubQuantity.classList.add("is-invalid");
    textSubQuantity.style.border = "2px solid red";
    textSubQuantity.style.backgroundColor = "#f8d7da";

    // Reset line price input field's border to default and clear its value
    textSubLinePrice.style.border = "1px solid #ced4da";
    textSubLinePrice.value = "";
  }

};


// Function to refresh the inner form of the liquormenu (submenu items)
const refreshMenuHasSubMenuInnerFom = () => {

  // Create a new empty object to hold the submenu item form data
  menuHasSubMenu = new Object();

  // Fetch all submenu items from backend API to populate the dropdown selector
  let submenus = getServiceRequest("/submenu/alldata");

  // Populate the 'selectSubMenu' dropdown with submenu names, with a placeholder prompt
  fillDataIntoSelect(selectSubMenu, "Please Select Sub Menu", submenus, "name");

  // Reset dropdown and input fields to default empty states
  setDefault([selectSubMenu, textSubUnitPrice, textSubQuantity, textSubLinePrice]);

  // Hide the "Update" button, since this is a fresh form for adding new items
  menuHasSubMenubuttonInnerUpdate.classList.add("d-none");

  // Show the "Submit" button, enabling the user to add a new submenu item
  menuHasSubMenubuttonInnerSubmit.classList.remove("d-none");

  // Define how each column in the submenu item table will display its data
  // propertyName can be a string (direct property) or a function (to generate display value)
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" }, 
    { propertyName: "price", dataType: "decimal" },          
    { propertyName: "qty", dataType: "decimal" },            
    { propertyName: "line_price", dataType: "decimal" } 
  ];

  // Populate the submenu items table body with current list data
  // Also bind functions for refill form on row click and delete action
  fillDataIntoInnerTable(
    tableMenuHasSubMenuItemBody,  // Table body element
    menu.menuHasSubMenuList,      // Array of submenu items in the menu
    propertyList,                 // How to display each property
    menuHasSubMenuFormRefill,     // Function to refill form on row edit
    menuHasSubMenuDelete,         // Function to delete an item
    true                         // Possibly to enable some option (like re-init)
  );

  // Enable the submenu selection dropdown (in case it was disabled)
  selectSubMenu.disabled = "";

  // Clear the unit price field and disable manual editing to prevent user input
  textSubUnitPrice.value = "";
  textSubUnitPrice.disabled = "disabled";

  // Clear the quantity input field
  textSubQuantity.value = "";

  // Clear the line price field and disable manual editing
  textSubLinePrice.value = "";
  textSubLinePrice.disabled = "disabled";

  // Initialize DataTables plugin on the submenu item table for sorting, pagination, and searching features
  $("#tableMenuHasSubMenuItem").DataTable();
}

// Define a function to generate the display name for a submenu item row
const generateItemName = (ob) => {
  return ob.submenu_id.name; // Return the submenu's name property for display in the table
}


// Define a function to refill the inner form when editing an existing submenu item
const menuHasSubMenuFormRefill = (ob, index) => {

  // Save the index of the item being edited to update the correct entry later
  innerFormIndex = index;

  // Deep copy the selected item object to avoid accidental changes to the original data
  menuHasSubMenu = JSON.parse(JSON.stringify(ob));     // Editable copy bound to the form
  oldmenuHasSubMenu = JSON.parse(JSON.stringify(ob));  // Original copy for comparing changes

  // Set the submenu dropdown value by converting the submenu object to a JSON string
  // Dropdown option values store the whole submenu object as JSON
  selectSubMenu.value = JSON.stringify(menuHasSubMenu.submenu_id);

  // Disable the submenu dropdown to prevent changing the submenu during update
  selectSubMenu.disabled = "disabled";

  // Populate unit price input with the submenu item's price (converted to float)
  textSubUnitPrice.value = parseFloat(menuHasSubMenu.price);

  // Populate quantity input with the submenu item's quantity
  textSubQuantity.value = menuHasSubMenu.qty;

  // Populate line price input with the submenu item's line price (converted to float)
  textSubLinePrice.value = parseFloat(menuHasSubMenu.line_price);

  // Show the Update button to allow the user to save changes
  menuHasSubMenubuttonInnerUpdate.classList.remove("d-none");

  // Hide the Submit button to avoid duplicate new entries during editing
  menuHasSubMenubuttonInnerSubmit.classList.add("d-none");
}

// Define a function to delete a submenu item from the form list
const menuHasSubMenuDelete = (ob, index) => {

  // Show a confirmation dialog with details of the item to be deleted
  Swal.fire({
    title: "Are you sure to remove the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🍽️ <b>Item Name:</b> " + ob.submenu_id.name + "<br>" +
      "💰 <b>Unit Price:</b> " + ob.price + "<br>" +
      "🔢 <b>Quantity:</b> " + ob.qty + "<br>" +
      "🧾 <b>Line Price:</b> " + ob.line_price +
      "</div>",
    icon: "warning",                // Warning icon to highlight the action
    showCancelButton: true,         // Allow user to cancel the deletion
    width: "20em",                  // Set popup width
    confirmButtonColor: "#3085d6",  // Confirm button color (blue)
    cancelButtonColor: "#d33",      // Cancel button color (red)
    confirmButtonText: "Yes, Remove Item" // Text for confirm button
  }).then((result) => {

    // If the user confirms deletion
    if (result.isConfirmed) {

      // Show a brief success message confirming item removal
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Removed!",
        text: "Item removed successfully from the list.",
        timer: 1500,               // Auto-close after 1.5 seconds
        showConfirmButton: false   // Hide OK button
      });

      // Find the index of the submenu item to delete by matching submenu_id.id
      let extIndex = menu.menuHasSubMenuList
        .map((orderitem) => orderitem.submenu_id.id)  // Create array of submenu item IDs
        .indexOf(ob.submenu_id.id);                    // Find index of item matching the id

      // If the item is found in the list
      if (extIndex !== -1) {
        // Remove the item from the list using splice
        menu.menuHasSubMenuList.splice(extIndex, 1);
      }

      // Refresh the submenu inner form and table to reflect the deletion
      refreshMenuHasSubMenuInnerFom();
    }
  });
}

// Define a function to submit the inner form and add a new submenu item
const buttonMenuHasSubMenuInnerSubmit = () => {
  // Log the current submenu item object to the console for debugging
  console.log(menuHasSubMenu);

  // Display a confirmation dialog showing the details of the item to be added
  Swal.fire({
    title: "Are you sure to add the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🍽️ <b>Item Name:</b> " + menuHasSubMenu.submenu_id.name + "<br>" +
      "💰 <b>Unit Price:</b> " + menuHasSubMenu.price + "<br>" +
      "🔢 <b>Quantity:</b> " + menuHasSubMenu.qty + "<br>" +
      "🧾 <b>Line Price:</b> " + menuHasSubMenu.line_price +
      "</div>",
    icon: "warning",               // Show a warning icon to indicate confirmation is needed
    width: "20em",                 // Set the width of the popup
    showCancelButton: true,        // Provide a cancel button
    confirmButtonColor: "#3085d6", // Style the confirm button with blue color
    cancelButtonColor: "#d33",     // Style the cancel button with red color
    confirmButtonText: "Yes, Add Item" // Text on the confirm button
  }).then((result) => {
    // If the user confirms the addition of the item
    if (result.isConfirmed) {
      // Show a brief success message indicating the item was added
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Added Successfully!",
        timer: 1500,               // Automatically close after 1.5 seconds
        showConfirmButton: false   // Do not show the OK button
      });

      // Append the new submenu ingredient item to the submenu's ingredient list array
      menu.menuHasSubMenuList.push(menuHasSubMenu);

      // Refresh the inner form and the table to show the updated ingredient list
      refreshMenuHasSubMenuInnerFom();
    }
  });
}


// Define a function to update the inner form (edit an existing ingredient item)
const buttonMenuHasSubMenuInnerUpdate = () => {
  // Log the updated submenu item object to the console for debugging purposes
  console.log(menuHasSubMenu);

  // Check if either the quantity or the line price has changed compared to the original object
  if (menuHasSubMenu.qty != oldmenuHasSubMenu.qty &&
    menuHasSubMenu.line_price != oldmenuHasSubMenu.line_price) {

    let updates = ""; // Initialize a string to accumulate descriptions of what changed

    // Check if the submenu item itself has changed
    if (menuHasSubMenu.submenu_id != oldmenuHasSubMenu.submenu_id)
      updates += "🍽️ Sub Menu is changed..! <br>"; // Append message about submenu change

    // Check if the quantity has changed
    if (menuHasSubMenu.qty != oldmenuHasSubMenu.qty)
      updates += "🔢 Quantity is changed..! <br>"; // Append message about quantity change

    // Show a confirmation popup summarizing the detected changes
    Swal.fire({
      icon: "warning",             // Display warning icon
      width: "20em",               // Set popup width
      showCancelButton: true,      // Enable cancel button
      confirmButtonColor: "#3085d6", // Confirm button blue color
      cancelButtonColor: "#d33",     // Cancel button red color
      confirmButtonText: "Yes, Update Item" // Confirm button text
    }).then((result) => {
      // If user confirms to proceed with the update
      if (result.isConfirmed) {
        // Replace the old item in the submenu ingredient list with the updated object at the stored index
        menu.menuHasSubMenuList[innerFormIndex] = menuHasSubMenu;

        // Show a success message confirming the update
        Swal.fire({
          title: "Item Updated Successfully!",
          icon: "success",
          width: "20em",
          showConfirmButton: false,
          timer: 1500 // Auto close after 1.5 seconds
        });

        // Reset the inner form and refresh the ingredient list table to reflect changes
        refreshMenuHasSubMenuInnerFom();
      }
    });

  } else {
    // If no changes detected, show an informational popup that nothing was updated
    Swal.fire({
      title: "No Updates",
      text: "Nothing to update..!",
      icon: "info",
      width: "20em",
      showConfirmButton: false,
      timer: 1500 // Auto close after 1.5 seconds
    });
  }
}
//============================ menuHasSubMenu inner form end ==================================================

//============================menuHasLiquorMenu inner form start===============================================

// Function to check if the selected liquormenu ingredient item already exists 
const checkLiquorMenuExt = () => {

  // Convert the selected item from dropdown (JSON string) to an object
  // Example: '{"id":1,"name":"Sugar"}' becomes {id: 1, name: "Sugar"}
  let selectedItem = JSON.parse(selectLiquorMenu.value);

  // Search for the selected item's ID in the current liquormenu ingredient list
  // Create an array of liquormenu IDs and check if the selected item's ID is present
  let extIndex = menu.menuHasLiquorMenuList
    .map(menuItem => menuItem.liquormenu_id.id) // Extract IDs from existing liquormenu ingredient items
    .indexOf(selectedItem.id);                   // Find index of selected item ID

  // If the item is found (already exists), show a warning alert to the user
  if (extIndex > -1) {
    Swal.fire({
      title: "Selected Item Already Exists..!",
      text: "Please select another item.",
      icon: "warning",
      width: "20em",
      showConfirmButton: false,
      timer: 2000
    });

    // Clear and reset the inner liquormenu ingredient form to allow selecting a different item
    refreshMenuHasLiquorMenuInnerFom();

  } else {
    // If item is not a duplicate, pre-fill the unit price input field with the selected item's purchase price
    textLiquorUnitPrice.value = parseFloat(selectedItem.liquormenuprice).toFixed(2);

    // Set the menuHasLiquorMenu's unit price to match the selected item's price
    menuHasLiquorMenu.price = parseFloat(textLiquorUnitPrice.value).toFixed(2);

    // Visually indicate valid input by setting styles
    textLiquorUnitPrice.classList.remove("is-invalid");
    textLiquorUnitPrice.classList.add("is-valid");
    textLiquorUnitPrice.style.border = "2px solid green";
    textLiquorUnitPrice.style.backgroundColor = "#c6f6d5";
  }
}


// Define function to calculate the line price for a liquormenu order item
const calculateTotalPrice = () => {

  // Check if the entered quantity is greater than zero
  if (textLiquorQuantity.value > 0) {

    // Calculate line price: quantity × unit price, formatted to 2 decimal places
    let linePrice = (parseFloat(textLiquorQuantity.value) * parseFloat(textLiquorUnitPrice.value)).toFixed(2);

    // Assign the calculated line price to the menuHasLiquorMenu object
    menuHasLiquorMenu.line_price = linePrice;

    // Update the line price input field with the calculated value
    textLiquorLinePrice.value = linePrice;

    // Remove invalid styling and apply valid styling to the line price input
    textLiquorLinePrice.classList.remove("is-invalid");
    textLiquorLinePrice.classList.add("is-valid");

    // Apply green border and light green background to indicate valid input
    textLiquorLinePrice.style.border = "2px solid green";
    textLiquorLinePrice.style.backgroundColor = "#c6f6d5";

  } else {
    // If quantity is zero or invalid, reset related fields and styling

    // Clear quantity and line price in the menuHasLiquorMenu object
    menuHasLiquorMenu.qty = null;
    menuHasLiquorMenu.line_price = null;

    // Remove valid styling and apply invalid styling to the quantity input
    textLiquorQuantity.classList.remove("is-valid");
    textLiquorQuantity.classList.add("is-invalid");

    // Apply red border and light red background to indicate invalid input
    textLiquorQuantity.style.border = "2px solid red";
    textLiquorQuantity.style.backgroundColor = "#f8d7da";

    // Reset the line price input field styling and clear its value
    textLiquorLinePrice.style.border = "1px solid #ced4da";
    textLiquorLinePrice.value = "";
  }

}

// Function to refresh the inner form of the liquor menu items
const refreshMenuHasLiquorMenuInnerFom = () => {

  // Initialize a new empty object for the liquor menu item form data
  menuHasLiquorMenu = new Object();

  // Fetch all liquor menu items from backend API to populate the dropdown
  let liquormenus = getServiceRequest("/liquormenu/alldata");

  // Populate the liquor menu selection dropdown with fetched data
  fillDataIntoSelect(selectLiquorMenu, "Please Select Liquor Menu", liquormenus, "name");

  // Reset dropdown and input fields to default (empty) state
  setDefault([selectLiquorMenu, textLiquorUnitPrice, textLiquorQuantity, textLiquorLinePrice]);

  // Hide the "Update" button as this is a fresh form (not in edit mode)
  menuHasLiquorMenubuttonInnerUpdate.classList.add("d-none");

  // Show the "Submit" button to allow adding a new item
  menuHasLiquorMenubuttonInnerSubmit.classList.remove("d-none");

  // Define the columns and data types for the liquor menu items table
  let dataList = [
    { propertyName: generateLiquorMenuName, dataType: "function" }, // Function to generate/display the item name
    { propertyName: "price", dataType: "decimal" },                 // Unit price as decimal
    { propertyName: "qty", dataType: "decimal" },                   // Quantity as decimal
    { propertyName: "line_price", dataType: "decimal" }             // Calculated line price as decimal
  ];

  // Fill the inner table body with the current list of liquor menu items
  // Attach form refill and delete handlers for each row
  fillDataIntoInnerTable(
    tableMenuHasLiquorMenuItemBody,       // Table body element
    menu.menuHasLiquorMenuList,            // Data array of liquor menu items
    dataList,                             // Column definitions
    menuHasLiquorMenuFormRefill,           // Form refill function on row select
    menuHasLiquorMenuDelete,                // Delete function on row action
    true                                 // Flag for additional behavior (like DataTable)
  );

  // Enable the liquor menu selection dropdown for user interaction
  selectLiquorMenu.disabled = "";

  // Clear and disable the unit price field to prevent manual editing
  textLiquorUnitPrice.value = "";
  textLiquorUnitPrice.disabled = "disabled";

  // Clear the quantity input field
  textLiquorQuantity.value = "";

  // Clear and disable the line price field to prevent manual editing
  textLiquorLinePrice.value = "";
  textLiquorLinePrice.disabled = "disabled";

  // Initialize DataTables plugin for the liquor menu items table to enable sorting, searching, pagination, etc.
  $("#tableMenuHasLiquorMenuItem").DataTable();
}


// Define a function to generate item name
const generateLiquorMenuName = (ob) => {
  return ob.liquormenu_id.name;
}

// Function to refill the inner form when editing an existing liquor menu item
const menuHasLiquorMenuFormRefill = (ob, index) => {

  // Store the index of the item being edited (used to update the correct item later)
  innerFormIndex = index;

  // Deep clone the selected item object to avoid mutating the original data directly
  menuHasLiquorMenu = JSON.parse(JSON.stringify(ob));      // Editable copy for form binding
  oldmenuHasLiquorMenu = JSON.parse(JSON.stringify(ob));   // Original copy for comparison/rollback

  // Set the liquor menu dropdown to the selected item
  // The dropdown expects JSON string values like '{"id":1,"name":"Sugar"}'
  selectLiquorMenu.value = JSON.stringify(menuHasLiquorMenu.liquormenu_id);

  // Disable the dropdown to prevent changing the liquor menu item while editing
  selectLiquorMenu.disabled = "disabled";

  // Populate the unit price, quantity, and line price input fields with existing values
  textLiquorUnitPrice.value = parseFloat(menuHasLiquorMenu.price);
  textLiquorQuantity.value = menuHasLiquorMenu.qty;
  textLiquorLinePrice.value = parseFloat(menuHasLiquorMenu.line_price);

  // Toggle visibility of buttons: show "Update" and hide "Submit" to avoid duplicate additions
  menuHasLiquorMenubuttonInnerUpdate.classList.remove("d-none");  // Show Update button
  menuHasLiquorMenubuttonInnerSubmit.classList.add("d-none");     // Hide Submit button
}


// Function to delete a liquor menu item from the submenu ingredient list
const menuHasLiquorMenuDelete = (ob, index) => {

  // Show confirmation popup displaying the selected item's details
  Swal.fire({
    title: "Are you sure to remove the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🍽️ <b>Item Name:</b> " + ob.liquormenu_id.name + "<br>" +
      "💰 <b>Unit Price:</b> " + ob.price + "<br>" +
      "🔢 <b>Quantity:</b> " + ob.qty + "<br>" +
      "🧾 <b>Line Price:</b> " + ob.line_price +
      "</div>",
    icon: "warning",
    showCancelButton: true,
    width: "20em",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Remove Item"
  }).then((result) => {

    // Proceed only if user confirms deletion
    if (result.isConfirmed) {

      // Show a brief success notification
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Removed!",
        text: "Item removed successfully from the list.",
        timer: 1500,
        showConfirmButton: false
      });

      // Find the index of the item to delete by matching liquormenu ID
      let extIndex = menu.menuHasLiquorMenuList
        .map((orderitem) => orderitem.liquormenu_id.id)  // Create array of IDs
        .indexOf(ob.liquormenu_id.id);                   // Find matching index

      // Remove the item from the list if it exists
      if (extIndex !== -1) {
        menu.menuHasLiquorMenuList.splice(extIndex, 1);
      }

      // Refresh the inner form and table to reflect removal
      refreshMenuHasLiquorMenuInnerFom();
    }
  });
}

// Function to submit the inner form (add a new liquor menu item)
const buttonMenuHasLiquorMenuInnerSubmit = () => {
  console.log(menuHasLiquorMenu);

  Swal.fire({
    title: "Are you sure to add the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🍽️ <b>Item Name:</b> " + menuHasLiquorMenu.liquormenu_id.name + "<br>" +
      "💰 <b>Unit Price:</b> " + menuHasLiquorMenu.price + "<br>" +
      "🔢 <b>Quantity:</b> " + menuHasLiquorMenu.qty + "<br>" +
      "🧾 <b>Line Price:</b> " + menuHasLiquorMenu.line_price +
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

      // Add the liquor menu item to the list
      menu.menuHasLiquorMenuList.push(menuHasLiquorMenu);

      // Refresh the inner form and table to reflect the addition
      refreshMenuHasLiquorMenuInnerFom();
    }
  });
};


// Define a function to update the inner form 
const buttonMenuHasLiquorMenuInnerUpdate = () => {
  // Log the updated item object to the console for debugging
  console.log(menuHasLiquorMenu);

  // Check if quantity or line price were changed compared to the original item
  // Note: This condition requires BOTH quantity and line_price to be different to proceed
  if (menuHasLiquorMenu.qty != oldmenuHasLiquorMenu.qty &&
    menuHasLiquorMenu.line_price != oldmenuHasLiquorMenu.line_price) {

    let updates = ""; // String to hold descriptions of what changed

    // Check if the liquormenu item itself was changed (compares the entire object)
    if (menuHasLiquorMenu.liquormenu_id != oldmenuHasLiquorMenu.liquormenu_id)
      updates += "🍽️ Liquor Menu is changed..! <br>";

    // Check if the quantity was changed
    if (menuHasLiquorMenu.qty != oldmenuHasLiquorMenu.qty)
      updates += "🔢 Quantity is changed..! <br>";

    // Show confirmation popup summarizing changes before updating
    Swal.fire({
      icon: "warning",              // Warning icon for user attention
      width: "20em",                // Width of popup window
      showCancelButton: true,       // Show Cancel button alongside Confirm
      confirmButtonColor: "#3085d6",// Blue confirm button color
      cancelButtonColor: "#d33",    // Red cancel button color
      confirmButtonText: "Yes, Update Item" // Confirm button text
    }).then((result) => {
      // If user confirms the update
      if (result.isConfirmed) {
        // Replace the original item in the list at stored index with the updated item
        menu.menuHasLiquorMenuList[innerFormIndex] = menuHasLiquorMenu;

        // Show a quick success message after updating
        Swal.fire({
          title: "Item Updated Successfully!",
          icon: "success",
          width: "20em",
          showConfirmButton: false,
          timer: 1500 // Popup closes automatically after 1.5 seconds
        });

        // Reset the inner form and refresh the table to reflect changes
        refreshMenuHasLiquorMenuInnerFom();
      }
    });

  } else {
    // If no changes detected, show info popup that nothing was updated
    Swal.fire({
      title: "No Updates",
      text: "Nothing to update..!", // Inform user no changes were made
      icon: "info",                 // Info icon for notification
      width: "20em",
      showConfirmButton: false,     // No OK button needed
      timer: 1500                   // Auto close after 1.5 seconds
    });
  }
}

//============================menuHasLiquorMenu inner form end===============================================

// Define a function to get the appropriate menu status icon based on its status
const getMenuStatus = (dataOb) => {
  // If liquor menu status is "Available", return a green icon indicating availability
  if (dataOb.menu_status_id.name == "Available") {
    return (
      "<i class='fa-solid fa-file-contract fa-lg text-success'></i>" // Green icon for available status
    );
  }

  // If liquor menu status is "Out of Stock", return a yellow icon indicating warning
  if (dataOb.menu_status_id.name == "Out of Stock") {
    return (
      "<i class='fa-solid fa-file-contract fa-lg text-warning'></i>" // Yellow icon for warning/out of stock
    );
  }

  // If liquor menu status is "Discontinued", return a red icon indicating removal or discontinued status
  if (dataOb.menu_status_id.name == "Discontinued") {
    return (
      "<i class='fa-solid fa-file-contract fa-lg text-danger'></i>" // Red icon for discontinued status
    );
  }
}


// Function to refill the liquor menu form with existing data for editing
const menuMenuFormRefill = (ob, index) => {
  // Log the liquor menu object and index for debugging
  console.log("Edit", ob, index);
  // Optionally highlight the table row being edited (commented out)
  // tableEmployeeBody.children[index].style.backgroundColor = "orange";

  // Deep copy the passed liquor menu object to avoid direct mutation
  menu = JSON.parse(JSON.stringify(ob));
  oldMenu = JSON.parse(JSON.stringify(ob)); // Keep a copy of original data for comparison


  // Set the menu name input to the current menu's name
  textMenuName.value = ob.name;
  // Set the price input to the current menu's price
  textPrice.value = ob.price;

  // Set status dropdown to liquor menu's current status (value as JSON string)
  selectStatus.value = JSON.stringify(ob.menu_status_id);


  // Handle the liquor menu photo display
  if (ob.menu_photo != null) {
    // Decode base64 photo string and set it as image source
    menuPhotoPreview.src = atob(ob.menu_photo);
  } else {
    // Use default placeholder image if no photo exists
    menuPhotoPreview.src = "/images/foodplate.png";
  }

  // Show the Update button (for saving edits)
  buttonUpdate.classList.remove("d-none");

  // Hide the Submit button (used for new entries)
  buttonSubmit.classList.add("d-none");

  // Show the liquor menu form offcanvas panel (Bootstrap offcanvas)
  $("#offcanvasMenuForm").offcanvas("show");

  // Refresh the inner submenus and liquor menu ingredient forms
  refreshMenuHasSubMenuInnerFom();
  refreshMenuHasLiquorMenuInnerFom();
}


// Define function to delete a liquor menu record
const menuMenuDelete = (dataOb, index) => {
  // Show a confirmation dialog with liquor menu details using SweetAlert2
  Swal.fire({
    title: "Are you sure to delete the following Menu?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "📝 <b>Name:</b> " + dataOb.name + "<br>" +
      "💰 <b>Price:</b> " + dataOb.price + "<br>" +
      "⚙️ <b>Status:</b> " + dataOb.menu_status_id.name +
      "</div>",
    icon: "warning",
    showCancelButton: true,
    width: "20em",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete Menu"
  }).then((result) => {
    // If user confirms deletion
    if (result.isConfirmed) {
      // Send a DELETE request to backend API to delete liquor menu record
      let deleteResponse = getHTTPServiceRequest("/menu/delete", "DELETE", dataOb);

      // If deletion succeeded
      if (deleteResponse === "OK") {
        // Show a brief success message
        Swal.fire({
          icon: "success",
          width: "20em",
          title: "Deleted!",
          text: "Menu deleted successfully.",
          timer: 1500,
          showConfirmButton: false
        });

        // Refresh the liquor menu table and form on page without reload
        refreshMenuTable();
        refreshMenuForm();

        // Hide the liquor menu view offcanvas panel (if open)
        $("#offcanvasMenuView").offcanvas("hide");
      } else {
        // Show error alert if deletion failed, displaying error message
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


// Define function to view/print a submenu record's details
const menuMenuView = (ob, index) => {
  // Log the submenu object and its index for debugging
  console.log("View", ob, index);

  // Display submenu name
  tdName.innerText = ob.name;

  // Display submenu price
  tdPrice.innerText = ob.price;

  // Display the submenu status (Available, Out of Stock, etc.)
  tdStatus.innerText = ob.menu_status_id.name;

  // Define how each column in the ingredient list table will display data
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" },
    { propertyName: "price", dataType: "decimal" },
    { propertyName: "qty", dataType: "decimal" },
    { propertyName: "line_price", dataType: "decimal" }
  ];

  // Fill the ingredient table body with current ingredient list items
  // Also attach form refill and delete handlers for row actions
  fillDataIntoInnerTable(
    printtableMenuHasSubMenuItemBody,
    ob.menuHasSubMenuList,
    propertyList,
    menuHasSubMenuFormRefill,
    menuHasSubMenuDelete,
    false
  );

  // Define how each column in the liquor menu ingredient list will display data
  let dataList = [
    { propertyName: generateLiquorMenuName, dataType: "function" },
    { propertyName: "price", dataType: "decimal" },
    { propertyName: "qty", dataType: "decimal" },
    { propertyName: "line_price", dataType: "decimal" }
  ];

  // Fill the liquor menu ingredient table body with current ingredient list items
  // Also attach form refill and delete handlers for row actions
  fillDataIntoInnerTable(
    printtableMenuHasLiquorMenuItem,
    ob.menuHasLiquorMenuList,
    dataList,
    menuHasLiquorMenuFormRefill,
    menuHasLiquorMenuDelete,
    false
  );

  // Show the submenu details panel (offcanvas) using jQuery
  $("#offcanvasMenuView").offcanvas("show");
}

// Function to handle printing the liquor menu view table
const buttonPrintRow = () => {

  // Get the full HTML of the liquor menu view table (including the table tag and contents)
  const outerTableHTML = tableMenuView.outerHTML;

  // Open a new browser window/tab for the print preview
  let newWindow = window.open();

  // Create the full HTML content for the print window including styles and the table
  let printView = `<html>
      <head>
        <title>Print Menu</title>
        <!-- Link to Bootstrap CSS for consistent styling -->
        <link rel="stylesheet" href="../../Resources/bootstrap-5.2.3/css/bootstrap.min.css">
        <style>
          /* Basic styling for the print page */
          body {
            font-family: Arial, sans-serif;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color:#efeeff;
            margin: 0;
          }
          /* Container to hold the table nicely */
          .content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
          }
          /* Table padding for readability */
          .table th, .table td {
            padding: 6px 10px;
          }
          /* Bold and left-align table headers */
          .table th {
            text-align: left;
            font-weight: bold;
          }
          /* Centered title style */
          h2 {
            text-align: center;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="content">
          ${outerTableHTML}  <!-- Insert the liquor menu table HTML here -->
        </div>
      </body>
    </html>`;

  // Write the HTML content to the new window's document
  newWindow.document.write(printView);

  // Wait for 1.5 seconds to ensure all content and styles load before printing
  setTimeout(() => {
    newWindow.stop();    // Stop further loading in the print window
    newWindow.print();   // Trigger the print dialog
    newWindow.close();   // Close the print window after printing is done
  }, 1500);

  /**
   * Explanation:
   * `${tableLiquorMenuView.outerHTML}` uses template literals to embed the full HTML 
   * of a DOM element into a string.
   * - `outerHTML` gets the element plus all its children as HTML.
   * - Useful to create a printable version of a part of your page dynamically.
   */
}

// Function to check for form input errors and return error messages with icons
const checkFormError = () => {
  // Initialize a string to collect all error messages
  let formInputErrors = "";

  // Check if the name field is empty or null
  if (menu.name == null) {
    formInputErrors += "❗📝 Please enter Name...! \n";
  }

  // Check if the price field is empty or null
  if (menu.price == null) {
    formInputErrors += "❗💰 Please enter Price...! \n";
  }

  // Check if the liquor menu's status is not selected (null)
  if (menu.menu_status_id == null) {
    formInputErrors += "❗⚙️  Please select a Status...! \n";
  }

  // Check if no submenu items have been added to the sub menu's ingredient list
  if (menu.menuHasSubMenuList.length === 0) {
    formInputErrors += "❗🍽️ Please select Sub Menu Item(s)...! \n";
  }

  // Return all accumulated error messages (empty string if no errors)
  return formInputErrors;
}


// Function to handle submission of the menu form
const buttonMenuSubmit = () => {
  // Log the current  menu object for debugging
  console.log(menu);

  // Step 1: Validate the form and get any errors
  let errors = checkFormError();

  // If there are no validation errors
  if (errors === "") {
    // Show a confirmation dialog with details of the menu to be added
    Swal.fire({
      title: "Are you sure to add the following Menu?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "📝 <b>Name:</b> " + menu.name + "<br>" +
        "💰 <b>Price:</b> " + menu.price + "<br>" +
        "⚙️ <b>Status:</b> " + menu.menu_status_id.name +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Menu"
    }).then((result) => {
      // If user confirms adding the menu
      if (result.isConfirmed) {
        // Send POST request to backend to insert the  menu record
        let postResponse = getHTTPServiceRequest("/menu/insert", "POST", menu);

        // If insertion is successful
        if (postResponse === "OK") {
          // Show a brief success message
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,
            showConfirmButton: false,
            draggable: true
          });

          // Refresh the menu table and form to show updated data
          refreshMenuTable();
          refreshMenuForm();

          // Hide the menu form offcanvas panel
          $("#offcanvasLiquorMenuForm").offcanvas("hide");
        } else {
          // If insertion failed, show error message with response details
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
    // If validation errors exist, show them in a warning alert
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form has following errors",
      // Replace line breaks with <br> for proper HTML display
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      confirmButtonColor: "#3085d6"
    });
  }
}
const checkFormUpdate = () => {
  let updates = "";

  if (menu != null && oldMenu != null) {
    if (menu.name != oldMenu.name) {
      updates += "📝 Name is updated..! \n";
    }
    if (menu.price != oldMenu.price) {
      updates += "💰 Price is updated..! \n";
    }
    if (menu.menu_status_id.name != oldMenu.menu_status_id.name) {
      updates += "⚙️ Status is updated..! \n";
    }
    if (menu.menu_photo != oldMenu.menu_photo) {
      updates += "🖼️ Photo is updated..! \n";
    }
  }

  // Check if the number of items in the new purchase order is different from the old one
  if (menu.menuHasSubMenuList.length !== oldMenu.menuHasSubMenuList.length) {
    updates += "📄 Sub Menu Item is changed..! \n";
  } else {
    const oldSubMenuMap = new Map();
    for (const oldItem of oldMenu.menuHasSubMenuList) {
      oldSubMenuMap.set(oldItem.submenu_id.id, oldItem);
    }

    let itemChanged = false;
    let qtyChanged = false;

    for (const newItem of menu.menuHasSubMenuList) {
      const oldItem = oldSubMenuMap.get(newItem.submenu_id.id);
      if (!oldItem) {
        itemChanged = true;
        break;
      } else if (oldItem.qty !== newItem.qty) {
        qtyChanged = true;
      }
    }

    if (itemChanged) {
      updates += "📄 Sub Menu Item is changed..! \n";
    } else if (qtyChanged) {
      updates += "🔢 Sub Menu Qty is changed..! \n";
    }
  }

  // First, check if number of items differ
  if (menu.menuHasLiquorMenuList.length !== oldMenu.menuHasLiquorMenuList.length) {
    updates += "📄 Liquor Menu Item is changed..! \n";
  } else {
    // Create a Map for old items keyed by liquormenu_id.id for quick lookup
    const oldItemsMap = new Map();
    for (const oldItem of oldMenu.menuHasLiquorMenuList) {
      oldItemsMap.set(oldItem.liquormenu_id.id, oldItem);
    }

    let itemChanged = false;
    let qtyChanged = false;

    for (const newItem of menu.menuHasLiquorMenuList) {
      const oldItem = oldItemsMap.get(newItem.liquormenu_id.id);

      if (!oldItem) {
        // New item not found in old list
        itemChanged = true;
        break;
      } else if (oldItem.qty !== newItem.qty) {
        // Quantity changed for an existing item
        qtyChanged = true;
      }
    }

    if (itemChanged) {
      updates += "📄 Liquor Menu Item is changed..! \n";
    } else if (qtyChanged) {
      updates += "🔢 Liquor Menu Qty is changed..! \n";
    }
  }


  return updates;
}



// Function to handle updating the liquor menu form data
const buttonMenuUpdate = () => {
  // Step 1: Validate the form and collect any errors
  let errors = checkFormError(); // Checks required fields and returns error messages

  // Proceed only if no errors
  if (errors === "") {
    // Step 2: Check if there are any changes compared to the old data
    let updates = checkFormUpdate(); // Returns a string describing what fields were changed

    // If no updates detected, inform the user
    if (updates === "") {
      Swal.fire({
        title: "No Updates",
        text: "Nothing to update..",
        icon: "info",
        width: "20em",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // If there are updates, ask the user to confirm before applying changes
      Swal.fire({
        title: "Are you sure you want to update the following changes?",
        // Display the list of changes with line breaks converted for HTML
        html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update Sub Menu"
      }).then((result) => {
        // If user confirms the update
        if (result.isConfirmed) {
          // Send PUT request to update the liquor menu record on the backend
          let putResponse = getHTTPServiceRequest("/menu/update", "PUT", menu);

          // If update was successful
          if (putResponse === "OK") {
            // Show success message briefly
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500,
              draggable: true
            });

            // Refresh the liquor menu table to reflect updated data
            refreshMenuTable();

            // Reset and refresh the liquor menu form to default state
            refreshMenuForm();

            // Close the liquor menu offcanvas form panel
            $("#offcanvasMenuForm").offcanvas("hide");
          } else {
            // If update failed, show error message with backend response
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
    // If validation errors exist, show them to the user in a warning alert
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
}


// Define a function to clear menu photo
function clearMenuPhoto() {
  // Get the photo file input element by ID
  const photoInput = document.getElementById("menuPhotoInput");
  if (photoInput) {
    // Clear the selected file so the input is reset
    photoInput.value = "";
  }

  // Get the photo preview image element by ID
  const previewImage = document.getElementById("menuPhotoPreview");
  if (previewImage) {
    // Reset the preview image to the default placeholder image
    previewImage.src = "/images/foodplate.png"; // Update path if needed
  }

  // If the liquormenu object exists (used for data binding), clear its photo data
  if (typeof menu !== "undefined") {
    menu.menu_photo = null;
  }
}


// Function to clear the menu main form after confirming with the user
const clearMenuForm = () => {
  // Show confirmation dialog with SweetAlert2 asking user if they want to refresh the form
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
    // If user confirms clearing the form
    if (result.isConfirmed) {
      // Reset the form fields by calling the refresh function
      refreshMenuForm();

      // Show a brief success message that the form was cleared
      Swal.fire({
        title: "Form cleared!",
        icon: "success",
        width: "20em",
        timer: 1200,               // Auto-close after 1.2 seconds
        showConfirmButton: false,
        draggable: true      
      });
    }
  });
}


// Function to clear the submenu inner form after user confirmation
const clearSubMenuInnerForm = () => {
  // Show confirmation dialog using SweetAlert2
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
      // Call the function to reset the submenu inner form fields and UI
      refreshMenuHasSubMenuInnerFom();

      // Show brief success message after form cleared
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
}

// Function to clear the liquormenu inner form after user confirmation
const clearMenuHasLiquorMenuInnerForm = () => {
  // Show confirmation dialog using SweetAlert2
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
      // Call the function to reset the liquormenu inner form fields and UI
      refreshMenuHasLiquorMenuInnerFom();

      // Show brief success message after form cleared
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
}

