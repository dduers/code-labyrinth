// canvas
const canvas = document.getElementById("canvas");
// context
const ctx = canvas.getContext("2d");
// initial position of the cursor
let coord = { x: 0, y: 0 };
let coord_path_start = { x: 0, y: 0 };
// flag to trigger drawing
let paint = false;
// has path
let hasPath = false;
// colors
let colors = {
    obstacle: '000000',
    path: 'ff8c00',
    way: 'ffffff'
};
// audio
var audio = {
    hit: new Audio('audio/2.mp3')
};

window.addEventListener('load', () => {
    resize();
    document.addEventListener('mousedown', startPainting);
    document.addEventListener('mouseup', stopPainting);
    document.addEventListener('mousemove', sketch);
    window.addEventListener('resize', resize);
});

function resize() {
    let size = Math.min(window.innerWidth, window.innerHeight);
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    drawImageFromWebUrl("php/code.php");
}

function getPosition(event) {
    coord.x = event.clientX - canvas.offsetLeft - 7;
    coord.y = event.clientY - canvas.offsetTop - 7;
    /*
    if (coord_path_start.x < coord_path_start.y) {
        if (ctx.canvas.width < coord.x + 25)
            alert('done1');
    } else {
        if (ctx.canvas.height < coord.y + 25)
            alert('done3');
    }
    */
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function drawImageFromWebUrl(sourceurl) {
    let img = new Image();
    img.addEventListener("load", function() {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    });
    img.setAttribute("src", sourceurl);
}

function startPainting(event) {
    getPosition(event);
    let pixelData = ctx.getImageData(coord.x, coord.y, 1, 1).data;
    let hex = "#" + (colors.path + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    if (hex !== '#' + colors.path && hasPath === true)
        return;
    paint = true;
}

function stopPainting() {
    paint = false;
}

function sketch(event) {
    if (!paint) return;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#' + colors.path;
    // The cursor to start drawing moves to this coordinate
    ctx.moveTo(coord.x, coord.y);
    // The position of the cursor gets updated as we move the mouse around.
    getPosition(event);
    // check for obstacle
    let pixelData = ctx.getImageData(coord.x + 5, coord.y + 5, 1, 1).data;
    let hex = "#" + (colors.obstacle + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    if (hex === '#' + colors.obstacle) {
        audio.hit.play();
        stopPainting();
        return;
    }
    // A line is traced from start coordinate to this coordinate
    ctx.lineTo(coord.x, coord.y);
    // Draws the line.
    ctx.stroke();
    // if a path was started, remember
    if (hasPath === false) {
        hasPath = true;
        //coord_path_start.x = coord.x;
        //coord_path_start.y = coord.y;
    }
}