document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("taskList");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const searchBox = document.getElementById("searchBox");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage

    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to render tasks
    function renderTasks(filter = "all", searchQuery = "") {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            if (filter !== "all" && task.status !== filter) return;
            if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

            const taskDiv = document.createElement("div");
            taskDiv.className = `task-card ${task.status}`;
            taskDiv.innerHTML = `
                <strong>${task.name}</strong><br>
                ${task.desc}<br>
                <strong>Due Date:</strong> ${task.date}<br>
                <strong>Status:</strong> ${task.status}<br>
                <button class="toggle-btn" onclick="toggleStatus(${index})">Toggle Status</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            `;
            taskList.appendChild(taskDiv);
        });
    }

    // Function to add a task
    addTaskBtn.addEventListener("click", () => {
        const name = document.getElementById("taskName").value.trim();
        const desc = document.getElementById("taskDesc").value.trim();
        const date = document.getElementById("taskDate").value;

        if (name === "" || date === "") {
            alert("Task Name and Due Date are required!");
            return;
        }

        tasks.push({ name, desc, date, status: "pending" });
        saveTasks(); // Save tasks after adding
        document.getElementById("taskName").value = "";
        document.getElementById("taskDesc").value = "";
        document.getElementById("taskDate").value = "";
        renderTasks();
    });

    // Function to toggle status
    window.toggleStatus = (index) => {
        tasks[index].status = tasks[index].status === "pending" ? "completed" : "pending";
        saveTasks(); // Save tasks after status change
        renderTasks();
    };

    // Function to delete a task
    window.deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks(); // Save tasks after deletion
        renderTasks();
    };

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderTasks(button.dataset.filter);
        });
    });

    // Search tasks
    searchBox.addEventListener("input", () => {
        renderTasks(document.querySelector(".filter-btn.active")?.dataset.filter || "all", searchBox.value);
    });

    renderTasks(); // Initial render
});
