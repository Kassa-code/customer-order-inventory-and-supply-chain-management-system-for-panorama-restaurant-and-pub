
function generateRandomHexColors (count){
    const colors = [];
    for (let i = 0; i < count; i++) {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6 , '0');
        colors.push(randomColor);
    }
    return colors;
}
// Function: generateRandomHexColors
// Purpose: Generate an array of random hexadecimal color strings
// Parameters:
//   - count (Number): The number of random hex colors to generate
// Returns:
//   - Array of strings: Each string is a randomly generated hex color (e.g., "#a1b2c3")
// Process:
//   1. Initialize an empty array to store color codes.
//   2. Loop from 0 to count - 1:
//        - Generate a random integer between 0 and 16777215 (0xFFFFFF).
//        - Convert it to a hexadecimal string.
//        - Pad with leading zeros to ensure it has 6 characters.
//        - Prefix it with '#' to form a valid hex color code.
//        - Push the result into the array.
//   3. Return the final array of hex color codes.


// Common function to reset the provided form elements to their default state.
//An array of HTML elements to reset.

const setDefault = (elements) => {
    elements.forEach(element => {
        // Reset input values
        if (element.type === "radio" || element.type === "checkbox") {
            element.checked = false;
        } else {
            element.value = "";
        }

        // Reset validation styles and classes
        if (element && element.style) {
            element.style.border = "1px solid #ced4da";       // Bootstrap default border
            element.style.backgroundColor = "";               // Clear background color
        }

        // Remove Bootstrap validation classes
        element.classList.remove("is-valid", "is-invalid");
    });
};


// Define function for getting service request data from a given URL
const getServiceRequest = (url) => {

    let getServiceResponse = []; // Initialize an empty array to store the response data

    $.ajax({
        url: url, // API endpoint that returns service request data
        type: 'GET', // HTTP method used to fetch data
        contentType: 'json', // Content type of the request (This should likely be 'application/json')
        async: false, // Synchronous request (blocks execution until the request completes) - Not recommended
        
        success: function(response) {
            console.log('success:', response); // Log the response for debugging
            getServiceResponse = response; // Assign the fetched data to the response array
        },
        
        error: function(xhr, status, error) {
            console.log('Error:',url, error); // Log any error that occurs
            getServiceResponse = error;
        }
    }); 

    return getServiceResponse; // Return the fetched response data
    
}

// Define function for POST, PUT, DELETE service request
const getHTTPServiceRequest = (url,method,data) => {

    let getServiceResponse ; // Initialize an empty array to store the response data

    $.ajax({
        url: url, // API endpoint that returns service request data
        type: method, // HTTP method used to fetch data
        contentType: 'application/json', // Content type of the request (This should likely be 'application/json')
        data: JSON.stringify(data),
        async: false, // Synchronous request (blocks execution until the request completes) - Not recommended
        
        success: function(response) {
            console.log('success:', response); // Log the response for debugging
            getServiceResponse = response; // Assign the fetched data to the response array
        },
        
        error: function(xhr, status, error) {
            console.log('Error:',url, error); // Log any error that occurs
            getServiceResponse = error;
        }
    }); 

    return getServiceResponse; // Return the fetched response data
    
}
