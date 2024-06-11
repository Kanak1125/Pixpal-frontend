import { v4 } from 'https://cdn.jsdelivr.net/npm/uuid@latest/dist/esm-browser/index.js';

/*
    svg to png converter using canvas...

    svg2png = (file: File) => {
        return file // JPG file...
    }
*/

// for debugging purpose only...
const saveBlobLocally = (blob) => {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'image.png';
    a.click();
    URL.revokeObjectURL(url);
}

const svg2png = (file) => {
    return new Promise((resolve, reject) => {
        const imgEl = new Image();
        const imgUrl = URL.createObjectURL(file);

        // Adding crossOrigin attribute to handle potential CORS issues
        imgEl.crossOrigin = 'Anonymous';
        imgEl.src = imgUrl;
    
        imgEl.onload = () => {
            console.log("FROM svg2png module ==> Image loaded...");
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imgEl.naturalWidth;
            canvas.height = imgEl.naturalHeight;
            ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

            console.log("Canvas drawn with image dimensions:", canvas.width, canvas.height);

            // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            // const newImgUrl = canvas.toDataURL();
            // console.log("New image url =====> ", newImgUrl);
    
            // let pngFile = null;
            // try {
            //     pngFile = new File(imageData, 'image.png');
            //     console.log("<============= PNG to SVG conversion successful =======>", pngFile);
            // } catch(err) {
            //     console.error("Error while creating file", err);
            // }
            // // return new Blob(imageData);
            // return pngFile;

            canvas.toBlob(blob => {
                if (blob) {
                    // const pngFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                    const pngFile = new File([blob], `image-${v4()}.png`, { type: 'image/png' });

                    saveBlobLocally(blob);
                    resolve(pngFile);
                } else {
                    reject(new Error('Canvas to blob conversion failed...'));
                }
            }, 'image/png');
        };

        imgEl.onerror = (err) => {
            reject(err);
        }
    });
}

export default svg2png;