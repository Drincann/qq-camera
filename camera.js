//Available in nodejs

const NodeWebcam = require("node-webcam");
const gifGen = require('./gifGen');

//Default options

var opts = {

    quality: 100,

    //Save shots in memory

    saveShots: false,


    // [jpeg, png] support varies
    // Webcam.OutputTypes

    output: "jpeg",


    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: "buffer",


    //Logging
    verbose: false
};

//Creates webcam instance
var Webcam = NodeWebcam.create(opts);

//Will automatically append location output type
function capture() {
    return new Promise((res, rej) => {
        Webcam.capture("test_picture", function (err, data) {
            if (err) {
                return rej(err);
            }
            res(data);
        });
    });
}

function sleep(time) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, time);
    });
}

async function gif() {
    //! 没有实现
    const imgs = [];
    let start = Date.now(), count = 10;
    for (const i in [...new Array(count).keys()]) {
        await sleep(100);
        try {
            imgs.push(await capture());
        } catch (err) {
            console.log(err);
        }
    }
    await gifGen({
        filename: 'out.gif', imgs, height: 360, width: 640, delay: (Date.now() - start) / 10, quality: 1
    });
}

module.exports = {
    capture
};