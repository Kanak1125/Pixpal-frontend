/*
    getAverageColor(imgElement: HTMLImageElement, ratio: number)

    ratio --> determine the size of the image (number of bytes) to be taken from the array of imageData to blur... 
*/

const getAverageColor = (imageElement, ratio = 4) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let imageData, length;
    let i = -4, count = 0;
    let width = 0, height = 0;

    console.log("IMage element: =====>", imageElement);

    // imageElement.onload = () => {
        width = canvas.width = imageElement.width;
        height = canvas.height = imageElement.height;

        const dummyImg = document.querySelectorAll(".img");
        console.log("DUMYY ", dummyImg);

        ctx.drawImage(imageElement, 0, 0);

        try {
            imageData = ctx.getImageData(0, 0, width, height);
            console.log("IMage data =========> ", imageData.data);
            length = imageData.data.length;
        } catch (err) {
            console.error("ERROR FROM AVERAGE COLORS: ", err);
            return {
                R: 0,
                G: 0, 
                B: 0,
            }
        }
    // };

    console.log("IMage element created ======> ", imageElement);

    console.log("CANVAS WIDTH ====>", canvas.width, "CANVAS HEIGHT =====>", canvas.height);

    let R, G, B;
    R = G = B = 0;

    while ((i += ratio * 4) < length) {
        ++count;

        R += imageData.data[i];
        G += imageData.data[i + 1];
        B += imageData.data[i + 2];
    }

    R = ~~(R / count);
    G = ~~(G / count);
    B = ~~(B / count);

    return {R, G, B};
}

export default getAverageColor;