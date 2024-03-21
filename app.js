const hamburgerIcon = document.querySelector('.hamburger-icon');
const dialogMenuModal = document.querySelector('.menu-modal');
const tagScrollerLeft = document.querySelector('.tag-scroller-left');
const tagScrollerRight = document.querySelector('.tag-scroller-right');
const navBottom = document.querySelector('.nav-bottom');
const tagsContainer = document.querySelector('.tags-container');
const imgGallery = document.querySelector('.img-gallery');

hamburgerIcon.addEventListener('click', () => {
    hamburgerIcon.classList.toggle('ham-active');
    dialogMenuModal.classList.toggle('open');
});

const scrollUnit = 200;
const totalLengthNavBottom = navBottom.scrollWidth;

tagScrollerLeft.style.display = 'none';

tagScrollerRight.addEventListener('click', () => {
    let currentPositionX = navBottom.scrollLeft;
    const newScrollPosition = currentPositionX + scrollUnit;

    navBottom.scrollTo(newScrollPosition, 0);

    // if (currentPositionX + window.innerWidth > totalLengthNavBottom) {
    //     tagScrollerRight.style.display = "none";
    // }
    tagScrollerLeft.style.display = 'block';

    console.log(currentPositionX + window.innerWidth, totalLengthNavBottom);
});

tagScrollerLeft.addEventListener('click', () => {
    let currentPositionX = navBottom.scrollLeft;
    const newScrollPosition = currentPositionX - scrollUnit;

    // console.log("new scrolll pos" + newScrollPosition)
    // if (newScrollPosition < 500) tagScrollerLeft.style.display = 'none';

    navBottom.scrollTo(newScrollPosition, 0);

    if (currentPositionX === 0) {
        tagScrollerLeft.style.display = 'none';
    } else {
        tagScrollerLeft.style.display = 'block';
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

        imgGallery.appendChild(imgContainer);
    }
}

renderImages();