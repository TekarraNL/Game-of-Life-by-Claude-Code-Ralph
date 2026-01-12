// Game of Life Configuration
const CELL_SIZE = 10;
const INITIAL_FILL_PERCENTAGE = 0.2;

// Preset Patterns (1 = alive, 0 = dead)
const PATTERNS = {
    glider: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1]
    ],
    lwss: [ // Lightweight Spaceship
        [0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0]
    ],
    blinker: [
        [1, 1, 1]
    ],
    toad: [
        [0, 1, 1, 1],
        [1, 1, 1, 0]
    ],
    beacon: [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 1, 1],
        [0, 0, 1, 1]
    ],
    pulsar: [
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
    ],
    gliderGun: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    pentadecathlon: [
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0]
    ]
};

// Pattern Selection State
let selectedPattern = null;

// Game State
let canvas;
let ctx;
let cols;
let rows;
let grid = [];
let nextGrid = [];
let opacityGrid = []; // Track opacity for fade effect (0.0 to 1.0)
let isRunning = false;
let generationCount = 0;
let speed = 5; // generations per second
let lastUpdateTime = 0;
let lastFadeUpdateTime = 0;
let updateInterval = 1000 / speed;
const FADE_DURATION = 1000; // 1 second to fade from alive to dead

// DOM Elements
let playPauseBtn;
let speedControl;
let speedValue;
let generationDisplay;
let livingCellsDisplay;
let clearBtn;
let randomBtn;
let add100Btn;
let helpBtn;
let modal;
let closeBtn;
let modalCloseBtn;
let patternButtons;
let patternStatus;

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
    add100Btn = document.getElementById('add100Btn');
    helpBtn = document.getElementById('helpBtn');
    modal = document.getElementById('helpModal');
    closeBtn = document.querySelector('.close-btn');
    modalCloseBtn = document.querySelector('.modal-close-btn');
    patternButtons = document.querySelectorAll('.pattern-btn');
    patternStatus = document.getElementById('patternStatus');
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
    opacityGrid = [];

    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        nextGrid[i] = [];
        opacityGrid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
            opacityGrid[i][j] = 0.0;
        }
    }

    generationCount = 0;
}

// Randomize the grid with a given fill percentage
function randomizeGrid(fillPercentage = 0.3) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < fillPercentage ? 1 : 0;
            opacityGrid[i][j] = grid[i][j]; // 1.0 for alive, 0.0 for dead
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
            opacityGrid[i][j] = 0.0;
        }
    }
    generationCount = 0;
    updateStats();
    drawGrid();
}

// Add 100 random cells to the grid
function add100RandomCells() {
    for (let i = 0; i < 100; i++) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);

        grid[randomRow][randomCol] = 1;
        opacityGrid[randomRow][randomCol] = 1.0;
    }
    updateStats();
    drawGrid();
}

// Place a pattern on the grid at specified position
function placePattern(pattern, startRow, startCol) {
    const patternData = PATTERNS[pattern];
    if (!patternData) return;

    for (let i = 0; i < patternData.length; i++) {
        for (let j = 0; j < patternData[i].length; j++) {
            const row = startRow + i;
            const col = startCol + j;

            // Check boundaries
            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                grid[row][col] = patternData[i][j];
                opacityGrid[row][col] = patternData[i][j]; // 1.0 for alive, 0.0 for dead
            }
        }
    }

    updateStats();
    drawGrid();
}

// Select a pattern
function selectPattern(pattern) {
    selectedPattern = pattern;

    // Update button states
    patternButtons.forEach(btn => {
        if (btn.dataset.pattern === pattern) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update status text
    if (pattern) {
        patternStatus.textContent = `Placing: ${pattern}`;
        patternStatus.classList.add('active');
        canvas.style.cursor = 'crosshair';
    } else {
        patternStatus.textContent = 'Click to place';
        patternStatus.classList.remove('active');
        canvas.style.cursor = 'pointer';
    }
}

// Deselect pattern
function deselectPattern() {
    selectPattern(null);
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

    // Copy nextGrid to grid and update opacity
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const oldState = grid[i][j];
            const newState = nextGrid[i][j];

            grid[i][j] = newState;

            // Update opacity based on state changes
            if (newState === 1 && oldState === 0) {
                // Cell is born - instantly full opacity
                opacityGrid[i][j] = 1.0;
            } else if (newState === 0 && oldState === 1) {
                // Cell just died - keep at 1.0, will fade in updateFade()
                opacityGrid[i][j] = 0.4;
            }
            // If cell stayed alive (1->1), keep opacity at 1.0
            // If cell stayed dead (0->0), opacity will fade in updateFade()
        }
    }

    generationCount++;
    updateStats();
}

// Update fade effect for dead cells (runs every frame)
function updateFade(deltaTime) {
    const fadeStep = deltaTime / FADE_DURATION;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 0 && opacityGrid[i][j] > 0) {
                // Cell is dead but still visible - fade it out
                opacityGrid[i][j] = Math.max(0, opacityGrid[i][j] - fadeStep);
            } else if (grid[i][j] === 1) {
                // Cell is alive - ensure full opacity
                opacityGrid[i][j] = 1.0;
            }
        }
    }
}

// Draw the grid on canvas
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const opacity = opacityGrid[i][j];

            if (opacity > 0) {
                // Calculate color with opacity
                const alpha = opacity.toFixed(2);
                ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
                ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                // Add a subtle glow effect (also with opacity)
                if (grid[i][j] === 1) {
                    ctx.shadowBlur = 3;
                    ctx.shadowColor = `rgba(16, 185, 129, ${alpha})`;
                }
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
    // Update fade effect every frame (independent of simulation speed)
    const fadeDelta = timestamp - lastFadeUpdateTime;
    if (fadeDelta > 0) {
        updateFade(fadeDelta);
        lastFadeUpdateTime = timestamp;
    }

    // Update simulation based on speed setting
    if (isRunning) {
        const elapsed = timestamp - lastUpdateTime;

        if (elapsed >= updateInterval) {
            updateGrid();
            lastUpdateTime = timestamp;
        }
    }

    // Always redraw to show fade effect
    drawGrid();

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

// Handle canvas clicks to toggle cells or place patterns
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
        if (selectedPattern) {
            // Place the selected pattern
            placePattern(selectedPattern, row, col);
            deselectPattern();
        } else {
            // Toggle individual cell
            grid[row][col] = grid[row][col] === 1 ? 0 : 1;
            opacityGrid[row][col] = grid[row][col]; // Set opacity to match state
            updateStats();
            drawGrid();
        }
    }
}

// Handle canvas drag to draw cells
let isDrawing = false;
let lastDrawnCell = null;

function handleCanvasMouseDown(event) {
    // Don't enable drawing mode if placing a pattern
    if (!selectedPattern) {
        isDrawing = true;
    }
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
        opacityGrid[row][col] = 1.0; // Full opacity
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
        deselectPattern();
        if (isRunning) togglePlayPause();
    });

    // Random button
    randomBtn.addEventListener('click', () => {
        randomizeGrid(INITIAL_FILL_PERCENTAGE);
        deselectPattern();
        if (isRunning) togglePlayPause();
    });

    // Add 100 cells button
    add100Btn.addEventListener('click', () => {
        add100RandomCells();
        deselectPattern();
    });

    // Pattern buttons
    patternButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pattern = btn.dataset.pattern;
            if (selectedPattern === pattern) {
                // Deselect if clicking the same pattern
                deselectPattern();
            } else {
                // Select the new pattern
                selectPattern(pattern);
            }
        });
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
        } else if (event.code === 'Escape') {
            deselectPattern();
        }
    });
}

