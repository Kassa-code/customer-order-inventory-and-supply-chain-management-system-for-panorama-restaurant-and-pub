// Create browser load event
// This ensures the following logic runs only after the entire page (DOM + all external resources) is fully loaded
window.addEventListener("load", () => {
    
    // Refresh and initialize the supplier payment form when the page loads
    refreshSupplierPaymentForm();

    // Populate the supplier payment table on initial page load
    refreshSupplierPaymentTable();

});

// Create refresh table area function
const refreshSupplierPaymentTable = () => {
   
    // Fetch supplierpayment data using a common GET request function 
    let supplierpayments = getServiceRequest('/supplierpayment/alldata');

    // Create an array of column definitions for the table
    // Each column is represented by an object with a property name and data type
    // Create colums array and objects for each column
    // string ===> string / date / number
    // function ===> object / array / boolean
    // decimal  → numeric values that should be formatted to 2 decimal places
    let propertyList = [
        { propertyName: "bill_no", dataType: "string" },
        { propertyName: generateGrnNO, dataType: "function" }, 
        { propertyName: generateSupplier, dataType: "function" },
        { propertyName: generatePaymentMethod, dataType: "function" },
        { propertyName: "total_amount", dataType: "decimal" },
        { propertyName: "payment_amount", dataType: "decimal" }, 
        { propertyName: "balance_amount", dataType: "decimal" },
        { propertyName: generatePaymentStatus, dataType: "function" }
    ];

    // Populate the HTML table with ingredient data
    // Pass in:
    // - table body element ID
    // - list of ingredients
    // - property list for table columns
    // - callback functions for refill, and view actions
    fillDataIntoTableTwo(tableSupplierPaymentBody, supplierpayments, propertyList, supplierPaymentFormRefill, supplierPaymentView);

    // Loop to hide edit button 
  for (const key in supplierpayments) {
    tableSupplierPaymentBody.children[key].lastChild.children[0].children[1].children[0].children[0].style.display = "none";
  }

    // Initialize DataTables plugin on the table with ID "tableItem"
    // Enables features such as sorting, pagination, and search functionality
    $("#tableSupplierPayment").DataTable();

}


// Define function for filter items that a supplier supplies
const filterGrnsBySupplier = () => {
    // Fetch all suppliers from the backend API
    let grns = getServiceRequest("grn/listbysupplier/" + JSON.parse(selectSupplier.value).id);
    // Populate the Supplier dropdown with data fetched from the backend
    fillDataIntoSelect(selectGRN, "Please Select GRN", grns, "code");
  
  };
// Define function for filter items that a supplier supplies
const filterGrnsIncompleteBySupplier = () => {
    // Fetch all suppliers from the backend API
    let grns = getServiceRequest("grn/listbysupplierincompletepaymentstatus/" + JSON.parse(selectSupplier.value).id);
    // Populate the Supplier dropdown with data fetched from the backend
    fillDataIntoSelect(selectGRN, "Please Select GRN", grns, "code");
  
  };


  // Function to calculate and display the due amount for the selected GRN
const generateDueAmount = () => {
  // Parse the selected GRN object from the dropdown value (assumes it's JSON stringified)
  let grn = JSON.parse(selectGRN.value);

  // Calculate the due amount: net amount - paid amount, rounded to 2 decimal places
  textTotalAmount.value = (parseFloat(grn.net_amount) - parseFloat(grn.paid_amount)).toFixed(2);

  // Apply Bootstrap 'valid' styles to visually indicate correct input
  textTotalAmount.classList.remove("is-invalid"); // Remove invalid class if previously added
  textTotalAmount.classList.add("is-valid");      // Add valid class for green border

  // Apply inline styling for success indication
  textTotalAmount.style.border = "2px solid green";        // Set border to green
  textTotalAmount.style.backgroundColor = "#c6f6d5";        // Set light green background

  // Disable the input field to prevent editing since it's system-generated
  textTotalAmount.disabled = "disabled";

  // Assign the calculated total amount to the supplierPayment object for backend submission
  supplierPayment.total_amount = textTotalAmount.value;
}


// Function to reset the supplier payment form and reload all dropdown data with fresh values
const refreshSupplierPaymentForm = () => {

    // Reset the entire form fields to their initial default state
    formSupplierPayment.reset();    

    // Initialize a new empty object to store supplier payment data temporarily
    supplierPayment = new Object();

    // Request latest data from backend to update dropdown menus (select inputs)
    let grns = getServiceRequest('goodreceivenote/alldata');           // Fetch all Good Receive Notes (GRNs)
    let suppliers = getServiceRequest('supplier/alldata');              // Fetch all suppliers
    let paymentmethods = getServiceRequest('supplierpaymentmethod/alldata'); // Fetch all payment methods
    let paymentstatuses = getServiceRequest('supplierpaymentstatus/alldata'); // Fetch all payment statuses
    

    // Fill the dropdowns with the newly fetched data, adding a default prompt for user guidance
    fillDataIntoSelect(selectGRN, "Please Select GRN", grns, "code");                    // Fill GRN dropdown using 'code' property
    fillDataIntoSelect(selectSupplier, "Please Select Supplier", suppliers, "suppliername"); // Fill supplier dropdown using 'suppliername' property
    fillDataIntoSelect(selectPaymentMethod, "Please Select Payment Method", paymentmethods, "name"); // Fill payment method dropdown using 'name' property
    fillDataIntoSelect(selectPaymentStatus, "Status of the Payment", paymentstatuses, "name");     // Fill payment status dropdown using 'name' property

    // Manually reset or clear extra UI elements and inputs that form.reset() does not affect
    // This includes selects, text inputs, date inputs, and custom fields
    setDefault([
        selectSupplier,
        selectGRN,
        textTotalAmount,
        selectPaymentMethod,
        textPaymentAmount,
        textBalanceAmount,
        selectPaymentStatus,
        textCheckNo,
        textCheckDate,
        textTransferID,
        textTransferDateTime
    ]);

    // ----------------------------
    // Setup date and time limits for transfer and check date fields
    // ----------------------------

    let currentDate = new Date(); // Get the current date and time

    // Format the current month with leading zero if needed (01 - 12)
    let currentMonth = currentDate.getMonth() + 1;
    if (currentMonth < 10) currentMonth = '0' + currentMonth;
    
    // Format the current day with leading zero if needed (01 - 31)
    let currentDay = currentDate.getDate();
    if (currentDay < 10) currentDay = '0' + currentDay;
    
    // Format current hours with leading zero if needed (00 - 23)
    let currentHours = currentDate.getHours();
    if (currentHours < 10) currentHours = '0' + currentHours;
    
    // Format current minutes with leading zero if needed (00 - 59)
    let currentMinutes = currentDate.getMinutes();
    if (currentMinutes < 10) currentMinutes = '0' + currentMinutes;
    
    // Set the maximum allowed datetime for the transfer date/time field to the current moment
    // This prevents users from selecting a future date/time for transfers
    textTransferDateTime.max = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDay + "T" + currentHours + ":" + currentMinutes;
    
    // Save a copy of current date to modify later for check date limits
    let todayForCheck = new Date(currentDate);
    
    // Adjust current date backward by 7 days to set the minimum allowed transfer datetime
    currentDate.setDate(currentDate.getDate() - 7);
    
    // Format minimum allowed month for transfer datetime
    let MinCurrentMonth = currentDate.getMonth() + 1;
    if (MinCurrentMonth < 10) MinCurrentMonth = '0' + MinCurrentMonth;
    
    // Format minimum allowed day for transfer datetime
    let MinCurrentDay = currentDate.getDate();
    if (MinCurrentDay < 10) MinCurrentDay = '0' + MinCurrentDay;
    
    // Format minimum allowed hours for transfer datetime
    let MinCurrentHours = currentDate.getHours();
    if (MinCurrentHours < 10) MinCurrentHours = '0' + MinCurrentHours;
    
    // Format minimum allowed minutes for transfer datetime
    let MinCurrentMinutes = currentDate.getMinutes();
    if (MinCurrentMinutes < 10) MinCurrentMinutes = '0' + MinCurrentMinutes;
    
    // Set the minimum allowed datetime for the transfer field to 7 days ago
    // This prevents users from selecting a transfer date/time older than 7 days
    textTransferDateTime.min = currentDate.getFullYear() + "-" + MinCurrentMonth + "-" + MinCurrentDay + "T" + MinCurrentHours + ":" + MinCurrentMinutes;
    
    // ---------------------------
    // Set limits for cheque date (which is a date input)
    // ---------------------------

    // Set max cheque date to 90 days after today to limit validity period of cheque
    todayForCheck.setDate(todayForCheck.getDate() + 90);
    
    // Format max cheque month with leading zero
    let MaxCheckMonth = todayForCheck.getMonth() + 1;
    if (MaxCheckMonth < 10) MaxCheckMonth = '0' + MaxCheckMonth;
    
    // Format max cheque day with leading zero
    let MaxCheckDay = todayForCheck.getDate();
    if (MaxCheckDay < 10) MaxCheckDay = '0' + MaxCheckDay;
    
    // Set max attribute of cheque date input
    textCheckDate.max = todayForCheck.getFullYear() + "-" + MaxCheckMonth + "-" + MaxCheckDay;
    
    // Set min cheque date to today to prevent selecting past dates
    let checkMinMonth = (new Date()).getMonth() + 1;
    if (checkMinMonth < 10) checkMinMonth = '0' + checkMinMonth;
    
    let checkMinDay = (new Date()).getDate();
    if (checkMinDay < 10) checkMinDay = '0' + checkMinDay;
    
    textCheckDate.min = (new Date()).getFullYear() + "-" + checkMinMonth + "-" + checkMinDay;
    
    // Clear the balance amount input field
    textBalanceAmount.value = "";

    // Disable balance amount input so user cannot change it directly
    textBalanceAmount.disabled = "disabled";

    // Disable payment status dropdown to prevent changes until appropriate
    selectPaymentStatus.disabled = "disabled";

    // Hide the Update button by adding the Bootstrap class "d-none" (display: none)
    buttonUpdate.classList.add("d-none");

    // Show the Submit button by removing the "d-none" class (making it visible)
    buttonSubmit.classList.remove("d-none");
}


// Function for extract and return the GRN code from the given data object
const generateGrnNO = (dataOb) => {
    return dataOb.grn_id.code;  // Access the 'code' property inside 'grn_id' object
}

// Function for extract and return the supplier name from the given data object
const generateSupplier = (dataOb) => {
    return dataOb.supplier_id.suppliername;  // Access the 'suppliername' property inside 'supplier_id' object
}

// Function for extracts and return the payment method name from the given data object
const generatePaymentMethod = (dataOb) => {
    return dataOb.supplierpaymentmethod_id.name;  // Access the 'name' property inside 'supplierpaymentmethod_id' object
}


// Define a function to return an icon HTML string based on the payment status name
const generatePaymentStatus = (dataOb) => {

    // If payment status is "Pending", return a red invoice icon to indicate warning or action needed
    if (dataOb.supplierpaymentstatus_id.name == "Pending") {
        return (
            "<i class='fa-solid fa-file-invoice-dollar fa-lg text-danger'></i>"
        );
    } 

    // If payment status is "Partially-Completed", return a yellow invoice icon to indicate partial completion
    if (dataOb.supplierpaymentstatus_id.name == "Partially Completed") {
        return (
            "<i class='fa-solid fa-file-invoice-dollar fa-lg text-warning'></i>"
        );
    }

    // If payment status is "Completed", return a green invoice icon to indicate success or completion
    if (dataOb.supplierpaymentstatus_id.name == "Completed") {
        return (
            "<i class='fa-solid fa-file-invoice-dollar fa-lg text-success'></i>"
        );
    }
}

// Add an event listener on the payment amount input field that triggers whenever the user types or changes input
textPaymentAmount.addEventListener("input", () => {
    // Convert total amount input value to a float number, or default to 0 if empty/invalid
    let totalAmount = parseFloat(textTotalAmount.value) || 0;
    // Convert payment amount input value to a float number, or default to 0 if empty/invalid
    let paymentAmount = parseFloat(textPaymentAmount.value) || 0;

    if (paymentAmount > totalAmount) {
      Swal.fire({
        title: "Invalid Payment Amount!",
        text: "Payment amount cannot exceed the total amount.",
        icon: "error",
        width: "20em",
        showConfirmButton: false,
        timer: 2000
      });
    
      // Reset to the maximum allowed value
      textPaymentAmount.value = totalAmount.toFixed(2);
    }

    // Call a function to recalculate the balance amount and update the payment status accordingly
    calculateBalanceAmount();
});

// Define function for automatically calculate balance amount
const calculateBalanceAmount = () => {

    // Convert total amount input value to float, default to 0 if invalid or empty
    let totalAmount = parseFloat(textTotalAmount.value) || 0;
    // Convert payment amount input value to float, default to 0 if invalid or empty
    let paymentAmount = parseFloat(textPaymentAmount.value) || 0;

    // Calculate balance amount as total minus payment, rounded to 2 decimals
    let balanceAmount = parseFloat(totalAmount - paymentAmount).toFixed(2);
    // Set balance amount input field value
    textBalanceAmount.value = balanceAmount;
    // Update balance amount in the supplierPayment object for tracking
    supplierPayment.balance_amount = balanceAmount;
    // Visually indicate balance amount input is valid with green border
    textBalanceAmount.classList.remove("is-invalid");
    textBalanceAmount.classList.add("is-valid");
    textBalanceAmount.style.border = "2px solid green";
    textBalanceAmount.style.backgroundColor = "#c6f6d5";

    // Fetch all payment statuses from backend to refresh dropdown options
    let paymentstatuses = getServiceRequest('supplierpaymentstatus/alldata');
    // Populate payment status select dropdown with fresh data
    fillDataIntoSelect(selectPaymentStatus, "Status of the Payment", paymentstatuses, "name");

    // Determine the payment status name based on payment amount compared to total amount
    let statusName = "";
    if (paymentAmount === 0) {
        statusName = "Pending";                   // No payment made yet
    } else if (paymentAmount < totalAmount) {
        statusName = "Partially Completed";      // Partial payment made
    } else if (paymentAmount >= totalAmount) {
        statusName = "Completed";                 // Full payment made or exceeded (capped earlier)
    }

    // Find the status object from the fetched list that matches the computed status name (case insensitive)
    const matchedStatus = paymentstatuses.find(status => status.name.toLowerCase() === statusName.toLowerCase());

    if (matchedStatus) {
        // Set the dropdown value to the matched status object serialized as JSON string
        selectPaymentStatus.value = JSON.stringify(matchedStatus);
        // Update supplierPayment object with the matched payment status
        supplierPayment.supplierpaymentstatus_id = matchedStatus;

        // Show green border on dropdown to indicate valid selection
        selectPaymentStatus.classList.remove("is-invalid");
        selectPaymentStatus.classList.add("is-valid");
        selectPaymentStatus.style.border = "2px solid green";
        selectPaymentStatus.style.backgroundColor = "#c6f6d5";
    } else {
        // If no matching status found, reset dropdown value and indicate error with red border
        selectPaymentStatus.value = "";
        supplierPayment.supplierpaymentstatus_id = null;
        selectPaymentStatus.classList.remove("is-valid");
        selectPaymentStatus.classList.add("is-invalid");
        selectPaymentStatus.style.border = "2px solid red";
        selectPaymentStatus.style.backgroundColor = "#f8d7da";
    }
};

// This code handles the payment method selection in a form.
// When the user selects a payment method (like Bank Transfer or Cheque),
// it shows the relevant input fields for that method (e.g., transfer ID/date or cheque number/date)
// and hides the fields that are not applicable.
// It also visually marks the dropdown to indicate it was changed by the user.
// Get the payment method dropdown element by its ID
const selectPaymentMethodElement = document.querySelector("#selectPaymentMethod");

// Add an event listener to detect when the selected payment method changes
selectPaymentMethodElement.addEventListener("change", () => {

    // Get the text of the selected option, trim whitespace, and convert to lowercase for comparison
    const paymentMethodName = selectPaymentMethodElement.options[selectPaymentMethodElement.selectedIndex].text.trim().toLowerCase();

    // Highlight the dropdown border in green to show user interaction
    selectPaymentMethodElement.classList.remove("is-invalid");
    selectPaymentMethodElement.classList.add("is-valid");
    selectPaymentMethodElement.style.border = "2px solid green";
    selectPaymentMethodElement.style.backgroundColor = "#c6f6d5";

    // IDs of field groups related to bank transfer details
    const transferFieldGroups = ["colTextTransferID", "colTextTransferDateTime"];
    // IDs of field groups related to cheque details
    const chequeFieldGroups = ["colTextCheckNo", "colTextCheckDate"];

    // Show or hide fields based on selected payment method
    if (paymentMethodName === "bank transfer") {
        // Show transfer fields and hide cheque fields
        transferFieldGroups.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
        chequeFieldGroups.forEach(id => document.getElementById(id)?.classList.add("d-none"));
        
    } else if (paymentMethodName === "cheque") {
        // Show cheque fields and hide transfer fields
        chequeFieldGroups.forEach(id => document.getElementById(id)?.classList.remove("d-none"));
        transferFieldGroups.forEach(id => document.getElementById(id)?.classList.add("d-none"));
       
    } else {
        // For any other payment method, hide both cheque and transfer related fields
        chequeFieldGroups.forEach(id => document.getElementById(id)?.classList.add("d-none"));
        transferFieldGroups.forEach(id => document.getElementById(id)?.classList.add("d-none"));
    }
});


// Function to refill the supplier payment form with existing data when editing an entry
const supplierPaymentFormRefill = (ob) => {

    // Log the object being edited for debugging
    console.log("Edit", ob);

    // Make deep copies of the object:
    // supplierPayment holds the current editable data,
    // oldsupplierPayment keeps the original data in case of reset or comparison
    supplierPayment = JSON.parse(JSON.stringify(ob));
    oldsupplierPayment = JSON.parse(JSON.stringify(ob));

    // Set each form field's value based on the object's properties
    selectGRN.value = JSON.stringify(ob.grn_id); // GRN dropdown

    selectSupplier.value = JSON.stringify(ob.supplier_id); // Supplier dropdown

    textBillNo.value = ob.bill_no; // Bill number input

    selectPaymentMethod.value = JSON.stringify(ob.supplierpaymentmethod_id);// Payment method dropdown

    textTotalAmount.value = ob.total_amount; // Total amount input

    textPaymentAmount.value = ob.payment_amount ? ob.payment_amount : ""; // Payment amount input (empty if null)

    textBalanceAmount.value = ob.balance_amount; // Balance amount input

    selectPaymentStatus.value = JSON.stringify(ob.supplierpaymentstatus_id); // Payment status dropdown

    textCheckNo.value = ob.check_no ? ob.check_no : ""; // Cheque number input (empty if null)

    textCheckDate.value = ob.check_date ? ob.check_date : "";// Cheque date input (empty if null)

    textTransferID.value = ob.transfer_id ? ob.transfer_id : "";// Transfer ID input (empty if null)

    textTransferDateTime.value = ob.transfer_date_time ? ob.transfer_date_time : ""; // Transfer datetime input (empty if null)

    // Show the Update button (for submitting changes)
    buttonUpdate.classList.remove("d-none");

    // Hide the Submit button (used for new entries)
    buttonSubmit.classList.add("d-none");

    // Open the offcanvas sidebar containing the form for editing
    $("#offcanvasSupplierPaymentForm").offcanvas("show");
}


// Function to display detailed information of a supplier payment record for viewing or printing
const supplierPaymentView = (ob, index) => {
    // Log the supplier payment object and its index for debugging purposes
    console.log("View", ob, index);
    
    // Fill in the view panel fields with the supplier payment data
    tdViewBillNo.innerText = ob.bill_no;  
    tdViewSupplierName.innerText = ob.supplier_id.suppliername; // Show supplier name
    tdViewGRNNo.innerText = ob.grn_id.code; 
    tdViewTotalAmount.innerText = ob.total_amount;
    tdViewPaymentMethod.innerText = ob.supplierpaymentmethod_id.name; 
    tdViewPaymentAmount.innerText = ob.payment_amount;          // Show payment amount
    tdViewBalanceAmount.innerText = ob.balance_amount;          // Show balance amount
    tdViewPaymentStatus.innerText = ob.supplierpaymentstatus_id.name;  // Show payment status name
    tdViewCheckNo.innerText = ob.check_no;                      // Show cheque number
    tdViewCheckDate.innerText = ob.check_date;                  // Show cheque date
    tdViewTransferID.innerText = ob.transfer_id;                // Show transfer ID
    tdViewTransferDateTime.innerText = ob.transfer_date_time;   // Show transfer date/time

    // Open the Bootstrap offcanvas panel to display the view details to the user
    $("#offcanvasSupplierView").offcanvas("show");
}



// Function to handle printing the supplier payment details displayed in the view table
const buttonPrintRow = () => {
    // Open a new blank browser window or tab
    let newWindow = window.open();

    // Create the complete HTML content for the print page, including styles and the supplier payment table
    let printView = `<html>
      <head>
        <title>Print Supplier Payment</title>
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
          /* Make table headers bold and left-aligned */
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
          ${tableSupplierView.outerHTML}  <!-- Insert the full HTML of the supplier payment table for printing -->
        </div>
      </body>
    </html>`;

    // Write the above HTML content into the new window's document
    newWindow.document.write(printView);

    // Wait 1.5 seconds to ensure content is fully loaded before triggering print
    setTimeout(() => {
        newWindow.stop();    // Stop any further loading in the new window
        newWindow.print();   // Open the browser's print dialog
        newWindow.close();   // Automatically close the print window after printing
    }, 1500);

    /*
      Explanation of `${tableSupplierView.outerHTML}`:
      - This takes the entire HTML (including tags and content) of the supplier payment table element.
      - Using outerHTML copies the complete element so it can be shown exactly as in the original view.
      - This is useful for creating a standalone print page with the table data.
    */
}


// Function to validate the supplier payment form inputs and collect error messages
const checkFormError = () => {
    let formInputErrors = "";
  
    if (supplierPayment.supplier_id == null) {
      formInputErrors += "❗🏢 Please Select Supplier...! \n";
    }
  
    if (supplierPayment.grn_id == null) {
      formInputErrors += "❗📄 Please Select GRN...! \n";
    }
  
    if (supplierPayment.supplierpaymentmethod_id == null) {
      formInputErrors += "❗💳 Please Select Payment Method...! \n";
    }
  
    if (supplierPayment.total_amount == null) {
      formInputErrors += "❗💰 Please Enter Total Amount...! \n";
    }
  
    if (supplierPayment.balance_amount == null) {
      formInputErrors += "❗⚖️ Please Enter Balance Amount...! \n";
    }
  
    if (supplierPayment.supplierpaymentmethod_id.name === "Cheque") {
      if (supplierPayment.check_no == null || supplierPayment.check_no.trim() === "") {
        formInputErrors += "❗📝 Please Enter Check No...! \n";
      }
      if (supplierPayment.check_date == null) {
        formInputErrors += "❗📅 Please Enter Check Date...! \n";
      }
    }
  
    if (supplierPayment.supplierpaymentmethod_id.name === "Bank Transfer") {
      if (supplierPayment.transfer_id == null || supplierPayment.transfer_id.trim() === "") {
        formInputErrors += "❗🏦 Please Enter Transfer Id...! \n";
      }
      if (supplierPayment.transfer_date_time == null) {
        formInputErrors += "❗📅 Please Enter Transfer Date Time...! \n";
      }
    }
  
    return formInputErrors;
  }
  

// Function to handle the supplier payment form submission
const buttonSupplierPaymentSubmit = () => {
    console.log(supplierPayment); // Debug log
  
    let errors = checkFormError(); // Validate form fields
  
    if (errors === "") {
      // Confirm submission with SweetAlert2
      Swal.fire({
        title: "Are you sure to add the following Supplier Payment?",
        html:
          "<div style='text-align:left; font-size:14px'>" +
          "📦 <b>GRN:</b> " + supplierPayment.grn_id.code + "<br>" +
          "🏢 <b>Supplier:</b> " + supplierPayment.supplier_id.suppliername + "<br>" +
          "🧾 <b>Bill No:</b> " + supplierPayment.bill_no + "<br>" +
          "💰 <b>Total Amount:</b> " + supplierPayment.total_amount + "<br>" +
          "💵 <b>Payment Amount:</b> " + supplierPayment.payment_amount + "<br>" +
          "💸 <b>Balance Amount:</b> " + supplierPayment.balance_amount + "<br>" +
          "🏦 <b>Check No:</b> " + (supplierPayment.check_no || "N/A") + "<br>" +
          "📅 <b>Check Date:</b> " + (supplierPayment.check_date || "N/A") + "<br>" +
          "🔁 <b>Transfer ID:</b> " + (supplierPayment.transfer_id || "N/A") + "<br>" +
          "🕒 <b>Transfer Date Time:</b> " + (supplierPayment.transfer_date_time || "N/A") +
          "</div>",
        icon: "warning",
        width: "25em",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Add Payment"
      }).then((result) => {
        if (result.isConfirmed) {
          let postResponse = getHTTPServiceRequest("/supplierpayment/insert", "POST", supplierPayment);
  
          if (postResponse === "OK") {
            Swal.fire({
              icon: "success",
              width: "20em",
              title: "Saved successfully!",
              timer: 1500,
              showConfirmButton: false
            });
  
            refreshSupplierPaymentTable();
            refreshSupplierPaymentForm();
            $("#offcanvasSupplierPaymentForm").offcanvas("hide");
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
  

// Function to check for changes between the current and original supplier payment data in the form
const checkSupplierPaymentFormUpdate = () => {
  let updates = "";

  if (supplierPayment != null && oldsupplierPayment != null) {
      if (supplierPayment.grn_id.code !== oldsupplierPayment.grn_id.code) {
          updates += "📄 GRN is changed..! \n";
      }
      if (supplierPayment.supplier_id.suppliername !== oldsupplierPayment.supplier_id.suppliername) {
          updates += "🏢 Supplier is changed..! \n";
      }
      if (supplierPayment.supplierpaymentmethod_id.name !== oldsupplierPayment.supplierpaymentmethod_id.name) {
          updates += "💳 Payment Method is changed..! \n";
      }
      if (supplierPayment.total_amount !== oldsupplierPayment.total_amount) {
          updates += "💰 Total Amount is changed..! \n";
      }
      if (supplierPayment.payment_amount !== oldsupplierPayment.payment_amount) {
          updates += "💸 Payment Amount is changed..! \n";
      }
      if (supplierPayment.balance_amount !== oldsupplierPayment.balance_amount) {
          updates += "⚖️ Balance Amount is changed..! \n";
      }
      if (supplierPayment.supplierpaymentstatus_id.name !== oldsupplierPayment.supplierpaymentstatus_id.name) {
          updates += "📊 Payment Status is changed..! \n";
      }
      if (supplierPayment.check_no !== oldsupplierPayment.check_no) {
          updates += "🧾 Check No is changed..! \n";
      }
      if (supplierPayment.check_date !== oldsupplierPayment.check_date) {
          updates += "📅 Check Date is changed..! \n";
      }
      if (supplierPayment.transfer_id !== oldsupplierPayment.transfer_id) {
          updates += "🔄 Transfer Id is changed..! \n";
      }
      if (supplierPayment.transfer_date_time !== oldsupplierPayment.transfer_date_time) {
          updates += "⏰ Transfer Date Time is changed..! \n";
      }
  }

  return updates;
}

// Function to handle updating the supplier payment form data
const buttonSupplierPaymentUpdate = () => {
  let errors = checkFormError();

  if (errors == "") {
      let updates = checkSupplierPaymentFormUpdate();

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
                  let putResponse = getHTTPServiceRequest("/supplierpayment/update", "PUT", supplierPayment);

                  if (putResponse == "OK") {
                      Swal.fire({
                          title: "Updated Successfully!",
                          icon: "success",
                          width: "20em",
                          showConfirmButton: false,
                          timer: 1500
                      });

                      refreshSupplierPaymentTable();
                      refreshSupplierPaymentForm();
                      $("#offcanvasSupplierPaymentForm").offcanvas("hide");
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
};


// Function to clear the supplier payment form after confirming with the user
const clearSupplierPaymentForm = () => {
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
        refreshSupplierPaymentForm();
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
