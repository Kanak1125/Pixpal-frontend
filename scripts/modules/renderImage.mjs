import { decode } from "/node_modules/blurhash/dist/index.mjs";
import fetchData from "./fetchData.mjs";

// the function to render the images in DOM...

const BASE_URL = 'https://api.unsplash.com/';
const SEARCH_BASE_URL = '/pages/results.html?query=';
const RELATED_IMAGES_BASE_URL = `${BASE_URL}/search/photos?client_id=U-JKAdSdHZRA2-glU6Oe4WSzqHGP6GpKM8DZ8yUkelY&per_page=10`;
let images = [];

export const renderImages = (wrapper, data) => {
    let related_images_url = RELATED_IMAGES_BASE_URL;

    for (let i = 0; i < data.length; i++) {
        const imgContainer = document.createElement('figure');
        const imgOverlay = document.createElement('div');
        // const imgLink = document.createElement('a');

        const imgElementFlexContainer = document.createElement('div');   // this solves the problem of the image height...
        const imgElement = document.createElement('img');
        const imgFooter = document.createElement('div');
        const userDetailContainer = document.createElement('div');
        const profilePic = document.createElement('img');
        const userName = document.createElement('p');
        const downloadBtn = document.createElement('a');
        const canvas = document.createElement('canvas');
        
        // modal...
        const imgModalContainerWithOverlay = document.createElement('div');
        const imageModal = document.createElement('div');
        // const imageModalOverlay = document.createElement('div')
        const modalContainer = document.createElement('div');
        const modalHeader = document.createElement('div');
        const closeModalBtn = document.createElement('button');
        closeModalBtn.textContent = "Close";
        const modalImgContainer = document.createElement('div');
        const modalImg = document.createElement('img');
        const modalTypographySection = document.createElement('div');
        const modalImgInfoContainer = document.createElement('div');
        const  modalInfoContainerUser = document.createElement('div');
        const modalProfilePic = document.createElement('img');
        const modalUserName = document.createElement('p');
        const modalDownloadBtn = document.createElement('a');
        const modalImgDetail = document.createElement('p');
        const tagsContainer = document.createElement('div');
        const relatedImagesSection = document.createElement('section');
        const relatedImagesSectionHeading = document.createElement('h2');
        const relatedImagesContainer = document.createElement('div');
        
        if (data[i].tags !== undefined) {
            for (const t of data[i].tags) {
                const tagName = t.title;
                const tag = document.createElement('a');
                tag.classList.add('tag');
                tag.textContent = tagName;
                tag.href = `${SEARCH_BASE_URL}${tagName}`;
                tagsContainer.appendChild(tag);
            }
        }
        
        // const imageNumberTag = document.createElement('div');

        imgModalContainerWithOverlay.classList.add('img-modal-container-with-overlay');
        imgContainer.classList.add('img-container');
        imgOverlay.classList.add('img-overlay');
        // imgLink.classList.add('img-link');
        imgElementFlexContainer.classList.add('img-element-flex-container');
        imgElement.classList.add('img');
        imgFooter.classList.add('img-footer');
        userDetailContainer.classList.add('user-detail-container');
        profilePic.classList.add('profile-pic');
        userName.classList.add('user-name');
        downloadBtn.classList.add('btn', 'download-btn');
        canvas.classList.add('canvas');
        canvas.setAttribute('width', '100%');
        canvas.setAttribute('height', '100%');

        // image modal...
        imageModal.classList.add('image-modal');
        modalHeader.classList.add('modal-header');
        modalTypographySection.classList.add('modal-typography-section');
        modalContainer.classList.add('modal-container');
        modalImgInfoContainer.classList.add('modal-img-info-container');
        closeModalBtn.classList.add('close-image-modal-btn', 'btn');
        modalImgContainer.classList.add('modal-img-container');
        modalImg.classList.add('modal-img');
        modalDownloadBtn.classList.add('btn', 'download-btn', 'modal-download-btn');
        downloadBtn.href = data[i].urls.regular;
        downloadBtn.setAttribute("download", "true");
        modalInfoContainerUser.classList.add("modal-info-container-user")
        modalProfilePic.classList.add('profile-pic');
        modalUserName.classList.add('user-name', 'modal-user-name');    // the seocond class is only for the js...
        tagsContainer.classList.add('tags-container');
        relatedImagesSection.classList.add('related-img-section');
        relatedImagesContainer.classList.add('img-gallery', 'related-img-container');

        modalInfoContainerUser.appendChild(modalProfilePic);
        modalInfoContainerUser.appendChild(modalUserName);
        modalDownloadBtn.href = data[i].urls.regular;
        modalDownloadBtn.setAttribute('download', "true");
        modalImgDetail.classList.add('modal-img-detail');
        modalImgInfoContainer.appendChild(modalInfoContainerUser);
        modalImgInfoContainer.appendChild(modalDownloadBtn);
        
        modalContainer.appendChild(modalTypographySection);

        // downloadBtn.target = "blank";
        // imageNumberTag.classList.add('image-number-tag');

        imgElement.setAttribute('loading', 'lazy');
        // imgLink.href = "/";
        profilePic.src = data[i].user.profile_image.large;
        userName.textContent = data[i].user.username;
        
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'

        // blur_hash...
        const pixel = decode(data[i].blur_hash, 128, 128);
        const imageData = new ImageData(pixel, 128, 128);
        let ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        // ctx.drawImage(pixel, 0, 0, data[i].width, data[i].height);
        // imageNumberTag.textContent = prevImageCount + i + 1;

        imgElement.setAttribute('src', data[i].urls.small);
        modalImg.setAttribute('src', data[i].urls.regular);
        userDetailContainer.appendChild(profilePic)
        userDetailContainer.appendChild(userName)
        imgFooter.appendChild(userDetailContainer);
        imgFooter.appendChild(downloadBtn);
        imgOverlay.appendChild(imgFooter);
        imgContainer.appendChild(canvas);
        imgContainer.appendChild(imgOverlay);
        // imgContainer.appendChild(imgLink);
        imgElementFlexContainer.appendChild(imgElement);
        imgContainer.appendChild(imgElementFlexContainer);
        imgElement.style.visibility = 'hidden';
        imgOverlay.style.display = 'none';
        modalProfilePic.src = data[i].user.profile_image.large;
        // modalUserName.textContent = data[i].user.username;
        modalDownloadBtn.innerHTML = 'Download<i class="fa-solid fa-download"></i>';
        modalImgDetail.textContent = data[i].description;
        relatedImagesSectionHeading.textContent = "Related Images";
        
        
        downloadBtn.onclick = () => {
            console.log("downloaded...");
        }
        // imgContainer.appendChild(imgElement);

        imgElement.onload = () => {
            imgContainer.removeChild(canvas);
            // imgContainer.appendChild(imgOverlay);
            imgElement.style.visibility = 'visible';
            imgOverlay.style.display = 'block';
            // imgContainer.appendChild(imgElement);
            // wrapper.appendChild(imgContainer);
            console.log("Images have been successfully loaded...")
        }
        
        modalImgContainer.appendChild(modalImg);
        imageModal.appendChild(modalContainer);
        modalHeader.appendChild(closeModalBtn);
        imageModal.appendChild(modalHeader);
        modalContainer.appendChild(modalImgContainer);
        modalTypographySection.appendChild(modalImgInfoContainer);
        modalContainer.appendChild(modalTypographySection);
        modalTypographySection.appendChild(modalImgDetail);
        modalTypographySection.appendChild(tagsContainer);
        relatedImagesSection.appendChild(relatedImagesSectionHeading);
        relatedImagesSection.appendChild(relatedImagesContainer);
        modalContainer.appendChild(relatedImagesSection);
        
        imageModal.appendChild(modalContainer);
        imgModalContainerWithOverlay.appendChild(imageModal);
        document.body.appendChild(imgModalContainerWithOverlay);
        // document.body.appendChild(imageModal);
        wrapper.appendChild(imgContainer);
    }

    const imgContainerOverlays = document.querySelectorAll('.img-overlay');
    const imgModalContainerWithOverlays = document.querySelectorAll('.img-modal-container-with-overlay');
    const imgModals = document.querySelectorAll('.image-modal');
    const closeModalBtns = document.querySelectorAll('.close-image-modal-btn');
    const modalUserNames = document.querySelectorAll('.modal-user-name');
    const modalImgDetails = document.querySelectorAll('.modal-img-detail');
    const relatedImagesContainers = document.querySelectorAll('.related-img-container');


    let alpha = 0.4;
    let scalingFactor = 1;
    let rotateYFactor = 45;
    let modalOpacity = 1;

    const listenModalScroll = (event) => {
        event.preventDefault();
        const element = event.target;
        const currentImgModal = element.querySelector('.image-modal');

        const delta = 0.001;
        // const imgModalContainerOverlay = document.querySelector('.img-modal-container-with-overlay');
        
        if (element.classList.contains('img-modal-container-with-overlay')  && event.deltaY) {
            if (alpha === 1 && scalingFactor > 0.4) {
                scalingFactor -= delta * event.deltaY;
                element.style = "transform-style: preserve-3d";
                currentImgModal.style = "perspective: 500px";
                rotateYFactor += delta * event.deltaY * 45;
                modalOpacity -= delta * event.deltaY;
                // currentImgModal.style.opacity = modalOpacity;
                currentImgModal.style.transform = `scale(${scalingFactor})`;
                // currentImgModal.style.transform = `scale(${scalingFactor}) rotate3d(0, 1, 0, ${rotateYFactor}deg)`;
                console.log("Rotating factor ---->", rotateYFactor); 
            } else if (alpha < 1 && alpha > 0.4 && scalingFactor < 1){
                scalingFactor -= delta * event.deltaY;
                currentImgModal.style.transform = `scale(${scalingFactor})`;
                rotateYFactor = 0;
            }
            if (event.deltaY > 0 && alpha < 1) {
                // Increase alpha when scrolling down if alpha is less than 1...
                alpha += delta * event.deltaY;
                alpha = Math.min(alpha, 1);

            } else if (event.deltaY < 0 && alpha > 0.4) {
                // Decrease alpha when scrolling up if alpha is greater than 0.4...
                alpha += delta * event.deltaY;
                alpha = Math.max(alpha, 0.4);

                if (alpha === 0.4) {
                    scalingFactor = 1;
                }
            }

            element.style.backgroundColor = `hsla(0, 0%, 7%, ${alpha})`;
        }
    };

    let userNameArr = [];

    imgModals.forEach((_, idx) => {
        // imgModals[idx].style = "padding: 40px";
        imgContainerOverlays[idx].addEventListener('click', () => {
            // imgModals[idx].showModal();
            imgModalContainerWithOverlays[idx].classList.add('show-modal');
            document.body.style = "overflow: hidden";
            // imgModalContainerWithOverlays[idx].addEventListener('wheel', listenModalScroll, { passive: false });
            imgModalContainerWithOverlays[idx].style.backgroundColor = `hsla(0, 0%, 7%, ${alpha})`;
            console.log("Username: ", data[idx].user.username);
            userNameArr = [];

            console.log("Usernames", data[idx].user.username);
            userNameArr = data[idx].user.username.split('');
            let imgDescriptionArr;

            if (data[idx].description) {
                imgDescriptionArr = data[idx].description.split('');
            }

            let currentIdx = 0;
            let currentIdxDescription = 0;
            let timer;
            let timerDescription;

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

            timer = setInterval(printUserName, 200);
            // if (imgDescriptionArr[idx] !== undefined) {
            //     timerDescription = setInterval(printImageDescription, 200);
            // }
            console.log("RelatedIMgContainer: ", relatedImagesContainers[idx]);

            // if (data[idx].tags[0].title !== undefined) {
            //     // console.log("TAG ====>,", data[idx].tags[0].title);
            //     // related_images_url += `&query=${data[idx].tags[0].title}`;
            // }
            const related_images_url = `${RELATED_IMAGES_BASE_URL}&query=${data[idx].tags[0].title}`;

            getRandomImages(related_images_url, relatedImagesContainers[idx]);
        });
        
        closeModalBtns[idx].addEventListener('click', () => {
            // imgModals[idx].close();
            images = [];
            related_images_url = RELATED_IMAGES_BASE_URL;
            console.log("IMage afer closing,", images);
            document.body.style = "overflow: visible";
            imgModalContainerWithOverlays[idx].classList.remove('show-modal');
            alpha = 0.4;
            // window.removeEventListener('wheel', listenModalScroll);
            modalUserNames[idx].textContent = "";
            modalImgDetails[idx].textContent = "";
        });

        document.addEventListener('keydown', (e) => {
            if (e.key == 'Escape') {
                images = [];
                related_images_url = RELATED_IMAGES_BASE_URL;
                // imgModals[idx].close();
                document.body.style = "overflow: visible";
                imgModalContainerWithOverlays[idx].classList.remove('show-modal');
                
                // window.removeEventListener('wheel', listenModalScroll);
            }
        });
    });
}

async function getRandomImages(url, imgContainer) {
    images = [];
    const imgData = await fetchData(url);
    images = [...await imgData.results];
    console.log("Images: ",images);

    imgContainer.innerHTML = '';

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
        blur_hash: item.blur_hash,
        tags: item.tags,
    }));

    console.log(requiredImageData);
    renderImages(imgContainer, requiredImageData);
}