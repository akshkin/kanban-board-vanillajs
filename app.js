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
  { backlogList: backlogListArray },
  { progressList: progressListArray },
  { completeList: completeListArray },
  { onHoldList: onHoldListArray },
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

  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  const selectArray = listArrays[index];

  selectArray[`${arrayNames[index]}List`].push(text);
  createElement(index, text);
  saveToLocalStorage();
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
  //   clear input box
  addItems[index].textContent = "";
}

function saveToLocalStorage() {
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    const selectedArray = listArrays[index];

    localStorage.setItem(
      `${arrayName}List`,
      JSON.stringify(selectedArray[`${arrayName}List`])
    );
  });
}

function getSavedListFromLocalStorage() {
  if (localStorage.getItem("backlogList")) {
    backlogListArray = JSON.parse(localStorage.getItem("backlogList"));
    progressListArray = JSON.parse(localStorage.getItem("progressList"));
    completeListArray = JSON.parse(localStorage.getItem("completeList"));
    onHoldListArray = JSON.parse(localStorage.getItem("onHoldList"));
    updateDOM();
  }
}

function updateDOM() {
  backlogListEl.textContent = "";
  backlogListArray.forEach((item, index) => createElement(index, item));

  progressListEl.textContent = "";
  progressListArray.forEach((item, index) => createElement(index, item));

  completeListEl.textContent = "";
  completeListArray.forEach((item, index) => createElement(index, item));

  onHoldListEl.textContent = "";
  onHoldListArray.forEach((item, index) => createElement(index, item));
}

// event listener for add items
addBtns.forEach((btn, index) =>
  btn.addEventListener("click", () => showInputBox(index))
);

// on load
getSavedListFromLocalStorage();
