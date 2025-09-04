//Create browser load event
window.addEventListener("load", () => {
    refreshDeliveryTable();
    refreshForm();
});

// Create refresh table area function
// Call refreshEmployeeTable() in browser,submit,update,delete functions
const refreshDeliveryTable = () => {
    //=============================================================================================================

    // Fetch employee data using the getServiceRequest common function
  let deliveries = getServiceRequest('/delivery/alldata');


  // Create colums array and objects for each column
  // string ===> string / date / number
  // function ===> object / array / boolean
  let propertyList = [
    { propertyName: "code", dataType: "string" },
    { propertyName: getOrderCode, dataType: "function", },
    { propertyName: getEmployee, dataType: "function", },
    { propertyName: getVehicle, dataType: "function", },
    { propertyName: getCustomer, dataType: "function", },
    { propertyName: getContactNo, dataType: "function", },
    { propertyName: getAddress, dataType: "function", },
    { propertyName: getToalAmount, dataType: "function", },
    { propertyName: getStatus, dataType: "function", },
  ];

    // Call fillDataIntoTable(tableBodyId,dataList,properyList,employeeFormRefill,employeeDelete,employeeView)
    // and passs the parameters;
  fillDataIntoReportTable(tableDeliveryBody, deliveries, propertyList);
  $("#tableDelivery").DataTable(); // identify table using jQuery
    
};

// Create refresh form area function
const refreshForm = () => {
  delivery = new Object(); // Define a global object for submit button function to assign property values and pass them after validation
  formDelivery.reset(); // Reset form inputs to initial values

  setDefault([
    selectOrder,
    selectEmployee,
    selectVehicle,
    selectStatus
  ]);

    // Fetch all employee statuses from the backend API
  let orders = getServiceRequest('/order/bystatusreadyandotdelivery');

  let employees = getServiceRequest('/employee/avaibalerider');

  let vehicles = getServiceRequest('/vehicle/activelist');

  let statuses = getServiceRequest('deliverystatus/alldata');


    fillDataIntoSelect(
      selectOrder, // The HTML <select> element for Designation
        "Please Select Order", // Default placeholder option
      orders, // Data array containing available designations
        "order_code" // The key used to display values in the dropdown
    );

   
    fillDataIntoSelect(
      selectEmployee, // The HTML <select> element for Employee Status
        "Please Select Employee", // Default placeholder option
      employees, // Data array containing available employee statuses
        "fullname" // The key used to display values in the dropdown
    );
    fillDataIntoSelect(
      selectVehicle, // The HTML <select> element for Employee Status
        "Please Select Vehicle", // Default placeholder option
      vehicles, // Data array containing available employee statuses
        "number" // The key used to display values in the dropdown
    );
    fillDataIntoSelect(
      selectStatus, // The HTML <select> element for Employee Status
        "Please Select Status", // Default placeholder option
      statuses, // Data array containing available employee statuses
        "name" // The key used to display values in the dropdown
    );

  selectStatus.value = JSON.stringify(statuses[1]);
  delivery.deliverystatus_id = statuses[1];

  // Highlight valid selection
  selectStatus.classList.remove("is-invalid");
  selectStatus.classList.add("is-valid");
  selectStatus.style.border = "2px solid green";
  selectStatus.style.backgroundColor = "#c6f6d5";

     // Hide the Update button by adding the Bootstrap class "d-none" (display: none)
     buttonUpdate.classList.add("d-none");

     // Show the Submit button by removing the "d-none" class (making it visible)
     buttonSubmit.classList.remove("d-none");

};

// Define a function to get the designation name from the data object
const getOrderCode = (dataOb) => {
  return dataOb.order_process_id.order_code; // Returns the name of the designation
};

const getEmployee = (dataOb) => {
  return dataOb.employee_id.fullname; // Returns the name of the designation
};

const getVehicle = (dataOb) => {
  return dataOb.vehicle_id.number; // Returns the name of the designation
};
const getCustomer = (dataOb) => {
  return dataOb.order_process_id.customer_id.name; // Returns the name of the designation
};
const getContactNo = (dataOb) => {
  return dataOb.order_process_id.customer_id.contactno; // Returns the name of the designation
};
const getAddress = (dataOb) => {
  return dataOb.order_process_id.delivery_address; // Returns the name of the designation
};
const getToalAmount = (dataOb) => {
  return dataOb.order_process_id.net_charge; // Returns the name of the designation
};

// Define a function to get the appropriate employee status icon based on their status
const getStatus = (dataOb) => {
    
  if (dataOb.deliverystatus_id.name == "New") {
        return (
            "<i class='fa-solid fa-motorcycle fa-lg text-warning'></i>" // Green icon for working employees
        );
    }
  if (dataOb.deliverystatus_id.name == "Delivered") {
        return (
            "<i class='fa-solid fa-motorcycle fa-lg text-success'></i>" // Green icon for working employees
        );
    }

    // Check if the employee status is "Removed"
  if (dataOb.deliverystatus_id.name == "Completed") {
        return (
            "<i class='fa-solid fa-motorcycle fa-lg text-primary'></i>" // Red icon for removed employees
        );
    }
};

// Define function for viewing/printing employee record
const vehicleView = (ob, index) => {
    console.log("View", ob, index); // Log the employee object and index for debugging

  tdCode.innerText = ob.code; 
  tdOrder.innerText = ob.order_process_id.order_code; 
  tdEmployee.innerText = ob.employee_id.fullnamename; 
  tdVehicle.innerText = ob.vehicle_id.number; 
  tdStatus.innerText = ob.deliverystatus_id.name; 

  $("#offcanvasDeliveryView").offcanvas("show"); 
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
          ${tableDeliveryView.outerHTML}
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
  
  if (delivery.order_process_id == null) {
    formInputErrors += "❗🧾 Please Select Order!\n"; // 🧾 = receipt/order
  }
  if (delivery.employee_id == null) {
    formInputErrors += "❗👤 Please Select Employee!\n"; // 👤 = person/employee
  }
  if (delivery.vehicle_id == null) {
    formInputErrors += "❗🚗 Please Select Vehicle!\n"; // 🚗 = vehicle
  }
  if (delivery.deliverystatus_id == null) {
    formInputErrors += "❗📦 Please Select Status!\n"; // 📦 = delivery status
  }


  return formInputErrors;
};


// Function to handle employee form submission
const buttonDeliverySubmit = () => {
    console.log(delivery);
  
    // Step 1: Validate form for errors
    let errors = checkFormError();
  
    if (errors === "") {
      // No errors - show confirmation dialog with SweetAlert2
      Swal.fire({
        title: "Are you sure to add the following Delivery?",
        html:
        "<div style='text-align:left; font-size:14px'>"+
          "🧾 <b>Order :</b> " + delivery.order_process_id.order_code + "<br>" +
          "👤 <b>Employee :</b> " + delivery.employee_id.fullname + "<br>" +
          "🚗 <b>Vehicle No:</b> " + delivery.vehicle_id.number + "<br>" +
          "📦 <b>Status:</b> " + delivery.deliverystatus_id.name +
          "</div>",
        icon: "warning",
        width: "20em",   
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Delivery"
      }).then((result) => {
        if (result.isConfirmed) {
          // Call POST service to insert employee
          let postResponse = getHTTPServiceRequest("/delivery/insert", "POST", delivery);
  
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
            refreshDeliveryTable();
            refreshForm();
            $("#offcanvasDeliveryForm").offcanvas("hide"); // hide form panel
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
  

// Function to clear the employee form after confirming with the user
const clearDeliveryForm = () => {
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
 