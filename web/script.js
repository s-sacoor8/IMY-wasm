// Import the WebAssembly module
import init, { Rgb, Hsl } from './IMY_wasm.js';
// Wait for the WASM module to load
async function run() {
    try {
        // Initialize the WebAssembly module
        await init();
        console.log("WebAssembly module loaded successfully!");

        // Get DOM elements
        const rSlider = document.getElementById('r');
        const gSlider = document.getElementById('g');
        const bSlider = document.getElementById('b');
        const rValue = document.getElementById('r-value');
        const gValue = document.getElementById('g-value');
        const bValue = document.getElementById('b-value');
        
        const hSlider = document.getElementById('h');
        const sSlider = document.getElementById('s');
        const lSlider = document.getElementById('l');
        const hValue = document.getElementById('h-value');
        const sValue = document.getElementById('s-value');
        const lValue = document.getElementById('l-value');
        
        const convertToHslBtn = document.getElementById('convert-to-hsl');
        const convertToRgbBtn = document.getElementById('convert-to-rgb');
        
        const colorBox = document.getElementById('color-box');
        const colorHex = document.getElementById('color-hex');
        const rgbResult = document.getElementById('rgb-result');
        const hslResult = document.getElementById('hsl-result');

        // Sync slider and number inputs for RGB
        [rSlider, gSlider, bSlider].forEach((slider, index) => {
            const valueInput = [rValue, gValue, bValue][index];
            slider.addEventListener('input', () => {
                valueInput.value = slider.value;
                updateColorPreview();
            });
            
            valueInput.addEventListener('input', () => {
                slider.value = valueInput.value;
                updateColorPreview();
            });
        });

        // Sync slider and number inputs for HSL
        [hSlider, sSlider, lSlider].forEach((slider, index) => {
            const valueInput = [hValue, sValue, lValue][index];
            slider.addEventListener('input', () => {
                valueInput.value = slider.value;
            });
            
            valueInput.addEventListener('input', () => {
                slider.value = valueInput.value;
            });
        });

        // Update color preview based on RGB values
        function updateColorPreview() {
            const r = parseInt(rSlider.value);
            const g = parseInt(gSlider.value);
            const b = parseInt(bSlider.value);
            
            const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            colorBox.style.backgroundColor = hexColor;
            colorHex.textContent = hexColor;
        }

        // Convert RGB to HSL using WASM
        convertToHslBtn.addEventListener('click', () => {
            const r = parseInt(rSlider.value);
            const g = parseInt(gSlider.value);
            const b = parseInt(bSlider.value);
            
            // Create RGB object using WASM
            const rgb = new Rgb(r, g, b);
            
            // Convert to HSL
            const hsl = rgb.to_hsl();
            
            // Update HSL inputs and display results
            hSlider.value = hsl.h;
            hValue.value = hsl.h;
            sSlider.value = hsl.s;
            sValue.value = hsl.s;
            lSlider.value = hsl.l;
            lValue.value = hsl.l;
            
            hslResult.textContent = `HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
            rgbResult.textContent = `RGB: ${r}, ${g}, ${b}`;
        });

        // Convert HSL to RGB using WASM
        convertToRgbBtn.addEventListener('click', () => {
            const h = parseFloat(hSlider.value);
            const s = parseFloat(sSlider.value);
            const l = parseFloat(lSlider.value);
            
            // Create HSL object using WASM
            const hsl = new Hsl(h, s, l);
            
            // Convert to RGB
            const rgb = hsl.to_rgb();
            
            // Update RGB inputs and display results
            rSlider.value = rgb.r;
            rValue.value = rgb.r;
            gSlider.value = rgb.g;
            gValue.value = rgb.g;
            bSlider.value = rgb.b;
            bValue.value = rgb.b;
            
            updateColorPreview();
            rgbResult.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
            hslResult.textContent = `HSL: ${h}°, ${s}%, ${l}%`;
        });

        // Initialize the color preview
        updateColorPreview();
        
    } catch (error) {
        console.error("Error loading WebAssembly module:", error);
        alert("Failed to load WebAssembly module. Check the console for details.");
    }
}

// Run the application
run();