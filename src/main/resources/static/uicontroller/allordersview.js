// Create a browser window load event listener
// This code runs only after the entire page (HTML, CSS, JS) has fully loaded
window.addEventListener("load", () => {

  // Call the function to refresh or load the order table data
  refreshOrderTable();

});


// Call refreshOrderTable() inside browser load, submit, update, and delete functions
const refreshOrderTable = () => {

  // Fetch order data from the backend using a reusable service function
  // The function getServiceRequest sends a GET request to the endpoint and returns the data
  let orders = getServiceRequest("/all/orderlist");

  // Define the list of properties (columns) to be shown in the order table
  // Each object specifies what property to show and how to handle its data
  // - "string", "decimal" are standard types handled directly
  // - "function" means a custom function will generate the value for that column
  let propertyList = [
    { propertyName: "order_code", dataType: "string" },
    { propertyName: "date", dataType: "string" },
    { propertyName: generateOrderType, dataType: "function" },
    { propertyName: generateCustomerName, dataType: "function" },
    { propertyName: generateCustomerContactNo, dataType: "function" },
    { propertyName: "total_amount", dataType: "decimal" },
    { propertyName: "net_charge", dataType: "decimal" },
    { propertyName: generateOrderStatus, dataType: "function" }
  ];

  // Fill the HTML table with the retrieved data
  // Parameters:
  // - tableOrderBody: the HTML table body where rows will be added
  // - orders: the order data list
  // - propertyList: list of column definitions
  // - OrderFormRefill: function to refill form when editing
  // - orderDelete: function to delete an order
  // - OrderView: function to view order details
  fillDataIntoReportTable(
    tableAllOrdersBody,
    orders,
    propertyList
  );

  // Initialize DataTables plugin for this table (adds features like search, pagination, sorting)
  $("#tableAllOrders").DataTable();
}

// Function to generate the order type from the data object
const generateOrderType = (dataOb) => {
  // Access and return the order type name using the order_type_id reference
  return dataOb.order_type_id.name;
}

// Function to generate the customer name from the data object
const generateCustomerName = (dataOb) => {
  // Access and return the customer's name using the customer_id reference
  return dataOb.customer_id.name;
}

// Function to generate the customer contact number from the data object
const generateCustomerContactNo = (dataOb) => {
  // Access and return the customer's contact number using the customer_id reference
  return dataOb.customer_id.contactno;
}




// Function to generate the order status icon based on the status name
const generateOrderStatus = (dataOb) => {

  // Check if the order status is "Pending"
  if (dataOb.order_status_id.name == "New") {
    return (
      // Return an orange receipt icon to indicate "Pending" status
      "<i class='fa-solid fa-circle-dot fa-lg text-primary'></i>"
    );
  }
  if (dataOb.order_status_id.name == "In Progress") {
    return (
      // Return an orange receipt icon to indicate "Pending" status
      "<i class='fa-solid fa-spinner fa-lg text-warning'></i>"
    );
  }
  if (dataOb.order_status_id.name == "Ready") {
    return (
      // Return an orange receipt icon to indicate "Pending" status
      "<i class='fa-solid fa-bell fa-lg text-info'></i>"
    );
  }

  // Check if the order status is "Completed"
  if (dataOb.order_status_id.name == "Complete") {
    return (
      // Return a green receipt icon to indicate "Completed" status
      "<i class='fa-solid fa-check-circle fa-lg text-success'></i>"
    );
  }

  // Check if the order status is "Cancelled"
  if (dataOb.order_status_id.name == "Cancelled") {
    return (
      // Return a red receipt icon to indicate "Cancelled" status
      "<i class='fa-solid fa-times-circle fa-lg text-danger'></i>"
    );
  }
}
