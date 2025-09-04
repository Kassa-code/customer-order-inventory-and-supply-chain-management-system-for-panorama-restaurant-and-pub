//Create browser load event
window.addEventListener("load", () => {
    refreshVehicleTable();
    refreshForm();
});

// Create refresh table area function
// Call refreshEmployeeTable() in browser,submit,update,delete functions
const refreshVehicleTable = () => {
    //=============================================================================================================

    // Fetch employee data using the getServiceRequest common function
    let vehicles = getServiceRequest('/vehicle/alldata');


  // Create colums array and objects for each column
  // string ===> string / date / number
  // function ===> object / array / boolean
  let propertyList = [
    { propertyName: getType, dataType: "function", },
    { propertyName: "number", dataType: "string" },
    { propertyName: getStatus, dataType: "function", },
  ];

    // Call fillDataIntoTable(tableBodyId,dataList,properyList,employeeFormRefill,employeeDelete,employeeView)
    // and passs the parameters;
  fillDataIntoTable(tableVehicleBody, vehicles, propertyList, vehicleFormRefill, vehicleDelete, vehicleView);

  for (const index in vehicles) {
  // Check if the employee status is "Removed"
    if (vehicles[index].vehicle_status_id.name == "Not Available") {
    // Access the row corresponding to the current employee using the index
    // Then navigate through the DOM structure to find the specific button element
    // lastChild - last child node of the row (might be a text node; consider lastElementChild if needed)
    // children[0], children[1], etc. - traverse down the nested children until reaching the target button
      tableVehicleBody.children[index]
      .lastChild           // last child of the row (usually the action cell)
      .children[0]         // first child inside the last cell
      .children[1]         // second child inside that
      .children[0]         // first child inside that
      .children[1]         // second child inside that (the button to hide)
      .classList.add("d-none"); // add Bootstrap class to hide this button
  }
}
  $("#tableVehicle").DataTable(); // identify table using jQuery
    //=============================================================================================================
};

// Create refresh form area function
const refreshForm = () => {
  vehicle = new Object(); // Define a global object for submit button function to assign property values and pass them after validation
  formVehicle.reset(); // Reset form inputs to initial values

  setDefault([
    selectType,
    textVnumber,
    selectStatus
  ]);

    // Fetch all employee statuses from the backend API
  let vehicletypes = getServiceRequest('vehicletype/alldata');

    // Fetch all designations from the backend API
  let statuses = getServiceRequest('vehiclestatus/alldata');



    // Populate the Designation dropdown with data fetched from the backend
    fillDataIntoSelect(
      selectType, // The HTML <select> element for Designation
        "Please Select Type", // Default placeholder option
      vehicletypes, // Data array containing available designations
        "name" // The key used to display values in the dropdown
    );

    // Populate the Employee Status dropdown with data fetched from the backend
    fillDataIntoSelect(
      selectStatus, // The HTML <select> element for Employee Status
        "Please Select Status", // Default placeholder option
      statuses, // Data array containing available employee statuses
        "name" // The key used to display values in the dropdown
    );

     // Hide the Update button by adding the Bootstrap class "d-none" (display: none)
     buttonUpdate.classList.add("d-none");

     // Show the Submit button by removing the "d-none" class (making it visible)
     buttonSubmit.classList.remove("d-none");

};

// Define a function to get the designation name from the data object
const getType = (dataOb) => {
  return dataOb.type_id.name; // Returns the name of the designation
};

// Define a function to get the appropriate employee status icon based on their status
const getStatus = (dataOb) => {
    // Check if the employee status is "Working"
  if (dataOb.vehicle_status_id.name == "Available") {
        return (
            "<i class='fa-solid fa-motorcycle fa-lg text-success'></i>" // Green icon for working employees
        );
    }

    // Check if the employee status is "Removed"
  if (dataOb.vehicle_status_id.name == "Not Available") {
        return (
            "<i class='fa-solid fa-motorcycle fa-lg text-danger'></i>" // Red icon for removed employees
        );
    }
};


// Function to refill the employee form
const vehicleFormRefill = (ob, index) => {
    console.log("Edit", ob, index); // Logs the object and index for debugging
  

  selectType.value = JSON.stringify(ob.type_id);
  textVnumber.value = ob.number; 
  selectStatus.value = JSON.stringify(ob.vehicle_status_id);

   
    vehicle = JSON.parse(JSON.stringify(ob));
    oldVehicle = JSON.parse(JSON.stringify(ob));
    
    // Show the Update button (for submitting changes)
    buttonUpdate.classList.remove("d-none");

    // Hide the Submit button (used for new entries)
    buttonSubmit.classList.add("d-none");
    
  $("#offcanvasVehicleForm").offcanvas("show");

};

// Define function to delete an employee record
const vehicleDelete = (dataOb, index) => {
    // Show confirmation dialog using SweetAlert2 with detailed employee info
    Swal.fire({
      title: "Are you sure to delete the following Vehicle?",
      html:
        "🚗 <b>Type:</b> " + dataOb.type_id.name + "<br>" +
        "🔢 <b>Vehicle No:</b> " + dataOb.number + "<br>" +
        "📡 <b>Status:</b> " + dataOb.vehicle_status_id.name + 
        "</div>",

      icon: "warning",
      showCancelButton: true,       // Show a cancel button for safety
      width: "20em",                // Set custom width for better layout
      confirmButtonColor: "#3085d6", // Blue confirm button
      cancelButtonColor: "#d33",     // Red cancel button
      confirmButtonText: "Yes, Delete Vehicle"       // Text on confirm button


    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, call DELETE HTTP service
        let deleteResponse = getHTTPServiceRequest("/vehicle/delete", "DELETE", dataOb);
  
        if (deleteResponse === "OK") {
          // Show success alert
          Swal.fire({
            icon: "success",
            width: "20em",   
            title: "Deleted!",
            text: "Vehicle deleted successfully.",
            timer: 1500,
            showConfirmButton: false
          });
  
          // Refresh table and form without reloading page
          refreshVehicleTable();
          refreshForm();
        } else {
          // Show error alert if deletion fails
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
  


// Define function for viewing/printing employee record
const vehicleView = (ob, index) => {
    console.log("View", ob, index); // Log the employee object and index for debugging

  tdVtype.innerText = ob.type_id.name; 
  tdVnumber.innerText = ob.number; 
  tdVstatus.innerText = ob.vehicle_status_id.name; 

    $("#offcanvasEmployeeView").offcanvas("show"); 
};


// Funtion to print button
const buttonPrintRow = () => {
    let newWindow = window.open();
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
          ${tableVehicleView.outerHTML}
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

};

// Function to check form errors with icons
const checkFormError = () => {
  // Need to check all required elements
  let formInputErrors = "";
  
  if (vehicle.type_id == null) {
    formInputErrors += "❗🚗 Please select a vehicle type!\n";
  }
  if (vehicle.number == null) {
    formInputErrors += "❗🔢 Please enter the vehicle number!\n";
  }
  if (vehicle.vehicle_status_id == null) {
    formInputErrors += "❗📡 Please select the vehicle status!\n";
  }

  return formInputErrors;
};


// Function to handle employee form submission
const buttonVehicleSubmit = () => {
    console.log(vehicle);
  
    // Step 1: Validate form for errors
    let errors = checkFormError();
  
    if (errors === "") {
      // No errors - show confirmation dialog with SweetAlert2
      Swal.fire({
        title: "Are you sure to add the following Vehicle?",
        html:
        "<div style='text-align:left; font-size:14px'>"+
          "🚗 <b>Type:</b> " + vehicle.type_id.name + "<br>" +
          "🔢 <b>Vehicle No:</b> " + vehicle.number + "<br>" +
          "📡 <b>Status:</b> " + vehicle.vehicle_status_id.name + 
          "</div>",
        icon: "warning",
        width: "20em",   
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Vehicle"
      }).then((result) => {
        if (result.isConfirmed) {
          // Call POST service to insert employee
          let postResponse = getHTTPServiceRequest("/vehicle/insert", "POST", vehicle);
  
          if (postResponse === "OK") {
            // Show success alert
            Swal.fire({
              icon: "success",
              width: "20em",   
              title: "Saved successfully!",
              timer: 1500,
              showConfirmButton: false,
              draggable: true
            });
  
            // Refresh UI
            refreshVehicleTable();
            refreshForm();
            $("#offcanvasEmployeeForm").offcanvas("hide"); // hide form panel
          } else {
            // Show error alert on failure
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
      // Show form errors in alert if any
      Swal.fire({
        icon: "warning",
        width: "20em",   
        title: "Form has following errors",
        html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
        confirmButtonColor: "#3085d6"
      });
    }
  };
  

// Function to check for updates between the current and old employee objects
const checkFormUpdate = () => {
  let updates = "";
  if (vehicle != null && oldVehicle != null) {
   
    if (vehicle.type_id.name !== oldVehicle.type_id.name) {
      updates += "🔄💼 Vehicle Type has been changed!\n";
    }
    if (vehicle.number !== oldVehicle.number) {
      updates += "🔄🔢 Vehicle Number has been changed!\n";
    }
    if (vehicle.vehicle_status_id.name !== oldVehicle.vehicle_status_id.name) {
      updates += "🔄📡 Vehicle Status has been changed!\n";
    }
  }

  return updates;
};


// Create form update event function
const buttonVehicleUpdate = () => {
    // Step 1: Check for errors in the form before proceeding with updates
    let errors = checkFormError(); // Call checkFormError function to validate the form and return any errors
    if (errors === "") {
      // If there are no errors, proceed to check if there are any updates in the form
      let updates = checkFormUpdate(); // Call a function to check if any fields have been updated
      if (updates === "") {
        // If there are no updates, alert the user that there's nothing to update
        Swal.fire({
          title: "No Updates",
          text: "Nothing to update..",
          icon: "info",
          width: "20em",   
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        // If there are updates, ask for user confirmation before proceeding
        Swal.fire({
          title: "Are you sure you want to update the following changes?",
          html:  "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
          icon: "warning",
          width: "20em",   
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Update Vehicle"
        }).then((result) => {
          if (result.isConfirmed) {
            // If the user confirms, proceed with the update process
            let putResponse = getHTTPServiceRequest("/vehicle/update", "PUT", vehicle); // Real PUT request
            
            if (putResponse === "OK") {
              Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                width: "20em",   
                showConfirmButton: false,
                timer: 1500,
                draggable: true
              });
  
              refreshVehicleTable(); // Refresh the employee table to reflect the updated data
              refreshForm(); // Refresh the form to clear any inputs or reset the state
              $("#offcanvasVehicleForm").offcanvas("hide"); // hide offcanvasEmployeeForm after update button clicked
            } else {
              // If update fails, notify the user with formatted error message
              Swal.fire({
                title: "Failed to update!",
                html: "<pre>"+ putResponse + "</pre>",
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
      // If there are errors in the form, alert the user with the list of errors
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
  

// Function to clear the employee form after confirming with the user
const clearVehicleForm = () => {
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
        refreshForm();
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
 