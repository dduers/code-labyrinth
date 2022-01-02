const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let coord = { x: 0, y: 0 };
let coord_path_start = { x: 0, y: 0 };
let paint = false;
let hasPath = false;
let colors = {
    obstacle: '000000',
    path: 'ff8c00',
    way: 'ffffff'
};
var audio = {
    hit: new Audio('audio/2.mp3')
};

window.addEventListener('load', () => {
    resize();
    if ('onpointerdown' in document) {
        document.addEventListener("pointerdown", startPainting, false);
        document.addEventListener("pointerup", stopPainting, false);
        document.addEventListener("pointermove", sketch, false);
    } else if ('ontouchstart' in document) {
        document.addEventListener("touchstart", startPainting, false);
        document.addEventListener("touchend", stopPainting, false);
        document.addEventListener("touchmove", sketch, false);
    } else if ('onmousedown' in document) {
        document.addEventListener("mousedown", startPainting, false);
        document.addEventListener("mouseup", stopPainting, false);
        document.addEventListener("mousemove", sketch, false);
    }
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
    if (coord.x > 15 && hasPath === false)
        return;
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
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#' + colors.path;
    // store coordinates
    let coord_x = coord.x;
    let coord_y = coord.y;
    // start drawinf at this coordinate
    ctx.moveTo(coord.x, coord.y);
    // The position of the cursor gets updated as we move the mouse around.
    getPosition(event);
    let coord_offset_x = coord.x - coord_x;
    let coord_offset_y = coord.y - coord_y;
    // check for obstacle
    let pixelData = {
        point: ctx.getImageData(coord.x + coord_offset_x, coord.y + coord_offset_y, 1, 1).data,
        left: ctx.getImageData(coord.x + coord_offset_x - 4, coord.y + coord_offset_y - 4, 1, 1).data,
        right: ctx.getImageData(coord.x + coord_offset_x + 4, coord.y + coord_offset_y + 4, 1, 1).data
    }
    let hex1 = "#" + (colors.obstacle + rgbToHex(pixelData.point[0], pixelData.point[1], pixelData.point[2])).slice(-6);
    let hex2 = "#" + (colors.obstacle + rgbToHex(pixelData.left[0], pixelData.left[1], pixelData.left[2])).slice(-6);
    let hex3 = "#" + (colors.obstacle + rgbToHex(pixelData.right[0], pixelData.right[1], pixelData.right[2])).slice(-6);
    if (hex1 === '#' + colors.obstacle || hex2 === '#' + colors.obstacle || hex3 === '#' + colors.obstacle) {
        audio.hit.play();
        stopPainting();
        return;
    }
    // A line is traced from start coordinate to this coordinate
    ctx.lineTo(coord.x, coord.y);
    // draws the line.
    ctx.stroke();
    // if a path was started, remember
    if (hasPath === false) {
        hasPath = true;
        //coord_path_start.x = coord.x;
        //coord_path_start.y = coord.y;
    }
}