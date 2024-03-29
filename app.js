import { renderImages } from "./scripts/modules/renderImage.mjs";

// const hamburgerIcon = document.querySelector('.hamburger-icon');
const dialogMenuModal = document.querySelector('.menu-modal');
const tagScrollerLeft = document.querySelector('.tag-scroller-left');
const tagScrollerRight = document.querySelector('.tag-scroller-right');
const navTagContainer = document.querySelector('.nav-tag-container');
const tagsContainer = document.querySelector('.tags-container');
const imgGallery = document.querySelector('.img-gallery');

const searchForm = document.getElementById('search-form');
const searchFormInput = document.getElementById('search-form-input');
// const imgGallerySubGrid1 = document.querySelector('.img-gallery-sub-grid-1');
// const imgGallerySubGrid2 = document.querySelector('.img-gallery-sub-grid-2');
// const imgGallerySubGrid3 = document.querySelector('.img-gallery-sub-grid-3');
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

const tags = ['nature', 'space', 'world', 'food', 'tech', 'dark', 'place', 'mountain', 'green', 'animals', 'aliens', 'pets', 'annimals'];

// the following is api end-point is for the searching...
// const BASE_URL = 'https://api.unsplash.com/search/photos'

// the api end-point for the random photo filter...
// const BASE_URL = 'https://api.unsplash.com/search/photos'

let images = [];
const BASE_URL = 'https://api.unsplash.com/';
const FILTER_BASE_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=random&per_page=20`;

const REQUEST_URL = `${BASE_URL}photos/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY`;
const SEARCH_BASE_URL = '/pages/results.html?query=';
// const REQUEST_URL_WITH_FILTERS = `${BASE_URL}/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&query=nature&orientation=landscape&page=${pageCount}`;

let target;
let filter_url = '';

tags.forEach(tag => {
    const tagLink = document.createElement('a');
    tagLink.textContent = tag;
    tagLink.href = `${SEARCH_BASE_URL}${tag}`;
    tagsContainer.appendChild(tagLink);
})

mainFilterCloseBtn.addEventListener('click', () => {
    mainFilterContainer.style.display = "none";
    mainContainer.classList.remove('add-grid');
    console.log(filtersBtn);
    filtersBtn.classList.remove('hide-filters-btn');
});

filtersBtn.addEventListener('click', () => {
    mainFilterContainer.style.display = "block";
    mainContainer.classList.add('add-grid');
    console.log(filtersBtn);
    filtersBtn.classList.add('hide-filters-btn');
});

window.addEventListener('resize', () => {
    filterInputLabels = document.querySelectorAll('.filter-input-label');
    filterInputOptions = document.querySelectorAll('.filter-input-option');
});

const WIN_PADDING = 40;
const SCROLL_UNIT = 200;

let pageCount = 1;
let pageCountFilter = 1;

// hamburgerIcon.addEventListener('click', () => {
//     hamburgerIcon.classList.toggle('ham-active');
//     dialogMenuModal.classList.toggle('open');
// });

const totalLengthNavBottom = navTagContainer.scrollWidth;

tagScrollerLeft.classList.remove('show');
tagScrollerRight.classList.add('show');

navTagContainer.onscroll = () => {
    console.log("scrolling...");

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

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchQuery = searchFormInput.value.trim();
    const url = `${SEARCH_BASE_URL}${encodeURIComponent(searchQuery)}`;
    window.location.href = url;
});

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
        // return data.results;
    } catch (err) {
        console.error("Error while fetching the data: ", err);
        return;
    }
}

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
        console.log(entry);
        if (entry.isIntersecting) {
            pageCount ++;

            const updatedRequestUrl = `${REQUEST_URL}&page=${pageCount}`;
            getRandomImages(updatedRequestUrl);

            observer.unobserve(target);
        }
    })
}, {
    threshold: 1.0,
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
    threshold: 1.0,
});

// let prevImageCount = 0;

// the function to render the images in DOM...
// export 

// const renderImagesNew = ({columnCount, columnData}) => {

//     console.log("column count is: ",columnCount)
//     console.log("Data based on column count is \: ",columnData)
//     let prevImgCounter = 0;

//     columnData.map((col, idx) =>{
//         let imgCounter = 0;
//         imgSubCol = document.createElement('div');
//         imgSubCol.classList.add('sub-column');

        
//         col.map((data, i) => {
//             if (data !== undefined) {
//                 const imgContainer = document.createElement('figure');
//                 const imgOverlay = document.createElement('div');
//                 const imgElement = document.createElement('img');
//                 const imgFooter = document.createElement('div');
//                 const userDetailContainer = document.createElement('div');
//                 const profilePic = document.createElement('img');
//                 const userName = document.createElement('p');
//                 const downloadBtn = document.createElement('a');
//                 const imageNumberTag = document.createElement('div');
        
//                 imgContainer.classList.add('img-container');
//                 imgOverlay.classList.add('img-overlay');
//                 imgElement.classList.add('img');
//                 imgFooter.classList.add('img-footer');
//                 userDetailContainer.classList.add('user-detail-container');
//                 profilePic.classList.add('profile-pic');
//                 userName.classList.add('user-name');
//                 downloadBtn.classList.add('btn', 'download-btn');
//                 imageNumberTag.classList.add('image-number-tag');
        
//                 profilePic.src = data.user.profile_image.large;
//                 userName.textContent = data.user.username;
//                 downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'
        
//                 imageNumberTag.textContent = ++imgCounter;
        
//                 imgElement.setAttribute('src', data.urls.small);
//                 userDetailContainer.appendChild(profilePic)
//                 userDetailContainer.appendChild(userName)
//                 imgFooter.appendChild(userDetailContainer);
//                 imgFooter.appendChild(downloadBtn);
//                 imgOverlay.appendChild(imgFooter);
//                 imgContainer.appendChild(imgOverlay);
//                 imgContainer.appendChild(imgElement);
//                 imgContainer.appendChild(imageNumberTag);
//                 imgSubCol.appendChild(imgContainer);
//             }
//         });

//         imgGallery.appendChild(imgSubCol);
//     }) 
// }


const getRandomImages = async (url) => {
    let newImages = [];
    // let tempArr = images;
    // images = [];

    // while (imgGallery.firstChild) {
    //     imgGallery.removeChild(imgGallery.lastChild);
    // }
    
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

    // let columnCount = parseInt(getComputedStyle(document.getElementById('img-gallery')).columnCount)

    // let columnBasedDataSet = [];

    // console.log("Array of 3", Array.from(new Array(columnCount)));
    
    // Array.from(new Array(columnCount)).map((c, idx) =>{
    //     let columnImgArr = requiredImageData.filter(item => {
    //         return idx + columnCount;
    //     });
        
    //     columnBasedDataSet.push(columnImgArr);
    // })

    // console.log("New test", Array.from(new Array(columnCount)));
    // for (let i = 0; i < Array.from(new Array(columnCount)).length; i++) {
    //     let newArr = [];
    //     for (let j = 0; j < requiredImageData.length; j ++) {
    //         if (j % columnCount === 0) {
    //             newArr.push(requiredImageData[i + j]);
    //         }
    //     }
    //     columnBasedDataSet.push(newArr);
    // }

    // renderImagesNew({columnCount:columnCount, columnData:columnBasedDataSet});
    renderImages(imgGallery, requiredImageData);

    // prevImageCount += 10;
    
    // imgGallery.appendChild(imgGallerySubGrid1);
    // imgGallery.appendChild(imgGallerySubGrid2);
    // imgGallery.appendChild(imgGallerySubGrid3);

    // target = imgGallerySubGrid3.lastChild;
    // target = imgGallery.lastChild.lastChild;
    target = imgGallery.lastChild;
    console.log(target);

    // setTimeout(() => {
    //     observer.observe(target);
    // }, 3000);
}

getRandomImages(`${REQUEST_URL}&page=${pageCount}`);

const filterIcon = document.querySelector('.filter-icon');
const filterModal = document.querySelector('.modal-filter');
const modalCloseBtn = document.querySelector('.close-btn');

filterIcon.addEventListener('click', () => {
    filterModal.showModal();
    document.body.style.overflow = "hidden";
})

modalCloseBtn.addEventListener('click', () => {
    filterModal.close();
    document.body.style.overflow = "scroll";
});

let previousElement = {};

const filterImages = async (url) => {
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