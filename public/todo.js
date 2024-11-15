document.addEventListener("DOMContentLoaded",function(){
    let token = localStorage.getItem("token")
    readTask(token)
})

async function addTasks(){
    const addTask = document.getElementById("addTask").value
    const token = localStorage.getItem("token")
    if(addTask === "" ){
        let systemMessage = "Enter your task"
        messageBox(systemMessage,false)
        return 
    }
    console.log(addTask)
    const response = await axios.post("http://localhost:3000/addTasks", {
        task: addTask
    },{
        headers:{
            token: token
        }
    });
    document.getElementById("addTask").value = ""
    console.log(response)
    readTask(token)
}

async function readTask(token){
    const response = await axios.get("http://localhost:3000/readTask",{
        headers:{
            token: token
        }
    })
    console.log(response)
    if(response.data.message1 === "readed"){
        const allTaskList = document.getElementById("allTaskList");
        const activeTaskList = document.getElementById("activeTaskList");
        const completedTaskList = document.getElementById("completedTaskList");
        activeTaskList.innerHTML = ""
        completedTaskList.innerHTML = ""
        allTaskList.innerHTML = ""
        for(let i=response.data.message.length-1;i>=0;i--){
            let task = response.data.message[i].tasks
            let id = response.data.message[i]._id
            let done = response.data.message[i].done
            todoDiv1(task,id,done)
            todoDiv2(task,id,done)
            todoDiv3(task,id,done)
        }
    }
    else{
        let systemMessage = "There is some error, Please sign in again"
        messageBox(systemMessage,false)
    }
}

function todoDiv1(task, id, done) {
    const div = document.createElement("div");
    div.style.padding = "0 20px 0 20px";
    div.style.width = "100%";
    div.style.height = "4rem";
    div.style.marginTop = "1rem";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.display = "flex";
    div.style.transform = "translateY(-20px)";  
    div.style.opacity = "0"; 
    div.style.scale = "80%";
    div.style.transition = "transform 0.5s ease, opacity 0.5s ease, scale 0.5s ease"; 

    const doneButton = document.createElement("button");
    doneButton.style.backgroundColor = "white";
    doneButton.style.padding = "3px";
    doneButton.style.borderRadius = "5px";
    doneButton.style.height = "17px";
    doneButton.style.width = "17px";
    doneButton.style.justifyContent = "center";
    doneButton.style.alignItems = "center";
    doneButton.style.display = "flex";
    doneButton.style.boxShadow = "inset 0px 1px 1px rgba(0, 0, 0, 0.252)";
    doneButton.style.border = "0.5px solid rgb(179, 179, 179)";
    doneButton.style.transition = "background-color 0.3s, transform 0.3s";
    doneButton.onclick = () => doneTask(id, done);
    doneButton.setAttribute("id", `${id}`);

    if (done) {
        doneButton.innerHTML = '<i class="fa-solid fa-check" style="font-size: 12px; color: white;"></i>';
        doneButton.style.backgroundColor = "rgb(0, 123, 255)";
        doneButton.style.border = "none";
        doneButton.style.transform = "scale(1.1)"; 
    }

    const taskText = document.createElement("p");
    taskText.style.width = "75%";
    taskText.style.overflow = "scroll";
    taskText.style.height = "2rem";
    taskText.style.display = "flex";
    taskText.style.alignItems = "center";
    taskText.style.transition = "opacity 0.3s ease"; 
    taskText.textContent = task;

    const editButton = document.createElement("button");
    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pencil";
    editIcon.style.color = "black";
    editIcon.onclick = () => editTask(id, task);
    editButton.appendChild(editIcon);

    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-regular fa-trash-can";
    deleteIcon.style.color = "red";
    deleteIcon.onclick = () => deleteTask(id);
    deleteButton.appendChild(deleteIcon);

    div.appendChild(doneButton);
    div.appendChild(taskText);
    div.appendChild(editButton);
    div.appendChild(deleteButton);

    setTimeout(() => {
        div.style.transform = "translateY(0)"; 
        div.style.opacity = "1";
        div.style.scale = "100%";  
    }, 300); 

    const allTaskList = document.getElementById("allTaskList");
    const activeTaskList = document.getElementById("activeTaskList");
    const completedTaskList = document.getElementById("completedTaskList");
    allTaskList.appendChild(div);
}

function todoDiv2(task, id, done) {
    const div = document.createElement("div");
    div.style.padding = "0 20px 0 20px";
    div.style.width = "100%";
    div.style.height = "4rem";
    div.style.marginTop = "1rem";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.display = "flex";
    div.style.transform = "translateY(-20px)";  
    div.style.opacity = "0"; 
    div.style.scale = "80%";
    div.style.transition = "transform 0.5s ease, opacity 0.5s ease, scale 0.5s ease"; 

    const doneButton = document.createElement("button");
    doneButton.style.backgroundColor = "white";
    doneButton.style.padding = "3px";
    doneButton.style.borderRadius = "5px";
    doneButton.style.height = "17px";
    doneButton.style.width = "17px";
    doneButton.style.justifyContent = "center";
    doneButton.style.alignItems = "center";
    doneButton.style.display = "flex";
    doneButton.style.boxShadow = "inset 0px 1px 1px rgba(0, 0, 0, 0.252)";
    doneButton.style.border = "0.5px solid rgb(179, 179, 179)";
    doneButton.style.transition = "background-color 0.3s, transform 0.3s";
    doneButton.onclick = () => doneTask(id, done);
    doneButton.setAttribute("id", `${id}`);

    if (done) {
        doneButton.innerHTML = '<i class="fa-solid fa-check" style="font-size: 12px; color: white;"></i>';
        doneButton.style.backgroundColor = "rgb(0, 123, 255)";
        doneButton.style.border = "none";
        doneButton.style.transform = "scale(1.1)"; 
    }

    const taskText = document.createElement("p");
    taskText.style.width = "75%";
    taskText.style.overflow = "scroll";
    taskText.style.height = "2rem";
    taskText.style.display = "flex";
    taskText.style.alignItems = "center";
    taskText.style.transition = "opacity 0.3s ease"; 
    taskText.textContent = task;

    const editButton = document.createElement("button");
    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pencil";
    editIcon.style.color = "black";
    editIcon.onclick = () => editTask(id, task);
    editButton.appendChild(editIcon);

    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-regular fa-trash-can";
    deleteIcon.style.color = "red";
    deleteIcon.onclick = () => deleteTask(id);
    deleteButton.appendChild(deleteIcon);

    div.appendChild(doneButton);
    div.appendChild(taskText);
    div.appendChild(editButton);
    div.appendChild(deleteButton);

    setTimeout(() => {
        div.style.transform = "translateY(0)"; 
        div.style.opacity = "1";
        div.style.scale = "100%";  
    }, 300); 

    const allTaskList = document.getElementById("allTaskList");
    const activeTaskList = document.getElementById("activeTaskList");
    const completedTaskList = document.getElementById("completedTaskList");
    if (done) {
        completedTaskList.appendChild(div);
    }
}

function todoDiv3(task, id, done) {
    const div = document.createElement("div");
    div.style.padding = "0 20px 0 20px";
    div.style.width = "100%";
    div.style.height = "4rem";
    div.style.marginTop = "1rem";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.display = "flex";
    div.style.transform = "translateY(-20px)";  
    div.style.opacity = "0"; 
    div.style.scale = "80%";
    div.style.transition = "transform 0.5s ease, opacity 0.5s ease, scale 0.5s ease"; 

    const doneButton = document.createElement("button");
    doneButton.style.backgroundColor = "white";
    doneButton.style.padding = "3px";
    doneButton.style.borderRadius = "5px";
    doneButton.style.height = "17px";
    doneButton.style.width = "17px";
    doneButton.style.justifyContent = "center";
    doneButton.style.alignItems = "center";
    doneButton.style.display = "flex";
    doneButton.style.boxShadow = "inset 0px 1px 1px rgba(0, 0, 0, 0.252)";
    doneButton.style.border = "0.5px solid rgb(179, 179, 179)";
    doneButton.style.transition = "background-color 0.3s, transform 0.3s";
    doneButton.onclick = () => doneTask(id, done);
    doneButton.setAttribute("id", `${id}`);

    if (done) {
        doneButton.innerHTML = '<i class="fa-solid fa-check" style="font-size: 12px; color: white;"></i>';
        doneButton.style.backgroundColor = "rgb(0, 123, 255)";
        doneButton.style.border = "none";
        doneButton.style.transform = "scale(1.1)"; 
    }

    const taskText = document.createElement("p");
    taskText.style.width = "75%";
    taskText.style.overflow = "scroll";
    taskText.style.height = "2rem";
    taskText.style.display = "flex";
    taskText.style.alignItems = "center";
    taskText.style.transition = "opacity 0.3s ease"; 
    taskText.textContent = task;

    const editButton = document.createElement("button");
    const editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pencil";
    editIcon.style.color = "black";
    editIcon.onclick = () => editTask(id, task);
    editButton.appendChild(editIcon);

    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-regular fa-trash-can";
    deleteIcon.style.color = "red";
    deleteIcon.onclick = () => deleteTask(id);
    deleteButton.appendChild(deleteIcon);

    div.appendChild(doneButton);
    div.appendChild(taskText);
    div.appendChild(editButton);
    div.appendChild(deleteButton);

    setTimeout(() => {
        div.style.transform = "translateY(0)"; 
        div.style.opacity = "1";
        div.style.scale = "100%";  
    }, 300); 

    const allTaskList = document.getElementById("allTaskList");
    const activeTaskList = document.getElementById("activeTaskList");
    const completedTaskList = document.getElementById("completedTaskList");
    if (!done) {
        activeTaskList.appendChild(div);
    }
}


async function deleteTask(id) {
    let token = localStorage.getItem("token")
    const response = await axios.delete("http://localhost:3000/deleteTask", {
        headers: {
            token: token
        },
        data: {
            id: id
        }
    });
    console.log(response.data.message);
    if(response.data.message === "Task is deleted"){
        readTask(token)
    }
}

function editTask(id,task){
    document.getElementById("addTask").value = task
    deleteTask(id)
}

async function doneTask(id) {
    let token = localStorage.getItem("token");
    const response = await axios.put(
        "http://localhost:3000/doneTask",
        {
            id: id
        },
        {
            headers: {
                token: token
            }
        }
    );

    if (response.data.message === "Task updated") {
        readTask(token);
    }
}

function allTask(){
    const allBtn = document.getElementById("allBtn")
    const activeBtn = document.getElementById("activeBtn")
    const completedBtn = document.getElementById("completedBtn")
    allBtn.style.backgroundColor = "black"
    allBtn.style.color = "white"
    activeBtn.style.backgroundColor = "white"
    activeBtn.style.color = "black"
    completedBtn.style.backgroundColor = "white"
    completedBtn.style.color = "black"
    document.getElementById("allTaskList").style.display = "block"
    document.getElementById("activeTaskList").style.display = "none"
    document.getElementById("completedTaskList").style.display = "none"
}

function activeTask(){
    const allBtn = document.getElementById("allBtn")
    const activeBtn = document.getElementById("activeBtn")
    const completedBtn = document.getElementById("completedBtn")
    allBtn.style.backgroundColor = "white"
    allBtn.style.color = "black"
    activeBtn.style.backgroundColor = "black"
    activeBtn.style.color = "white"
    completedBtn.style.backgroundColor = "white"
    completedBtn.style.color = "black"
    document.getElementById("allTaskList").style.display = "none"
    document.getElementById("activeTaskList").style.display = "block"
    document.getElementById("completedTaskList").style.display = "none"
}

function completedTask(){
    const allBtn = document.getElementById("allBtn")
    const activeBtn = document.getElementById("activeBtn")
    const completedBtn = document.getElementById("completedBtn")
    allBtn.style.backgroundColor = "white"
    allBtn.style.color = "black"
    activeBtn.style.backgroundColor = "white"
    activeBtn.style.color = "black"
    completedBtn.style.backgroundColor = "black"
    completedBtn.style.color = "white"
    document.getElementById("allTaskList").style.display = "none"
    document.getElementById("activeTaskList").style.display = "none"
    document.getElementById("completedTaskList").style.display = "block"
}

async function messageBox(message , Boolen){
    let messageBox = document.querySelector(".message-box")
    if(Boolen == true){
        messageBox.innerHTML = `<i class="fa-solid fa-check" style="margin-right: 10px; color: rgb(0, 255, 0);"></i> <span> ${message} <span>`
    }
    if(Boolen == false){
        messageBox.innerHTML = `<i class="fa-solid fa-xmark" style="margin-right: 10px; color: red;"></i> <span> ${message} <span>`
    }
    messageBox.classList.add("show")
    await setTimeout (function (){
        messageBox.classList.remove("show")
    },3000)
}

function logOut(){
    localStorage.removeItem("token")
    window.location.href = "index.html"
}

