// Add browser load event listener
window.addEventListener("load", () => {
    // Call function to refresh kitchen table on load
    refreshKitchenTable();
});

// Function to fill the kitchen table with orders
const fillKitchenTable = (tBodyId, datalist, columnList, inProgressFunction, readyFunction) => {

    // Clear existing rows
    tBodyId.innerHTML = "";

    // Loop through each order object in the list
    datalist.forEach((dataOb, index) => {

        // Create a new row
        let tr = document.createElement("tr");

        // Add a custom attribute to identify order ID
        tr.setAttribute("data-order-id", dataOb.id);

        // Create and append index column
        let tdIndex = document.createElement("td");
        tdIndex.innerText = parseInt(index + 1);
        tr.appendChild(tdIndex);

        // Loop through each column definition
        columnList.forEach(columnOb => {
            let td = document.createElement("td");

            // If column is string type, show direct property value
            if (columnOb.dataType == "string") {
                td.innerText = dataOb[columnOb.property];
            }

            // If column is function type, execute function and insert HTML
            if (columnOb.dataType == "function") {
                td.innerHTML = columnOb.property(dataOb);
            }

            tr.appendChild(td);
        });

        // Create a cell to hold action buttons
        let tdButtons = document.createElement("td");

        // Create In-Progress button
        let inProgressButton = document.createElement("button");
        inProgressButton.className = "btn btn-sm btn-warning me-2";
        inProgressButton.innerText = "In-Progress";
        inProgressButton.setAttribute("id", "inProgress-" + dataOb.id); // Set unique ID

        // Set In-Progress button click handler
        inProgressButton.onclick = () => {
            inProgressFunction(dataOb, index);
        };

        // Append In-Progress button to button cell
        tdButtons.appendChild(inProgressButton);

        // Create Ready to Serve button (initially hidden)
        let readyButton = document.createElement("button");
        readyButton.className = "btn btn-sm btn-success me-2 d-none";
        readyButton.innerText = "Ready to Serve";
        readyButton.setAttribute("id", "ready-" + dataOb.id);

        // Set Ready button click handler
        readyButton.onclick = () => {
            readyFunction(dataOb, index);
        };

        // Append Ready button to button cell
        tdButtons.appendChild(readyButton);

        // If kitchen status is "In-Progress" (ID 2), hide In-Progress button and show Ready button
        if (dataOb.kitchen_status_id && dataOb.kitchen_status_id.id == 2) {
            inProgressButton.classList.add("d-none");
            readyButton.classList.remove("d-none");
        }

        // Append button cell to the row
        tr.appendChild(tdButtons);

        // Append the row to the table body
        tBodyId.appendChild(tr);
    });
}


// Create refresh table function
const refreshKitchenTable = () => {
    // Fetch orders based on kitchen status (commented out for now)
    // let orders = getServiceRequest("/order/alldata");

    // Fetch only orders that are new or in-progress (commented out)
    let orderbyStatuses = getServiceRequest("/order/bynewandinprogress");

    // Placeholder array for orders (should be replaced by actual API call)
    // let orderbyStatuses = [];

    // Define columns to be displayed in the table
    // dataType "string" is for direct text values (like order code)
    // dataType "function" is for derived or nested values (like order type, status)
    let columns = [
        { property: "order_code", dataType: "string" },             // Direct order code
        { property: getOrderType, dataType: "function" },          // Custom function to get order type
        { property: getOrderStatus, dataType: "function" },        // Custom function to get order status
        { property: getKitchenStatus, dataType: "function" },      // Custom function to get kitchen status
    ];

    // Fill the table with order data using fillKitchenTable function
    fillKitchenTable(tableKitchenBody, orderbyStatuses, columns, buttonInProgress, buttonComplete);

    // Initialize DataTables plugin for advanced table features
    $('#tableKitchen').DataTable();
}

// Define function to return formatted HTML based on order status
const getOrderStatus = (dataOb) => {
    // If status is "New"
    if (dataOb.order_status_id.id == 1) {
        return "<button class='btn btn-sm btn-info text-center'>" + dataOb.order_status_id.name + "</button>";
    }
    // If status is "In-Progress"
    if (dataOb.order_status_id.id == 2) {
        return "<button class='btn btn-sm btn-warning text-center'>" + dataOb.order_status_id.name + "</button>";
    }
    // If status is "Ready"
    if (dataOb.order_status_id.id == 3) {
        return "<button class='btn btn-sm btn-success text-center'>" + dataOb.order_status_id.name + "</button>";
    }
    // Default return (fallback)
    return dataOb.order_status_id.name;
}

// Define function to return formatted HTML based on kitchen status
const getKitchenStatus = (dataOb) => {
    // Check if kitchen status is not null
    if (dataOb.kitchen_status_id != null) {
        // If status is "Pending"
        if (dataOb.kitchen_status_id.id == 1) {
            return "<button class='btn btn-sm btn-warning text-center'>" + dataOb.kitchen_status_id.name + "</button>";
        }
        // If status is "In-Progress"
        if (dataOb.kitchen_status_id.id == 2) {
            return "<button class='btn btn-sm btn-warning text-center'>" + dataOb.kitchen_status_id.name + "</button>";
        }
        // If status is "Ready"
        if (dataOb.kitchen_status_id.id == 3) {
            return "<button class='btn btn-sm btn-success text-center'>" + dataOb.kitchen_status_id.name + "</button>";
        }
    } else {
        // If no status is available
        return "-";
    }
}

// Define function to return formatted HTML based on order type
const getOrderType = (dataOb) => {
    // For Dine In
    if (dataOb.order_type_id.name == "Dine In") {
        return "<p class='btn btn-sm btn-primary text-center'>" + dataOb.order_type_id.name + "</p>";
    }
    // For Take Away
    if (dataOb.order_type_id.name == "Take Away") {
        return "<p class='btn btn-sm btn-primary text-center'>" + dataOb.order_type_id.name + "</p>";
    }
    // For Pick Up
    if (dataOb.order_type_id.name == "Pick Up") {
        return "<p class='btn btn-sm btn-primary text-center'>" + dataOb.order_type_id.name + "</p>";
    }
    // For Delivery
    if (dataOb.order_type_id.name == "Delivery") {
        return "<p class='btn btn-sm btn-primary text-center'>" + dataOb.order_type_id.name + "</p>";
    }

    // Default return
    return dataOb.order_type_id.name;
}


// define function to fill a table inside the offcanvas (inner form table)
const fillInfoTable = (InnertBody, datalist, columnList) => {

    // clear previous table rows
    InnertBody.innerHTML = "";

    // loop through each data object in the list
    datalist.forEach((dataOb, index) => {
        let tr = document.createElement("tr"); // create new table row

        let tdIndex = document.createElement("td"); // create index cell
        tdIndex.innerText = parseInt((index) + 1); // set index number (1-based)
        tr.appendChild(tdIndex); // add index to row

        // loop through columns to fill data into cells
        columnList.forEach(columnOb => {
            let td = document.createElement("td"); // create cell

            if (columnOb.dataType == "string") {
                // if it's a string, display the property value from object
                td.innerText = dataOb[columnOb.property];
            }
            if (columnOb.dataType == "function") {
                // if it's a function, call it with the object and use the result as HTML
                td.innerHTML = columnOb.property(dataOb);
            }
            if (columnOb.dataType == "decimal") {
                // convert decimal value and show with two decimal places
                td.innerText = parseFloat(dataOb[columnOb.property]).toFixed(2);
            }
            tr.appendChild(td); // add the cell to the row
        });

        InnertBody.appendChild(tr); // add the row to the table body
    });
}

// function to handle In Progress button click
const buttonInProgress = (dataOb, rowIndex) => {
    // show kitchen offcanvas panel
    $('#offcanvasKitchen').offcanvas('show');

    // get submenu items from the order
    const orderHasItems = dataOb.orderHasitemList;

    // define columns to display submenu data
    let columnSubmenu = [
        { property: "name", dataType: "string" },
        { property: "qty", dataType: "string" },
        { property: "completed_qty", dataType: "string" }
    ];
    // fill submenu table
    fillInfoTable(tBodyKitchenSubmenus, orderHasItems, columnSubmenu);



    // create list to hold all required ingredients
    let ingredientList = [];

    // process ingredients from submenu items
    for (const ohitem of dataOb.orderHasitemList) {
        if (ohitem.item_type == "submenu") {
            let submenu = getServiceRequest("/submenu/byname/" + ohitem.name);
            for (const submenuIng of submenu.submenuHasIngredientList) {
                let extIngredient = ingredientList.map(item => item.ingredients_id.id).indexOf(submenuIng.ingredients_id.id);
                if (extIngredient > -1) {
                    // if ingredient already exists, add required quantity
                    let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                    ingredientList[extIngredient].required_qty += parseFloat(submenuIng.qty) * parseFloat(order_qty);
                } else {
                    // if ingredient not in list, add it
                    let orderHasIng = new Object();
                    let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                    orderHasIng.required_qty = parseFloat(submenuIng.qty) * parseFloat(order_qty);
                    orderHasIng.available_qty = 0;
                    orderHasIng.ingredients_id = submenuIng.ingredients_id;
                    ingredientList.push(orderHasIng);
                }
            }
        }

        if (ohitem.item_type == "liquormenu") {
            let liquormenu = getServiceRequest("/liquormenu/byname/" + ohitem.name);
            for (const submenuIng of liquormenu.liquorMenuHasIngredientList) {
                let extIngredient = ingredientList.map(item => item.ingredients_id.id).indexOf(submenuIng.ingredients_id.id);
                if (extIngredient > -1) {
                    // if ingredient already exists, add required quantity
                    let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                    ingredientList[extIngredient].required_qty += parseFloat(submenuIng.qty) * parseFloat(order_qty);
                } else {
                    // if ingredient not in list, add it
                    let orderHasIng = new Object();
                    let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                    orderHasIng.required_qty = parseFloat(submenuIng.qty) * parseFloat(order_qty);
                    orderHasIng.available_qty = 0;
                    orderHasIng.ingredients_id = submenuIng.ingredients_id;
                    ingredientList.push(orderHasIng);
                }
            }
        }

        if (ohitem.item_type == "menu") {
            let menu = getServiceRequest("/menu/byname/" + ohitem.name);

            for (const mitem of menu.menuHasSubMenuList) {
                for (const submenuIng of mitem.submenu_id.submenuHasIngredientList) {
                    let extIngredient = ingredientList.map(item => item.ingredients_id.id).indexOf(submenuIng.ingredients_id.id);
                    if (extIngredient > -1) {
                        // if ingredient already exists, add required quantity
                        let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                        ingredientList[extIngredient].required_qty += parseFloat(submenuIng.qty) * parseFloat(order_qty);
                    } else {
                        // if ingredient not in list, add it
                        let orderHasIng = new Object();
                        let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                        orderHasIng.required_qty = parseFloat(submenuIng.qty) * parseFloat(order_qty);
                        orderHasIng.available_qty = 0;
                        orderHasIng.ingredients_id = submenuIng.ingredients_id;
                        ingredientList.push(orderHasIng);
                    }
                }
            }
            for (const mlitem of menu.menuHasLiquorMenuList) {
                for (const submenuIng of mlitem.liquormenu_id.liquorMenuHasIngredientList) {
                    let extIngredient = ingredientList.map(item => item.ingredients_id.id).indexOf(submenuIng.ingredients_id.id);
                    if (extIngredient > -1) {
                        // if ingredient already exists, add required quantity
                        let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                        ingredientList[extIngredient].required_qty += parseFloat(submenuIng.qty) * parseFloat(order_qty);
                    } else {
                        // if ingredient not in list, add it
                        let orderHasIng = new Object();
                        let order_qty = parseFloat(ohitem.qty) - parseFloat(ohitem.completed_qty)
                        orderHasIng.required_qty = parseFloat(submenuIng.qty) * parseFloat(order_qty);
                        orderHasIng.available_qty = 0;
                        orderHasIng.ingredients_id = submenuIng.ingredients_id;
                        ingredientList.push(orderHasIng);
                    }
                }
            }

        }
    }
        console.log(ingredientList);


        // check available stock from inventory for each ingredient
         for (const itemIng of ingredientList) {
             const availableInventory = getServiceRequest("/inventory/byingredient?ingredients_id=" + itemIng.ingredients_id.id);
             let total_ava_qty = 0;
             for (const invItem of availableInventory) {
                 total_ava_qty += parseFloat(invItem.available_qty);
             }
             itemIng.available_qty = total_ava_qty;
         } 

        // define columns to display inventory data
        let columnIngredients = [
            { property: getInventoryName, dataType: "function" },
            { property: "required_qty", dataType: "string" },
            { property: "available_qty", dataType: "string" },
        ];

        // fill inventory table
        fillInfoTable(tBodyInventory, ingredientList, columnIngredients);

        // flag to track low stock items
        let lowStore = false;

        // check if available stock is less than required and highlight those rows
        for (const itemIng in ingredientList) {
            if (parseFloat(ingredientList[itemIng].required_qty) > parseFloat(ingredientList[itemIng].available_qty)) {
                tBodyInventory.children[itemIng].style.backgroundColor = "#f8d7da"; // light red background
                tBodyInventory.children[itemIng].style.color = "#721c24"; // red text
                lowStore = true;
            }
        }

        // disable confirm button if any ingredient is in low stock
        if (lowStore) {
            buttonSubmit.disabled = "disabled";
        }

        // attach ingredient list to order object
        order = dataOb;
    order.orderHasIngredientList = ingredientList;

        // enable datatable plugin for inventory table
        $('#tableInventory').DataTable();
    }

    // Return submenu name from the submenu object
    /* const getSubmenuName = (dataOb) => {
        return dataOb.submenu_id.name;
    } */

    // Return menu item name from the menuitems object
    /* const getMenuName = (dataOb) => {
        return dataOb.menuitems_id.name;
    };
     */
    // Return formatted inventory name with unit details
    const getInventoryName = (dataOb) => {
        return dataOb.ingredients_id.itemname +
            "( " + dataOb.ingredients_id.unitsize+ " " + dataOb.ingredients_id.unit_type_id.name + " )";
    }

    // Function to confirm an order in the kitchen
    const orderConfirm = () => {
        // Show confirmation dialog using SweetAlert2 before confirming the order
        Swal.fire({
            title: "Are you sure you want to Confirm above Order?",
            icon: "warning",
            width: "20em",
            showCancelButton: true,               // Allow cancel option
            confirmButtonColor: "#3085d6",        // Blue confirm button
            cancelButtonColor: "#d33",            // Red cancel button
            confirmButtonText: "Yes, Confirm!"    // Confirm button text
        }).then((result) => {
            if (result.isConfirmed) {
                // If user confirms, call backend API to update order status to 'In Progress'
                let updateResponse = getHTTPServiceRequest('/kitchen/inprogressStatus', "PUT", order);

                if (updateResponse === "OK") {
                    // On success, show success notification
                    Swal.fire({
                        icon: "success",
                        width: "20em",
                        title: "Order Successful..!",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });

                    // Close the kitchen offcanvas panel and refresh the kitchen orders table
                    $('#offcanvasKitchen').offcanvas('hide');
                    refreshKitchenTable();
                } else {
                    // On failure, show error message with returned details
                    Swal.fire({
                        icon: "error",
                        width: "20em",
                        title: "Failed to Confirm Order",
                        html: "<pre>" + updateResponse + "</pre>",
                        draggable: true
                    });
                }
            }
        });
    }

    // Function to mark an order as complete in the kitchen
    const buttonComplete = (dataOb) => {
        // Show confirmation dialog to complete the order
        Swal.fire({
            title: "Are you sure you want to Complete above Order?",
            icon: "warning",
            width: "20em",
            showCancelButton: true,               // Allow cancel option
            confirmButtonColor: "#3085d6",        // Blue confirm button
            cancelButtonColor: "#d33",            // Red cancel button
            confirmButtonText: "Yes, Complete!"   // Confirm button text
        }).then((result) => {
            if (result.isConfirmed) {
                // Call backend API to update order status to 'Completed'
                let updateResponse = getHTTPServiceRequest('/kitchen/completedStatus', "PUT", dataOb);

                if (updateResponse === "OK") {
                    // On success, show success notification
                    Swal.fire({
                        icon: "success",
                        width: "20em",
                        title: "Order Completed..!",
                        timer: 1500,
                        showConfirmButton: false,
                        draggable: true
                    });

                    // Close kitchen modal and refresh the kitchen orders table
                    $('#offcanvasKitchen').offcanvas('hide');
                    refreshKitchenTable();
                } else {
                    // On failure, show error message with returned details
                    Swal.fire({
                        icon: "error",
                        width: "20em",
                        title: "Failed to Complete Order",
                        html: "<pre>" + updateResponse + "</pre>",
                        draggable: true
                    });
                }
            }
        });
    }

    const itemsPrint = (orderData, rowIndex) => {
        console.log("Printing order:", orderData, rowIndex); // Log info for debugging

        // Get current date and time string for the print header
        const currentDateTime = new Date().toLocaleString();

        // Open a new browser window/tab for the print content
        const printWindow = window.open();

        // Construct the full HTML content to print, including styles and tables
        const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <!-- Link to external Bootstrap CSS for styling -->
      <link rel="stylesheet" href="/resources/bootstrap-5.2.3/css/bootstrap.min.css">

      <!-- Link to custom print stylesheet -->
      <link rel="stylesheet" href="/resources/css/print.css">

      <style>
        /* Inline styles for print layout */
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header img {
          max-width: 120px;
          margin-bottom: 10px;
        }
        .header h1 {
          margin: 0;
        }
        .date-time {
          font-size: 14px;
          color: #777;
        }
        .items-section {
          margin-top: 20px;
        }
        .items-section h3 {
          margin-bottom: 15px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .items-table th, .items-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .items-table th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <!-- Company logo -->
        <img src="/resources/images/bando1.png" alt="Logo">

        <!-- Title of the print document -->
        <h1>Ordered Items</h1>

        <!-- Date and time printed -->
        <div class="date-time">Printed on: ${currentDateTime}</div>
      </div>

      <div class="items-section">
        <!-- Menu items table -->
        <h3>Menu Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${tBodyKitchenMenus.outerHTML}  <!-- Insert the inner HTML of menu items table body -->
          </tbody>
        </table>

        <!-- Submenu items table -->
        <h3>Submenu Items</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${tBodyKitchenSubmenus.outerHTML}  <!-- Insert the inner HTML of submenu items table body -->
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `;

        // Write the constructed HTML to the new window document
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Delay to ensure content loads before triggering print dialog
        setTimeout(() => {
            printWindow.stop();     // Stop any further loading
            printWindow.print();    // Trigger print dialog
            printWindow.close();    // Close the print window after printing
        }, 500);
    }
