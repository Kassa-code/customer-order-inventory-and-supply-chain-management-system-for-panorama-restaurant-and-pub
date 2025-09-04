// Create browser load event
// This ensures the following logic runs only after the entire page (DOM + all external resources) is fully loaded
window.addEventListener("load", () => {
    // Refresh and initialize the ingredient form when the page loads
    // Typically clears previous inputs and loads necessary dropdowns or defaults
    refreshIngredientForm();

    // Populate the table with the latest ingredient data on initial page load
    refreshIngredientTable();

});

// Create refresh table area function
// Call refreshIngredientTable() in browser, submit, update, and delete functions
const refreshIngredientTable = () => {
    //=============================================================================================================

    // Fetch ingredient data using a common GET request function (returns array of ingredients)
    let ingredients = getServiceRequest('/ingredient/alldata');

    // Create an array of column definitions for the table
    // Each column is represented by an object with a property name and data type
    // Create colums array and objects for each column
    // string ===> string / date / number
    // function ===> object / array / boolean
    // decimal  → numeric values that should be formatted to 2 decimal places
    let propertyList = [
        { propertyName: "itemcode", dataType: "string" }, // Ingredient code
        { propertyName: "itemname", dataType: "string" }, // Ingredient name
        { propertyName: "rop", dataType: "string" }, // Re-order point
        { propertyName: "roq", dataType: "string" }, // Re-order quantity
        { propertyName: "purchasesprice", dataType: "decimal" }, // Purchase price (formatted)
        { propertyName: "salesprice", dataType: "decimal" }, // Sales price (formatted)
        { propertyName: getIngredientStatus, dataType: "function" } // Status icon (computed using function)
    ];


    // Populate the HTML table with ingredient data
    // Pass in:
    // - table body element ID
    // - list of ingredients
    // - property list for table columns
    // - callback functions for refill, delete, and view actions
    fillDataIntoTable(tableItemBody, ingredients, propertyList, ingredientFormRefill, ingredientDelete, ingredientView);

    // Initialize DataTables plugin on the table with ID "tableItem"
    $("#tableItem").DataTable();

    //===========================================================================================================
}

// Function to reset the ingredient form and reload all dropdown data
const refreshIngredientForm = () => {

    // Reset all form inputs to their default state (clears text fields, resets selects)
    formIngredient.reset();

    // Create a new empty object to hold ingredient data before submission
    ingredient = new Object();
    ingredient.profitratio = 0; // Set always 0 to the profit rate
    ingredient.salesprice = 0; // Set always 0 to the salesprice price
    ingredient.discountratio = 0; // Set always 0 to the discount rate

    // Fetch latest data from the server to update dropdown options
    let brands = getServiceRequest('/brand/alldata'); // Fetch brands
    let categories = getServiceRequest('/ingredientcategory/alldata'); // Fetch categories
    let subcategories = getServiceRequest('/ingredientsubcategory/alldata'); // Fetch subcategories
    let unittypes = getServiceRequest('/unittype/alldata'); // Fetch unit types
    let packagetypes = getServiceRequest('/packagetype/alldata'); // Fetch package types
    let ingredientstatuses = getServiceRequest('/ingredientstatus/alldata'); // Fetch ingredient statuses

    // Populate each select element with fetched data and show a user-friendly default option
    fillDataIntoSelect(selectItemBrand, "Please Select Brand", brands, "name");
    fillDataIntoSelect(selectItemCategory, "Please Select Category", categories, "name");
    fillDataIntoSelect(selectItemSubCategory, "Please Select Sub-Category", subcategories, "name");
    fillDataIntoSelect(selectItemUnitType, "Please Select Unit-Type", unittypes, "name");
    fillDataIntoSelect(selectItemPackageType, "Please Select Package-Type", packagetypes, "name");
    fillDataIntoSelect(selectItemStatus, "Please Select Ingredient Status", ingredientstatuses, "name");

    // Manually reset UI elements that aren't fully reset by form.reset()
    // This includes custom fields, preview images, and file inputs
    setDefault([
        selectItemCategory,
        selectItemBrand,
        selectItemSubCategory,
        selectItemPackageType,
        textItemSize,
        selectItemUnitType,
        selectItemStatus,
        textItemName,
        textRop,
        textRoq,
        textPurchasePrice,
        textProfitRatio,
        textSalesPrice,
        textDiscountRatio,
        textNote
    ]);

    // Set the default value for ingredient status
    // Value of select element comes as string format so we need to parse into object format
    selectItemStatus.value = JSON.stringify(ingredientstatuses[0]); // Set the value for the status select
    ingredient.status_id = JSON.parse(selectItemStatus.value); // Assign the parsed object to the ingredient
    // Set the element color to green
    selectItemStatus.classList.remove("is-invalid");
    selectItemStatus.classList.add("is-valid");
    selectItemStatus.style.border = "2px solid green";
    selectItemStatus.style.backgroundColor = "#c6f6d5";

    // Hide the Update button by adding the "d-none" class (d-none = display: none)
    buttonUpdate.classList.add("d-none");

    // Show the Submit button by removing the "d-none" class
    buttonSubmit.classList.remove("d-none");
}

// Category has a one-to-many relationship with Subcategory.
// However, it has NO direct relationship (like a foreign key) with the Ingredients table.
// Because of that, there's no need for binding logic or custom validators like dynamicElementValidator().
// This dropdown is used only for UI-based filtering or selection, not for enforcing data integrity or required fields.

// Get the category dropdown element by its ID
const selectCategoryElement = document.querySelector("#selectItemCategory");
// Add a change event listener to trigger logic when a different category is selected
selectCategoryElement.addEventListener("change", () => {
    // Parse the selected <option>'s value (assumed to be a JSON string representing the full category object)
    let category = JSON.parse(selectCategoryElement.value);

    // Extract the category name for later use
    const categoryName = category.name;

    // Apply a green border to visually indicate the field has been interacted with
    selectCategoryElement.classList.remove("is-invalid");
    selectCategoryElement.classList.add("is-valid");
    selectCategoryElement.style.border = "2px solid green";
    selectCategoryElement.style.backgroundColor = "#c6f6d5";

    // Define a list of category names that require hiding some form fields
  const hiddenCategories = ["Rice", "Meat", "Sea Food", "Vegitables", "Fruits", "Paratta", "Dry Ingredients","Frozen Ingredient"];

    // IDs of form input wrapper divs that should be conditionally shown or hidden
    const fieldGroups = ["textProfitRatioGroup", "textSalesPriceGroup", "textDiscountRatioGroup"
    ];

    // Show or hide each group based on whether the selected category is in the hidden list
    fieldGroups.forEach(groupId => {
        const group = document.getElementById(groupId);
        if (group) {
            if (hiddenCategories.includes(categoryName)) {
                group.classList.add("d-none"); // Hide this input group
            } else {
                group.classList.remove("d-none"); // Show this input group
            }
        }
    });

    // Assign the selected category name to the item name input field
    textItemName.value = categoryName;

    // Fill subcategories for the selected category by calling the API with the category ID as a query parameter (?categoryid=)
    // This calls an endpoint that likely uses @RequestParam("categoryid") on the backend to read this value
    let subcategoriesByCategory = getServiceRequest('ingredientsubcategory/bycategory?categoryid=' + category.id);

    // Populate the subcategory dropdown with the fetched data, showing each item's "name"
    fillDataIntoSelect(selectItemSubCategory, "Please Select Sub-Category", subcategoriesByCategory, "name");

    // Set the ingredient's subcategory to null temporarily to avoid conflicts while binding
    ingredient.ingredient_subcategory_id = null;
    selectItemSubCategory.style.border = "1px solid #ced4da"; // set to the initial color

    // Fill brands for the selected category by calling the API with the category ID as a path variable (/brand/bycategory/{id})
    // This calls an endpoint that uses @PathVariable("categoryid") on the backend to read the value from the URL path
    let brandsByCategory = getServiceRequest('/brand/bycategory/' + category.id);

    // Populate the brand dropdown with the fetched data, showing each item's "name"
    fillDataIntoSelect(selectItemBrand, "Please Select Brands", brandsByCategory, "name");

      // Set the ingredient's brand to null temporarily to avoid conflicts while binding
      ingredient.brand_id = null;
      selectItemBrand.style.border = "1px solid #ced4da"; // set to the initial color

})


// Get the unit type dropdown element by its ID
let selectUnitTypeElement = document.querySelector("#selectItemUnitType");

// Add a listener to detect when the selected unit type changes
selectUnitTypeElement.addEventListener("change", () => {
    // Highlight the border to indicate valid selection
    selectUnitTypeElement.classList.remove("is-invalid");
    selectUnitTypeElement.classList.add("is-valid");
    selectUnitTypeElement.style.border = "2px solid green";
    selectUnitTypeElement.style.backgroundColor = "#c6f6d5";

    // Parse the selected unit type (as an object) and assign it to the ingredient object
    ingredient.unittype_id = JSON.parse(selectUnitTypeElement.value);

    // Call the function to generate the item name based on selected values
    generateItemName();
});

// Function → [generateItemName()]
// Dynamically generate the item name from selected and input values
const generateItemName = () => {

    // Check if all required values are selected or entered
    if (ingredient.brand_id != null && ingredient.ingredient_subcategory_id != null && ingredient.package_type_id != null && ingredient.unittype_id != null && ingredient.unitsize != null) {
        
        // Parse selected objects from dropdowns (values are JSON strings)
        let brand = JSON.parse(selectItemBrand.value);
        let subcategory = JSON.parse(selectItemSubCategory.value);
        let packagetype = JSON.parse(selectItemPackageType.value);
        let unittype = JSON.parse(selectItemUnitType.value);

        // Get unit size from input field
        let unitsize = textItemSize.value;

        // Generate item name format → Brand Subcategory Size UnitType PackageType
        textItemName.value =
            brand.name + " " +
            subcategory.name + " " +
            unitsize + " " +
            unittype.name + " " +
            packagetype.name;

      // Remove "None" and "0", and clean up extra spaces
      textItemName.value = textItemName.value.replace(/\b(?:None|0)\b/gi, "").replace(/\s+/g, " ").trim();


        // Assign generated name to ingredient object
        ingredient.itemname = textItemName.value;

        // Set input border to green (valid)
        textItemName.classList.remove("is-invalid");
        textItemName.classList.add("is-valid");
        textItemName.style.border = "2px solid green";
        textItemName.style.backgroundColor = "#c6f6d5";
    } else {
         // Clear name if any required field is missing
         textItemName.value = "";
         ingredient.itemname = null;
 
         // Reset input border to default
         textItemName.style.border = "1px solid #ced4da";

    }
}



// Define a function to get the appropriate ingredient status icon based on its status
const getIngredientStatus = (dataOb) => {
    // Check if the ingredient status is "Available"
    if (dataOb.status_id.name == "Available") {
        return (
            // Green stacked cubes icon for available status
            "<i class='fa-solid fa-cubes-stacked fa-lg text-success'></i>"
        );
    }

    // Check if the ingredient status is "Not-Available"
    if (dataOb.status_id.name == "Not-Available") {
        return (
            // Yellow stacked cubes icon for not-available status
            "<i class='fa-solid fa-cubes-stacked fa-lg text-warning'></i>"
        );
    }

    // Check if the ingredient status is "Removed"
    if (dataOb.status_id.name == "Removed") {
        return (
            // Red stacked cubes icon for removed status
            "<i class='fa-solid fa-cubes-stacked fa-lg text-danger'></i>"
        );
    }
}

// Define function to generate sales price based on purchase price and profit ratio
const generateSalesPrice = () => {
    // Get profit ratio input value
    let profitRatio = textProfitRatio.value;

    // Get purchase price input value
    let puchasePrice = textPurchasePrice.value;

    // Calculate sales price using formula: purchase price + (purchase price * profit ratio / 100)
    let salesPrice = parseFloat(puchasePrice) + (parseFloat(puchasePrice) * parseFloat(profitRatio) / 100);

    // Set calculated sales price in the sales price input field, formatted to 2 decimal places
    textSalesPrice.value = parseFloat(salesPrice).toFixed(2);

    // Assign sales price to ingredient object
    ingredient.salesprice = textSalesPrice.value;

    // Visually indicate success by changing border color to green
    textSalesPrice.classList.remove("is-invalid");
    textSalesPrice.classList.add("is-valid");
    textSalesPrice.style.border = "2px solid green";
    textSalesPrice.style.backgroundColor = "#c6f6d5";
}

// Function to refill the ingredient form with existing ingredient data when editing
const ingredientFormRefill = (ob) => {

    // Log the object that is being edited to the console (for debugging purposes)
    console.log("Edit", ob);

    // Create deep copies of the object:
    // - 'ingredient' will hold the current editable version
    // - 'oldIngredient' keeps a copy of the original (in case we need to compare or reset)
    ingredient = JSON.parse(JSON.stringify(ob));
    oldIngredient = JSON.parse(JSON.stringify(ob));

    // Set the category dropdown based on the ingredient's subcategory's parent category
    selectItemCategory.value = JSON.stringify(ob.ingredient_subcategory_id.ingredient_category_id);

    // Parse the selected category object from the dropdown value
    let category = JSON.parse(selectCategoryElement.value);

    // Fetch subcategories based on the selected category
    let subcategoriesByCategory = getServiceRequest('ingredientsubcategory/bycategory?categoryid=' + category.id);

    // Fill the subcategory dropdown with the fetched subcategories
    fillDataIntoSelect(selectItemSubCategory, "Please Select Sub-Category", subcategoriesByCategory, "name");

    
    // Fetch brands based on the selected category
    let brandsByCategory = getServiceRequest('/brand/bycategory/' + category.id);

    // Fill the brand dropdown with the fetched brands
    fillDataIntoSelect(selectItemBrand, "Please Select Brands", brandsByCategory, "name");

    // Set the brand dropdown value based on the ingredient's brand
    selectItemBrand.value = JSON.stringify(ob.brand_id);

    // Set the subcategory dropdown value based on the ingredient's subcategory
    selectItemSubCategory.value = JSON.stringify(ob.ingredient_subcategory_id);

    // Set the package type dropdown value
    selectItemPackageType.value = JSON.stringify(ob.package_type_id);

    // Set the item size input field
    textItemSize.value = ob.unitsize;

    // Set the unit type dropdown value
    selectItemUnitType.value = JSON.stringify(ob.unit_type_id);

    // Set the status dropdown value
    selectItemStatus.value = JSON.stringify(ob.status_id);

    // Set the item name input field
    textItemName.value = ob.itemname;

    // Set the reorder point (ROP) input field
    textRop.value = ob.rop;

    // Set the reorder quantity (ROQ) input field
    textRoq.value = ob.roq;

    // Set the purchase price input field
    textPurchasePrice.value = ob.purchasesprice;

    // Set the profit ratio input field
    textProfitRatio.value = ob.profitratio;

    // Set the sales price input field
    textSalesPrice.value = ob.salesprice;

    // Set the discount ratio input field
    textDiscountRatio.value = ob.discountratio;

    // Set the note field, or leave it blank if null/undefined
    if (ob.note === undefined || ob.note === null) {
        textNote.value = "";
    } else {
        textNote.value = ob.note;
    }

    // Show the Update button
    buttonUpdate.classList.remove("d-none");

    // Hide the Submit button
    buttonSubmit.classList.add("d-none");

    // Show the form in the offcanvas (side panel) for editing
    $("#offcanvasItemForm").offcanvas("show");
}

// Define function to delete an ingredient record
// Define function to delete an ingredient entry
const ingredientDelete = (dataOb, index) => {
    // Show confirmation dialog using SweetAlert2 with ingredient details
    Swal.fire({
      title: "Are you sure to delete the following Item?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🥫 <b>Item Name:</b> " + dataOb.itemname + "<br>" +
        "🔁 <b>Reorder Point:</b> " + dataOb.rop + "<br>" +
        "📦 <b>Reorder Quantity:</b> " + dataOb.roq + "<br>" +
        "💲 <b>Purchase Price:</b> " + dataOb.purchasesprice +
        "</div>",
  
      icon: "warning",
      showCancelButton: true,
      width: "20em",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete Item"
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the DELETE HTTP service
        let deleteResponse = getHTTPServiceRequest("/ingredient/delete", "DELETE", dataOb);
  
        if (deleteResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Deleted!",
            text: "Item deleted successfully.",
            timer: 1500,
            showConfirmButton: false
          });
  
          // Refresh table and form
          refreshIngredientTable();
          refreshIngredientForm();
  
          // Hide the ingredient offcanvas view
          $("#offcanvasIngredientView").offcanvas("hide");
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
  
  


// Define function for viewing/printing ingredient record
const ingredientView = (ob, index) => {
    // Log the ingredient object and index to the console (for debugging)
    console.log("View", ob, index);

    // Get table cell references from the HTML to display values
    let tdTextItemName = document.getElementById("tdTextItemName");
    let tdItemCategory = document.getElementById("tdItemCategory");
    let tdItemBrand = document.getElementById("tdItemBrand");
    let tdItemSubCategory = document.getElementById("tdItemSubCategory");
    let tdItemPackageType = document.getElementById("tdItemPackageType");
    let tdItemStatus = document.getElementById("tdItemStatus");
    let tdItemRop = document.getElementById("tdItemRop");
    let tdItemRoq = document.getElementById("tdItemRoq");
    let tdItemPurchasePrice = document.getElementById("tdItemPurchasePrice");

    // Assign values from the ingredient object to the HTML table cells
    tdTextItemName.innerText = ob.itemname; // Set item name
    tdItemCategory.innerText = ob.ingredient_subcategory_id.ingredient_category_id.name; // Set item category
    tdItemBrand.innerText = ob.brand_id.name; // Set brand name
    tdItemSubCategory.innerText = ob.ingredient_subcategory_id.name; // Set sub-category name
    tdItemPackageType.innerText = ob.package_type_id.name; // Set package type
    tdItemStatus.innerText = ob.status_id.name; // Set status
    tdItemRop.innerText = ob.rop; // Set re-order point
    tdItemRoq.innerText = ob.roq; // Set re-order quantity
    tdItemPurchasePrice.innerText = ob.purchasesprice; // Set purchase price


    // Open the ingredient view panel (offcanvas) using Bootstrap
    $("#offcanvasIngredientView").offcanvas("show");
}



// Function to handle print button click
const buttonPrintRow = () => {
    // Open a new browser window
    let newWindow = window.open();

    // Create the HTML structure for the print view
    let printView = `<html>
      <head>
        <title>Print Employee</title>
        <link rel="stylesheet" href="../../Resources/bootstrap-5.2.3/css/bootstrap.min.css">
        <style>
          body {
            font-family: Arial, sans-serif;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color:#efeeff;
            margin: 0;
          }
          .content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
          }
          .table th, .table td {
            padding: 6px 10px;
          }
          .table th {
            text-align: left;
            font-weight: bold;
          }
          h2 {
            text-align: center;
            margin-bottom: 15px;
          }
      </style>
      </head>
      <body>
        <div class="content">
          ${tableIngredientView.outerHTML}
        </div>
      </body>
    </html>`;

    // Write the HTML content to the new window
    newWindow.document.write(printView);

    // Wait for 1.5 seconds to allow the content to load before printing
    setTimeout(() => {
        newWindow.stop(); // Stop loading any further content
        newWindow.print(); // Open the print dialog
        newWindow.close(); // Close the print window after printing
    }, 1500);

    // `${tableIngredientView.outerHTML}` explanation:
    // - This adds the complete HTML of the table to the print view
    // - outerHTML includes the element's full tag and content
    // - Useful for copying, printing, or showing the table in another window
}

// Function to check for errors in the form
const checkFormError = () => {
    let formInputErrors = "";
  
    if (selectItemCategory.value === "") {
      formInputErrors += "❗📂 Please Select Category...! \n";
    }
    if (ingredient.brand_id == null) {
      formInputErrors += "❗🏷️ Please Select Brand...! \n";
    }
    if (ingredient.ingredient_subcategory_id == null) {
      formInputErrors += "❗📁 Please Select Subcategory...! \n";
    }
    if (ingredient.package_type_id == null) {
      formInputErrors += "❗📦 Please Select Package Type...! \n";
    }
    if (ingredient.unitsize == null) {
      formInputErrors += "❗📏 Please Enter Unit Size...! \n";
    }
    if (ingredient.unit_type_id == null) {
      formInputErrors += "❗⚖️ Please Select Unit Type...! \n";
    }
    if (ingredient.rop == null) {
      formInputErrors += "❗🔁 Please Enter Reorder Point...! \n";
    }
    if (ingredient.roq == null) {
      formInputErrors += "❗📦 Please Enter Reorder Quantity...! \n";
    }
    if (ingredient.purchasesprice == null) {
      formInputErrors += "❗💲 Please Enter Purchase Price...! \n";
    }
  
    return formInputErrors;
  }
  

// Function to handle form submission
const buttonIngredientSubmit = () => {
    console.log(ingredient); // Debug log
  
    let errors = checkFormError(); // Validate form
  
    if (errors === "") {
      // Confirm submission with SweetAlert2
      Swal.fire({
        title: "Are you sure to add the following Item?",
        html:
          "<div style='text-align:left; font-size:14px'>" +
          "🥫 <b>Item Name:</b> " + ingredient.itemname + "<br>" +
          "🏷️ <b>Brand:</b> " + ingredient.brand_id.name + "<br>" +
          "📂 <b>Category:</b> " + ingredient.ingredient_subcategory_id.ingredient_category_id.name + "<br>" +
          "📁 <b>Subcategory:</b> " + ingredient.ingredient_subcategory_id.name + "<br>" +
          "📦 <b>Package Type:</b> " + ingredient.package_type_id.name + "<br>" +
          "📶 <b>Status:</b> " + ingredient.status_id.name + "<br>" +
          "🔁 <b>Re-Order Point:</b> " + ingredient.rop + "<br>" +
          "🔢 <b>Re-Order Quantity:</b> " + ingredient.roq + "<br>" +
          "💰 <b>Purchase Price:</b> " + ingredient.purchasesprice +
          "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Item"
      }).then((result) => {
        if (result.isConfirmed) {
          let postResponse = getHTTPServiceRequest("/ingredient/insert", "POST", ingredient);
  
          if (postResponse === "OK") {
            Swal.fire({
              icon: "success",
              width: "20em",
              title: "Saved successfully!",
              timer: 1500,
              showConfirmButton: false
            });
  
            refreshIngredientTable();
            refreshIngredientForm();
            $("#offcanvasItemForm").offcanvas("hide");
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
      Swal.fire({
        icon: "warning",
        width: "20em",
        title: "Form has the following errors",
        html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
        confirmButtonColor: "#3085d6"
      });
    }
  };
  
// Function to check updates in the ingredient form by comparing current and old values
const checkIngredientFormUpdate = () => {
  let updates = "";

  if (ingredient != null && oldIngredient != null) {

      if (ingredient.itemname !== oldIngredient.itemname) {
          updates += "🍽️ Item Name is changed..! \n";
      }

      if (ingredient.brand_id.name !== oldIngredient.brand_id.name) {
          updates += "🏷️ Brand is changed..! \n";
      }

      if (ingredient.ingredient_subcategory_id.ingredient_category_id.name !== oldIngredient.ingredient_subcategory_id.ingredient_category_id.name) {
          updates += "📂 Category is changed..! \n";
      }

      if (ingredient.ingredient_subcategory_id.name !== oldIngredient.ingredient_subcategory_id.name) {
          updates += "🗂️ Sub Category is changed..! \n";
      }

      if (ingredient.package_type_id.name !== oldIngredient.package_type_id.name) {
          updates += "📦 Package Type is changed..! \n";
      }

      if (ingredient.unitsize !== oldIngredient.unitsize) {
          updates += "📏 Unit Size is changed..! \n";
      }

      if (ingredient.unit_type_id.name !== oldIngredient.unit_type_id.name) {
          updates += "📐 Unit Type is changed..! \n";
      }

      if (ingredient.status_id.name !== oldIngredient.status_id.name) {
          updates += "⚙️ Status is changed..! \n";
      }

      if (ingredient.rop !== oldIngredient.rop) {
          updates += "🔔 Reorder Point (ROP) is changed..! \n";
      }

      if (ingredient.roq !== oldIngredient.roq) {
          updates += "🔄 Reorder Quantity (ROQ) is changed..! \n";
      }

      if (ingredient.purchasesprice !== oldIngredient.purchasesprice) {
          updates += "💲 Purchase Price is changed..! \n";
      }

      if (ingredient.salesprice !== oldIngredient.salesprice) {
          updates += "🛒 Sales Price is changed..! \n";
      }

      if (ingredient.profitratio !== oldIngredient.profitratio) {
          updates += "📈 Profit Ratio is changed..! \n";
      }

      if (ingredient.discountratio !== oldIngredient.discountratio) {
          updates += "📉 Discount Ratio is changed..! \n";
      }

      if (ingredient.note !== oldIngredient.note) {
          updates += "📝 Note is changed..! \n";
      }
  }

  return updates;
}


// Create form update event function
const buttonIngredientUpdate = () => {
  let errors = checkFormError(); // Validate form

  if (errors == "") {
      let updates = checkIngredientFormUpdate(); // Check for data changes

      if (updates == "") {
          // No updates to make
          Swal.fire({
              title: "No Updates",
              text: "Nothing to update..!",
              icon: "info",
              width: "20em",
              showConfirmButton: false,
              timer: 1500
          });
      } else {
          // Confirm update
          Swal.fire({
              title: "Are you sure you want to update the following changes?",
              html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
              icon: "warning",
              width: "20em",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, Update Item"
          }).then((result) => {
              if (result.isConfirmed) {
                  let putResponse = getHTTPServiceRequest("/ingredient/update", "PUT", ingredient);

                  if (putResponse == "OK") {
                      Swal.fire({
                          title: "Updated Successfully!",
                          icon: "success",
                          width: "20em",
                          showConfirmButton: false,
                          timer: 1500
                      });

                      refreshIngredientTable();
                      refreshIngredientForm();
                      $("#offcanvasItemForm").offcanvas("hide");
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
      // Show validation errors
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


// Function to clear the user form by confirming the user's intent
const clearIngredientForm = () => {
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
      refreshIngredientForm();
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

//=======================Ingredient Category Form Start===============================================

 // Reinitialize the category object used for form data binding
 ingredientcategory = new Object(); 
 
// Function to reset the ingredient category form and clear related fields
const refreshIngredientCategoryForm = () => {

  // Reset all form controls to their default state
  formCategory.reset();
  
  // Reset specific UI components like input fields, previews, etc.
  setDefault([textCategoryName]);
}

// Function to validate the form before submission
const checkFormErrorOne = () => {
  let formInputErrors = "";

  // Check if 'name' field is null or empty
  if (ingredientcategory.name == null) {
      formInputErrors += "❗📂 Please Enter Category...! \n";
  }

  return formInputErrors;
}

// Function triggered when the category form submit button is clicked
const buttonCategorySubmit = () => {

  console.log(ingredientcategory);
  
  let errors = checkFormErrorOne(); // Run form validation

  if (errors === "") {
      // Prompt user confirmation using SweetAlert2
      Swal.fire({
          title: "Are you sure to add the following Category?",
          html:
              "<div style='text-align:left; font-size:14px'>" +
              "📂 <b>Category:</b> " + ingredientcategory.name + "<br>" +
              "</div>",
          icon: "warning",
          width: "20em",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Add Category"
      }).then((result) => {
          // If user confirms submission
          if (result.isConfirmed) {
              // Send POST request to server to insert new category
              let postResponse = getHTTPServiceRequest("/ingredientcategory/insert", "POST", ingredientcategory);

              // Show success or error notification based on server response
              if (postResponse === "OK") {
                  Swal.fire({
                      icon: "success",
                      width: "20em",
                      title: "Saved successfully!",
                      timer: 1500,
                      showConfirmButton: false
                  });

                  // Reset form and hide the offcanvas form
                  refreshIngredientCategoryForm();
                  let categories = getServiceRequest('/ingredientcategory/alldata');
                  fillDataIntoSelect(selectItemCategory, "Please Select Category", categories, "name");
                  $("#offcanvasCategoryForm").offcanvas("hide");
              } else {
                  // Show error alert with server response
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
      // Show validation error messages using SweetAlert
      Swal.fire({
          icon: "warning",
          width: "20em",
          title: "Form has the following errors",
          html: "<div style='text-align:center; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
          confirmButtonColor: "#3085d6"
      });
  }
}

// Function to clear the user form by confirming the user's intent
const clearCategoryForm = () => {
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
      refreshIngredientCategoryForm();
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
//=======================Ingredient Category Form End===============================================

//=======================Ingredient Brand Form Start===============================================
// Reinitialize the brand object used for form data binding
ingredientbrand = new Object();

// Function to reset the ingredient brand form and clear related fields
const refreshIngredientBrandForm = () => {
  // Reset all form controls to their default state (clears input fields, resets dropdowns)
  formBrand.reset();

  // Reset specific UI elements manually (e.g., text input, preview, etc.)
  setDefault([selectNCategory,textBrandName]);
}

// Fetch all categories from the backend
let newCategoriesone = getServiceRequest('/ingredientcategory/alldata');
// Populate the category dropdown with the fetched data
fillDataIntoSelect(selectNCategory, "Please Select Category", newCategoriesone, "name");

// Function to validate the brand form before submission
const checkFormErrorTwo = () => {
  let formInputErrors = "";

  // Validate that a category is selected
  if (ingredientbrand.ingredient_category_id == null) {
    formInputErrors += "❗📂 Please Select Category...! \n";
  }

  // Validate: Check if the brand name field is empty or not filled
  if (ingredientbrand.name == null) {
    formInputErrors += "❗🏷️ Please Enter Brand...! \n";
  }

  return formInputErrors; // Return all collected validation messages
}

// Function triggered when the brand form submit button is clicked
const buttonBrandSubmit = () => {
  console.log(ingredientbrand); // Log current form object for debugging

  let errors = checkFormErrorTwo(); // Run validation check

  // Proceed only if no validation errors
  if (errors === "") {
    // Show confirmation prompt using SweetAlert2
    Swal.fire({
      title: "Are you sure to add the following Brand?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "📂 <b>Category:</b> " + ingredientbrand.ingredient_category_id.name + "<br>" +
        "🏷️ <b>Brand:</b> " + ingredientbrand.name + "<br>" +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Brand"
    }).then((result) => {
      // If the user confirms the action
      if (result.isConfirmed) {
        // Send HTTP POST request to the server with the form data
        let postResponse = getHTTPServiceRequest("/ingredientbrandcategory/insert", "POST", ingredientbrand);

        // If the backend confirms success
        if (postResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,
            showConfirmButton: false
          });

          // Reset form and close the off-canvas UI
          refreshIngredientBrandForm();

        // Fetch latest data from the server to update dropdown options
        let brands = getServiceRequest('/brand/alldata'); // Fetch brands
        fillDataIntoSelect(selectItemBrand, "Please Select Brand", brands, "name");
          $("#offcanvasBrandForm").offcanvas("hide");
        } else {
          // Show error returned from server
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
    // Display form validation errors using SweetAlert
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form has the following errors",
      html: "<div style='text-align:center; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      confirmButtonColor: "#3085d6"
    });
  }
}

// Function to clear the user form by confirming the user's intent
const clearBrandForm = () => {
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
      refreshIngredientBrandForm();
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

//=======================Ingredient Brand Form End===============================================


//=======================Ingredient SubCategory Form Start==========================================
// Initialize the object to hold form data for ingredient subcategory
ingredientsubcategory = new Object();

// Function to reset the ingredient subcategory form and reload category dropdown
const refreshIngredientSubCategoryForm = () => {
  // Clear all form input fields and reset to default
  formSubCategory.reset();
  // Reset any custom fields or UI states (like borders, previews, etc.)
  setDefault([selectNewCategory, textSubCategory]);
}

// Fetch all categories from the backend
let newCategories = getServiceRequest('/ingredientcategory/alldata');
// Populate the category dropdown with the fetched data
fillDataIntoSelect(selectNewCategory, "Please Select Category", newCategories, "name");


// Function to validate the subcategory form inputs before submitting
const checkFormErrorThree = () => {
  let formInputErrors = "";

  // Validate that a category is selected
  if (ingredientsubcategory.ingredient_category_id == null) {
    formInputErrors += "❗📂 Please Select Category...! \n";
  }

  // Validate that a subcategory name is entered
  if (ingredientsubcategory.name == null) {
    formInputErrors += "❗📁 Please Enter Sub-Category...! \n";
  }

  // Return the combined error message string
  return formInputErrors;
}

// Function to handle the subcategory form submission process
const buttonSubCategorySubmit = () => {

  console.log(ingredientsubcategory); // Debug: log the current object state

  let errors = checkFormErrorThree(); // Run validation

  // Continue only if no validation errors are found
  if (errors === "") {
    // Ask for user confirmation using SweetAlert2
    Swal.fire({
      title: "Are you sure to add the following Brand?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "📂 <b>Category:</b> " + ingredientsubcategory.ingredient_category_id.name + "<br>" +
        "📁 <b>Sub Category:</b> " + ingredientsubcategory.name + "<br>" +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Sub Category"
    }).then((result) => {
      // If user confirms, send data to backend via HTTP POST
      if (result.isConfirmed) {
        let postResponse = getHTTPServiceRequest("/ingredientsubcategory/insert", "POST", ingredientsubcategory);

        // Handle success response from server
        if (postResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,
            showConfirmButton: false
          });

          // Clear the form and close the modal or off-canvas panel
          refreshIngredientSubCategoryForm();

          let subcategories = getServiceRequest('ingredientsubcategory/alldata'); // Fetch subcategories

          fillDataIntoSelect(selectItemSubCategory, "Please Select Sub-Category", subcategories, "name");

          $("#offcanvasBrandForm").offcanvas("hide");

        } else {
          // Show error message from backend if submission failed
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
    // If validation errors exist, show them in a styled alert box
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form has the following errors",
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      confirmButtonColor: "#3085d6"
    });
  }
}

// Function to clear the user form by confirming the user's intent
const clearSubCategoryForm = () => {
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
      refreshIngredientSubCategoryForm();
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

//=======================Ingredient Category Form End===============================================

