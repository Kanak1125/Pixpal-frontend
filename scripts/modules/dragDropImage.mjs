const labelUploadFile = document.querySelector('.label-upload-file');

const dropHandler = (event) => {
    event.preventDefault();

    let file = null;
    const items = event.dataTransfer?.items; 
    if (items) {
        console.log("Items are =====> ", items);
        [...items].forEach(item => {

            if (item.kind === "file") {
                file = item.getAsFile();

                const imgElement = document.createElement('img');
                imgElement.classList.add("upload-img");
                imgElement.src = URL.createObjectURL(file);
                labelUploadFile.innerHTML = "";
                labelUploadFile.appendChild(imgElement);
            }
            console.log("Data transfered item ===> ", item);
        })
    }

    console.log("FILE DROPPED =====> ", file);
    return file;
}
// labelUploadFile.addEventListener('drop', dropHandler);

labelUploadFile.addEventListener('dragover', (e) => {
    console.log("File is in drop zone....");
    e.preventDefault();
});

export default dropHandler;