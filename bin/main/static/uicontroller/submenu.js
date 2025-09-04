// Create browser load event
// When the browser finishes loading, these two functions will be executed
window.addEventListener("load", () => {
  refreshSubMenuTable(); // Load submenu table data
  refreshSubMenuForm();  // Reset and prepare the submenu form
});

// Function to refresh and reload submenu table data
// This is called after any action like submit, update, delete
const refreshSubMenuTable = () => {

  // Get all submenu data from the backend using a GET API call
  let submenus = getServiceRequest('/submenu/activelist');

  // Define which properties from each submenu object to show in the table
  // Including photo, name, price, and status (handled by a function)
  let propertyList = [
    { propertyName: "submenu_photo", dataType: "image-array" }, // Display multiple images
    { propertyName: "name", dataType: "string" },               // Submenu name
    { propertyName: "submenu_price", dataType: "decimal" },     // Submenu price
    { propertyName: getSubMenuStatus, dataType: "function" }    // Status name from a function
  ];

  // Fill the table with submenu data using a reusable function
  // Also binds refill, delete, and view actions to each row
  fillDataIntoTable(tableSubMenuBody, submenus, propertyList, subMenuFormRefill, subMenuDelete, subMenuView);

  // Loop through each submenu entry
  for (const index in submenus) {
    // If the submenu is marked as "Discontinued"
    if (submenus[index].submenu_status_id.name == "Discontinued") {
      // Hide the update button by adding "d-none" class
      // This finds the specific DOM element using a nested structure
      tableSubMenuBody.children[index].lastChild.children[0].children[1].children[0]
        .children[1].classList.add("d-none");
    }
  }

  // Apply DataTable features to the submenu table
  // Enables pagination, sorting, searching, etc.
  $("#tableSubMenu").DataTable();

}


// Function to reset and initialize the SubMenu form
const refreshSubMenuForm = () => {

  // Initialize the global 'submenu' object used to store form data for submission
  submenu = new Object();

  // Create an empty array to store ingredients linked to the submenu
  submenu.submenuHasIngredientList = new Array();

  // Reset all fields in the form to default
  formSubMenu.reset();

  // Clear the photo file input
  submenuPhotoInput.value = "";

  // Set the image preview to a default food plate image
  submenuPhotoPreview.src = "/images/foodplate.png";

  // Reset all dropdowns and text inputs to their default state using a helper
  setDefault([
    selectSubmenuCategory,
    selectSubmenuSubCategory,
    selectCategorySize,
    textPrice,
    selectStatus,
    textSubMenuName
  ]);

  // Fetch all dropdown data from backend APIs
  let submenucategories = getServiceRequest('submenucategory/alldata');         // For category dropdown
  let submenusubcategories = getServiceRequest('submenusubcategory/alldata');   // For subcategory dropdown
  let submenucategorysizes = getServiceRequest('submenusubcategorytype/alldata'); // For size dropdown
  let submenucategorystatus = getServiceRequest('submenustatus/alldata');       // For status dropdown

  // Fill the category dropdown with fetched data
  fillDataIntoSelect(
    selectSubmenuCategory,           // Target dropdown
    "Please Select Category",        // Placeholder option
    submenucategories,               // Data list
    "name"                           // Property to display
  );

  // Fill the subcategory dropdown
  fillDataIntoSelect(
    selectSubmenuSubCategory,
    "Please Select Sub Category",
    submenusubcategories,
    "name"
  );

  // Fill the size dropdown
  fillDataIntoSelect(
    selectCategorySize,
    "Please Select Size",
    submenucategorysizes,
    "name"
  );

  // Fill the status dropdown
  fillDataIntoSelect(
    selectStatus,
    "Please Select Status",
    submenucategorystatus,
    "name"
  );

  // Hide the update button (only shown when editing)
  buttonUpdate.classList.add("d-none");

  // Show the submit button (for adding a new submenu)
  buttonSubmit.classList.remove("d-none");

  // Reset or refresh the submenu's inner ingredient section
  refreshSubMenuInnerFom();
}


// Define function to check if the selected item already exists in the purchase order list
const checkItemExt = () => {

  // Get the selected item from the dropdown and convert it from JSON string to object
  // Example: '{"id":1,"name":"Sugar"}' becomes {id: 1, name: "Sugar"}
  let selectedItem = JSON.parse(selectItems.value);

  // Check if this item is already in the ingredient list
  // Map existing ingredients to their IDs, and see if the selected ID already exists
  let extIndex = submenu.submenuHasIngredientList
    .map(poitem => poitem.ingredients_id.id) // Get list of existing ingredient IDs
    .indexOf(selectedItem.id);               // Check if selected item's ID is in the list

  // If the item is found (index is not -1), show a warning popup
  if (extIndex > -1) {
    Swal.fire({
      title: "Selected Item Already Exists..!", 
      text: "Please select another item.",      
      icon: "warning",                          
      width: "20em",                          
      showConfirmButton: false,                 
      timer: 2000                             
    });

    // Reset the ingredient input form so user can select a new item
    refreshSubMenuInnerFom();
  }
}



// Function to refresh the inner form of the submenu
const refreshSubMenuInnerFom = () => {

  // Create a new object to temporarily hold the selected ingredient item data
  submenuHasItem = new Object();

  // Fetch all ingredient items from the backend API
  let items = getServiceRequest("/ingredient/alldata");

  // Populate the "Items" dropdown with both item code and item name for clarity
  // Example display: "ING001 - Sugar"
  fillDataIntoSelectTwo(selectItems, "Please Select Items", items, "itemcode", "itemname");

  // Reset the item selection and quantity input to default values
  setDefault([selectItems, textQuantity]);

  // Manage visibility of action buttons
  // Hide the "Update" button (used during editing)
  buttonInnerUpdate.classList.add("d-none");

  // Show the "Submit" button (used when adding a new ingredient)
  buttonInnerSubmit.classList.remove("d-none");

  // Define how each column in the ingredient table should display
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" }, // Show generated name (e.g., code + name)
    { propertyName: "qty", dataType: "decimal" },             // Show quantity with decimal formatting
  ];

  // Fill the ingredient table with the current list of ingredients added to the submenu
  // Also attaches edit and delete handlers to each row
  fillDataIntoInnerTable(
    tableSubMenuItemBody,
    submenu.submenuHasIngredientList,
    propertyList,
    submenuIngredientFormRefill,   // Function to refill form when editing an item
    submenuIngredientDelete,      // Function to remove an item from the list
    true                          // Enable row-level action buttons
  );

  // Enable DataTables features: sorting, pagination, filtering on the ingredient table
  $("#tableSubMenuItem").DataTable();
}

// Define a function to generate item name
const generateItemName = (ob) => {
  return ob.ingredients_id.itemname;
}

// Define a function to refill the inner form when editing an existing item
const submenuIngredientFormRefill = (ob, index) => {

  // Store the index of the item being edited (used later to update the correct row)
  innerFormIndex = index;

  // Deep copy the selected item object to avoid directly modifying the original in the list
  submenuHasItem = JSON.parse(JSON.stringify(ob));     // Will hold the editable copy
  oldsubmenuHasItem = JSON.parse(JSON.stringify(ob));  // Stores original state for comparison or rollback

  // Set the item dropdown to the selected ingredient
  // The value is stored as a JSON string (e.g., {"id":1,"name":"Sugar"})
  selectItems.value = JSON.stringify(submenuHasItem.ingredients_id);

  // Fill the quantity input with the item's quantity for editing
  textQuantity.value = submenuHasItem.qty;

  // Toggle visibility of action buttons
  // Show the "Update" button (for updating an existing entry)
  buttonInnerUpdate.classList.remove("d-none");

  // Hide the "Submit" button (to prevent adding a duplicate while editing)
  buttonInnerSubmit.classList.add("d-none");
}


// Define a function to delete a form item (ingredient from submenu)
const submenuIngredientDelete = (ob, index) => {

  // Show a confirmation popup with selected item details (name and quantity)
  Swal.fire({
    title: "Are you sure to remove the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🥫 <b>Item Name:</b> " + ob.ingredients_id.itemname + "<br>" +
      "🔢 <b>Quantity:</b> " + ob.qty +
      "</div>",
    icon: "warning",                
    showCancelButton: true,       
    width: "20em",                
    confirmButtonColor: "#3085d6", 
    cancelButtonColor: "#d33",     
    confirmButtonText: "Yes, Remove Item" 
  }).then((result) => {

    // If user clicks "Yes, Remove Item"
    if (result.isConfirmed) {

      // Show success message after deletion
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Removed!",
        text: "Item removed successfully from the list.",
        timer: 1500,
        showConfirmButton: false
      });

      // Find the index of the item to be deleted using the ingredient ID
      let extIndex = submenu.submenuHasIngredientList
        .map((orderitem) => orderitem.ingredients_id.id)  // Create array of IDs
        .indexOf(ob.ingredients_id.id);                   // Get index of selected item

      // If item is found in the list, remove it
      if (extIndex !== -1) {
        submenu.submenuHasIngredientList.splice(extIndex, 1); // Remove the item from the list
      }

      // Refresh the inner form and table to reflect the updated list
      refreshSubMenuInnerFom();
    }
  });
}



// Define a function to submit the inner form (add a new ingredient item)
const buttonSubMenuInnerSubmit = () => {
  // Log the current ingredient item object to the console for debugging
  console.log(submenuHasItem);

  // Show a confirmation popup before actually adding the item
  Swal.fire({
    title: "Are you sure to add the following Item?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "🥫 <b>Item Name:</b> " + submenuHasItem.ingredients_id.itemname + "<br>" +
      "🔢 <b>Quantity:</b> " + submenuHasItem.qty +
      "</div>",
    icon: "warning",               
    width: "20em",                 
    showCancelButton: true,       
    confirmButtonColor: "#3085d6", 
    cancelButtonColor: "#d33",    
    confirmButtonText: "Yes, Add Item" 
  }).then((result) => {
    // If user clicks "Yes, Add Item"
    if (result.isConfirmed) {
      // Show success message briefly after adding
      Swal.fire({
        icon: "success",
        width: "20em",
        title: "Item Added Successfully!",
        timer: 1500,
        showConfirmButton: false
      });

      // Add the current ingredient item to the submenu's ingredient list array
      submenu.submenuHasIngredientList.push(submenuHasItem);

      // Refresh the inner form and table to clear inputs and show updated list
      refreshSubMenuInnerFom();
    }
  });
}



// Define a function to update the inner form (edit an existing ingredient item)
const buttonSubMenuInnerUpdate = () => {
  // Log the updated item object to the console for debugging
  console.log(submenuHasItem);

  // Check if quantity or item was changed compared to the original
  if (submenuHasItem.qty != oldsubmenuHasItem.qty) {

    let updates = ""; // String to hold descriptions of what changed

    // Check if the ingredient item itself was changed
    if (submenuHasItem.ingredients_id != oldsubmenuHasItem.ingredients_id)
      updates += "🍽️ Item is changed..! <br>";

    // Check if the quantity was changed
    if (submenuHasItem.qty != oldsubmenuHasItem.qty)
      updates += "🔢 Quantity is changed..! <br>";

    // Show confirmation popup summarizing changes
    Swal.fire({
      title: "Are you sure you want to update the following Item?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🍽️ Item Name: " + submenuHasItem.ingredients_id.itemname + "<br>" +
        "🔢 Quantity: " + submenuHasItem.qty + "<br><br>" +
        updates + // Only show if changes exist
        "</div>",
      icon: "warning",            // Warning icon
      width: "22em",              // Width of popup
      showCancelButton: true,     // Show cancel option
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update Item"
    }).then((result) => {
      // If user confirms the update
      if (result.isConfirmed) {
        // Replace the original item in the list with the updated one using stored index
        submenu.submenuHasIngredientList[innerFormIndex] = submenuHasItem;

        // Show a quick success message
        Swal.fire({
          title: "Item Updated Successfully!",
          icon: "success",
          width: "20em",
          showConfirmButton: false,
          timer: 1500
        });

        // Reset the inner form and refresh the table to reflect changes
        refreshSubMenuInnerFom();
      }
    });

  } else {
    // If no changes detected and update was attempted, show info message
    Swal.fire({
      title: "No Updates",
      text: "Nothing to update..!",
      icon: "info",
      width: "20em",
      showConfirmButton: false,
      timer: 1500
    });
  }
}

// Category has a one-to-many relationship with Subcategory.
// But it does NOT have a direct relationship with Ingredients (no foreign key).
// So, this dropdown is only for UI filtering or selection, not for validation or data integrity.

// Get the category dropdown element by its ID
const selectCategoryElement = document.querySelector("#selectSubmenuCategory");

// When user changes the selected category...
selectCategoryElement.addEventListener("change", () => {
  // Parse the selected option's value, which is a JSON string of the full category object
  let category = JSON.parse(selectCategoryElement.value);

  // Get the category name to use it for other purposes (like assigning to submenu name)
  const categoryName = category.name;

  // Visually mark this dropdown as valid and interacted with:
  // - Remove any previous invalid styling
  // - Add a green border and light green background color
  selectCategoryElement.classList.remove("is-invalid");
  selectCategoryElement.classList.add("is-valid");
  selectCategoryElement.style.border = "2px solid green";
  selectCategoryElement.style.backgroundColor = "#c6f6d5";

  // Automatically set the submenu item name input field with the selected category name
  textSubMenuName.value = categoryName;

  // Fetch all subcategories belonging to this category from backend API
  // The API expects the category ID as a query parameter (?categoryid=)
  // (Backend likely uses @RequestParam("categoryid") to get this)
  let subcategoriesByCategory = getServiceRequest('/submenusubcategory/bycategory?categoryid=' + category.id);

  // Populate the subcategory dropdown with the fetched subcategories
  // Display the "name" property of each subcategory in the dropdown
  fillDataIntoSelect(selectSubmenuSubCategory, "Please Select Sub-Category", subcategoriesByCategory, "name");

  // Reset the subcategory selection in the submenu object to avoid data mismatch
  submenu.submenu_sub_category_id = null;

  // Reset subcategory dropdown border to default (neutral color)
  selectSubmenuSubCategory.style.border = "1px solid #ced4da";
});

// Get the unit size/type dropdown element by its ID
let selectCategorySize = document.querySelector("#selectCategorySize");

// When user changes the selected unit type/size...
selectCategorySize.addEventListener("change", () => {
  // Visually mark this dropdown as valid with green border and background
  selectCategorySize.classList.remove("is-invalid");
  selectCategorySize.classList.add("is-valid");
  selectCategorySize.style.border = "2px solid green";
  selectCategorySize.style.backgroundColor = "#c6f6d5";

  // Parse the selected unit type value (JSON string) into an object
  submenu.submenu_subcategory_type_id = JSON.parse(selectCategorySize.value);

  // Generate and update the submenu item name based on the new selection
  generateSubMenuName();
});

// Dynamically generate the submenu item name from selected dropdowns and inputs
const generateSubMenuName = () => {

  // Check if both required fields (subcategory and size) are selected (not null)
  if (submenu.submenu_sub_category_id != null && submenu.submenu_subcategory_type_id != null) {

    // Parse the selected subcategory and size objects from their dropdown values
    let subcategory = JSON.parse(selectSubmenuSubCategory.value);
    let categorySize = JSON.parse(selectCategorySize.value);

    // Create the item name by combining subcategory name + size name
    // (You can add other parts here like brand, package type if needed)
    textSubMenuName.value =
      subcategory.name + " " +
      categorySize.name;

    // Remove any "None" text from the name and clean extra spaces
    // This prevents showing unnecessary words like "None" in the final name
    textSubMenuName.value = textSubMenuName.value
      .replace(/\bNone\b/gi, "")  // Remove whole word "None" (case-insensitive)
      .replace(/\s+/g, " ")       // Replace multiple spaces with a single space
      .trim();                   // Remove spaces at start/end

    // Assign this generated name back to the submenu object's name property
    submenu.name = textSubMenuName.value;

    // Mark the input as valid visually with green border and background
    textSubMenuName.classList.remove("is-invalid");
    textSubMenuName.classList.add("is-valid");
    textSubMenuName.style.border = "2px solid green";
    textSubMenuName.style.backgroundColor = "#c6f6d5";

  } else {
    // If required fields are missing, clear the name input and reset submenu name property
    textSubMenuName.value = "";
    submenu.name = null;

    // Reset input border to default neutral color
    textSubMenuName.style.border = "1px solid #ced4da";
  }
}


// Define a function to get the appropriate submenu status icon based on its status
const getSubMenuStatus = (dataOb) => {
  // If submenu status is "Available", show green icon (indicates available)
  if (dataOb.submenu_status_id.name == "Available") {
    return (
      "<i class='fa-solid fa-paste fa-lg text-success'></i>" // Green icon
    );
  }

  // If submenu status is "Out of Stock", show yellow icon (indicates warning)
  if (dataOb.submenu_status_id.name == "Out of Stock") {
    return (
      "<i class='fa-solid fa-paste fa-lg text-warning'></i>" // Yellow icon
    );
  }

  // If submenu status is "Discontinued", show red icon (indicates removed/discontinued)
  if (dataOb.submenu_status_id.name == "Discontinued") {
    return (
      "<i class='fa-solid fa-paste fa-lg text-danger'></i>" // Red icon
    );
  }
}


// Function to refill the submenu form with existing data for editing
const subMenuFormRefill = (ob, index) => {
  // Log the object and index for debugging purposes
  console.log("Edit", ob, index);
  // Optionally, you can highlight the table row being edited (commented out)
  // tableEmployeeBody.children[index].style.backgroundColor = "orange";

  // Deep copy the passed submenu object to avoid direct mutation
  submenu = JSON.parse(JSON.stringify(ob));
  oldSubmenu = JSON.parse(JSON.stringify(ob)); // Keep a copy of original data for comparison

  // Set the category dropdown value by stringifying the category object
  selectSubmenuCategory.value = JSON.stringify(ob.submenu_sub_category_id.submenu_category_id);

  // Parse the selected category object from the dropdown (not used further here but could be)
  let category = JSON.parse(selectCategoryElement.value);

  // Set subcategory dropdown to the submenu's current subcategory
  selectSubmenuSubCategory.value = JSON.stringify(ob.submenu_sub_category_id);

  // Set size dropdown to the submenu's current size/type
  selectCategorySize.value = JSON.stringify(ob.submenu_subcategory_type_id);

  // Set price input field with submenu price
  textPrice.value = ob.submenu_price;

  // Set status dropdown to submenu's current status
  selectStatus.value = JSON.stringify(ob.submenu_status_id);

  // Set the submenu name input field
  textSubMenuName.value = ob.name;

  // Handle the submenu photo display
  if (ob.submenu_photo != null) {
    // Decode base64 photo string and set it as image source
    submenuPhotoPreview.src = atob(ob.submenu_photo);
  } else {
    // Use default placeholder image if no photo exists
    submenuPhotoPreview.src = "/images/foodplate.png";
  }

  // Show the Update button (for saving edits)
  buttonUpdate.classList.remove("d-none");

  // Hide the Submit button (used for new entries)
  buttonSubmit.classList.add("d-none");

  // Show the submenu form offcanvas panel
  $("#offcanvasSubMenuForm").offcanvas("show");

  // Refresh the inner ingredient form and table to reflect current data
  refreshSubMenuInnerFom();
}


// Define function to delete a submenu record
const subMenuDelete = (dataOb, index) => {
  // Show a confirmation dialog with submenu details using SweetAlert2
  Swal.fire({
    title: "Are you sure to delete the following Sub Menu?",
    html:
      "<div style='text-align:left; font-size:14px'>" +
      "👤 <b>Name:</b> " + dataOb.name + "<br>" +
      "📛 <b>Price:</b> " + dataOb.submenu_price + "<br>" +
      "🆔 <b>Status :</b> " + dataOb.submenu_status_id.name +
      "</div>",
    icon: "warning",            
    showCancelButton: true,    
    width: "20em",            
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",     
    confirmButtonText: "Yes, Delete Sub Menu" 
  }).then((result) => {
    // If user confirms deletion
    if (result.isConfirmed) {
      // Send a DELETE request to backend API to delete submenu record
      let deleteResponse = getHTTPServiceRequest("/submenu/delete", "DELETE", dataOb);

      // If deletion succeeded
      if (deleteResponse === "OK") {
        // Show a brief success message
        Swal.fire({
          icon: "success",
          width: "20em",
          title: "Deleted!",
          text: "Submenu deleted successfully.",
          timer: 1500,
          showConfirmButton: false
        });

        // Refresh the submenu table and form on page without reload
        refreshSubMenuTable();
        refreshSubMenuForm();

        // Hide the submenu view offcanvas panel (if open)
        $("#offcanvasSubMenuView").offcanvas("hide");
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
const subMenuView = (ob, index) => {
  // Log the submenu object and its index for debugging
  console.log("View", ob, index);

  // Display submenu category name in the appropriate table cell
  tdCateory.innerText = ob.submenu_sub_category_id.submenu_category_id.name;

  // Display submenu subcategory name
  tdSubCategory.innerText = ob.submenu_sub_category_id.name;

  // Display the size/type name of the submenu item
  tdCategorySize.innerText = ob.submenu_subcategory_type_id.name;

  // Display submenu price
  tdPrice.innerText = ob.submenu_price;

  // Display the submenu status (Available, Out of Stock, etc.)
  tdStatus.innerText = ob.submenu_status_id.name;

  // Display the submenu name
  tdName.innerText = ob.name;

  // Define how to display each column of the ingredients table
  // Here, generateItemName is a function to create item display text
  let propertyList = [
    { propertyName: generateItemName, dataType: "function" },
    { propertyName: "qty", dataType: "decimal" },
  ];

  // Fill the inner table with the list of ingredients linked to this submenu
  fillDataIntoInnerTable(
    printTableSubMenuItemBody,         // Table body element where rows will be added
    ob.submenuHasIngredientList,       // Data array of ingredients for this submenu
    propertyList,                      // How to display each column
    submenuIngredientFormRefill,       // Edit function (not used here)
    submenuIngredientDelete,           // Delete function (not used here)
    false                             // Whether to show action buttons (false = no)
  );

  // Show the submenu details panel (offcanvas) using jQuery
  $("#offcanvasSubMenuView").offcanvas("show");
}


// Function to handle printing the submenu view table
const buttonPrintRow = () => {

  // Get the full HTML of the submenu view table (including the table tag and contents)
  const outerTableHTML = tableSubMenuView.outerHTML;

  // Open a new browser window/tab for the print preview
  let newWindow = window.open();

  // Create the full HTML content for the print window including styles and the table
  let printView = `<html>
      <head>
        <title>Print Sub Menu</title>
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
          ${outerTableHTML}  <!-- Insert the submenu table HTML here -->
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
   * `${tableEmployeeView.outerHTML}` uses template literals to embed the full HTML 
   * of a DOM element into a string.
   * - `outerHTML` gets the element plus all its children as HTML.
   * - Useful to create a printable version of a part of your page dynamically.
   */
}


// Function to check for form input errors and return error messages with icons
const checkFormError = () => {
  // Initialize a string to collect all error messages
  let formInputErrors = "";

  // Check if the category dropdown is empty (no selection)
  if (selectSubmenuCategory.value === "") {
    formInputErrors += "❗📂 Please Select Category...! \n";
  }

  // Check if the submenu's subcategory is not selected (null)
  if (submenu.submenu_sub_category_id == null) {
    formInputErrors += "❗📁 Please Select Subcategory...! \n";
  }

  // Check if the submenu size/type is not selected (null)
  if (submenu.submenu_subcategory_type_id == null) {
    formInputErrors += "❗📏 Please Select Category Size...! \n";
  }

  // Check if the price field is empty or null
  if (submenu.submenu_price == null) {
    formInputErrors += "❗💲 Please Enter Price...! \n";
  }

  // Check if no ingredients/items have been added to the submenu's ingredient list
  if (submenu.submenuHasIngredientList.length === 0) {
    formInputErrors += "❗📦 Please Select Order Item(s)...! \n";
  }

  // Return all accumulated error messages (empty string if no errors)
  return formInputErrors;
}



// Function to handle submission of the submenu form
const buttonSubMenuSubmit = () => {
  // Log the current submenu object for debugging
  console.log(submenu);

  // Step 1: Validate the form and get any errors
  let errors = checkFormError();

  // If there are no validation errors
  if (errors === "") {
    // Show a confirmation dialog with details of the submenu to be added
    Swal.fire({
      title: "Are you sure to add the following Sub Menu?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🥫 <b>Name:</b> " + submenu.name + "<br>" +
        "📂 <b>Category:</b> " + submenu.submenu_sub_category_id.submenu_category_id.name + "<br>" +
        "📁 <b>Subcategory:</b> " + submenu.submenu_sub_category_id.name + "<br>" +
        "📦 <b>Category Size:</b> " + submenu.submenu_subcategory_type_id.name + "<br>" +
        "💰 <b>Price:</b> " + submenu.submenu_price + "<br>" +
        "📶 <b>Status:</b> " + submenu.submenu_status_id.name +
        "</div>",
      icon: "warning",               
      width: "20em",                 
      showCancelButton: true,        
      confirmButtonColor: "#3085d6",  
      cancelButtonColor: "#d33",      
      confirmButtonText: "Yes, Add Sub Menu" 
    }).then((result) => {
      // If user confirms adding the submenu
      if (result.isConfirmed) {
        // Send POST request to backend to insert the submenu record
        let postResponse = getHTTPServiceRequest("/submenu/insert", "POST", submenu);

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

          // Refresh the submenu table and form to show updated data
          refreshSubMenuTable();
          refreshSubMenuForm();

          // Hide the submenu form offcanvas panel
          $("#offcanvasSubMenuForm").offcanvas("hide");
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



// Function to check what fields have been updated between the current and old submenu objects
const checkFormUpdate = () => {
  // Initialize a string to collect messages about changes
  let updates = "";

  // Check that both submenu objects exist before comparing
  if (submenu != null && oldSubmenu != null) {

    // Compare the submenu name
    if (submenu.name != oldSubmenu.name) {
      updates += "🍽️ Name is changed..! \n";
    }

    // Compare the submenu's category name (nested inside sub_category)
    if (submenu.submenu_sub_category_id.submenu_category_id.name != oldSubmenu.submenu_sub_category_id.submenu_category_id.name) {
      updates += "📂 Category is changed..! \n";
    }

    // Compare the submenu's subcategory name
    if (submenu.submenu_sub_category_id.name != oldSubmenu.submenu_sub_category_id.name) {
      updates += "🗂️ Sub Category is changed..! \n";
    }

    // Compare the submenu's size/package type name
    if (submenu.submenu_subcategory_type_id.name != oldSubmenu.submenu_subcategory_type_id.name) {
      updates += "📦 Package Type is changed..! \n";
    }

    // Compare the submenu price
    if (submenu.submenu_price != oldSubmenu.submenu_price) {
      updates += "💲 Price is changed..! \n";
    }

    // Compare the submenu status name
    if (submenu.submenu_status_id.name != oldSubmenu.submenu_status_id.name) {
      updates += "⚙️ Status is changed..! \n";
    }

    // Compare the submenu photo (likely a base64 string)
    if (submenu.submenu_photo != oldSubmenu.submenu_photo) {
      updates += "📷 Photo is changed..! \n";
    }

  }

  // Check if the number of items in the new purchase order is different from the old one
  if (submenu.submenuHasIngredientList.length != oldSubmenu.submenuHasIngredientList.length) {

    // Log that the list of purchase order items has changed
    updates += "📄 Sub Menu Item is changed..! \n";

  } else {

    // Counter to track how many items are the same between old and new orders
    let equalCount = 0;

    // Loop through each item in the old purchase order
    for (const oldpoitem of oldSubmenu.submenuHasIngredientList) {

      // Compare with each item in the new purchase order
      for (const newpoitem of submenu.submenuHasIngredientList) {

        // If the ingredient IDs match, increment the counter
        if (oldpoitem.ingredients_id.id == newpoitem.ingredients_id.id) {
          equalCount = equalCount + 1;
        }
      }
    }

    // If the count of matching items is not equal to the number of new items,
    // it means the items themselves have changed
    if (equalCount != submenu.submenuHasIngredientList.length) {
      updates += "📄 Sub Menu Item is changed..! \n";
    } else {

      // If the items are the same, check if their quantities have changed
      for (const oldpoitem of oldSubmenu.submenuHasIngredientList) {
        for (const newpoitem of submenu.submenuHasIngredientList) {

          // If the ingredient IDs match but the quantity is different
          if (oldpoitem.ingredients_id.id == newpoitem.ingredients_id.id &&
            oldpoitem.qty != newpoitem.qty) {

            // Log that the quantity has been changed
            updates += "🔢 Sub Menu Item Qty is changed..! \n";
            break; // No need to check more once a change is found
          }
        }
      }
    }
  }

  // Return all collected update messages (empty string if no changes)
  return updates;
}

// Function to handle updating the submenu form data
const buttonSubMenuUpdate = () => {
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
          // Send PUT request to update the submenu record on the backend
          let putResponse = getHTTPServiceRequest("/submenu/update", "PUT", submenu);

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

            // Refresh the submenu table to show updated data
            refreshSubMenuTable();

            // Reset and refresh the submenu form to default state
            refreshSubMenuForm();

            // Close the form offcanvas panel
            $("#offcanvasSubMenuForm").offcanvas("hide");
          } else {
            // If update failed, show error message with response details
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

// Define a function to clear submenu photo
function clearSubMenuPhoto() {
  // Get the photo file input element by ID
  const photoInput = document.getElementById("submenuPhotoInput");
  if (photoInput) {
    // Clear the selected file so the input is reset
    photoInput.value = "";
  }

  // Get the photo preview image element by ID
  const previewImage = document.getElementById("submenuPhotoPreview");
  if (previewImage) {
    // Reset the preview image to the default placeholder image
    previewImage.src = "/images/foodplate.png"; // Update path if needed
  }

  // If the submenu object exists (used for data binding), clear its photo data
  if (typeof submenu !== "undefined") {
    submenu.submenu_photo = null;
  }
}



// Function to clear the employee form after confirming with the user
const clearSubMenuForm = () => {
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
      refreshSubMenuForm();
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
const clearSubMenuInnerForm = () => {
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
      refreshSubMenuInnerFom();
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
