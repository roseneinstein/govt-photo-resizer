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
document.body.classList.add(currentTheme === 'dark' ? 'dark-mode' : 'light-mode');

// 4. Function to update the button text
function updateToggleButtonText() {
  if (document.body.classList.contains('dark-mode')) {
    themeToggleButton.textContent = 'Light Mode';
  } else {
    themeToggleButton.textContent = 'Dark Mode';
  }
}

// 5. Right after applying the theme, set the correct button text
updateToggleButtonText();

// 6. When the toggle button is clicked...
themeToggleButton.addEventListener('click', function() {
  // Toggle between light and dark mode
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');

  // Save the selected theme in localStorage
  const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);

  // Update the button text
  updateToggleButtonText();
});
