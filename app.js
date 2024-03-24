// const hamburgerIcon = document.querySelector('.hamburger-icon');
const dialogMenuModal = document.querySelector('.menu-modal');
const tagScrollerLeft = document.querySelector('.tag-scroller-left');
const tagScrollerRight = document.querySelector('.tag-scroller-right');
const navTagContainer = document.querySelector('.nav-tag-container');
const tagsContainer = document.querySelector('.tags-container');
const imgGallery = document.querySelector('.img-gallery');
// const imgGallerySubGrid1 = document.querySelector('.img-gallery-sub-grid-1');
// const imgGallerySubGrid2 = document.querySelector('.img-gallery-sub-grid-2');
// const imgGallerySubGrid3 = document.querySelector('.img-gallery-sub-grid-3');

const WIN_PADDING = 40;
const SCROLL_UNIT = 200;
let pageCount = 1;

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

let images = [];
const BASE_URL = 'https://api.unsplash.com/'
const REQUEST_URL = `${BASE_URL}photos/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&page=4`;

let target;

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error while fetching the data: ", err);
        return;
    }
}

const observer = new IntersectionObserver(entries => {
    // if (entries[0].isIntersecting) {
    //     pageCount ++;

    // }
    entries.forEach((entry, idx) => {
        console.log(entry);
        if (entry.isIntersecting) {
            renderImages(`${BASE_URL}photos/?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&page=${pageCount}`);

            observer.unobserve(target);
            pageCount ++;
        }
    })
    console.log(entries);
});

const renderImages = async (url) => {
    let newImages = [];
    
    if (images.length === 0) {
        newImages = await fetchData(url);
        images = [...newImages];
    } else {
        // observer.unobserve(target);
        newImages = [...await fetchData(url)];
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
    }));

    console.log(requiredImageData);

    for (let i = 0; i < requiredImageData.length; i++) {
        const imgContainer = document.createElement('figure');
        const imgOverlay = document.createElement('div');
        const imgElement = document.createElement('img');
        const imgFooter = document.createElement('div');
        const userDetailContainer = document.createElement('div');
        const profilePic = document.createElement('img');
        const userName = document.createElement('p');
        const downloadBtn = document.createElement('a');

        imgContainer.classList.add('img-container');
        imgOverlay.classList.add('img-overlay');
        imgElement.classList.add('img');
        imgFooter.classList.add('img-footer');
        userDetailContainer.classList.add('user-detail-container');
        profilePic.classList.add('profile-pic');
        userName.classList.add('user-name');
        downloadBtn.classList.add('btn', 'download-btn');

        profilePic.src = requiredImageData[i].user.profile_image.large;
        userName.textContent = requiredImageData[i].user.username;
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'

        imgElement.setAttribute('src', requiredImageData[i].urls.small);
        userDetailContainer.appendChild(profilePic)
        userDetailContainer.appendChild(userName)
        imgFooter.appendChild(userDetailContainer);
        imgFooter.appendChild(downloadBtn);
        imgOverlay.appendChild(imgFooter);
        imgContainer.appendChild(imgOverlay);
        imgContainer.appendChild(imgElement);

        imgGallery.appendChild(imgContainer);
    }
    
    // imgGallery.appendChild(imgGallerySubGrid1);
    // imgGallery.appendChild(imgGallerySubGrid2);
    // imgGallery.appendChild(imgGallerySubGrid3);

    // target = imgGallerySubGrid3.lastChild;
    target = imgGallery.lastChild;
    console.log(target);

    observer.observe(target);
}

// renderImages(REQUEST_URL);