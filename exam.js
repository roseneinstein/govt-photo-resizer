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

    // 5) Store exam data in a global variable
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
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }

  resizeCanvas(photoCanvas, photoCtx, window.selectedExam.photoWidth, window.selectedExam.photoHeight);
  compressCanvasToMaxKB(photoCanvas, photoCtx, window.selectedExam.maxFileSizeKB);
});

// **Download Resized Photo**
document.getElementById("photoDownloadButton").addEventListener("click", function() {
  downloadCanvasAsJPG(photoCanvas, "resized-photo.jpg");
});

// ====================
// Signature Logic
// ====================
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
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }

  resizeCanvas(signatureCanvas, signatureCtx, window.selectedExam.signatureWidth, window.selectedExam.signatureHeight);
  compressCanvasToMaxKB(signatureCanvas, signatureCtx, window.selectedExam.maxFileSizeKB);
});

// **Download Resized Signature**
document.getElementById("signatureDownloadButton").addEventListener("click", function() {
  downloadCanvasAsJPG(signatureCanvas, "resized-signature.jpg");
});

// ====================
// Helper Functions
// ====================
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

function compressCanvasToMaxKB(canvas, context, maxKB) {
  let quality = 1.0;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  let sizeKB = dataURLSizeInKB(dataUrl);

  while (sizeKB > maxKB && quality > 0.1) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    sizeKB = dataURLSizeInKB(dataUrl);
  }

  if (sizeKB > maxKB) {
    alert(`We couldn't compress it enough! It's still ${sizeKB.toFixed(1)} KB.`);
  } else {
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

function dataURLSizeInKB(dataUrl) {
  const base64String = dataUrl.split(",")[1];
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / 1024;
}

// **Function to Download as JPG (With Proper Compression)**
function downloadCanvasAsJPG(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;

  // Use compression quality 0.7 to reduce file size
  link.href = canvas.toDataURL("image/jpeg", 0.7);
  
  link.click();
}
