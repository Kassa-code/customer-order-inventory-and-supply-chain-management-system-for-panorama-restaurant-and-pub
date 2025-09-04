// Attach an event listener to the window's load event to execute a function when the page is fully loaded
window.addEventListener("load", () => {
  // Call the function to refresh the user edit form when the page loads
  refreshUserEditForm();
});

// Function to refresh and populate the user edit form with current user details
const refreshUserEditForm = () => {
  // Fetch logged-in user details from the backend (twice for comparison later)
  lgUser = getServiceRequest('/loggeduserdetails');     // Current working copy
  oldLgUser = getServiceRequest('/loggeduserdetails');  // Original backup for change detection

  // If user has a profile photo, decode it and set it as the image preview source
  if (lgUser.userphoto != null) {
    imgEditPhotoPreview.src = atob(lgUser.userphoto);
  } else {
    // If no user photo, use a default profile image
    imgEditPhotoPreview.src = "/images/profile.png";
  }

  // Populate the username input field with the fetched username
  textEditUserName.value = lgUser.username;

  // Populate the email input field with the fetched email
  textEditUserEmail.value = lgUser.email;
}

// Function to validate if the new password and re-typed password match
const passwordValidator = () => {
  // Retrieve and trim the values from both password input fields to avoid mismatches due to whitespace
  const newPassword = textEditNewPassword.value.trim();
  const retypePassword = textEditNewRePassword.value.trim();

  // Check if both password fields are not empty and match each other exactly
  if (newPassword !== "" && retypePassword !== "" && newPassword === retypePassword) {
    // If passwords match, update the lgUser object with the new password
    lgUser.newpassword = newPassword;

    // Provide visual feedback: green border and light green background to indicate success
    textEditNewRePassword.classList.remove("is-invalid");
    textEditNewRePassword.classList.add("is-valid");
    textEditNewRePassword.style.border = "2px solid green";
    textEditNewRePassword.style.backgroundColor = "#c6f6d5";

  } else {
    // If passwords don't match or are empty, reset the password in lgUser object
    lgUser.newpassword = null;

    // Provide visual feedback: red border and light red background to indicate error
    textEditNewRePassword.classList.remove("is-valid");
    textEditNewRePassword.classList.add("is-invalid");
    textEditNewRePassword.style.border = "2px solid red";
    textEditNewRePassword.style.backgroundColor = "#f8d7da";
  }
}

// Function to check which user details have been changed by comparing lgUser and oldLgUser
const checkChanges = () => {
  let changes = ""; // String to accumulate change descriptions

  // Compare user photo
  if (lgUser.userphoto != oldLgUser.userphoto) {
    changes += "📷 User Photo is changed..! \n";
  }

  // Compare username
  if (lgUser.username != oldLgUser.username) {
    changes += "👤 User Name is changed..! \n";
  }

  // Compare password (incorrect key used: should compare lgUser.newpassword != null)
  if (lgUser.oldpassword != oldLgUser.newpassword) {
    changes += "🔑 Password is changed..! \n";
  }

  // Compare email
  if (lgUser.email != oldLgUser.email) {
    changes += "📧 Email is changed..! \n";
  }

  // Return the accumulated changes string
  return changes;
}

// Function to handle saving the changes made by the user
const saveChanges = () => {
  console.log(lgUser); // Debug log to inspect the lgUser object

  // Call the checkChanges function to detect any modifications made in the form
  let changes = checkChanges();

  // If there are no changes detected
  if (changes != "") {
    // Show a SweetAlert confirmation popup summarizing the user details to be updated
    Swal.fire({
      title: "Are you sure to add following changes?",
      html:
        "<div style='text-align:left; font-size:14px'>" +
        "👥 <b>User Name:</b> " + lgUser.username + "<br>" +
        "📧 <b>User Email:</b> " + lgUser.email +
        "</div>",
      icon: "warning",
      width: "20em",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add User"
    }).then((result) => {
      // If user confirms the changes
      if (result.isConfirmed) {
        // Send a POST request to the server with updated user details
        let postResponse = getHTTPServiceRequest("/changeuserdetails/insert", "POST", lgUser);

        // If the server responds with "OK", show success message and log out the user
        if (postResponse === "OK") {
          Swal.fire({
            icon: "success",
            width: "20em",
            title: "Saved successfully!",
            timer: 1500,
            showConfirmButton: false,
            draggable: true
          });

          // Redirect to logout to refresh the session with updated details
          window.location.replace("/logout");
        } else {
          // If there's an error in saving, show an error popup with the response
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
    // If changes are detected, show them as a warning alert for the user to review
    Swal.fire({
      icon: "warning",
      width: "20em",
      title: "Form hasn't any changes..!",
      confirmButtonColor: "#3085d6"
    });
  }
}

function clearUserPhoto() {
  // Reset the file input
  const photoInput = document.getElementById("fileEditUserPhoto");
  if (photoInput) {
    photoInput.value = "";
  }

  // Reset the photo preview to a default image
  const previewImage = document.getElementById("imgEditPhotoPreview");
  if (previewImage) {
    previewImage.src = "/images/profile.png"; // Change path as needed
  }

  // Optional: Clear from JS object if you're binding data
  if (typeof lgUser !== "undefined") {
    lgUser.userphoto = null;
  }

}

// Function to clear the form after confirming with the user
const clearUserEditForm = () => {
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
      refreshUserEditForm();
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
}