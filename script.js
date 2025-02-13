console.log("Welcome to Govt Exam Photo Resizer!");

// We'll store the exam the user selected (for photo/signature resizing)
let selectedExam = null;

/**
 * For now, this does nothing except tell the user no exams are loaded.
 * In Step 2, we'll replace this with code that reads from exams.json.
 */
function displayUpcomingExams() {
  const examListDiv = document.getElementById("examList");
  examListDiv.innerHTML = "No exams loaded yet. (We'll fix this soon!)";
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

// Display exams when the page loads (currently shows "No exams loaded yet.")
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
    alert("No exam selected yet! We'll fix this in the next step.");
    return;
  }

  // In the future, we'll get photoWidth/photoHeight from selectedExam
  const targetWidth = 300;
  const targetHeight = 400;
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
    alert("No exam selected yet! We'll fix this in the next step.");
    return;
  }

  // In the future, we'll get signatureWidth/signatureHeight from selectedExam
  const targetWidth = 140;
  const targetHeight = 60;
  resizeCanvas(signatureCanvas, signatureCtx, targetWidth, targetHeight);
});
