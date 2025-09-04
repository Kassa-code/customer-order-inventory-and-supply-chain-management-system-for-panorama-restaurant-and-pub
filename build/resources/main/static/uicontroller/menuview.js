// Create a browser window load event listener
// This code runs only after the entire page (HTML, CSS, JS) has fully loaded
window.addEventListener("load", () => {

  // Call the function to reset or prepare the order form for new input
  refreshMenuViewForm();
});

// Create refresh form area function
const refreshMenuViewForm = () => {

  // Fetch submenu, liquormenu, and menu data from backend
  let submenus = getServiceRequest('/submenu/activelist');
  let liquormenus = getServiceRequest('/liquormenu/activelist');
  let menus = getServiceRequest('/menu/activelist');

  // Generate menu cards dynamically and render them in their respective containers
  // Parameters: (data, container ID, item type)
  createMenuCard(submenus, 'subMenuCardContainer', 'submenu');
  createMenuCard(liquormenus, 'liquorMenuCardContainer', 'liquormenu');
  createMenuCard(menus, 'menuCardContainer', 'menu');

}


// Function to create menu cards dynamically and render them inside a container
const createMenuCard = (items, containerId, itemType) => {
  // Get the container element by its ID where cards will be placed
  const cardWrapper = document.getElementById(containerId);

  // Clear any existing content inside the container before adding new cards
  cardWrapper.innerHTML = '';

  // Loop over each menu item in the given list
  items.forEach((item) => {
    // Create a column div with Bootstrap classes for layout
    const col = document.createElement("div");
    col.className = "col-md-3";

    // Create the card container div with custom styling and shadow
    const card = document.createElement("div");
    card.className = "card custom-menu-card shadow-sm mb-3";

    // Determine which image and price fields to use based on the item type
    let photoField, priceField;
    switch (itemType) {
      case 'submenu':
        photoField = item.submenu_photo;
        priceField = item.submenu_price;
        break;
      case 'liquormenu':
        photoField = item.liquormenuphoto;
        priceField = item.liquormenuprice;
        break;
      case 'menu':
        photoField = item.menu_photo;
        priceField = item.price;
        break;
      default:
        photoField = '';
        priceField = 0;
    }

    // Decode the base64 encoded image string for displaying the image
    let imgSrc = atob(photoField);

    // Create an image element and set its source and styling
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "card-img-top";
    img.alt = item.name || "Image";  // Provide alt text for accessibility

    // Create a div for the card body with padding
    const cardBody = document.createElement("div");
    cardBody.className = "card-body p-2";

    // Create an element for the item name/title with truncation for long text
    const titleElem = document.createElement("h6");
    titleElem.className = "card-title text-truncate mb-1";
    titleElem.style.fontSize = "0.75rem";
    titleElem.textContent = item.name;

    // Create a paragraph element to show the price with styling
    const priceElem = document.createElement("p");
    priceElem.className = "text-muted small mb-0 fw-bold";
    priceElem.textContent = `Rs. ${priceField}`;

    // Build the card by appending title and price to card body
    cardBody.appendChild(titleElem);
    cardBody.appendChild(priceElem);

    // Append the image and card body to the card container
    card.appendChild(img);
    card.appendChild(cardBody);

    // Append the card to the column wrapper
    col.appendChild(card);

    // Append the column to the main card wrapper container in the DOM
    cardWrapper.appendChild(col);
  });
}


