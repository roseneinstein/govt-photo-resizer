console.log("exam.js loaded!");

// 1) Get the exam name from the URL (e.g. exam.html?name=IIT-JEE%202025)
const urlParams = new URLSearchParams(window.location.search);
const examNameParam = urlParams.get("name");
console.log("Exam name from URL:", examNameParam);

// 2) Fetch exams.json
fetch('exams.json')
  .then(response => response.json())
  .then(examsData => {
    // 3) Find the exam that matches examNameParam
    const selectedExam = examsData.find(e => e.name === examNameParam);

    if (!selectedExam) {
      // If no match, show an error
      document.getElementById("examName").textContent = "Exam not found!";
      return;
    }

    // 4) Display the exam name
    document.getElementById("examName").textContent = selectedExam.name;

    // 5) Store the exam data in a global variable
    window.selectedExam = selectedExam;
  })
  .catch(error => {
    console.error("Error fetching exams.json:", error);
    document.getElementById("examName").textContent = "Could not load exam data.";
  });

// ====================
// Photo Logic
// ====================
const photoUploadInput = document.getElementById("photoUpload");
const photoCanvas = document.getElementById("photoCanvas");
const photoCtx = photoCanvas.getContext("2d");
const photoResizeBtn = document.getElementById("photoResizeButton");
const photoDownloadBtn = document.getElementById("photoDownloadButton");

photoUploadInput.addEventListener("change", function(e) {
  loadAndDrawImage(e.target.files[0], photoCanvas, photoCtx);
});

photoResizeBtn.addEventListener("click", function() {
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }

  resizeAndCompress(photoCanvas, photoCtx, window.selectedExam.photoWidth, window.selectedExam.photoHeight, window.selectedExam.maxFileSizeKB);
});

photoDownloadBtn.addEventListener("click", function() {
  downloadCanvasAsJPG(photoCanvas, "resized_photo.jpg");
});

// ====================
// Signature Logic
// ====================
const signatureUploadInput = document.getElementById("signatureUpload");
const signatureCanvas = document.getElementById("signatureCanvas");
const signatureCtx = signatureCanvas.getContext("2d");
const signatureResizeBtn = document.getElementById("signatureResizeButton");
const signatureDownloadBtn = document.getElementById("signatureDownloadButton");

signatureUploadInput.addEventListener("change", function(e) {
  loadAndDrawImage(e.target.files[0], signatureCanvas, signatureCtx);
});

signatureResizeBtn.addEventListener("click", function() {
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }

  resizeAndCompress(signatureCanvas, signatureCtx, window.selectedExam.signatureWidth, window.selectedExam.signatureHeight, window.selectedExam.maxFileSizeKB);
});

signatureDownloadBtn.addEventListener("click", function() {
  downloadCanvasAsJPG(signatureCanvas, "resized_signature.jpg");
});

// ====================
// Helper Functions
// ====================

function loadAndDrawImage(file, canvas, context) {
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function resizeAndCompress(canvas, context, targetWidth, targetHeight, maxKB) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;

  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.drawImage(tempCanvas, 0, 0);

  compressCanvasToMaxKB(canvas, context, maxKB);
}

function compressCanvasToMaxKB(canvas, context, maxKB) {
  let quality = 1.0;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  let sizeKB = dataURLSizeInKB(dataUrl);

  while (sizeKB > maxKB && quality > 0.1) {
    quality -= 0.05;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    sizeKB = dataURLSizeInKB(dataUrl);
  }

  if (sizeKB > maxKB) {
    alert(`We couldn't compress it enough! It's still ${sizeKB.toFixed(1)} KB.`);
  } else {
    alert(`Success! Final size: ${sizeKB.toFixed(1)} KB (under ${maxKB} KB)`);
  }
}

function dataURLSizeInKB(dataUrl) {
  const base64String = dataUrl.split(",")[1];
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / 1024;
}

function downloadCanvasAsJPG(canvas, filename) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/jpeg", 1.0);  // Force high-quality JPG
  link.download = filename;
  link.click();
}
