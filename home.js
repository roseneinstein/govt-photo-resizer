console.log("home.js loaded!");

// 1) Fetch the exams from exams.json
fetch('exams.json')
  .then(response => response.json())
  .then(examsData => {
    displayExamLinks(examsData);
  })
  .catch(error => {
    console.error("Error fetching exams.json:", error);
    const examListDiv = document.getElementById("examList");
    examListDiv.innerHTML = "Could not load exams. Please try again later.";
  });

// 2) Show each exam as a clickable link to exam.html
function displayExamLinks(examsData) {
  const examListDiv = document.getElementById("examList");
  examListDiv.innerHTML = "";

  if (!examsData || examsData.length === 0) {
    examListDiv.innerHTML = "No exams found in exams.json!";
    return;
  }

  examsData.forEach(exam => {
    // We'll make an <a> link that points to exam.html?name=ExamName
    const link = document.createElement("a");
    link.href = `exam.html?name=${encodeURIComponent(exam.name)}`;
    link.textContent = exam.name + " (" + exam.date + ")";

    // Bootstrap classes to make it look like a button
    link.classList.add("btn", "btn-primary", "my-2", "d-block");

    examListDiv.appendChild(link);
  });
}
