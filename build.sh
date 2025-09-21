#!/bin/bash

echo "Building RGB to HSL Color Converter with Rust + WebAssembly..."

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf pkg/
rm -f web/*.wasm
rm -f web/IMY_wasm.js

# Build with wasm-pack
echo "Building Rust code to WebAssembly..."
wasm-pack build --target web --out-dir pkg --release

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Copy only the necessary files to web directory (not the entire pkg folder)
    echo "Copying files to web directory..."
    cp pkg/*.wasm web/
    cp pkg/*.js web/
    
    echo "Generated files in web/:"
    ls -la web/*.wasm
    ls -la web/*.js
    
    echo ""
    echo "Ready to serve! Run the following commands:"
    echo "   cd web"
    echo "   python3 -m http.server 8000"
    echo "   # or npx serve ."
else
    echo "Build failed! Check the error messages above."
    exit 1
fi