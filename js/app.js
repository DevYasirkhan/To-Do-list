'use strict';

///////////////////////////////////////////
const taskInput = document.querySelector('.task-field');
const addTaskBtn = document.querySelector('.add-task');
const taskList = document.querySelector('.task-list');
const categoryDropDown = document.querySelector('.category-dropdown');
const editTask = document.querySelector('.edit-task');
const completeTask = document.querySelector('.complete-task');
const taskFooter = document.querySelector('.task-footer');
const searchInput = document.querySelector('.search-input');

///////////////////////////////////////////
// TO-DO LIST

document.addEventListener('DOMContentLoaded', function () {
  let tasks = [];
  let editIndex = null;
  let isTrue = false;
  let originalText = [];

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, i) => {
      const taskItem = `      
      <li class="task-item">
      <span class="task-text">${task.completed ? '🎉 Completed' : ''} ${
        task.text
      } ${task.category}</span>
      <div class="task-actions">
      <button class="btn edit-task" data-set="${i}">Edit</button>
      <button class="btn complete-task" data-set="${i}">Complete</button>
      <button class="delete-task" data-set="${i}">
      <i class="fa-regular fa-trash-can"></i>
      </button>
      </div>
      </li>`;
      taskList.insertAdjacentHTML('afterbegin', taskItem);
    });
  }

  function addTask() {
    const text = taskInput.value.trim().toLowerCase();
    const category = categoryDropDown.value;

    if (text === '') {
      alert('Task cannot be empty');
      return;
    }
    if (
      tasks.some(
        (task, i) =>
          i !== editIndex && task.text.toLowerCase() === text.toLowerCase()
      )
    ) {
      alert('Task already exist!');
      return;
    }

    if (editIndex !== null) {
      tasks[editIndex].text = text;
      tasks[editIndex].category = category;
      addTaskBtn.textContent = 'Add Task';
      editIndex = '';
    } else {
      tasks.push({ text, category, completed: false });
    }

    saveTasks();
    renderTasks();
    taskInput.value = '';
  }

  function editTask(e) {
    const btnIndex = e.target.closest('.edit-task')?.dataset.set;
    if (!btnIndex) return;

    taskInput.value = tasks[btnIndex].text;
    categoryDropDown.value = tasks[btnIndex].category;

    editIndex = +btnIndex;
    addTaskBtn.textContent = 'Update Task';
  }

  function toggleComplete(e) {
    if (e.target.classList.contains('complete-task')) {
      const btnIndex = e.target.closest('.complete-task')?.dataset.set;
      if (!btnIndex) return;

      tasks[+btnIndex].completed = !tasks[+btnIndex.completed];
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(e) {
    const btnIndex = e.target.closest('.delete-task')?.dataset.set;
    tasks.splice(+btnIndex);
    renderTasks();
  }

  function clearAllTasks() {
    tasks = [];
    renderTasks();
  }

  function sortTasks() {
    if (!isTrue) {
      originalText = tasks.map(t => t.text);
      const sortedText = [...originalText].sort((a, b) => a - b);
      tasks.map((t, i) => (t.text = sortedText[i]));
      isTrue = true;
    } else {
      tasks.map((t, i) => (t.text = originalText[i]));
      isTrue = false;
    }
    renderTasks();
  }

  function searchTasks() {
    const keyWord = searchInput.value.toLowerCase();
    const filterTask = tasks.filter(task => task.text.includes(keyWord));

    taskList.innerHTML = '';

    filterTask.forEach((task, i) => {
      const taskItem = `      
      <li class="task-item">
      <span class="task-text">${task.completed ? '🎉 Completed' : ''} ${
        task.text
      } ${task.category}</span>
      <div class="task-actions">
      <button class="btn edit-task" data-set="${i}">Edit</button>
      <button class="btn complete-task" data-set="${i}">Complete</button>
      <button class="delete-task" data-set="${i}">
      <i class="fa-regular fa-trash-can"></i>
      </button>
      </div>
      </li>`;
      taskList.insertAdjacentHTML('afterbegin', taskItem);
    });
  }

  function saveTasks() {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function getTasks() {
    const userData = JSON.parse(localStorage.getItem('tasks'));
    tasks = userData;
  }
  getTasks();

  renderTasks();

  ///////// Attach event listener ///////////
  addTaskBtn.addEventListener('click', addTask);
  taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-task')) editTask(e);
    if (e.target.classList.contains('complete-task')) toggleComplete(e);
    if (e.target.classList.contains('fa-trash-can')) deleteTask(e);
  });
  taskFooter.addEventListener('click', function (e) {
    if (e.target.classList.contains('clear-all')) clearAllTasks();
    if (e.target.classList.contains('sort-tasks')) sortTasks();
  });
  searchInput.addEventListener('input', searchTasks);
});
