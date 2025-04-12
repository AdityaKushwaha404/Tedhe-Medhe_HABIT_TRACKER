const addHabitBtn = document.getElementById("addHabitBtn");
const habitModal = document.getElementById("habitModal");
const closeBtn = document.getElementById("closeBtn");
const createHabitBtn = document.getElementById("createHabit");
const habitContainer = document.getElementById("habitContainer");

let habitData = JSON.parse(localStorage.getItem("habitData")) || [];

function saveData() {
  localStorage.setItem("habitData", JSON.stringify(habitData));
}

const themeToggleBtn = document.getElementById("theme-toggle");

// Load saved theme
function applyTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggleBtn.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggleBtn.textContent = "🌙 Dark Mode";
  }
}

// Toggle theme
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

applyTheme();


function renderHabits() {
    habitContainer.innerHTML = "";
  
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
  
    const habitHeader = document.createElement("th");
    habitHeader.textContent = "Habit / Progress";
    headerRow.appendChild(habitHeader);
  
    for (let day = 1; day <= daysInMonth; day++) {
      const th = document.createElement("th");
      th.textContent = day;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
  
    habitData.forEach((habit, index) => {
      const tr = document.createElement("tr");
  
      const nameCell = document.createElement("td");
  
      // Habit name + delete button
      const habitNameContainer = document.createElement("div");
      habitNameContainer.classList.add("habit-name");
  
      const habitTitle = document.createElement("strong");
      habitTitle.textContent = `${habit.icon || ''} ${habit.name}`;
  
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.title = "Delete Habit";
  
      deleteBtn.addEventListener("click", () => {
        if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
          habitData.splice(index, 1);
          saveData();
          renderHabits();
        }
      });
  
      habitNameContainer.appendChild(habitTitle);
      habitNameContainer.appendChild(deleteBtn);
      nameCell.appendChild(habitNameContainer);
  
      // Progress Bar
      let doneCount = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${month + 1}-${d}`;
        if (habit.completed.includes(key)) doneCount++;
      }
      const percent = Math.round((doneCount / daysInMonth) * 100);
  
      const progressBarContainer = document.createElement("div");
      progressBarContainer.classList.add("progress-bar-container");
  
      const progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");
      progressBar.style.width = `${percent}%`;
  
      const progressLabel = document.createElement("div");
      progressLabel.classList.add("progress-label");
      progressLabel.textContent = `${percent}% completed`;
  
      progressBarContainer.appendChild(progressBar);
      nameCell.appendChild(progressBarContainer);
      nameCell.appendChild(progressLabel);
  
      tr.appendChild(nameCell);
  
      for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${year}-${month + 1}-${d}`;
        const td = document.createElement("td");
        td.classList.add("calendar-cell");
  
        if (habit.completed.includes(dateKey)) {
          td.classList.add("completed");
        }
  
        td.addEventListener("click", () => {
          const i = habit.completed.indexOf(dateKey);
          if (i > -1) {
            habit.completed.splice(i, 1);
          } else {
            habit.completed.push(dateKey);
          }
          saveData();
          renderHabits();
        });
  
        tr.appendChild(td);
      }
  
      table.appendChild(tr);
    });
  
    habitContainer.appendChild(table);
  }
  
  
  

addHabitBtn.addEventListener("click", () => {
  habitModal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  habitModal.classList.add("hidden");
});

createHabitBtn.addEventListener("click", () => {
  const name = document.getElementById("habitName").value.trim();
  const icon = document.getElementById("habitIcon").value;
  const freq = document.getElementById("habitFreq").value;

  if (name !== "") {
    habitData.push({
      name: name,
      icon: icon,
      frequency: freq,
      completed: []
    });
    saveData();
    renderHabits();
    habitModal.classList.add("hidden");

    // Reset form
    document.getElementById("habitName").value = "";
    document.getElementById("habitIcon").value = "";
  }
});

renderHabits();
