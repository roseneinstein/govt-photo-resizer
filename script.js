// Log a welcome message to ensure the file is working.
console.log("Welcome to Govt Exam Photo Resizer!");

// Get the HTML elements
const uploadInput = document.getElementById("upload");
const canvas = document.getElementById("photoCanvas");
const ctx = canvas.getContext("2d");

// When an image is uploaded...
uploadInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      // Set the canvas size equal to the image size
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
    }
    img.src = event.target.result;
  }

  if(file) {
    reader.readAsDataURL(file);
  }
});

// When the "Resize Image" button is clicked...
const resizeButton = document.getElementById("resizeButton");
resizeButton.addEventListener("click", function() {
  // Get the selected exam preset
  const preset = document.getElementById("examPreset").value;
  const [targetWidth, targetHeight] = preset.split("x").map(Number);

  // Create a temporary canvas to resize the image
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;

  // Draw the image from the original canvas into the temporary canvas, resizing it
  tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);

  // Replace the original canvas content with the resized image
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(tempCanvas, 0, 0);
});
