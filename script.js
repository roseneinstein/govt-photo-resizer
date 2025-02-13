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

// This function will display the upcoming exams as buttons
function displayUpcomingExams() {
  const examListDiv = document.getElementById("examList");
  // Clear anything already inside examListDiv
  examListDiv.innerHTML = "";

  // Go through each exam in our array
  upcomingExams.forEach((exam) => {
    // Create a button for this exam
    const examButton = document.createElement("button");
    examButton.textContent = exam.name + " (" + exam.date + ")";

    // When the user clicks the button, just show an alert for now
    examButton.addEventListener("click", function() {
      alert("You selected: " + exam.name);
    });

    // Add the button to the examListDiv
    examListDiv.appendChild(examButton);
    examListDiv.appendChild(document.createElement("br"));
  });
}

// Call the function to display the upcoming exams when the page loads
displayUpcomingExams();

/* 
  ---------------------------------------------------------
  ORIGINAL IMAGE UPLOAD/RESIZE CODE (for reference)
  ---------------------------------------------------------
  We'll later adapt or remove this code when we create a
  dedicated photo/signature resizing step for each exam.
*/

// Get the HTML elements for the original dropdown-based approach
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
  // If there's no dropdown, this won't do much, but let's keep it for now
  const presetSelect = document.getElementById("examPreset");
  if (!presetSelect) return;

  const [targetWidth, targetHeight] = presetSelect.value.split("x").map(Number);

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
