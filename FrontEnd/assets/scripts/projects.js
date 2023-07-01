import { modal, deleteWorks, toggleCrossIcon } from "./modal.js";


let works
async function fetchWorks() {
    const responseWorks = await fetch('http://localhost:5678/api/works/');
    works = await responseWorks.json();
}
await fetchWorks();


function generateWorks(displayedWorks) {
    clearWorks();
    createWorksElements(displayedWorks, "portfolio");
    createWorksElements(displayedWorks, "modal");
    deleteWorks();
    toggleCrossIcon();
}
generateWorks(works);

function createWorksElements(displayedWorks, gallery) {
    for (let i = 0; i < displayedWorks.length; i++) {
        const work = displayedWorks[i];
       
        const workElement = document.createElement('figure');
       
        const imageElement = document.createElement('img');
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const captionElement = document.createElement('figcaption');
        
        workElement.appendChild(imageElement);
        workElement.appendChild(captionElement);
        if (gallery == "portfolio") { 
            captionElement.innerText = work.title;
            const portfolioGallery = document.querySelector('.portfolio-gallery');
            portfolioGallery.appendChild(workElement);
        } else if (gallery == "modal") { 
            captionElement.innerText = 'éditer';
            const modalGallery = document.querySelector('.modal-gallery');
            const trashIcon = document.createElement('i');
            trashIcon.setAttribute('class', 'fa-solid fa-trash-can modal-icons icon-trash');
            trashIcon.dataset.workId = work.id;
            const crossIcon = document.createElement('i');
            crossIcon.setAttribute('class', 'fa-solid fa-arrows-up-down-left-right modal-icons icon-cross icon-toggle');
            if (modal) { 
                modalGallery.appendChild(workElement);
                workElement.appendChild(trashIcon);
                workElement.appendChild(crossIcon);
            };
        };
    };
}


function clearWorks() {
    document.querySelector(".portfolio-gallery").innerHTML = "";
    if (modal) {
        document.querySelector(".modal-gallery").innerHTML = "";
    }
}


const responseCategories = await fetch('http://localhost:5678/api/categories/');
const categories = await responseCategories.json();


function generateCategories() {
    
    const filters = document.querySelector('.filters');
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        const filterElement = document.createElement('li');
        filterElement.innerText = category.name;
        filterElement.dataset.categoryId = category.id;
       
        filters.appendChild(filterElement);
    };
}
generateCategories();


function filterByCategory() {
    
    const filterButtons = document.querySelectorAll('.filters li');
   
    filterButtons.forEach(button => {
        
        button.addEventListener("click", function () {
            
            filterButtons.forEach(button => { button.classList.remove('filter-selected') });
           
            button.classList.add('filter-selected');
          
            let selectedCategoryId = button.dataset.categoryId;
            if (button.classList.contains('no-filter')) { 
                generateWorks(works);
            } else {
                let filteredWorks = works.filter(work => work.categoryId == selectedCategoryId);
                generateWorks(filteredWorks);
            }
        });
    });
}
filterByCategory();

export {
    generateWorks,
    works,
    categories,
    fetchWorks
};