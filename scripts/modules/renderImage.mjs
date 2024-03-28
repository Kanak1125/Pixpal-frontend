// the function to render the images in DOM...

export const renderImages = (wrapper, data) => {
    for (let i = 0; i < data.length; i++) {
        const imgContainer = document.createElement('figure');
        const imgOverlay = document.createElement('div');
        const imgElement = document.createElement('img');
        const imgFooter = document.createElement('div');
        const userDetailContainer = document.createElement('div');
        const profilePic = document.createElement('img');
        const userName = document.createElement('p');
        const downloadBtn = document.createElement('a');
        // const imageNumberTag = document.createElement('div');

        imgContainer.classList.add('img-container');
        imgOverlay.classList.add('img-overlay');
        imgElement.classList.add('img');
        imgFooter.classList.add('img-footer');
        userDetailContainer.classList.add('user-detail-container');
        profilePic.classList.add('profile-pic');
        userName.classList.add('user-name');
        downloadBtn.classList.add('btn', 'download-btn');
        // imageNumberTag.classList.add('image-number-tag');

        profilePic.src = data[i].user.profile_image.large;
        userName.textContent = data[i].user.username;
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>'

        // imageNumberTag.textContent = prevImageCount + i + 1;

        imgElement.setAttribute('src', data[i].urls.small);
        userDetailContainer.appendChild(profilePic)
        userDetailContainer.appendChild(userName)
        imgFooter.appendChild(userDetailContainer);
        imgFooter.appendChild(downloadBtn);
        imgOverlay.appendChild(imgFooter);
        imgContainer.appendChild(imgOverlay);
        imgContainer.appendChild(imgElement);
        // imgContainer.appendChild(imageNumberTag);

        wrapper.appendChild(imgContainer);
    }
}