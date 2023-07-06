
const generateNewRow = (id) => {
    var id = String(id + 1);
    console.log(id)
    // var container = document.getElementById('tasks-container'); 

    // let task_container = document.createElement('div'); task_container.classList.add('task-container'); task_container.id = "container-".concat(random_id);

    //     let task_name = document.createElement('input'); task_name.type = 'text'; task_name.id = "name-".concat(random_id);
    //     task_container.appendChild(task_name);

    //     let task_description = document.createElement('input'); task_description.type = 'text'; task_description.id = "description-".concat(random_id);
    //     task_container.appendChild(task_description);

    //     let task_deadline = document.createElement('input'); task_deadline.type = 'date'; task_deadline.id = 'deadline-'.concat(random_id);
    //     task_container.appendChild(task_deadline);

    //     let add_btn = document.createElement('button'); add_btn.innerHTML = 'add'; add_btn.id = 'add-'.concat(random_id);
    //     add_btn.addEventListener('click', sendData(
    //         task_name.value, 
    //         task_description.value, 
    //         task_deadline.value
    //         ));
    //     task_container.appendChild(add_btn);


    // container.appendChild(task_container);
}


document.getElementById('add-btn-0').addEventListener('click', function() {
    var task_name = document.getElementById('task-name-0').value;
    var task_dscr = document.getElementById('task-dscr-0').value;
    var task_deadline = document.getElementById('task-deadline-0').value;
    var id = "0";

    var data = {
        id: id,
        name: task_name,
        dscr: task_dscr,
        deadline: task_deadline,
    };

    generateNewRow(Number(id));

    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

})





// fetch('http://localhost:8000/')
// .then(response => response.json())
// .then(data => {
//     data.forEach(task => {
//         createTaskUI(task);
//     })
// })

