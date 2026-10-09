const clr = document.getElementById('clr-button');
const taskList = document.getElementById('tasks');
const taskInput = document.getElementById('task-input');
const addtaskBtn = document.getElementById('add-task-button');
const taskMessage = document.getElementById('task-message');
let emptyState = document.getElementById('empty-state');
const tasksData = [];

function showMessage(message, isError = false) {
    taskMessage.textContent = message;
    taskMessage.classList.toggle('task-message-error', isError);
}

function updateEmptyState() {
    emptyState = taskList.querySelector('#empty-state');
    if (!emptyState) return;
    emptyState.hidden = tasksData.length > 0;
}

clr.addEventListener('click', () => {
    localStorage.clear();
    tasksData.length = 0;
    taskList.innerHTML = '<p id="empty-state" class="empty-state">No tasks yet. Add one to get started.</p>';
    getTaskStats();
    updateEmptyState();
    showMessage('Debug: localStorage cleared.', false);
});

addtaskBtn.addEventListener('click', handleTaskCreation);

taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleTaskCreation();
    }
});

function getTaskStats() {
    const total = tasksData.length;
    const completed = tasksData.filter(task => task.completed).length;
    const active = total - completed;

    const stats = document.getElementById('task-stats');
    stats.textContent = `Total: ${total}, Active: ${active}, Completed: ${completed}`;
}

function handleTaskCreation() {
    const inp = taskInput.value.trim();

    if (!inp) {
        showMessage('Please enter a task.', true);
        taskInput.focus();
        return;
    }

    const task = createTask(inp, false);
    tasksData.push(task);
    taskList.appendChild(task.element);

    saveTasks();
    getTaskStats();
    updateEmptyState();

    taskInput.value = '';
    taskInput.focus();
    showMessage('');
}

function createTask(content, completed) {
    const element = document.createElement('div');
    element.className = 'task';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';

    const taskContent = document.createElement('span');
    taskContent.className = 'task-content';
    taskContent.textContent = content;

    const editTaskButton = document.createElement('button');
    editTaskButton.className = 'edit-task-button';
    editTaskButton.type = 'button';

    const removeTaskButton = document.createElement('button');
    removeTaskButton.className = 'remove-task-button';
    removeTaskButton.type = 'button';

    element.append(checkbox, taskContent, editTaskButton, removeTaskButton);

    const task = {
        element: element,
        content: content,
        completed: completed
    };

    checkbox.checked = completed;
    if (completed) {
        element.classList.add('completed-task');
    }

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;

        if (task.completed) {
            element.classList.add('completed-task');
        } else {
            element.classList.remove('completed-task');
        }

        saveTasks();
        getTaskStats();
    });

    editTaskButton.addEventListener('click', () => startEditTask(task, taskContent));

    removeTaskButton.addEventListener('click', () => {
        const index = tasksData.indexOf(task);
        if (index !== -1) {
            tasksData.splice(index, 1);
        }

        element.remove();
        saveTasks();
        getTaskStats();
        updateEmptyState();
    });

    return task;
}

function startEditTask(task, taskContent) {
    const originalText = task.content;
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = originalText;

    const saveEdit = () => {
        const nextValue = editInput.value.trim();

        if (!nextValue) {
            editInput.replaceWith(taskContent);
            taskContent.textContent = originalText;
            showMessage('Task cannot be empty.', true);
            return;
        }

        task.content = nextValue;
        taskContent.textContent = nextValue;
        editInput.replaceWith(taskContent);

        saveTasks();
        getTaskStats();
        showMessage('');
    };

    const cancelEdit = () => {
        editInput.replaceWith(taskContent);
        taskContent.textContent = originalText;
        showMessage('');
    };

    taskContent.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    editInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveEdit();
        }

        if (event.key === 'Escape') {
            cancelEdit();
        }
    });

    editInput.addEventListener('blur', saveEdit);
}

function saveTasks() {
    const dataToSave = tasksData.map(task => {
        return {
            content: task.content,
            completed: task.completed
        };
    });

    localStorage.setItem('task', JSON.stringify(dataToSave));
}

const savedTasks = JSON.parse(localStorage.getItem('task')) || [];

for (const savedTask of savedTasks) {
    const task = createTask(savedTask.content, savedTask.completed);
    tasksData.push(task);
    taskList.appendChild(task.element);
}

updateEmptyState();
getTaskStats();