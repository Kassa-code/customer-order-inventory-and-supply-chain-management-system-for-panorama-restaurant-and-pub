// Create browser load event
// Ensures this code runs only after the entire page (DOM and all external resources) is fully loaded
window.addEventListener("load", () => {
    
  // Initialize and reset the Daily Out Stock form on page load
  refreshOutStockForm();

  // Load and populate the Daily Out Stock table with current data on page load
  refreshOutStockTable();

});

// Function to refresh and populate the Daily Out Stock data table
const refreshOutStockTable = () => {
 
  // Fetch all Daily Out Stock records from the server via a GET request
  let dailystockouts = getServiceRequest('/dailyoutstock/alldata');

  // Define the properties and corresponding types or functions to display in the table columns
  let propertyList = [
      { propertyName: "out_date", dataType: "string" },            // Show 'out_date' as string
      { propertyName: generateBatchNo, dataType: "function" },     // Call function to generate Batch No 
      { propertyName: generateOutItem, dataType: "function" },     // Call function to generate Out Item 
      { propertyName: "out_qty", dataType: "decimal" },            // Show 'out_qty' as decimal number
      { propertyName: generateInItem, dataType: "function" },      // Call function to generate In Item display 
      { propertyName: "in_qty", dataType: "decimal" }              // Show 'in_qty' as decimal number
  ];

  // Fill the HTML table body with ID 'tableDailyOutStockBody' using the fetched data and property mappings
  fillDataIntoReportTable(tableDailyOutStockBody, dailystockouts, propertyList);

  // Initialize the DataTables jQuery plugin on the table with ID 'tableDailyOutStock'
  // This adds features such as column sorting, pagination, and search functionality automatically
  $("#tableDailyOutStock").DataTable();
}


// Function to reset the Daily Out Stock form and reload all dropdown data with fresh values
const refreshOutStockForm = () => {

  // Reset all form fields to their default initial state (clears inputs, selects, etc.)
  formDailyOutStock.reset();    

  // Create a new empty object to temporarily hold Daily Out Stock data
  dailyOutStock = new Object();

  // Fetch latest data from backend APIs to populate dropdown menus (select elements)
  let outitems = getServiceRequest('ingredient/alldata');      // Fetch all ingredients for 'Out Item' select
  let batchnos = getServiceRequest('inventory/alldata');       // Fetch all inventory batches for 'Batch No' select
  let initems = getServiceRequest('ingredient/alldata');       // Fetch all ingredients for 'In Item' select

  // Populate each select dropdown with fetched data and add a default prompt option
  fillDataIntoSelect(selectOutItem, "Please Select Out Item", outitems, "itemname");
  fillDataIntoSelect(selectBatchNo, "Please Batch No", batchnos, "batch_number");
  fillDataIntoSelect(selectInItem, "Please Select In Item", initems, "itemname");

  // Manually reset or clear form elements that may not be cleared by form.reset()
  // This includes resetting selects, text inputs, and date inputs explicitly
  setDefault([
      dteOutDate,
      selectOutItem,
      selectBatchNo,
      textOutQty,
      selectInItem,
      textInQty
  ]);

  // Set the date input (dteOutDate) to allow only today's date

  // Get current date
  const today = new Date();

  // Extract year, month, day with leading zeros if needed
  const year = today.getFullYear();
  let month = today.getMonth() + 1;  // Months are zero-based
  let day = today.getDate();

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  // Format date as YYYY-MM-DD
  const formattedToday = `${year}-${month}-${day}`;

  // Set the minimum and maximum selectable date to today, effectively restricting input to today only
  dteOutDate.min = formattedToday;
  dteOutDate.max = formattedToday;
  dteOutDate.value = formattedToday;
  dailyOutStock.out_date = dteOutDate.value;

  // Visually indicate success by changing border color to green
  dteOutDate.classList.remove("is-invalid");
  dteOutDate.classList.add("is-valid");
  dteOutDate.style.border = "2px solid green";
  dteOutDate.style.backgroundColor = "#c6f6d5";
}



// Function to extract and return the Batch Number from the given DailyOutStock data object
const generateBatchNo = (dataOb) => {
  // Access the 'batch_number' property inside the nested 'from_inventory_id' object
  return dataOb.from_inventory_id.batch_number;
}

// Function to extract and return the Out Item name from the given DailyOutStock data object
const generateOutItem = (dataOb) => {
  // Access the 'name' property inside the nested 'from_ingredients_id' object
  return dataOb.from_ingredients_id.itemname;
}

// Function to extract and return the In Item name from the given DailyOutStock data object
const generateInItem = (dataOb) => {
  // Access the 'name' property inside the nested 'to_ingredients_id' object
  return dataOb.to_ingredients_id.itemname;
}



// Function to validate the Daily Out Stock form inputs and accumulate error messages if any field is invalid
const checkFormError = () => {
  let formInputErrors = ""; // Initialize empty string to collect error messages

  // Check if the stock out date is selected (not null)
  if (dailyOutStock.out_date == null) {
    formInputErrors += "❗📆 Please Select a Stock Out Date...! \n";
  }

  // Check if the Out Item (from_ingredients_id) is selected (not null)
  if (dailyOutStock.from_ingredients_id == null) {
    formInputErrors += "❗🧾 Please Select Out Item...! \n";
  }

  // Check if the Batch Number (from_inventory_id) is selected (not null)
  if (dailyOutStock.from_inventory_id == null) {
    formInputErrors += "❗🔢 Please Batch Number...! \n";
  }

  // Check if the Out Quantity (out_qty) is entered (not null)
  if (dailyOutStock.out_qty == null) {
    formInputErrors += "❗📊 Please Enter Out Qty...! \n";
  }

  // Check if the In Item (to_ingredients_id) is selected (not null)
  if (dailyOutStock.from_ingredients_id == null) { // <-- This line looks like a bug, see note below
    formInputErrors += "❗📦 Please Select In Item...! \n";
  }

  // Check if the In Quantity (in_qty) is entered (not null)
  if (dailyOutStock.in_qty == null) {
    formInputErrors += "❗⚖️ Please Enter In Qty...! \n";
  }

  // Return the concatenated error messages string (empty if no errors)
  return formInputErrors;
}



// Function to handle the submission of the Daily Out Stock form
const buttonOutStockSubmit = () => {
  console.log(dailyOutStock); // Log the current form data for debugging

  // Validate the form fields and collect any errors
  let errors = checkFormError();

  // If no errors, proceed to confirm submission
  if (errors === "") {
      // Show confirmation dialog using SweetAlert2
      Swal.fire({
          title: "Are you sure to add the following Stoc Out?",
          html:
              "<div style='text-align:left; font-size:14px'>" +
              "📅 <b>Date:</b> " + dailyOutStock.out_date + "<br>" +
              "📦 <b>Out Item:</b> " + dailyOutStock.from_ingredients_id.itemname + "<br>" +
              "🔢 <b>Batch No:</b> " + dailyOutStock.from_inventory_id.batch_number + "<br>" +
              "📊 <b>Out Qty:</b> " + dailyOutStock.out_qty + "<br>" +
              "📥 <b>In Item:</b> " + dailyOutStock.from_ingredients_id.itemname + "<br>" +
              "⚖️ <b>In Qty:</b> " + dailyOutStock.in_qty + "<br>" +
              "</div>",

          icon: "warning",
          width: "20em",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Add Stock Out"
      }).then((result) => {
          if (result.isConfirmed) {
              // Send POST request to save data on server
              let postResponse = getHTTPServiceRequest("/dailyoutstock/insert", "POST", dailyOutStock);

              // If server responds with OK, show success message and refresh UI
              if (postResponse === "OK") {
                  Swal.fire({
                      icon: "success",
                      width: "20em",
                      title: "Saved successfully!",
                      timer: 1500,
                      showConfirmButton: false
                  });

                  refreshOutStockTable(); // Reload the data table
                  refreshOutStockForm();  // Reset the form
              } else {
                  // If server returns error, show error popup with details
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
      // If form validation errors exist, show them in a warning popup
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
const clearOutStockForm = () => {
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
        refreshOutStockForm();
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


const filterFromBatch = () =>{
  let batchnos = getServiceRequest('/inventory/byingredient?ingredients_id=' + JSON.parse(selectOutItem.value).id);
  fillDataIntoSelect(selectBatchNo, "Please Batch No", batchnos, "batch_number");
}