document.getElementById('login_btn').addEventListener('click', function() {

    var username_in = document.getElementById('login_username').value;
    var password_in = document.getElementById('login_password').value;

    if (username_in != '' && password_in != ''){
        var user_data = {
            username: username_in ,
            password: password_in
        }
    
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(user_data)
        })
    }else{
        alert('Make sure to input all the data!')
    }

})

document.getElementById('sign_up_btn').addEventListener('click', function() {
    window.location.assign("http://localhost:8000/signup");
})