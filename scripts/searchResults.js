// import { renderImages } from "../app";

import { renderImages } from "./modules/renderImage.mjs";

const imgGallery = document.querySelector('.img-gallery');
const searchForm = document.getElementById('search-form');
const searchFormInput = document.getElementById('search-form-input');
const searchResultTitle = document.getElementById('search-result-title');

const urlParams = new URLSearchParams(window.location.search);

const BASE_URL = 'https://api.unsplash.com/';
const searchQuery = urlParams.get('query');

searchResultTitle.textContent = decodeURI(searchQuery);

const SEARCH_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=${searchQuery}&per_page=20`;


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

let images = [];

fetchResults().then((data) => {
    images = [...data];
    renderImages(imgGallery, images);
}).catch((err) => {
    console.error("ERROR: ", err);
});


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchQuery = searchFormInput.value.trim();
    const url = `/pages/results.html?query=${encodeURIComponent(searchQuery)}`;
    window.location.href = url;
});