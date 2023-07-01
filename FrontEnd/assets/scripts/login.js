
function loginUser() {
    
    document.querySelector('#login form').addEventListener('submit', async function (event) {
        
        event.preventDefault();
        
        const loginValue = {
            email: this.querySelector("[name=email]").value,
            password: this.querySelector("[name=password]").value
        };
        
        const loginValueJson = JSON.stringify(loginValue);
        
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: loginValueJson
        };
        
        const responseLogin = await fetch('http://localhost:5678/api/users/login', requestOptions);
        if (responseLogin.ok) { 
            let bearer = await responseLogin.json(); 
            sessionStorage.setItem('accessToken', bearer.token); 
            window.location.assign('../../index.html'); 
        } else {
            const error = document.querySelector('#login .login-error'); 
            error.innerText = "Erreur dans l’identifiant ou le mot de passe";
        }
    });
}
loginUser();