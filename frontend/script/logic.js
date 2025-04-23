window.addEventListener('DOMContentLoaded', function() {
    const metaTag = document.querySelector('meta[name="function-endpoint"]');
    const functionUrl = metaTag ? metaTag.getAttribute('content') : '';

  if (!functionUrl) {
    console.error('Function endpoint URL is not set in the meta tag.');
    document.getElementById('visitor-counter').innerText = 'N/A';
    return;
  }

    fetch(functionUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        return response.text();
      })
      .then(count => {
        const counterElement = document.getElementById('visitor-counter');
        counterElement.innerText = count;
        console.log('Visitor count received:', count);
      })
      .catch(error => {
        console.error('Error fetching visitor count:', error);
        document.getElementById('visitor-counter').innerText = 'N/A';
      });
    
    // Theme toggle functionality
    const toggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    function setTheme(mode) {
      body.classList.toggle("light-mode", mode === "light");
      toggleBtn.textContent = mode === "light" ? "🌙 Dark Mode" : "🌞 Light Mode";
    }

    // Default to dark mode
    setTheme("dark");

    toggleBtn.addEventListener("click", () => {
      const isLight = body.classList.contains("light-mode");
      setTheme(isLight ? "dark" : "light");
    });
  });