// Function to generate the report, including table and chart
const generateReport = () => {

  // Fetch report data from the server using a custom utility function
  // The request URL is constructed using start date, end date, and selected type (Weekly/Monthly)
  let dataList = getServiceRequest("/reportcustomerpaymentbycard/bysdedtype?startdate=" + dteStartDate.value + "&enddate=" + dteEndDate.value + "&type=" + selectType.value);

  // Log the response data to console for debugging
  console.log(dataList);
  
  // Initialize arrays to hold processed data
  let reportDataList = new Array(); // Holds objects with month and amount for table
  let data = new Array();           // Holds amount values for chart
  let label = new Array();          // Holds month names for chart

  // Loop through the fetched dataList (which is a 2D array)
  for (const index in dataList) {
     let object = new Object();
     object.month = dataList[index][0];   // Month name
     object.amount = dataList[index][1];  // Amount value
     reportDataList.push(object);         // Push into report list for table rendering

     label.push(dataList[index][0]);      // Add to label array for chart X-axis
     data.push(dataList[index][1]);       // Add to data array for chart Y-axis
  }

  // Define properties used to render the table
  // Each object maps a property to its data type
  let propertyList = [
      { propertyName: "month", dataType: "string" },  // Column for month
      { propertyName: "amount", dataType: "string" }, // Column for amount
  ];

  // Call the function to render the data in the HTML table
  // Parameters: tableBodyId, dataList, propertyList
  fillDataIntoReportTable(tableBodyCustomerPaymentByCardReport, reportDataList, propertyList);

  // Chart rendering section
  const ctx = document.getElementById('myChart'); // Get canvas element for Chart.js

  // If a chart already exists on this canvas, destroy it to prevent overlap
  if (Chart.getChart("myChart") != undefined) {
     Chart.getChart("myChart").destroy();
  }

  // Create a new bar chart using Chart.js with the processed label and data arrays
  new Chart(ctx, {
     type: 'bar',
     data: {
        labels: label, // X-axis labels (months)
        datasets: [{
           label: 'Amount', // Dataset label shown in legend
           data: data,      // Y-axis values (amounts)
           borderWidth: 1,
           backgroundColor : generateRandomHexColors(data.length)
        }]
     },
     options: {
        scales: {
           y: {
              beginAtZero: true // Start Y-axis from 0
           }
        }
     }
  });
}

// Function to print the current chart
const printChart = () => {
  const canvas = document.getElementById("myChart"); // Get the canvas element
  const imageData = canvas.toDataURL("image/png");   // Convert canvas to image in base64 format

  // Create the print HTML structure as a string
  const printView = `
   <html>
     <head>
       <title>Print Customer Payment By Card Report</title>
       <link rel="stylesheet" href="../../Resources/bootstrap-5.2.3/css/bootstrap.min.css">
       <style>
         body {
           font-family: Arial, sans-serif;
           height: 100vh;
           display: flex;
           justify-content: center;
           align-items: center;
           background-color:#efeeff;
           margin: 0;
         }
         .content {
           background: white;
           padding: 20px;
           border-radius: 10px;
           box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
           max-width: 500px;
           width: 100%;
         }
         .table th, .table td {
           padding: 6px 10px;
         }
         .table th {
           text-align: left;
           font-weight: bold;
         }
         h2 {
           text-align: center;
           margin-bottom: 15px;
         }
       </style>
     </head>
     <body>
       <div class="content">
         <!-- Embed chart image inside printable content -->
         <img src="${imageData}" style="max-width: 100%; height: auto;" />
       </div>
     </body>
   </html>`;

  // Open a new window and write the printable content
  const newWindow = window.open("", "_blank");
  newWindow.document.write(printView);
  newWindow.document.close();

  // Wait a moment to allow rendering, then trigger print and close window
  setTimeout(() => {
     newWindow.print();
     newWindow.close();
  }, 1500);
};
