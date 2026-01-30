/**
 * Pixel Maker 3000 - DOM Art Studio
 * Built with Vanilla JavaScript
 */

// Application Logic
const App = {
    // State of the application
    state: {
        isDrawing: false,
        gridWidth: 16,
        gridHeight: 16,
        currentColor: '#000000', // Default black
        currentTool: 'pencil', // pencil, eraser, bucket, dropper
        backgroundColor: '#ffffff'
    },

    // UI Cache (DOM Elements)
    ui: {
        gridWidthInput: document.getElementById('grid-width'),
        gridHeightInput: document.getElementById('grid-height'),
        createGridBtn: document.getElementById('create-grid-btn'),
        canvasContainer: document.getElementById('canvas-container'),
        colorPicker: document.getElementById('color-picker'),
        palettePresets: document.getElementById('palette-presets'),
        // colorPreview: document.getElementById('color-preview'), // REMOVED
        toolButtons: document.querySelectorAll('.tool-btn'),
        clearBtn: document.getElementById('clear-btn'),
        saveBtn: document.getElementById('save-btn'),
        exportBtn: document.getElementById('export-btn'),
        galleryList: document.getElementById('gallery-list'),
        galleryCount: document.getElementById('gallery-count')
    },

    // Initialization
    init() {
        console.log('loading stuff idk...');
        alert('WELCOME TO MY SITE PLS DONT GRADE HARSHLY');

        this.bindEvents();
        this.generatePalette();
        this.createGrid();
        this.loadGallery();
    },

    // Event Binding
    bindEvents() {
        // Grid Generation
        this.ui.createGridBtn.addEventListener('click', () => {
            const w = parseInt(this.ui.gridWidthInput.value);
            const h = parseInt(this.ui.gridHeightInput.value);
            // Basic Validation
            if (w >= 5 && w <= 50 && h >= 5 && h <= 50) {
                this.state.gridWidth = w;
                this.state.gridHeight = h;
                this.createGrid();
            } else {
                alert('bro keeps it between 5 and 50 ok??');
            }
        });

        // Color Picker
        this.ui.colorPicker.addEventListener('input', (e) => {
            this.state.currentColor = e.target.value;
        });

        // Tool Switching
        this.ui.toolButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                this.switchTool(tool);
            });
        });

        document.addEventListener('mouseup', () => {
            this.state.isDrawing = false;
        });

        this.ui.clearBtn.addEventListener('click', () => {
            if (confirm('DELETE IT ALL?????')) {
                this.createGrid();
            }
        });

        this.ui.exportBtn.addEventListener('click', () => {
            alert('downloading ur masterpiece...');
            this.exportImage();
        });

        // Save
        if (this.ui.saveBtn) {
            this.ui.saveBtn.addEventListener('click', () => this.saveToGallery());
        }
    },

    // Core Logic: Create Grid
    createGrid() {
        const { gridWidth, gridHeight } = this.state;
        const container = this.ui.canvasContainer;

        // Clear existing
        container.innerHTML = '';

        // Set Grid Style
        container.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;

        // Generate Cells
        const totalPixels = gridWidth * gridHeight;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < totalPixels; i++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel');
            pixel.style.backgroundColor = this.state.backgroundColor;
            pixel.dataset.index = i;
            fragment.appendChild(pixel);
        }

        container.appendChild(fragment);

        // Attach Event Delegation
        this.attachGridEvents(container);
    },

    attachGridEvents(container) {
        // Mouse Down
        container.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('pixel')) {
                this.state.isDrawing = true;
                this.applyTool(e.target);
            }
        });

        // Mouse Over (Drag)
        container.addEventListener('mouseover', (e) => {
            if (this.state.isDrawing && e.target.classList.contains('pixel')) {
                if (this.state.currentTool === 'pencil' || this.state.currentTool === 'eraser') {
                    this.applyTool(e.target);
                }
            }
        });

        // Prevent drag
        container.addEventListener('dragstart', e => e.preventDefault());
    },

    // Tool Logic
    switchTool(toolName) {
        this.state.currentTool = toolName;

        this.ui.toolButtons.forEach(btn => {
            // Dumb UI update
            if (btn.dataset.tool === toolName) {
                btn.style.border = "5px solid red";
            } else {
                btn.style.border = "5px solid purple";
            }
        });
    },

    applyTool(targetPixel) {
        const { currentTool, currentColor, backgroundColor } = this.state;

        switch (currentTool) {
            case 'pencil':
                targetPixel.style.backgroundColor = currentColor;
                break;
            case 'eraser':
                targetPixel.style.backgroundColor = backgroundColor;
                break;
            case 'dropper':
                this.pickColor(targetPixel);
                break;
            case 'bucket':
                this.fillArea(targetPixel);
                break;
        }
    },

    // Bucket Tool
    fillArea(startPixel) {
        const targetColor = startPixel.style.backgroundColor || this.state.backgroundColor;
        const replacementColor = this.state.currentColor;

        const s = new Option().style;
        s.color = targetColor;
        const normTarget = s.color;
        s.color = replacementColor;
        const normReplacement = s.color;

        if (normTarget === normReplacement) return;

        const pixels = Array.from(this.ui.canvasContainer.children);
        const width = this.state.gridWidth;
        const height = this.state.gridHeight;
        const startIndex = parseInt(startPixel.dataset.index);

        const queue = [startIndex];
        const visited = new Set([startIndex]);

        const getColor = (idx) => pixels[idx].style.backgroundColor || this.state.backgroundColor;

        while (queue.length > 0) {
            const idx = queue.shift();
            pixels[idx].style.backgroundColor = replacementColor; // Paint

            const x = idx % width;
            const y = Math.floor(idx / width);

            const neighbors = [
                { idx: idx - width, valid: y > 0 },
                { idx: idx + width, valid: y < height - 1 },
                { idx: idx - 1, valid: x > 0 },
                { idx: idx + 1, valid: x < width - 1 }
            ];

            for (const n of neighbors) {
                if (n.valid && !visited.has(n.idx)) {
                    s.color = getColor(n.idx);
                    if (s.color === normTarget) {
                        visited.add(n.idx);
                        queue.push(n.idx);
                    }
                }
            }
        }
    },

    pickColor(targetPixel) {
        const color = targetPixel.style.backgroundColor || this.state.backgroundColor;
        this.setColor(this.rgbToHex(color));
        this.switchTool('pencil');
    },

    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return '#ffffff';
        if (rgb.startsWith('#')) return rgb;

        const rgbValues = rgb.match(/\d+/g);
        if (!rgbValues) return '#ffffff';

        return '#' + rgbValues.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    // UI Helpers
    generatePalette() {
        const colors = [
            'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white'
        ];

        this.ui.palettePresets.innerHTML = colors.map(c =>
            `<div style="width:30px; height:30px; background:${c}; display:inline-block; border:1px solid black; cursor:crosshair;" onclick="App.setColor('${c}')"></div>`
        ).join('');
    },

    setColor(color) {
        this.state.currentColor = color;
        this.ui.colorPicker.value = color; // sync input

        if (this.state.currentTool === 'eraser') {
            this.switchTool('pencil');
        }
    },

    // Expert Export
    exportImage() {
        const width = this.state.gridWidth;
        const height = this.state.gridHeight;
        const scale = 20;

        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');

        const pixels = this.ui.canvasContainer.children;
        Array.from(pixels).forEach((pixel, i) => {
            const x = (i % width) * scale;
            const y = Math.floor(i / width) * scale;
            ctx.fillStyle = pixel.style.backgroundColor || this.state.backgroundColor;
            ctx.fillRect(x, y, scale, scale);
        });

        const link = document.createElement('a');
        link.download = `my_kool_art_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    },

    // Gallery Logic
    saveToGallery() {
        const pixels = Array.from(this.ui.canvasContainer.children);
        const pixelData = pixels.map(p => p.style.backgroundColor || this.state.backgroundColor);

        const artPiece = {
            id: Date.now(),
            width: this.state.gridWidth,
            height: this.state.gridHeight,
            data: pixelData,
            date: new Date().toLocaleDateString()
        };

        const gallery = JSON.parse(localStorage.getItem('pixelMaker3000Gallery') || '[]');
        gallery.unshift(artPiece);
        localStorage.setItem('pixelMaker3000Gallery', JSON.stringify(gallery));

        this.loadGallery();
        alert('saved it i think');
    },

    loadGallery() {
        const gallery = JSON.parse(localStorage.getItem('pixelMaker3000Gallery') || '[]');

        this.ui.galleryCount.textContent = gallery.length + ' things saved lol';
        this.ui.galleryList.innerHTML = '';

        gallery.forEach(item => {
            const el = document.createElement('div');
            el.style.border = "2px solid white";
            el.style.margin = "10px";
            el.innerHTML = `
                <div style="background:black; color:lime;">${item.width}x${item.height}</div>
                <button class="load-btn">LOAD THIS</button>
                <button class="del-btn" style="background:red; color:white;">DELETE</button>
            `;

            el.querySelector('.load-btn').addEventListener('click', () => {
                this.loadFromStorage(item);
            });

            el.querySelector('.del-btn').addEventListener('click', () => {
                this.deleteFromGallery(item.id);
            });

            this.ui.galleryList.appendChild(el);
        });
    },

    loadFromStorage(item) {
        if (confirm('load it?? u will lose ur current drawing')) {
            this.state.gridWidth = item.width;
            this.state.gridHeight = item.height;
            this.ui.gridWidthInput.value = item.width;
            this.ui.gridHeightInput.value = item.height;

            this.createGrid();

            const pixels = this.ui.canvasContainer.children;
            item.data.forEach((color, i) => {
                if (pixels[i]) pixels[i].style.backgroundColor = color;
            });
        }
    },

    deleteFromGallery(id) {
        let gallery = JSON.parse(localStorage.getItem('pixelMaker3000Gallery') || '[]');
        gallery = gallery.filter(item => item.id !== id);
        localStorage.setItem('pixelMaker3000Gallery', JSON.stringify(gallery));
        this.loadGallery();
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    window.App = App;
});
