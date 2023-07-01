//Affichage des éléments lorsque l'utilisateur est connecté
const connected = sessionStorage.getItem('accessToken');
const logout = sessionStorage.removeItem('accessToken');

const toggleEditMode = document.querySelectorAll('.edit');
const toggleLogin = document.querySelector('.hide-login');

if (connected) {
    console.log("L'utilisateur est connecté avec succès")
    toggleEditMode.forEach(element => {
        element.style.display = 'flex';
    });
    toggleLogin.style.display = 'none';
} else {
    toggleEditMode.forEach(element => {
        element.style.display = 'none';
    });
    toggleLogin.style.display = 'flex';
}

//Déconnexion
document.querySelector('.logout').addEventListener('click', function () {
    logout;
    window.location.reload();
});