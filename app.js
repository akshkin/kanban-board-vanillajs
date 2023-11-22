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

const arrayNames = [
  "backlogList",
  "progressList",
  "completeList",
  "onHoldList",
];

let listArrays = [
  { backlogList: [] },
  { progressList: [] },
  { completeList: [] },
  { onHoldList: [] },
];

let draggedItem;
let currentColumn;
let isDragging = false;

// create list items for given column
function createElement(element, text, index, arrayName, columnIndex) {
  const listItem = document.createElement("li");
  listItem.classList.add("drag-item");
  listItem.textContent = text;
  listItem.draggable = true;
  listItem.setAttribute("ondragstart", "drag(event)");
  listItem.contentEditable = true;
  listItem.id = index;

  listItem.setAttribute(
    "onfocusout",
    `updateItem(${index}, ${columnIndex}, "${arrayName}")`
  );
  element.appendChild(listItem);
}

// add created item to list array
function addToList(index) {
  const text = addItems[index].textContent;

  const selectedArray = listArrays[index];

  selectedArray[arrayNames[index]].push(text);

  saveToLocalStorage();
  updateDOM();
}

// update item or delete
function updateItem(index, columnIndex, arrayName) {
  // get target array
  const selectedArray = listArrays[columnIndex];
  let list = selectedArray[arrayName];

  //  get updated item text content
  const column = listColumns[columnIndex];
  const listItem = column.children[index];

  if (!isDragging) {
    //   update item if updated or delete if empty
    if (!listItem.textContent) {
      list.splice(index, 1);
    } else {
      list[index] = listItem.textContent;
    }
    saveToLocalStorage();
    updateDOM();
  }
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

    localStorage.setItem(arrayName, JSON.stringify(selectedArray[arrayName]));
  });
}

function getSavedListFromLocalStorage() {
  arrayNames.forEach((arrayName, index) => {
    const selectedArray = listArrays[index];

    const storedList = JSON.parse(localStorage.getItem(arrayName));
    selectedArray[arrayName] = storedList || [];
  });
  updateDOM();
}

function updateDOM() {
  backlogListEl.textContent = "";
  listArrays[0].backlogList.forEach((item, index) =>
    createElement(backlogListEl, item, index, "backlogList", 0)
  );

  progressListEl.textContent = "";
  listArrays[1].progressList.forEach((item, index) =>
    createElement(progressListEl, item, index, "progressList", 1)
  );

  completeListEl.textContent = "";
  listArrays[2].completeList.forEach((item, index) =>
    createElement(completeListEl, item, index, "completeList", 2)
  );

  onHoldListEl.textContent = "";
  listArrays[3].onHoldList.forEach((item, index) =>
    createElement(onHoldListEl, item, index, "onHoldList", 3)
  );
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
  isDragging = true;
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
  //   dragging complete
  isDragging = false;
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
