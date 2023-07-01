import { generateWorks, works, categories, fetchWorks } from "./projects.js";



let modal = null;

const openModal = async function (e) {
    e.preventDefault();
    const target = e.target.getAttribute('href'); 
    if (modal == null) {  
        modal = await loadModal(target); 
        modal.addEventListener('click', closeModal);
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-stop').addEventListener('click', stopPropagation);
        modalSwitchEvent();
        generateCategoryOptions();
        addWorks();
        validate();
        deleteAllWorks()
        let imageInput = modal.querySelector('#add-works #image');
        imageInput.addEventListener('change', function () { previewImage(imageInput) });
    } else { 
        modal.style.display = null; 
    }
    generateWorks(works);
};


const closeModal = function () {
    if (modal == undefined) return;
    modal.style.display = 'none';
    modalSwitch(null, null); 
};


const stopPropagation = function (e) {
    e.stopPropagation();
};


const loadModal = async function (url) {
    const target = '#' + url.split('#')[1];
    const html = await fetch(url).then(response => response.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    document.body.append(element);
    return element;
};


document.querySelectorAll('.modal-open').forEach(a => {
    a.addEventListener('click', openModal);
});


window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
});


function toggleCrossIcon() {
    let figures = document.querySelectorAll('.modal-gallery figure');
    figures.forEach(figure => {
        figure.addEventListener('click', function () {
            const crossIcon = figure.querySelector('.icon-cross')
            figures.forEach(figure => { figure.querySelector('.icon-cross').classList.add('icon-toggle') });
            crossIcon.classList.toggle('icon-toggle');
        })
    });
}


let bearer = sessionStorage.getItem('accessToken');


const requestDeleteOptions = {
    method: 'DELETE',
    headers: { "Authorization": `Bearer ${bearer}` },
};

async function deleteWorks() {
    
    document.querySelectorAll('.modal-gallery .icon-trash').forEach(icon => {
        icon.addEventListener('click', async function () {
            let idToDelete = icon.dataset.workId;
            await fetch(`http://localhost:5678/api/works/${idToDelete}`, requestDeleteOptions);
            alert(`Le projet n°${idToDelete} a été supprimé`);
            await fetchWorks();
            generateWorks(works);
        })
    });
}

async function deleteAllWorks() {
    document.querySelector('.modal-delete').addEventListener('click', async function () {
        let confirmation = confirm('Êtes-vous sûr de vouloir supprimer toute la galerie ?')
        if (confirmation) {
            for (let i = 0; i < works.length; i++) {
                await fetch(`http://localhost:5678/api/works/${i + 1}`, requestDeleteOptions);
            }
            await fetchWorks();
            generateWorks(works);
        }
    });
}

const modalSwitch = function (valeur1, valeur2) {
    document.querySelector('#modal .modal1').style.display = valeur1;
    document.querySelector('#modal .modal2').style.display = valeur2;
};

function modalSwitchEvent() {
    document.querySelector('#modal .modal1 input').addEventListener('click', function (input) {
        input.preventDefault();
        modalSwitch('none', 'flex');
    })
    document.querySelector('#modal .modal2 .fa-arrow-left').addEventListener('click', function () {
        modalSwitch(null, null);
    })
}


const previewImage = function (e) {
    const image = document.querySelector("img.image-preview");
      
    const [picture] = e.files;
    
    if (picture) {
        
        let reader = new FileReader();
        
        reader.onload = function (e) {
            if (picture.size > 4194304) {
                alert('Fichier trop volumineux !');
                image.src = "";
                return;
            } else {
                
                image.src = e.target.result;
            }
        };
        
        reader.readAsDataURL(picture);
    }
};


function generateCategoryOptions() {
    const select = document.querySelector('#category');
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        const optionList = document.createElement('option');
        optionList.innerText = category.name;
        optionList.setAttribute('value', category.name);
       
        if (select) {
            select.appendChild(optionList);
        }
    }
}


function validate() {
    document.forms["add-works"].addEventListener('change', async function () {
        let inputs = this.getElementsByTagName('input');
        let select = this.querySelector('#add-works #category');
        let validateBtn = document.getElementById('validate');
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value || select.value == 'empty') {
                validateBtn.style.backgroundColor = "#A7A7A7";
                return;
            } else {
                validateBtn.style.backgroundColor = null;
            }
        };
    });
};


async function addWorks() {
    document.forms["add-works"].addEventListener('submit', async function (event) {
        event.preventDefault();
        let inputs = this.getElementsByTagName('input');
        let select = this.querySelector('#add-works #category');
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value || select.value == 'empty') {
                document.getElementById("error").innerHTML = 'Veuillez renseigner tous les champs';
                return;
            };
        };
        const formValue = {
            image: this.querySelector('#add-works #image').files[0],
            title: this.querySelector('#add-works #title').value,
            category: select.selectedIndex
        };
        
        const formData = new FormData();
        formData.append("image", formValue.image);
        formData.append("title", formValue.title);
        formData.append("category", formValue.category);
        
        const requestAddWorksOptions = {
            method: 'POST',
            headers: { "Authorization": `Bearer ${bearer}` },
            body: formData
        };
        
        
        const responseAddWorks = await fetch('http://localhost:5678/api/works', requestAddWorksOptions);
        if (responseAddWorks.ok) {
            await fetchWorks();
            generateWorks(works);
            alert('Ajout du projet réalisé avec succès');
            modalSwitch(null, null);
            this.reset();
            document.querySelector("img.image-preview").src = "";
            document.getElementById("error").innerHTML = "";
        };
    });
};

export {
    modal,
    deleteWorks,
    toggleCrossIcon
};