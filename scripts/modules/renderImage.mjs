import { decode } from "/node_modules/blurhash/dist/index.mjs";

let imgModals = [];

// the function to render the images in DOM...

export const renderImages = (wrapper, data) => {

    for (let i = 0; i < data.length; i++) {
        const imgContainer = document.createElement('figure');
        const imgOverlay = document.createElement('div');
        // const imgLink = document.createElement('a');
        const imgElement = document.createElement('img');
        const imgFooter = document.createElement('div');
        const userDetailContainer = document.createElement('div');
        const profilePic = document.createElement('img');
        const userName = document.createElement('p');
        const downloadBtn = document.createElement('a');
        const canvas = document.createElement('canvas');
        

        const imageModal = document.createElement('dialog');
        const closeModalBtn = document.createElement('button');
        closeModalBtn.textContent = "Close";
        const modalImgContainer = document.createElement('div');
        const modalImg = document.createElement('img');
        
        // imgModals.push(imageModal);

        // const imageNumberTag = document.createElement('div');

        imgContainer.classList.add('img-container');
        imgOverlay.classList.add('img-overlay');
        // imgLink.classList.add('img-link');
        imgElement.classList.add('img');
        imgFooter.classList.add('img-footer');
        userDetailContainer.classList.add('user-detail-container');
        profilePic.classList.add('profile-pic');
        userName.classList.add('user-name');
        downloadBtn.classList.add('btn', 'download-btn');
        canvas.classList.add('canvas');
        canvas.setAttribute('width', '100%');
        canvas.setAttribute('height', '100%');
        imageModal.classList.add('image-modal');
        closeModalBtn.classList.add('close-image-modal-btn');
        modalImgContainer.classList.add('modal-img-container');
        modalImg.classList.add('modal-img');
        // canvas.height = data[i].height;
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
        imgContainer.appendChild(imgElement);
        imgElement.style.visibility = 'hidden';
        imgOverlay.style.display = 'none';
        
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
        
        // imgElement.addEventListener('load', () => {
        //         // imgContainer.removeChild(canvas);
        //         // imgContainer.appendChild(imgOverlay);
        //         // imgContainer.appendChild(imgElement);
        //         canvas.style.display = 'none';
        //         imgElement.display.style = 'block';
        //         imgOverlay.style.display = 'block';
        //         console.log("Images have been successfully loaded...")
                
        //     })
        // imgElement.display.style = 'block';
        // imgOverlay.style.display = 'block';
        // imgContainer.appendChild(imageNumberTag);
        modalImgContainer.appendChild(modalImg);
        imageModal.appendChild(modalImgContainer);
        imageModal.appendChild(closeModalBtn);
        document.body.appendChild(imageModal);
        wrapper.appendChild(imgContainer);
    }
    // console.log(imgModals);

    const imgContainers = document.querySelectorAll('.img-container');
    const imgModals = document.querySelectorAll('.image-modal');
    const closeModalBtns = document.querySelectorAll('.close-image-modal-btn');

    console.log(imgContainers.length, imgModals.length, closeModalBtns.length);

    imgModals.forEach((_, idx) => {
        // imgModals[idx].style = "padding: 40px";
        imgContainers[idx].addEventListener('click', () => {
            imgModals[idx].showModal();
            document.body.style = "overflow: hidden";
        });
        
        closeModalBtns[idx].addEventListener('click', () => {
            console.log("CLose the modal...");
            imgModals[idx].close();
            console.log("CLosing the modal successful...");
            imgModals[idx].removeAttribute('open');
            document.body.style = "overflow: visible";
        });
    });
}