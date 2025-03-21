document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => renderTask(task));
            })
            .catch(error => console.error('Error:', error));
    }

    function renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        if (task.completed) taskElement.classList.add('completed');

        taskElement.innerHTML = `
            <span>${task.title} - ${task.description || ''}</span>
            <div class="task-actions">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            fetch(`/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: checkbox.checked })
            })
            .then(() => {
                taskElement.classList.toggle('completed');
            })
            .catch(error => console.error('Error:', error));
        });

        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            fetch(`/tasks/${task.id}`, { method: 'DELETE' })
                .then(() => {
                    taskList.removeChild(taskElement);
                })
                .catch(error => console.error('Error:', error));
        });

        taskList.appendChild(taskElement);
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description })
        })
        .then(response => response.json())
        .then(() => {
            taskForm.reset();
            fetchTasks();
        })
        .catch(error => console.error('Error:', error));
    });

    fetchTasks();
});
