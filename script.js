// Game of Life Configuration
const CELL_SIZE = 10;
const INITIAL_FILL_PERCENTAGE = 0.3;

// Game State
let canvas;
let ctx;
let cols;
let rows;
let grid = [];
let nextGrid = [];
let isRunning = false;
let generationCount = 0;
let speed = 3; // generations per second
let lastUpdateTime = 0;
let updateInterval = 1000 / speed;

// DOM Elements
let playPauseBtn;
let speedControl;
let speedValue;
let generationDisplay;
let livingCellsDisplay;
let clearBtn;
let randomBtn;
let helpBtn;
let modal;
let closeBtn;
let modalCloseBtn;

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDOM();
    initializeCanvas();
    initializeGrid();
    randomizeGrid(INITIAL_FILL_PERCENTAGE);
    setupEventListeners();
    updateStats();
    requestAnimationFrame(gameLoop);
});

// Initialize DOM element references
function initializeDOM() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    playPauseBtn = document.getElementById('playPauseBtn');
    speedControl = document.getElementById('speedControl');
    speedValue = document.getElementById('speedValue');
    generationDisplay = document.getElementById('generation');
    livingCellsDisplay = document.getElementById('livingCells');
    clearBtn = document.getElementById('clearBtn');
    randomBtn = document.getElementById('randomBtn');
    helpBtn = document.getElementById('helpBtn');
    modal = document.getElementById('helpModal');
    closeBtn = document.querySelector('.close-btn');
    modalCloseBtn = document.querySelector('.modal-close-btn');
}

// Initialize canvas size based on window size
function initializeCanvas() {
    const container = document.querySelector('.canvas-container');
    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 40;

    cols = Math.floor(maxWidth / CELL_SIZE);
    rows = Math.floor(maxHeight / CELL_SIZE);

    canvas.width = cols * CELL_SIZE;
    canvas.height = rows * CELL_SIZE;
}

// Initialize the grid arrays
function initializeGrid() {
    grid = [];
    nextGrid = [];

    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        nextGrid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }

    generationCount = 0;
}

// Randomize the grid with a given fill percentage
function randomizeGrid(fillPercentage = 0.3) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < fillPercentage ? 1 : 0;
        }
    }
    generationCount = 0;
    updateStats();
    drawGrid();
}

// Clear the entire grid
function clearGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
        }
    }
    generationCount = 0;
    updateStats();
    drawGrid();
}

// Count living neighbors for a cell
function countNeighbors(row, col) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            const newRow = row + i;
            const newCol = col + j;

            // Check boundaries
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }

    return count;
}

// Apply Conway's Game of Life rules
function updateGrid() {
    // Calculate next generation
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(i, j);
            const currentCell = grid[i][j];

            // Apply rules
            if (currentCell === 1) {
                // Cell is alive
                if (neighbors < 2 || neighbors > 3) {
                    nextGrid[i][j] = 0; // Dies
                } else {
                    nextGrid[i][j] = 1; // Survives
                }
            } else {
                // Cell is dead
                if (neighbors === 3) {
                    nextGrid[i][j] = 1; // Birth
                } else {
                    nextGrid[i][j] = 0; // Stays dead
                }
            }
        }
    }

    // Copy nextGrid to grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
        }
    }

    generationCount++;
    updateStats();
}

// Draw the grid on canvas
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                // Living cell
                ctx.fillStyle = '#10b981';
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                // Add a subtle glow effect
                ctx.shadowBlur = 3;
                ctx.shadowColor = '#10b981';
            }
        }
    }

    ctx.shadowBlur = 0;

    // Draw grid lines
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        ctx.moveTo(j * CELL_SIZE, 0);
        ctx.lineTo(j * CELL_SIZE, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }
}

// Update statistics display
function updateStats() {
    let livingCells = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            livingCells += grid[i][j];
        }
    }

    generationDisplay.textContent = generationCount;
    livingCellsDisplay.textContent = livingCells;
}

// Main game loop
function gameLoop(timestamp) {
    if (isRunning) {
        const elapsed = timestamp - lastUpdateTime;

        if (elapsed >= updateInterval) {
            updateGrid();
            drawGrid();
            lastUpdateTime = timestamp;
        }
    }

    requestAnimationFrame(gameLoop);
}

// Toggle play/pause
function togglePlayPause() {
    isRunning = !isRunning;

    const btnIcon = playPauseBtn.querySelector('.btn-icon');
    const btnText = playPauseBtn.querySelector('.btn-text');

    if (isRunning) {
        btnIcon.textContent = '⏸';
        btnText.textContent = 'Pause';
        lastUpdateTime = performance.now();
    } else {
        btnIcon.textContent = '▶';
        btnText.textContent = 'Start';
    }
}

// Update simulation speed
function updateSpeed() {
    speed = parseInt(speedControl.value);
    updateInterval = 1000 / speed;
    speedValue.textContent = `${speed}/s`;
}

// Handle canvas clicks to toggle cells
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
        grid[row][col] = grid[row][col] === 1 ? 0 : 1;
        updateStats();
        drawGrid();
    }
}

// Handle canvas drag to draw cells
let isDrawing = false;
let lastDrawnCell = null;

function handleCanvasMouseDown(event) {
    isDrawing = true;
    handleCanvasClick(event);
}

function handleCanvasMouseUp() {
    isDrawing = false;
    lastDrawnCell = null;
}

function handleCanvasMouseMove(event) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    // Only update if we moved to a different cell
    const cellKey = `${row},${col}`;
    if (cellKey !== lastDrawnCell && row >= 0 && row < rows && col >= 0 && col < cols) {
        grid[row][col] = 1; // Always set to alive when dragging
        lastDrawnCell = cellKey;
        updateStats();
        drawGrid();
    }
}

// Show help modal
function showHelpModal() {
    modal.style.display = 'block';
}

// Hide help modal
function hideHelpModal() {
    modal.style.display = 'none';
}

// Setup all event listeners
function setupEventListeners() {
    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Speed control
    speedControl.addEventListener('input', updateSpeed);

    // Clear button
    clearBtn.addEventListener('click', () => {
        clearGrid();
        if (isRunning) togglePlayPause();
    });

    // Random button
    randomBtn.addEventListener('click', () => {
        randomizeGrid(INITIAL_FILL_PERCENTAGE);
        if (isRunning) togglePlayPause();
    });

    // Canvas interactions
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('mouseleave', handleCanvasMouseUp);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    // Help modal
    helpBtn.addEventListener('click', showHelpModal);
    closeBtn.addEventListener('click', hideHelpModal);
    modalCloseBtn.addEventListener('click', hideHelpModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideHelpModal();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const wasRunning = isRunning;
        if (isRunning) togglePlayPause();

        initializeCanvas();
        initializeGrid();
        randomizeGrid(INITIAL_FILL_PERCENTAGE);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            togglePlayPause();
        } else if (event.code === 'KeyC') {
            clearGrid();
        } else if (event.code === 'KeyR') {
            randomizeGrid(INITIAL_FILL_PERCENTAGE);
        }
    });
}
