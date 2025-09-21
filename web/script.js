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
        
        const convertToHslBtn = document.getElementById('convert-to-hsl');
        const convertToRgbBtn = document.getElementById('convert-to-rgb');
        
        const colorBox = document.getElementById('color-box');
        const colorHex = document.getElementById('color-hex');
        const rgbResult = document.getElementById('rgb-result');
        const hslResult = document.getElementById('hsl-result');
        let lastMovedSliders = 'rgb';

        [rSlider, gSlider, bSlider].forEach((slider, index) => {
            const valueInput = [rValue, gValue, bValue][index];
            slider.addEventListener('input', () => {
                lastMovedSliders = 'rgb';
                valueInput.value = slider.value;
                updateColorPreview();
            });
            
            valueInput.addEventListener('input', () => {
                lastMovedSliders = 'rgb';
                slider.value = valueInput.value;
                updateColorPreview();
            });
        });

        [hSlider, sSlider, lSlider].forEach((slider, index) => {
            const valueInput = [hValue, sValue, lValue][index];
            slider.addEventListener('input', () => {
                lastMovedSliders = 'hsl';
                valueInput.value = slider.value;
                updateColorPreview();
            });
            
            valueInput.addEventListener('input', () => {
                lastMovedSliders = 'hsl';
                slider.value = valueInput.value;
                updateColorPreview();
            });
        });

        function updateColorPreview() {
    let r, g, b;
    
    if (lastMovedSliders === 'rgb') {
        r = parseInt(rSlider.value);
        g = parseInt(gSlider.value);
        b = parseInt(bSlider.value);
    } else {
        const h = parseFloat(hSlider.value);
        const s = parseFloat(sSlider.value);
        const l = parseFloat(lSlider.value);
        
        const hsl = new Hsl(h, s, l);
        const rgbFromHsl = hsl.to_rgb();
        
        r = rgbFromHsl.r;
        g = rgbFromHsl.g;
        b = rgbFromHsl.b;
    }
    
    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    colorBox.style.backgroundColor = hexColor;
    colorHex.textContent = hexColor.toUpperCase();
}

        convertToHslBtn.addEventListener('click', () => {
            const r = parseInt(rSlider.value);
            const g = parseInt(gSlider.value);
            const b = parseInt(bSlider.value);
            
            const rgb = new Rgb(r, g, b);
            
            const hsl = rgb.to_hsl();
            
            hSlider.value = hsl.h;
            hValue.value = hsl.h;
            sSlider.value = hsl.s;
            sValue.value = hsl.s;
            lSlider.value = hsl.l;
            lValue.value = hsl.l;
            
            hslResult.textContent = `HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
            rgbResult.textContent = `RGB: ${r}, ${g}, ${b}`;
        });

        convertToRgbBtn.addEventListener('click', () => {
            const h = parseFloat(hSlider.value);
            const s = parseFloat(sSlider.value);
            const l = parseFloat(lSlider.value);
            
            const hsl = new Hsl(h, s, l);
            const rgb = hsl.to_rgb();
            
            lastMovedSliders = 'rgb';
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

        updateColorPreview();
        
    } catch (error) {
        console.error("Error loading WebAssembly module:", error);
        alert("Failed to load WebAssembly module. Check the console for details.");
    }
}

run();