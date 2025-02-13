console.log("Welcome to Govt Exam Photo Resizer!");

// We'll store the exam the user selected (for photo/signature resizing)
let selectedExam = null;

/**
 * 1) Fetch the exams from exams.json and display them.
 */
function fetchExams() {
  fetch('exams.json')
    .then(response => response.json())
    .then(examsData => {
      displayUpcomingExams(examsData);
    })
    .catch(error => {
      console.error("Error fetching exams.json:", error);
      const examListDiv = document.getElementById("examList");
      examListDiv.innerHTML = "Could not load exams. Please try again later.";
    });
}

/**
 * 2) Display the exams as buttons, just like before.
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
    examButton.textContent = exam.name + " (" + exam.date + ")";

    examButton.addEventListener("click", function() {
      selectedExam = exam;
      // Show the photo/signature sections
      document.getElementById("photoSection").style.display = "block";
      document.getElementById("signatureSection").style.display = "block";

      // Clear existing images
      clearCanvas("photoCanvas");
      clearCanvas("signatureCanvas");

      console.log("Selected exam:", exam);
    });

    examListDiv.appendChild(examButton);
    examListDiv.appendChild(document.createElement("br"));
  });
}

/**
 * 3) Clear a canvas by ID.
 */
function clearCanvas(canvasId) {
  const c = document.getElementById(canvasId);
  const context = c.getContext("2d");
  context.clearRect(0, 0, c.width, c.height);
  c.width = 0;
  c.height = 0;
}

/**
 * 4) Resize a canvas to the target width/height (basic scaling).
 */
function resizeCanvas(canvas, context, targetWidth, targetHeight) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;

  // Copy the original canvas image into tempCanvas (scaled)
  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);

  // Update the original canvas
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.drawImage(tempCanvas, 0, 0);
}

/**
 * 5) Compress the canvas image until it's under the exam's maxFileSizeKB (or quality too low).
 *    We'll assume the exam has "maxFileSizeKB" for both photo & signature.
 */
function compressCanvasToMaxKB(canvas, context, maxKB) {
  let quality = 1.0; // start at best quality
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  let sizeKB = dataURLSizeInKB(dataUrl);

  // While it's bigger than maxKB and quality > 0.1, keep lowering quality
  while (sizeKB > maxKB && quality > 0.1) {
    quality -= 0.1; 
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    sizeKB = dataURLSizeInKB(dataUrl);
  }

  if (sizeKB > maxKB) {
    // Even at 0.1 quality, it's still too big
    alert(`We couldn't compress it enough! It's still ${sizeKB.toFixed(1)} KB, sorry.`);
  } else {
    // It's now under the required size
    // Let's draw it back to the canvas so the user can see/download it
    const tempImg = new Image();
    tempImg.onload = function() {
      canvas.width = tempImg.width;
      canvas.height = tempImg.height;
      context.drawImage(tempImg, 0, 0);
    };
    tempImg.src = dataUrl;

    alert(`Success! Final size: ${sizeKB.toFixed(1)} KB (under ${maxKB} KB)`);
  }
}

/**
 * Helper: Calculate the size in KB of a base64 data URL
 */
function dataURLSizeInKB(dataUrl) {
  // dataUrl looks like "data:image/jpeg;base64,XXXXXXXX..."
  // Split at the comma to get the base64 part
  const base64String = dataUrl.split(",")[1];
  // Each 4 chars of base64 = 3 bytes
  const sizeInBytes = (base64String.length * 3) / 4;
  // Convert to KB
  return sizeInBytes / 1024;
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

  // 1) Resize to exam's photoWidth/photoHeight
  resizeCanvas(photoCanvas, photoCtx, selectedExam.photoWidth, selectedExam.photoHeight);

  // 2) Compress until under selectedExam.maxFileSizeKB
  compressCanvasToMaxKB(photoCanvas, photoCtx, selectedExam.maxFileSizeKB);
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

  // 1) Resize to exam's signatureWidth/signatureHeight
  resizeCanvas(signatureCanvas, signatureCtx, selectedExam.signatureWidth, selectedExam.signatureHeight);

  // 2) Compress until under selectedExam.maxFileSizeKB
  compressCanvasToMaxKB(signatureCanvas, signatureCtx, selectedExam.maxFileSizeKB);
});

// Finally, load the exam data from exams.json when the page loads
fetchExams();
