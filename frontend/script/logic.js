window.addEventListener('DOMContentLoaded', function() {
    // Replace with your actual Function App URL and endpoint path
    const functionUrl = "http://localhost:7071/api/http_trigger";

    // Trigger the Azure Function with a GET or POST request
    fetch(functionUrl)
      .then(response => response.text())
      .then(result => {
        console.log("Function triggered successfully. Updated counter:", result);
        // Optionally, you can update an element on your page with the counter value
        // document.getElementById('visitorCounter').innerText = result;
      })
      .catch(error => {
        console.error("Error triggering function:", error);
      });
  });