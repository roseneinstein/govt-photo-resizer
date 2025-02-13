// A list of upcoming exams, each with a name, date, and dimensions
const upcomingExams = [
  {
    name: "IIT-JEE 2025",
    date: "2025-05-10",
    photoWidth: 300,
    photoHeight: 400,
    signatureWidth: 140,
    signatureHeight: 60
  },
  {
    name: "NEET 2025",
    date: "2025-05-15",
    photoWidth: 350,
    photoHeight: 450,
    signatureWidth: 160,
    signatureHeight: 80
  }
  // Add more exams as needed
];

console.log("Welcome to Govt Exam Photo Resizer!");

// We'll store the exam the user selected
let selectedExam = null;

/**
 * Display the upcoming exams as buttons.
 */
function displayUpcomingExams() {
  const examListDiv = document.getElementById("examList");
  examListDiv.innerHTML = "";

  upcomingExams.forEach((exam) => {
    // Create a button for each exam
    const examButton = document.createElement("button");
    examButton.textContent = exam.name + " (" + exam.date + ")";

    // When user clicks an exam, store the exam, show the sections
    examButton.addEventListener("click", function() {
      selectedExam = exam;

      // Show the photo and signature sections
      document.getElementById("photoSection").style.display = "block";
      document.getElementById("signatureSection").style.display = "block";

      // Clear existing images if any
      clearCanvas("photoCanvas");
      clearCanvas("signatureCanvas");
    });

    examListDiv.appendChild(examButton);
    examListDiv.appendChild(document.createElement("br"));
  });
}

/**
 * Helper function to clear a canvas by ID.
 */
function clearCanvas(canvasId) {
  const c = document.getElementById(canvasId);
  const context = c.getContext("2d");
  context.clearRect(0, 0, c.width, c.height);
  c.width = 0;
  c.height = 0;
}

/**
 * Helper function to resize a canvas to the target width/height.
 */
function resizeCanvas(canvas, context, targetWidth, targetHeight) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;

  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.drawImage(tempCanvas, 0, 0);
}

// Display the exams when the page loads
displayUpcomingExams();

/* 
  ---------------------------------------------------------
  PHOTO UPLOAD & RESIZE
  ---------------------------------------------------------
*/
const photoUploadInput = document.getElementById("photoUpload");
const photoCanvas = document.getElementById("photoCanvas");
const photoCtx = photoCanvas.getContext("2d");

photoUploadInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Set the canvas size to the uploaded image size
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
photoResizeBtn.addEventListener("click", function() {
  if (!selectedExam) {
    alert("Please select an exam first!");
    return;
  }

  // Use the selected exam's photo dimensions
  const targetWidth = selectedExam.photoWidth;
  const targetHeight = selectedExam.photoHeight;
  resizeCanvas(photoCanvas, photoCtx, targetWidth, targetHeight);
});

/* 
  ---------------------------------------------------------
  SIGNATURE UPLOAD & RESIZE
  ---------------------------------------------------------
*/
const signatureUploadInput = document.getElementById("signatureUpload");
const signatureCanvas = document.getElementById("signatureCanvas");
const signatureCtx = signatureCanvas.getContext("2d");

signatureUploadInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Set the canvas size to the uploaded image size
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
signatureResizeBtn.addEventListener("click", function() {
  if (!selectedExam) {
    alert("Please select an exam first!");
    return;
  }

  // Use the selected exam's signature dimensions
  const targetWidth = selectedExam.signatureWidth;
  const targetHeight = selectedExam.signatureHeight;
  resizeCanvas(signatureCanvas, signatureCtx, targetWidth, targetHeight);
});

/*
  ---------------------------------------------------------
  OLD CODE (OPTIONAL)
  ---------------------------------------------------------
  If you want to remove the old code for the single dropdown-based 
  approach, you can delete or comment it out. Example:

  // const uploadInput = document.getElementById("upload");
  // ...
*/

