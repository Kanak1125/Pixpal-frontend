import { renderImages } from "./scripts/modules/renderImage.mjs";
import createObserver from "./scripts/modules/observer.mjs";
import fetchData from "./scripts/modules/fetchData.mjs";
import handleMainFilterBtn from "./scripts/modules/handleMainFilterBtn.mjs";

// const hamburgerIcon = document.querySelector('.hamburger-icon');
const dialogMenuModal = document.querySelector('.menu-modal');
const tagScrollerLeft = document.querySelector('.tag-scroller-left');
const tagScrollerRight = document.querySelector('.tag-scroller-right');
const navTagContainer = document.querySelector('.nav-tag-container');
const tagsContainer = document.querySelector('.tags-container');
const imgGallery = document.querySelector('.img-gallery');

let filterInputLabels = document.querySelectorAll('.filter-input-label');
let filterInputOptions = document.querySelectorAll('.filter-input-option');
const filterOrientation = document.querySelectorAll('.filter-orientation');
const filterFileType = document.querySelectorAll('.filter-file-type');
const filterColors = document.querySelectorAll('.filter-input-label-color');

const clearAllFilterBtns = document.querySelectorAll('.clear-all-btn');

const tags = ['nature', 'space', 'world', 'food', 'tech', 'dark', 'place', 'mountain', 'green', 'animals', 'aliens', 'pets', 'annimals'];

let target;
let filter_url = '';

const WIN_PADDING = 40;
const SCROLL_UNIT = 200;

let pageCount = 1;
let pageCountFilter = 1;

// currently the following are working...
let skip = 0;
const PER_PAGE = 5;

window.onload = () => {
    skip = 0;
};

let images = [];
const BASE_URL = 'https://api.unsplash.com/';
// const FILTER_BASE_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=random&per_page=20`;
const FILTER_BASE_URL = `http://127.0.0.1:8000/api/search/photos?q=all`;

// const REQUEST_URL = `${BASE_URL}photos/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY`;
const REQUEST_URL = `http://127.0.0.1:8000/api/images/`;
const SEARCH_BASE_URL = '/pages/results.html?query=';
// let updated_request_url = `${REQUEST_URL}?skip=${skip}&limit=${PER_PAGE}`;

// const REQUEST_URL_WITH_FILTERS = `${BASE_URL}/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=nature&orientation=landscape&page=${pageCount}`;

tags.forEach(tag => {
    const tagLink = document.createElement('a');
    tagLink.textContent = tag;
    tagLink.href = `${SEARCH_BASE_URL}${tag}`;
    tagsContainer.appendChild(tagLink);
})

handleMainFilterBtn();

window.addEventListener('resize', () => {
    filterInputLabels = document.querySelectorAll('.filter-input-label');
    filterInputOptions = document.querySelectorAll('.filter-input-option');
});

// hamburgerIcon.addEventListener('click', () => {
//     hamburgerIcon.classList.toggle('ham-active');
//     dialogMenuModal.classList.toggle('open');
// });

const totalLengthNavBottom = navTagContainer.scrollWidth;

tagScrollerLeft.classList.remove('show');
tagScrollerRight.classList.add('show');

navTagContainer.onscroll = () => {
    if (navTagContainer.scrollLeft > 0) {
        tagScrollerLeft.classList.add('show');
    } else {
        tagScrollerLeft.classList.remove('show');
    }

    if (navTagContainer.scrollLeft + window.innerWidth - WIN_PADDING > totalLengthNavBottom) {
        tagScrollerRight.classList.remove('show');

    } else {
        tagScrollerRight.classList.add('show');
    }
}

tagScrollerRight.addEventListener('click', () => {
    let currentPositionX = navTagContainer.scrollLeft;
    const newScrollPosition = currentPositionX + SCROLL_UNIT;

    navTagContainer.scrollTo(newScrollPosition, 0);
});

tagScrollerLeft.addEventListener('click', () => {
    let currentPositionX = navTagContainer.scrollLeft;
    const newScrollPosition = currentPositionX - SCROLL_UNIT;

    navTagContainer.scrollTo(newScrollPosition, 0);
});

const observerFilter = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
        console.log(entry);
        if (entry.isIntersecting) {
            pageCountFilter ++;
            const updatedRequestUrl = `${filter_url}&page=${pageCountFilter}`;
            filterImages(updatedRequestUrl);

            observerFilter.unobserve(target);
        }
    })
}, {
    threshold: 0.5,
});

const observerMainPage = createObserver(target, REQUEST_URL, skip, PER_PAGE, getRandomImages);

async function getRandomImages(url) {
    let newImages = [];
    
    if (images.length === 0) {
        newImages = await fetchData(url);
        images = [...await newImages];
    } else {
        // observer.unobserve(target);
        console.log("NEw Images", await fetchData(url));
        newImages = [...await fetchData(url)];
        images = [...images, ...newImages];
    }
    console.log("Images: ", images);

    console.log(newImages);

    console.log("NEW IMAGES ========>", newImages);
    renderImages(imgGallery, newImages);
    
    const imgContainers = document.querySelectorAll('.img-container');
    
    target = imgContainers[imgContainers.length - 1];

    setTimeout(() => {
        observerMainPage.observe(target);
    }, 3000);
}

// getRandomImages(`${REQUEST_URL}&page=${pageCount}`);
getRandomImages(REQUEST_URL);
// getRandomImages(`http://127.0.0.1:5501/images/`);

let previousElement = {};

async function filterImages (url) {
    let newImages = [];
    
    if (images.length === 0) {
        newImages = await fetchData(url);
        images = [...await newImages];
    } else {
        // observer.unobserve(target);
        const result = await fetchData(url);
        newImages = [...await result];
        images = [...images, ...newImages];
    }
    console.log(images);

    console.log(newImages);

    renderImages(imgGallery, newImages);

    target = imgGallery.lastChild;
    console.log("Target: ", target);

    // setTimeout(() => {
    //     observerFilter.observe(target);
    // }, 3000);
}

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
        // if (previousElement[filterName]) {
        //     previousElement[filterName].classList.remove('filter-active');
        // }
        // const previousFilterLabel = Array.from(filterInputLabels).find(label => label.name === previousElement[filterName]);
        // console.log("Previous label >>>>>>", previousFilterLabel);
        console.log("Previous elements:", previousElement);

        // remove the child until there is firstChild left in image Gallery...
        clearImageGallery();
        
        if (item.checked) {
            filterInputLabels[idx].classList.add('filter-active');
            // previousElement[filterName] = filterInputLabels[idx];
            previousElement[filterName] = filterValue;

            console.log("From checkbox listener::::>>>", item.value);

            filter_url = `${FILTER_BASE_URL}${previousElement['filter-orientation'] ? `&orientation=${previousElement['filter-orientation']}` : ''}`;

            filter_url = `${filter_url}${previousElement['filter-color'] ? `&color=${previousElement['filter-color']}` : ''}`

            filter_url = `${filter_url}${previousElement['filter-file'] ? `&color=${previousElement['filter-file']}` : ''}`

            // if (previousElement['filter-color']) {
            //     filter_url += `&color=${previousElement['filter-color']}`
            // }
        } else {
            filter_url = FILTER_BASE_URL;
            filterInputLabels[idx].classList.remove('filter-active');
        }
        const data = await fetchData(filter_url);
        images = data;
        console.log(data);
        filterImages(filter_url);
    });
});

clearAllFilterBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        previousElement = {};
        clearImageGallery();
        console.log("PREVIOUS =========>", previousElement);
        getRandomImages(REQUEST_URL);
    })
});

fetch('http://127.0.0.1:8000/api/images').then(res => res.json()).then(data => console.log("Data is here ====> ", data));

// filterInputOptions.forEach((item, idx) => {
//     item.addEventListener('click', async () => {
//         console.log(filterInputLabels[idx], item);
//         const filterValue = item.value;
//         images = [];

//         while(imgGallery.firstChild) {
//             imgGallery.removeChild(imgGallery.lastChild);
//         }
        
//         if (item.checked) {
//             console.log("From checkbox listener", item.value);
//             filter_url = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=random&per_page=20&orientation=${filterValue}`;
//             filterInputLabels[idx].classList.add('filter-active');
//             const data = await fetchData(filter_url);
//             images = data.results;
//             console.log(data);
//             filterImages(filter_url);
//         } else {
//             filter_url = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=random&per_page=20`;
//             filterInputLabels[idx].classList.remove('filter-active');
//             const data = await fetchData(filter_url);
//             console.log(data);
//             images = data.results;
//             filterImages(filter_url);
//         }
//     })
// });