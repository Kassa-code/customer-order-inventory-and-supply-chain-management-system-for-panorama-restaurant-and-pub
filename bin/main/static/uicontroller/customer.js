//Create browser load event
window.addEventListener("load", () => {
    refreshCustomerTable();
    refreshForm();
});

// Create refresh table area function
// Call refreshEmployeeTable() in browser,submit,update,delete functions
const refreshCustomerTable = () => {
    //=============================================================================================================

    // Fetch employee data using the getServiceRequest common function
  let customers = getServiceRequest('/customer/alldata');


  // Create colums array and objects for each column
  // string ===> string / date / number
  // function ===> object / array / boolean
  let propertyList = [
    { propertyName: "contactno", dataType: "string" },
    { propertyName: "name", dataType: "string" },
    
  ];

    // Call fillDataIntoTable(tableBodyId,dataList,properyList,employeeFormRefill,employeeDelete,employeeView)
    // and passs the parameters;
  fillDataIntoTable(tableCustomerBody, customers, propertyList, customerFormRefill, customerDelete, customerView);

  for (const index in customers) {
   
    tableCustomerBody.children[index].lastChild.children[0].children[1].children[0]         
      .children[1].classList.add("d-none"); 
      
    tableCustomerBody.children[index].lastChild.children[0].children[1].children[0]         
      .children[2].classList.add("d-none"); 
  }

  $("#tableCustomer").DataTable(); // identify table using jQuery
    //=============================================================================================================
};

// Create refresh form area function
const refreshForm = () => {
  customer = new Object(); // Define a global object for submit button function to assign property values and pass them after validation
  formCustomer.reset(); // Reset form inputs to initial values

  setDefault([
    textCustomerName,
    textMobile
  ]);

     // Hide the Update button by adding the Bootstrap class "d-none" (display: none)
     buttonUpdate.classList.add("d-none");

     // Show the Submit button by removing the "d-none" class (making it visible)
     buttonSubmit.classList.remove("d-none");

};

// Function to refill the employee form
const customerFormRefill = (ob, index) => {
  console.log("Edit", ob, index); // Logs the object and index for debugging


  textCustomerName.value = ob.name;
  textMobile.value = ob.contactno;

  customer = JSON.parse(JSON.stringify(ob));
  oldCustomer = JSON.parse(JSON.stringify(ob));

  // Show the Update button (for submitting changes)
  buttonUpdate.classList.remove("d-none");

  // Hide the Submit button (used for new entries)
  buttonSubmit.classList.add("d-none");

  $("#offcanvasCustomerForm").offcanvas("show");

};

// Define function to delete an employee record
const customerDelete = () => {}
  
// Define function for viewing/printing employee record
const customerView = () => {};


// Function to check form errors with icons
const checkFormError = () => {
  // Need to check all required elements
  let formInputErrors = "";
  
  if (customer.name == null) {
    formInputErrors += "❗👤 Please Enter a Valid Name...! \n";
  }
  if (customer.contactno == null) {
    formInputErrors += "❗📱 Please Enter Mobile Number...! \n";
  }
 
  return formInputErrors;
};


// Function to handle employee form submission
const buttonCustomerSubmit = () => {
  console.log(customer);
  
    // Step 1: Validate form for errors
    let errors = checkFormError();
  
    if (errors === "") {
      // No errors - show confirmation dialog with SweetAlert2
      Swal.fire({
        title: "Are you sure to add the following Customer?",
        html:
        "<div style='text-align:left; font-size:14px'>"+
          "👤 <b> Name:</b> " + customer.name + "<br>" +
          "📱 <b>Mobile Number:</b> " + customer.contactno +  
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
          let postResponse = getHTTPServiceRequest("/customer/insert", "POST", customer);
  
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
            refreshCustomerTable();
            refreshForm();
            $("#offcanvasCustomerForm").offcanvas("hide"); // hide form panel
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
  if (customer != null && oldCustomer != null) {
   
    if (customer.name != oldCustomer.name) {
      updates += "👤 Name is changed..! \n";
    }
    if (customer.contactno != oldCustomer.contactno) {
      updates += "📱 Mobile Number is changed..! \n";
    }
  }

  return updates;
};


// Create form update event function
const buttonCustomerUpdate = () => {
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
          confirmButtonText: "Yes, Update Customer"
        }).then((result) => {
          if (result.isConfirmed) {
            // If the user confirms, proceed with the update process
            let putResponse = getHTTPServiceRequest("/customer/update", "PUT", customer); // Real PUT request
            
            if (putResponse === "OK") {
              Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                width: "20em",   
                showConfirmButton: false,
                timer: 1500,
                draggable: true
              });
  
              refreshCustomerTable(); // Refresh the employee table to reflect the updated data
              refreshForm(); // Refresh the form to clear any inputs or reset the state
              $("#offcanvasCustomerForm").offcanvas("hide"); // hide offcanvasEmployeeForm after update button clicked
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
const clearCustomerForm = () => {
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
 