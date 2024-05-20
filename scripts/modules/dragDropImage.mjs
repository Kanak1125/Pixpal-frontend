const labelUploadFile = document.querySelector('.label-upload-file');

const dropHandler = (event) => {
    event.preventDefault();

    let file = null;
    const items = event.dataTransfer?.items; 
    if (items) {
        [...items].forEach(item => {

            if (item.kind === "file") {
                file = item.getAsFile();

                const imgElement = document.createElement('img');
                imgElement.classList.add("upload-img");
                imgElement.src = URL.createObjectURL(file);
                labelUploadFile.innerHTML = "";
                labelUploadFile.appendChild(imgElement);
            }
        })
    }

    return file;
}

labelUploadFile.addEventListener('dragover', (e) => {
    e.preventDefault();
});

export default dropHandler;