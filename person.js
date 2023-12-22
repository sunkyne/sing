const canvas = document.getElementById('dynamicCanvas');
const ctx = canvas.getContext('2d');

let isMouseDown = false;

var rectangle = {
    width: 50,
    height: 50,
    color: '#00FF00',
    x: 0, // Initial X position
    y: canvas.height - 50,    // Initial Y position
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawRectangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = rectangle.color;
    ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
}

function updateRectangleColor(event) {
    // Change color based on mouse coordinates
    const red = Math.round((event.clientX / canvas.width) * 255);
    const green = Math.round((event.clientY / canvas.height) * 255);
    rectangle.color = `rgb(${red}, ${green}, 0)`;
}

function updateRectanglePosition(event) {
    if (isMouseDown) {
        rectangle.height = canvas.height - event.clientY;
        rectangle.y = event.clientY;
        drawRectangle();
    }
}

window.addEventListener('resize', () => {
    resizeCanvas();
    drawRectangle();
});

canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    rectangle.height = 50;
    rectangle.y = canvas.height - 50;
    rectangle.color = '#00FF00';
    drawRectangle();
});

canvas.addEventListener('mousemove', (event) => {
    updateRectangleColor(event);
    updateRectanglePosition(event);
});

drawRectangle();
resizeCanvas();