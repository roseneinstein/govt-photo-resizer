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

// 2) Show each exam as a clickable "list-group-item"
function displayExamLinks(examsData) {
  const examListDiv = document.getElementById("examList");
  examListDiv.innerHTML = "";

  if (!examsData || examsData.length === 0) {
    examListDiv.innerHTML = "No exams found in exams.json!";
    return;
  }

  examsData.forEach(exam => {
    // Create an <a> element for each exam
    const link = document.createElement("a");
    link.href = `exam.html?name=${encodeURIComponent(exam.name)}`;
    link.textContent = exam.name + " (" + exam.date + ")";

    // Use Bootstrap classes for list-group items
    // "list-group-item" gives the box style
    // "list-group-item-action" makes it clickable
    // "mb-2" adds bottom margin for spacing
    link.classList.add("list-group-item", "list-group-item-action", "mb-2");

    examListDiv.appendChild(link);
  });
}
