use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Hsl {
    pub h: f64,
    pub s: f64,
    pub l: f64,
}

#[wasm_bindgen]
pub struct Rgb {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

#[wasm_bindgen]
impl Rgb {
    #[wasm_bindgen(constructor)]
    pub fn new(r: u8, g: u8, b: u8) -> Rgb {
        Rgb { r, g, b }
    }

    pub fn to_hsl(&self) -> Hsl {
        let r = self.r as f64 / 255.0;
        let g = self.g as f64 / 255.0;
        let b = self.b as f64 / 255.0;
        
        let max = r.max(g.max(b));
        let min = r.min(g.min(b));
        let mut h = 0.0;
        let mut s = 0.0;
        let l = (max + min) / 2.0;
        
        if max != min {
            let d = max - min;
            s = if l > 0.5 { d / (2.0 - max - min) } else { d / (max + min) };
            
            h = if max == r {
                (g - b) / d + (if g < b { 6.0 } else { 0.0 })
            } else if max == g {
                (b - r) / d + 2.0
            } else {
                (r - g) / d + 4.0
            };
            
            h /= 6.0;
        }
        
        Hsl {
            h: (h * 360.0).round(),
            s: (s * 100.0).round(),
            l: (l * 100.0).round(),
        }
    }
}

#[wasm_bindgen]
impl Hsl {
    #[wasm_bindgen(constructor)]
    pub fn new(h: f64, s: f64, l: f64) -> Hsl {
        Hsl { h, s, l }
    }

    pub fn to_rgb(&self) -> Rgb {
        let h = self.h / 360.0;
        let s = self.s / 100.0;
        let l = self.l / 100.0;
        
        let mut r = l;
        let mut g = l;
        let mut b = l;
        
        if s != 0.0 {
            let hue2rgb = |p: f64, q: f64, mut t: f64| {
                if t < 0.0 { t += 1.0; }
                if t > 1.0 { t -= 1.0; }
                if t < 1.0/6.0 { return p + (q - p) * 6.0 * t; }
                if t < 1.0/2.0 { return q; }
                if t < 2.0/3.0 { return p + (q - p) * (2.0/3.0 - t) * 6.0; }
                p
            };
            
            let q = if l < 0.5 { l * (1.0 + s) } else { l + s - l * s };
            let p = 2.0 * l - q;
            
            r = hue2rgb(p, q, h + 1.0/3.0);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1.0/3.0);
        }
        
        Rgb {
            r: (r * 255.0).round() as u8,
            g: (g * 255.0).round() as u8,
            b: (b * 255.0).round() as u8,
        }
    }
}