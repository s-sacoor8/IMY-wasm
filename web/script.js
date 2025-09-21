import init, { Rgb, Hsl } from './IMY_wasm.js';

async function run() {
    try {
        await init();
        console.log("WebAssembly module loaded successfully!");

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
        
        const colorBox = document.getElementById('color-box');
        const colorHex = document.getElementById('color-hex');
        const rgbResult = document.getElementById('rgb-result');
        const hslResult = document.getElementById('hsl-result');

        let isUpdating = false;

        [rSlider, gSlider, bSlider].forEach((slider, index) => {
            const valueInput = [rValue, gValue, bValue][index];
            
            slider.addEventListener('input', () => {
                if (isUpdating) return;
                valueInput.value = slider.value;
                updateFromRGB();
            });
            
            valueInput.addEventListener('input', () => {
                if (isUpdating) return;
                slider.value = valueInput.value;
                updateFromRGB();
            });
        });

        [hSlider, sSlider, lSlider].forEach((slider, index) => {
            const valueInput = [hValue, sValue, lValue][index];
            
            slider.addEventListener('input', () => {
                if (isUpdating) return;
                valueInput.value = slider.value;
                updateFromHSL();
            });
            
            valueInput.addEventListener('input', () => {
                if (isUpdating) return;
                slider.value = valueInput.value;
                updateFromHSL();
            });
        });

        function updateFromRGB() {
            isUpdating = true;
            
            const r = parseInt(rSlider.value);
            const g = parseInt(gSlider.value);
            const b = parseInt(bSlider.value);
            
            const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            colorBox.style.backgroundColor = hexColor;
            colorHex.textContent = hexColor.toUpperCase();
            
            const rgb = new Rgb(r, g, b);
            const hsl = rgb.to_hsl();
            
            hSlider.value = Math.round(hsl.h);
            hValue.value = Math.round(hsl.h);
            sSlider.value = Math.round(hsl.s);
            sValue.value = Math.round(hsl.s);
            lSlider.value = Math.round(hsl.l);
            lValue.value = Math.round(hsl.l);
            
            rgbResult.textContent = `RGB: ${r}, ${g}, ${b}`;
            hslResult.textContent = `HSL: ${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`;
            
            isUpdating = false;
        }

        function updateFromHSL() {
            isUpdating = true;
            
            const h = parseFloat(hSlider.value);
            const s = parseFloat(sSlider.value);
            const l = parseFloat(lSlider.value);
            
            const hsl = new Hsl(h, s, l);
            const rgb = hsl.to_rgb();
            
            rSlider.value = rgb.r;
            rValue.value = rgb.r;
            gSlider.value = rgb.g;
            gValue.value = rgb.g;
            bSlider.value = rgb.b;
            bValue.value = rgb.b;
            
            const hexColor = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
            colorBox.style.backgroundColor = hexColor;
            colorHex.textContent = hexColor.toUpperCase();
            
            rgbResult.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
            hslResult.textContent = `HSL: ${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%`;
            
            isUpdating = false;
        }

        updateFromRGB();
        
    } catch (error) {
        console.error("Error loading WebAssembly module:", error);
        alert("Failed to load WebAssembly module. Check the console for details.");
    }
}

run();