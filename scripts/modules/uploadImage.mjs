//  var getAverageColor  = require("../../node_modules/fast-average-color-node/dist/index.js")
//import { getAverageColor } from "fast-average-color-node";
// import getAverageColor from "./averageColor.mjs";


const uploadImageForm = document.getElementById("upload-image-form");

const uploadImgBtn = document.querySelector('.upload-img-btn');
const modalUploadImage = document.querySelector('.modal-upload-image');
const closeUploadImageBtn = document.querySelector('.close-upload-image-btn');

const fileInputField = document.getElementById('file');
const imageDescriptionField = document.getElementById('description');

const tagsInputField = document.getElementById('input-tags');

const tagsInputFieldContainer = document.querySelector('.input-tags-field-container');
const tagsInputContainer = document.querySelector('.input-tags-container');

let tags = [];  // to be submitted along form data...

const submit_image_URL = "http://127.0.0.1:8000/api/images/";

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

    // console.log("Width of the image", fileInputField.files[0].width, "Height of an image ====> ", fileInputField.files[0].height);
    // // const imageEl = new Image();
    // // imageEl.src = fileInputField.files[0].name;

    // const imageEl = document.querySelectorAll('.img')[0];
    // console.log("IMage els ====>", imageEl);


    // imageEl.onload(() => {
    //     const {R, G, B} = getAverageColor(imageEl);
    //     console.log("RED ===>", R, "Green ====>", G, "Blue ====>", B);
    // })

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
    .then(data => {
        console.log(data)
        uploadImageForm.reset();
        tagsInputContainer.innerHTML = "";
        tags = [];
    })
    .catch(err => console.error("ERROR: ", err));

    console.log(fileInputField.files[0]);
});

//tags input field...

tagsInputField.addEventListener('keydown', (e) => {
    const currentValue = e.target.value;

    if (e.key === "Enter") {
        e.preventDefault();
        if (currentValue && !tags.includes(currentValue)) {
            const tag = document.createElement('div');
            tag.classList.add('tag');
            tag.classList.add('upload-img-tag');
            tags.push(currentValue);
            console.log("New tag added to the list... \n updated tags ====> ", tags);
            tag.textContent = currentValue;
            tagsInputContainer.appendChild(tag);
    
            tagsInputField.value = "";
        } else {
            const tagIdx = tags.indexOf(currentValue);
            const tagsFromDom = document.querySelectorAll('.upload-img-tag');
            console.log("Tags from the DOM ====> ", tagsFromDom)

            if (tagsFromDom[tagIdx]) {
                tagsFromDom[tagIdx].classList.add('animate-tag');

                setTimeout(() => {
                    tagsFromDom[tagIdx].classList.remove('animate-tag');
                }, 500);
            } 

        }
    }

    if (e.key === "Backspace") {
        if (currentValue) return;

        e.preventDefault();

        if (tags.length > 0) {
            tags.pop();
            tagsInputContainer.removeChild(tagsInputContainer.lastChild);
        }
        console.log("Tag deleted...");
    }

});


// modal...

uploadImgBtn.addEventListener('click', () => {
    modalUploadImage.showModal();
});

closeUploadImageBtn.addEventListener('click', () => {
    modalUploadImage.close();
    uploadImageForm.reset();
    tagsInputContainer.innerHTML = "";
    tags = [];
});