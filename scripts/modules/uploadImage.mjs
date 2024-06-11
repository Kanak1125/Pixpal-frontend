//  var getAverageColor  = require("../../node_modules/fast-average-color-node/dist/index.js")
//import { getAverageColor } from "fast-average-color-node";
import getAverageColor from "./averageColor.mjs";
import dropHandler from "./dragDropImage.mjs";
import svg2png from "./svg2png.mjs";

const uploadImageForm = document.getElementById("upload-image-form");

const uploadImgBtnList = document.querySelectorAll('.upload-img-btn');
const modalUploadImage = document.querySelector('.modal-upload-image');
const closeUploadImageBtn = document.querySelector('.close-upload-image-btn');

const fileInputField = document.getElementById('file');
const imageDescriptionField = document.getElementById('description');

const tagsInputField = document.getElementById('input-tags');

const tagsInputFieldContainer = document.querySelector('.input-tags-field-container');
const tagsInputContainer = document.querySelector('.input-tags-container');

const labelUploadFile = document.querySelector('.label-upload-file');
const imgFileInput = document.querySelector('.input-img-file');

let formData = new FormData();
let droppedFile = null;

let tags = [];  // to be submitted along form data...

// const submit_image_URL = `http://127.0.0.1:8000/api/images/`;
const submit_image_URL = `http://${window.location.hostname}:8000/api/images/`;

imgFileInput.addEventListener('change', () => {
    labelUploadFile.textContent = fileInputField.files[0].name;
});

labelUploadFile.addEventListener('drop', (e) => {
    const droppedFile = dropHandler(e);

    if (droppedFile) {
        formData.set('uploaded_file', droppedFile);
    }

    console.log("FormData uploaded file from drop listener ====> ", formData.get('uploaded_file'));
});

uploadImageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // const imgObjURL = URL.createObjectURL(fileInputField.files[0]);
    // console.log("IMGE OBJECT URL ===> ", imgObjURL);
    formData.append('description', imageDescriptionField.value);

    if (droppedFile) {
        formData.set('uploaded_file', droppedFile);
    } else if (fileInputField.files.length > 0) {
        formData.set('uploaded_file', fileInputField.files[0]);
    } else {
        console.error("No file provided during submission...");
    }

    const uploadedFile = formData.get('uploaded_file');
    
    if(uploadedFile.type === "image/svg+xml") {
        // run the conversion here...
        const returnedPngFile = await svg2png(uploadedFile);
        console.log("CONverted to png file url ====> ", URL.createObjectURL(returnedPngFile));
        formData.set('uploaded_file', returnedPngFile);
    }

    // labelUploadFile.addEventListener('drop', (e) => dropHandler(e, formData));

    for (let tag of tags) {
        formData.append('tags', tag);
    }

    const imageEl = formData.get('uploaded_file');
    console.log("CONverted to jpeg file url ====> ", URL.createObjectURL(imageEl));


    console.log("FormData uploaded file BEFORE submission ====> ", formData.get('uploaded_file'));
    console.log("IMAGE FILE ELEMENT ====> ", imageEl);
    const imageURL = URL.createObjectURL(imageEl);
    const imageElement = new Image();
    imageElement.crossOrigin = "Anonymous";
    imageElement.src = `${imageURL}`;

    console.log("FormData uploaded file from submission ====> ", formData.get('uploaded_file'));

    imageElement.onload = async () => {
        const {R, G, B} = getAverageColor(imageElement);
        formData.append('color', JSON.stringify({R, G, B}));
        console.log("RED ===>", R, "Green ====>", G, "Blue ====>", B);

        try {
            const submittedFormData = fetch(submit_image_URL, {
                method: "POST",
                body: formData,
            })
            const data = (await submittedFormData).json();
            
            console.log("FOrm data submitted: =====> ", data)
        } catch (err) {
            console.log("Error occurred while submitting formData ===> ", err);
        } finally {
            uploadImageForm.reset();
            labelUploadFile.textContent = "";
            tagsInputContainer.innerHTML = "";
            tags = [];
            formData = new FormData(); // reset the formData...
        }
    };
    console.log("Form submitted ======>");

    console.log(typeof imageData);

    modalUploadImage.close();

    console.log(fileInputField.files[0]);
});

//tags input field...

/*
    event listener for tags input in the tag field of the form...
*/

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

uploadImgBtnList.forEach((btn) => {
    btn.addEventListener('click', () => {
        modalUploadImage.showModal();
    });
})

closeUploadImageBtn.addEventListener('click', () => {
    modalUploadImage.close();
    labelUploadFile.innerHTML = "";
    labelUploadFile.textContent = "Upload an image";
    uploadImageForm.reset();
    tagsInputContainer.innerHTML = "";
    tags = [];
});