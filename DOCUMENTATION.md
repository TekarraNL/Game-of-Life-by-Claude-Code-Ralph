# Game of Life - Code Documentation

## Overview
This is a modern implementation of Conway's Game of Life, a cellular automaton created by mathematician John Conway in 1970. The application features a responsive grid-based simulation with an intuitive user interface.

## File Structure

### index.html
The main HTML structure containing:
- **Menu Panel**: Left sidebar with controls and statistics
- **Canvas Container**: Main display area for the game grid
- **Help Modal**: Informational popup explaining the game rules

### styles.css
Modern, responsive styling with:
- **CSS Variables**: Centralized color scheme and design tokens
- **Gradient Effects**: Smooth color transitions for buttons and backgrounds
- **Animations**: Fade-in and slide-down effects for modals
- **Responsive Design**: Flexbox layout that adapts to screen size

### script.js
Core game logic and interactivity

## Key Components

### 1. Configuration (script.js:1-3)
```javascript
const CELL_SIZE = 10;
const INITIAL_FILL_PERCENTAGE = 0.3;
```
- `CELL_SIZE`: Each cell is 10x10 pixels as per requirements
- `INITIAL_FILL_PERCENTAGE`: 30% of cells start alive

### 2. Game State (script.js:5-13)
Global variables tracking:
- `grid`: Current generation state (2D array)
- `nextGrid`: Next generation buffer
- `isRunning`: Whether simulation is active
- `generationCount`: Number of generations elapsed
- `speed`: Generations per second (default: 3)
- Canvas and timing variables

### 3. Initialization Functions

#### `initializeDOM()` (script.js:27-43)
- Caches references to all DOM elements
- Called once on page load

#### `initializeCanvas()` (script.js:45-56)
- Calculates grid dimensions based on window size
- Sets canvas width/height to fit available space
- Each cell is exactly 10x10 pixels

#### `initializeGrid()` (script.js:58-72)
- Creates 2D arrays for current and next generation
- Initializes all cells to dead (0)
- Resets generation counter

### 4. Grid Management Functions

#### `randomizeGrid(fillPercentage)` (script.js:74-84)
- Randomly populates grid based on fill percentage
- Default is 30% as per requirements
- Resets generation count and updates display

#### `clearGrid()` (script.js:86-96)
- Sets all cells to dead (0)
- Resets generation count
- Redraws the grid

### 5. Game Logic - Conway's Rules

#### `countNeighbors(row, col)` (script.js:98-117)
- Counts living cells in 8 adjacent positions
- Handles edge boundaries properly
- Returns count (0-8)

#### `updateGrid()` (script.js:119-158)
Implements Conway's Game of Life rules:

**Birth**: Dead cell with exactly 3 neighbors becomes alive
```javascript
if (neighbors === 3) {
    nextGrid[i][j] = 1;
}
```

**Survival**: Living cell with 2-3 neighbors stays alive
```javascript
if (currentCell === 1 && (neighbors === 2 || neighbors === 3)) {
    nextGrid[i][j] = 1;
}
```

**Death by Underpopulation**: Living cell with <2 neighbors dies
```javascript
if (neighbors < 2) {
    nextGrid[i][j] = 0;
}
```

**Death by Overpopulation**: Living cell with >3 neighbors dies
```javascript
if (neighbors > 3) {
    nextGrid[i][j] = 0;
}
```

### 6. Rendering

#### `drawGrid()` (script.js:160-198)
- Clears canvas
- Draws living cells with green color (#10b981)
- Adds glow effect for visual appeal
- Draws grid lines for better visibility

#### `updateStats()` (script.js:200-212)
- Counts total living cells
- Updates generation counter display
- Updates living cells counter display

### 7. Game Loop

#### `gameLoop(timestamp)` (script.js:214-225)
- Uses `requestAnimationFrame` for smooth animation
- Only updates when `isRunning` is true
- Respects speed setting (updates per second)
- Continuously runs to enable responsive drawing

### 8. User Interaction Functions

#### `togglePlayPause()` (script.js:227-241)
- Switches between playing and paused states
- Updates button icon (▶/⏸) and text
- Manages timing for consistent frame rate

#### `updateSpeed()` (script.js:243-247)
- Reads slider value (1-10)
- Updates interval calculation
- Updates speed display

#### `handleCanvasClick(event)` (script.js:249-262)
- Converts mouse coordinates to grid position
- Toggles cell state (alive ↔ dead)
- Updates display immediately

#### Canvas Drawing Functions (script.js:264-302)
- `handleCanvasMouseDown`: Starts drawing mode
- `handleCanvasMouseUp`: Stops drawing mode
- `handleCanvasMouseMove`: Draws cells while dragging
- Allows users to "paint" living cells

### 9. Modal Management (script.js:304-313)
- `showHelpModal()`: Displays help information
- `hideHelpModal()`: Closes the modal

### 10. Event Listeners Setup (script.js:315-374)

Registers handlers for:
- **Play/Pause button**: Space bar or button click
- **Speed slider**: Real-time speed adjustment
- **Clear button**: Removes all cells (also 'C' key)
- **Randomize button**: Creates new pattern (also 'R' key)
- **Canvas interactions**: Click and drag to edit cells
- **Help modal**: Show/hide with button or outside click
- **Window resize**: Reinitializes canvas and grid
- **Keyboard shortcuts**: Space (play/pause), C (clear), R (random)

## Data Structures

### Grid Representation
```javascript
grid[row][col] = 0 or 1
```
- `0`: Dead cell
- `1`: Living cell
- Two grids used (double buffering) to prevent race conditions

## Performance Optimizations

1. **Double Buffering**: Separate `grid` and `nextGrid` prevent read/write conflicts
2. **RequestAnimationFrame**: Browser-optimized rendering loop
3. **Canvas API**: Hardware-accelerated drawing
4. **Event Delegation**: Efficient event handling

## CSS Architecture

### Design System (styles.css:7-21)
Uses CSS custom properties for consistent theming:
- Primary colors: Purple/indigo gradient
- Dark theme: Navy blue backgrounds
- Accent color: Emerald green (#10b981) for living cells

### Layout Strategy
- **Flexbox**: Main container layout
- **Fixed Sidebar**: 300px menu panel
- **Flexible Canvas**: Takes remaining space
- **Responsive**: Adapts to window size

### Visual Effects
- **Box Shadows**: Depth and elevation
- **Gradients**: Modern color transitions
- **Hover States**: Interactive feedback
- **Animations**: Smooth transitions (0.3s ease)

## User Interface Features

### Menu Panel Components
1. **Header**: Gradient title bar
2. **Play/Pause Button**: Large primary action button
3. **Speed Control**: Slider with visual feedback (1-10 generations/second)
4. **Statistics Panel**: Real-time generation and population count
5. **Secondary Actions**: Clear and Randomize buttons
6. **Help Button**: Dashed border, bottom-aligned

### Canvas Interactions
- **Click**: Toggle single cell
- **Drag**: Paint multiple cells
- **Visual Feedback**: Hover cursor changes to pointer

### Keyboard Shortcuts
- **Space**: Play/Pause
- **C**: Clear grid
- **R**: Randomize

## Game Rules Implementation

### Neighbor Counting Algorithm
```
For each cell at (row, col):
    Check all 8 adjacent cells:
        (row-1, col-1) (row-1, col) (row-1, col+1)
        (row,   col-1) [CELL]       (row,   col+1)
        (row+1, col-1) (row+1, col) (row+1, col+1)

    Count living neighbors (skip out-of-bounds)
```

### Rule Application
```
Current State | Neighbors | Next State | Reason
-------------|-----------|-----------|--------
Alive        | 0-1       | Dead      | Underpopulation
Alive        | 2-3       | Alive     | Survival
Alive        | 4-8       | Dead      | Overpopulation
Dead         | 3         | Alive     | Birth
Dead         | 0-2,4-8   | Dead      | Stays dead
```

## Browser Compatibility

### Required Features
- ES6 JavaScript (const, let, arrow functions)
- Canvas API
- RequestAnimationFrame
- CSS Grid/Flexbox
- CSS Custom Properties

### Tested Browsers
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Future Enhancement Ideas

1. **Patterns Library**: Pre-defined patterns (gliders, blinkers, etc.)
2. **Save/Load**: Export/import grid states
3. **Color Themes**: Multiple color schemes
4. **Cell Age**: Color cells based on how long they've been alive
5. **Infinite Grid**: Toroidal wrapping or pan/zoom
6. **Performance**: WebGL renderer for larger grids
7. **Mobile Touch**: Better touch support for tablets/phones

## Troubleshooting

### Common Issues

**Grid doesn't update**
- Check if simulation is running (play button)
- Verify speed setting is not at minimum

**Canvas appears small**
- Browser window may be small
- Canvas auto-sizes to fit available space

**Cells don't toggle on click**
- Ensure click is within canvas bounds
- Check browser console for errors

## Code Maintenance

### Adding New Features
1. Add UI elements in `index.html`
2. Style in `styles.css` following existing patterns
3. Implement logic in `script.js`
4. Register event listeners in `setupEventListeners()`

### Modifying Game Rules
- Edit `updateGrid()` function
- Change neighbor count thresholds
- Adjust birth/survival conditions

### Changing Visual Style
- Modify CSS custom properties in `:root`
- Update colors, shadows, or animations
- Change `CELL_SIZE` constant for different grid density

## Requirements Checklist

✅ Full-screen website covering user screen
✅ Grid broken down into 10x10 pixel cells
✅ Left-side menu with start/pause button
✅ Speed control (default 3 per second)
✅ Click to add/remove cells
✅ Help button (?) explaining Conway's Game of Life
✅ 30% of cells randomly filled on load
✅ Modern, aesthetically pleasing design
✅ Visual effects and smooth animations
✅ Separate documentation
✅ No errors

## License & Credits

Implementation based on Conway's Game of Life
Created: 2026
Technology: HTML5, CSS3, ES6 JavaScript
