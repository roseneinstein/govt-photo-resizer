console.log("home.js loaded!");

// 1) Fetch the exams from exams.json
fetch('exams.json')
  .then(response => response.json())
  .then(examsData => {
    displayExamLinks(examsData);
  })
  .catch(error => {
    console.error("Error fetching exams.json:", error);
    const examListDiv = document.getElementById("examList");
    const lang = localStorage.getItem("selectedLang") || "en";
    examListDiv.innerHTML = translations[lang].noExamsFound;
  });

// 2) Show each exam as a clickable "list-group-item"
function displayExamLinks(examsData) {
  const examListDiv = document.getElementById("examList");
  examListDiv.innerHTML = "";

  if (!examsData || examsData.length === 0) {
    const lang = localStorage.getItem("selectedLang") || "en";
    examListDiv.innerHTML = translations[lang].noExamsFound;
    return;
  }

  examsData.forEach(exam => {
    // Create an <a> element for each exam
    const link = document.createElement("a");
    link.href = `exam.html?name=${encodeURIComponent(exam.name)}`;
    link.textContent = exam.name + " (" + exam.date + ")";
    // Add Bootstrap classes for list-group items
    link.classList.add("list-group-item", "list-group-item-action", "mb-2");
    examListDiv.appendChild(link);
  });
}

// ====================
// THEME TOGGLE LOGIC
// ====================

// 1. Grab the toggle button from index.html
const themeToggleButton = document.getElementById('theme-toggle');

// 2. Check localStorage for a saved theme (light or dark)
let currentTheme = localStorage.getItem('theme') || 'light';

// 3. Apply the saved theme to the body (light-mode or dark-mode class)
document.body.classList.add(`${currentTheme}-mode`);

// 4. Function to update the button text
function updateToggleButtonText() {
  if (document.body.classList.contains('dark-mode')) {
    // If the body has dark-mode, the button should say Light Mode
    themeToggleButton.textContent = 'Light Mode';
  } else {
    // Otherwise, the body is in light mode, so the button should say Dark Mode
    themeToggleButton.textContent = 'Dark Mode';
  }
}

// 5. Right after applying the theme, set the correct button text
updateToggleButtonText();

// 6. When the toggle button is clicked...
themeToggleButton.addEventListener('click', function() {
  // Check if we're currently in light mode
  const isLightMode = document.body.classList.contains('light-mode');

  if (isLightMode) {
    // Switch to dark
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    // Switch to light
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }

  // Update the button text after toggling
  updateToggleButtonText();
});
