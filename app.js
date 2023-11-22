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

const arrayNames = ["backlog", "progress", "complete", "onHold"];

let listArrays = [
  { backlogList: [] },
  { progressList: [] },
  { completeList: [] },
  { onHoldList: [] },
];

let draggedItem;
let currentColumn;

// create list items for given column
function createElement(element, text) {
  const listItem = document.createElement("li");
  listItem.classList.add("drag-item");
  listItem.textContent = text;
  listItem.draggable = true;
  listItem.setAttribute("ondragstart", "drag(event)");
  element.appendChild(listItem);
}

// add created item to list array
function addToList(index) {
  const text = addItems[index].textContent;

  const selectedArray = listArrays[index];

  selectedArray[`${arrayNames[index]}List`].push(text);
  createElement(listColumns[index], text);
  saveToLocalStorage();
  updateDOM();
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
  arrayNames.forEach((arrayName, index) => {
    const selectedArray = listArrays[index];

    localStorage.setItem(
      `${arrayName}List`,
      JSON.stringify(selectedArray[`${arrayName}List`])
    );
  });
}

function getSavedListFromLocalStorage() {
  arrayNames.forEach((arrayName, index) => {
    const selectedArray = listArrays[index];

    const storedList = JSON.parse(localStorage.getItem(`${arrayName}List`));
    selectedArray[`${arrayName}List`] = storedList || [];
  });
  updateDOM();
}

function updateDOM() {
  backlogListEl.textContent = "";
  listArrays[0].backlogList.forEach((item) =>
    createElement(backlogListEl, item)
  );

  progressListEl.textContent = "";
  listArrays[1].progressList.forEach((item) =>
    createElement(progressListEl, item)
  );

  completeListEl.textContent = "";
  listArrays[2].completeList.forEach((item) =>
    createElement(completeListEl, item)
  );

  onHoldListEl.textContent = "";
  listArrays[3].onHoldList.forEach((item) => createElement(onHoldListEl, item));
}

// allow arrays to reflect drag and drop changes
function rebuildArrays() {
  listArrays[0].backlogList = Array.from(backlogListEl.children).map(
    (item) => item.textContent
  );
  listArrays[1].progressList = Array.from(progressListEl.children).map(
    (item) => item.textContent
  );
  listArrays[2].completeList = Array.from(completeListEl.children).map(
    (item) => item.textContent
  );
  listArrays[3].onHoldList = Array.from(onHoldListEl.children).map(
    (item) => item.textContent
  );
  saveToLocalStorage();
}

// when item starts dragging
function drag(event) {
  draggedItem = event.target;
}

// allow column to allow item to drop
function allowDrop(event) {
  event.preventDefault();
}

// drop item in column
function drop(event) {
  event.preventDefault();
  //   remove background color
  listColumns.forEach((column) => column.classList.remove("over"));

  //   add item to column
  const parentElement = listColumns[currentColumn];
  parentElement.appendChild(draggedItem);
  rebuildArrays();
}

// when item enters column
function dragEnter(index) {
  currentColumn = index;
  listColumns[index].classList.add("over");
}

// event listener for add items
addBtns.forEach((btn, index) =>
  btn.addEventListener("click", () => showInputBox(index))
);

// on load
getSavedListFromLocalStorage();
