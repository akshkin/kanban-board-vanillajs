const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogListEl = document.getElementById("backlog-list");
const progressListEl = document.getElementById("progress-list");
const completeListEl = document.getElementById("complete-list");
const onHoldListEl = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// filter arrays to remove empty array items
function filterArray(array) {
  return array.filter((item) => item !== null);
}

function createItemEl(columnEl, column, item, index) {
  //   console.log("columnEl: ", columnEl);
  //   console.log("column: ", column);
  //   console.log("item: ", item);
  //   console.log("index: ", index);

  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  //   append
  columnEl.appendChild(listEl);
}

// update item - delete if necessary
function updateItem(id, column) {
  const selectedArray = listArrays[column];

  const selectedColumEl = listColumns[column].children;

  if (!dragging) {
    if (!selectedColumEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumEl[id].textContent;
    }
    updateDOM();
  }
}

function updateDOM() {
  // check local storage
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // backlog items
  backlogListEl.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogListEl, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // progress items
  progressListEl.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // complete items
  completeListEl.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // onhold items
  onHoldListEl.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldListEl, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  //   run getSavedColumns only once, update local storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// add to column list, reset textbox
function addToColumn(column) {
  console.log(addItems[column].textContent);
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  updateDOM();
  addItems[column].textContent = "";
}

// show add item input box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// allow arrays to reflect drag and drop
function rebuildArrays() {
  backlogListArray = Array.from(backlogListEl.children).map(
    (item) => item.textContent
  );
  progressListArray = Array.from(progressListEl.children).map(
    (item) => item.textContent
  );
  completeListArray = Array.from(completeListEl.children).map(
    (item) => item.textContent
  );
  onHoldListArray = Array.from(onHoldListEl.children).map(
    (item) => item.textContent
  );

  updateDOM();
}

// when item starts dragging
function drag(event) {
  draggedItem = event.target;
  console.log(draggedItem);
  dragging = true;
}

// when item enters colum area
function dragEnter(column) {
  console.log(listColumns[column]);
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// column allows for item to drop
function allowDrop(event) {
  event.preventDefault();
}

// dropping item in column
function drop(event) {
  event.preventDefault();
  //   remove background color
  listColumns.forEach((column) => column.classList.remove("over"));
  const parentElement = listColumns[currentColumn];
  parentElement.appendChild(draggedItem);
  //   dragging complete
  dragging = false;
  rebuildArrays();
}

updateDOM();
