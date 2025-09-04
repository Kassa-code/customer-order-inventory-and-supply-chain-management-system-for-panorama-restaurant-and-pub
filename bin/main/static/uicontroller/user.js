// Create browser load event
window.addEventListener("load", () => {
    refreshUserTable(); // Call table reload function
    refreshUserForm(); // Call form reload function
});

// Function to load user table data from backend
const refreshUserTable = () => {
    const users = getServiceRequest("/user/alldata"); // Call common getServiceRequest function and backend service to get all user data

    // Create colums array and objects for each column
    // string ===> string / date / number
    // function ===> object / array / boolean
    let propertyList = [
        { propertyName: getEmployee, dataType: "function" }, // Show employee object by custom function
        { propertyName: "username", dataType: "string" }, // Show string field 'username'
        { propertyName: "email", dataType: "string" }, // Show string field 'email'
        { propertyName: getRoles, dataType: "function" }, // Show roles using custom function
        { propertyName: getUserStatus, dataType: "function" }, // Show user status using custom function
    ];

    // Call fillDataIntoTable(tableBodyId,dataList,properyList,userFormRefill,userDelete,userView) and passs the parameters;
    fillDataIntoTable(
        tableBodyUser, // ID or reference of table body element
        users, // List of user objects retrieved from backend
        propertyList, // List of columns and data mapping
        userFormRefill, // Function to refill user data to form
        userDelete, // Function to handle user deletion
        userView // Function to handle user view details
    );

    $("#tableUser").DataTable(); // identify table using jQuery and apply DataTables plugin
};

// Custom Function to get employee ID from the user object
const getEmployee = (ob) => {
    // If employee_id is not null, return it with fullname
    // Otherwise, return a dash ("-") as a placeholder
    if (ob.employee_id != null) {
        return ob.employee_id.fullname;
    } else {
        return "-";
    }
};

// Custom function to get role list or names from user object
const getRoles = (ob) => {
    // Initialize an empty string to store role names
    let roles = "";

    // Roles come as a list, so we need to iterate through the array
    ob.roles.forEach((role, index) => {
        // Check if the current role is the last one in the array
        if (ob.roles.length - 1 == index) {
            // If it's the last role, just append the role name (no comma)
            roles += role.name;
        } else {
            // If it's not the last, append the role name followed by a comma and space
            roles += role.name + ", ";
        }
    });

    // Return the formatted list of role names as a single string
    return roles;
};

// Custom function to get user status icon only from user object
const getUserStatus = (ob) => {
    // If status is true, return green check icon
    if (ob.status) {
        return "<i class='fa-solid fa-user-tie fa-lg text-success'></i>"; // Active (green icon)
    }
    // Otherwise, return red cross icon
    else {
        return "<i class='fa-solid fa-user-tie fa-lg text-danger'></i>"; // Not-Active (red icon)
    }
};

// Function to refill form fields when editing a user
const userFormRefill = (ob) => {

    // Parse and stringify the passed object to clone it properly
    user = JSON.parse(JSON.stringify(ob));
    oldUser = JSON.parse(JSON.stringify(ob));

    // Fetch all employee data using the getServiceRequest function
    // The response is expected to be an array of employees
    let employees = getServiceRequest("/employee/alldata");

    // Populate the select dropdown for employees with the fetched data
    fillDataIntoSelect(selectEmployee, "Select Employee", employees, "fullname");

    // Disable employee selection since user is already assigned
    selectEmployee.disabled = true;

    // Set the selected employee based on user data
    selectEmployee.value = JSON.stringify(user.employee_id);

    // Handle user account status and UI label
    if (user.status) {
        checkboxUserStatus.checked = "checked"; // Mark account as active
        labelUserStatus.innerText = "User Account is Active"; // Update label
    } else {
        checkboxUserStatus.checked = ""; // Mark account as inactive
        labelUserStatus.innerText = "User Account is In-Active"; // Update label
    }

    // Populate text fields with user data
    textUserName.value = user.username;
    textPassword.disabled = true; // Disable password fields during edit
    textReTypePassword.disabled = true;
    textEmail.value = user.email;

    // Set the note field if it exists, else leave it empty
    if (user.note == null) {
        textNote.value = "";
    } else {
        textNote.value = user.note;
    }

    // Fetch all role data using the getServiceRequest function
    let roles = getServiceRequest("/role/listwithoutadmin");

    // Select the div element where role checkboxes will be appended
    let divRole = document.querySelector("#chkBoxRole");

    // Clear any existing content in the div before adding new role checkboxes
    divRole.innerHTML = "";

    // Iterate over the fetched roles array to create and display checkboxes for each role
    roles.forEach((role, index) => {

        // Create a div container for each role checkbox
        let div = document.createElement("div");

        // Set classes to style the div as form-check and make it inline
        div.className = "form-check form-check-inline mb-2";

        // Optionally set a minimum width for proper spacing
        div.style.minWidth = "160px";

        // Append the div container to the parent divRole element
        divRole.appendChild(div);

        // Create a checkbox input element
        let inputCheck = document.createElement("input");

        // Set the input type and styling class
        inputCheck.type = "checkbox";
        inputCheck.className = "form-check-input";

        // Pre-check the checkbox if the user already has this role
        let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
        if (extIndex != -1) {
            inputCheck.checked = true;
        }

        // Add an event listener to handle checkbox change event
        inputCheck.onclick = () => {
            console.log(inputCheck); // Log checkbox input to console when clicked

            if (inputCheck.checked == true) {
                // Add role to user's roles array if checkbox is checked
                user.roles.push(role);
            } else {
                // Remove role from user's roles array if checkbox is unchecked
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1); // Remove the role if it exists
                }
            }
        }

        // Append the checkbox input element to the div container
        div.appendChild(inputCheck);

        // Create a label for the checkbox
        let label = document.createElement("label");

        // Set styling class for the label
        label.className = "form-check-label fw-bold";

        // Set the label text to role name
        label.innerText = role.name;

        // Append the label to the div container
        div.appendChild(label);
    });

    // Show the Update button by removing the "d-none" class (making it visible)
    buttonUpdate.classList.remove("d-none");
    // Hide the Submit button by adding the "d-none" class (hiding it)
    buttonSubmit.classList.add("d-none");

    $("#offcanvasUserForm").offcanvas("show");
};


// Define function to delete a user entry
const userDelete = (dataOb) => {
    // Show confirmation dialog using SweetAlert2 with detailed user info
    Swal.fire({
      title: "Are you sure to delete the following User?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "👤 <b>Employee:</b> " + dataOb.employee_id.fullname + "<br>" +
        "🧑‍💻 <b>Username:</b> " + dataOb.username + "<br>" +
        "📧 <b>Email:</b> " + dataOb.email + "<br>" +
        "🛡️ <b>Roles:</b> " + getRoles(dataOb) +
        "</div>",
  
      icon: "warning",
      showCancelButton: true,
      width: "20em",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete User"
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the DELETE HTTP service to remove the user record
        let deleteResponse = getHTTPServiceRequest("/user/delete", "DELETE", dataOb);
  
        if (deleteResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Deleted!",
            text: "User deleted successfully.",
            timer: 1500,
            showConfirmButton: false
          });
  
          // Refresh the user table
          refreshUserTable();
          refreshForm(); // Optional: clear or reset the user form if applicable
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
  

// Function to view user details in a popup or separate section
const userView = (ob, index) => {
    console.log("View", ob, index); // Log the user object and index for debugging purposes

    // Display the employee's name in the designated table cell
    tdEmployeeName.innerText = ob.employee_id.fullname;

    // Display the username in the designated table cell
    tdUserName.innerText = ob.username;

    // Display the user's email in the designated table cell
    tdUserEmail.innerText = ob.email;

    // Display the user's roles in the designated table cell
    tdUserRole.innerText = getRoles(ob);

    // Display the user's note in the designated table cell
    tdUserNote.innerText = ob.note;

    // Assign the user's status to the status field
    tdUserStatus.innerText = ob.status;

    // Open the user view offcanvas (side panel) using jQuery
    $("#offcanvasUerView").offcanvas("show");
};


// Function to handle the print button functionality
const buttonPrintRow = () => {
    // Open a new blank browser window
    let newWindow = window.open();

    // Create the HTML structure for the print view
    let printView = `<html>
      <head>
        <title>Print Employee</title>
        <link rel="stylesheet" href="../../Resources/bootstrap-5.2.3/css/bootstrap.min.css">
        <style>
          /* Basic page styling */
          body {
            font-family: Arial, sans-serif;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color:#efeeff;
            margin: 0;
          }
          /* Content container styling */
          .content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
          }
          /* Table cell padding */
          .table th, .table td {
            padding: 6px 10px;
          }
          /* Table header styling */
          .table th {
            text-align: left;
            font-weight: bold;
          }
          /* Heading styling */
          h2 {
            text-align: center;
            margin-bottom: 15px;
          }
      </style>
      </head>
      <body>
        <div class="content">
          ${tableUserView.outerHTML} <!-- Insert the user view table into the print page -->
        </div>
      </body>
    </html>`;

    // Write the HTML content to the new window
    newWindow.document.write(printView);

    // Wait for 1.5 seconds to ensure content is fully loaded before printing
    setTimeout(() => {
        newWindow.stop(); // Stop further page loading
        newWindow.print(); // Open the browser's print dialog
        newWindow.close(); // Close the new window after printing
    }, 1500);
};



//======================================Form Function===========================================================
// Function to refresh and populate the user form with data
const refreshUserForm = () => {

    formUser.reset(); // Reset the form to clear any existing form data

    // Create a new user object to store the form data
    user = new Object(); // Initialize a new object to represent the user

    // Initialize an empty array to store roles assigned to the user
    user.roles = new Array(); // This array will hold the roles for the user

    // Check if the oldUser object is null
    oldUser = null; // This condition checks if oldUser is null

    // Fetch all employee data using the getServiceRequest function
    // The response is expected to be an array of employees without user accounts
    let employees = getServiceRequest("/employee/listuserswithoutaccount");

    // Populate the select dropdown for employees with the fetched data
    fillDataIntoSelect(selectEmployee, "Select Employee", employees, "fullname");

    // Set the user account status checkbox as checked (marking the account as active)
    checkboxUserStatus.checked = "checked";

    // Set the label text to indicate the user account is active
    labelUserStatus.innerText = "User Account is Active";

    // Set the user's status to true (active) in the user object
    user.status = true;

    // Fetch all role data using the getServiceRequest function
    let roles = getServiceRequest("/role/listwithoutadmin");

    // Select the div element where the role checkboxes will be appended
    let divRole = document.querySelector("#chkBoxRole");

    // Clear any existing content in the div before adding the new role checkboxes
    divRole.innerHTML = "";

    // Iterate over the fetched roles array to create and display checkboxes for each role
    roles.forEach((role, index) => {

        // Create a div container for each role checkbox
        let div = document.createElement("div");

        // Set classes to style the div as a form-check and make it inline with a margin-bottom
        div.className = "form-check form-check-inline mb-2";

        // Optionally set a minimum width for the checkbox container for proper spacing
        div.style.minWidth = "160px";

        // Append the div container to the parent divRole element
        divRole.appendChild(div);

        // Create a checkbox input element
        let inputCheck = document.createElement("input");

        // Set the input type to checkbox and add a form-check-input class for styling
        inputCheck.type = "checkbox";
        inputCheck.className = "form-check-input";

        // Add an event listener to handle the checkbox change event
        inputCheck.onclick = () => {

            console.log(inputCheck); // Log the checkbox input to the console when clicked

            // Check the checkbox status
            if (inputCheck.checked == true) {
                // Add the role to the user's roles array if the checkbox is checked
                user.roles.push(role);
            } else {
                // Remove the role from the user's roles array if the checkbox is unchecked
                let extIndex = user.roles.map(userrole => userrole.name).indexOf(role.name);
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1); // Remove the role if it exists
                }
            }
        }

        // Append the checkbox input element to the div container
        div.appendChild(inputCheck);

        // Create a label for the checkbox
        let label = document.createElement("label");

        // Set classes to style the label with bold text for better visibility
        label.className = "form-check-label fw-bold";

        // Set the label text to the role's name
        label.innerText = role.name;

        // Append the label to the div container
        div.appendChild(label);
    });

    // Enable the employee selection and password fields (in case they were disabled)
    selectEmployee.disabled = false;
    textPassword.disabled = false;
    textReTypePassword.disabled = false;

    // Set the default values in the form inputs using a common function
    setDefault([selectEmployee, textUserName, textPassword, textReTypePassword, textEmail, textNote]);

    // Hide the Update button by adding the "d-none" class (d-none = display: none)
    buttonUpdate.classList.add("d-none");

    // Show the Submit button by removing the "d-none" class
    buttonSubmit.classList.remove("d-none");

};




// Function to validate user form fields and return any input errors
const checkUserFormError = () => {
    let formInputErrors = ""; // Initialize error message string
  
    if (user.username == null) {
      formInputErrors += "❗🧑‍💻 Please Enter a Valid User Name...! \n";
    }
  
    if (user.password == null) {
      formInputErrors += "❗🔐 Please Enter a Valid Password...! \n";
    }
  
    if (oldUser == null) {
      if (textReTypePassword.value == "") {
        formInputErrors += "❗🔁 Please Enter Retype Password...! \n";
      }
    }
  
    if (user.email == null) {
      formInputErrors += "❗📧 Please Enter Email...! \n";
    }
  
    if (user.roles.length === 0) {
      formInputErrors += "❗🛡️ Please Select At Least One Role...! \n";
    }
  
    return formInputErrors;
  };
  


// Function triggered when the user clicks the submit button
const buttonUserSubmit = () => {
    console.log(user);
  
    let errors = checkUserFormError();
  
    if (errors === "") {
      Swal.fire({
        title: "Are you sure to add following User Details?",
        html:
          "<div style='text-align:left; font-size:14px'>" +
          "👤 <b>Employee:</b> " + user.employee_id.fullname + "<br>" +
          "👥 <b>User Name:</b> " + user.username + "<br>" +
          "📧 <b>User Email:</b> " + user.email + "<br>" +
          "🔐 <b>User Role:</b> " + getRoles(user) +
          "</div>",
        icon: "warning",
        width: "20em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add User"
      }).then((result) => {
        if (result.isConfirmed) {
          let postResponse = getHTTPServiceRequest("/user/insert", "POST", user);
  
          if (postResponse === "OK") {
            Swal.fire({
              icon: "success",
              width: "20em",
              title: "Saved successfully!",
              timer: 1500,
              showConfirmButton: false,
              draggable: true
            });
  
            refreshUserTable();
            refreshUserForm();
            $("#offcanvasUserForm").offcanvas("hide");
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
  

// Function to check if any fields in the user form have been updated
const checkUserFormUpdate = () => {
  let updates = ""; // Initialize an empty string to collect update messages

  // Proceed only if both current user and old user data are available
  if (user != null && oldUser != null) {

      // Check if the username has been changed
      if (user.username != oldUser.username) {
          updates += "👤 User Name is changed..! \n";
      }

      // Check if the email has been changed
      if (user.email != oldUser.email) {
          updates += "📧 Email is changed..! \n";
      }

      // Check if the number of assigned roles has changed
      if (user.roles.length != oldUser.roles.length) {
          updates += "🔑 Roles are changed..! \n";
      } else {
          // If number of roles is same, check if the actual role names are different
          let rolesChanged = false;

          // Loop through each role in the new user roles
          user.roles.forEach(role => {
              // Check if the role exists in old roles
              const exists = oldUser.roles.some(oldRole => oldRole.name === role.name);

              // If the role does not exist, mark as changed
              if (!exists) {
                  rolesChanged = true;
              }
          });

          // If roles have changed, update the message
          if (rolesChanged) {
              updates += "🔑 Roles are changed..! \n";
          }
      }

      // Check if the note field has been changed
      if (user.note != oldUser.note) {
          updates += "📝 Note is changed..! \n";
      }

      // Check if the account status has been changed
      if (user.status != oldUser.status) {
          updates += "⚙️ Status is changed..! \n";
      }
  }

  // Return the collected update messages
  return updates;
}


// Function to handle updating a user when the Update button is clicked
const buttonUserUpdate = () => {
  // Step 1: Validate the form for errors
  let errors = checkUserFormError();

  if (errors === "") {
    // Step 2: Check if there are any updates
    let updates = checkUserFormUpdate();

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
        confirmButtonText: "Yes, Update User"
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with update request
          let putResponse = getHTTPServiceRequest("/user/update", "PUT", user);

          if (putResponse === "OK") {
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500,
              draggable: true
            });

            refreshUserTable();
            refreshUserForm();
            $("#offcanvasUserForm").offcanvas("hide");
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




// Function to validate if the password and re-typed password match

const passwordValidator = () => {
    // Get the values from both input fields and trim whitespace
    // This helps prevent mismatches due to accidental spaces before or after the text
    const password = textPassword.value.trim();
    const retypePassword = textReTypePassword.value.trim();

    // Check if both password fields are not empty and match exactly
    if (password !== "" && retypePassword !== "" && password === retypePassword) {
        // If they match, assign the password to the user object
        user.password = password;

        // Set a green border on the retype password field to indicate success
            textReTypePassword.classList.remove("is-invalid");
            textReTypePassword.classList.add("is-valid");
            textReTypePassword.style.border = "2px solid green";
            textReTypePassword.style.backgroundColor = "#c6f6d5";

    } else {
        // If they don't match or are empty, reset the user password
        user.password = null;

        // Invalid input (fails regex)
        textReTypePassword.classList.remove("is-valid");
        textReTypePassword.classList.add("is-invalid");
        textReTypePassword.style.border = "2px solid red";
        textReTypePassword.style.backgroundColor = "#f8d7da";
    }
}

// Function to clear the user form by confirming the user's intent
const clearUserForm = () => {
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
        refreshUserForm();
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


//==============================================================================================================