'use strict';

///////////////////////////////////////////
// Select Elements
const taskInput = document.querySelector('.task-field');
const addTaskBtn = document.querySelector('.add-task');
const taskList = document.querySelector('.task-list');
const completeTask = document.querySelector('.complete-task');
const categoryDropDown = document.querySelector('.category-dropdown');
const taskFooter = document.querySelector('.task-footer');
const searchInput = document.querySelector('.search-input');

///////////////////////////////////////////
// TO-DO LIST
document.addEventListener('DOMContentLoaded', function () {
  let taskArray = [];
  let editIndex = null;
  let isSorted = false;
  let originalTasks = [];

  /*
  This function should not mutate global scope variables
  this should not perform any sorting operations
  the only purpose it should have is to retrieve tasks from local storage or empty array.
  a function should have only one responsibility
  remove sorting operations from this function it is bad practice
  also do not store sorted data in local storage it is also bad practice.
  */
  function getTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem('taskArray')) || [];
    taskArray = storedTasks;
  }

  // Save tasks to local storage
  function saveTasksToLocalStorage() {
    localStorage.setItem('taskArray', JSON.stringify(taskArray));
  }

  // Render tasks
  function renderTasks(tasks = taskArray) {
    taskList.innerHTML = ''; // this operation should be after any guard clauses.
    if (!tasks.length) return;

    tasks.forEach((task, i) => {
      const taskItem = `
      <li class="task-item">
        <span class="task-text">${task.completed ? '🎉 Completed' : ''} ${
        task.text
      } ${task.category}</span>
        <div class="task-actions">
          <button class="btn edit-task" data-index="${i}">Edit</button>
  
          <button class="delete-task" data-index="${i}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
        </li>
        <input type="checkbox" class="complete-task" data-index="${i}" ${
        task.completed ? 'checked' : ''
      }/>`;
      taskList.insertAdjacentHTML('beforeend', taskItem);
    });
  }

  // Add or edit task
  function addTask() {
    const text = taskInput.value.trim().toLowerCase();
    const category = categoryDropDown.value;

    if (!text) {
      alert('Task cannot be empty');
      return;
    }

    if (
      taskArray.some(
        task => task.text === text && taskArray.indexOf(task) !== editIndex
      )
    ) {
      alert('Task already exists!');
      return;
    }

    if (Number.isInteger(editIndex)) {
      taskArray[editIndex].text = text;
      taskArray[editIndex].category = category;
      editIndex = null;
      addTaskBtn.textContent = 'Add Task';
    } else {
      taskArray.push({ text, category, completed: false });
    }

    saveTasksToLocalStorage();
    renderTasks();
    taskInput.value = '';
  }

  // Edit task
  function editTaskHandler(e) {
    const btnIndex = e.target.dataset.index;
    if (btnIndex === undefined) return;

    taskInput.value = taskArray[btnIndex].text;
    categoryDropDown.value = taskArray[btnIndex].category;

    editIndex = +btnIndex;
    addTaskBtn.textContent = 'Update Task';
  }

  // Toggle complete
  function toggleComplete(e) {
    const btnIndex = e.target.dataset.index;

    if (btnIndex === undefined) return;

    taskArray[+btnIndex].completed = !taskArray[+btnIndex].completed;
    saveTasksToLocalStorage();
    renderTasks();
  }

  // Delete task
  function deleteTask(e) {
    const btnIndex = e.target.closest('.delete-task')?.dataset.index;
    if (btnIndex === undefined) return;

    taskArray.splice(+btnIndex, 1);
    saveTasksToLocalStorage();
    renderTasks();
  }

  // Clear all tasks
  function clearAllTasks() {
    taskArray = [];
    localStorage.removeItem('taskArray');
    localStorage.removeItem('isSorted');
    renderTasks();
  }

  // Sort tasks
  function sortTasks() {
    if (!isSorted) {
      originalTasks = [...taskArray];
      taskArray.sort((a, b) => a.text.localeCompare(b.text));
    } else {
      originalTasks = [...taskArray];
      taskArray.sort((a, b) => b.text.localeCompare(a.text));
    }

    isSorted = !isSorted;
    saveTasksToLocalStorage();
    renderTasks();
  }

  // Search tasks
  function searchTasks() {
    const keyWord = searchInput.value.toLowerCase();
    const filteredTasks = taskArray.filter(task => task.text.includes(keyWord));
    renderTasks(filteredTasks);
  }

  // Load tasks from local storage
  getTasksFromLocalStorage();
  renderTasks();

  ///////// Attach event listeners ///////////
  addTaskBtn.addEventListener('click', addTask);
  taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-task')) editTaskHandler(e);
    if (e.target.classList.contains('complete-task')) toggleComplete(e);
    if (e.target.closest('.delete-task')) deleteTask(e);
  });
  taskFooter.addEventListener('click', function (e) {
    if (e.target.classList.contains('clear-all')) clearAllTasks();
    if (e.target.classList.contains('sort-tasks')) sortTasks();
  });
  searchInput.addEventListener('input', searchTasks);
});
