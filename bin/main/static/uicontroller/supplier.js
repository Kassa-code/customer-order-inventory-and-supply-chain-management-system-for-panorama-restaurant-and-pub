//Create browser load event
window.addEventListener("load", () => {
    refreshSupplierTable();
    refreshSupplierForm();
});

// Create refresh table area function
// Call refreshSupplierTable() in browser,submit,update,delete functions
const refreshSupplierTable = () => {
   
    // Fetch supplier data using the getServiceRequest common function
    let suppliers = getServiceRequest('/supplier/alldata');


    // Create colums array and objects for each column
    // string ===> string / date / number
    // function ===> object / array / boolean
    let propertyList = [
        { propertyName: "suppliername", dataType: "string" },
        { propertyName: "mobileno", dataType: "string" },
        { propertyName: "email", dataType: "string" },
        { propertyName: "address", dataType: "string" },
       
        { propertyName: getSupplierStatus, dataType: "function", },
    ];

    // Call fillDataIntoTable(tableBodyId,dataList,properyList,supplierFormRefill,supplierDelete,supplierView)
    // and passs the parameters;
    fillDataIntoTable(tableSupplierBody, suppliers, propertyList, supplierFormRefill, supplierDelete, supplierView);

    $("#tableSupplier").DataTable(); // identify table using jQuery
   
};

// Create a function to refresh the supplier form area
const refreshSupplierForm = () => {
    // Define a global object for the submit button function 
    // This object will store property values and be used for data submission after validation
    supplier = new Object();

    // Initialize an empty array to store supplier ingredients
    supplier.supplyIngredients = new Array();

    // Reset the form inputs to their initial values
    formSupplier.reset();

    // Set default values for multiple form fields at once
    setDefault([
        textSupplierName, textMobile, textLand, textEmail, textBrn, textBankName, 
        textBankBranch, textHolderName, textAccountNo, selectSupplierStatus, 
        textAddress, textNote
    ]);

    // Fetch all ingredients from the backend API
    // Uses the custom function 'getServiceRequest' to make an API call
    allItems = getServiceRequest('ingredient/alldata');

    // Fetch all supplier statuses from the backend API
    // Uses the custom function 'getServiceRequest' to make an API call
    let supplierStatuses = getServiceRequest('supplierstatus/alldata');
    
    console.log(allItems);

    // Populate the dropdown for all available items using the fetched data
    fillDataIntoSelect(
        selectAllItem,  // Target HTML <select> element for displaying all items
        "",             // No placeholder message needed
        allItems,        // Data array containing all available ingredients
        "itemname"      // The property name to display in the dropdown
    );

    // Populate the dropdown for selected items (initially empty)
    fillDataIntoSelect(
        selectSelectedItem,         // Target HTML <select> element for displaying selected items
        "",                         // No placeholder message needed
        supplier.supplyIngredients, // Data array (initially empty)
        "itemname"                  // The property name to display in the dropdown
    );

    // Populate the Supplier Status dropdown with the data fetched from the backend
    fillDataIntoSelect(
        selectSupplierStatus,            // Target HTML <select> element for supplier status
        "Please Select Supplier Status", // Placeholder message displayed initially
        supplierStatuses,                // Data array containing all supplier statuses
        "name"                           // The property name to display in the dropdown
    );

    // Set the default selected value for the Supplier Status dropdown
    // Use the first item from the fetched supplierStatuses list as the default
    selectSupplierStatus.value = JSON.stringify(supplierStatuses[0]);

    // Set the supplier's status ID using the first item from the fetched list
    supplier.supplier_status_id = supplierStatuses[0];
    // Style the dropdown to indicate it is correctly selected (using a green border)
    selectSupplierStatus.classList.remove("is-invalid");
    selectSupplierStatus.classList.add("is-valid");
    selectSupplierStatus.style.border = "2px solid green";
    selectSupplierStatus.style.backgroundColor = "#c6f6d5";

    // Hide the Update button by adding the "d-none" class (d-none = display: none)
    buttonUpdate.classList.add("d-none");

    // Show the Submit button by removing the "d-none" class (making it visible)
    buttonSubmit.classList.remove("d-none");
};




// Define a function to get the appropriate employee status icon based on their status
const getSupplierStatus = (dataOb) => {
    // Check if the employee status is "Available"
    if (dataOb.supplier_status_id.name == "Available") {
        return (
            "<i class='fa-solid fa-building fa-lg text-success'></i>" // Green icon for available suppliers
        );
    }

    // Check if the employee status is "Not-Available"
    if (dataOb.supplier_status_id.name == "Not-Available") {
        return (
            "<i class='fa-solid fa-building fa-lg text-warning'></i>" // Yellow icon for Not-Available suppliers
        );
    }

    // Check if the employee status is "Removed"
    if (dataOb.supplier_status_id.name == "Removed") {
        return (
            "<i class='fa-solid fa-building fa-lg text-danger'></i>" // Red icon for removed suppliers
        );
    }
};

// Function to move the selected item(s) from the "All Items" list to the "Selected Items" list
const addSelectedItem = () => {
    // If the selected value is not empty
    if (selectAllItem.value != "") {
        // Step 1: Get the selected item from the "All Items" list
        let selectedItem = JSON.parse(selectAllItem.value);

        // Step 2: Add the selected item to the "Selected Items" list
        supplier.supplyIngredients.push(selectedItem);

        // Step 3: Refresh the "Selected Items" dropdown
        fillDataIntoSelect(selectSelectedItem, "", supplier.supplyIngredients, "itemname");

        // Step 4: Find the index of the selected item in the "All Items" list
        let extIndex = allItems.map(item => item.id).indexOf(selectedItem.id);

        // Step 5: Remove the selected item from the "All Items" list if it exists
        if (extIndex != -1) {
            allItems.splice(extIndex, 1);
        }

        // Step 6: Refresh the "All Items" dropdown after removal
        fillDataIntoSelect(selectAllItem, "", allItems, "itemname");
    } else {
        // Display a message if no item is selected
        alert("Please select an item from the list.");
    }
}


// Function to move all items from the "All Items" list to the "Selected Items" list
const addAllItems = () => {

    // Loop through each item in the "All Items" list
    for (const items of allItems) {
        // Add each item to the "Selected Items" list (supplier's ingredients array)
        supplier.supplyIngredients.push(items);
    }

    // Update the "Selected Items" dropdown with the newly added items
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplyIngredients, "itemname");

    // Clear the "All Items" list since all items are moved
    allItems = [];
    
    // Update the "All Items" dropdown to reflect the empty list
    fillDataIntoSelect(selectAllItem, "", allItems, "itemname");
}


// Function to move the selected item(s) from the "Selected Items" list back to the "All Items" list
const removeSelectedItem = () => {
    // If the selected value is not empty
    if (selectSelectedItem.value != "") {
        // Get the selected item from the "Selected Items" dropdown and parse it from JSON format
        let selectedItem = JSON.parse(selectSelectedItem.value);

        // Add the selected item to the "All Items" list
        allItems.push(selectedItem);

        // Update the "All Items" dropdown with the updated list
        fillDataIntoSelect(selectAllItem, "", allItems, "itemname");

        // Find the index of the selected item in the "Selected Items" list using its ID
        let extIndex = supplier.supplyIngredients.map(item => item.id).indexOf(selectedItem.id);

        // If the item exists in the list (index is not -1), remove it
        if (extIndex != -1) {
            supplier.supplyIngredients.splice(extIndex, 1);
        }

        // Update the "Selected Items" dropdown to reflect the removal
        fillDataIntoSelect(selectSelectedItem, "", supplier.supplyIngredients, "itemname");
    } else {
        // Display a message if no item is selected
        alert("Please select an item from the selected items list.");
    }
}


// Function to move all items from the "Selected Items" list back to the "All Items" list
const removeAllItems = () => {

    // Loop through each item in the "Selected Items" list (supplier's ingredients array)
    for (const items of supplier.supplyIngredients) {
        // Add each item to the "All Items" list
        allItems.push(items);
    }

    // Update the "All Items" dropdown to display the moved items
    fillDataIntoSelect(selectAllItem, "", allItems, "itemname");

    // Clear the "Selected Items" list as all items have been moved
    supplier.supplyIngredients = [];

    // Update the "Selected Items" dropdown to reflect the cleared list
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplyIngredients, "itemname");
}



// Function to refill the supplier form
const supplierFormRefill = (ob, index) => {
    console.log("Edit", ob, index); // Logs the object and index for debugging

    supplier = getServiceRequest("/supplier/getbyid?id=" + ob.id);
    oldSupplier = getServiceRequest("/supplier/getbyid?id=" + ob.id);

    // Assign values to text inputs
    textSupplierName.value = supplier.suppliername; // Set full name
    textMobile.value = supplier.mobileno; // Set NIC number

    // Check if landline number exists, otherwise set to an empty string
    if (supplier.landno === undefined || supplier.landno === null) {
        textLand.value = "";
    } else {
        textLand.value = supplier.landno;
    }

    textEmail.value = supplier.email; // Set email
    textBrn.value = supplier.brn; // Set brn
    textBankName.value = supplier.bank_name; // Set bank name
    textBankBranch.value = supplier.branch_name; // Set bank branch
    textHolderName.value = supplier.holder_name; // Set accountholder name
    textAccountNo.value = supplier.account_no; // Set account no

    // Assign supplier status, ensuring values are strings
    selectSupplierStatus.value = JSON.stringify(supplier.supplier_status_id);

    // Set address
    textAddress.value = supplier.address;

     // Uses the custom function 'getServiceRequest' to make an API call
    allItems = getServiceRequest('/ingredient/listwithoutsupply?supplierid='+supplier.id);

    fillDataIntoSelect(selectAllItem, "", allItems, "itemname");
    // Set selected items
    fillDataIntoSelect(selectSelectedItem, "", supplier.supplyIngredients, "itemname");

    // Check if note exists, otherwise set to an empty string
    if (supplier.note === undefined || supplier.note === null) {
        textNote.value = "";
    } else {
        textNote.value = supplier.note;
    }


    // Show the Update button
    buttonUpdate.classList.remove("d-none");

    // Hide the Submit button
    buttonSubmit.classList.add("d-none");

    $("#offcanvasSupplierForm").offcanvas("show");

};

// Define function to delete an supplier record
const supplierDelete = (dataOb) => {
    // Show confirmation dialog using SweetAlert2 with detailed supplier info
    Swal.fire({
      title: "Are you sure to delete the following Supplier?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🏷️ <b>Name:</b> " + dataOb.suppliername + "<br>" +
        "📱 <b>Mobile:</b> " + dataOb.mobileno + "<br>" +
        "📧 <b>Email:</b> " + dataOb.email + "<br>" +
        "📶 <b>Status:</b> " + dataOb.supplier_status_id.name + "<br>" +
        "🏠 <b>Address:</b> " + dataOb.address +
        "</div>",
  
      icon: "warning",
      showCancelButton: true,
      width: "20em",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete Supplier"
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the DELETE HTTP service
        let deleteResponse = getHTTPServiceRequest("/supplier/delete", "DELETE", dataOb);
  
        if (deleteResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Deleted!",
            text: "Supplier deleted successfully.",
            timer: 1500,
            showConfirmButton: false
          });
  
          // Refresh table and form
          refreshSupplierTable();
          refreshSupplierForm();
  
          // Hide supplier offcanvas view
          $("#offcanvasSupplierView").offcanvas("hide");
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
  }
  


// Define function for viewing/printing supplier record
const supplierView = (ob, index) => {
    console.log("View", ob, index); // Log the supplier object and index for debugging


    // Assign supplier details to respective table cells for display
    tdSupplierName.innerText = ob.suppliername; // Set name
    tdSupplierMobileno.innerText = ob.mobileno; // Set mobileno
    tdSupplierEmail.innerText = ob.email; // Set emil
    tdSupplierBrn.innerText = ob.brn; // Set BRN
    tdSupplierBankName.innerText = ob.bank_name; // Set bank name
    tdSupplierBranchName.innerText = ob.branch_name; // Set branch name
    tdSupplierHolderName.innerText = ob.holder_name; // Set account holder name
    tdSupplierAccNo.innerText = ob.account_no; // Set account number
    tdSupplierStatus.innerText = ob.supplier_status_id.name; // Set supplier status
    tdSupplierAddress.innerText = ob.address; // Set address
   
    $("#offcanvasSupplierView").offcanvas("show"); // Open the employee details modal using jQuery
};


// Funtion to print button
const buttonPrintRow = () => {
    let newWindow = window.open();
    let printView = `<html>
      <head>
        <title>Print Supplier</title>
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
          ${tableSupplierView.outerHTML}
        </div>
      </body>
    </html>`;
    newWindow.document.write(printView);
    // Wait for 1.5 seconds to allow the content to fully load before printing
    setTimeout(() => {
        newWindow.stop(); // Stop further loading
        newWindow.print(); // Open the print dialog
        newWindow.close(); // Close the new window after printing
    }, 1500);

    /**
     * `${tableSupplierView.outerHTML}` is a template literal that dynamically embeds the full HTML content
     * of the `tableSupplierView` element into a string.
     *
     * - `tableSupplierView` is expected to be a reference to a DOM element, typically an HTML table (`<table>`).
     * - `outerHTML` is a property of DOM elements that returns the complete HTML representation of the element,
     *   including the element itself and all its child elements.
     *
     * This is useful for:
     * - Debugging: Logging the full HTML structure of the table to the console.
     * - Rendering: Dynamically generating or updating HTML content.
     * - Serialization: Passing the HTML content to another function or API.
     */
};

// Function to check form errors for supplier
const checkFormError = () => {
    let formInputErrors = "";
  
    if (supplier.suppliername == null) {
      formInputErrors += "❗🏷️ Please Enter a Valid Supplier Name...! \n";
    }
    if (supplier.mobileno == null) {
      formInputErrors += "❗📱 Please Enter a Valid Mobile Number...! \n";
    }
    if (supplier.email == null) {
      formInputErrors += "❗📧 Please Enter a Valid Email...! \n";
    }
    if (supplier.brn == null) {
      formInputErrors += "❗🔢 Please Enter a Valid BRN...! \n";
    }
    if (supplier.bank_name == null) {
      formInputErrors += "❗🏦 Please Enter a Valid Bank Name...! \n";
    }
    if (supplier.branch_name == null) {
      formInputErrors += "❗🏢 Please Enter a Valid Branch Name...! \n";
    }
    if (supplier.holder_name == null) {
      formInputErrors += "❗🧍 Please Enter a Valid Holder's Name...! \n";
    }
    if (supplier.account_no == null) {
      formInputErrors += "❗💳 Please Enter a Valid Account Number...! \n";
    }
    if (supplier.supplier_status_id == null) {
      formInputErrors += "❗📶 Please Select Supplier Status...! \n";
    }
    if (supplier.address == null) {
      formInputErrors += "❗🏠 Please Enter Address...! \n";
    }
    if (supplier.supplyIngredients.length == 0) {
      formInputErrors += "❗🥫 Please Select Items...! \n";
    }
  
    return formInputErrors;
  };
  
// Function form submit
const buttonSupplierSubmit = () => {
    console.log(supplier);
  
    let errors = checkFormError();
    if (errors === "") {
      Swal.fire({
        title: "Are you sure to add following Supplier?",
        html:
          "<div style='text-align:left; font-size:14px'>" +
          "🏢 <b>Supplier Name:</b> " + supplier.suppliername + "<br>" +
          "📱 <b>Mobile No:</b> " + supplier.mobileno + "<br>" +
          "📧 <b>Email:</b> " + supplier.email + "<br>" +
          "🆔 <b>BRN:</b> " + supplier.brn + "<br>" +
          "🏦 <b>Bank Name:</b> " + supplier.bank_name + "<br>" +
          "🏛️ <b>Branch Name:</b> " + supplier.branch_name + "<br>" +
          "👤 <b>Account Holder's Name:</b> " + supplier.holder_name + "<br>" +
          "🔢 <b>Account No:</b> " + supplier.account_no + "<br>" +
          "📊 <b>Supplier Status:</b> " + supplier.supplier_status_id.name + "<br>" +
          "🏠 <b>Address:</b> " + supplier.address +
          "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Supplier"
      }).then((result) => {
        if (result.isConfirmed) {
          let postResponse = getHTTPServiceRequest("/supplier/insert", "POST", supplier);
  
          if (postResponse === "OK") {
            Swal.fire({
              icon: "success",
              width: "20em",
              title: "Saved successfully!",
              timer: 1500,
              showConfirmButton: false,
              draggable: true
            });
  
            refreshSupplierTable();
            refreshSupplierForm();
            $("#offcanvasSupplierForm").offcanvas("hide");
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
  

// Funtion to check form updates
const checkFormUpdate = () => {
  // Initialize an empty string to hold the update messages
  let updates = "";

  // Check if both supplier and oldSupplier objects are not null
  if (supplier != null && oldSupplier != null) {
      
      if (supplier.suppliername != oldSupplier.suppliername) {
          updates += "🏢 Supplier Name is changed..! \n";
      }
      
      if (supplier.mobileno != oldSupplier.mobileno) {
          updates += "📱 Mobile No is changed..! \n";
      }
      
      if (supplier.landno != oldSupplier.landno) {
          updates += "☎️ Land No is changed..! \n";
      }
      
      if (supplier.email != oldSupplier.email) {
          updates += "📧 Email is changed..! \n";
      }

      if (supplier.brn != oldSupplier.brn) {
          updates += "🆔 BRN is changed..! \n";
      }

      if (supplier.bank_name != oldSupplier.bank_name) {
          updates += "🏦 Bank Name is changed..! \n";
      }

      if (supplier.branch_name != oldSupplier.branch_name) {
          updates += "🏬 Branch Name is changed..! \n";
      }

      if (supplier.holder_name != oldSupplier.holder_name) {
          updates += "👤 Acc Holder Name is changed..! \n";
      }

      if (supplier.account_no != oldSupplier.account_no) {
          updates += "💳 Account Number is changed..! \n";
      }

      if (supplier.supplier_status_id.name != oldSupplier.supplier_status_id.name) {
          updates += "🔖 Supplier Status is changed..! \n";
      }

      if (supplier.address != oldSupplier.address) {
          updates += "🏠 Address is changed..! \n";
      }

      if (supplier.supplyIngredients.length != oldSupplier.supplyIngredients.length) {
          updates += "📦 Items are changed..! \n";
      }

      if (supplier.note != oldSupplier.note) {
          updates += "📝 Note is changed..! \n";
      }
      
  }

  // Return the final string containing all update messages
  return updates;
};


// Create form update event function
const buttonSupplierUpdate = () => {
  // Step 1: Validate form errors
  let errors = checkFormError();

  if (errors === "") {
    // Step 2: Check if there are any updates
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
      // Updates found, confirm with user
      Swal.fire({
        title: "Are you sure you want to update following changes?",
        html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update Supplier"
      }).then((result) => {
        if (result.isConfirmed) {
          // Perform the update request
          let putResponse = getHTTPServiceRequest("/supplier/update", "PUT", supplier);

          if (putResponse === "OK") {
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500,
              draggable: true
            });

            refreshSupplierTable();
            refreshSupplierForm();
            $("#offcanvasSupplierForm").offcanvas("hide");
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

// Function to clear the user form by confirming the user's intent
const clearSupplierForm = () => {
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
        refreshSupplierForm();
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
