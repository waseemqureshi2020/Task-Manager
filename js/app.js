// 1. DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// 2. State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // 'all', 'active', or 'completed'

// 3. Initialize App
function init() {
    renderTasks();
}

// 4. Save to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 5. Add Task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    const newTask = {
        id: Date.now(), // Unique ID using timestamp
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    
    saveTasks();
    renderTasks();
}

// 6. Render Tasks (The most important function)
function renderTasks() {
    // Clear the list
    taskList.innerHTML = '';

    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Create DOM elements for each task
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" data-id="${task.id}">×</button>
        `;
        
        taskList.appendChild(li);
    });

    updateStats();
}

// 7. Update Stats
function updateStats() {
    const activeTasks = tasks.filter(task => !task.completed);
    taskCount.textContent = `${activeTasks.length} task${activeTasks.length !== 1 ? 's' : ''} left`;
}

// 8. Toggle Task Completion (Event Delegation)
taskList.addEventListener('change', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const id = Number(e.target.dataset.id);
        const task = tasks.find(task => task.id === id);
        
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }
});

// 9. Delete Task (Event Delegation)
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.dataset.id);
        tasks = tasks.filter(task => task.id !== id); // Filter out the deleted task
        
        saveTasks();
        renderTasks();
    }
});

// 10. Filter Tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// 11. Clear Completed Tasks
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// 12. Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Start the app
init();