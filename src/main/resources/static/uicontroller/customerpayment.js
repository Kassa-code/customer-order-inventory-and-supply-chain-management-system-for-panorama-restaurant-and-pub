// Create browser load event
// This ensures the following logic runs only after the entire page (DOM + all external resources) is fully loaded
window.addEventListener("load", () => {

  // Refresh and initialize the customer payment form when the page loads
  refreshCustomerPaymentForm();

  // Populate the customer payment table on initial page load
  refreshCustomerPaymentTable();

});


// Function to fetch, build, and display customer payment data in the table
const refreshCustomerPaymentTable = () => {

  // Fetch all customer payment records using a generic GET request function
  let customerpayments = getServiceRequest('/customerpayment/alldata');

  // Define the structure of the table by specifying which properties to display
  // Each object in this array represents a column with:
  // - propertyName: the field name or a function to generate content
  // - dataType: determines formatting or custom rendering behavior
  let propertyList = [
    { propertyName: "bill_no", dataType: "string" },                     // Direct string value
    { propertyName: generateOrderNO, dataType: "function" },             // Custom function output
    { propertyName: generatePaymentMethod, dataType: "function" },       // Custom function output
    { propertyName: "total_amount", dataType: "decimal" },               // Format to 2 decimal places
    { propertyName: "paid_amount", dataType: "decimal" },                // Format to 2 decimal places
    { propertyName: "balance_amount", dataType: "decimal" },             // Format to 2 decimal places
    { propertyName: "added_datetime", dataType: "string" },        // Display as-is
    { propertyName: generatePaymentStatus, dataType: "function" }        // Custom function output
  ];

  // Populate the HTML table with customer payment data
  // Parameters:
  // - table body element (where rows will be inserted)
  // - data list to display
  // - property list defining each column
  // - form refill function to call on edit
  // - view function to call on view action
  fillDataIntoTableTwo(tableCustomerPaymentBody, customerpayments, propertyList, customerPaymentFormRefill, customerPaymentView);

  // Hide the edit button in each row (usually the second button in the actions column)
  for (const key in customerpayments) {
    tableCustomerPaymentBody.children[key]                                 // Row
      .lastChild                                                           // Action cell
      .children[0]                                                         // Button group
      .children[1]                                                         // Edit button container
      .children[0]                                                         // Inner button group
      .children[0].style.display = "none";                                 // Actual edit button
  }

  // Activate DataTables plugin on the table with ID "tableCustomerPayment"
  // This adds features like pagination, search, and sorting
  $("#tableCustomerPayment").DataTable();

}

// Function to reset the customer payment form and reload dropdown options
// This is typically called when the page loads or after a successful form submission
// It ensures that all fields are cleared and refreshed with up-to-date values from the server
const refreshCustomerPaymentForm = () => {

  // Reset all form fields to their default state (clears inputs, selections, etc.)
  formCustomerPayment.reset();

  // Re-initialize the global customerpayment object to ensure a clean state
  customerpayment = new Object();

  // Fetch fresh data from the backend
  let orders = getServiceRequest('order/bystatusready');                      // Get all orders
  let paymentmethods = getServiceRequest('customerpaymentmethod/alldata'); // Get all payment methods
  let paymentstatuses = getServiceRequest('customerpaymentstatus/alldata'); // Get all payment statuses

  // Populate dropdown fields using the fetched data
  // The fourth parameter defines the property from each object to use as display text
  fillDataIntoSelect(selectOrderId, "Please Select Order", orders, "order_code");
  fillDataIntoSelect(selectPaymentMethod, "Please Select Payment Method", paymentmethods, "name");
  fillDataIntoSelect(selectPaymentStatus, "Status of the Payment", paymentstatuses, "name");

  // Set the payment status dropdown to default to the first status in the list
  selectPaymentStatus.value = JSON.stringify(paymentstatuses[2]);
  // Assign the selected payment status object to the customerpayment
  customerpayment.payment_status_id = paymentstatuses[2];

  // Style the payment status dropdown to indicate a valid selection
  selectPaymentStatus.classList.remove("is-invalid");
  selectPaymentStatus.classList.add("is-valid");
  selectPaymentStatus.style.border = "2px solid green";
  selectPaymentStatus.style.backgroundColor = "#c6f6d5";
  // Manually clear or set default values for form elements that are not reset by form.reset()
  setDefault([
    selectOrderId,
    selectPaymentMethod,
    textPTotalAmount,
    textPaidAmount,
    textBalanceAmount,
    
  ]);

  // Set total amount to empty and disable its associated display cell
  textPTotalAmount.value = "";
  tdTotalAmount.disabled = "disabled";

  // Set balance amount to empty and disable input to prevent user editing
  textBalanceAmount.value = "";
  textBalanceAmount.disabled = "disabled";

  // Disable payment status field by default to avoid premature changes
  selectPaymentStatus.disabled = "disabled";

  // Hide the "Update" button (used for editing an existing record)
  buttonPaymentUpdate.classList.add("d-none");

  // Ensure the "Submit" button (used for new entries) is visible
  buttonPaymentSubmit.classList.remove("d-none");
}


// Function to extract and return the Order Code from the provided data object
// This is used when displaying the associated order code in customer payment records
const generateOrderNO = (dataOb) => {
  return dataOb.order_process_id.order_code;  // Access the 'order_code' property inside 'order_process_id' object
}

// Function to extract and return the Payment Method name from the provided data object
// This is used for displaying the payment method in a readable format in the table
const generatePaymentMethod = (dataOb) => {
  return dataOb.payment_method_id.name;  // Access the 'name' property inside 'payment_method_id' object
}

// Function to determine and return an icon based on the Payment Status
// This helps visually indicate the payment status (Pending, Partially Completed, or Completed) in the UI
const generatePaymentStatus = (dataOb) => {

  // If payment status is "Pending", return a red invoice icon to indicate warning or action needed
  if (dataOb.payment_status_id.name == "Pending") {
    return "<i class='fa-solid fa-file-invoice-dollar fa-lg text-danger'></i>";
  }

  // If payment status is "Partially Completed", return a yellow invoice icon to indicate partial completion
  if (dataOb.payment_status_id.name == "Partially Completed") {
    return "<i class='fa-solid fa-file-invoice-dollar fa-lg text-warning'></i>";
  }

  // If payment status is "Completed", return a green invoice icon to indicate success or completion
  if (dataOb.payment_status_id.name == "Completed") {
    return "<i class='fa-solid fa-file-invoice-dollar fa-lg text-success'></i>";
  }
}



// Function to update the paid amount and balance inputs based on the selected payment method.
const calculatePayAmountAndBalanceBypayMethod = () => {

  // Check if the selected payment method is "Card"
  if (JSON.parse(selectPaymentMethod.value).name == "Card") {

    // Set paid amount equal to total amount and balance to zero, formatted to 2 decimals
    textPaidAmount.value = parseFloat(textPTotalAmount.value).toFixed(2);
    textBalanceAmount.value = parseFloat(0).toFixed(2);

    // Update the customerpayment object accordingly
    customerpayment.paid_amount = parseFloat(textPTotalAmount.value).toFixed(2);
    customerpayment.balance_amount = parseFloat(0).toFixed(2);

    // Disable input fields for paid amount and balance to prevent editing
    textPaidAmount.disabled = "disabled";
    textBalanceAmount.disabled = "disabled";

    // Add valid styling to paid amount input
    textPaidAmount.classList.add("is-valid");
    textPaidAmount.style.border = "2px solid green";
    textPaidAmount.style.backgroundColor = "#c6f6d5";

    // Add valid styling to balance amount input
    textBalanceAmount.classList.add("is-valid");
    textBalanceAmount.style.border = "2px solid green";
    textBalanceAmount.style.backgroundColor = "#c6f6d5";

  } else {
    // For payment methods other than card, enable the paid amount input field
    textPaidAmount.disabled = "";
  }
}



// Function to automatically calculate and update the balance amount
const calculateBalanceAmount = () => {

  // Check if the paid amount is greater than or equal to the total amount
  if (parseFloat(textPaidAmount.value) >= parseFloat(textPTotalAmount.value)) {

    // Calculate the balance as the difference between paid amount and total amount
    let paid_amount = parseFloat(textPaidAmount.value);
    textBalanceAmount.value = (paid_amount - parseFloat(textPTotalAmount.value)).toFixed(2);

    // Update the customerpayment object's balance_amount with the calculated balance
    customerpayment.balance_amount = parseFloat(textBalanceAmount.value).toFixed(2);

    // Disable the balance amount input field to prevent editing
    textBalanceAmount.disabled = "disabled";

    // Mark the paid amount input as valid with green border
    textPaidAmount.style.border = "2px solid green";
    textPaidAmount.style.backgroundColor = "#c6f6d5";
    textPaidAmount.classList.add("is-valid");
    textPaidAmount.style.border = "2px solid green";

    // Mark the balance amount input as valid with green border
    textBalanceAmount.style.border = "2px solid green";
    textBalanceAmount.style.backgroundColor = "#c6f6d5";
    textBalanceAmount.classList.add("is-valid");
    textBalanceAmount.style.border = "2px solid green";

    // Enable the payment submit button since inputs are valid
    buttonPaymentSubmit.disabled = "";

  } else {
    // If paid amount is less than total, clear payment info and mark inputs invalid

    // Reset balance and paid amount in customerpayment object
    customerpayment.balance_amount = null;
    customerpayment.paid_amount = null;

    // Mark the paid amount input as invalid with red border
    textPaidAmount.classList.remove("is-valid");
    textPaidAmount.classList.add("is-invalid");
    textPaidAmount.style.border = "2px solid red";
    textPaidAmount.style.backgroundColor = "#f8d7da";


    // Clear the balance amount input field value
    textBalanceAmount.value = "";

    // Remove any valid/invalid classes and reset border style on balance amount input
    textBalanceAmount.classList.remove("is-valid");
    textBalanceAmount.classList.remove("is-invalid");
    textBalanceAmount.style.border = "1px solid #ced4da";

    // Disable the payment submit button due to invalid input
    buttonPaymentSubmit.disabled = "disabled";

  }
}

// Function to refill the supplier payment form with existing data when editing an entry
const customerPaymentFormRefill = (ob) => {

  // Log the object being edited for debugging purposes
  console.log("Edit", ob);

  // Make deep copies of the object:
  // customerpayment holds the current editable data,
  // oldCustomerPayment keeps the original data for reset or comparison
  customerpayment = JSON.parse(JSON.stringify(ob));
  oldCustomerPayment = JSON.parse(JSON.stringify(ob));

  // Set each form field's value based on the object's properties

  // Order dropdown: setting to the order code (usually an object, so stringify)
  selectOrderId.value = JSON.stringify(ob.order_process_id.order_code);

  // Supplier dropdown: NOTE you set this here, but later overwrite it with payment method below
  selectPaymentMethod.value = JSON.stringify(ob.supplier_id);

  // Bill number input
  textBillNo.value = ob.bill_no;

  // Payment method dropdown: overwrites previous selectPaymentMethod.value
  selectPaymentMethod.value = JSON.stringify(ob.payment_method_id);

  // Total amount input
  textPTotalAmount.value = ob.total_amount;

  // Paid amount input (if null, will be empty string)
  textPaidAmount.value = ob.paid_amount;

  // Balance amount input (if null, empty string)
  textBalanceAmount.value = ob.balance_amount ? ob.balance_amount : "";

  // Payment status dropdown
  selectPaymentStatus.value = JSON.stringify(ob.payment_status_id);

  // Show the Update button (for submitting changes)
  buttonPaymentUpdate.classList.remove("d-none");

  // Hide the Submit button (used for new entries)
  buttonPaymentSubmit.classList.add("d-none");

  // Open the offcanvas sidebar containing the form for editing
  $("#offcanvasCustomerPaymentForm").offcanvas("show");
}

// Function to display detailed information of a customer payment record for viewing or printing
const customerPaymentView = (ob, index) => {
  // Log the payment object and index for debugging
  console.log("View", ob, index);

  // Populate the detail fields with data from the object
  tdOrderNo.innerText = ob.order_process_id.order_code;       // Show order code
  tdPaymentMethod.innerText = ob.payment_method_id.name;      // Show payment method name
  tdTotalAmount.innerText = ob.total_amount;                  // Show total amount
  tdPaymentAmount.innerText = ob.paid_amount;                 // Show paid amount
  tdBalanceAmount.innerText = ob.balance_amount;              // Show balance amount
  tdPaymentStatus.innerText = ob.payment_status_id.name;      // Show payment status

  // Open the Bootstrap offcanvas panel to display the details
  $("#offcanvasCustomerView").offcanvas("show");
}


// Function to open a new window and print the currently viewed customer payment details
const buttonPrintRow = () => {
  // Open a new blank browser window/tab
  let newWindow = window.open();

  // Compose the HTML content for the print page, including CSS styles and the table markup
  let printView = `<html>
      <head>
        <title>Print Customer Payment</title>
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
          .content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
          }
          /* Table padding */
          .table th, .table td {
            padding: 6px 10px;
          }
          /* Table headers bold and left aligned */
          .table th {
            text-align: left;
            font-weight: bold;
          }
          /* Center the heading */
          h2 {
            text-align: center;
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="content">
          ${tableSupplierView.outerHTML}  <!-- Insert the full HTML of the supplier payment table -->
        </div>
      </body>
    </html>`;

  // Write the constructed HTML content into the new window's document
  newWindow.document.write(printView);

  // Delay print until content is fully loaded, then trigger print and close the window
  setTimeout(() => {
    newWindow.stop();    // Stop any further loading
    newWindow.print();   // Open print dialog
    newWindow.close();   // Close print window after printing
  }, 1500);

  /*
    Explanation of `${tableSupplierView.outerHTML}`:
    - Copies the entire supplier payment table HTML (including tags and content).
    - Enables printing the exact table content as displayed on the page.
  */
}



// Function to validate the supplier payment form inputs
// Checks required fields and returns a string listing any errors found
const checkFormError = () => {
  let formInputErrors = "";

  // Validate if order is selected
  if (customerpayment.order_process_id == null) {
    formInputErrors += "❗🏢 Please Select Order...! \n";
  }

  // Validate if payment method is selected
  if (customerpayment.payment_method_id == null) {
    formInputErrors += "❗💳 Please Select Payment Method...! \n";
  }

  // Validate if total amount is entered
  if (customerpayment.total_amount == null) {
    formInputErrors += "❗💰 Please Enter Total Amount...! \n";
  }

  // Validate if paid amount is entered
  if (customerpayment.paid_amount == null) {
    formInputErrors += "❗⚖️ Please Enter Balance Amount...! \n";
  }

  // Return concatenated error messages (empty string if no errors)
  return formInputErrors;
}


// Function to handle the supplier payment form submission process
// Validates the form, shows confirmation dialog, submits data via HTTP POST,
// then refreshes UI components or shows error messages as appropriate.
const buttonCustomerPaymentSubmit = () => {
  console.log(customerpayment); // Debug: log current payment object

  // Run form validation and collect errors
  let errors = checkFormError();

  if (errors === "") {
    // No validation errors - show confirmation popup with payment details
    Swal.fire({
      title: "Are you sure to add the following Supplier Payment?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "🏢 <b>Order Code:</b> " + customerpayment.order_process_id.order_code + "<br>" +
        "💳 <b>Payment Method:</b> " + customerpayment.payment_method_id.name + "<br>" +
        "💰 <b>Total Amount:</b> " + customerpayment.total_amount + "<br>" +
        "💵 <b>Payment Amount:</b> " + customerpayment.paid_amount + "<br>" +
        "💸 <b>Balance Amount:</b> " + customerpayment.balance_amount +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add Payment"
    }).then((result) => {
      if (result.isConfirmed) {
        // Submit the payment data to backend via POST request
        let postResponse = getHTTPServiceRequest("/customerpayment/insert", "POST", customerpayment);

        if (postResponse === "OK") {
          // Success notification
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,
            showConfirmButton: false
          });

          // Refresh the payment table and reset the form
          refreshCustomerPaymentTable();
          refreshCustomerPaymentForm();

          // Close the payment form offcanvas
          $("#offcanvasCustomerPaymentForm").offcanvas("hide");

        } else {
          // Show error if submission failed
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
    // Show validation error messages in a warning popup
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form has the following errors",
      html: "<div style='text-align:left; font-size:14px'>" + errors.replace(/\n/g, "<br>") + "</div>",
      confirmButtonColor: "#3085d6"
    });
  }
}


// Function to check for changes between the current and original supplier payment data in the form
const checkCustomerPaymentFormUpdate = () => {
  let updates = "";

  if (customerpayment != null && oldCustomerPayment != null) {
    if (customerpayment.order_process_id.order_code !== oldsupplierPayment.order_process_id.order_code) {
      updates += "📄 Order is changed..! \n";
    }
    if (customerpayment.payment_method_id.name !== oldCustomerPayment.payment_method_id.name) {
      updates += "💳 Payment Method is changed..! \n";
    }
    if (customerpayment.total_amount !== oldCustomerPayment.total_amount) {
      updates += "💰 Total Amount is changed..! \n";
    }
    if (customerpayment.paid_amount !== oldCustomerPayment.paid_amount) {
      updates += "💸 Payment Amount is changed..! \n";
    }
    if (customerpayment.balance_amount !== oldCustomerPayment.balance_amount) {
      updates += "⚖️ Balance Amount is changed..! \n";
    }
    if (customerpayment.payment_status_id.name !== oldCustomerPayment.payment_status_id.name) {
      updates += "📊 Payment Status is changed..! \n";
    }
  }

  return updates;
}

// Function to handle updating the supplier payment form data
const buttonCustomerPaymentUpdate = () => {
  let errors = checkFormError();

  if (errors == "") {
    let updates = checkCustomerPaymentFormUpdate();

    if (updates == "") {
      // No changes detected
      Swal.fire({
        title: "No Updates",
        text: "Nothing to update..!",
        icon: "info",
        width: "20em",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Ask for user confirmation with update summary
      Swal.fire({
        title: "Are you sure you want to update the following changes?",
        html: "<div style='text-align:left; font-size:14px'>" + updates.replace(/\n/g, "<br>") + "</div>",
        icon: "warning",
        width: "22em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update Payment"
      }).then((result) => {
        if (result.isConfirmed) {
          let putResponse = getHTTPServiceRequest("/customerpayment/update", "PUT", customerpayment);

          if (putResponse == "OK") {
            Swal.fire({
              title: "Updated Successfully!",
              icon: "success",
              width: "20em",
              showConfirmButton: false,
              timer: 1500
            });

            refreshCustomerPaymentTable();
            refreshSupplierPaymentForm();
            $("#offcanvasCustomerPaymentForm").offcanvas("hide");
          } else {
            Swal.fire({
              title: "Failed to update!",
              html: "<pre>" + putResponse + "</pre>",
              icon: "error",
              width: "22em",
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
      width: "22em",
      showConfirmButton: false,
      timer: 2000
    });
  }
}


// Function to clear the supplier payment form after confirming with the user
const clearCustomerPaymentForm = () => {
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
      refreshCustomerPaymentForm();
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


const generateTotalAmount = () => {
  textPTotalAmount.value   = parseFloat(JSON.parse(selectOrderId.value).total_amount).toFixed(2);
  customerpayment.total_amount   = parseFloat(JSON.parse(selectOrderId.value).total_amount).toFixed(2);
 
  textPTotalAmount.classList.add("is-valid");
  textPTotalAmount.style.border = "2px solid green";
  textPTotalAmount.style.backgroundColor = "#c6f6d5";
  
}