
const form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
form.addEventListener("submit", (e) => {        // Ajoute l'évement submit au formulaire
    e.preventDefault();     // Empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginFetch = fetch("http://localhost:5678/api/users/login", {     // Envoi de la requête fetch à l'API
        method: "POST",
        headers : {"Content-Type": "application/json"},     // Envoi des informations d'identification sous forme JSON
        body: JSON.stringify({email, password})
    })
    .then(response => response.json())      // Converti la réponse en format JSON
    .then(data => {     // Stocke la réponse JSON dans "data"
        if (data.userId) {      // Condition pour savoir si l'utilisateur a été identifié
            data.isLogggedIn = true;
            localStorage.setItem("token", data.token);      // je stocke ensuite le token dans le localStorage
            window.location.href = "index.html";        // Redirection vers la page d'accueil
        } else {
            errorMessage.style.display = "block";       // Sinon affichage du message d'erreur
        }
    });
});


