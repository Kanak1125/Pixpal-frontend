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
let skip_filter = 0;

window.onload = () => {
    skip = 0;
};

let images = [];
// const BASE_URL = 'https://api.unsplash.com/';
// const FILTER_BASE_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=random&per_page=20`;
// const FILTER_BASE_URL = `http://127.0.0.1:8000/api/search/photos?q=all`;
const FILTER_BASE_URL = `http://${window.location.hostname}:8000/api/search/photos?q=all`;

// const REQUEST_URL = `${BASE_URL}photos/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY`;
const REQUEST_URL = `http://${window.location.hostname}:8000/api/images/`
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
        console.warn("Current filter URL ====> ", filter_url);
        if (entry.isIntersecting) {
            skip_filter += PER_PAGE;

            const updatedRequestUrl = `${filter_url}?skip=${skip_filter}&limit=${PER_PAGE}`;
            filterImages(updatedRequestUrl);

            if (target) observerFilter.unobserve(target);
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
        observerMainPage.unobserve(target);
        console.log("NEw Images", await fetchData(url));
        newImages = [...await fetchData(url)];
        images = [...images, ...newImages];

        if (newImages.length == 0) return;  // if there is no more images, no need to observer...
    }

    renderImages(imgGallery, newImages);
    
    const imgContainers = document.querySelectorAll('.img-container');
    
    
    setTimeout(() => {
        target = imgContainers[imgContainers.length - 1];
        console.log("Current target from the called page ====> ", target);

        const observer = observerMainPage;
        console.log("Observer here ====> ", observer);
        observer.observe(target);
    }, 3000);
}

// getRandomImages(`${REQUEST_URL}&page=${pageCount}`);
getRandomImages(REQUEST_URL);
// getRandomImages(`http://127.0.0.1:5501/images/`);

let previousElement = {};

async function filterImages (url) {
    let newImages = [];

    observerMainPage.unobserve(target);

    if (images.length === 0) {
        newImages = await fetchData(url);
        images = [...await newImages];
    } else {
        observerFilter.unobserve(target);
        const result = await fetchData(url);
        newImages = [...await result];
        images = [...images, ...newImages];
    }
    console.log(images);

    console.log(newImages);

    renderImages(imgGallery, newImages);

    const imgContainers = document.querySelectorAll('.img-container');
    
    setTimeout(() => {
        target = imgContainers[imgContainers.length - 1];
        console.log("Target FROM The filter observer =====> ", target);
        observerFilter.observe(target);
    }, 3000);
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
        // observerMainPage.unobserve(target);
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

            filter_url = `${filter_url}${previousElement['filter-file-type'] ? `&file_type=${previousElement['filter-file-type']}` : ''}`

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
    btn.addEventListener('click', () => {
        // observerMainPage.observe(target);

        previousElement = {};
        clearImageGallery();
        skip_filter = 0;
        console.log("PREVIOUS =========>", previousElement);
        getRandomImages(REQUEST_URL);
        
        filterInputOptions.forEach(option => {
            if (option.checked) {
                option.checked = false;
            }
        })
    })
});