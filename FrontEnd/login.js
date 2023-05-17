// Sélection des éléments du DOM
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

// Création du bloc contenant les éléments de la deuxième interface de ma modale
const modalContent3 = document.createElement("div");  
    modalContent3.classList.add("modal-content-3");

// Ajoute l'évenement submit au formulaire
form.addEventListener("submit", (e) => {        
    e.preventDefault();     // Empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Envoi de la requête fetch à l'API pour l'authentification de l'utilisateur
    const loginFetch = fetch("http://localhost:5678/api/users/login", {     
        method: "POST",
        headers : {
            "Content-Type": "application/json"      // Envoi des informations d'identification sous forme JSON
        },    
        body: JSON.stringify({email, password})
    })
    .then(response => response.json())      // Converti la réponse en format JSON
    .then(data => {     
        if (data.userId) {      // Condition pour savoir si l'utilisateur a été identifié
            data.isLogggedIn = true;
            localStorage.setItem("token", data.token);      // Stockage du token dans le localStorage
            window.location.href = "index.html";        // Redirection vers la page d'accueil          
        } else {
            errorMessage.style.display = "block";       // Affichage du message d'erreur
        }
    })
});


const token = localStorage.getItem("token");


// PARTI CONNECTÉ

// Fonction appelée lorsque l'utilisateur est connecté
function loggedIn() {   

    loginBtn.textContent = "logout";
        
    // Affichage de la bannière
    banner.style.display = "flex";

    // Ajoout du mode édition à la bannière
    const editMode = document.createElement("span");
        editMode.innerHTML = `<i class="fa-regular fa-pen-to-square square"></i> Mode édition`;
        banner.appendChild(editMode);
        editMode.style.fontSize = "16px";

    // Ajout du bouton pour publier les changements à la bannière
    const buttonChange = document.createElement("button");
        buttonChange.innerHTML = "publier les changements";
        banner.appendChild(buttonChange);
        buttonChange.style.borderRadius = "20px";
        buttonChange.style.border = "none";
        buttonChange.style.width = "215px";
        buttonChange.style.height = "38px";
        buttonChange.style.fontFamily = "Work sans";
        buttonChange.style.fontWeight = "600";

    // Affichage des liens "modifier"
    modify.style.display = "flex";          
    modifyButton.style.display = "flex";

    // Cache des filtres
    const hideFilters = document.querySelector(".filters");     
        hideFilters.style.visibility = "hidden";

    // Gestion du clique sur le bouton de déconnexion
    loginBtn.addEventListener("click", () => {      
        localStorage.removeItem("token");
        window.location.href = "index.html";
        
    });
}


// Vérifie si un token est présent dans le localStorage (utilisateur connecté)
if (token) {                 
    loggedIn(token);        
} else {
    loginBtn.textContent = "login";
    modify.style.display = "none";
    modifyButton.style.display = "none";
};
    


// INITIALISATION DE L'ETAT DE LA MODALE
    
function openModal() {        
    switchModalContents(true);
    const modal = document.querySelector(".modal-window");
    const overlay = document.querySelector(".overlay");
    modal.style.display = "block";      // Au clique, fait apparaître la modale
    overlay.style.display = "block";    // Au clique, fait apparaître la superposition avec opacité
    worksImages();     
}

// Bouton permettant l'ouverture de la modale
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
    inputTitle.value = "";
    categorySelect.value = "";
    modalContent3.style.display = "block";
    imagePreview.remove();
    fileDownload.style.display = "flex";
    buttonDownload.style.display = "flex";
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
                imageContainer.classList.add("image-container");        // class="image-container"
                imageContainer.dataset.workId = work.id;
            const image = document.createElement("img");
            const editImage = document.createElement("figcaption");
                editImage.innerHTML = "éditer";                         // texte "éditer" sous l'image
            const trashIcon = document.createElement("span");
                trashIcon.classList.add("trash-icon");                  // class="trash-icon"
                trashIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';      // icone "poubelle"      

                deleteOneModalWork(work, trashIcon, imageContainer);
            
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
                                worksGallery.remove();
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

        // Fonction de suppression dynamique d'un élément
function deleteOneModalWork(work, trashIcon, imageContainer) {
    if (trashIcon) {
        imageContainer.addEventListener("click", function(e) {
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
                    removeModalAndDomElement(e, work.id);
                    console.log("Work deleted");
                } else {
                    throw new Error("failed to delete work")
                }
            });
        });
    }
}

// Fonction de suppression des travaux du DOM : Galerie de la modale
function removeModalAndDomElement(e, workId) {  
    const modalFigureRemoved = e.target.closest(".image-container");
        modalFigureRemoved.remove();
        
    const domElementRemoved = document.querySelector(`.work-element[data-id="${workId}"]`);
        if (domElementRemoved) {
            domElementRemoved.remove();
            console.log("Work deleted from the DOM");
        } else {
            console.log("failed to delete from the DOM");
        }
};


const addImage = document.getElementById("add-image");      // Bouton "Ajouter une photo"
    addImage.addEventListener("click", () => {
        switchModalContents(false);
        generateModal2();
});

// Création des éléments
const leftArrow = document.createElement("span");       // Création de la flèche gauche
const titleModal2 = document.createElement("h2");    //  Titre "Ajout Photo"
const blockModal2 = document.createElement("form");
const addImageBlock = document.createElement("div");
const pictureIcon = document.createElement("span");
const buttonDownload = document.createElement("label");        // Label concernant le bouton pour charger une photo
const fileDownload = document.createElement("input");       // Bouton pour accéder aux fichiers
const imagePreview = document.createElement("img");     // Je crée "img" pour afficher l'image lorsque "load" sera déclenché 
const downloadText = document.createElement("p");
const inputTitle = document.createElement("input");
const labelTitle = document.createElement("label");
const categorySelect = document.createElement("select");
const option1 = document.createElement("option"); // Création de la première option
const option2 = document.createElement("option"); // Création de la deuxième option
const option3 = document.createElement("option"); // Création de la troisième option
const categoryLabel = document.createElement("label");
const blockValidateModal2 = document.createElement("div");      // Bloc du bouton "valider"
const alertValidate = document.createElement("p");
const validateImageButton = document.createElement("button");       //  Bouton "valider"


function generateModal2() {
    
    modalContent3.innerHTML = "";

        leftArrow.classList.add("left-arrow");
        leftArrow.innerHTML = `<i class="fa-solid fa-arrow-left-long"></i>`;
        leftArrow.addEventListener("click", () => {
            closeModal2();
            switchModalContents(true);
        });

        titleModal2.classList.add("title-modal-2");
        titleModal2.innerHTML = "Ajout photo";

        blockModal2.classList.add("block-modal-2");

        addImageBlock.classList.add("add-image-block");
    
        pictureIcon.classList.add("picture-icon");
        pictureIcon.innerHTML = `<i class="fa-regular fa-image picture"></i>`;
    
        buttonDownload.classList.add("button-download");
        buttonDownload.innerHTML = "+ Ajouter photo";
        buttonDownload.addEventListener("click", function () {
            fileDownload.click();               // Le clique déclenche l'input en dessous
        });

        fileDownload.id = "file-download";
        fileDownload.type = "file";     //  Cet élément permet de sélectionner un fichier image sur l'ordinateur
        fileDownload.accept = "image/jpeg, image-png";      // Types de fichier acceptés
        fileDownload.maxSize = 4 * 1024 * 1024;        // 4 Mo max

        downloadText.innerHTML = "jpg, png: 4mo max";

        inputTitle.type = "text";
        inputTitle.classList.add("input-title");

        labelTitle.for = "input-title";
        labelTitle.innerHTML = "Titre";

        categorySelect.id = "category-select";

        option1.value = 1;
        option1.text = "Objets";
        categorySelect.add(option1);
    
        option2.value = 2;
        option2.text = "Appartements";
        categorySelect.add(option2);
    
        option3.value = 3;
        option3.text = "Hôtels & restaurants";
        categorySelect.add(option3);

        categoryLabel.for = "category-select";
        categoryLabel.innerHTML = "Catégorie";

        blockValidateModal2.classList.add("block-validate-modal2");

        alertValidate.innerHTML = "Veuillez remplir tous les champs pour valider"
        alertValidate.classList.add("alert-validate");
        alertValidate.style.display = "none";
        blockValidateModal2.appendChild(alertValidate); 
        
        validateImageButton.id = "validate-image-button";
        validateImageButton.innerHTML = "Valider";
    

    let click = false;

    // Écouteurs dévénements pour détecter les changements dans les valeurs des champs et appelle la fonction "validate fields"
    inputTitle.addEventListener("input", validateFields);
    fileDownload.addEventListener("input", validateFields);
    categorySelect.addEventListener("change", validateFields);

    
    handleFileDownloadChange();
    handleValidateImageButtonClick();
    validateFields();
    resetModalContents2();
    
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

function handleFileDownloadChange() {
    fileDownload.addEventListener("change", function () {       // l'événement "change" est utilisé pour déclencher le chargement de l'image sélectionnée par l'utilisateur, en utilisant l'API FileReader pour lire le contenu du fichier sélectionné
        const reader = new FileReader();                        // j' utilise l'objet FileReader pour lire le contenu de l'image
            reader.addEventListener("load", function () {       // Événement "load" sur "fileReader" pour lire le contenu de l'image                                                          
                imagePreview.src = reader.result;       // La source de l'élément img est définie sur la valeur de la propriété "result" de l'objet FileReader, qui contient les données de l'image en tant que URL
                imagePreview.style.maxWidth = "100%";
                imagePreview.style.maxHeight = "100%";
                imagePreview.style.position = "absolute";       // AFFICHAGE DE L'IMAGE
                imagePreview.style.top = "0";
                addImageBlock.style.position = "relative";
                fileDownload.style.display = "none";
                buttonDownload.style.display = "none";
                addImageBlock.appendChild(imagePreview);
                validateFields();       // Appel de la fonction pour changer la couleur du bouton "valider"
            });
        
        reader.readAsDataURL(fileDownload.files[0]);        // Génère l'URL avec la méthode readAsDataURL qui convertit le contenu du fichier en une URL
    });
}

function validateFields() {
    const selectedImage = fileDownload.files[0];
    const selectedTitle = inputTitle.value;
    const selectedCategory = categorySelect.value;

    if (selectedImage && selectedTitle && selectedCategory) {
        validateImageButton.style.backgroundColor = "#1D6154";
    } else {
        validateImageButton.style.backgroundColor = "#A7A7A7";
    }
};

function handleValidateImageButtonClick() {
    validateImageButton.addEventListener("click", async function(e) {
        e.preventDefault();
        let click = true;
        const selectedImage = fileDownload.files[0];
        const selectedTitle = inputTitle.value;
        const selectedCategory = categorySelect.value;

        if (!selectedImage || !selectedTitle || !selectedCategory) {
            e.preventDefault();
            alertValidate.style.display = "block";
        } else {
            e.preventDefault();
            const formData = new FormData();
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
                    e.preventDefault();
                    closeModal2();
                    resetModalContents();
                    openModal();
                    
                    const newElement = document.createElement("figure");
                    newElement.classList.add("work-element");
                    newElement.innerHTML = `
                    <img src="${imagePreview.src}"/>
                    <figcaption>${selectedTitle}</figcaption>
                    `;

                    const gallery = document.querySelector('.gallery');
                    gallery.appendChild(newElement);

                } else {
                    console.log('Error adding image to the database');
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
}

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
