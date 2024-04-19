const getAverageColor = (imageElement, ratio) => {
    const canvas = document.createElement('canvas');

    let width = canvas.width = imageElement.width;
    let height = canvas.height = imageElement.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);

    let imageData, length;
    let i = -4, count = 0;

    try {
        imageData = ctx.getImageData(0, 0, width, height);
        length = imageData.data.length;
    } catch (err) {
        console.error("ERROR FROM AVERAGE COLORS: ", err);
        return {
            R: 0,
            G: 0, 
            B: 0,
        }
    }

    let R, G, B;
    R = G = B = 0;

    while ((i += ratio * 4) < length) {
        ++count;

        R += imageData.data[i];
        G += imageData.data[i + 1];
        B += imageData.data[i + 2];
    }
}

export default getAverageColor;