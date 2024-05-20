import { decode } from "/node_modules/blurhash/dist/index.mjs";
import fetchData from "./fetchData.mjs";

// the function to render the images in DOM...

// const BASE_URL = 'https://api.unsplash.com/';
const BASE_URL = 'http://127.0.0.1:8000/api';
const SEARCH_BASE_URL = '/pages/results.html?query=';
// const RELATED_IMAGES_BASE_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&per_page=10`;
const RELATED_IMAGES_BASE_URL = `${BASE_URL}/search/photos`;
let images = [];
let currentModalImages = [];

const getBlob= async (url) => {
    console.log("Current image url ===> ", url);
    const response = fetch(url);
    return (await response).blob();
};

const injectImagesToGallery = (clonedTemplate, wrapper, data, idx) => {
    const imgContainer = clonedTemplate.querySelector('.img-container');
    const imgElement = clonedTemplate.querySelector('.img');
    const imgOverlay = clonedTemplate.querySelector('.img-overlay');
    const profilePic = clonedTemplate.querySelector('.profile-pic');
    const userName = clonedTemplate.querySelector('.user-name');
    const downloadBtn = clonedTemplate.querySelector('.download-btn');
    const mbProfilePic = clonedTemplate.querySelector('.mb-profile-pic');
    const mbUserName = clonedTemplate.querySelector('.mb-user-name');
    const mbDownloadBtn = clonedTemplate.querySelector('.mb-download-btn');
    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('width', '100%');
    canvas.setAttribute('height', '100%');
    imgContainer.appendChild(canvas);

    const pixel = decode(data[idx].blur_hash, 128, 128);
    const imageData = new ImageData(pixel, 128, 128);
    let ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    // profilePic.src = data[idx].user.profile_image.large;
    if (profilePic && userName) {
        profilePic.src = data[idx].user.profile_image_url;
        userName.textContent = data[idx].user?.username;
    }

    if (mbProfilePic && mbUserName) {
        mbProfilePic.src = data[idx].user.profile_image_url;
        mbUserName.textContent = data[idx].user?.username;
    }

    getBlob(data[idx].urls.regular).then((blob) => {
        console.log("DOWNLOAD URL ====> ", blob);
        if (downloadBtn) {
            downloadBtn.href = URL.createObjectURL(blob);
            console.log("URL OF THE IMAGE BLOB ====> ", blob);
            downloadBtn.download = 'image.jpg';
        }

        if (mbDownloadBtn) {
            mbDownloadBtn.href = URL.createObjectURL(blob);
            mbDownloadBtn.download = 'image.jpg';
        }
    });

    imgElement.setAttribute('src', data[idx].urls.small);
    imgElement.style.visibility = 'hidden';
    imgOverlay.style.display = 'none';
    imgElement.onload = () => {
        imgContainer.removeChild(canvas);
        imgElement.style.visibility = 'visible';
        imgOverlay.style.display = 'block';
    }
    wrapper.appendChild(clonedTemplate);
}

const injectModalToImages = (clonedTemplate, wrapper, data, idx) => {
    // modal...
    const tagsContainer = clonedTemplate.querySelector('.tags-container');
    const modalImg = clonedTemplate.querySelector('.modal-img');
    const modalProfilePic = clonedTemplate.querySelector('.profile-pic');
    const modalDownloadBtn = clonedTemplate.querySelector('.modal-download-btn');
    const modalUserName = clonedTemplate.querySelector('.modal-user-name');
    const modalImgDetail = clonedTemplate.querySelector('.modal-img-detail');

    if (data[idx].tags !== undefined) {
        for (const t of data[idx].tags) {
            const tagName = t.title;
            const tag = document.createElement('a');
            tag.classList.add('tag');
            tag.textContent = tagName;
            tag.href = `${SEARCH_BASE_URL}${tagName}`;
            tagsContainer.appendChild(tag);
        }
    }
    
    // image modal... 

    getBlob(data[idx].urls.regular).then((blob) => {
        modalDownloadBtn.href = URL.createObjectURL(blob);
        modalDownloadBtn.download = 'image.jpg';
    });

    modalImg.setAttribute('src', data[idx].urls.regular);
    modalProfilePic.src = data[idx].user.profile_image_url;
    // modalProfilePic.src = data[idx].user.profile_image.large;
    modalUserName.textContent = data[idx]?.user.username;
    modalImgDetail.textContent = data[idx]?.description ? data[idx].description : data[idx].alt_description;

    wrapper.appendChild(clonedTemplate);
}

const handleImageModalInteractions = (data) => {
    const imgContainerOverlays = document.querySelectorAll('.img-overlay');
    const imgModalContainerWithOverlays = document.querySelectorAll('.img-modal-container-with-overlay');
    const imgModals = document.querySelectorAll('.image-modal');
    const closeModalBtns = document.querySelectorAll('.close-image-modal-btn');
    const modalUserNames = document.querySelectorAll('.modal-user-name');
    const modalImgDetails = document.querySelectorAll('.modal-img-detail');
    const relatedImagesContainers = document.querySelectorAll('.related-img-container');

    let related_images_url = RELATED_IMAGES_BASE_URL;
    let alpha = 0.4;
    let scalingFactor = 1;
    let rotateYFactor = 45;
    let modalOpacity = 1;

    let currentWidthFactor = 80;
    let currentHeightFactor = 80;

    const listenModalScroll = (event) => {
        event.preventDefault();
        const element = event.target;
        const currentImgModal = element.querySelector('.image-modal');
        const scrollTopVal = element.scrollTop;

        const delta = 0.05;

        if ( window.innerWidth >= 768) {
            // console.log('scroll Y:', scrollTopVal);
            // console.log("Im biggger.........");
            // console.log("ELement....", element);

            if (currentWidthFactor <= 100) {
                currentWidthFactor += 1 * delta;
            }
            if (currentHeightFactor <= 90) {
                currentHeightFactor += 1 * delta;
            }

            
            // element.style.width = `${currentWidthFactor}dvh`;
            // element.style.maxHeight = `${currentHeightFactor}dvh`;
            
            // element.style.height = '100dvh';
        }
        // // const imgModalContainerOverlay = document.querySelector('.img-modal-container-with-overlay');

        // if (element.classList.contains('img-modal-container-with-overlay')  && event.deltaY) {
        //     if (alpha === 1 && scalingFactor > 0.4) {
        //         scalingFactor -= delta * event.deltaY;
        //         element.style = "transform-style: preserve-3d";
        //         currentImgModal.style = "perspective: 500px";
        //         rotateYFactor += delta * event.deltaY * 45;
        //         modalOpacity -= delta * event.deltaY;
        //         // currentImgModal.style.opacity = modalOpacity;
        //         currentImgModal.style.transform = `scale(${scalingFactor})`;
        //         // currentImgModal.style.transform = `scale(${scalingFactor}) rotate3d(0, 1, 0, ${rotateYFactor}deg)`;
        //         console.log("Rotating factor ---->", rotateYFactor); 
        //     } else if (alpha < 1 && alpha > 0.4 && scalingFactor < 1){
        //         scalingFactor -= delta * event.deltaY;
        //         currentImgModal.style.transform = `scale(${scalingFactor})`;
        //         rotateYFactor = 0;
        //     }
        //     if (event.deltaY > 0 && alpha < 1) {
        //         // Increase alpha when scrolling down if alpha is less than 1...
        //         alpha += delta * event.deltaY;
        //         alpha = Math.min(alpha, 1);

        //     } else if (event.deltaY < 0 && alpha > 0.4) {
        //         // Decrease alpha when scrolling up if alpha is greater than 0.4...
        //         alpha += delta * event.deltaY;
        //         alpha = Math.max(alpha, 0.4);

        //         if (alpha === 0.4) {
        //             scalingFactor = 1;
        //         }
        //     }

        //     element.style.backgroundColor = `hsla(0, 0%, 7%, ${alpha})`;
        // }
    };

    let userNameArr = [];

    // const closeAllModals = () => {
    //     imgModalContainerWithOverlays.forEach(element => {
    //         element.classList.remove('show-modal');
    //     })
    // }

    imgModals.forEach((_, idx) => {
        // imgModals[idx].style = "padding: 40px";
        imgContainerOverlays[idx].addEventListener('click', (e) => {
            // imgModals[idx].showModal();
            // closeAllModals();
            imgModalContainerWithOverlays[idx].classList.add('show-modal');
            document.body.style = "overflow: hidden";

            // imgModalContainerWithOverlays[idx].addEventListener('wheel', listenModalScroll, { passive: false });
            imgModals[idx].addEventListener('scroll', listenModalScroll);
            imgModalContainerWithOverlays[idx].style.backgroundColor = `hsla(0, 0%, 7%, ${alpha})`;
            console.log("Data list array: ", data);
            console.log("Username: ", data[idx]?.user.username);
            userNameArr = [];

            console.log("Usernames", data[idx]?.user.username);
            userNameArr = data[idx]?.user.username.split('');
            let imgDescriptionArr;

            if (data[idx]?.description) {
                imgDescriptionArr = data[idx].description.split('');
            }

            let currentIdx = 0;
            // let currentIdxDescription = 0;
            let timer;
            // let timerDescription;

            const printUserName = () => {
                const singleCharacterUserName = document.createElement('span');
                singleCharacterUserName.classList.add('span-username-single-char');
                singleCharacterUserName.textContent = userNameArr[currentIdx];
                modalUserNames[idx].appendChild(singleCharacterUserName);
                currentIdx ++;

                if (currentIdx === userNameArr.length) {
                    clearInterval(timer);
                }
            }
            // const printImageDescription = () => {
            //     const singleCharacterImgDescription = document.createElement('span');
            //     singleCharacterImgDescription.classList.add('span-image-details-single-char');
            //     singleCharacterImgDescription.textContent = imgDescriptionArr[currentIdx];
            //     modalImgDetails[idx].appendChild(singleCharacterImgDescription);
            //     currentIdxDescription ++;
            //     console.log("description idx =====> ", currentIdxDescription);

            //     if (currentIdxDescription === imgDescriptionArr.length) {
            //         clearInterval(timerDescription);
            //     }
            // }

            // timer = setInterval(printUserName, 200);
            // if (imgDescriptionArr[idx] !== undefined) {
            //     timerDescription = setInterval(printImageDescription, 200);
            // }
            console.log("RelatedIMgContainer: ", relatedImagesContainers[idx]);

            // if (data[idx].tags[0].title !== undefined) {
            //     // console.log("TAG ====>,", data[idx].tags[0].title);
            //     // related_images_url += `&query=${data[idx].tags[0].title}`;
            // }
            console.log("IMage tags are here ==================> ", data[idx]?.tags[0]);
            related_images_url = `${RELATED_IMAGES_BASE_URL}?q=${data[idx]?.tags[0].title}&page=10`;
            console.log("Related Images url =====> ", related_images_url);

            getRandomImages(related_images_url, relatedImagesContainers[idx]);
        });

        // I don't think the following is needed becoz the modal is being closed everytime when the it is clicked outside the modal...

        // closeModalBtns[idx].addEventListener('click', () => {
        //     // imgModals[idx].close();
        //     // images = [];
        //     related_images_url = RELATED_IMAGES_BASE_URL;
        //     console.log("IMage afer closing,", images);
        //     document.body.style = "overflow: visible";
        //     imgModalContainerWithOverlays[idx].classList.remove('show-modal');
        //     alpha = 0.4;
        //     window.removeEventListener('scroll', listenModalScroll);
        //     modalUserNames[idx].textContent = "";
        //     modalImgDetails[idx].textContent = "";
        //     currentWidthFactor = 80;
        //     currentHeightFactor = 80;
        // });

        document.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') {
                // images = [];
                related_images_url = RELATED_IMAGES_BASE_URL;
                // imgModals[idx].close();
                document.body.style = "overflow: visible";
                imgModalContainerWithOverlays[idx].classList.remove('show-modal');

                window.removeEventListener('scroll', listenModalScroll);

                modalUserNames[idx].textContent = "";
                modalImgDetails[idx].textContent = "";

                currentWidthFactor = 80;
                currentHeightFactor = 80;
            }
        });

        imgModalContainerWithOverlays[idx].addEventListener('click', (e) => {
            let clickInside = imgModals[idx].contains(e.target);
          
            if (!clickInside) {
               imgModalContainerWithOverlays[idx].classList.remove('show-modal');
               document.body.style = "overflow: visible";
               closeModalBtns[idx].removeEventListener('click', closeModal);
               document.removeEventListener('keydown', closeModalOnEscape);
            }
        });
    });
}

export const renderImages = (wrapper, data) => {
    // check if the browser support template...
    if ("content" in document.createElement("template")) {
        const templateImgGallery = document.getElementById('template-img-gallery');
        const templateImgModal = document.getElementById('template-img-modal');

        for (let i = 0; i < data.length; i++) {
            const cloneTemplateImgGallery = templateImgGallery.content.cloneNode(true);
            const cloneTemplateImgModal = templateImgModal.content.cloneNode(true);

            injectImagesToGallery(cloneTemplateImgGallery, wrapper, data, i);
            injectModalToImages(cloneTemplateImgModal, wrapper, data, i);
        }

        handleImageModalInteractions(data);
    }
}

async function getRandomImages(url, imgContainer) {
    currentModalImages = [];
    const imgData = await fetchData(url);
    console.log("IMage data ======> ", imgData);
    // currentModalImages = [...await imgData.results];
    currentModalImages = [...await imgData];
    console.log("Images: ",images);

    imgContainer.innerHTML = '';

    // filter out only the needed data...
    const requiredImageData = currentModalImages.map(item => ({
        id: item.id,
        user: item.user,
        description: item.description,
        alt_description: item.alt_description,
        created_at: item.created_at,
        width: item.width,
        height: item.height,
        urls: item.urls,
        blur_hash: item.blur_hash,
        tags: item.tags,
    }));

    console.log(requiredImageData);
    renderImages(imgContainer, requiredImageData);
}

// close all modals function...
function closeAllModals() {
    const imgModalContainerWithOverlays = document.querySelectorAll('.img-modal-container-with-overlay');
    const closeModalBtns = document.querySelectorAll('.close-image-modal-btn');

    imgModalContainerWithOverlays.forEach(element => {
        element.classList.remove('show-modal');
    });

    document.body.style = "overflow: visible";

    closeModalBtns.forEach(btn => {
        btn.removeEventListener('click', closeModal);
    });

    window.removeEventListener('keydown', closeModalOnEscape);
}

function closeModal() {
    closeAllModals();
}

function closeModalOnEscape(e) {
    if (e.key === 'Escape') {
        closeAllModals();
    }
}