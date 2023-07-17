const tasks_status = new Object();
var empty_json =  true;

const buildStartingPage = (id, data) => {
    var id = String(Number(id));
    var container = document.getElementById('tasks-container'); 

    let task_container = document.createElement('div'); task_container.classList.add('tasks-container'); task_container.id = "task-container-".concat(id);

        let task_name = document.createElement('input'); task_name.type = 'text'; task_name.id = "task-name-".concat(id); task_name.value = data[0];
        task_container.appendChild(task_name); task_name.setAttribute('placeholder', 'Task name...')

        let task_description = document.createElement('input'); task_description.type = 'text'; task_description.id = "task-dscr-".concat(id); task_description.value = data[1]
        task_container.appendChild(task_description); task_description.setAttribute('placeholder', 'Task description...')

        let task_deadline = document.createElement('input'); task_deadline.type = 'date'; task_deadline.id = 'task-deadline-'.concat(id); task_deadline.value = data[2]
        task_container.appendChild(task_deadline);

        var status_ar = ["Not Started", "In Progress", "Complete"];

        var selectList = document.createElement('select'); selectList.id = 'status-list-'.concat(id);
        task_container.appendChild(selectList);

        status_ar.forEach(e => {
            var option = document.createElement('option'); option.value = e; option.text = e;
            option.id = 'option-'.concat(id + '-' + e)
            selectList.appendChild(option)
        })

        selectList.value = data[3];

        tasks_status[id] = data[3]

        console.log(tasks_status)

        changeStatus(Object.values(tasks_status))

        selectList.onclick = () => {
            console.log(id, task_name.value, task_description.value, task_deadline.value);
            statusUpate(id, task_name.value, task_description.value, task_deadline.value);
        }

        // addToCalendar(id, task_name.value, task_deadline.value, task_description.value)

    container.appendChild(task_container);

    // activateButton(id);
}

const sortData = (data) => {
    var values = Object.values(data);
    var keys = Object.keys(data);

    console.log(keys.length)

    if(keys.length != 0){
        //document.getElementById('tasks-container').style.display = 'none'
        document.getElementById('task-container-0').style.display = 'none'
        empty_json = false;
        for (var i = 0; i < keys.length; i++) {
            buildStartingPage(keys[i], values[i])
        }
        var id = keys.length-1;
        var last_row = document.getElementById('task-container-' + id)
            let add_btn = document.createElement('button'); add_btn.innerHTML = '+'; add_btn.id = 'add-btn-' + id;
            add_btn.style.marginLeft = '1%';
            add_btn.onclick = () => {
                generateNewRow(id);
                activateButton(id);
                document.getElementById('add-btn-'.concat(id)).style.display = 'none';
            }
        last_row.appendChild(add_btn)
    }

}


window.onload = (e) => {
    fetch('http://localhost:8000/data')
    .then(response => response.json())
    .then(data => sortData(data))
}

const sendData = (id, name, dscr, deadline, status) => {
    // if (empty_json){
    //     id = id
    // }else{
    //     id = id-1
    // }
    var data = {
        id: id,
        name: name,
        dscr: dscr,
        deadline: deadline,
        status: status
    };

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
    var inc_num = tasks.filter((x) => x == 'Not Started').length;
    var inp_num = tasks.filter((x) => x == 'In Progress').length;
    var com_num = tasks.filter((x) => x == 'Complete').length;

    document.getElementById('incomplete-status').innerHTML = inc_num;
    document.getElementById('inprogress-status').innerHTML = inp_num;
    document.getElementById('complete-status').innerHTML = com_num;

    document.getElementById('incomlete-per').innerHTML = Math.round((inc_num / Object.keys(tasks).length) * 100);
    document.getElementById('inprogress-per').innerHTML = Math.round((inp_num / Object.keys(tasks).length) * 100);
    document.getElementById('complete-per').innerHTML = Math.round((com_num / Object.keys(tasks).length) * 100);

    if ((Object.values(tasks_status).filter((x) => x == 'Complete').length) == 0){
        document.getElementById('myBar').style.width = '6%'
    }else{
        document.getElementById('myBar').style.width = Math.round(((Object.values(tasks_status).filter((x) => x == 'Complete').length) / Object.keys(tasks).length) * 100) + '%';
    }
      
}

//check if something with this id already exists in the object
const statusUpate = (id, name, description, deadline) => {
    var status;

    if(document.getElementById('option-'.concat(id + '-' + 'Complete')).selected){
        tasks_status[id] = 'Complete';
        status = 'Complete';
    }else if(document.getElementById('option-'.concat(id + '-' + 'In Progress')).selected){
        tasks_status[id] = 'In Progress';
        status = 'In Progress';
    }else if(document.getElementById('option-'.concat(id + '-' + 'Not Started')).selected){
        tasks_status[id] = 'Not Started';
        status = 'Not Started';
    }
    changeStatus(Object.values(tasks_status));

    if (id != '' && name != '' && description != '' && deadline != ''){
        console.log(id, name, description, deadline, status)
        sendData(id, name, description, deadline, status);
    }
}

const addToCalendar = (id, name, deadline, description) => {
    console.log(id, name, deadline)
    let row = document.getElementById('task-container-' + id);

    var calendarBtn = document.createElement('add-to-calendar-button'); calendarBtn.id = 'calendar-btn-' + id;
        calendarBtn.setAttribute('name', name);
        calendarBtn.setAttribute('startDate', deadline);
        calendarBtn.setAttribute('description', description);
        calendarBtn.setAttribute('options', ['Google']);
        calendarBtn.setAttribute('optionName', 'true');

    row.appendChild(calendarBtn)
}

const updateAddButton = (id, name, description, deadline) => {
    console.log(id)
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

    tasks_status[id] = 'Not Started';

    selectList.onclick = () => {
        statusUpate(id, name, description, deadline);
    }
    
    //add to calendar button
    addToCalendar(id, name, deadline, description)
}

const activateButton = (id) => {
    document.getElementById('add-btn-'.concat(id)).addEventListener('click', function() {
        var task_name = document.getElementById("task-name-".concat(id)).value;
        var task_description = document.getElementById("task-dscr-".concat(id)).value;
        var task_deadline = document.getElementById("task-deadline-".concat(id)).value;

        if (task_name != '' && task_description != '' && task_deadline != ''){
            if (empty_json = false) {
                updateAddButton(id, task_name, task_description, task_deadline)
            }
            sendData(id, task_name, task_description, task_deadline, "Not Started");
            updateAddButton(id, task_name, task_description, task_deadline)
            generateNewRow(id)
            console.log(id, task_name, task_description, task_deadline)

                tasks_status[id] = "Not Started"
                document.getElementById('incomplete-status').innerHTML = (Object.values(tasks_status).filter((x) => x == 'Not Started').length);
                document.getElementById('incomlete-per').innerHTML = Math.round((Object.values(tasks_status).filter((x) => x == 'Not Started').length / Object.keys(tasks_status).length) * 100);

                if ((Object.values(tasks_status).filter((x) => x == 'Complete').length) == 0){
                    document.getElementById('myBar').style.width = '6%'
                }else{
                    document.getElementById('myBar').style.width = Math.round(((Object.values(tasks_status).filter((x) => x == 'Complete').length) / Object.keys(tasks).length) * 100) + '%';
                }
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

        let add_btn = document.createElement('button'); add_btn.innerHTML = '+'; add_btn.id = 'add-btn-'.concat(id);
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
        sendData(id, task_name, task_dscr, task_deadline, "Not Started");
        generateNewRow(id);
        updateAddButton(id, task_name, task_dscr, task_deadline);
        // document.getElementById('incomplete-status').innerHTML = String(Number(id) + 1);
        // document.getElementById('incomlete-per').innerHTML = 100;
        tasks_status[id] = "Not Started"
        console.log(tasks_status)
        changeStatus(Object.values(tasks_status))
        // document.getElementById('incomplete-status').innerHTML = (Object.values(tasks_status).filter((x) => x == 'Not Started').length);
        // document.getElementById('incomlete-per').innerHTML = 100;
        document.getElementById('myBar').style.width = '6%'
    }

})