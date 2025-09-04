// Common Function to validate the input text field based on a regex pattern
const commonTextValidator = (element, dataPattern, object, property) => {
    // Step 1: Create a regular expression object using the provided pattern
    const regExp = new RegExp(dataPattern);

    // Step 2: Get the current value of the input field and trim whitespace
    const elementValue = element.value.trim();
    const ob = window[object]; // Get object reference from window by name

    // Step 3: Check if the input value is not empty
    if (elementValue !== "") {
        // Step 4: Test the input value against the regex pattern
        if (regExp.test(elementValue)) {
            // Valid input
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
            element.style.border = "2px solid green";
            element.style.backgroundColor = "#c6f6d5";
            ob[property] = elementValue;
            
        } else {
            // Invalid input (fails regex)
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#f8d7da";

            ob[property] = null;
        }
    } else {
        // Step 5: If the input value is empty
        if (element.required) {
            // Required field left empty
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");

            element.style.border = "2px solid red";
            element.style.backgroundColor = "#f8d7da";

            ob[property] = null;
        } else {
            // Optional field left empty
            element.classList.remove("is-valid", "is-invalid");

            element.style.border = "2px solid #ced4da"; // Bootstrap default border
            element.style.backgroundColor = ""; // Reset background

            ob[property] = ""; // Set empty string for optional
        }
    }
}


//Common Function to validate the input date field
const dateElementValidator = (dateElement,object,property) => {
    const elementValue = dateElement.value;
    const ob = window[object]; // object comes as string so need to take object as object from window array
    if (elementValue !== "") {
        // Add Bootstrap 'is-valid' class and remove 'is-invalid'
        dateElement.classList.remove("is-invalid");
        dateElement.classList.add("is-valid");
    
        // Apply custom valid styles
        dateElement.style.border = "2px solid green";
        dateElement.style.backgroundColor = "#c6f6d5";
    
        ob[property] = elementValue;  // Assign the value
    } else {
        // Add Bootstrap 'is-invalid' class and remove 'is-valid'
        dateElement.classList.remove("is-valid");
        dateElement.classList.add("is-invalid");
    
        // Apply custom invalid styles
        dateElement.style.border = "2px solid red";
        dateElement.style.backgroundColor = "#f8d7da";
    
        ob[property] = null;  // Assign null if empty
    }
    
   
}


// Common Function to validate static elements civil status
const selectStaicElementValidator = (element, object, property) => {
    const elementValue = element.value;  // Get the selected value from the element
    const ob = window[object]; // object comes as string so need to take object as object from window array

    if (elementValue !== "") {
        // Set Bootstrap 'valid' styles
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
    
        // Set custom valid styles
        element.style.border = "2px solid green";
        element.style.backgroundColor = "#c6f6d5";
    
        ob[property] = elementValue;  // Assign the selected value to the object's property
    } else {
        // Set Bootstrap 'invalid' styles
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
    
        // Set custom invalid styles
        element.style.border = "2px solid red";
        element.style.backgroundColor = "#f8d7da";
    
        ob[property] = null;  // Use actual null, not string "null"
    }
    
}

/*
 * Difference Between Dynamic and Static Element Handling:
 * 1️⃣ **Dynamic Elements (e.g., Designation, Employment Status)**
 *    - Use `object[property] = JSON.parse(elementValue);`
 *    - The value from the element is in JSON format, so it needs to be parsed before assigning it.
 *    - Example:
 *        var employee = {};
 *        selectDynamicElementValidator(element, "employee", "designation");
 *        // If `element.value = '{"id":1,"name":"Manager"}'`
 *        // Then `employee.designation` will be stored as {id: 1, name: "Manager"} after JSON parsing.
 *
 * 2️⃣ **Static Elements (e.g., Civil Status)**
 *    - Use `object[property] = elementValue;`
 *    - The value is stored as a simple string, without parsing.
 *    - Example:
 *        var user = {};
 *        selectStaicElementValidator(element, "user", "civilStatus");
 *        // If `element.value = "Single"`
 *        // Then `user.civilStatus` will be stored as "Single" directly.
 *
 * ✅ **Summary:**
 * - **Dynamic elements** store complex objects, requiring `JSON.parse()`.
 * - **Static elements** store simple values directly.
 */



// Common function to validate dynamic elements designation, emp status
const selectDynamicElementValidator = (element, object, property) => {
    const elementValue = element.value; // Get the value of the selected element
    const ob = window[object]; // object comes as string so need to take object as object from window array that stores everything we create

    if (elementValue !== "") {
        // Set Bootstrap 'valid' styles
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
    
        // Set custom valid styles
        element.style.border = "2px solid green";
        element.style.backgroundColor = "#c6f6d5";
    
        ob[property] = JSON.parse(elementValue);  // Assign parsed value to object
    } else {
        // Set Bootstrap 'invalid' styles
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
    
        // Set custom invalid styles
        element.style.border = "2px solid red";
        element.style.backgroundColor = "#f8d7da";
    
        ob[property] = null;  // No value selected
    }
    
}

// Define a common function to validate and preview file inputs
// Parameters:
// - fileElement: the <input type="file"> element
// - object: the name of the global object (as a string) where the file data will be stored
// - property: the property name inside the object to assign the Base64 data
// - previewElement: the <img> element where the image preview should appear
const fileValidator = (fileElement, object, property, previewElement) => {

    // Check if a file has been selected
    if (fileElement.value != "") {

        // Log the list of selected files (for debugging)
        console.log(fileElement.files);

        // Get the first file from the input
        let file = fileElement.files[0];

        // Create a new FileReader instance to read the file
        let fileReader = new FileReader();

        // Define what happens when the file is successfully read
        fileReader.onload = (e) => {
            // Set the image preview src to the Base64 result
            previewElement.src = e.target.result;

            // Save the Base64 string to the specified global object and property
            window[object][property] = btoa(e.target.result);
        }

        // Read the file as a data URL (Base64 encoded string)
        fileReader.readAsDataURL(file);
    }
}



/*
 * About the window object:
 * The `window` object is the global object in JavaScript that represents the browser window.
 * It contains all global variables, functions, and objects.
 * In this code, `window[object]` is used to dynamically access a global object 
 * by its name, which is passed as a string.
 * Example:
 * var employee = { name: "John" };
 * let objName = "employee";
 * console.log(window[objName]); // Output: { name: "John" }
 */

