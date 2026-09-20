const taskList = document.getElementById('task-list');

const taskInput = document.getElementById('task-input');
const addtaskBtn = document.getElementById('add-task-btn');

addtaskBtn.addEventListener('click', createNewTask)
taskInput.addEventListener('keydown', function(event) {
            if(event.key === 'Enter') {
                createNewTask();
            }
        })

function createNewTask() {
    const newTask = document.createElement('div');
    const newTaskCbox = document.createElement('input');
    const newTaskText = document.createElement('span');
    const removeTaskBtn = document.createElement('button');

    newTask.id = 'new-task';
    newTaskCbox.id = 'new-task-cbox';
    newTaskText.id = 'new-task-txt';
    removeTaskBtn.id = 'remove-task-btn';
    newTaskCbox.type = 'checkbox';

    newTaskText.textContent = taskInput.value;
    


    if(!taskInput.value.trim()) {
        alert('Invalid task text.');
    }
    else {
        newTask.appendChild(newTaskCbox);
        newTask.appendChild(newTaskText);
        newTask.appendChild(removeTaskBtn);
        taskList.appendChild(newTask);

        newTaskCbox.addEventListener('change', () => {
            if(newTaskCbox.checked) {
                newTaskText.classList.add('finished-task');
            }
            else {
                newTaskText.classList.remove('finished-task');
            }
        })

        removeTaskBtn.addEventListener('click', () => {
            const parentElement = removeTaskBtn.parentElement;
            taskList.removeChild(parentElement);
        })
    }

    taskInput.value = '';
}