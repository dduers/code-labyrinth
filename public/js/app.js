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
    document.addEventListener('mousemove', sketch);
    //window.addEventListener('resize', resize);
    /*
    canvas.addEventListener("mousemove", function(e) {
        //var eventLocation = getEventLocation(this, e);
        //var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
        // Get the data of the pixel according to the location generate by the getEventLocation function
        //var context = this.getContext('2d');
        var pixelData = ctx.getImageData(coord.x, coord.y, 1, 1).data;
        // If transparency on the image
        //if ((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0))
            //coord += " (Transparent color detected, cannot be converted to HEX)";
        var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
        // Draw the color and coordinates.
        //document.getElementById("status").innerHTML = coord;
        //document.getElementById("color").style.backgroundColor = hex;
        if (hex === '#000000')
            console.error('fail');
    }, false);
    */
});

// Resizes the canvas to the available size of the window.
function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

// Updates the coordianates of the cursor when 
// an event e is triggered to the coordinates where 
// the said event is triggered.
function getPosition(event) {
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop;
    //var pos = getElementPosition(canvas);
    //coord.x = (event.pageX - pos.x);
    //coord.y = (event.pageY - pos.y);
}

/**
 * convert rgb to hex notation
 */
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

/**
 * draw image to canvas
 */
function drawImageFromWebUrl(sourceurl) {
    var img = new Image();
    img.addEventListener("load", function() {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    });
    img.setAttribute("src", sourceurl);
}

/*
function getElementPosition(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}
*/

/*
function getEventLocation(element, event) {
    var pos = getElementPosition(element);
    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}
*/

// The following functions toggle the flag to start
// and stop drawing
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
    if (hex === '#000000')
        stopPainting();

    // A line is traced from start coordinate to this coordinate
    ctx.lineTo(coord.x, coord.y);
    // Draws the line.
    ctx.stroke();
}