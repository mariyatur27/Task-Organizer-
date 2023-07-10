const { response } = require("express");

window.onload = (e) => {
    //read the json file and load everything that is in it everytime the page is reloaded
    // fetch('http://localhost:8000/dashboard', {
    //     headers : { 
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json'
    //      }
    //   })
    // .then(response => response.json())
    // .then(data => console.log(data))

    fetch('http://localhost:8000/dashboard')
    // .then(response => response.json())
    .then(response => console.log(response))
}

const sendData = (id, name, dscr, deadline) => {
    var data = {
        id: id,
        name: name,
        dscr: dscr,
        deadline: deadline,
    };

    console.log(data)

    fetch("/dashboard", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
}


const statusUpdateJSON = (data) => {
    fetch("/database", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })
}


//status tracker
const changeStatus = (tasks) => {
    var inc_num = tasks.filter((x) => x == 'not started').length;
    var inp_num = tasks.filter((x) => x == 'in progress').length;
    var com_num = tasks.filter((x) => x == 'complete').length;

    document.getElementById('incomplete-status').innerHTML = inc_num;
    document.getElementById('inprogress-status').innerHTML = inp_num;
    document.getElementById('complete-status').innerHTML = com_num;

    document.getElementById('incomlete-per').innerHTML = Math.round((inc_num / Object.keys(tasks).length) * 100);
    document.getElementById('inprogress-per').innerHTML = Math.round((inp_num / Object.keys(tasks).length) * 100);
    document.getElementById('complete-per').innerHTML = Math.round((com_num / Object.keys(tasks).length) * 100);

    document.getElementById('myBar').style.width = Math.round((com_num / Object.keys(tasks).length) * 100) + '%';
      
}

const tasks_status = new Object();

//check if something with this id already exists in the object
const statusUpate = (id) => {
    if(document.getElementById('option-'.concat(id + '-' + 'Complete')).selected){
        tasks_status[id] = 'complete';
    }else if(document.getElementById('option-'.concat(id + '-' + 'In Progress')).selected){
        tasks_status[id] = 'in progress';
    }else if(document.getElementById('option-'.concat(id + '-' + 'Not Started')).selected){
        tasks_status[id] = 'not started';
    }
    changeStatus(Object.values(tasks_status));
}

const updateAddButton = (id) => {
    document.getElementById('add-btn-'.concat(id)).style.display = 'none';

    var row = document.getElementById("task-container-".concat(id));
    var status_ar = ["Not Started", "In Progress", "Complete"];

    var selectList = document.createElement('select'); selectList.id = 'status-list-'.concat(id);
    row.appendChild(selectList);

    status_ar.forEach(e => {
        var option = document.createElement('option'); option.value = e; option.text = e;
        option.id = 'option-'.concat(id + '-' + e)
        selectList.appendChild(option)
        console.log(option.id)
    })

    tasks_status[id] = 'not started';

    selectList.onclick = () => {
        statusUpate(id);
    }
}

// var tasks_incomplete

const activateButton = (id) => {
    document.getElementById('add-btn-'.concat(id)).addEventListener('click', function() {
        var task_name = document.getElementById("task-name-".concat(id)).value;
        var task_description = document.getElementById("task-dscr-".concat(id)).value;
        var task_deadline = document.getElementById("task-deadline-".concat(id)).value;

        if (task_name != '' && task_description != '' && task_deadline != ''){
            sendData(id, task_name, task_description, task_deadline);
            updateAddButton(id)
            generateNewRow(id)
            document.getElementById('incomplete-status').innerHTML = String(Number(id) + 1);
            document.getElementById('incomlete-per').innerHTML = Math.round((Number(id) + 1 / Object.keys(tasks).length) * 100);
            document.getElementById('myBar').style.width = Math.round((com_num / Object.keys(tasks).length) * 100) + '%';
        }
    })
}

const generateNewRow = (id) => {
    var id = String(Number(id) + 1);
    console.log(id)
    var container = document.getElementById('tasks-container'); 

    let task_container = document.createElement('div'); task_container.classList.add('tasks-container'); task_container.id = "task-container-".concat(id);

        let task_name = document.createElement('input'); task_name.type = 'text'; task_name.id = "task-name-".concat(id);
        task_container.appendChild(task_name); task_name.setAttribute('placeholder', 'Task name...')

        let task_description = document.createElement('input'); task_description.type = 'text'; task_description.id = "task-dscr-".concat(id);
        task_container.appendChild(task_description); task_description.setAttribute('placeholder', 'Task description...')

        let task_deadline = document.createElement('input'); task_deadline.type = 'date'; task_deadline.id = 'task-deadline-'.concat(id);
        task_container.appendChild(task_deadline);

        let add_btn = document.createElement('button'); add_btn.innerHTML = 'Add'; add_btn.id = 'add-btn-'.concat(id);
        task_container.appendChild(add_btn);

    container.appendChild(task_container);

    activateButton(id);
}


document.getElementById('add-btn-0').addEventListener('click', function() {
    var task_name = document.getElementById('task-name-0').value;
    var task_dscr = document.getElementById('task-dscr-0').value;
    var task_deadline = document.getElementById('task-deadline-0').value;
    var id = "0";

    if(task_name != '' && task_dscr != '' && task_deadline != ''){
        sendData(id, task_name, task_dscr, task_deadline);
        generateNewRow(id);
        updateAddButton(id);
        document.getElementById('incomplete-status').innerHTML = String(Number(id) + 1);
        document.getElementById('incomlete-per').innerHTML = 100;
        document.getElementById('myBar').style.width = '6%'
    }

})