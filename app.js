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

function editChildName(childId) {
    const nameDisplay = document.getElementById(`child-name-display-${childId}`);
    const nameInput = document.getElementById(`child-name-input-${childId}`);
    const editButton = nameDisplay.nextElementSibling;

    if (nameDisplay.classList.contains('hidden')) {
        const newName = nameInput.value.trim();
        if (newName) {
            tasks[childId].name = newName;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        nameDisplay.textContent = newName || tasks[childId].name;
        nameDisplay.classList.remove('hidden');
        nameInput.classList.add('hidden');
        editButton.textContent = '編集';
    } else {
        nameInput.classList.remove('hidden');
        nameDisplay.classList.add('hidden');
        editButton.textContent = '保存';
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
                <h2 id="child-name-display-${childId}">${childData.name}</h2>
                <input type="text" id="child-name-input-${childId}" class="hidden" value="${childData.name}">
                <button onclick="editChildName('${childId}')">編集</button>
                <button class="delete-button" onclick="deleteChild('${childId}')">削除</button>
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
        if (typeof task === 'object' && task.text) {
            const li = document.createElement('li');
            li.innerHTML = `
                ${task.text}
                <button onclick="completeTask('${childId}', ${index})">完了</button>
            `;
            if (task.completed) {
                li.classList.add('completed');
            }
            taskList.appendChild(li);
        } else {
            console.error('タスクの形式が不正です:', task);
        }
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
    tasks[childId].taskList[index].completed = true;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(childId);
}

renderTaskSections();
