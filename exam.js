console.log("exam.js loaded!");

// Prevent default drag-and-drop behavior on the document (so files aren’t opened by the browser)
document.addEventListener('dragover', function(e) {
  e.preventDefault();
});
document.addEventListener('drop', function(e) {
  e.preventDefault();
});

// 1) Get the exam name from the URL (e.g., exam.html?name=IIT-JEE%202025)
const urlParams = new URLSearchParams(window.location.search);
const examNameParam = urlParams.get("name");
console.log("Exam name from URL:", examNameParam);

// 2) Fetch exams.json and set the selected exam
fetch('exams.json')
  .then(response => response.json())
  .then(examsData => {
    const selectedExam = examsData.find(e => e.name === examNameParam);
    if (!selectedExam) {
      document.getElementById("examName").textContent = "Exam not found!";
      return;
    }
    document.getElementById("examName").textContent = selectedExam.name;  // Keeps the exam name in English
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
const photoFileName = document.getElementById("photoFileName"); // Display file name
const photoCanvas = document.getElementById("photoCanvas");
const photoCtx = photoCanvas.getContext("2d");
const photoResizeBtn = document.getElementById("photoResizeButton");
const photoDownloadBtn = document.getElementById("photoDownloadButton");

photoUploadInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    photoFileName.textContent = file.name; // Show file name
  }
  loadAndDrawImage(file, photoCanvas, photoCtx);
  photoResizeBtn.disabled = false; // Enable resize button after file is uploaded
});

photoResizeBtn.addEventListener("click", function() {
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }
  resizeAndCompress(
    photoCanvas,
    photoCtx,
    window.selectedExam.photoWidth,
    window.selectedExam.photoHeight,
    window.selectedExam.photoMinKB,
    window.selectedExam.photoMaxKB,
    photoDownloadBtn
  );
});

photoDownloadBtn.addEventListener("click", function() {
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }
  downloadCompressedJPG(
    photoCanvas,
    "resized_photo.jpg",
    window.selectedExam.photoMinKB,
    window.selectedExam.photoMaxKB
  );
});

// ====================
// Signature Logic
// ====================
const signatureUploadInput = document.getElementById("signatureUpload");
const signatureFileName = document.getElementById("signatureFileName"); // Display file name
const signatureCanvas = document.getElementById("signatureCanvas");
const signatureCtx = signatureCanvas.getContext("2d");
const signatureResizeBtn = document.getElementById("signatureResizeButton");
const signatureDownloadBtn = document.getElementById("signatureDownloadButton");

signatureUploadInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    signatureFileName.textContent = file.name; // Show file name
  }
  loadAndDrawImage(file, signatureCanvas, signatureCtx);
  signatureResizeBtn.disabled = false; // Enable resize button after file is uploaded
});

signatureResizeBtn.addEventListener("click", function() {
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }
  resizeAndCompress(
    signatureCanvas,
    signatureCtx,
    window.selectedExam.signatureWidth,
    window.selectedExam.signatureHeight,
    window.selectedExam.signatureMinKB,
    window.selectedExam.signatureMaxKB,
    signatureDownloadBtn
  );
});

signatureDownloadBtn.addEventListener("click", function() {
  if (!window.selectedExam) {
    alert("Exam info not loaded!");
    return;
  }
  downloadCompressedJPG(
    signatureCanvas,
    "resized_signature.jpg",
    window.selectedExam.signatureMinKB,
    window.selectedExam.signatureMaxKB
  );
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
  if (file) reader.readAsDataURL(file);
}

function resizeAndCompress(canvas, context, targetWidth, targetHeight, minKB, maxKB, downloadButton) {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;
  
  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  context.drawImage(tempCanvas, 0, 0);
  
  downloadButton.disabled = false;
}

function downloadCompressedJPG(canvas, filename, minKB, maxKB) {
  let quality = 1.0;
  function attemptDownload() {
    canvas.toBlob((blob) => {
      const fileSizeKB = blob.size / 1024;
      if (fileSizeKB > maxKB && quality > 0.1) {
        quality -= 0.05;
        attemptDownload();
      } else if (fileSizeKB < minKB) {
        alert(`File size too small (${fileSizeKB.toFixed(1)} KB). Minimum required is ${minKB} KB.`);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(`Downloaded file size: ${fileSizeKB.toFixed(1)} KB (within ${minKB}-${maxKB} KB)`);
      }
    }, "image/jpeg", quality);
  }
  attemptDownload();
}

// ====================
// Drag and Drop Functionality (for the always-visible drop boxes)
// ====================

// Photo Drop Box Events
const photoDropBox = document.getElementById('photoDropBox');
photoDropBox.addEventListener('dragover', function(e) {
  e.preventDefault();
  photoDropBox.classList.add('active');
});
photoDropBox.addEventListener('dragleave', function(e) {
  e.preventDefault();
  photoDropBox.classList.remove('active');
});
photoDropBox.addEventListener('drop', function(e) {
  e.preventDefault();
  photoDropBox.classList.remove('active');
  const file = e.dataTransfer.files[0];
  if (file) {
    loadAndDrawImage(file, photoCanvas, photoCtx);
    photoResizeBtn.disabled = false; // Enable resize button when image is dropped
    photoFileName.textContent = file.name; // Show file name after file is dropped
  }
});

// Signature Drop Box Events
const signatureDropBox = document.getElementById('signatureDropBox');
signatureDropBox.addEventListener('dragover', function(e) {
  e.preventDefault();
  signatureDropBox.classList.add('active');
});
signatureDropBox.addEventListener('dragleave', function(e) {
  e.preventDefault();
  signatureDropBox.classList.remove('active');
});
signatureDropBox.addEventListener('drop', function(e) {
  e.preventDefault();
  signatureDropBox.classList.remove('active');
  const file = e.dataTransfer.files[0];
  if (file) {
    loadAndDrawImage(file, signatureCanvas, signatureCtx);
    signatureResizeBtn.disabled = false; // Enable resize button when image is dropped
    signatureFileName.textContent = file.name; // Show file name after file is dropped
  }
});
