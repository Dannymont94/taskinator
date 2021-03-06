var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

var taskFormHandler = function(){
    // prevent refresh on submit button click
    event.preventDefault();
    // get values from form
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return;
    }
    // reset form to default after submitting task
    formEl.reset();
    // check for data attribute in form to see if user is editing an existing task
    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj);
    }
};

var completeEditTask = function(taskName, taskType, taskId){
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    // update tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks[i].name = taskName;
          tasks[i].type = taskType;
        }
    };
    // save tasks array in localStorage
    saveTasks();
    // exit edit mode
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function(taskDataObj){
    // create list item 
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true");
    // create div to hold task info and then add to list item created by listItemEl
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
    // create edit button, delete button, and status dropdown and then add to list created by listItemEl
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    //add list item to tasksToDoEl
    tasksToDoEl.appendChild(listItemEl);
    // add id property to taskDataObj with value of taskIdCounter
    taskDataObj.id = taskIdCounter;
    // push taskDataObj to tasks array
    tasks.push(taskDataObj);
    // save tasks array in localStorage
    saveTasks();
    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    // create edit button and add to div created by actionContainerEl
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);
    // create delete button and add to div created by actionContainerEl
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    //create dropdown menu and add to div created by actionContainerEl
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);
    // create option elements and add to select created by statusSelectEl
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
    }
    // return div containing edit button, delete button, and dropdown menu
    return actionContainerEl;
};

// executes edit and delete button functions
var taskButtonHandler = function(event) {
    var targetEl = event.target;
    var taskId = targetEl.getAttribute("data-task-id");
    if (targetEl.matches(".edit-btn")) {
        editTask(taskId);
    }
    else if (targetEl.matches(".delete-btn")) {
        deleteTask(taskId);
    }
};

var editTask = function(taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // load previously entered values into form
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // display to user that form is in edit mode
    document.querySelector("#save-task").textContent = "Save Changes";
    formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function(taskId) {
    // get task list item element and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // edge case handling in case user clicks delete after clicking edit button but before completing edit
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    // remove task item from page
    taskSelected.remove();
    // create new array to hold the updated list of tasks
    var updatedTaskArr = [];
    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be the same as updatedTasksArr
    tasks = updatedTaskArr;
    // save tasks array in localStorage
    saveTasks();
};

var taskStatusChangeHandler = function(event){
    // get task item's id
    var taskId = event.target.getAttribute("data-task-id");
    // get currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // move selected task to correct ul based on statusValue
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
    // update objects in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
          tasks[i].status = statusValue;
        }
    }
    // save tasks array in localStorage
    saveTasks();
};

var dragTaskHandler = function(event) {
    console.log(event.target);
    console.log(typeof event.target);
    if (typeof event.target !== "string") {
        // get task item's id
        var taskId = event.target.getAttribute("data-task-id");
        // set taskId as dataTransfer value
        event.dataTransfer.setData("text/plain", taskId);
    }
};

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dragLeaveHandler = function(event) {
    var taskListsEl = event.target.closest(".task-list");
    if (taskListsEl) {
    taskListsEl.removeAttribute("style");
    }
};

var dropTaskHandler = function(event) {
    // get id from dataTransfer property
    var id = event.dataTransfer.getData("text/plain");
    // identify which task item is being dragged
    var draggableElement = document.querySelector(".task-item[data-task-id='" + id + "']");
    // identify which task list the task item is being dropped on
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    // change value of select form in dropped task
    var statusSelectEl = draggableElement.querySelector(".select-status[name='status-change']");
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    // update tasks array status value
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
          tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    // save tasks array in localStorage
    saveTasks();
    // reset list item color and border styles
    dropZoneEl.removeAttribute("style");
    // add dropped task item to new task list
    dropZoneEl.appendChild(draggableElement);
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    // get task items from localStorage
    var savedTasks = localStorage.getItem("tasks");
    // if nothing in localStorage, return
    if (savedTasks === null) {
        return;
    }
    // convert savedTasks from stringified format back into an array of objects
    savedTasks = JSON.parse(savedTasks);
    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the createTaskEl function
        createTaskEl(savedTasks[i]);
    }
};

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);

pageContentEl.addEventListener("dragover", dropZoneDragHandler);

pageContentEl.addEventListener("dragleave", dragLeaveHandler);

pageContentEl.addEventListener("drop", dropTaskHandler);

loadTasks();