import './sass/main.scss';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let galleryLightBox;

import getRefs from './js/get-refs';
const refs = getRefs();

import photoCardsMarkup from './templase/markup.hbs';
import ApiService from './js/apiServer';

Notify.init({
    useIcon: false,
    cssAnimationStyle: 'from-right',
});

const apiService = new ApiService();

const observerOptions = {
    rootMargin: '150px',
};

const observer = new IntersectionObserver(onScroll, observerOptions);
observer.observe(refs.galleryElem);

refs.searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {
    try {
        event.preventDefault();

        apiService.searchQuery = event.currentTarget.elements.searchQuery.value.trim();
        apiService.resetPage();
        if (apiService.searchQuery === '') return;

        const images = await apiService.fetchAxios();
        const { hits, totalHits } = images;

        if (hits.length !== 0) {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            refs.galleryElem.style.display = 'block';
        }

        renderImageMarkup(hits);
    } catch (error) {
        console.log(error.message);
    }
}

async function onScroll(entries) {
    entries.forEach(async entry => {
        try {
            if (entry.isIntersecting && apiService.searchQuery !== '') {
            const images = await apiService.fetchAxios();
            const { hits, totalHits } = images;
            const maxPage = totalHits / 40;

            renderImageCardMarkup();
            smoothScroll();

            if (apiService.page - 1 > maxPage) {
                Notify.info("We're sorry, but you've reached the end of search results.");
                refs.galleryElem.style.display = 'none';
            }
        }
        } catch (error) {
            console.log(error.message);
        }
    });
}

function renderImageCardMarkup(hits) {
    refs.galleryList.insertAdjacentHTML('beforeend', photoCardsMarkup(hits));
    galleryLightBox.refresh();
}

function renderImageMarkup(images) {
    if (images.length === 0) {
        clearPage();
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    }

    refs.galleryList.innerHTML = photoCardsMarkup(images);

   //galleryLightBox
    galleryLightBox = new SimpleLightbox('.gallery-list a', {
        captionDelay: 250,
        captionSelector: "img", 
        captionPosition: "bottom", 
        showCounter: false, 
        scrollZoom: false,
        overlayOpacity: 0.2,
    });

}

function clearPage() {
    refs.galleryList.innerHTML = '';
}

//Прокрутка страницы
function smoothScroll() {
    const { height: cardHeight } = document
        .querySelector('.gallery-list')
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}