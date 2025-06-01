Here's the English translation of your document:

---

# QR Generator Core Documentation  
[中文](./README.md)  

[Try it now](https://qrcode.xujingyichang.top/)  

## Overview  

QR Generator Core is a powerful QR code generation library that supports advanced features like custom positioning, sizing, background images, text, HTML modules, and more. Built on `html2canvas` and `qr-code-styling`, it provides high-quality QR code generation and export capabilities.  

## Features  

- ✅ **Custom QR Code Position & Size** – Precise control over QR code placement and dimensions  
- ✅ **Multi-Layer Background Images** – Support for multiple background images with configurable position, size, opacity, and layering  
- ✅ **Text & HTML Modules** – Add custom text and HTML content around the QR code  
- ✅ **Gradient Styling** – Supports linear and radial gradient effects  
- ✅ **High-Quality Export** – High-resolution PNG export via html2canvas  
- ✅ **Rounded Corners** – Supports rounded corner exports  
- ✅ **Configuration Validation** – Comprehensive config validation with error feedback  
- ✅ **TypeScript Support** – Full type definitions  

## Installation  

```bash  
npm install @wtechtec/qr-generator-core  
```  

## Basic Usage  

### Quick Start  

```typescript  
import { createQRGenerator, generateQRAsPNG } from '@wtechtec/qr-generator-core';  

// Basic configuration  
const config = {  
  text: "https://example.com",  
  width: 400,  
  height: 300,  
  qrPosition: { x: 100, y: 75 },  
  qrSize: { width: 200, height: 150 }  
};  

// Create generator  
const generator = createQRGenerator(config);  

// Render and export  
const blob = await generator.exportAsPNG();  
```  

### Convenience Functions  

```typescript  
// Quick generate and export PNG  
const blob = await generateQRAsPNG(config);  

// Quick generate and download  
await generateAndDownloadQR(config, 'my-qr-code.png');  

// Quick generate DataURL  
const dataURL = await generateQRAsDataURL(config);  
```  

## Configuration Interface  

### QRGeneratorConfig  

```typescript  
interface QRGeneratorConfig {  
  // Basic settings  
  text: string;                    // QR code content  
  width: number;                   // Canvas width  
  height: number;                  // Canvas height  

  // QR code position & size  
  qrPosition: { x: number; y: number };      // QR code position  
  qrSize: { width: number; height: number }; // QR code dimensions  

  // QR code style  
  qrOptions: {  
    typeNumber: number;  
    mode: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';  
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';  
  };  

  // Image settings  
  imageOptions: {  
    hideBackgroundDots: boolean;  
    imageSize: number;  
    margin: number;  
    crossOrigin: string;  
  };  

  // Dot style  
  dotsOptions: {  
    color: string;  
    type: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';  
    gradient?: GradientConfig;  
  };  

  // Background style  
  backgroundOptions: {  
    color: string;  
    gradient?: GradientConfig;  
  };  

  // Corner style  
  cornersSquareOptions: {  
    color: string;  
    type: 'dot' | 'square' | 'extra-rounded';  
    gradient?: GradientConfig;  
  };  

  cornersDotOptions: {  
    color: string;  
    type: 'dot' | 'square';  
    gradient?: GradientConfig;  
  };  

  // Logo settings  
  logo?: {  
    src: string;  
    size: number;  
    position?: { x: number; y: number };  
  };  

  // Export settings  
  exportOptions: {  
    format: 'png' | 'jpeg' | 'svg';  
    quality: number;  
    borderRadius: number;  
  };  

  // Background images  
  backgrounds?: BackgroundConfig[];  

  // Text elements  
  texts?: TextConfig[];  

  // HTML modules  
  htmlModules?: HtmlModuleConfig[];  
}  
```  

### Background Image Configuration  

```typescript  
interface BackgroundConfig {  
  src: string;                              // Image URL or base64  
  position: { x: number; y: number };       // Position coordinates  
  size: { width: number; height: number };  // Image dimensions  
  mode: 'fill' | 'contain' | 'cover' | 'stretch'; // Fill mode  
  zIndex: number;                           // Layer index  
  opacity: number;                          // Opacity (0-1)  
}  
```  

### Text Configuration  

```typescript  
interface TextConfig {  
  content: string;                          // Text content  
  position: { x: number; y: number };       // Position coordinates  
  fontSize: number;                         // Font size  
  color: string;                            // Text color  
  fontFamily: string;                       // Font family  
  fontWeight: number;                       // Font weight  
  zIndex: number;                           // Layer index  
  opacity: number;                          // Opacity  
  textAlign?: 'left' | 'center' | 'right';  // Text alignment  
  lineHeight?: number;                      // Line height  
}  
```  

### Gradient Configuration  

```typescript  
interface GradientConfig {  
  type: 'linear' | 'radial';                // Gradient type  
  rotation: number;                         // Rotation angle  
  colorStops: Array<{                       // Color stops  
    offset: number;                         // Position (0-1)  
    color: string;                          // Color  
  }>;  
}  
```  

## Core Classes  

### QRGenerator  

The main QR code generator class providing full generation and export functionality.  

#### Constructor  

```typescript  
const generator = new QRGenerator(config: Partial<QRGeneratorConfig>);  
```  

#### Key Methods  

```typescript  
// Render canvas  
await generator.render(): Promise<HTMLDivElement>  

// Export as PNG Blob  
await generator.exportAsPNG(options?: ExportOptions): Promise<Blob>  

// Export as DataURL  
await generator.exportAsDataURL(options?: ExportOptions): Promise<string>  

// Download as PNG  
await generator.downloadAsPNG(filename?: string, options?: ExportOptions): Promise<void>  

// Update configuration  
generator.updateConfig(newConfig: Partial<QRGeneratorConfig>): void  

// Get current configuration  
generator.getConfig(): QRGeneratorConfig  

// Validate configuration  
generator.validateConfig(): { isValid: boolean; errors: string[] }  

// Clean up resources  
generator.cleanup(): void  

// Destroy instance  
generator.destroy(): void  
```  

#### Export Options  

```typescript  
interface ExportOptions {  
  scale?: number;        // Scaling factor (default: 2)  
  quality?: number;      // Quality (0-1, default: 0.9)  
  useCORS?: boolean;     // Enable CORS (default: true)  
  allowTaint?: boolean;  // Allow cross-origin (default: true)  
}  
```  

## Helper Functions  

### calculateDefaultQRSettings  

Automatically calculates default QR code position and size:  

```typescript  
const settings = calculateDefaultQRSettings(  
  canvasWidth: number,  
  canvasHeight: number,  
  qrRatio: number = 0.6  
);  

// Returns  
{  
  qrPosition: { x: number; y: number };  
  qrSize: { width: number; height: number };  
}  
```  

## Usage Examples  

### Basic QR Code  

```typescript  
const basicConfig = {  
  text: "https://example.com",  
  width: 400,  
  height: 300,  
  qrPosition: { x: 100, y: 75 },  
  qrSize: { width: 200, height: 150 }  
};  

const generator = createQRGenerator(basicConfig);  
const blob = await generator.exportAsPNG();  
```  

### QR Code with Background Image  

```typescript  
const configWithBackground = {  
  text: "https://example.com",  
  width: 500,  
  height: 400,  
  qrPosition: { x: 150, y: 125 },  
  qrSize: { width: 200, height: 150 },  
  backgrounds: [  
    {  
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",  
      position: { x: 0, y: 0 },  
      size: { width: 500, height: 400 },  
      mode: 'cover',  
      zIndex: 1,  
      opacity: 0.8  
    }  
  ]  
};  
```  

### Multi-Layer Backgrounds & Text  

```typescript  
const complexConfig = {  
  text: "https://github.com/project",  
  width: 600,  
  height: 500,  
  qrPosition: { x: 200, y: 175 },  
  qrSize: { width: 200, height: 150 },  
  backgrounds: [  
    {  
      src: backgroundImage1,  
      position: { x: 0, y: 0 },  
      size: { width: 600, height: 500 },  
      mode: 'cover',  
      zIndex: 1,  
      opacity: 0.6  
    },  
    {  
      src: backgroundImage2,  
      position: { x: 50, y: 50 },  
      size: { width: 200, height: 200 },  
      mode: 'contain',  
      zIndex: 2,  
      opacity: 0.8  
    }  
  ],  
  texts: [  
    {  
      content: "Scan to visit project",  
      position: { x: 50, y: 30 },  
      fontSize: 24,  
      color: "#333333",  
      fontFamily: "Arial",  
      fontWeight: 600,  
      zIndex: 10,  
      opacity: 1,  
      textAlign: "left"  
    }  
  ]  
};  
```  

### Gradient Styling  

```typescript  
const gradientConfig = {  
  text: "https://example.com",  
  width: 400,  
  height: 400,  
  qrPosition: { x: 100, y: 100 },  
  qrSize: { width: 200, height: 200 },  
  backgroundOptions: {  
    color: "#ffffff",  
    gradient: {  
      type: "linear",  
      rotation: 45,  
      colorStops: [  
        { offset: 0, color: "#ff9a9e" },  
        { offset: 1, color: "#fecfef" }  
      ]  
    }  
  },  
  dotsOptions: {  
    color: "#333333",  
    type: "classy-rounded"  
  }  
};  
```  

### Custom-Positioned QR Code  

```typescript  
const customPositionConfig = {  
  text: "https://example.com",  
  width: 600,  
  height: 400,  
  qrPosition: { x: 50, y: 50 },    // Top-left corner  
  qrSize: { width: 180, height: 180 },  
  texts: [  
    {  
      content: "Main content area",  
      position: { x: 250, y: 80 },  
      fontSize: 24,  
      color: "#333333",  
      fontFamily: "Arial",  
      fontWeight: 600,  
      zIndex: 10,  
      opacity: 1,  
      textAlign: "left"  
    }  
  ]  
};  
```  

## Configuration Validation  

The library provides comprehensive configuration validation:  

```typescript  
const generator = createQRGenerator(config);  
const validation = generator.validateConfig();  

if (!validation.isValid) {  
  console.error('Configuration errors:', validation.errors);  
  // Handle errors  
} else {  
  // Configuration valid, proceed  
  await generator.render();  
}  
```  

### Common Validation Errors  

- QR code content cannot be empty  
- Canvas dimensions must be > 0  
- QR code position cannot be negative  
- QR code position exceeds canvas bounds  
- QR code dimensions must be > 0  
- QR code exceeds canvas boundaries  
- Export quality must be between 0-1  
- Background image configuration errors  

## Performance Optimization Tips  

1. **Image Optimization**: Use appropriately sized background images to avoid performance issues  
2. **Opacity Settings**: Set background opacity between 0.3-0.8 for QR code readability  
3. **Layer Management**: Properly configure zIndex to avoid unnecessary overlaps  
4. **Resource Cleanup**: Call `destroy()` to clean up resources after use  
5. **Batch Processing**: For bulk generation, consider using a queue system  

## Error Handling  

```typescript  
try {  
  const generator = createQRGenerator(config);  
  const blob = await generator.exportAsPNG();  
  // Handle success  
} catch (error) {  
  console.error('Generation failed:', error);  
  // Handle error  
} finally {  
  generator?.destroy(); // Clean up  
}  
```  

## Browser Compatibility  

- Chrome 60+  
- Firefox 55+  
- Safari 12+  
- Edge 79+  

## Notes  

1. **Cross-Origin Images**: Proper CORS settings required for external images  
2. **Memory Management**: Call `destroy()` to clean up resources in large-scale usage  
3. **Async Operations**: All exports are asynchronous—use `await`  
4. **Configuration Validation**: Validate configurations before use  
5. **Image Formats**: Supports all browser-compatible formats (PNG/JPEG recommended)  
6. **base64**: Remove the "base64:" prefix from "base64:data:" content  

## License  

MIT License  

--- 

Let me know if you'd like any adjustments to the translation!