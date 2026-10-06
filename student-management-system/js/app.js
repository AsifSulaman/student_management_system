// ================= DATA =================
const programs = ["Computer Science", "Software Engineering", "Information Technology", "Data Science"];

let students = [];            // the list of all students (the app's main data)
let editingId = null;         // student ID being edited (null = adding a new one)
let deleteId = null;          // student ID waiting for delete confirmation
let currentStudentId = null;  // student shown on the profile / courses page

// Shortcut: $("name") is the same as document.getElementById("name")
function $(id) { return document.getElementById(id); }

// Stops user text from being treated as HTML code
function escapeHTML(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ================= LOCALSTORAGE =================
// localStorage is a small storage box inside the browser. It keeps text
// under a name (a "key") even after the page is refreshed or closed.
// It can only store text, so we convert our list to text with JSON.stringify()
// and back into a real list with JSON.parse().

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function loadStudents() {
  const savedText = localStorage.getItem("students"); // null if nothing saved yet
  if (savedText !== null) {
    try {
      students = JSON.parse(savedText);
    } catch (error) {
      // the saved text was damaged, so start fresh instead of crashing
      students = makeSampleStudents();
      saveStudents();
    }
  } else {
    students = makeSampleStudents(); // first visit: start with sample data
    saveStudents();
  }
}

function makeSampleStudents() {
  return [
    { name: "Ali Khan", studentId: "CS-2023-001", email: "ali.khan@example.edu", dob: "2004-03-12",
      program: "Computer Science", semester: 3, gpa: 0, courses: [
        { name: "Programming Fundamentals", code: "CS101", credits: 3, grade: "A" },
        { name: "Calculus", code: "MATH101", credits: 3, grade: "B+" },
        { name: "Digital Logic Design", code: "CS102", credits: 3, grade: "A-" } ] },
    { name: "Hamza Ahmed", studentId: "SE-2022-014", email: "hamza.ahmed@example.edu", dob: "2003-07-25",
      program: "Software Engineering", semester: 5, gpa: 3.21, courses: [] },
    { name: "Sara Malik", studentId: "DS-2024-007", email: "sara.malik@example.edu", dob: "2005-01-09",
      program: "Data Science", semester: 1, gpa: 0, courses: [
        { name: "Statistics", code: "STAT101", credits: 3, grade: "A" },
        { name: "Intro to Python", code: "DS101", credits: 4, grade: "A-" } ] },
    { name: "Zain Abbas", studentId: "IT-2021-022", email: "zain.abbas@example.edu", dob: "2002-11-30",
      program: "Information Technology", semester: 7, gpa: 2.85, courses: [] },
    { name: "Ayesha Noor", studentId: "CS-2022-031", email: "ayesha.noor@example.edu", dob: "2003-05-18",
      program: "Computer Science", semester: 5, gpa: 3.64, courses: [] }
  ];
}

// A student's GPA: calculated from courses if they have any, otherwise the typed-in GPA
function getGPA(student) {
  if (student.courses.length > 0) {
    return calculateGPA(student.courses);
  }
  return student.gpa;
}

// ================= SMALL HELPERS =================
function showPage(name) {
  for (const page of document.querySelectorAll(".page")) { page.classList.remove("show"); }
  $(name).classList.add("show");
  for (const link of document.querySelectorAll("nav a")) {
    link.classList.toggle("active", link.dataset.page === (name === "profile" ? "students" : name));
  }
  $("sidebar").classList.remove("open");
  window.scrollTo(0, 0);
  // redraw pages that show data
  if (name === "dashboard") { renderDashboard(); }
  if (name === "students") { renderStudents(); }
  if (name === "courses") { renderCoursesPage(); }
}

let toastTimer = null;
function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer); // cancel the old hide-timer so a new toast is not hidden early
  toastTimer = setTimeout(function () { $("toast").classList.remove("show"); }, 2500);
}

function emptyState(message, buttonText) {
  return `<div class="panel empty"><p>${message}</p>` +
    (buttonText ? `<button class="btn" onclick="openAddForm()">${buttonText}</button>` : "") + `</div>`;
}

// First letters of the first and last name: "Ali Khan" becomes "AK"
function initials(name) {
  const parts = name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (parts[0][0] + last).toUpperCase();
}

// Small colored label for a GPA: green = strong, grey = okay, red = needs attention
function gpaChip(gpa) {
  let level = "mid";
  if (gpa >= 3.5) { level = "high"; }
  if (gpa < 2.5) { level = "low"; }
  return `<span class="chip ${level}">${gpa.toFixed(2)}</span>`;
}

// Counts a number up from 0 so the dashboard feels alive.
// decimals = how many digits to show after the point.
function animateNumber(elementId, target, decimals) {
  const element = $(elementId);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = target.toFixed(decimals); // skip the animation if the user prefers
    return;
  }
  const steps = 20;
  let step = 0;
  const timer = setInterval(function () {
    step = step + 1;
    element.textContent = (target * step / steps).toFixed(decimals);
    if (step >= steps) { clearInterval(timer); } // stop the repeating timer
  }, 20);
}

// ================= DASHBOARD =================
function renderDashboard() {
  let totalGPA = 0, highestGPA = 0, totalCourses = 0;
  for (const student of students) {
    const gpa = getGPA(student);
    totalGPA = totalGPA + gpa;
    if (gpa > highestGPA) { highestGPA = gpa; }
    totalCourses = totalCourses + student.courses.length;
  }
  const averageGPA = students.length > 0 ? totalGPA / students.length : 0;

  animateNumber("stat-total", students.length, 0);
  animateNumber("stat-average", averageGPA, 2);
  animateNumber("stat-highest", highestGPA, 2);
  animateNumber("stat-courses", totalCourses, 0);

  // Recent students: the last 5 added, newest first
  if (students.length === 0) {
    $("recent-list").innerHTML = "<p class='hint'>No students have been added yet.</p>";
  } else {
    let html = "";
    for (const student of students.slice(-5).reverse()) {
      html += `<div class="row"><div class="person"><span class="avatar">${initials(student.name)}</span>
        <div><button class="link" style="padding:0" onclick="viewStudent('${student.studentId}')">${escapeHTML(student.name)}</button>
        <small>${student.studentId}</small><small>${student.program}, semester ${student.semester}</small></div></div>
        ${gpaChip(getGPA(student))}</div>`;
    }
    $("recent-list").innerHTML = html;
  }

  // Program overview: count students per program, draw a simple bar
  let overview = "";
  for (const program of programs) {
    const count = students.filter(s => s.program === program).length;
    const percent = students.length > 0 ? (count / students.length) * 100 : 0;
    overview += `<div class="bar-label"><span>${program}</span><span>${count}</span></div>
      <div class="bar"><div style="width:${percent}%"></div></div>`;
  }
  $("program-overview").innerHTML = overview;
}

// ================= STUDENTS TABLE =================
function renderStudents() {
  const searchText = $("search").value.trim().toLowerCase();

  // keep only students whose name, ID or email contains the search text
  const matches = students.filter(function (student) {
    return student.name.toLowerCase().includes(searchText) ||
           student.studentId.toLowerCase().includes(searchText) ||
           student.email.toLowerCase().includes(searchText);
  });

  // sort the matches. filter() made a new list, so the original order is untouched.
  const sortBy = $("sort").value;
  if (sortBy === "name") {
    matches.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "gpa") {
    matches.sort((a, b) => getGPA(b) - getGPA(a));
  } else {
    matches.reverse(); // newest first = last added comes first
  }

  if (students.length === 0) {
    $("students-table").innerHTML = emptyState("No students have been added yet.", "Add your first student");
    return;
  }
  if (matches.length === 0) {
    $("students-table").innerHTML = emptyState("No students match your search.", "");
    return;
  }

  let rows = "";
  for (const student of matches) {
    rows += `<tr>
      <td>${student.studentId}</td><td>${escapeHTML(student.name)}</td>
      <td>${student.program}</td><td>${student.semester}</td>
      <td>${gpaChip(getGPA(student))}</td>
      <td><button class="link" onclick="viewStudent('${student.studentId}')">View</button>
          <button class="link" onclick="openEditForm('${student.studentId}')">Edit</button>
          <button class="link red" onclick="askDelete('${student.studentId}')">Delete</button></td></tr>`;
  }
  $("students-table").innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>Student ID</th><th>Name</th><th>Program</th><th>Semester</th><th>GPA</th><th>Actions</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

// ================= ADD / EDIT STUDENT =================
function openAddForm() {
  editingId = null;
  $("student-form").reset();
  $("form-error").textContent = "";
  $("form-title").textContent = "Add Student";
  showPage("add");
  $("f-name").focus();
}

function openEditForm(id) {
  const student = students.find(s => s.studentId === id); // find the one matching student
  editingId = id;
  $("f-name").value = student.name;
  $("f-id").value = student.studentId;
  $("f-email").value = student.email;
  $("f-dob").value = student.dob;
  $("f-program").value = student.program;
  $("f-semester").value = student.semester;
  $("f-gpa").value = getGPA(student).toFixed(2); // show the GPA the app is really using
  $("form-error").textContent = "";
  $("form-title").textContent = "Edit Student";
  showPage("add");
}

// Returns an error message, or "" if everything is fine
function validateStudent(student) {
  if (student.name === "") { return "Name cannot be empty."; }
  if (student.studentId === "") { return "Student ID cannot be empty."; }
  if (!/^[A-Za-z0-9-]+$/.test(student.studentId)) { return "Student ID can only use letters, numbers and dashes."; }
  if (!/^\S+@\S+\.\S+$/.test(student.email)) { return "Enter a valid email, like name@example.edu."; }
  if (student.dob === "") { return "Date of birth is required."; }
  const today = new Date().toISOString().slice(0, 10); // today as YYYY-MM-DD
  if (student.dob > today) { return "Date of birth cannot be in the future."; }
  if (isNaN(student.gpa) || student.gpa < 0 || student.gpa > 4) { return "GPA must be between 0 and 4."; }
  const duplicate = students.find(s => s.studentId === student.studentId && s.studentId !== editingId);
  if (duplicate) { return "A student with this ID already exists."; }
  const emailTaken = students.find(s => s.email.toLowerCase() === student.email.toLowerCase() && s.studentId !== editingId);
  if (emailTaken) { return "Another student already uses this email."; }
  return "";
}

function saveStudentForm(event) {
  event.preventDefault(); // stop the browser from reloading the page

  // 1. collect form data into a student object
  const student = {
    name: $("f-name").value.trim(),
    studentId: $("f-id").value.trim(),
    email: $("f-email").value.trim(),
    dob: $("f-dob").value,
    program: $("f-program").value,
    semester: Number($("f-semester").value),
    gpa: Number($("f-gpa").value),
    courses: []
  };

  // 2. check it
  const errorMessage = validateStudent(student);
  if (errorMessage !== "") {
    $("form-error").textContent = errorMessage;
    return;
  }

  // 3. add new student, or replace the one being edited
  if (editingId === null) {
    students.push(student);
    $("search").value = ""; // clear the search so the new student is visible
    showToast("Student added successfully.");
  } else {
    const oldStudent = students.find(s => s.studentId === editingId);
    student.courses = oldStudent.courses; // keep their courses
    students[students.indexOf(oldStudent)] = student;
    showToast("Student information updated.");
  }

  // 4. save, clear the form, go back to the list
  saveStudents();
  $("student-form").reset();
  editingId = null;
  showPage("students");
}

// ================= PROFILE =================
function infoItem(label, value) {
  return `<div><span>${label}</span>${escapeHTML(value)}</div>`;
}

// Builds the courses table. showRemove adds a Remove button column.
function courseTableHTML(student, showRemove) {
  if (student.courses.length === 0) {
    return "<p class='hint'>No courses have been added for this student yet.</p>";
  }
  let rows = "";
  for (let i = 0; i < student.courses.length; i++) {
    const course = student.courses[i];
    rows += `<tr><td>${escapeHTML(course.name)}</td><td>${escapeHTML(course.code)}</td>
      <td class="num">${course.credits}</td><td>${course.grade}</td>` +
      (showRemove ? `<td><button class="link red" onclick="removeCourse(${i})">Remove</button></td>` : "") + `</tr>`;
  }
  return `<div class="table-wrap"><table><thead><tr><th>Course</th><th>Code</th><th class="num">Credits</th><th>Grade</th>
    ${showRemove ? "<th></th>" : ""}</tr></thead><tbody>${rows}</tbody></table></div>
    <p class="gpa-line">Calculated GPA: <strong>${calculateGPA(student.courses).toFixed(2)}</strong></p>`;
}

function viewStudent(id) {
  const student = students.find(s => s.studentId === id);
  currentStudentId = id;
  $("profile-content").innerHTML = `
    <div class="page-head"><div class="person"><span class="avatar big">${initials(student.name)}</span>
      <div><h1>${escapeHTML(student.name)}</h1><p class="subtitle" style="margin:0">${student.studentId}</p></div></div>
      <div><button class="btn ghost" onclick="showPage('students')">Back</button>
      <button class="btn ghost" onclick="openEditForm('${id}')">Edit</button>
      <button class="btn" onclick="showPage('courses')">Add courses</button></div></div>
    <div class="panel"><h2>Student Information</h2><div class="info">
      ${infoItem("Name", student.name)}${infoItem("Student ID", student.studentId)}
      ${infoItem("Email", student.email)}${infoItem("Date of Birth", student.dob)}
      ${infoItem("Program", student.program)}${infoItem("Semester", student.semester)}
      ${infoItem("Current GPA", getGPA(student).toFixed(2))}</div></div>
    <div class="panel"><h2>Academic Performance</h2>${courseTableHTML(student, false)}</div>`;
  showPage("profile");
}

// ================= COURSES & GRADES =================
function renderCoursesPage() {
  const hasStudents = students.length > 0;
  $("courses-empty").classList.toggle("hidden", hasStudents);
  $("courses-main").classList.toggle("hidden", !hasStudents);
  if (!hasStudents) { return; }

  // if the remembered student no longer exists, use the first one
  if (!students.find(s => s.studentId === currentStudentId)) { currentStudentId = students[0].studentId; }

  let options = "";
  for (const student of students) {
    options += `<option value="${student.studentId}">${escapeHTML(student.name)} (${student.studentId})</option>`;
  }
  $("course-student").innerHTML = options;
  $("course-student").value = currentStudentId;
  renderCourseList();
}

function renderCourseList() {
  const student = students.find(s => s.studentId === currentStudentId);
  $("course-list").innerHTML = courseTableHTML(student, true);
  updatePreview();
}

// "What if" preview: shows what the GPA would become if this course were added
function updatePreview() {
  const student = students.find(s => s.studentId === currentStudentId);
  const credits = Number($("c-credits").value);
  if (!student || !(credits >= 1 && credits <= 6)) { $("gpa-preview").textContent = ""; return; }

  const newCourse = { grade: $("c-grade").value, credits: credits };
  const newGPA = calculateGPA(student.courses.concat([newCourse])); // concat = copy of list plus one more
  let text = "If you add this course, GPA becomes " + newGPA.toFixed(2);
  if (student.courses.length > 0) { text = text + " (now " + calculateGPA(student.courses).toFixed(2) + ")"; }
  $("gpa-preview").textContent = text + ".";
}

function addCourse(event) {
  event.preventDefault();
  const name = $("c-name").value.trim();
  const code = $("c-code").value.trim();
  const credits = Number($("c-credits").value);

  if (name === "" || code === "") { $("course-error").textContent = "Course name and code are required."; return; }
  if (!(credits >= 1 && credits <= 6)) { $("course-error").textContent = "Credit hours must be between 1 and 6."; return; }

  const student = students.find(s => s.studentId === currentStudentId);
  const sameCode = student.courses.find(c => c.code.toLowerCase() === code.toLowerCase());
  if (sameCode) { $("course-error").textContent = "This student already has a course with that code."; return; }
  student.courses.push({ name: name, code: code, credits: credits, grade: $("c-grade").value });
  saveStudents();

  $("course-error").textContent = "";
  $("c-name").value = "";
  $("c-code").value = "";
  renderCourseList();
  showToast("Course added.");
}

function removeCourse(index) {
  const student = students.find(s => s.studentId === currentStudentId);
  student.courses.splice(index, 1); // remove 1 item at this position
  saveStudents();
  renderCourseList();
  showToast("Course removed.");
}

// ================= DELETE =================
function askDelete(id) {
  deleteId = id;
  $("modal").classList.remove("hidden");
}

function closeModal() {
  $("modal").classList.add("hidden");
  deleteId = null;
}

function confirmDelete() {
  students = students.filter(s => s.studentId !== deleteId); // keep everyone except this student
  saveStudents();
  closeModal();
  renderStudents();
  showToast("Student deleted successfully.");
}

// ================= START THE APP =================
function fillDropdowns() {
  for (const program of programs) { $("f-program").innerHTML += `<option>${program}</option>`; }
  for (let semester = 1; semester <= 8; semester++) { $("f-semester").innerHTML += `<option>${semester}</option>`; }
  for (const grade in gradePoints) { $("c-grade").innerHTML += `<option>${grade}</option>`; }
}

for (const link of document.querySelectorAll("nav a")) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    if (link.dataset.page === "add") { openAddForm(); } else { showPage(link.dataset.page); }
  });
}
$("menu-btn").addEventListener("click", function () { $("sidebar").classList.toggle("open"); });
$("search").addEventListener("input", renderStudents);
$("sort").addEventListener("change", renderStudents);
$("c-grade").addEventListener("change", updatePreview);
$("c-credits").addEventListener("input", updatePreview);
// close the delete modal by clicking the dark area or pressing Escape
$("modal").addEventListener("click", function (event) { if (event.target === $("modal")) { closeModal(); } });
document.addEventListener("keydown", function (event) { if (event.key === "Escape") { closeModal(); } });
$("student-form").addEventListener("submit", saveStudentForm);
$("course-form").addEventListener("submit", addCourse);
$("course-student").addEventListener("change", function () {
  currentStudentId = $("course-student").value;
  renderCourseList();
});

fillDropdowns();
loadStudents();
showPage("dashboard");
