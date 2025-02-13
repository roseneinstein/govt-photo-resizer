console.log("exam.js loaded!");

// 1) Get the exam name from the URL (e.g. exam.html?name=IIT-JEE%202025)
const urlParams = new URLSearchParams(window.location.search);
const examNameParam = urlParams.get("name");
console.log("Exam name from URL:", examNameParam);

// 2) Fetch exams.json
fetch('exams.json')
  .then(response => response.json())
  .then(examsData => {
    const selectedExam = examsData.find(e => e.name === examNameParam);
    if (!selectedExam) {
      document.getElementById("examName").textContent = "Exam not found!";
      return;
    }
    document.getElementById("examName").textContent = selectedExam.name;
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
  resizeAndCompress(photoCanvas, photoCtx, window.selectedExam.photoWidth, window.selectedExam.photoHeight);
  photoDownloadBtn.disabled = false;
});

photoDownloadBtn.addEventListener("click", function() {
  downloadCompressedJPG(photoCanvas, "resized_photo.jpg", window.selectedExam.maxFileSizeKB);
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
  resizeAndCompress(signatureCanvas, signatureCtx, window.selectedExam.signatureWidth, window.selectedExam.signatureHeight);
  signatureDownloadBtn.disabled = false;
});

signatureDownloadBtn.addEventListener("click", function() {
  downloadCompressedJPG(signatureCanvas, "resized_signature.jpg", window.selectedExam.maxFileSizeKB);
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
      canvas.classList.remove("d-none"); // Show canvas after loading
    };
    img.src = event.target.result;
  };
  if (file) reader.readAsDataURL(file);
}

function resizeAndCompress(canvas, context, targetWidth, targetHeight) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;
  
  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.drawImage(tempCanvas, 0, 0);
}

function downloadCompressedJPG(canvas, filename, maxKB) {
  let quality = 1.0;

  function attemptDownload() {
    canvas.toBlob((blob) => {
      if (blob.size / 1024 > maxKB && quality > 0.1) {
        quality -= 0.05;
        attemptDownload();
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(`Downloaded file size: ${(blob.size / 1024).toFixed(1)} KB (under ${maxKB} KB)`);
      }
    }, "image/jpeg", quality);
  }

  attemptDownload();
}
