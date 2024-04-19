// import { getAverageColor } from "/node_modules/fast-average-color-node/dist/index.d.ts";
// import { getAverageColor } from "fast-average-color-node";
// import getAverageColor from "./averageColor.mjs";

const uploadImageForm = document.getElementById("upload-image-form");

const uploadImgBtn = document.querySelector('.upload-img-btn');
const modalUploadImage = document.querySelector('.modal-upload-image');
const closeUploadImageBtn = document.querySelector('.close-upload-image-btn');

const fileInputField = document.getElementById('file');
const imageDescriptionField = document.getElementById('description');

const tagsInputField = document.getElementById('tags');
const tagsInputContainer = document.querySelector('.input-tags-container');

let tags = [];  // to be submitted along form data...

const submit_image_URL = "http://127.0.0.1:8000/images/";

uploadImageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    

    console.log("Form submitted ======>")
    const formData = new FormData();
    
    // let color = "";

    // async function returnAverageColor() {
    //     color = await getAverageColor(fileInputField.files[0]);
    //     console.log("Average color ====>", color);
    // }

    // returnAverageColor();

    const imgObjURL = URL.createObjectURL(fileInputField.files[0]);
    console.log("IMGE OBJECT URL ===> ", imgObjURL);
    // formData.append('blur_hash', 'skldfjlks');
    formData.append('description', imageDescriptionField.value);
    formData.append('uploaded_file', fileInputField.files[0]);
    formData.append('color', '#abcdef');

    for (let tag of tags) {
        formData.append('tags', tag);
    }

    for (const [key, value] of formData) {
        console.log(`${key}: ${value}\n`);
    }

    console.log(typeof imageData);

    fetch(submit_image_URL, {
        method: "POST",
        body: formData,
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error("ERROR: ", err));

    console.log(fileInputField.files[0]);
});

//tags input field...

tagsInputField.addEventListener('keypress', (e) => {
    const currentValue = e.target.value;

    if (e.key === "Enter") {
        e.preventDefault();
        const tag = document.createElement('div');
        tags.push(currentValue);
        console.log("New tag added to the list... \n updated tags ====> ", tags);
        tag.textContent = currentValue;
        tagsInputContainer.appendChild(tag);

        tagsInputField.value = "";
    }
});

// modal...

uploadImgBtn.addEventListener('click', () => {
    modalUploadImage.showModal();
});

closeUploadImageBtn.addEventListener('click', () => {
    modalUploadImage.close();
});