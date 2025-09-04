//Create browser load event
window.addEventListener("load", () => {
  refreshInventoryTable();
});

// Create refresh table area function
// Call refreshEmployeeTable() in browser,submit,update,delete functions
const refreshInventoryTable = () => {
    //=============================================================================================================

    // Fetch employee data using the getServiceRequest common function
    let inventories = getServiceRequest('/inventory/alldata');


    // Create colums array and objects for each column
    // string ===> string / date / number
    // function ===> object / array / boolean
    let propertyList = [
      { propertyName: "batch_number", dataType: "string" },
      { propertyName: getItemName, dataType: "function", },
      { propertyName: "manufact_date", dataType: "string" },
      { propertyName: "expire_date", dataType: "string" },
      { propertyName: "total_qty", dataType: "decimal" },
      { propertyName: getUsedQty, dataType: "function" },
      { propertyName: "removed_qty", dataType: "decimal" },
      { propertyName: "available_qty", dataType: "decimal" },
      { propertyName: generateStatus, dataType: "function", }
    ];

    // Call fillDataIntoTable(tableBodyId,dataList,properyList,garbageRemoveFormRefill,garbageRemoveDelete,garbageRemoveView)
    // and passs the parameters;
    fillDataIntoTable(tableInventoryBody, inventories, propertyList,inventoryFormRefill,inventoryDelete,inventoryView,false);
    $("#tableInventory").DataTable(); // identify table using jQuery

   
}

// Define a function to generate item name
const getItemName = (ob) => {
  return ob.ingredients_id.itemname;
}

// Define a function to calculate used qty
const getUsedQty = (ob) => {
  return (ob.total_qty - ob.available_qty).toFixed(2); // keep 3 decimal places
};
// Define a function to generate status 
const generateStatus = (dataOb) => {

  if (dataOb.available_qty <= 0) {
    return "<i class='fa-solid fa-file-circle-minus fa-lg text-danger'></i>"; // Red icon
  }
  if (dataOb.available_qty < 5) {
    return "<i class='fa-solid fa-file-circle-exclamation fa-lg text-warning'></i>"; // Yellow icon
  }
  if (dataOb.available_qty >= 5) {
    return "<i class='fa-solid fa-file-circle-check fa-lg text-success'></i>"; // Green icon
  }
};

//<i class="fa-solid fa-file-circle-minus"></i>

// Define a function to generate item name
const inventoryFormRefill = (ob) => {
}
// Define a function to generate item name
const inventoryDelete = (ob) => {
}
// Define a function to generate item name
// Define a function to generate item name
const inventoryView = (ob) => {
}