const courses = [
  { subject: "CSE", number: 110, title: "Introduction to Programming", credits: 2, certificate: "Web and Computer Programming", completed: true },
  { subject: "CSE", number: 111, title: "Programming with Functions", credits: 2, certificate: "Web and Computer Programming", completed: false },
  { subject: "CSE", number: 210, title: "Programming with Classes", credits: 2, certificate: "Web and Computer Programming", completed: false },
  { subject: "WDD", number: 130, title: "Web Fundamentals", credits: 2, certificate: "Web and Computer Programming", completed: true },
  { subject: "WDD", number: 131, title: "Dynamic Web Fundamentals", credits: 2, certificate: "Web and Computer Programming", completed: false },
  { subject: "WDD", number: 231, title: "Frontend Web Development I", credits: 2, certificate: "Web and Computer Programming", completed: false },
];

const courseContainer = document.getElementById("course-cards");
const creditTotal = document.getElementById("credit-total");
const filterButtons = document.querySelectorAll(".filter-btn");

function renderCourses(filter) {
  const filtered = courses.filter((course) => {
    if (filter === "all") return true;
    return course.subject.toLowerCase() === filter;
  });

  courseContainer.innerHTML = "";

  filtered.forEach((course) => {
    const card = document.createElement("div");
    card.className = "course-card" + (course.completed ? " completed" : "");
    card.innerHTML = `
      <p class="course-title">${course.subject} ${course.number}</p>
      <p>${course.title}</p>
      <p class="course-credits">${course.credits} credit${course.credits === 1 ? "" : "s"}${course.completed ? " • Completed" : ""}</p>
    `;
    courseContainer.appendChild(card);
  });

  const totalCredits = filtered.reduce((sum, course) => sum + course.credits, 0);
  creditTotal.textContent = `The total number of credits for the courses are ${totalCredits}.`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderCourses(button.dataset.filter);
  });
});

renderCourses("all");
