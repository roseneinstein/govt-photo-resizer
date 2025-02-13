console.log("Welcome to Govt Exam Photo Resizer!");

// We'll store the exam the user selected (for photo/signature resizing)
let selectedExam = null;

/**
 * Step 2: Fetch the exams from exams.json and display them.
 */
function fetchExams() {
  fetch('exams.json')
    .then(response => response.json())
    .then(examsData => {
      // examsData is the array of exams from exams.json
      displayUpcomingExams(examsData);
    })
    .catch(error => {
      console.error("Error fetching exams.json:", error);
      // If there's an error, show a message on the page
      const examListDiv = document.getElementById("examList");
      examListDiv.innerHTML = "Could not load exams. Please try again later.";
    });
}

/**
 * Display the exams as buttons, just like before.
 * But now we receive the list of exams as 'examsData'.
 */
function displayUpcomingExams(examsData) {
  const examListDiv = document.getElementById("examList");
  examListDiv.innerHTML = ""; // Clear any old content

  // If there are no exams in the file, show a message
  if (!examsData || examsData.length === 0) {
    examListDiv.innerHTML = "No exams found in exams.json!";
    return;
  }

  // Create a button for each exam
  examsData.forEach((exam) => {
    const examButton = document.createElement("button");
    examButton.textContent = exam.name + " (" + exam.date + ")";

    examButton.addEventListener("click", function() {
      // Store the selected exam in our global variable
      selectedExam = exam;

      // Show the photo and signature sections
      document.getElementById("photoSection").style.display = "block";
      document.getElementById("signatureSection").style.display = "block";

      // Clear any existing images on the canvases
      clearCanvas("photoCanvas");
      clearCanvas("signatureCanvas");

      console.log("Selected exam:", exam);
    });

    // Add the button to the page
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

  // Copy the image from the original canvas into tempCanvas, resizing it
  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);

  // Update the original canvas to the new size and draw the temp image onto it
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.drawImage(tempCanvas, 0, 0);
}

// ====================
// PHOTO UPLOAD & RESIZE
// ====================
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

  // Use the exam's photo dimensions from exams.json
  const targetWidth = selectedExam.photoWidth;
  const targetHeight = selectedExam.photoHeight;
  resizeCanvas(photoCanvas, photoCtx, targetWidth, targetHeight);
});

// =======================
// SIGNATURE UPLOAD & RESIZE
// =======================
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

  // Use the exam's signature dimensions from exams.json
  const targetWidth = selectedExam.signatureWidth;
  const targetHeight = selectedExam.signatureHeight;
  resizeCanvas(signatureCanvas, signatureCtx, targetWidth, targetHeight);
});

// Finally, call fetchExams() so we load the exam data from exams.json
fetchExams();
