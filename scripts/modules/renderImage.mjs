import { decode } from "/node_modules/blurhash/dist/index.mjs";

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
        
        // modal...
        const imageModal = document.createElement('dialog');
        const modalContainer = document.createElement('div');
        const modalHeader = document.createElement('div');
        const closeModalBtn = document.createElement('button');
        closeModalBtn.textContent = "Close";
        const modalImgContainer = document.createElement('div');
        const modalImg = document.createElement('img');
        const modalImgInfoContainer = document.createElement('div');
        const  modalInfoContainerUser = document.createElement('div');
        const modalProfilePic = document.createElement('img');
        const modalUserName = document.createElement('p');
        const modalDownloadBtn = document.createElement('a');
        
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

        // image modal...
        imageModal.classList.add('image-modal');
        modalHeader.classList.add('modal-header');
        modalContainer.classList.add('modal-container');
        modalImgInfoContainer.classList.add('modal-img-info-container');
        closeModalBtn.classList.add('close-image-modal-btn', 'btn');
        modalImgContainer.classList.add('modal-img-container');
        modalImg.classList.add('modal-img');
        modalDownloadBtn.classList.add('download-btn', 'modal-download-btn');
        downloadBtn.href = data[i].urls.regular;
        downloadBtn.setAttribute("download", "true");
        modalInfoContainerUser.classList.add("modal-info-container-user")
        modalProfilePic.classList.add('profile-pic');
        modalUserName.classList.add('user-name');
        modalInfoContainerUser.appendChild(modalProfilePic);
        modalInfoContainerUser.appendChild(modalUserName);
        modalDownloadBtn.href = data[i].urls.regular;
        modalDownloadBtn.setAttribute('download', "true");
        modalImgInfoContainer.appendChild(modalInfoContainerUser);
        modalImgInfoContainer.appendChild(modalDownloadBtn);

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
        imgContainer.appendChild(imgElement);
        imgElement.style.visibility = 'hidden';
        imgOverlay.style.display = 'none';
        modalProfilePic.src = data[i].user.profile_image.large;
        modalUserName.textContent = data[i].user.username;
        modalDownloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'
        
        
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
        modalContainer.appendChild(modalImgInfoContainer);
        imageModal.appendChild(modalContainer);
        document.body.appendChild(imageModal);
        wrapper.appendChild(imgContainer);
    }

    const imgContainerOverlays = document.querySelectorAll('.img-overlay');
    const imgModals = document.querySelectorAll('.image-modal');
    const closeModalBtns = document.querySelectorAll('.close-image-modal-btn');

    imgModals.forEach((_, idx) => {
        // imgModals[idx].style = "padding: 40px";
        imgContainerOverlays[idx].addEventListener('click', () => {
            imgModals[idx].showModal();
            document.body.style = "overflow: hidden";
        });
        
        closeModalBtns[idx].addEventListener('click', () => {
            imgModals[idx].close();
            document.body.style = "overflow: visible";
        });
        closeModalBtns[idx].addEventListener('keydown', (e) => {
            if (e.key == 'Escape') {
                imgModals[idx].close();
                document.body.style = "overflow: visible";
            }
        });
    });
}