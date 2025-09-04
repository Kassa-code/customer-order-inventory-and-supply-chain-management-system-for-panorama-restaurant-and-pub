//Create browser load event
window.addEventListener("load", () => {
    refreshEmployeeTable();
    refreshForm();
});

// Create refresh table area function
// Call refreshEmployeeTable() in browser,submit,update,delete functions
const refreshEmployeeTable = () => {
    //=============================================================================================================

    // Fetch employee data using the getServiceRequest common function
    let employees = getServiceRequest('/employee/alldata');


    // Create colums array and objects for each column
    // string ===> string / date / number
    // function ===> object / array / boolean
    let propertyList = [
        { propertyName: "emp_photo", dataType: "image-array" },
        { propertyName: "fullname", dataType: "string" },
        { propertyName: "nic", dataType: "string" },
        { propertyName: "mobileno", dataType: "string" },
        { propertyName: "gender", dataType: "string" },

        { propertyName: getDesignation, dataType: "function", },
        { propertyName: getEmployeeStatus, dataType: "function", },
    ];

    // Call fillDataIntoTable(tableBodyId,dataList,properyList,employeeFormRefill,employeeDelete,employeeView)
    // and passs the parameters;
    fillDataIntoTable(tableEmployeeBody, employees, propertyList, employeeFormRefill, employeeDelete, employeeView);

   for (const index in employees) {
  // Check if the employee status is "Removed"
  if (employees[index].employeestatus_id.name == "Removed") {
    // Access the row corresponding to the current employee using the index
    // Then navigate through the DOM structure to find the specific button element
    // lastChild - last child node of the row (might be a text node; consider lastElementChild if needed)
    // children[0], children[1], etc. - traverse down the nested children until reaching the target button
    tableEmployeeBody.children[index]
      .lastChild           // last child of the row (usually the action cell)
      .children[0]         // first child inside the last cell
      .children[1]         // second child inside that
      .children[0]         // first child inside that
      .children[1]         // second child inside that (the button to hide)
      .classList.add("d-none"); // add Bootstrap class to hide this button
  }
}
    $("#tableEmployee").DataTable(); // identify table using jQuery
    //=============================================================================================================
};

// Create refresh form area function
const refreshForm = () => {
    employee = new Object(); // Define a global object for submit button function to assign property values and pass them after validation
    formEmployee.reset(); // Reset form inputs to initial values

    // Reset photo value to empty
    empPhotoInput.value= "";
    // set default image
    empPhotoPreview.src="/images/profile.png";

    setDefault([
        textFullName,
        textCallingName,
        textNIC,
        radioMale,
        radioFemale,
        dtDob,
        textEmail,
        selectCivilStatus,
        selectDesignation,
        selectEmpStatus,
        textMobile,
        textLand,
        textAddress,
        textNote
    ]);

    // Fetch all employee statuses from the backend API
    let employeeStatuses = getServiceRequest('employeestatus/alldata');

    // Fetch all designations from the backend API
    let designations = getServiceRequest('designation/alldata');



    // Populate the Designation dropdown with data fetched from the backend
    fillDataIntoSelect(
        selectDesignation, // The HTML <select> element for Designation
        "Please Select Designation", // Default placeholder option
        designations, // Data array containing available designations
        "name" // The key used to display values in the dropdown
    );

    // Populate the Employee Status dropdown with data fetched from the backend
    fillDataIntoSelect(
        selectEmpStatus, // The HTML <select> element for Employee Status
        "Please Select Employee Status", // Default placeholder option
        employeeStatuses, // Data array containing available employee statuses
        "name" // The key used to display values in the dropdown
    );

    // Disable the dob field
    dtDob.disabled = "";
    
    // Disable the radios
    radioMale.disabled = false;
    radioFemale.disabled = false;

     // Hide the Update button by adding the Bootstrap class "d-none" (display: none)
     buttonUpdate.classList.add("d-none");

     // Show the Submit button by removing the "d-none" class (making it visible)
     buttonSubmit.classList.remove("d-none");

};

// Define a function to get the designation name from the data object
const getDesignation = (dataOb) => {
    return dataOb.designation_id.name; // Returns the name of the designation
};

// Define a function to get the appropriate employee status icon based on their status
const getEmployeeStatus = (dataOb) => {
    // Check if the employee status is "Working"
    if (dataOb.employeestatus_id.name == "Working") {
        return (
            "<i class='fa-solid fa-user-tie fa-lg text-success'></i>" // Green icon for working employees
        );
    }

    // Check if the employee status is "Resigned"
    if (dataOb.employeestatus_id.name == "Resigned") {
        return (
            "<i class='fa-solid fa-user-tie fa-lg text-warning'></i>" // Yellow icon for resigned employees
        );
    }

    // Check if the employee status is "Removed"
    if (dataOb.employeestatus_id.name == "Removed") {
        return (
            "<i class='fa-solid fa-user-tie fa-lg text-danger'></i>" // Red icon for removed employees
        );
    }
};


// Function to refill the employee form
const employeeFormRefill = (ob, index) => {
    console.log("Edit", ob, index); // Logs the object and index for debugging
    // tableEmployeeBody.children[index].style.backgroundColor = "orange";

    // Assign values to text inputs
    textFullName.value = ob.fullname; // Set full name

    // Check if the employee photo data (base64) exists in the object
    if (ob.emp_photo != null) {
    // Decode the base64 image string and assign it to the image preview's source
    empPhotoPreview.src = atob(ob.emp_photo);
    } else {
    // If no photo is available, use the default profile image
    empPhotoPreview.src = "/images/profile.png";
  }

    textCallingName.value = ob.callingname; // Set calling name

    let fullNameParts = textFullName.value.split(" "); // Select calling name parts
    fullNameParts.forEach((element) => {
        let option = document.createElement("option"); // Create a new option element
        option.value = element; // Set the value of the option
        if (element.length > 2) {
            dlCallingName.appendChild(option); // Add the option to the dropdown list if element> 2
        }
    });

    textNIC.value = ob.nic; // Set NIC number

    // Set gender radio buttons based on the object's gender value
    if (ob.gender === "Male") {
        radioMale.checked = true;
        radioFemale.checked = false;
    } else {
        radioMale.checked = false;
        radioFemale.checked = true;
    }

    // Assign values to other input fields
    dtDob.value = ob.dob; // Set date of birth
    textEmail.value = ob.email; // Set email
    selectCivilStatus.value = ob.civilstatus.toLowerCase(); // Set civil status 
    // Using .toLowerCase() ensures case insensitivity, meaning the value stored in ob.civilstatus can be matched correctly with the <option> values in the <select> dropdown.
    // If ob.civilstatus is "Single" or "SINGLE", it won't match "single", so .toLowerCase() ensures "Single".toLowerCase() → "single".

    // Assign designation and employee status, ensuring values are strings
    selectDesignation.value = JSON.stringify(ob.designation_id);
    selectEmpStatus.value = JSON.stringify(ob.employeestatus_id);

    textMobile.value = ob.mobileno; // Set mobile number

    // Check if landline number exists, otherwise set to an empty string
    if (ob.landno === undefined || ob.landno === null) {
        textLand.value = "";
    } else {
        textLand.value = ob.landno;
    }
    // Set address
    textAddress.value = ob.address;

    // Check if note exists, otherwise set to an empty string
    if (ob.note === undefined || ob.note === null) {
        textNote.value = "";
    } else {
        textNote.value = ob.note;
    }

    // `checkFormUpdate` compares two objects (`oldEmployee` and `employee`) to detect any changes between them.
    // This function is typically used to determine if a form has been modified by comparing the original data (`oldEmployee`)
    // Create a deep copy of the object `ob` and assign it to `employee`
    employee = JSON.parse(JSON.stringify(ob));
    // This line creates a new object `employee` that is a deep copy of `ob`.
    // - `JSON.stringify(ob)` converts the object `ob` into a JSON string.
    // - `JSON.parse(...)` converts the JSON string back into a new JavaScript object.
    // This ensures that `employee` is a completely independent copy of `ob`, with no shared references.
    // Use case: `employee` can be modified without affecting the original `ob`.

    // Create another deep copy of the object `ob` and assign it to `oldEmployee`
    oldEmployee = JSON.parse(JSON.stringify(ob));
    // This line creates another new object `oldEmployee` that is also a deep copy of `ob`.
    // - The same process of `JSON.stringify` and `JSON.parse` is used to ensure `oldEmployee` is an independent copy.
    // - This is useful for preserving the original state of `ob` in `oldEmployee` while `employee` might be modified later.
    // Use case: `oldEmployee` serves as a snapshot of the original data for comparison or restoration purposes.

    //Open modal when refillng using jQuery
    // (# - id/tag ), (. - class )

    // Disable the dob field
    dtDob.disabled = "disabled";
    
    // Disable the radios
    radioMale.disabled = true;
    radioFemale.disabled = true;

    // Show the Update button (for submitting changes)
    buttonUpdate.classList.remove("d-none");

    // Hide the Submit button (used for new entries)
    buttonSubmit.classList.add("d-none");
    
    $("#offcanvasEmployeeForm").offcanvas("show");

};

// Define function to delete an employee record
const employeeDelete = (dataOb, index) => {
    // Show confirmation dialog using SweetAlert2 with detailed employee info
    Swal.fire({
      title: "Are you sure to delete the following Employee?",
      html:
        "<div style='text-align:left; font-size:14px'>"+
        "👤 <b>Full Name:</b> " + dataOb.fullname + "<br>" +
        "📛 <b>Calling Name:</b> " + dataOb.callingname + "<br>" +
        "🆔 <b>NIC:</b> " + dataOb.nic + "<br>" +
        "🚻 <b>Gender:</b> " + dataOb.gender + "<br>" +
        "🎂 <b>Date of Birth:</b> " + dataOb.dob + "<br>" +
        "📧 <b>Email:</b> " + dataOb.email + "<br>" +
        "❤️ <b>Civil Status:</b> " + dataOb.civilstatus + "<br>" +
        "💼 <b>Designation:</b> " + dataOb.designation_id.name + "<br>" +
        "📶 <b>Status:</b> " + dataOb.employeestatus_id.name + "<br>" +
        "📱 <b>Mobile No:</b> " + dataOb.mobileno + "<br>" +
        "🏠 <b>Address:</b> " + dataOb.address+
        "</div>",

      icon: "warning",
      showCancelButton: true,       // Show a cancel button for safety
      width: "20em",                // Set custom width for better layout
      confirmButtonColor: "#3085d6", // Blue confirm button
      cancelButtonColor: "#d33",     // Red cancel button
      confirmButtonText: "Yes, Delete Employee"       // Text on confirm button


    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirms, call DELETE HTTP service
        let deleteResponse = getHTTPServiceRequest("/employee/delete", "DELETE", dataOb);
  
        if (deleteResponse === "OK") {
          // Show success alert
          Swal.fire({
            icon: "success",
            width: "20em",   
            title: "Deleted!",
            text: "Employee deleted successfully.",
            timer: 1500,
            showConfirmButton: false
          });
  
          // Refresh table and form without reloading page
          refreshEmployeeTable();
          refreshForm();
  
          // Hide offcanvas employee view
          $("#offcanvasEmployeeView").offcanvas("hide");
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
  };
  


// Define function for viewing/printing employee record
const employeeView = (ob, index) => {
    console.log("View", ob, index); // Log the employee object and index for debugging

    // Assign employee details to respective table cells for display
    tdEmployeeFullName.innerText = ob.fullname; // Set full name
    tdEmployeeCallingName.innerText = ob.callingname; // Set calling name
    tdEmployeeNic.innerText = ob.nic; // Set NIC
    tdEmployeeGender.innerText = ob.gender; // Set gender
    tdEmployeeDob.innerText = ob.dob; // Set date of birth
    tdEmployeeEmail.innerText = ob.email; // Set email
    tdEmployeeCivilStatus.innerText = ob.civilstatus; // Set civil status
    tdEmployeeDesignation.innerText = ob.designation_id.name; // Set designation
    tdEmployeeEmpStatus.innerText = ob.employeestatus_id.name; // Set employee status
    tdEmployeeMobileno.innerText = ob.mobileno; // Set mobile number
    tdEmployeeLandno.innerText = ob.landno; // Set landline number
    tdEmployeeAddress.innerText = ob.address; // Set landline number
    $("#offcanvasEmployeeView").offcanvas("show"); // Open the employee details modal using jQuery
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
          ${tableEmployeeView.outerHTML}
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
     * `${tableEmployeeView.outerHTML}` is a template literal that dynamically embeds the full HTML content
     * of the `tableEmployeeView` element into a string.
     *
     * - `tableEmployeeView` is expected to be a reference to a DOM element, typically an HTML table (`<table>`).
     * - `outerHTML` is a property of DOM elements that returns the complete HTML representation of the element,
     *   including the element itself and all its child elements.
     *
     * This is useful for:
     * - Debugging: Logging the full HTML structure of the table to the console.
     * - Rendering: Dynamically generating or updating HTML content.
     * - Serialization: Passing the HTML content to another function or API.
     */
};

// Function to check form errors with icons
const checkFormError = () => {
  // Need to check all required elements
  let formInputErrors = "";
  if (employee.fullname == null) {
      formInputErrors += "❗👤 Please Enter a Valid Full Name...! \n";
  }
  if (employee.callingname == null) {
      formInputErrors += "❗📛 Please Select Calling Name...! \n";
  }
  if (employee.nic == null) {
      formInputErrors += "❗🆔 Please Enter a Valid NIC...! \n";
  }
  if (employee.gender == null) {
      formInputErrors += "❗🚻 Please Select Gender...! \n";
  }
  if (employee.dob == null) {
      formInputErrors += "❗🎂 Please Select Date of Birth...! \n";
  }
  if (employee.email == null) {
      formInputErrors += "❗📧 Please Enter Email...! \n";
  }
  if (employee.civilstatus == null) {
      formInputErrors += "❗❤️ Please Select Civil Status...! \n";
  }
  if (employee.designation_id == null) {
      formInputErrors += "❗💼 Please Select Designation...! \n";
  }
  if (employee.employeestatus_id == null) {
      formInputErrors += "❗📶 Please Select Employee Status...! \n";
  }
  if (employee.mobileno == null) {
      formInputErrors += "❗📱 Please Enter Mobile Number...! \n";
  }
  if (employee.address == null) {
      formInputErrors += "❗🏠 Please Enter Address...! \n";
  }

  return formInputErrors;
};


// Function to handle employee form submission
const buttonEmployeeSubmit = () => {
    console.log(employee);
  
    // Step 1: Validate form for errors
    let errors = checkFormError();
  
    if (errors === "") {
      // No errors - show confirmation dialog with SweetAlert2
      Swal.fire({
        title: "Are you sure to add the following Employee?",
        html:
        "<div style='text-align:left; font-size:14px'>"+
          "👤 <b>Full Name:</b> " + employee.fullname + "<br>" +
          "📛 <b>Calling Name:</b> " + employee.callingname + "<br>" +
          "🆔 <b>NIC:</b> " + employee.nic + "<br>" +
          "🚻 <b>Gender:</b> " + employee.gender + "<br>" +
          "🎂 <b>Date of Birth:</b> " + employee.dob + "<br>" +
          "📧 <b>Email:</b> " + employee.email + "<br>" +
          "❤️ <b>Civil Status:</b> " + employee.civilstatus + "<br>" +
          "💼 <b>Designation:</b> " + employee.designation_id.name + "<br>" +
          "📶 <b>Status:</b> " + employee.employeestatus_id.name + "<br>" +
          "📱 <b>Mobile Number:</b> " + employee.mobileno + "<br>" +
          "🏠 <b>Address:</b> " + employee.address+ 
          "</div>",
        icon: "warning",
        width: "20em",   
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Employee"
      }).then((result) => {
        if (result.isConfirmed) {
          // Call POST service to insert employee
          let postResponse = getHTTPServiceRequest("/employee/insert", "POST", employee);
  
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
            refreshEmployeeTable();
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
  if (employee != null && oldEmployee != null) {
    if (employee.fullname != oldEmployee.fullname) {
      updates += "👤 Full Name is changed..! \n";
    }
    if (employee.emp_photo != oldEmployee.emp_photo) {
      updates += "📷 Photo is changed..! \n";
    }    
    if (employee.callingname != oldEmployee.callingname) {
      updates += "📛 Calling Name is changed..! \n";
    }
    if (employee.nic != oldEmployee.nic) {
      updates += "🆔 NIC is changed..! \n";
    }
    if (employee.gender != oldEmployee.gender) {
      updates += "🚻 Gender is changed..! \n";
    }
    if (employee.dob != oldEmployee.dob) {
      updates += "🎂 Date of Birth is changed..! \n";
    }
    if (employee.email != oldEmployee.email) {
      updates += "📧 Email is changed..! \n";
    }
    if (employee.civilstatus != oldEmployee.civilstatus) {
      updates += "❤️ Civil status is changed..! \n";
    }
    if (employee.designation_id.name != oldEmployee.designation_id.name) {
      updates += "💼 Designation is changed..! \n";
    }
    if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
      updates += "📶 Employee Status is changed..! \n";
    }
    if (employee.mobileno != oldEmployee.mobileno) {
      updates += "📱 Mobile Number is changed..! \n";
    }
    if (employee.landno != oldEmployee.landno) {
      updates += "☎️ Land Number is changed..! \n";
    }
    if (employee.address != oldEmployee.address) {
      updates += "🏠 Address is changed..! \n";
    }
    if (employee.note != oldEmployee.note) {
      updates += "📝 Note is changed..! \n";
    }
  }

  return updates;
};


// Create form update event function
const buttonEmployeeUpdate = () => {
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
          confirmButtonText: "Yes, Update Employee"
        }).then((result) => {
          if (result.isConfirmed) {
            // If the user confirms, proceed with the update process
            let putResponse = getHTTPServiceRequest("/employee/update", "PUT", employee); // Real PUT request
            
            if (putResponse === "OK") {
              Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                width: "20em",   
                showConfirmButton: false,
                timer: 1500,
                draggable: true
              });
  
              refreshEmployeeTable(); // Refresh the employee table to reflect the updated data
              refreshForm(); // Refresh the form to clear any inputs or reset the state
              $("#offcanvasEmployeeForm").offcanvas("hide"); // hide offcanvasEmployeeForm after update button clicked
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
  
  function clearEmployeePhoto() {
    // Reset the file input
    const photoInput = document.getElementById("empPhotoInput");
    if (photoInput) {
        photoInput.value = "";
    }

    // Reset the photo preview to a default image
    const previewImage = document.getElementById("empPhotoPreview");
    if (previewImage) {
        previewImage.src = "/images/profile.png"; // Change path as needed
    }

     // Optional: Clear from JS object if you're binding data
     if (typeof employee !== "undefined") {
      employee.emp_photo = null;
  }

}


// Function to clear the employee form after confirming with the user
const clearEmployeeForm = () => {
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
  

//==================================================================================================================
//Custom Validation for employee form
//Validation for full name and generate calling name parts

// Add an event listener to the 'textFullName' input field that triggers on every keyup event
textFullName.addEventListener("keyup", () => {
    // Get the current value of the textFullName input field
    const fullNameValue = textFullName.value;

    // Check if the input field is not empty
    if (fullNameValue != "") {
        // Define a regular expression to validate the full name format
        // The pattern ensures:
        // - The first name starts with an uppercase letter followed by lowercase letters (1-20 characters)
        // - Followed by at least one space
        // - The last name also starts with an uppercase letter followed by lowercase letters (2-20 characters)
        if (
            new RegExp("^([A-Z][a-z]{1,20}[\\s])+([A-Z][a-z]{2,20})$").test(
                fullNameValue
            )
        ) {
            employee.fullname = fullNameValue; // assign full name value to employee object
            // If the full name is valid, set the input border to green
            textFullName.classList.remove("is-invalid");
            textFullName.classList.add("is-valid");
    
            // Set custom valid styles
            textFullName.style.border = "2px solid green";
            textFullName.style.backgroundColor = "#c6f6d5";
            
            // Generate the calling name based on the valid full name
            let fullNameParts = fullNameValue.split(" "); // Split the full name into parts by spaces
            dlCallingName.innerHTML = ""; // Clear any existing options in the dropdown

            // Set the calling name input field to the first word of the full name
            textCallingName.value = fullNameParts[0];
             // Color the auto selected element in callingname
             // Set Bootstrap 'valid' styles
            textCallingName.classList.remove("is-invalid");
            textCallingName.classList.add("is-valid");
    
            // Set custom valid styles
            textCallingName.style.border = "2px solid green";
            textCallingName.style.backgroundColor = "#c6f6d5";

            employee.callingname = textCallingName.value; // assign calling  name value to employee object

            // Loop through each part of the full name and add it as an option in the dropdown
            fullNameParts.forEach((element) => {
                let option = document.createElement("option"); // Create a new option element
                option.value = element; // Set the value of the option

                if (element.length > 2) {
                    dlCallingName.appendChild(option); // Add the option to the dropdown list if element> 2
                }
            });
        } else {
          // If the full name is invalid, set the input border to red
          // Set Bootstrap 'invalid' styles
          textFullName.classList.remove("is-valid");
          textFullName.classList.add("is-invalid");
    
          // Set custom invalid styles
          textFullName.style.border = "2px solid red";
          textFullName.style.backgroundColor = "#f8d7da";
          employee.fullname = null; // assign full name value to null if invalid
        }
    } else {
        // If the input field is empty, also set the border to red (invalid state)
        // Set Bootstrap 'invalid' styles
        textFullName.classList.remove("is-valid");
        textFullName.classList.add("is-invalid");
    
        // Set custom invalid styles
        textFullName.style.border = "2px solid red";
        textFullName.style.backgroundColor = "#f8d7da";
        employee.fullname = null; // assign full name value to null if invalid
    }
});

// Validation for calling name
const callingNameValidator = (callingNameElement) => {
    // Paa hs paameter in html and take as callingNameElement
    const callingNameValue = callingNameElement.value; // Get the value of the calling name input element
    const fullNameValue = textFullName.value; // Get the value of the full name input field
    let fullNameParts = fullNameValue.split(" "); // Split the full name into an array of individual parts (first name, last name, etc.)
    if (callingNameValue != "") {
        // Check if the calling name is not empty
        // Check if the calling name exists in the full name
        // .map() creates a new array where each element of fullNameParts is processed by the function provided.
        // In this case, we're returning the same value (fullNamePart => fullNamePart), but we could apply some transformation.
        let extIndex = fullNameParts
            .map((fullNamePart) => fullNamePart)
            .indexOf(callingNameValue); // Find the index of calling name in the full name parts array

        if (extIndex != -1) {
            // If the calling name exists in the full name parts
            // Set the border to green (valid)
            callingNameElement.classList.remove("is-invalid");
            callingNameElement.classList.add("is-valid");
        
            // Set custom valid styles
            callingNameElement.style.border = "2px solid green";
            callingNameElement.style.backgroundColor = "#c6f6d5";
            employee.callingname = textCallingName.value; // assign calling  name value to employee object
        } else {
            // If the calling name does not match any part of the full name
            // Set the border to red (invalid)
            callingNameElement.classList.remove("is-valid");
            callingNameElement.classList.add("is-invalid");
    
            // Set custom invalid styles
            callingNameElement.style.border = "2px solid red";
            callingNameElement.style.backgroundColor = "#f8d7da";
            employee.callingname = null; // assign calling name value to null if invalid
        }
    } else {

        // Set the border to red (invalid)
        callingNameElement.classList.remove("is-valid");
        callingNameElement.classList.add("is-invalid");
    
        // Set custom invalid styles
        callingNameElement.style.border = "2px solid red";
        callingNameElement.style.backgroundColor = "#f8d7da";
        employee.callingname = null; // assign calling name value to null if invalid
    }
}

// NIC validation function, triggered when the NIC input field is interacted with
const nicValidator = (nicElement) => {
  // Get the entered NIC value from the input element
  const nicValue = nicElement.value;

  // Proceed only if NIC input is not empty
  if (nicValue != "") {

      // Validate the NIC using a regular expression
      // Pattern explanation:
      // - Old format: 9 digits starting with 9-5 + a letter (V/v or X/x) → e.g., 912345678V
      // - New format: 12 digit number → e.g., 199912345678
      if (new RegExp("^(([98765][0-9]{8}[VvXx])|([0-9]{12}))$").test(nicValue)) {

          // If format is valid, apply Bootstrap "valid" classes and green styling
          nicElement.classList.remove("is-invalid"); // Remove error class
          nicElement.classList.add("is-valid");      // Add success class

          // Visual feedback: green border and light green background
          nicElement.style.border = "2px solid green";
          nicElement.style.backgroundColor = "#c6f6d5";

          // Save the valid NIC to the employee object for backend use
          employee.nic = nicValue;

          let birthYear, birthDate;

          // Determine birth year and day-of-year based on NIC format
          if (nicValue.length == 10) {
              // Old format: first 2 digits are the year (e.g., "91"), next 3 digits are day-of-year (e.g., "123")
              birthYear = "19" + nicValue.substring(0, 2);  // e.g., "1991"
              birthDate = nicValue.substring(2, 5);         // e.g., "123"
          } else {
              // New format: first 4 digits are the year (e.g., "2001"), next 3 digits are day-of-year
              birthYear = nicValue.substring(0, 4);         // e.g., "2001"
              birthDate = nicValue.substring(4, 7);         // e.g., "123"
          }

          // Output extracted year and day for debugging purposes
          console.log(birthYear, birthDate);

          // NICs use a special encoding for gender:
          // - If the day-of-year is greater than 500, it's a female
          // - Males are below 500
          if (parseInt(birthDate) > 500) {
              console.log("Female");                      // Log detected gender
              employee.gender = "Female";                 // Save gender to employee object
              birthDate = parseInt(birthDate) - 500;      // Adjust day-of-year to actual value
              radioFemale.checked = true;                 // Mark female radio button
          } else {
              console.log("Male");                        // Log detected gender
              employee.gender = "Male";                   // Save gender
              radioMale.checked = true;                   // Mark male radio button
          }

          // Prevent user from manually changing the auto-detected gender
          radioMale.disabled = true;
          radioFemale.disabled = true;

          // Create a Date object from the birth year and set date to Jan 1
          let birthDateOb = new Date(birthYear + "-01-01");

          // Then add the actual day offset (from NIC) to get the true birthdate
          birthDateOb.setDate(parseInt(birthDate));

          // Leap year correction:
          // If it's not a leap year AND date index > 60 (i.e., after Feb 29), shift 1 day back
          // This fixes cases where non-leap years cause day-shift errors
          if (parseFloat(birthYear) % 4 != 0 && parseInt(birthDate) > 60) {
              birthDateOb.setDate(birthDateOb.getDate() - 1);
          }

          // Extract month and day from final birthDate object
          let month = birthDateOb.getMonth() + 1; // getMonth() is 0-based
          let date = birthDateOb.getDate();

          // Pad month and date with a leading 0 if needed (e.g., 3 → "03")
          if (month < 10) {
              month = "0" + month;
          }
          if (date < 10) {
              date = "0" + date;
          }

          // Format final date as YYYY-MM-DD and set to the input field
          dtDob.value = birthYear + "-" + month + "-" + date;

          // Store date in employee object
          employee.dob = dtDob.value;

          // Apply success style to the date input
          dtDob.classList.remove("is-invalid");
          dtDob.classList.add("is-valid");

          // Disable editing and style it with a green border and background
          dtDob.disabled = "disabled";
          dtDob.style.border = "2px solid green";
          dtDob.style.backgroundColor = "#c6f6d5";


          // Calculate age from the extracted birth date
          const today = new Date(); // Get today's date
          const ageDiff = today.getFullYear() - birthDateOb.getFullYear(); // Calculate difference in years

          // Determine if the birthday has already occurred this year
          const hasBirthdayPassed = 
              today.getMonth() > birthDateOb.getMonth() || 
              (today.getMonth() === birthDateOb.getMonth() && today.getDate() >= birthDateOb.getDate());

          // Final age value: if birthday has passed, use ageDiff; otherwise subtract 1
          const age = hasBirthdayPassed ? ageDiff : ageDiff - 1;

          console.log("Age:", age); // Output age to console for debugging

          // Validate if the calculated age is within the allowed working range (18 to 55)
          if (age < 18 || age > 55) {
              // Show an alert using SweetAlert2 if the person is underage or overage
              Swal.fire({
                  icon: "warning", // Display a yellow warning icon
                  width: "20em", 
                  title: "⚠️ Age Not Eligible", // Alert title with visual emoji for emphasis
                  text: "Employee must be between 18 and 55 years old to work.", // Message explaining the          condition
                  confirmButtonText: "OK" // Button text to acknowledge the alert
              });

              
              // Reset employee object values as the NIC is invalid due to age
              nicElement.value = "";
              nicElement.classList.remove("is-valid", "is-invalid");
              nicElement.removeAttribute("style"); // Removes all inline styles at once

              radioMale.checked = false;
              radioFemale.checked = false;
              radioMale.disabled = false;
              radioFemale.disabled = false;

             // Clear and reset the date of birth field completely
              dtDob.value = ""; // Clear the value
              dtDob.classList.remove("is-valid", "is-invalid"); // Remove Bootstrap validation classes
              dtDob.disabled = false; // Re-enable the field if it was disabled
              // Reset all inline styles (not just border)
              dtDob.removeAttribute("style"); // Removes all inline styles at once

          }



      } else {
          // If NIC format is invalid

          // Apply error classes and styling
          nicElement.classList.remove("is-valid");
          nicElement.classList.add("is-invalid");

          nicElement.style.border = "2px solid red";
          nicElement.style.backgroundColor = "#f8d7da";

          // Clear NIC in employee object
          employee.nic = null;
      }

  } else {
      // If NIC field is empty

      // Apply error classes and styles
      nicElement.classList.remove("is-valid");
      nicElement.classList.add("is-invalid");

      nicElement.style.border = "2px solid red";
      nicElement.style.backgroundColor = "#f8d7da";

      // Clear NIC in employee object
      employee.nic = null;
  }
}


//==================================================================================================================