import { decode } from "/node_modules/blurhash/dist/index.mjs";

// the function to render the images in DOM...

export const renderImages = (wrapper, data) => {

    for (let i = 0; i < data.length; i++) {
        const imgContainer = document.createElement('figure');
        const imgOverlay = document.createElement('div');
        const imgLink = document.createElement('a');
        const imgElement = document.createElement('img');
        const imgFooter = document.createElement('div');
        const userDetailContainer = document.createElement('div');
        const profilePic = document.createElement('img');
        const userName = document.createElement('p');
        const downloadBtn = document.createElement('a');
        const canvas = document.createElement('canvas');
        // const imageNumberTag = document.createElement('div');

        imgContainer.classList.add('img-container');
        imgOverlay.classList.add('img-overlay');
        imgLink.classList.add('img-link');
        imgElement.classList.add('img');
        imgFooter.classList.add('img-footer');
        userDetailContainer.classList.add('user-detail-container');
        profilePic.classList.add('profile-pic');
        userName.classList.add('user-name');
        downloadBtn.classList.add('btn', 'download-btn');
        canvas.classList.add('canvas');
        canvas.setAttribute('width', '100%');
        canvas.setAttribute('height', '100%');
        // canvas.height = data[i].height;
        // imageNumberTag.classList.add('image-number-tag');

        imgElement.setAttribute('loading', 'lazy');
        imgLink.href = "/home";
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
        userDetailContainer.appendChild(profilePic)
        userDetailContainer.appendChild(userName)
        imgFooter.appendChild(userDetailContainer);
        imgFooter.appendChild(downloadBtn);
        imgOverlay.appendChild(imgFooter);
        imgContainer.appendChild(canvas);
        imgContainer.appendChild(imgOverlay);
        imgContainer.appendChild(imgLink);
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
        wrapper.appendChild(imgContainer);

    }
}