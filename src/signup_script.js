document.getElementById('signup_btn').addEventListener('click', function() {

    var fullname_in = document.getElementById('signup_full_name').value;
    var username_in = document.getElementById('signup_username').value;
    var password_in = document.getElementById('signup_password').value;
    var password_conf_in = document.getElementById('signup_password_confirm').value;

    if (username_in != '' && password_in != '' && password_conf_in != ''){
        var user_data = {
            name: fullname_in,
            username: username_in,
            password: password_in,
            password_confirmation: password_conf_in
        }
    
        fetch("/signup", {
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

document.getElementById('log_in_btn').addEventListener('click', function() {
    window.location.assign("http://localhost:8000/login");
})
