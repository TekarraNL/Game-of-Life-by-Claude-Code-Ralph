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

### 2. Preset Patterns (script.js:5-62)
The application includes 8 classic Game of Life patterns:

**Spaceships** (move across the grid):
- `glider`: 3x3 pattern that travels diagonally
- `lwss`: Lightweight Spaceship, 4x5 pattern that travels horizontally

**Oscillators** (repeat in cycles):
- `blinker`: 1x3 pattern, period 2
- `toad`: 2x4 pattern, period 2
- `beacon`: 4x4 pattern, period 2
- `pulsar`: 13x13 pattern, period 3
- `pentadecathlon`: 3x10 pattern, period 15

**Guns** (generate spaceships):
- `gliderGun`: Gosper Glider Gun, 9x36 pattern that creates gliders

Each pattern is stored as a 2D array where 1 = alive, 0 = dead.

### 3. Game State (script.js:67-81)
Global variables tracking:
- `grid`: Current generation state (2D array)
- `nextGrid`: Next generation buffer
- `opacityGrid`: Opacity values for fade effect (0.0 to 1.0)
- `isRunning`: Whether simulation is active
- `generationCount`: Number of generations elapsed
- `speed`: Generations per second (default: 3)
- `selectedPattern`: Currently selected pattern for placement (null if none)
- `lastFadeUpdateTime`: Timestamp for fade animation timing
- Canvas and timing variables
- `FADE_DURATION`: 1000ms (1 second) for cells to fade from alive to dead

### 4. Initialization Functions

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

#### `randomizeGrid(fillPercentage)` (script.js:158-168)
- Randomly populates grid based on fill percentage
- Default is 30% as per requirements
- Resets generation count and updates display

#### `clearGrid()` (script.js:169-178)
- Sets all cells to dead (0)
- Resets generation count
- Redraws the grid

### 5. Pattern Placement Functions

#### `placePattern(pattern, startRow, startCol)` (script.js:180-199)
- Places a preset pattern at specified grid position
- Checks boundaries to prevent overflow
- Updates display after placement

#### `selectPattern(pattern)` (script.js:201-224)
- Activates pattern placement mode
- Updates button visual states
- Changes cursor to crosshair
- Updates status text

#### `deselectPattern()` (script.js:226-229)
- Deactivates pattern placement mode
- Returns to normal cell toggle mode
- Restores pointer cursor

### 6. Game Logic - Conway's Rules

#### `countNeighbors(row, col)` (script.js:231-250)
- Counts living cells in 8 adjacent positions
- Handles edge boundaries properly
- Returns count (0-8)

#### `updateGrid()` (script.js:252-291)
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

### 7. Rendering

#### `drawGrid()` (script.js:330-372)
- Clears canvas every frame
- Draws cells using RGBA color with opacity from opacityGrid
- Only renders cells with opacity > 0 (optimization)
- Living cells (grid value = 1) get full glow effect
- Fading cells (grid value = 0, opacity > 0) appear dimmer without glow
- Uses `rgba(16, 185, 129, ${opacity})` for smooth transparency
- Draws grid lines for better visibility

#### `updateStats()` (script.js:333-345)
- Counts total living cells
- Updates generation counter display
- Updates living cells counter display

### 8. Fade Effect System

#### `updateFade(deltaTime)` (script.js:313-328)
- Updates opacity values for all cells every frame
- Independent of simulation speed (runs in real-time)
- Dead cells fade from opacity 1.0 to 0.0 over 1 second
- Living cells maintain opacity 1.0
- Uses delta time for smooth, consistent fading

**Fade Logic:**
- When cell dies: opacity starts at 1.0, decreases linearly over FADE_DURATION
- When cell is born: opacity instantly set to 1.0
- Fade rate: `deltaTime / 1000ms` per frame

### 9. Game Loop

#### `gameLoop(timestamp)` (script.js:390-413)
- Uses `requestAnimationFrame` for smooth animation
- Updates fade effect every frame (independent of simulation speed)
- Updates simulation based on speed setting when running
- Always redraws grid to show fade animation
- Maintains separate timing for fade (lastFadeUpdateTime) and simulation (lastUpdateTime)

### 10. User Interaction Functions

#### `togglePlayPause()` (script.js:360-374)
- Switches between playing and paused states
- Updates button icon (▶/⏸) and text
- Manages timing for consistent frame rate

#### `updateSpeed()` (script.js:376-382)
- Reads slider value (1-10)
- Updates interval calculation
- Updates speed display

#### `handleCanvasClick(event)` (script.js:384-405)
- Converts mouse coordinates to grid position
- If pattern selected: places pattern at clicked position and deselects
- If no pattern: toggles individual cell state (alive ↔ dead)
- Updates display immediately

#### Canvas Drawing Functions (script.js:407-438)
- `handleCanvasMouseDown`: Starts drawing mode (disabled when placing patterns)
- `handleCanvasMouseUp`: Stops drawing mode
- `handleCanvasMouseMove`: Draws cells while dragging
- Allows users to "paint" living cells

### 11. Modal Management (script.js:501-513)
- `showHelpModal()`: Displays help information
- `hideHelpModal()`: Closes the modal

### 12. Event Listeners Setup (script.js:515-592)

Registers handlers for:
- **Play/Pause button**: Space bar or button click
- **Speed slider**: Real-time speed adjustment
- **Clear button**: Removes all cells and deselects patterns (also 'C' key)
- **Randomize button**: Creates new pattern and deselects patterns (also 'R' key)
- **Pattern buttons**: Select/deselect preset patterns for placement
- **Canvas interactions**: Click to place patterns or drag to draw cells
- **Help modal**: Show/hide with button or outside click
- **Window resize**: Reinitializes canvas and grid
- **Keyboard shortcuts**:
  - Space (play/pause)
  - C (clear)
  - R (random)
  - Escape (deselect pattern)

## Data Structures

### Grid Representation
```javascript
grid[row][col] = 0 or 1
opacityGrid[row][col] = 0.0 to 1.0
```
- `grid`: Cell state (0 = dead, 1 = alive)
- `opacityGrid`: Cell opacity for rendering (0.0 = invisible, 1.0 = full brightness)
- Two grids used for state (double buffering) to prevent race conditions
- Opacity grid enables smooth fade effect independent of game state

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
6. **Preset Patterns**: 8 pattern buttons in a 2-column grid
   - Visual feedback with active state
   - Emoji icons for each pattern type
   - Status indicator showing selected pattern
7. **Help Button**: Dashed border, bottom-aligned

### Canvas Interactions
- **Click**: Toggle single cell or place selected pattern
- **Drag**: Paint multiple cells (disabled when pattern selected)
- **Visual Feedback**:
  - Pointer cursor in normal mode
  - Crosshair cursor in pattern placement mode
  - Smooth fade effect: cells dim over 1 second when dying

### Visual Effects
- **Fade Animation**: Dead cells gradually fade from full brightness to invisible over 1 second
  - Independent of simulation speed (runs at 60 FPS)
  - Provides visual continuity and makes the simulation easier to follow
  - Living cells maintain full opacity and glow effect
  - Fading cells lose their glow as they dim

### Keyboard Shortcuts
- **Space**: Play/Pause
- **C**: Clear grid
- **R**: Randomize
- **Escape**: Deselect pattern

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

## Pattern Placement Feature

### How It Works
1. User clicks a pattern button to select it
2. Button highlights with gradient background
3. Status text shows "Placing: [pattern name]"
4. Cursor changes to crosshair
5. User clicks on grid to place pattern
6. Pattern is automatically deselected after placement
7. User can press Escape to cancel

### Pattern Categories
- **Spaceships**: Move across the grid (Glider, LWSS)
- **Oscillators**: Repeat in cycles (Blinker, Toad, Beacon, Pulsar, Pentadecathlon)
- **Guns**: Generate other patterns (Gosper Glider Gun)

### Implementation Benefits
- Educational: Users learn about famous Game of Life patterns
- Convenient: No need to manually draw complex patterns
- Interactive: Immediate visual feedback
- Discoverable: Tooltips explain each pattern

## Future Enhancement Ideas

1. **Save/Load**: Export/import grid states
2. **Color Themes**: Multiple color schemes
3. **Cell Age**: Color cells based on how long they've been alive
4. **Infinite Grid**: Toroidal wrapping or pan/zoom
5. **Performance**: WebGL renderer for larger grids
6. **Mobile Touch**: Better touch support for tablets/phones
7. **More Patterns**: Add additional classic patterns (Acorn, R-pentomino, etc.)
8. **Pattern Rotation**: Rotate patterns before placement

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

### Original Requirements
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

### Enhanced Features
✅ Preset pattern buttons for 8 classic Game of Life patterns
✅ Interactive pattern placement with visual feedback
✅ Pattern categorization (Spaceships, Oscillators, Guns)
✅ Keyboard shortcut to deselect patterns (Escape)
✅ Tooltips explaining each pattern
✅ Drag-to-draw functionality
✅ Real-time statistics
✅ Additional keyboard shortcuts
✅ Smooth fade animation for dying cells (1 second duration)
✅ Frame-rate independent fade effect (separate from simulation speed)
✅ Enhanced visual continuity with opacity transitions

## License & Credits

Implementation based on Conway's Game of Life
Created: 2026
Technology: HTML5, CSS3, ES6 JavaScript
