import './sass/main.scss';
import Notiflix from 'notiflix';

import renderCard from './templase/markup.hbs';

import { apiServer } from './js/apiServer.js'

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import getRefs from './js/get-refs';

const refs = getRefs();
const ApiServer = new apiServer();

Notiflix.Notify.init({
    useIcon: false,
    cssAnimationStyle: 'from-right',
});

refs.searchForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();
    ApiServer.serchQuery = event.currentTarget.elements.searchQuery.value;

    if (ApiServer.serchQuery === '') {
        Notiflix.Notify.failure('Please, enter text!!!')
        return;
    };

    ApiServer.resetPage();

    ApiServer.fetchAxios()
    .then(response => {

        try {
            const hits = response.data.hits;
            if (hits.length === 0) {
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            }
    
        renderCardMarkup(hits);

        } catch (error) {
            console.log(error);
            Notiflix.Notify.failure('Error, something went wrong');
        }})
    .finally(refs.searchForm.reset());

    clearPage();

}

function clearPage() {
    refs.galleryList.innerHTML = '';
}

function renderCardMarkup(response) {
    refs.galleryList.insertAdjacentHTML('beforeend', renderCard(response));
    lightbox.refresh();
}


const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && ApiServer.serchQuery !== '') {
            ApiServer.fetchAxios().then(response => {
                const hits = response.data.hits
                renderCardMarkup(hits);
            })
        }
    });
}


const options = {
    rootMargin: '200px'
}


const observer = new IntersectionObserver(onEntry, options)

observer.observe(refs.galleryElem);

const lightbox = new SimpleLightbox(".galleryList a", {
    captionSelector: "img", 
    captionPosition: "bottom", 
    captionDelay: 250, 
    showCounter: false, 
    scrollZoom: false,
});


