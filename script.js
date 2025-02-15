console.log("Welcome to Govt Exam Photo Resizer!");

// We'll store the exam the user selected (for photo/signature resizing)
let selectedExam = null;

/**
 * Fetch the exams from exams.json and display them.
 */
function fetchExams() {
  fetch("exams.json")
    .then((response) => response.json())
    .then((examsData) => {
      displayUpcomingExams(examsData);
    })
    .catch((error) => {
      console.error("Error fetching exams.json:", error);
      const examListDiv = document.getElementById("examList");
      examListDiv.innerHTML = "Could not load exams. Please try again later.";
    });
}

/**
 * Display the exams as buttons.
 */
function displayUpcomingExams(examsData) {
  const examListDiv = document.getElementById("examList");
  examListDiv.innerHTML = "";

  if (!examsData || examsData.length === 0) {
    examListDiv.innerHTML = "No exams found in exams.json!";
    return;
  }

  examsData.forEach((exam) => {
    const examButton = document.createElement("button");
    examButton.classList.add("btn", "btn-primary", "my-2");
    examButton.textContent = exam.name + " (" + exam.date + ")";

    examButton.addEventListener("click", function () {
      selectedExam = exam;
      document.getElementById("photoSection").style.display = "block";
      document.getElementById("signatureSection").style.display = "block";

      clearCanvas("photoCanvas");
      clearCanvas("signatureCanvas");

      console.log("Selected exam:", exam);
    });

    examListDiv.appendChild(examButton);
    examListDiv.appendChild(document.createElement("br"));
  });
}

/**
 * Clear a canvas by ID.
 */
function clearCanvas(canvasId) {
  const c = document.getElementById(canvasId);
  const context = c.getContext("2d");
  context.clearRect(0, 0, c.width, c.height);
  c.width = 0;
  c.height = 0;
}

// ==========================
// THEME TOGGLE LOGIC
// ==========================

const themeToggleButton = document.getElementById("theme-toggle");

// Check localStorage for saved theme
let currentTheme = localStorage.getItem("theme") || "light";
applyTheme(currentTheme);

// Function to apply theme changes
function applyTheme(theme) {
  document.body.classList.remove("light-mode", "dark-mode");
  document.body.classList.add(`${theme}-mode`);

  // Set the correct button text
  themeToggleButton.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";

  // Save theme to localStorage
  localStorage.setItem("theme", theme);
}

// Toggle theme on button click
themeToggleButton.addEventListener("click", function () {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
});

// ==========================
// PHOTO UPLOAD & RESIZE
// ==========================

const photoUploadInput = document.getElementById("photoUpload");
const photoCanvas = document.getElementById("photoCanvas");
const photoCtx = photoCanvas.getContext("2d");

photoUploadInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      photoCanvas.width = img.width;
      photoCanvas.height = img.height;
      photoCtx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

const photoResizeBtn = document.getElementById("photoResizeButton");
photoResizeBtn.addEventListener("click", function () {
  if (!selectedExam) {
    alert("Please select an exam first!");
    return;
  }

  resizeCanvas(photoCanvas, photoCtx, selectedExam.photoWidth, selectedExam.photoHeight);
  compressCanvasToMaxKB(photoCanvas, photoCtx, selectedExam.maxFileSizeKB);
});

// ==========================
// SIGNATURE UPLOAD & RESIZE
// ==========================

const signatureUploadInput = document.getElementById("signatureUpload");
const signatureCanvas = document.getElementById("signatureCanvas");
const signatureCtx = signatureCanvas.getContext("2d");

signatureUploadInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      signatureCanvas.width = img.width;
      signatureCanvas.height = img.height;
      signatureCtx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

const signatureResizeBtn = document.getElementById("signatureResizeButton");
signatureResizeBtn.addEventListener("click", function () {
  if (!selectedExam) {
    alert("Please select an exam first!");
    return;
  }

  resizeCanvas(signatureCanvas, signatureCtx, selectedExam.signatureWidth, selectedExam.signatureHeight);
  compressCanvasToMaxKB(signatureCanvas, signatureCtx, selectedExam.maxFileSizeKB);
});

// Load the exam data when the page loads
fetchExams();
