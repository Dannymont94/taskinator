var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var createTaskHandler = function(){
    // prevent refresh on submit button click
    event.preventDefault();
    // get values from form
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    // add HTML content to div created by taskInfoEl
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";
    // add div to li element created by listItemEl
    listItemEl.appendChild(taskInfoEl);
    //add list item to tasksToDoEl
    tasksToDoEl.appendChild(listItemEl);
    console.dir(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);