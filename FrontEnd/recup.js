let works = []      //  Je commence par créer un tableau dans la variable "works"
let categories = []     //Je crée un tableau pour les catégories

const fetchWorks = async () => {        // création  de la fonction asynchrone
    await fetch("http://localhost:5678/api/works")      // je récupère les données des travaux depuis l'API
    .then((fetchWorks) => fetchWorks.json())        // je convertis les données en JSON
    .then((promise) => {        // Je stocke le résultat dans la variable "promise"
        works = promise;        // J'affecte "promise" dans "works"
        console.log(works);
        generateWorks(works);   // Appel de la fonction "generateWorks"
    });
};

const fetchCategories = async () => {
    await fetch("http://localhost:5678/api/categories")     // Je récupère les catégories depuis l'API
    .then((fetchCategories) => fetchCategories.json())
    .then((data) => {
        categories = data;
        console.log(categories);
    });
};

fetchWorks();   // J'appel la fonction crée au dessus
fetchCategories();

function generateWorks (works) {        // Je crée la fonction "generateWorks" et je prend en paramètre le tableau "works"
    
    const gallerySection = document.querySelector("#portfolio .gallery");    
    gallerySection.innerHTML = "";

    for (let i = 0; i < works.length; i++) {        // Boucle qui parcourt le tableau "works"
        const article = works[i];
        const category = categories.find((cat) => cat.id === article.categoryId);
            
        const workElement = document.createElement("figure");
        workElement.dataset.id = article.id;

        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl
            
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = article.title;

        workElement.appendChild(imageElement);      
        workElement.appendChild(nomElement);
        gallerySection.appendChild(workElement);
        
    }
}

// gestion des filtres
const buttonAll = document.querySelector(".btn-all");
buttonAll.addEventListener("click", function() {
    generateWorks(works);
});

const buttonObjects = document.querySelector(".btn-objects");
buttonObjects.addEventListener("click", function() {
    const filteredObjects = works.filter((work) => work.categoryId === 1);
    generateWorks(filteredObjects);
});

const buttonAppartments = document.querySelector(".btn-appartments");
buttonAppartments.addEventListener("click", function() {
    const filteredAppartments = works.filter((work) => work.categoryId === 2);
    generateWorks(filteredAppartments);
});

const buttonHotels = document.querySelector(".btn-hotels");
buttonHotels.addEventListener("click", function() {
    const filteredHotels = works.filter((work) => work.categoryId === 3);
    generateWorks(filteredHotels);
    console.log(filteredHotels);
});

// Partie PAGE DE CONNEXION

