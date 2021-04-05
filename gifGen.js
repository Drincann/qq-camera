const GIFEncoder = require('gifencoder');
const { createCanvas, Image } = require('canvas');
const fs = require('fs');

module.exports = async ({ filename, imgs, height, width, delay, quality } = {}) => {
    const encoder = new GIFEncoder(width, height);
    // stream the results as they are available into myanimated.gif
    encoder.createReadStream().pipe(fs.createWriteStream(filename));

    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(delay);  // frame delay in ms
    encoder.setQuality(quality); // image quality. 10 is default.

    // use node-canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    for (const buffer of imgs) {
        ctx.drawImage(await toCanvasImg(buffer), 0, 0, width, height)
        encoder.addFrame(ctx);
    }

    encoder.finish();

};

function toCanvasImg(buffer) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => {
            console.log(1);
            res(img)
        };
        img.src = buffer;
    });
}