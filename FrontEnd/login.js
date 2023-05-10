const form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message");
const loginBtn = document.querySelector("#login-btn a");
const banner = document.getElementById("black-banner");
const modify = document.querySelector(".modify");
const modifyButton = document.querySelector(".modify-btn");
const modal = document.querySelector(".modal-window");
const modalContents = document.querySelector(".modal-contents");
const modalContent1 = document.querySelector(".modal-content1");
const modalContent2 = document.querySelector(".modal-content2");

const modalContent3 = document.createElement("div");    // Création du bloc contenant les éléments de la deuxième interface de ma modale
    modalContent3.classList.add("modal-content-3");


form.addEventListener("submit", (e) => {        // Ajoute l'évenement submit au formulaire
    e.preventDefault();     // Empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginFetch = fetch("http://localhost:5678/api/users/login", {     // Envoi de la requête fetch à l'API
        method: "POST",
        headers : {
            "Content-Type": "application/json"      // Envoi des informations d'identification sous forme JSON
        },    
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
    })
});


const token = localStorage.getItem("token");


// PARTI CONNECTÉ

function loggedIn() {   

    loginBtn.textContent = "logout";
        
    // Partie css de la bannière
    banner.style.display = "flex";

    const editMode = document.createElement("span");
        editMode.innerHTML = `<i class="fa-regular fa-pen-to-square square"></i> Mode édition`;
        banner.appendChild(editMode);
    // Partie css du mode édition
        editMode.style.fontSize = "16px";

    const buttonChange = document.createElement("button");
        buttonChange.innerHTML = "publier les changements";
        banner.appendChild(buttonChange);
        // Partie css du bouton
        buttonChange.style.borderRadius = "20px";
        buttonChange.style.border = "none";
        buttonChange.style.width = "215px";
        buttonChange.style.height = "38px";
        buttonChange.style.fontFamily = "Work sans";
        buttonChange.style.fontWeight = "600";

    modify.style.display = "flex";          // Affichage des liens "modifier"
    modifyButton.style.display = "flex";

    const hideFilters = document.querySelector(".filters");     // Cache les filtres
        hideFilters.style.visibility = "hidden";

    loginBtn.addEventListener("click", () => {      // Clique pour déconnexion
        localStorage.removeItem("token");
        window.location.href = "index.html";
        
    });
}



if (token) {                // Si le token est présent dans le localStorage 
    loggedIn(token);        // Appel de la fonction de validation
} else {
    loginBtn.textContent = "login";
    modify.style.display = "none";
    modifyButton.style.display = "none";
};
    


     // Initialisation de l'état de la modale
    
function openModal() {        // Création de la fonction pour générer la modale
    switchModalContents(true);
    const modal = document.querySelector(".modal-window");
    const overlay = document.querySelector(".overlay");
    modal.style.display = "block";      // Au clique, fait apparaître la modale
    overlay.style.display = "block";    // Au clique, fait apparaître la superposition avec opacité
    worksImages();      // Appel de la fonction pour générer les images
}

modifyButton.addEventListener("click", () => {
    openModal();
});

function closeModal() {
    const modal = document.querySelector(".modal-window");
    const overlay = document.querySelector(".overlay");
    modal.style.display = "none";
    overlay.style.display = "none";
    resetModalContents();
}

function resetModalContents() {
    modalContents.style.display = "block";
}

function resetModalContents2() {
    modalContent3.style.display = "block";
}

function switchModalContents (visible) {
    let data;
    data = visible ? 'block' :'none';
    modalContents.style.display = data;
}
    
function closeModal2() {
    modalContent3.style.display = "none";
    resetModalContents();
}


function worksImages() {        // Fonction pour récupérer les images de l'API
    fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(works => {
        const worksGallery = document.getElementById("works-gallery");
            worksGallery.innerHTML = "";
        
        works.forEach((work, first) => {
            const imageContainer = document.createElement("figure");
                imageContainer.classList.add("image-container");        // id="image-container"
            const image = document.createElement("img");
            const editImage = document.createElement("figcaption");
                editImage.innerHTML = "éditer";                         // texte "éditer" sous l'image
            const trashIcon = document.createElement("span");
                trashIcon.classList.add("trash-icon");                  // class="trash-icon"
                trashIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';      // icone "poubelle"
                trashIcon.addEventListener("click", function(e) {
                    removeWork();
                    removeModalWork();
                    e.preventDefault();
                    fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: "DELETE",
                        headers: {
                            "Accept" : "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log("Work deleted");
                        } else {
                            throw new Error("failed to delete work")
                        }
                    });
                });  
            
                image.src = work.imageUrl;              // Récupération des images uniquement
            
            if (first === 0) {                      // Je cherche la première image du tableau work
                const arrowsIcon = document.createElement("span");
                arrowsIcon.classList.add("arrow-icon");      // class="arrow-icon"
                arrowsIcon.innerHTML = `<i class="fa-solid fa-arrows-up-down-left-right"></i>`;      // icone "flêches"
                imageContainer.appendChild(arrowsIcon);
            }

            const deleteAllWorksButton = document.getElementById("delete-galery");      // Je récupère le bouton "Supprimer la galerie"
                deleteAllWorksButton.addEventListener("click", () => {
                    const worksList = document.querySelectorAll(".gallery");        //  Je récupère le parent des éléments
                    const worksElements = document.querySelectorAll(".work-element");       // Je récupère les travaux du DOM avec la classe "work-element"
                    console.log(worksList);
                    Array.from(worksElements).forEach(work => {     // Je convertis tout les éléments dans un tableau
                        const workId = work.dataset.id;
                        fetch(`http://localhost:5678/api/works/${workId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        })
                        .then (response => {
                            if (response.ok) {
                                work.remove();
                            } else {
                                throw new Error ("failed to delete all images")
                            }
                        })
                    });
                })   

            imageContainer.appendChild(image);
            imageContainer.appendChild(editImage);
            imageContainer.appendChild(trashIcon);
            worksGallery.appendChild(imageContainer);
         });
    });
}

// Fonction de suppression des travaux du DOM : Galerie de la modale
function removeModalWork() {
    const modalFigureRemoved = document.getElementById("image-container");
    console.log(`Contenu de image-container avant sa suppression : ${modalFigureRemoved}`);
    modalFigureRemoved.remove();
};

// Fonction de suppression des travaux du DOM : Galerie de la page principale
function removeWork() {
    const figureRemove = document.getElementById("work-element");
    console.log(`Contenu de work-element avant sa suppression : ${figureRemove}`);
    figureRemove.remove();
};

function generateModal2() {
    
    modalContent3.innerHTML = "";

    const leftArrow = document.createElement("span");       // Création de la flèche gauche
        leftArrow.classList.add("left-arrow");
        leftArrow.innerHTML = `<i class="fa-solid fa-arrow-left-long"></i>`;
        leftArrow.addEventListener("click", () => {
            closeModal2();
            switchModalContents(true);
        });

    const titleModal2 = document.createElement("h2");    //  Titre "Ajout Photo"
        titleModal2.classList.add("title-modal-2");
        titleModal2.innerHTML = "Ajout photo";

    const blockModal2 = document.createElement("form");
        blockModal2.classList.add("block-modal-2");

    const addImageBlock = document.createElement("div");
        addImageBlock.classList.add("add-image-block");
    const pictureIcon = document.createElement("span");
        pictureIcon.classList.add("picture-icon");
        pictureIcon.innerHTML = `<i class="fa-regular fa-image picture"></i>`;
    
    const buttonDownload = document.createElement("label");        // Label concernant le bouton pour charger une photo
        buttonDownload.classList.add("button-download");
        buttonDownload.innerHTML = "+ Ajouter photo";
        buttonDownload.addEventListener("click", function () {
            fileDownload.click();               // Le clique déclenche l'input en dessous
        });

    const fileDownload = document.createElement("input");       // Bouton pour accéder aux fichiers
        fileDownload.id = "file-download";
        fileDownload.type = "file";     //  Cet élément permet de sélectionner un fichier image sur l'ordinateur
        fileDownload.accept = "image/jpeg, image-png";      // Types de fichier acceptés
        fileDownload.maxSize = 4 * 1024 * 1024;        // 4 Mo max

    const imagePreview = document.createElement("img");     // Je crée "img" pour afficher l'image lorsque "load" sera déclenché 
    
    fileDownload.addEventListener("change", function () {       // l'événement "change" est utilisé pour déclencher le chargement de l'image sélectionnée par l'utilisateur, en utilisant l'API FileReader pour lire le contenu du fichier sélectionné
        const reader = new FileReader();                        // j' utilise l'objet FileReader pour lire le contenu de l'image
            reader.addEventListener("load", function () {       // Événement "load" sur "fileReader" pour lire le contenu de l'image                                                          
                imagePreview.src = reader.result;       // La source de l'élément img est définie sur la valeur de la propriété "result" de l'objet FileReader, qui contient les données de l'image en tant que URL
                imagePreview.style.maxWidth = "100%";
                imagePreview.style.maxHeight = "100%";
                imagePreview.style.position = "absolute";       // AFFICHAGE DE L'IMAGE
                imagePreview.style.top = "0";
                addImageBlock.style.position = "relative";
                addImageBlock.appendChild(imagePreview);
                validateFields();       // Appel de la fonction pour changer la couleur du bouton "valider"
            });
        
        reader.readAsDataURL(fileDownload.files[0]);        // Génére l'URL avec la méthode readAsDataURL qui convertit le contenu du fichier en une URL
    });

    const downloadText = document.createElement("p");
        downloadText.innerHTML = "jpg, png: 4mo max";

    const inputTitle = document.createElement("input");
        inputTitle.type = "text";
        inputTitle.classList.add("input-title");

    const labelTitle = document.createElement("label");
        labelTitle.for = "input-title";
        labelTitle.innerHTML = "Titre";

    const categorySelect = document.createElement("select");
        categorySelect.id = "category-select";

    const option1 = document.createElement("option"); // Création de la première option
        option1.value = 1;
        option1.text = "Objets";
        categorySelect.add(option1);
    const option2 = document.createElement("option"); // Création de la deuxième option
        option2.value = 2;
        option2.text = "Appartements";
        categorySelect.add(option2);
    const option3 = document.createElement("option"); // Création de la troisième option
        option3.value = 3;
        option3.text = "Hôtels & restaurants";
        categorySelect.add(option3);

    const categoryLabel = document.createElement("label");
        categoryLabel.for = "category-select";
        categoryLabel.innerHTML = "Catégorie";

    const blockValidateModal2 = document.createElement("div");      // Bloc du bouton "valider"
        blockValidateModal2.classList.add("block-validate-modal2");
    
    const validateImageButton = document.createElement("button");       //  Bouton "valider"
        validateImageButton.id = "validate-image-button";
        validateImageButton.innerHTML = "Valider";

    const alertValidate = document.createElement("p");
        alertValidate.innerHTML = "Veuillez remplir tous les champs pour valider"
        alertValidate.classList.add("alert-validate");
        alertValidate.style.display = "none";
        blockValidateModal2.appendChild(alertValidate);  
    
    const validateFields = () => {
        const selectedImage = fileDownload.files[0];
        const selectedTitle = inputTitle.value;
        const selectedCategory = categorySelect.value;

        if (selectedImage && selectedTitle && selectedCategory) {
            validateImageButton.style.backgroundColor = "#1D6154";
        } else {
            validateImageButton.style.backgroundColor = "#A7A7A7";
        }
    };

    let click = false;

    inputTitle.addEventListener("input", validateFields);
    fileDownload.addEventListener("input", validateFields);
    categorySelect.addEventListener("change", validateFields);

    validateImageButton.addEventListener("click", async function(e) {
        click = true;
        const selectedImage = fileDownload.files[0];
        const selectedTitle = inputTitle.value;
        const selectedCategory = categorySelect.value;

        if (!selectedImage || !selectedTitle || !selectedCategory) {
            e.preventDefault();
            alertValidate.style.display = "block";
        } else {
            e.preventDefault();
            const formData = new FormData();        //  Je crée un nouvel objet FormData pour stocker des paires clé-valeur qui représentent les données du formulaire
            formData.append('title', inputTitle.value);
            formData.append('category', categorySelect.value);
            formData.append('image', fileDownload.files[0]);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    Authorization : `Bearer ${token}`,
                },
                body: formData
            });
            if (response.ok) {
                console.log('Image added to the database');
                closeModal2();
                resetModalContents();
            } else {
                console.log('Error adding image to the database');
            }
        } catch (error) {
            console.error(error);
        }
    }
});

    validateFields();

    resetModalContents2()
    
    modal.appendChild(modalContent3);
    modalContent3.appendChild(blockModal2);
    blockModal2.appendChild(titleModal2);
    modalContent3.appendChild(leftArrow);
    blockModal2.appendChild(addImageBlock);
    addImageBlock.appendChild(pictureIcon);
    addImageBlock.appendChild(buttonDownload);
    addImageBlock.appendChild(fileDownload);
    addImageBlock.appendChild(downloadText);
    blockModal2.appendChild(labelTitle);
    blockModal2.appendChild(inputTitle);
    blockModal2.appendChild(categoryLabel);
    blockModal2.appendChild(categorySelect);
    modalContent3.appendChild(blockValidateModal2);
    blockValidateModal2.appendChild(validateImageButton);
};

const addImage = document.getElementById("add-image");
    addImage.addEventListener("click", () => {
        switchModalContents(false);
        generateModal2();
    });

const closeButton  = document.querySelector(".close");
    closeButton.addEventListener("click", () => {       // Fermeture de la modale par la croix
        closeModal();
        closeModal2();
        resetModalContents();
    });
    
const overlay = document.querySelector(".overlay");
    overlay.addEventListener("click", () => {       // Fermeture de la modale par le clique en dehors
        closeModal();
        closeModal2();
        resetModalContents();
    });

document.addEventListener("keydown", (e) => {       // Fermeture de la modale en appuyant sur echap
    if (e.key === "Escape") {
        closeModal();
        closeModal2();
        resetModalContents();
    }
});
