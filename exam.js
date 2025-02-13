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

    // 5) Display the resizing details
    document.getElementById("photoSize").textContent = `${selectedExam.photoWidth} x ${selectedExam.photoHeight} px`;
    document.getElementById("photoMaxSize").textContent = selectedExam.maxFileSizeKB;

    document.getElementById("signatureSize").textContent = `${selectedExam.signatureWidth} x ${selectedExam.signatureHeight} px`;
    document.getElementById("signatureMaxSize").textContent = selectedExam.maxFileSizeKB;

    // Store exam data globally
    window.selectedExam = selectedExam;
  })
  .catch(error => {
    console.error("Error fetching exams.json:", error);
    document.getElementById("examName").textContent = "Could not load exam data.";
  });

// ====================
// Photo Upload Logic
// ====================
const photoUploadInput = document.getElementById("photoUpload");
const photoCanvas = document.getElementById("photoCanvas");
const photoCtx = photoCanvas.getContext("2d");

photoUploadInput.addEventListener("change", function(e) {
  handleImageUpload(e, photoCanvas, photoCtx);
});

document.getElementById("photoResizeButton").addEventListener("click", function() {
  processImage(photoCanvas, photoCtx, window.selectedExam.photoWidth, window.selectedExam.photoHeight, window.selectedExam.maxFileSizeKB);
});

// ====================
// Signature Upload Logic
// ====================
const signatureUploadInput = document.getElementById("signatureUpload");
const signatureCanvas = document.getElementById("signatureCanvas");
const signatureCtx = signatureCanvas.getContext("2d");

signatureUploadInput.addEventListener("change", function(e) {
  handleImageUpload(e, signatureCanvas, signatureCtx);
});

document.getElementById("signatureResizeButton").addEventListener("click", function() {
  processImage(signatureCanvas, signatureCtx, window.selectedExam.signatureWidth, window.selectedExam.signatureHeight, window.selectedExam.maxFileSizeKB);
});

// ====================
// Helper Functions
// ====================
function handleImageUpload(event, canvas, ctx) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function processImage(canvas, context, targetWidth, targetHeight, maxKB) {
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }

  resizeCanvas(canvas, context, targetWidth, targetHeight);
  compressCanvasToMaxKB(canvas, context, maxKB);
}

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
    downloadImage(dataUrl);
    alert(`Success! Final size: ${sizeKB.toFixed(1)} KB (under ${maxKB} KB)`);
  }
}

function dataURLSizeInKB(dataUrl) {
  const base64String = dataUrl.split(",")[1];
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / 1024;
}

function downloadImage(dataUrl) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "resized_image.jpg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
