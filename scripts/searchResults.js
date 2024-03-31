// import { renderImages } from "../app";
import { renderImages } from "./modules/renderImage.mjs";
import handleMainFilterBtn from "./modules/handleMainFilterBtn.mjs";
import fetchData from "./modules/fetchData.mjs";

const imgGallery = document.querySelector('.img-gallery');
const searchForm = document.getElementById('search-form');
const searchFormInput = document.getElementById('search-form-input');
const searchResultTitle = document.getElementById('search-result-title');
const noResultsInfo = document.querySelector('.no-results-info');
let filterInputLabels = document.querySelectorAll('.filter-input-label');
let filterInputOptions = document.querySelectorAll('.filter-input-option');
const filterOrientation = document.querySelectorAll('.filter-orientation');
const filterFileType = document.querySelectorAll('.filter-file-type');
const filterColors = document.querySelectorAll('.filter-input-label-color');
const mainFilterCloseBtn = document.querySelector('.main-filter-close-btn');
const mainFilterContainer = document.querySelector('.main-filter-container');
const mainContainer = document.querySelector('.container');
const filtersBtn = document.querySelector('.filters-btn');
const clearAllFilterBtns = document.querySelectorAll('.clear-all-btn');

const urlParams = new URLSearchParams(window.location.search);

const BASE_URL = 'https://api.unsplash.com/';
const searchQuery = urlParams.get('query');

searchResultTitle.textContent = decodeURI(searchQuery);

const SEARCH_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=${searchQuery}&per_page=20`;
let images = [];
let previousElement = {}; 
let pageCountFilter = 1;
const FILTER_BASE_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=${searchQuery}&per_page=20`;
let target;
let filter_url = '';

const fetchResults = async () => {
    try {
        const response = await fetch(SEARCH_URL);
        const data = await response.json();
        console.log(data);
        return data.results;
    } catch (err) {
        console.error("Error while searching...", err);
    }
}

handleMainFilterBtn();

const observerFilter = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
        console.log(entry);
        if (entry.isIntersecting) {
            pageCountFilter ++;
            const updatedRequestUrl = `${filter_url}&page=${pageCountFilter}`;
            filterImages(updatedRequestUrl);
            console.log(target);
            observerFilter.unobserve(target);
        }
    })
}, {
    threshold: 0.1,
});

async function filterImages (url) {
    let newImages = [];
    
    if (images.length === 0) {
        newImages = await fetchData(url);
        images = [...await newImages.results];
    } else {
        // observer.unobserve(target);
        const result = await fetchData(url);
        newImages = [...await result.results];
        images = [...images, ...newImages];
    }
    console.log(images);

    // filter out only the needed data...
    const requiredImageData = newImages.map(item => ({
        id: item.id,
        user: item.user,
        description: item.description,
        alt_description: item.alt_description,
        created_at: item.created_at,
        width: item.width,
        height: item.height,
        urls: item.urls,
        blur_hash: item.blur_hash,
    }));

    console.log(requiredImageData);

    renderImages(imgGallery, requiredImageData);

    target = imgGallery.lastChild;
    console.log(target);

    setTimeout(() => {
        observerFilter.observe(target);
    }, 3000);
    // observerFilter.observe(target);
}
// setTimeout(() => {
//     observerFilter.observe(target);
// }, 3000);


fetchResults().then((data) => {
    images = [...data];
    renderImages(imgGallery, images);
    if (images.length === 0) {
        noResultsInfo.style.display = "block";
        noResultsInfo.textContent = "No results...";
    } else {
        noResultsInfo.style.display = "none";
    }
}).catch((err) => {
    console.error("ERROR: ", err);
});


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchQuery = searchFormInput.value.trim();
    const url = `/pages/results.html?query=${encodeURIComponent(searchQuery)}`;
    window.location.href = url;
});

const removeActiveClass = () => {
    filterInputLabels.forEach((element, idx) => {
        if(filterInputOptions[idx].value != previousElement[filterInputOptions.name]) {
            element.classList.remove('filter-active');
        }
    })
};

const clearImageGallery = () => {
    while(imgGallery.firstChild) {
        imgGallery.removeChild(imgGallery.lastChild);
    };
};

filterInputOptions.forEach((item, idx) => {
    item.addEventListener('click', async () => {
        console.log(filterInputLabels[idx], item);
        const filterName = filterInputOptions[idx].getAttribute('name');
        const filterValue = item.value; // brings the value of the item that is clicked on... for eg. "red" when the input type with name "filter-color" is clicked...
        removeActiveClass();
        images = [];
        pageCountFilter = 1;

        console.log("Filter map: ", previousElement);
        console.log("Previous elements:", previousElement);

        // remove the child until there is firstChild left in image Gallery...
        clearImageGallery();
        
        if (item.checked) {
            filterInputLabels[idx].classList.add('filter-active');
            previousElement[filterName] = filterValue;

            console.log("From checkbox listener::::>>>", item.value);

            filter_url = `${FILTER_BASE_URL}${previousElement['filter-orientation'] ? `&orientation=${previousElement['filter-orientation']}` : ''}`;

            if (previousElement['filter-color']) {
                filter_url += `&color=${previousElement['filter-color']}`
            }
        } else {
            filter_url = FILTER_BASE_URL;
            filterInputLabels[idx].classList.remove('filter-active');
        }
        const data = await fetchData(filter_url);
        images = data.results;
        console.log(data);
        filterImages(filter_url, images);
    });
});

clearAllFilterBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        previousElement = {};
        clearImageGallery();
        console.log("PREVIOUS =========>", previousElement);
        filterImages(FILTER_BASE_URL);
    })
});