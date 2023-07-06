const PORT = 8000;
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
app.use(cors())
const fs = require('fs');
app.use(express.json())

var data = fs.readFileSync('tasks.json');
var tasks = JSON.parse(data);

app.use('/static', express.static('src')); 

app.get( '/', (req, res) => {
   res.sendFile("index.html", { root: __dirname });
})


app.post('/', (req, res) => {
    console.log(req.body)
    var info = req.body
    var task_details = [info.name, info.dscr, info.deadline];

    console.log(info.id)
    console.log(task_details)

    tasks[info.id] = task_details;
    var data = JSON.stringify(tasks);
  
    fs.writeFileSync('tasks.json', data)
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))