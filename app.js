const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const loginButton = document.querySelector('#login-button');
const loginMessage = document.querySelector('#login-message');

loginButton.addEventListener('click', function (event) {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    fetch('http://127.0.0.1:3000/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_account: username, password: password })
    })
        .then(response => response.json())
        .then(data => {
            console.log('回傳值!!!',data);
            if (data.msg === '登入成功') {
                loginMessage.innerHTML = '登入成功!';
            } else {
                loginMessage.innerHTML = '登入失敗!';
            }
        })
        .catch(error => {
            console.log('回傳值!!!',error);
            loginMessage.innerHTML = 'An error occurred: ' + error.message;
        });
});