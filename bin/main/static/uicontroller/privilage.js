// Browser load event handler
window.addEventListener("load", () => {
    // Call function to refresh the privilege table when the page loads
    refreshPrivilageTable();
    // Call function to refresh the privilege form when the page loads
    refreshPrivilageForm();
});
// Define function to refresh the privilege form
const refreshPrivilageForm = () => {
    // Fetch an array of roles from the server, each containing an ID and name
    roles = getServiceRequest("/role/alldata");

    // Initialize an empty privilege object to store privilege-related data
    privilage = new Object();

    // Fetch an array of modules from the server, each containing an ID and name
    modules = getServiceRequest("/module/alldata");

    // Populate the role dropdown with predefined roles
    fillDataIntoSelect(selectRole, "Please Select Role", roles, "name"); // Function call to fill role data into dropdown

    // Populate the module dropdown with predefined modules
    fillDataIntoSelect(selectModule, "Please Select Module", modules, "name"); // Function call to fill module data into dropdown

    // Uncheck all privilege checkboxes (reset privileges) and update labels accordingly
    chkBoxSelect.checked = false; // Disable the "Select" privilege
    privilage.privilage_select = false; // Update the privilege object for "Select"
    labelSelect.innerText = "Select Privilege Not-Granted"; // Updated text for consistency

    chkBoxInsert.checked = false; // Disable the "Insert" privilege
    privilage.privilage_insert = false; // Update the privilege object for "Insert"
    labelInsert.innerText = "Insert Privilege Not-Granted"; // Updated text for consistency

    chkBoxUpdate.checked = false; // Disable the "Update" privilege
    privilage.privilage_update = false; // Update the privilege object for "Update"
    labelUpdate.innerText = "Update Privilege Not-Granted"; // Updated text for consistency

    chkBoxDelete.checked = false; // Disable the "Delete" privilege
    privilage.privilage_delete = false; // Update the privilege object for "Delete"
    labelDelete.innerText = "Delete Privilege Not-Granted"; // Updated text for consistency

    // Reset form elements to their default state
    setDefault([
        // Function call to reset form elements
        selectRole,
        selectModule,
        chkBoxSelect,
        chkBoxInsert,
        chkBoxUpdate,
        chkBoxDelete,
    ]);

    // Hide the Update button by adding the Bootstrap class "d-none" (display: none)
    buttonUpdate.classList.add("d-none");

    // Show the Submit button by removing the "d-none" class (making it visible)
    buttonSubmit.classList.remove("d-none");

    // Enable the submit button by removing any inline styles that may be hiding it
    //buttonSubmit.removeAttribute("style");

    // Disable the update button by applying 'display: none' to hide it from view
    //buttonUpdate.style.display = "none";
};


// Define function to check for privilege form errors
const checkFormError = () => {
    
    let errors = ""; // Initialize error message string
  
    if (privilage.role_id == null) {
      errors += "❗🛡️ Please Select a Role...! \n";
    }
  
    if (privilage.module_id == null) {
      errors += "❗🧩 Please Select a Module...! \n";
    }
  
    return errors; // Return the accumulated error messages
  };
  

// Define function for privilege submission
const buttonPrivilageSubmit = () => {
    console.log(privilage);
  
    let errors = checkFormError();
  
    if (errors === "") {
      Swal.fire({
        title: "Are you sure to add the following changes?",
        html:
          "<div style='text-align:left; font-size:14px'>" +
          "🛡️ <b>Role:</b> " + privilage.role_id.name + "<br>" +
          "📚 <b>Module:</b> " + privilage.module_id.name + "<br>" +
          "✅ <b>Select Privilege:</b> " + getSelect(privilage) + "<br>" +
          "➕ <b>Insert Privilege:</b> " + getInsert(privilage) + "<br>" +
          "✏️ <b>Update Privilege:</b> " + getUpdate(privilage) + "<br>" +
          "❌ <b>Delete Privilege:</b> " + getDelete(privilage) +
          "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Changes"
      }).then((result) => {
        if (result.isConfirmed) {
          let postResponse = getHTTPServiceRequest("/privilage/insert", "POST", privilage);
  
          if (postResponse === "OK") {
            Swal.fire({
              icon: "success",
              width: "20em",
              title: "Saved successfully!",
              timer: 1500,
              showConfirmButton: false,
              draggable: true
            });
  
            refreshPrivilageForm();
            refreshPrivilageTable();
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
        html: "<div style='text-align:center; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
        confirmButtonColor: "#3085d6"
      });
    }
  };
  

// Define Function to refresh the privilege table
const refreshPrivilageTable = () => {
    // Fetches an array of privilege users from the server.
    // Each object in the array represents a role with specific permissions.
    let privilageUsers = getServiceRequest("/privilage/alldata");

    // Further implementation needed to process, display, or manipulate this data.

    //data types
    //string==> string / date / number
    //function==> object / array / boolean

    let columnListPrivilage = [
        { propertyName: getRole, dataType: "function" },
        { propertyName: getModule, dataType: "function" },
        { propertyName: getSelect, dataType: "function" },
        { propertyName: getInsert, dataType: "function" },
        { propertyName: getUpdate, dataType: "function" },
        { propertyName: getDelete, dataType: "function" },
    ];

    /* call fill data intoTable function (tableBodyd, dataList, columnList, refillFunction, 
      deleteFunction, printFunction) */

    fillDataIntoTable(
        tableBodyPrivilage,
        privilageUsers,
        columnListPrivilage,
        privilageFormRefill,
        privilageDelete,
        privilageView
    );

    // Convert the datatable into jQuery datatable
    $("#tablePrivilage").DataTable();
};

// Function to get the role from the given object
const getRole = (ob) => {
    return ob.role_id.name;
};

// Function to get the module name from the given object
const getModule = (ob) => {
    return ob.module_id.name;
};

// Function to check if the "Select" privilege is granted
const getSelect = (ob) => {
    if (ob.privilage_select) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
};

// Function to check if the "Insert" privilege is granted
const getInsert = (ob) => {
    if (ob.privilage_insert) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
};

// Function to check if the "Update" privilege is granted
const getUpdate = (ob) => {
    if (ob.privilage_update) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
};

// Function to check if the "Delete" privilege is granted
const getDelete = (ob) => {
    if (ob.privilage_delete) {
        return "Granted";
    } else {
        return "Not-Granted";
    }
};

// Function to refill the privilege form with selected row data
const privilageFormRefill = (ob, rowindex) => {
    // Create a deep copy of the `ob` object and assign it to `privilage`
    // This ensures that `privilage` is a separate object and does not reference `ob` directly
    privilage = JSON.parse(JSON.stringify(ob));

    // Create another deep copy of `ob` and assign it to `oldPrivilage`
    // This is likely used to store the original state of the object before any modifications
    oldPrivilage = JSON.parse(JSON.stringify(ob));

    // Set the selected role in the role dropdown
    selectRole.value = JSON.stringify(ob.role_id); // Populate role dropdown with the selected role ID

    // Set the selected module in the module dropdown
    selectModule.value = JSON.stringify(ob.module_id); // Populate module dropdown with the selected module ID

    // Check and set the "Select" privilege based on the selected data
    if (ob.privilage_select) {
        chkBoxSelect.checked = true; // Enable "Select" privilege
        labelSelect.innerText = "Select Privilege Granted"; // Update the label to indicate granted
    } else {
        chkBoxSelect.checked = false; // Disable "Select" privilege
        labelSelect.innerText = "Select Privilege Not-Granted"; // Update the label to indicate not granted
    }

    // Check and set the "Insert" privilege based on the selected data
    if (ob.privilage_insert) {
        chkBoxInsert.checked = true; // Enable "Insert" privilege
        labelInsert.innerText = "Insert Privilege Granted"; // Update the label to indicate granted
    } else {
        chkBoxInsert.checked = false; // Disable "Insert" privilege
        labelInsert.innerText = "Insert Privilege Not-Granted"; // Update the label to indicate not granted
    }

    // Check and set the "Update" privilege based on the selected data
    if (ob.privilage_update) {
        chkBoxUpdate.checked = true; // Enable "Update" privilege
        labelUpdate.innerText = "Update Privilege Granted"; // Update the label to indicate granted
    } else {
        chkBoxUpdate.checked = false; // Disable "Update" privilege
        labelUpdate.innerText = "Update Privilege Not-Granted"; // Update the label to indicate not granted
    }

    // Check and set the "Delete" privilege based on the selected data
    if (ob.privilage_delete) {
        // Correct condition for "Delete" privilege
        chkBoxDelete.checked = true; // Enable "Delete" privilege
        labelDelete.innerText = "Delete Privilege Granted"; // Update the label to indicate granted
    } else {
        chkBoxDelete.checked = false; // Disable "Delete" privilege
        labelDelete.innerText = "Delete Privilege Not-Granted"; // Update the label to indicate not granted
    }

    // Show the Update button (for submitting changes)
    buttonUpdate.classList.remove("d-none");

    // Hide the Submit button (used for new entries)
    buttonSubmit.classList.add("d-none"); 
    // Disable the submit button by setting its display property to 'none' (hides it from the UI)
    // buttonSubmit.style.display = "none";

    // Enable the update button by removing any inline 'style' attribute, making it visible if previously hidden
    // buttonUpdate.removeAttribute("style");

    // Show the off-canvas element with the ID 'offcanvasPrivilageForm'
    $("#offcanvasPrivilageForm").offcanvas("show");
};

// Function to check updates in the privilege form
const checkPrivilageFormUpdate = () => {
  let updates = ""; // Initialize an empty string to store update messages

  // Ensure both `privilage` and `oldPrivilage` objects exist before checking for changes
  if (privilage != null && oldPrivilage != null) {

      // Check if the selected role has changed
      if (privilage.role_id.name != oldPrivilage.role_id.name) {
          updates += "👤 Role is Changed..! \n";
      }

      // Check if the selected module has changed
      if (privilage.module_id.name != oldPrivilage.module_id.name) {
          updates += "🧩 Module is Changed..! \n";
      }

      // Check if the "Select" privilege has changed
      if (privilage.privilage_select != oldPrivilage.privilage_select) {
          updates += "✅ Select Privilege is Changed..! \n";
      }

      // Check if the "Insert" privilege has changed
      if (privilage.privilage_insert != oldPrivilage.privilage_insert) {
          updates += "➕ Insert Privilege is Changed..! \n";
      }

      // Check if the "Update" privilege has changed
      if (privilage.privilage_update != oldPrivilage.privilage_update) {
          updates += "✏️ Update Privilege is Changed..! \n";
      }

      // Check if the "Delete" privilege has changed
      if (privilage.privilage_delete != oldPrivilage.privilage_delete) {
          updates += "🗑️ Delete Privilege is Changed..! \n";
      }
  }

  // Return the collected update messages
  return updates;
};


// Function to update privilege details
const buttonPrivilageUpdate = () => {
  // Step 1: Validate the form for errors
  let errors = checkFormError();

  if (errors === "") {
    // Step 2: Check if any updates exist
    let updates = checkPrivilageFormUpdate();

    if (updates === "") {
      // No updates found, notify the user
      Swal.fire({
        title: "No Updates",
        text: "Nothing to update..",
        icon: "info",
        width: "20em",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Updates found, ask for user confirmation
      Swal.fire({
        title: "Are you sure you want to update the following changes?",
        html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update Privilege"
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with update request
          let putResponse = getHTTPServiceRequest("/privilage/update", "PUT", privilage);

          if (putResponse === "OK") {
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500,
              draggable: true
            });

            refreshPrivilageForm();
            refreshPrivilageTable();
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
    // Show form errors if validation failed
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



// Define function to delete a privilege entry
const privilageDelete = (ob, rowindex) => {
    // Show confirmation dialog using SweetAlert2 with detailed privilege info
    Swal.fire({
      title: "Are you sure to delete the following Privilege?",
      html:
        "<div style='text-align:center; font-size:14px'>" +
        "🛡️ <b>Role:</b> " + ob.role_id.name + "<br>" +
        "🧩 <b>Module:</b> " + ob.module_id.name +
        "</div>",
  
      icon: "warning",
      showCancelButton: true,
      width: "20em",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete Privilege"
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, call DELETE HTTP service
        let serviceResponse = getHTTPServiceRequest("/privilage/delete", "DELETE", ob);
  
        if (serviceResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Deleted!",
            text: "Privilege deleted successfully.",
            timer: 1500,
            showConfirmButton: false
          });
  
          // Refresh table and form
          refreshPrivilageTable();
          refreshPrivilageForm(); // Make sure you define this if not already done
        } else {
          Swal.fire({
            icon: "error",
            width: "20em",
            title: "Delete Failed",
            html: "❌ Something went wrong!<br><br><code>" + serviceResponse + "</code>",
            confirmButtonColor: "#d33"
          });
        }
      }
    });
  };
  

// Function to view privilege details of a selected row
const privilageView = (ob, rowindex) => {
    console.log("View", ob, rowindex); // Log the object and index for debugging

    // Assign values to respective HTML elements
    $("#tdPrivilageRole").text(ob.role_id.name); // Display role name
    $("#tdPrivilageModule").text(ob.module_id.name); // Display module name

    // Display privilege statuses as "Granted" or "Not-Granted"
    $("#tdSelectPrivilage").text(ob.privilage_select ? "Granted" : "Not-Granted");
    $("#tdInsertPrivilage").text(ob.privilage_insert ? "Granted" : "Not-Granted");
    $("#tdUpdatePrivilage").text(ob.privilage_update ? "Granted" : "Not-Granted");
    $("#tdDeletePrivilage").text(ob.privilage_delete ? "Granted" : "Not-Granted");

    // Open the offcanvas using Bootstrap’s JavaScript API via jQuery
    $("#offcanvasPrivilageView").offcanvas("show"); // Make sure jQuery is selecting the right element
};

// Function to print the selected privilege row details
const buttonPrintRow = () => {
    let newWindow = window.open(); // Open new tab for printing

    let printView = `
    <html>
      <head>
        <title>Print Privilege</title>
        <link rel="stylesheet" href="/Resources/bootstrap-5.2.3/css/bootstrap.min.css"> <!-- Bootstrap styling -->
        <style>
          body {
            font-family: Arial, sans-serif;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f8f9fa;
            margin: 0;
          }
          .content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
          }
          .table th, .table td { padding: 6px 10px; }
          .table th { text-align: left; font-weight: bold; }
          h2 { text-align: center; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="content">
          <h2>Privilege Details</h2>
          ${tablePrivilageView.outerHTML} <!-- Include table with privilege details -->
        </div>
      </body>
    </html>`;

    newWindow.document.write(printView); // Write the HTML content into the new window

    setTimeout(() => {
        newWindow.stop(); // Stop further loading to prevent unnecessary rendering
        newWindow.print(); // Open the print dialog
        newWindow.close(); // Close the print window after printing
    }, 1500); // Delay printing to ensure content is fully loaded
};


// Function to clear the employee form after confirming with the user
const clearPrivilageForm = () => {
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
        refreshPrivilageForm();
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