const clr = document.getElementById('clr-button');

clr.addEventListener('click', () => {
    localStorage.clear();
    console.log('cleared localStorage');
});

const taskList = document.getElementById('tasks');
const taskInput = document.getElementById('task-input');
const addtaskBtn = document.getElementById('add-task-button');

addtaskBtn.addEventListener('click', myFunction);

taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        myFunction();
    }
});

const tasksData = [];

const savedTasks = JSON.parse(localStorage.getItem('task')) || [];

for (const savedTask of savedTasks) {
    const task = createTask(savedTask.content, savedTask.completed);

    tasksData.push(task);
    taskList.appendChild(task.element);
}

function myFunction() {
    const inp = taskInput.value.trim();

    if (!inp) {
        alert('Invalid task text.');
        return;
    }

    const task = createTask(inp, false);

    tasksData.push(task);
    taskList.appendChild(task.element);

    saveTasks();

    taskInput.value = '';
}

function createTask(content, completed) {
    const element = document.createElement('div');
    element.className = 'task';
    element.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span class="task-content">${content}</span>
        <button class="remove-task-button"></button>
    `;

    const task = {
        element: element,
        content: content,
        completed: completed
    };

    const rmvbtn = element.querySelector('.remove-task-button');
    rmvbtn.addEventListener('click', () => {
        const index = tasksData.indexOf(task);
        if (index !== -1) {
            tasksData.splice(index, 1);
        }
        element.remove();

        saveTasks();
    });

    const cbox = element.querySelector('.task-checkbox');
    cbox.checked = completed;
    if (completed) {
        element.classList.add('completed-task');
    }
    cbox.addEventListener('change', () => {
        task.completed = cbox.checked;
        if (task.completed) {
            element.classList.add('completed-task');
        }
        else {
            element.classList.remove('completed-task');
        }

        saveTasks();
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