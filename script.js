let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

document.getElementById('add-child').addEventListener('click', () => {
    const nameInput = document.getElementById('child-name');
    const childName = nameInput.value.trim();

    if (childName) {
        const childId = `child-${Date.now()}`;
        tasks[childId] = { name: childName, taskList: [] };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        nameInput.value = '';
        renderTaskSections();
    }
});

function deleteChild(childId) {
    delete tasks[childId];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskSections();
}

function editTask(childId, index) {
    const taskText = prompt("タスクを編集してください:", tasks[childId].taskList[index].text);
    if (taskText !== null) {
        tasks[childId].taskList[index].text = taskText.trim();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(childId);
    }
}

function renderTaskSections() {
    const taskSections = document.getElementById('task-sections');
    taskSections.innerHTML = '';

    Object.entries(tasks).forEach(([childId, childData]) => {
        const section = document.createElement('div');
        section.classList.add('user-section');
        section.id = `section-${childId}`;
        section.innerHTML = `
            <div class="name-container">
                <h2>${childData.name}</h2>
                <button onclick="deleteChild('${childId}')">削除</button>
            </div>
            <ul id="task-list-${childId}">
            </ul>
            <input type="text" id="new-task-${childId}" placeholder="やることを追加">
            <button onclick="addTask('${childId}')">追加</button>
        `;
        taskSections.appendChild(section);
        renderTasks(childId);
    });
}

function renderTasks(childId) {
    const taskList = document.getElementById(`task-list-${childId}`);
    taskList.innerHTML = '';
    tasks[childId].taskList.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-icon">${task.completed ? "🌸" : ""}</span>
            <span>${task.text}</span>
            <button onclick="editTask('${childId}', ${index})">編集</button>
            <button onclick="completeTask('${childId}', ${index})">${task.completed ? "未完了" : "完了"}</button>
        `;
        if (task.completed) li.classList.add('completed');
        taskList.appendChild(li);
    });
}

function addTask(childId) {
    const input = document.getElementById(`new-task-${childId}`);
    const taskText = input.value.trim();

    if (taskText) {
        tasks[childId].taskList.push({ text: taskText, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        input.value = '';
        renderTasks(childId);
    }
}

function completeTask(childId, index) {
    tasks[childId].taskList[index].completed = !tasks[childId].taskList[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(childId);
}

renderTaskSections();
