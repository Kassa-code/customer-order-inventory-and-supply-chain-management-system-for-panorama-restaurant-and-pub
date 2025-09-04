//Define function to fillDataIntoTable (tableBodyId, dataList, propertyList,editFunctionName
// ,deleteFunctionName,viewFunctionName)
const fillDataIntoTable = (tableBodyId, dataList, propertyList, editFunction, deleteFunction, viewFunction,buttonVisibility=true) => {

    // Clear existing table content before adding new rows
    tableBodyId.innerHTML = "";

    // Loop through the data list and create a row for each item
    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr"); // Create a new table row

        // Create and append the index column
        let tdIndex = document.createElement("td");
        tdIndex.innerText = index + 1; // Display row number (1-based index)
        tr.appendChild(tdIndex);

        // Loop through each property defined in the propertyList to create table cells dynamically
        for (const property of propertyList) {
            // Create a new table cell (td) element
            let td = document.createElement("td");

            // Handle "string" data type
            if (property.dataType === "string") {
                // Set the cell text to the string value from the data object
                td.innerText = dataOb[property.propertyName]; // Display plain string
            }

            // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
            // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
            if (property.dataType === "decimal") {
                const value = dataOb[property.propertyName];
                // Check if the value is a valid number before formatting
                td.innerText = !isNaN(value) && value !== null ?
                    parseFloat(value).toFixed(2) :
                    "-"; // Display "-" if the value is invalid or null
            }

            // Handle "function" data type
            if (property.dataType === "function") {
                // Call the function with the current data object and insert its return HTML
                td.innerHTML = property.propertyName(dataOb); // Display custom HTML (e.g., icons)
            }

           // Handle "image-array" data type
            if (property.dataType === "image-array") {

              // Create an <img> element to display the image
              let img = document.createElement("img");
              img.className = "w-50 h-50 rounded-circle"; // Apply Bootstrap classes for size and styling

              // Check if the image data (base64 string) exists in the current data object
              if (dataOb[property.propertyName] != null) {
                // Decode the base64 string and set it as the image source
                img.src = atob(dataOb[property.propertyName]);
              } else {
                // If no image data, set a default profile image
                img.src = "/images/profile.png";
              }

            // Append the image element to the current table cell (td)
              td.appendChild(img);
            }


            // Append the table cell (td) to the current row (tr)
            tr.appendChild(td);
        }


        // Create a column for action buttons
        let tdButtons = document.createElement("td");
        let div = document.createElement("div");
        div.className = "dropdown"; // Assign dropdown class
        tdButtons.appendChild(div);

        // Create dropdown toggle button
        let dropDownButton = document.createElement("button");
        dropDownButton.className = "btn btn-light btn-sm dropdown-toggle fw-bold";
        dropDownButton.setAttribute("data-bs-toggle", "dropdown");
        dropDownButton.setAttribute("aria-expanded", "false");
        dropDownButton.innerText = "Actions";
        dropDownButton.style.backgroundColor = "transparent";
        dropDownButton.style.border = "none";
        dropDownButton.style.boxShadow = "none";
        dropDownButton.style.fontSize = "15px";

        // Change color to primary on hover
        dropDownButton.addEventListener("mouseover", () => {
            dropDownButton.style.color = "#0000FF";
        });

        // Reset color on mouse out
        dropDownButton.addEventListener("mouseout", () => {
            dropDownButton.style.color = ""; // Reset to default color
        });
        div.appendChild(dropDownButton);

        // Create dropdown menu
        let dropDownUl = document.createElement("ul");
        dropDownUl.className = "dropdown-menu";
        div.appendChild(dropDownUl);

        // Create Edit button in dropdown
        let liEdit = document.createElement("li");
        liEdit.className = "dropdown-item";
        let buttonEdit = document.createElement("button");
        buttonEdit.className = " custom-btn btn btn-sm btn-outline-warning fw-bold me-2";
        buttonEdit.innerHTML = "<i class='fa-solid fa-pen-to-square fa-sm;'></i> Edit";
        buttonEdit.onclick = () => {
            console.log("Edit", dataOb);
            editFunction(dataOb, index); // Call the edit function

        }
        liEdit.appendChild(buttonEdit);
        dropDownUl.appendChild(liEdit);

        // Create Delete button in dropdown
        let liDelete = document.createElement("li");
        liDelete.className = "dropdown-item";
        let buttonDelete = document.createElement("button");
        buttonDelete.className = "custom-btn btn btn-sm btn-outline-danger fw-bold me-2";
      buttonDelete.innerHTML = "<i class='fa-solid fa-trash-can-arrow-up fa-sm'></i> Delete";
        buttonDelete.onclick = () => {
                console.log("Delete", dataOb);
                deleteFunction(dataOb, index); // Call the delete function
            }
            //liDelete.appendChild(buttonDelete); //Vertical line
        liEdit.appendChild(buttonDelete); //Horizontanal line
        dropDownUl.appendChild(liDelete);

        // Create View button in dropdown
        let liView = document.createElement("li");
        liView.className = "dropdown-item";
        let buttonView = document.createElement("button");
        buttonView.className = "custom-btn btn btn-sm btn-outline-info fw-bold";
        buttonView.innerHTML = "<i class='fa-solid fa-file-invoice'></i> View";
        buttonView.onclick = () => {
                console.log("View", dataOb);
                viewFunction(dataOb, index); // Call the view function
            }
            //liView.appendChild(buttonView); //Vertical line
        liEdit.appendChild(buttonView); //Horizontonal line
        dropDownUl.appendChild(liView);

        // Append action buttons and row to the table
        if(buttonVisibility){
        tr.appendChild(tdButtons);
       }

        tableBodyId.appendChild(tr);
    });
};

const fillDataIntoReportTable = (tableBodyId, dataList, propertyList) => {

    // Clear existing table content before adding new rows
    tableBodyId.innerHTML = "";

    // Loop through the data list and create a row for each item
    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr"); // Create a new table row

        // Create and append the index column
        let tdIndex = document.createElement("td");
        tdIndex.innerText = index + 1; // Display row number (1-based index)
        tr.appendChild(tdIndex);

        // Loop through each property defined in the propertyList to create table cells dynamically
        for (const property of propertyList) {
            // Create a new table cell (td) element
            let td = document.createElement("td");

            // Handle "string" data type
            if (property.dataType === "string") {
                // Set the cell text to the string value from the data object
                td.innerText = dataOb[property.propertyName]; // Display plain string
            }

            // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
            // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
            if (property.dataType === "decimal") {
                const value = dataOb[property.propertyName];
                // Check if the value is a valid number before formatting
                td.innerText = !isNaN(value) && value !== null ?
                    parseFloat(value).toFixed(2) :
                    "-"; // Display "-" if the value is invalid or null
            }

            // Handle "function" data type
            if (property.dataType === "function") {
                // Call the function with the current data object and insert its return HTML
                td.innerHTML = property.propertyName(dataOb); // Display custom HTML (e.g., icons)
            }

           // Handle "image-array" data type
            if (property.dataType === "image-array") {

              // Create an <img> element to display the image
              let img = document.createElement("img");
              img.className = "w-25 h-25 rounded-circle"; // Apply Bootstrap classes for size and styling

              // Check if the image data (base64 string) exists in the current data object
              if (dataOb[property.propertyName] != null) {
                // Decode the base64 string and set it as the image source
                img.src = atob(dataOb[property.propertyName]);
              } else {
                // If no image data, set a default profile image
                img.src = "/images/profile.png";
              }

            // Append the image element to the current table cell (td)
              td.appendChild(img);
            }
            // Append the table cell (td) to the current row (tr)
            tr.appendChild(td);
        }
        tableBodyId.appendChild(tr);
    });
};

// Define a function to fill data into table without delete
const fillDataIntoTableTwo = (tableBodyId, dataList, propertyList, editFunction,viewFunction) => {

    // Clear existing table content before adding new rows
    tableBodyId.innerHTML = "";

    // Loop through the data list and create a row for each item
    dataList.forEach((dataOb, index) => {
        let tr = document.createElement("tr"); // Create a new table row

        // Create and append the index column
        let tdIndex = document.createElement("td");
        tdIndex.innerText = index + 1; // Display row number (1-based index)
        tr.appendChild(tdIndex);

        // Loop through each property defined in the propertyList to create table cells dynamically
        for (const property of propertyList) {
            // Create a new table cell (td) element
            let td = document.createElement("td");

            // Handle "string" data type
            if (property.dataType === "string") {
                // Set the cell text to the string value from the data object
                td.innerText = dataOb[property.propertyName]; // Display plain string
            }

            // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
            // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
            if (property.dataType === "decimal") {
                const value = dataOb[property.propertyName];
                // Check if the value is a valid number before formatting
                td.innerText = !isNaN(value) && value !== null ?
                    parseFloat(value).toFixed(2) :
                    "-"; // Display "-" if the value is invalid or null
            }

            // Handle "function" data type
            if (property.dataType === "function") {
                // Call the function with the current data object and insert its return HTML
                td.innerHTML = property.propertyName(dataOb); // Display custom HTML (e.g., icons)
            }

            // Append the table cell (td) to the current row (tr)
            tr.appendChild(td);
        }


        // Create a column for action buttons
        let tdButtons = document.createElement("td");
        let div = document.createElement("div");
        div.className = "dropdown"; // Assign dropdown class
        tdButtons.appendChild(div);

        // Create dropdown toggle button
        let dropDownButton = document.createElement("button");
        dropDownButton.className = "btn btn-light btn-sm dropdown-toggle fw-bold";
        dropDownButton.setAttribute("data-bs-toggle", "dropdown");
        dropDownButton.setAttribute("aria-expanded", "false");
        dropDownButton.innerText = "Actions";
        dropDownButton.style.backgroundColor = "transparent";
        dropDownButton.style.border = "none";
        dropDownButton.style.boxShadow = "none";
        dropDownButton.style.fontSize = "15px";

        // Change color to primary on hover
        dropDownButton.addEventListener("mouseover", () => {
            dropDownButton.style.color = "#0000FF";
        });

        // Reset color on mouse out
        dropDownButton.addEventListener("mouseout", () => {
            dropDownButton.style.color = ""; // Reset to default color
        });
        div.appendChild(dropDownButton);

        // Create dropdown menu
        let dropDownUl = document.createElement("ul");
        dropDownUl.className = "dropdown-menu";
        div.appendChild(dropDownUl);

        // Create Edit button in dropdown
        let liEdit = document.createElement("li");
        liEdit.className = "dropdown-item";
        let buttonEdit = document.createElement("button");
        buttonEdit.className = " custom-btn btn btn-sm btn-outline-warning fw-bold me-2";
        buttonEdit.innerHTML = "<i class='fa-solid fa-trash-can-arrow-up fa-sm;'></i> Edit";
        buttonEdit.onclick = () => {
            console.log("Edit", dataOb);
            editFunction(dataOb, index); // Call the edit function

        }
        liEdit.appendChild(buttonEdit);
        dropDownUl.appendChild(liEdit);

        // Create View button in dropdown
        let liView = document.createElement("li");
        liView.className = "dropdown-item";
        let buttonView = document.createElement("button");
        buttonView.className = "custom-btn btn btn-sm btn-outline-info fw-bold";
        buttonView.innerHTML = "<i class='fa-solid fa-file-invoice'></i> View";
        buttonView.onclick = () => {
                console.log("View", dataOb);
                viewFunction(dataOb, index); // Call the view function
            }
            //liView.appendChild(buttonView); //Vertical line
        liEdit.appendChild(buttonView); //Horizontonal line
        dropDownUl.appendChild(liView);

        // Append action buttons and row
        tr.appendChild(tdButtons);

        tableBodyId.appendChild(tr);
    });
};


//Define function to fillDataIntoInnerTable (tableBodyId, dataList, propertyList,editFunctionName
// ,deleteFunctionName)
const fillDataIntoInnerTable = (tableBodyId,dataList,propertyList,editFunction,deleteFunction,buttonVisibility=true) => {
  // Clear existing table content before adding new rows
  tableBodyId.innerHTML = "";

  // Loop through the data list and create a row for each item
  dataList.forEach((dataOb, index) => {
    let tr = document.createElement("tr"); // Create a new table row

    // Create and append the index column
    let tdIndex = document.createElement("td");
    tdIndex.innerText = index + 1; // Display row number (1-based index)
    tr.appendChild(tdIndex);

    // Loop through each property defined in the propertyList to create table cells dynamically
    for (const property of propertyList) {
      // Create a new table cell (td) element
      let td = document.createElement("td");

      // Handle "string" data type
      if (property.dataType === "string") {
        // Set the cell text to the string value from the data object
        td.innerText = dataOb[property.propertyName]; // Display plain string
      }

      // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
      // Handle "decimal" data type separately (not as else-if, so it works even if combined logic is needed)
      if (property.dataType === "decimal") {
        const value = dataOb[property.propertyName];
        // Check if the value is a valid number before formatting
        td.innerText =
          !isNaN(value) && value !== null ? parseFloat(value).toFixed(2) : "-"; // Display "-" if the value is invalid or null
      }

      // Handle "function" data type
      if (property.dataType === "function") {
        // Call the function with the current data object and insert its return HTML
        td.innerHTML = property.propertyName(dataOb); // Display custom HTML (e.g., icons)
      }

      // Append the table cell (td) to the current row (tr)
      tr.appendChild(td);
    }

    // Create a column for action buttons
    let tdButtons = document.createElement("td");
    let div = document.createElement("div");
    div.className = "dropdown"; // Assign dropdown class
    tdButtons.appendChild(div);

    // Create dropdown toggle button
    let dropDownButton = document.createElement("button");
    dropDownButton.className = "btn btn-light btn-sm dropdown-toggle fw-bold";
    dropDownButton.setAttribute("data-bs-toggle", "dropdown");
    dropDownButton.setAttribute("aria-expanded", "false");
    dropDownButton.innerText = "Actions";
    dropDownButton.style.backgroundColor = "transparent";
    dropDownButton.style.border = "none";
    dropDownButton.style.boxShadow = "none";
    dropDownButton.style.fontSize = "15px";

    // Change color to primary on hover
    dropDownButton.addEventListener("mouseover", () => {
      dropDownButton.style.color = "#0000FF";
    });

    // Reset color on mouse out
    dropDownButton.addEventListener("mouseout", () => {
      dropDownButton.style.color = ""; // Reset to default color
    });
    div.appendChild(dropDownButton);

    // Create dropdown menu
    let dropDownUl = document.createElement("ul");
    dropDownUl.className = "dropdown-menu";
    div.appendChild(dropDownUl);

    // Create Edit button in dropdown
    let liEdit = document.createElement("li");
    liEdit.className = "dropdown-item";
    let buttonEdit = document.createElement("button");
    buttonEdit.className =
      " custom-btn btn btn-sm btn-outline-warning fw-bold me-2";
    buttonEdit.innerHTML =
      "<i class='fa-solid fa-pen-to-square fa-sm;'></i>";
    buttonEdit.onclick = () => {
      console.log("Edit", dataOb);
      editFunction(dataOb, index); // Call the edit function
    };
    liEdit.appendChild(buttonEdit);
    dropDownUl.appendChild(liEdit);

    // Create Delete button in dropdown
    let liDelete = document.createElement("li");
    liDelete.className = "dropdown-item";
    let buttonDelete = document.createElement("button");
    buttonDelete.className =
      "custom-btn btn  btn-sm btn-outline-danger fw-bold me-2";
    buttonDelete.innerHTML =
      "<i class='fa-solid fa-trash fa-sm'></i>";
    buttonDelete.onclick = () => {
      console.log("Delete", dataOb);
      deleteFunction(dataOb, index); // Call the delete function
    };
    //liDelete.appendChild(buttonDelete); //Vertical line
    liEdit.appendChild(buttonDelete); //Horizontanal line
    dropDownUl.appendChild(liDelete);

    // Append action buttons and row to the table
    if(buttonVisibility){
      tr.appendChild(tdButtons);
    }
    tableBodyId.appendChild(tr);
  });
};



//=====================Define a common function to fill datainto dynamic elements ====================
// Define a function to fill data into a select element
// Parameters:
// - parentid: The select element where data will be inserted
// - message: The placeholder message to display when no item is selected
// - datalist: The list of data objects to populate the select element
// - displayproperty: The property of each data object to display as the option text
const fillDataIntoSelect = (parentid, message, datalist, displayproperty) => {

    // Clean the select element by removing any existing options
    parentid.innerHTML = "";

    // Check if a placeholder message is provided
    if (message != "") {
        // Create a new option element using DOM manipulation
        let optionMsgES = document.createElement("option"); // Create an option element
        optionMsgES.value = "";                 // Set the value of the option to an empty string
        optionMsgES.selected = "selected";      // Mark this option as selected
        optionMsgES.disabled = "disabled";      // Disable the option to prevent selection
        optionMsgES.innerText = message;        // Set the visible text of the option to the message

        // Append the option element to the parent select element
        parentid.appendChild(optionMsgES);
    }

    // Loop through each item in the data list to generate option tags
    datalist.forEach(dataOb => {
        // Create an option element dynamically
        let option = document.createElement("option"); // Create an option element
        option.value = JSON.stringify(dataOb);          // Convert the data object to a string and set it as the value
        option.innerText = dataOb[displayproperty];      // Set the display text using the specified property

        // Append the dynamically created option to the parent select element
        parentid.appendChild(option);
    });
}


// Define a common function to fill data into dynamic elements using two attributes
// Define a function to fill data into a select element
// Parameters:
// - parentid: The select element where data will be inserted
// - message: The placeholder message to display when no item is selected
// - datalist: The list of data objects to populate the select element
// - displaypropertyOne: The property of the first data object to display as the option text
// - displaypropertyTwo: The property of the second data object to display as the option text

const fillDataIntoSelectTwo = (parentid, message, datalist, displaypropertyOne, displaypropertyTwo) => {
    // Clean the select element by removing any existing options
    parentid.innerHTML = "";
  
    // Check if a placeholder message is provided
    if (message != "") {
      // Create a new option element using DOM manipulation
      let optionMsgES = document.createElement("option"); // Create an option element
      optionMsgES.value = ""; // Set the value of the option to an empty string
      optionMsgES.selected = "selected"; // Mark this option as selected by default
      optionMsgES.disabled = "disabled"; // Disable the option to prevent selection
      optionMsgES.innerText = message; // Set the visible text of the option to the message
  
      // Append the option element to the parent select element
      parentid.appendChild(optionMsgES);
    }
  
    // Loop through each item in the data list to generate option tags
    datalist.forEach((dataOb) => {
      // Create an option element dynamically
      let option = document.createElement("option"); // Create an option element
      option.value = JSON.stringify(dataOb); // Convert the data object to a JSON string and set it as the option value
      option.innerText =
        dataOb[displaypropertyOne] + " " + dataOb[displaypropertyTwo]; // Set the display text using the specified properties
  
      // Append the dynamically created option to the parent select element
      parentid.appendChild(option);
    });
  };
  

// Function to populate a datalist or select element using one property from each object
const fillDataIntoDataList = (parentid, datalist, displayproperty) => {

  // Clear any existing options inside the parent element (usually a <datalist> or <select>)
  parentid.innerHTML = "";

  // Iterate over each object in the data list
  datalist.forEach(dataOb => {
      // Create a new <option> element
      let option = document.createElement("option");

      // Set the value and display text using the given property of the object
      option.value = dataOb[displayproperty];
      option.innerText = dataOb[displayproperty];

      // Append the option to the parent element
      parentid.appendChild(option);
  });
}

// Function to populate a datalist or select using two properties from each object for combined display
const fillDataIntoDataListTwo = (parentid, datalist, displaypropertyOne, displaypropertyTwo) => {

  // Clear existing options before populating new ones
  parentid.innerHTML = "";

  // Loop through each object in the list
  datalist.forEach((dataOb) => {
      // Create a new <option> element
      let option = document.createElement("option");

      // Combine the two specified properties into one string for both value and display
      option.value = dataOb[displaypropertyOne] + " " + dataOb[displaypropertyTwo];
      option.innerText = dataOb[displaypropertyOne] + " " + dataOb[displaypropertyTwo];

      // Add the option to the parent element
      parentid.appendChild(option);
  });
}
