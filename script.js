import Rules from './rules.js';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pixelSize = 5;
const spawnProbability = 0;
const targetFPS = 24;


let grid = [];
let bufferGrid = [];

let animationHandle;
let currentRule;
const ruleSelect = document.getElementById('ruleSetSelection');
const pausePlayButton = document.getElementById('pause');
let isPaused = false;

function draw(x, y, color, size) {
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
}

function cellValue(x, y) {
    x = (x + canvas.width / pixelSize) % (canvas.width / pixelSize);
    y = (y + canvas.height / pixelSize) % (canvas.height / pixelSize);

    return grid[x][y];
}

function countNeighbors(x, y) {
    let count = 0;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            count += cellValue(x + dx, y + dy);
        }
    }

    return count;
}

function update(timestamp) {
    if (!update.lastTimeStamp) {
        update.lastTimeStamp = timestamp;
    }
    let deltaTime = timestamp - update.lastTimeStamp;

    if (deltaTime >= 1000 / targetFPS) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw(0, 0, 'black', canvas.width);
        bufferGrid = Array.from({ length: canvas.width }, () => Array(canvas.height).fill(0));

        for (let x = 0; x < canvas.width / pixelSize; x++) {
            for (let y = 0; y < canvas.height / pixelSize; y++) {
                bufferGrid[x][y] = currentRule(x, y, countNeighbors, grid);
            }
        }

        grid = bufferGrid;

        for (let x = 0; x < canvas.width / pixelSize; x++) {
            for (let y = 0; y < canvas.height / pixelSize; y++) {
                if (grid[x][y]) {
                    draw(x * pixelSize, y * pixelSize, `rgb(${x / 2}, ${y / 2}, 255)`, pixelSize);
                }
            }
        }
        update.lastTimeStamp = timestamp;
    }
    animationHandle = requestAnimationFrame(update);
}

function initialize() {
    grid = Array.from({ length: canvas.width }, () => Array(canvas.height).fill(0));
    currentRule = Rules[ruleSelect.value] || Rules.conway;
    isPaused = false;
    for (let x = 0; x < canvas.width / pixelSize; x++) {
        for (let y = 0; y < canvas.height / pixelSize; y++) {
            if (Math.random() > spawnProbability) {
                grid[x][y] = 1;
            }
        }
    }
    requestAnimationFrame(update);
}

initialize();

function cancelAnimation() {
    if (animationHandle) {
        cancelAnimationFrame(animationHandle);
        animationHandle = null;
    }
}

function toggleAnimation() {
    if (isPaused) {
        isPaused = false;
        pausePlayButton.textContent = 'Pause';
        requestAnimationFrame(update);
    } else {
        isPaused = true;
        pausePlayButton.textContent = 'Play';
        cancelAnimation();
    }
}

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
    cancelAnimation();
    initialize();
});

document.getElementById('canvas').addEventListener('click', (e) => {
    const mouseX = e.clientX - context.canvas.offsetLeft;
    const mouseY = e.clientY - context.canvas.offsetTop;
    const x = Math.floor(mouseX / pixelSize);
    const y = Math.floor(mouseY / pixelSize);

    for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            const newX = x + i;
            const newY = y + j;

            if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length) {
                grid[newX][newY] = 1;
                draw(newX * pixelSize, newY * pixelSize, 'red', pixelSize);
            }
        }
    }
});

ruleSelect.addEventListener('change', function () {
    cancelAnimation();

    switch (ruleSelect.value) {
        case 'conway':
            currentRule = Rules.conway;
            break;
        case 'highlife':
            currentRule = Rules.highlife;
            break;
        case 'briansBrain':
            currentRule = Rules.briansBrain;
            break;
        case 'walledCity':
            currentRule = Rules.walledCity;
            break;
        case 'dayAndNight':
            currentRule = Rules.dayAndNight;
            break;
    }

    if (!isPaused) {
        requestAnimationFrame(update);
    }
});

pausePlayButton.addEventListener('click', toggleAnimation);
