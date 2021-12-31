/**
 * globals
 */

// canvas
const canvas = document.getElementById("canvas");
// context
const ctx = canvas.getContext("2d");
// initial position of the cursor
let coord = { x: 0, y: 0 };
// flag to trigger drawing
let paint = false;

// wait for the content of the window element
// to load, then performs the operations.
window.addEventListener('load', () => {
    drawImageFromWebUrl("php/code.php");
    //resize(); // Resizes the canvas once the window loads
    document.addEventListener('mousedown', startPainting);
    document.addEventListener('mouseup', stopPainting);
    document.addEventListener('mousemove', function(event) {
        /*getPosition(event);
        let pixelData = ctx.getImageData(coord.x, coord.y, 1, 1).data;
        let hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
        if (hex === '#000000') {
            stopPainting();
            return;
        }*/
        sketch(event);
    });
    //window.addEventListener('resize', resize);

});

function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

function getPosition(event) {
    coord.x = event.clientX - canvas.offsetLeft - 7;
    coord.y = event.clientY - canvas.offsetTop - 7;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function drawImageFromWebUrl(sourceurl) {
    var img = new Image();
    img.addEventListener("load", function() {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    });
    img.setAttribute("src", sourceurl);
}

function startPainting(event) {
    paint = true;
    getPosition(event);
}

function stopPainting() {
    paint = false;
}

function sketch(event) {
    if (!paint) return;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff8c00';
    // The cursor to start drawing moves to this coordinate
    ctx.moveTo(coord.x, coord.y);
    // The position of the cursor gets updated as we move the mouse around.
    getPosition(event);

    let pixelData = ctx.getImageData(coord.x, coord.y, 1, 1).data;
    let hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    if (hex === '#000000') {
        stopPainting();
        return;
    }

    // A line is traced from start coordinate to this coordinate
    ctx.lineTo(coord.x, coord.y);
    // Draws the line.
    ctx.stroke();
}