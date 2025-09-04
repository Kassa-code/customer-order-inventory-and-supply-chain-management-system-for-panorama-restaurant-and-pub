//Create browser load event
window.addEventListener("load", () => {
  refreshDineInForm();
});

const refreshDineInForm = () => {
  let dineintables = getServiceRequest('/dineintable/alldata');
  let availabledineintables = getServiceRequest('/dineintable/availabletable');

  renderDineInTables(dineintables, availabledineintables);
}

let selectedTableId = null; // To track which table is selected

const renderDineInTables = (allTables, availableTables) => {
  const container = document.getElementById("dineInTableContainer");
  container.innerHTML = ""; // Clear previous

  const availableIds = availableTables.map(table => table.id);

  allTables.forEach((table) => {
    const isAvailable = availableIds.includes(table.id);

    const card = document.createElement("div");
    card.className = "col-2 p-2";

    const cardInner = document.createElement("div");
    cardInner.className = `card text-center shadow-sm rounded p-4 fw-bold ${isAvailable ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
      }`;

    // Apply custom border and background color based on availability (as example)
    if (isAvailable) {
      cardInner.style.border = "2px solid green";
      cardInner.style.backgroundColor = "#c6f6d5";  // light green background
    } else {
      cardInner.style.border = "2px solid red";
      cardInner.style.backgroundColor = "#f8d7da";  // light red background
    }


    cardInner.style.fontSize = "32px";
    cardInner.textContent = table.number;

    // Add selection capability only if available
    if (isAvailable) {
      cardInner.classList.add("selectable-table");

      cardInner.addEventListener("click", () => {
        // Unselect all
        document.querySelectorAll(".selectable-table").forEach(el => {
          el.classList.remove("border", "border-3", "border-primary");
        });

        // Mark this one as selected
        cardInner.classList.add("border", "border-3", "border-primary");
        selectedTableId = table.id;

        console.log("Selected table ID:", selectedTableId);
      });
    }

    card.appendChild(cardInner);
    container.appendChild(card);
  });
};


