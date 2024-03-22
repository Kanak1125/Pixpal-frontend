// const hamburgerIcon = document.querySelector('.hamburger-icon');
const dialogMenuModal = document.querySelector('.menu-modal');
const tagScrollerLeft = document.querySelector('.tag-scroller-left');
const tagScrollerRight = document.querySelector('.tag-scroller-right');
const navTagContainer = document.querySelector('.nav-tag-container');
const tagsContainer = document.querySelector('.tags-container');
const imgGallery = document.querySelector('.img-gallery');
const imgGallerySubGrid1 = document.querySelector('.img-gallery-sub-grid-1');
const imgGallerySubGrid2 = document.querySelector('.img-gallery-sub-grid-2');
const imgGallerySubGrid3 = document.querySelector('.img-gallery-sub-grid-3');

// hamburgerIcon.addEventListener('click', () => {
//     hamburgerIcon.classList.toggle('ham-active');
//     dialogMenuModal.classList.toggle('open');
// });

const scrollUnit = 200;
const totalLengthNavBottom = navTagContainer.scrollWidth;

tagScrollerLeft.style.display = 'none';

tagScrollerRight.addEventListener('click', () => {
    let currentPositionX = navTagContainer.scrollLeft;
    const newScrollPosition = currentPositionX + scrollUnit;

    navTagContainer.scrollTo(newScrollPosition, 0);

    // if (currentPositionX + window.innerWidth > totalLengthNavBottom) {
    //     tagScrollerRight.style.display = "none";
    // }
    tagScrollerLeft.style.display = 'flex';

    console.log(currentPositionX + window.innerWidth, totalLengthNavBottom);
});

tagScrollerLeft.addEventListener('click', () => {
    let currentPositionX = navTagContainer.scrollLeft;
    const newScrollPosition = currentPositionX - scrollUnit;

    // console.log("new scrolll pos" + newScrollPosition)
    // if (newScrollPosition < 500) tagScrollerLeft.style.display = 'none';

    navTagContainer.scrollTo(newScrollPosition, 0);

    if (currentPositionX === 0) {
        tagScrollerLeft.style.display = 'none';
    } else {
        tagScrollerLeft.style.display = 'flex';
    }
    // if (currentPositionX + window.innerWidth > totalLengthNavBottom) {
    //     tagScrollerRight.style.display = "none";
    // }
    console.log(currentPositionX + window.innerWidth, totalLengthNavBottom);
});

let images = [];
const BASE_URL = 'https://api.unsplash.com/'
const REQUEST_URL = `${BASE_URL}photos/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY`;

const fetchData = async () => {
    const response = await fetch(REQUEST_URL);
    const data = await response.json();
    return data;
}

const renderImages = async () => {
    const images = await fetchData();
    console.log(images);

    // filter out only the needed data...
    const requiredImageData = images.map(item => ({
        id: item.id,
        user: item.user,
        description: item.description,
        alt_description: item.alt_description,
        created_at: item.created_at,
        width: item.width,
        height: item.height,
        urls: item.urls,
    }));

    console.log(requiredImageData);

    for (let i = 0; i < requiredImageData.length; i++) {
        const imgContainer = document.createElement('div');
        const imgElement = document.createElement('img');

        imgContainer.classList.add('img-container');
        imgElement.classList.add('img');

        imgElement.setAttribute('src', requiredImageData[i].urls.small);
        imgContainer.appendChild(imgElement);

        if (i < 4) {
            imgGallerySubGrid1.appendChild(imgContainer);
        } else if (i < 8) {
            imgGallerySubGrid2.appendChild(imgContainer);
        } else {
            imgGallerySubGrid3.appendChild(imgContainer);
        }

        // imgGallery.appendChild(imgContainer);
        imgGallery.appendChild(imgGallerySubGrid1);
        imgGallery.appendChild(imgGallerySubGrid2);
        imgGallery.appendChild(imgGallerySubGrid3);
    }
}

renderImages();