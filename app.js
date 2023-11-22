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

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [
  backlogListArray,
  progressListArray,
  completeListArray,
  onHoldListArray,
];

// create list items for given column
function createElement(index, text) {
  const listItem = document.createElement("li");
  listItem.classList.add("drag-item");
  listItem.textContent = text;
  listColumns[index].appendChild(listItem);
}

// add created item to list array
function addToList(index) {
  const text = addItems[index].textContent;

  listArrays[index].push(text);
  createElement(index, text);
}

// show input box for adding item
function showInputBox(index) {
  addBtns[index].style.visibility = "hidden";
  saveItemBtns[index].style.display = "flex";
  addItemContainers[index].style.display = "flex";
}

// hide input box on saving item
function hideInputBox(index) {
  addBtns[index].style.visibility = "visible";
  saveItemBtns[index].style.display = "none";
  addItemContainers[index].style.display = "none";
  addToList(index);
  addItems[index].textContent = "";
}

// event listener for add items
addBtns.forEach((btn, index) =>
  btn.addEventListener("click", () => showInputBox(index))
);
