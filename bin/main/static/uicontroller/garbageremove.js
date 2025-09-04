// Create browser load event
// This ensures the following logic runs only after the entire page (DOM + all external resources) is fully loaded
window.addEventListener("load", () => {
    
    // Refresh and initialize the supplier payment form when the page loads
    refreshGarbageRemoveForm();

    // Populate the supplier payment table on initial page load
    refreshGarbageRemoveTable();

});

// Create refresh table area function
const refreshGarbageRemoveTable = () => {
   

  let garbageremoves = getServiceRequest("/garbageremove/alldata");
    // Create an array of column definitions for the table
    // Each column is represented by an object with a property name and data type
    // Create colums array and objects for each column
    // string ===> string / date / number
    // function ===> object / array / boolean
    // decimal  → numeric values that should be formatted to 2 decimal places

    let propertyList = [
        { propertyName: generateItemName, dataType: "function" },
        { propertyName: generateBatchNo, dataType: "function" },
        { propertyName: "removed_qty", dataType: "decimal" },
        { propertyName: "removed_date", dataType: "string" }, 
        { propertyName: "removed_reason", dataType: "string" }
    ];

    // Populate the HTML table with ingredient data
    // Pass in:
    // - table body element ID
    // - list of ingredients
    // - property list for table columns
    // - callback functions for refill, and view actions
    fillDataIntoTable(tableGarbageRemoveBody, garbageremoves, propertyList,garbageRemoveFormRefill,garbageRemoveDelete,garbageRemoveView,false);

    

    // Initialize DataTables plugin on the table with ID "tableItem"
    // Enables features such as sorting, pagination, and search functionality
    $("#tableGarbageRemove").DataTable();

}

// Define a function to generate item name
const generateItemName = (dataOb) => {
  return dataOb.inventory_id.ingredients_id.itemname;
}

// Define a function to generate the display name for a submenu item row
const generateBatchNo = (dataOb) => {
  return dataOb.inventory_id.batch_number; // Return the submenu's name property for display in the table
}

// Define a function to generate item name
const garbageRemoveFormRefill = (dataOb) => {
}
// Define a function to generate item name
const garbageRemoveDelete = (dataOb) => {
}
// Define a function to generate item name
// Define a function to generate item name
const garbageRemoveView = (dataOb) => {
}

// Function to reset the supplier payment form and reload all dropdown data with fresh values
const refreshGarbageRemoveForm = () => {

    // Reset the entire form fields to their initial default state
    formgarbageremove.reset();    

    // Initialize a new empty object to store supplier payment data temporarily
    garbageremove = new Object();

    // Request latest data from backend to update dropdown menus (select inputs)
    
    let ingredients = getServiceRequest('ingredient/alldata'); // Fetch all payment statuses
    let batchnos = getServiceRequest('inventory/alldata');  
    
    fillDataIntoSelect(selectItem, "Select Item", ingredients, "itemname");     // Fill payment status dropdown using 'name' property

  fillDataIntoSelect(selectBatchNo, "Please Batch No", batchnos, "batch_number");

    // Manually reset or clear extra UI elements and inputs that form.reset() does not affect
    // This includes selects, text inputs, date inputs, and custom fields
    setDefault([
      selectItem,
      textRemovedQty,
      dteRemovedDte,
      textRemovedReason
    ]);

}


// Function to validate the supplier payment form inputs and collect error messages
const checkFormError = () => {
  let formInputErrors = "";

  if (garbageremove.inventory_id == null) {
      formInputErrors += "❗📦 Please select an inventory item...! \n"; // box for item
  }

  if (garbageremove.removed_qty == null) {
      formInputErrors += "❗🔢 Please enter removed quantity...! \n"; // numbers
  }

  if (garbageremove.removed_date == null) {
      formInputErrors += "❗📅 Please enter removed date...! \n"; // calendar
  }

  if (garbageremove.removed_reason == null) {
      formInputErrors += "❗📝 Please enter removed reason...! \n"; // memo pad
  }

  return formInputErrors;
}

  

// Function to handle the supplier payment form submission
const buttonGarbageRemoveSubmit = () => {
  console.log(garbageremove); // Debug log

  let errors = checkFormError(); // Validate form fields

  if (errors === "") {
      // Confirm submission with SweetAlert2
      Swal.fire({
          title: "Are you sure to add the following Garbage Remove?",
          html:
              "<div style='text-align:left; font-size:14px'>" +
            "📦 <b>Item:</b> " + garbageremove.inventory_id.ingredients_id.itemname + "<br>" +
              "🔢 <b>Removed Qty:</b> " + garbageremove.removed_qty + "<br>" +
              "📅 <b>Removed Date:</b> " + garbageremove.removed_date + "<br>" +
              "📝 <b>Removed Reason:</b> " + garbageremove.removed_reason + "<br>" +
              "</div>",
          icon: "warning",
          width: "20em",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Add Garbage Remove"
      }).then((result) => {
          if (result.isConfirmed) {
              let postResponse = getHTTPServiceRequest("/garbageremove/insert", "POST", garbageremove);

              if (postResponse === "OK") {
                  Swal.fire({
                      icon: "success",
                      width: "20em",
                      title: "Saved successfully!",
                      timer: 1500,
                      showConfirmButton: false
                  });

                  refreshGarbageRemoveTable();
                  refreshGarbageRemoveForm();
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

  
// Function to clear the supplier payment form after confirming with the user
const clearGarbageRemoveForm = () => {
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
        refreshGarbageRemoveForm();
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

const filterFromBatch = () => {
  let batchnos = getServiceRequest('/inventory/byingredient?ingredients_id=' + JSON.parse(selectItem.value).id);
  fillDataIntoSelect(selectBatchNo, "Please Batch No", batchnos, "batch_number");
}