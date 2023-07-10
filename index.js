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

var user_data = fs.readFileSync('users.json');
var users = JSON.parse(user_data);

app.use('/static', express.static('src')); 

app.get( '/login', (req, res) => {
   res.sendFile("login.html", { root: __dirname });
})
app.get( '/signup', (req, res) => {
    res.sendFile("signup.html", { root: __dirname });
 })

 app.post('/login', (req, res, next) => {
    fs.readFile("users.json", "utf8", (err, jsonString) => {

        var username = req.body.username
        var password = req.body.password

        if (err) {
          console.log("File read failed:", err);
          return;
        }
        try {

            const user = JSON.parse(jsonString);

            if (username in user){
                if(String(password) == user[username]){
                   console.log('redirecting')

                   app.get('/login',(req,res)=>{
                        res.redirect(301,'/dashboard');
                    })

                }else{
                    console.log('incorrect password')
                }
            }else{
                console.log('doesnt exists')
            }

          } catch (err) {
            console.log("Error parsing JSON string:", err);
          }
      });

 })

 app.post('/signup', (req, res, next) => {
    fs.readFile("users.json", "utf8", (err, jsonString) => {

        var username = req.body.username
        var password = req.body.password
        var password_confirmation = req.body.password_confirmation

        if (err) {
          console.log("File read failed:", err);
          return;
        }
        try {

            const user = JSON.parse(jsonString);

            if (password == password_confirmation){
                if (username in user){
                    console.log('This account already exists')
                }else{
                    users[username] = password;
                    var user_data = JSON.stringify(users);
                
                    fs.writeFileSync('users.json', user_data)
                }

            }else{
                console.log('The passwords do not match')
            }

          } catch (err) {
            console.log("Error parsing JSON string:", err);
          }
      });

 })

 app.get( '/dashboard', (req, res) => {
    res.sendFile("main.html", { root: __dirname });

    fs.readFile("tasks.json", "utf8", (err, jsonString) => {

        var data = req.body

        if (err) {
          console.log("File read failed:", err);
          return;
        }
        try {

            const modified_data = JSON.parse(jsonString);
            console.log(modified_data);
            res.modified_data

          } catch (err) {
            console.log("Error parsing JSON string:", err);
          }
      });
 })



app.post('/dashboard', (req, res) => {
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