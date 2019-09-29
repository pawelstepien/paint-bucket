const cavnas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cavnas_behind = document.getElementById('canvas');
const ctx_behind = canvas_behind.getContext('2d');
// ctx.imageSmoothingEnabled= false

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

const get2dPixelsMap = () => {
    let startTime = new Date();
    console.log('get2dPixelsMap')
    const imageData = [].slice.call(ctx.getImageData(0,0,canvasWidth,canvasHeight).data);
    const imageDataOriginalLength = imageData.length;
    const pixelsFlatMap = [];
    console.log('before first for', Math.abs(startTime - new Date()))
    startTime = new Date()
    for (let i = 0; i < imageDataOriginalLength; i += 4) {
        pixelsFlatMap.push(imageData.slice(i,i+4));
    }
    const pixelsFlatMapOriginalLength = pixelsFlatMap.length;
    const pixels2dMap = [];
    console.log('before second for', Math.abs(startTime - new Date()))
    startTime = new Date()
    for (let i = 0; i < canvasHeight; i++) {
        pixels2dMap.push(pixelsFlatMap.splice(0,canvasWidth));
    }
    console.log('get2dPixelsMap end', Math.abs(startTime - new Date()))
    return pixels2dMap;
}

// const pixels = get2dPixelsMap();
const clickHandler = event => {
    const pixels = get2dPixelsMap();
    const clickX = event.offsetX;
    const clickY = event.offsetY;

    const colorRed = Math.ceil(Math.random() * 255);
    const colorGreen = Math.ceil(Math.random() * 255);
    const colorBlue = Math.ceil(Math.random() * 255);

    // changePixelColor(clickX, clickY, `rgba(${colorRed},${colorGreen},${colorBlue},1)`)
    
    const pixelsToColor = getPixelsToColor(pixels, clickX, clickY, [colorRed, colorGreen, colorBlue]);
    pixelsToColor.forEach(pixel => changePixelColor(pixel.x, pixel.y, `rgba(${colorRed},${colorGreen},${colorBlue},1)`))
    console.log(pixels)
};

const getPixelsToColor = (pixels, x, y, color) => {
    let pixelsToCheckCoords = [{x: x, y: y}];
    let pixelsToColorCoords = [];

    let compareColorsTime = new Date();
    let compareColorsTotalTime = 0;
    
    const compareColors = (chosenColor, mapColor) => {
        let result = /*chosenColor.every((chosenColorValue, colorValueIndex) => chosenColorValue === mapColor[colorValueIndex]) ||*/ mapColor[3] === 0;
        compareColorsTotalTime += (compareColorsTime - new Date())*-1;
        compareColorsTime = new Date();
        return result;
    }
    
    console.log('getPixelsToColor loop')
    const loopTime = new Date();
    while(pixelsToCheckCoords.length > 0) {
        // if (++iterations > 10000000) break;
        const pixelCoords = pixelsToCheckCoords.pop();

        const pixelRgba = pixels[pixelCoords.y][pixelCoords.x];
        const isAlredyInArray = pixelsToColorCoords.some(coords => coords.x === pixelCoords.x && coords.y === pixelCoords.y);

        if (!isAlredyInArray && compareColors(color, pixelRgba)) {
               
            while (pixelCoords.y > 0 && compareColors(color, pixels[pixelCoords.y - 1][pixelCoords.x])) {
                pixelCoords.y--;
            }
            pixelsToColorCoords.push({x: pixelCoords.x, y : pixelCoords.y});

            while (pixelCoords.y < canvasHeight - 1 && compareColors(color, pixels[pixelCoords.y + 1][pixelCoords.x])) {
                pixelCoords.y++;
                pixelsToColorCoords.push({x: pixelCoords.x, y : pixelCoords.y}); 
                if (pixelCoords.x > 0 && compareColors(color, pixels[pixelCoords.y][pixelCoords.x - 1])) {
                    pixelsToCheckCoords.push({x :pixelCoords.x - 1, y: pixelCoords.y});
                } 
                if (pixelCoords.x < canvasWidth-1 && compareColors(color, pixels[pixelCoords.y][pixelCoords.x + 1])) {
                    pixelsToCheckCoords.push({x :pixelCoords.x + 1, y: pixelCoords.y});
                }
            }
            pixelsToColorCoords.push({x: pixelCoords.x, y : pixelCoords.y}); 
            
        }
    }
    // console.log('getPixelsToColor loopTime', Math.abs(loopTime - new Date()))
    // console.log('compareColors', compareColorsTotalTime)
    return pixelsToColorCoords;
};

const changePixelColor = (x, y, color) => {
    ctx_behind.fillStyle = color;
    ctx_behind.fillRect(x-1, y-1, 3, 3);
};

const drawImageToColor = () => {
    const image = new Image();
    image.addEventListener('load', () => {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    });
    // image.setAttribute('crossOrigin', '');
    image.src = './image.png';
}
drawImageToColor();

// ctx.beginPath();
// ctx.arc(20, 15, 10, 0, 2 * Math.PI);
// ctx.stroke();

canvas.addEventListener('click', clickHandler);
