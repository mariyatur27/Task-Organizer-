const PORT = 8000;
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
app.use(cors())
const fs = require('fs');
app.use(express.json())

var data = fs.readFileSync('users.json');
var users = JSON.parse(data);

var user_data = fs.readFileSync('users.json');
var users = JSON.parse(user_data);

app.use('/static', express.static('src')); 

app.get( '/login', (req, res) => {
   res.sendFile("login.html", { root: __dirname });
})
app.get( '/signup', (req, res) => {
    res.sendFile("signup.html", { root: __dirname });
 })

const sendMessage = (message) => {
  app.get('/login', (req, res) => {
    console.log(message + '!!!!')
    const data = {"message": message}
    const json = data.json();
    res.json(json)
  })
}

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
                if(String(password) == user[username].password){
                   console.log('redirecting')
                   res.redirect('/dashboard')

                   app.get('/data', (req, res) => {
                    fs.readFile("users.json", "utf8", (err, jsonString) => {
                
                        if (err) {
                          console.log("File read failed:", err);
                          return;
                        }
                        try {
                
                            const modified_data = JSON.parse(jsonString);
                            console.log(modified_data[username]);
                            res.json(modified_data[username])
                
                          } catch (err) {
                            console.log("Error parsing JSON string:", err);
                          }
                      });
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

        var name = req.body.name
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
                    users[username] = {
                      "password": password,
                      "name": name,
                      "username": username,
                      "tasks": {}
                    };
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
 })


app.post('/dashboard', (req, res) => {
    console.log(req.body)
    var info = req.body
    var user = info.username
    var task_details = [info.name, info.dscr, info.deadline, info.status];

    console.log(info.id)
    console.log(task_details)
    console.log(users[user].tasks)

    var tasks = users[user].tasks
    tasks[info.id] = task_details;
    var data = JSON.stringify(users); 
  
    fs.writeFileSync('users.json', data)
})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))