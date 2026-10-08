const clr = document.getElementById('clr-button');

clr.addEventListener('click', () => {
     localStorage.clear();
    tasksData.length = 0;
    taskList.innerHTML = '';
    getTaskStats();
    console.log('cleared localStorage');
});

const taskList = document.getElementById('tasks');
const taskInput = document.getElementById('task-input');
const addtaskBtn = document.getElementById('add-task-button');
const tasksData = [];

addtaskBtn.addEventListener('click', handleTaskCreation);

function getTaskStats() {
    const total = tasksData.length;
    const completed = tasksData.filter(task => task.completed).length;
    const active = total - completed;
    const taskStats = {
        total: total,
        active: active,
        completed: completed
    };

    localStorage.setItem('taskStats', JSON.stringify(taskStats));
    
    const stats = document.getElementById('task-stats');
    stats.textContent = `Total: ${taskStats.total}, Active: ${taskStats.active}, Completed: ${taskStats.completed}`;

    return taskStats;
}

const savedTaskStats = JSON.parse(localStorage.getItem('taskStats'));

taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleTaskCreation();
    }
});

for (const task of tasksData) {
}

const savedTasks = JSON.parse(localStorage.getItem('task')) || [];

for (const savedTask of savedTasks) {
    const task = createTask(savedTask.content, savedTask.completed);
    
    tasksData.push(task);
    taskList.appendChild(task.element);
}

getTaskStats();

function handleTaskCreation() {
    const inp = taskInput.value.trim();

    if (!inp) {
        showNotification('Invalid task input.', 'error');
        return;
    }

    const task = createTask(inp, false);

    tasksData.push(task);
    taskList.appendChild(task.element);

    saveTasks();
    getTaskStats();

    taskInput.value = '';
}

function createTask(content, completed) {
    const element = document.createElement('div'); element.className = 'task';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'task-checkbox';
    const taskContent = document.createElement('span'); taskContent.className = 'task-content';
    const editTaskButton = document.createElement('button'); editTaskButton.className = 'edit-task-button';
    const removeTaskButton = document.createElement('button'); removeTaskButton.className = 'remove-task-button';
    taskContent.textContent = content;
    
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
        }
        else {
            element.classList.remove('completed-task');
        }

        saveTasks();
        getTaskStats();
    });

    editTaskButton.addEventListener('click', () => {
        const editInput = document.createElement('input'); editInput.type = 'text'; editInput.className = 'edit-input';
        taskContent.replaceWith(editInput);
        editInput.focus();
        
        editInput.addEventListener('keydown', function(event) {
            const desiredInput = editInput.value.trim();
            if(event.key === 'Enter' && desiredInput != '') {
                taskContent.textContent = desiredInput;
                task.content = desiredInput;
                editInput.replaceWith(taskContent);

                saveTasks();
                getTaskStats();
            }
            if(event.key === 'Escape') {
                editInput.replaceWith(taskContent);
            }
        })
    })

    removeTaskButton.addEventListener('click', () => {
        const index = tasksData.indexOf(task);
        if (index !== -1) {
            tasksData.splice(index, 1);
        }
        element.remove();

        saveTasks();
        getTaskStats();
    });

    return task;
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

function showNotification(message, type = 'info', duration = 3000) {
  const container = document.getElementById('popup-container');
  if (!container) return;

  const card = document.createElement('div');
  card.className = `popup-card ${type}`;
  card.innerText = message;

  container.appendChild(card);

  setTimeout(() => {
    setTimeout(() => card.remove(), 300);
  }, duration);
}