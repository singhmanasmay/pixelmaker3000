# Pixel Maker 3000: DOM-Based Pixel Art Studio
### Web Dev II (Batch 2029) Final Project

## 📌 Overview
**Pixel Maker 3000** is a fully functional, interactive pixel art editor built entirely with **Vanilla JavaScript** and **DOM Manipulation**. It allows users to create, save, and export pixel art directly in the browser without any external libraries or frameworks.

The project demonstrates advanced DOM concepts including event delegation, dynamic element generation, client-side state management, and recursive algorithms for image manipulation.

---

## 🚀 Key Features

### 1. Dynamic Canvas Engine
- Users can generate custom grid sizes (from 5x5 to 50x50).
- The grid is constructed dynamically using JS `createElement` loop logic, not hardcoded HTML.
- **Drawing Mechanics**: Supports "Click and Drag" painting using `mousedown` and `mouseover` state tracking.

### 2. Advanced Tool Set
- **Pencil & Eraser**: precise pixel manipulation.
- **Color Picker**: Input type color with custom palette presets.
- **Dropper Tool**: extract colors from existing pixels.
- **Bucket Fill (Flood Fill)**: Implements a **Breadth-First Search (BFS) algorithm** to recursively fill connected pixels of the same color.

### 3. Smart Persistence (LocalStorage)
- **Gallery System**: Artwork is serialized to JSON and saved in the browser's `LocalStorage`.
- Users can close the browser and return to find their saved gallery intact.
- **Load & Edit**: Saved projects can be reloaded onto the canvas for further editing.

### 4. Export Functionality
- Converts the DOM-based grid into a raster image (`.png`) using an off-screen HTML5 Canvas for download.

---

## 🛠️ Technical Concepts Used

### 1. Advanced DOM Manipulation
- **Code-Based Rendering**: The entire application state is reflected in the DOM. Logic dictates UI, not the other way around.
- **Element Lifecycle**: Pixels and gallery items are created, appended, and removed dynamically based on user interaction.

### 2. Event Delegation
- Instead of attaching 2,500 event listeners for a 50x50 grid, we attach **single** listeners to the parent `#canvas-container`.
- The `e.target` property is used to identify which pixel was interacted with, significantly improving memory usage and performance.

### 3. State Management
- The application uses a centralized `state` object within the `App` module to track:
    - Current Tool (`pencil`, `bucket`, etc.)
    - Grid Dimensions
    - Active Colors
    - Drawing Status (`isDrawing` flag)

### 4. Algorithms
- **Flood Fill**: A custom implementation of the Flood Fill algorithm (BFS) was written to handle the "Bucket" tool, using an array-based queue to traverse DOM indices.

---

## 🎨 UI/UX Design Choice (IMPORTANT READ THIS)
The User Interface employs a **"Maximalist Retro-Chaos"** aesthetic (Marquees, clashing neon, Comic Sans). 

**Is this ugly?** No, it is *art*.
**Is it easy to use?** It builds character.

---

## 🏃‍♂️ How to Run
1. Clone this repository.
2. Open `index.html` in any browser.
3. **WARNING**: Do not look directly at the marquee for too long.

## 🐛 Known Limitations / Features
- Very large grids (>60x60) might lag. Consider this a "thinking time" feature for the user.
- **Eyestrain**: High probability. Use sunglasses.

---

**Student Name**: [Your Name]
**Marks Expected**: 100 (pls)
