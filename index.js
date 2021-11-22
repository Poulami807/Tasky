const taskContainer = document.querySelector(".task-card-container"); //Task container

let globalTaskData = [];

const generateHtml = (
  taskData
) => `<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card">
  <div class="card-header d-flex justify-content-end gap-2">
    <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this,arguments)">
    <i class="fas fa-pencil-alt" name=${taskData.id}></i>
    </button>
    <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this,arguments)" >
      <i class="far fa-trash-alt" name=${taskData.id}></i>
    </button>
  </div>
  <div class="card-body">
    <img
      src=${taskData.image}
      alt="image"
      class="card-img"
    />
    <h5 class="card-title mt-4">${taskData.title}</h5>
    <p class="card-text">
     ${taskData.description}
    </p>
    <span class="badge bg-primary">${taskData.type}</span>
  </div>
  <div class="card-footer">
    <button class="btn btn-outline-primary" name=${taskData.id} id="OpenTask" data-condition="modalCondition" data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTask.apply(this,arguments)">Open Task</button>
  </div>
</div>
</div>`;

const injectToDOM = (task) =>
  taskContainer.insertAdjacentHTML("beforeend", task);

//saving data to local storage
const saveToLocalStorage = () =>
  localStorage.setItem("Tasky", JSON.stringify({ cards: globalTaskData })); //stringify-> converts js object into JSON format
// add new card functionality
const addNewCard = () => {
  //get task data
  const taskData = {
    id: `${Date.now()}`,
    title: document.getElementById("taskTitle").value,
    image: document.getElementById("imageUrl").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };

  globalTaskData.push(taskData); //storing all task data

  saveToLocalStorage();

  //generate corresponding html code upon clicking save changes button
  const newCard = generateHtml(taskData);

  //inject code to DOM
  injectToDOM(newCard);

  //clear modal
  document.getElementById("taskTitle").value = "";
  document.getElementById("imageUrl").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";

  return;
};

const loadExistingCard = () => {
  //get data from local storage
  const getTaskData = localStorage.getItem("Tasky");

  //parse JSON data into object, if exists
  if (!getTaskData) return;
  const taskCards = JSON.parse(getTaskData);

  globalTaskData = taskCards.cards;

  //generate HTML code and inject to DOM for each card in globalTaskData
  globalTaskData.map((task) => {
    card = generateHtml(task);
    injectToDOM(card);
  });

  return;
};

//delete card
const deleteCard = (event) => {
  //get id of the current card to be deleted
  const currentCardId = event.target.getAttribute("name");

  //determine which element(button or icon tag) is selected by user
  const elementType = event.target.tagName;

  //remove task to be deleted from globalTaskData
  const filteredTask = globalTaskData.filter(
    (task) => task.id !== currentCardId
  );
  globalTaskData = filteredTask;

  //update local storage
  saveToLocalStorage();

  //access DOM to remove card
  if (elementType === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

//edit card
const editCard = (event) => {
  //determine which element(button or icon tag) is selected by user
  const elementType = event.target.tagName;

  let parentElement;

  if (elementType === "BUTTON")
    parentElement = event.target.parentNode.parentNode;
  else parentElement = event.target.parentNode.parentNode.parentNode;

  //determining index of child elements
  // console.log(parentElement.childNodes);
  // console.log(parentElement.childNodes[3].childNodes);

  let taskTitle = parentElement.childNodes[3].childNodes[3];
  let taskDescription = parentElement.childNodes[3].childNodes[5];
  let taskType = parentElement.childNodes[3].childNodes[7];

  let saveChangesButton = parentElement.childNodes[5].childNodes[1];

  //allow user to edit above elements
  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  //change open task button to save changes
  saveChangesButton.innerHTML = "save changes";

  //apply the changes on clicking save changes button
  saveChangesButton.setAttribute("onclick", "saveEdit.apply(this,arguments)");
  saveChangesButton.setAttribute("data-bs-toggle","collapse");
};

const saveEdit = (event) => {
  //get id of the current card to be edited
  const currentCardId = event.target.getAttribute("name");

  let parentElement = event.target.parentNode.parentNode;

  let taskTitle = parentElement.childNodes[3].childNodes[3];
  let taskDescription = parentElement.childNodes[3].childNodes[5];
  let taskType = parentElement.childNodes[3].childNodes[7];

  let saveChangesButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    title: taskTitle.innerHTML,
    type: taskType.innerHTML,
    description: taskDescription.innerHTML,
  };

  const updateGlobalTasks = globalTaskData.map((task) => {
    if (task.id === currentCardId) {
      return { ...task, ...updatedData };
    }
    return task;
  });

  globalTaskData = updateGlobalTasks;

  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  saveChangesButton.innerHTML = "Open Task";
  saveChangesButton.setAttribute("data-bs-toggle","modal");



};

//open task modal
const openTask = (event) => {
  const taskId=event.target.getAttribute("name");
  const taskModalBody=document.querySelector(".task-body");

  globalTaskData.forEach((task)=>{
    if((task.id)===taskId){
       taskModalBody.innerHTML=`<img
      src=${task.image}
      alt="image"
      class="card-img"
    />
    <p style="color:gray;"><strong>Created on ${Date()}</strong></p>
    <h5 class="card-title mt-4 fs-1">${task.title}</h5>
    <p class="card-text fs-3">
     ${task.description}
    </p>`;
    }
    return;
  });
}

//search task
/*
const searchTask=()=>{
   const searchedStr=document.getElementById("searchedTask").value;
    const searchedTask = globalTaskData.filter((task)=>task.title.includes(searchedStr));
    searchedTask.forEach((task)=>{
     let taskCard = generateHtml(task);
     injectToDOM(taskCard);
    });
   };
   */
  
  