# QR Generator Core Documentation
[中文](./README.md)
## Overview

QR Generator Core is a powerful QR code generation library that supports custom positioning, sizing, background images, text, HTML modules, and other advanced features. Built on `html2canvas` and `qr-code-styling`, it provides high-quality QR code generation and export capabilities.

## Features

- ✅ **Custom QR Code Position & Size** - Precise control over QR code position and dimensions on canvas
- ✅ **Multi-layer Background Images** - Support for multiple background images with configurable position, size, opacity, and z-index
- ✅ **Text & HTML Modules** - Add custom text and HTML content around QR codes
- ✅ **Gradient Style Support** - Support for linear and radial gradient effects
- ✅ **High-Quality Export** - High-quality PNG export based on html2canvas
- ✅ **Rounded Corner Support** - Support for rounded border export
- ✅ **Configuration Validation** - Complete configuration validation with error messages
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install html2canvas qr-code-styling
```

## Basic Usage

### Quick Start

```typescript
import { createQRGenerator, generateQRAsPNG } from './qr-generator-core';

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
  // Basic configuration
  text: string;                    // QR code content
  width: number;                   // Canvas width
  height: number;                  // Canvas height
  
  // QR code position and size
  qrPosition: { x: number; y: number };      // QR code position
  qrSize: { width: number; height: number }; // QR code size
  
  // QR code style configuration
  qrOptions: {
    typeNumber: number;
    mode: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
  
  // Image configuration
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin: string;
  };
  
  // Dots style
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
  
  // Corner styles
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
  
  // Logo configuration
  logo?: {
    src: string;
    size: number;
    position?: { x: number; y: number };
  };
  
  // Export configuration
  exportOptions: {
    format: 'png' | 'jpeg' | 'svg';
    quality: number;
    borderRadius: number;
  };
  
  // Background images array
  backgrounds?: BackgroundConfig[];
  
  // Text array
  texts?: TextConfig[];
  
  // HTML modules array
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
  color: string;                           // Text color
  fontFamily: string;                      // Font family
  fontWeight: number;                      // Font weight
  zIndex: number;                          // Layer index
  opacity: number;                         // Opacity
  textAlign?: 'left' | 'center' | 'right'; // Text alignment
  lineHeight?: number;                     // Line height
}
```

### Gradient Configuration

```typescript
interface GradientConfig {
  type: 'linear' | 'radial';               // Gradient type
  rotation: number;                        // Rotation angle
  colorStops: Array<{                      // Color stops
    offset: number;                        // Position (0-1)
    color: string;                         // Color
  }>;
}
```

## Core Classes

### QRGenerator

The main QR code generator class providing complete generation and export functionality.

#### Constructor

```typescript
const generator = new QRGenerator(config: Partial<QRGeneratorConfig>);
```

#### Main Methods

```typescript
// Render canvas
await generator.render(): Promise<HTMLDivElement>

// Export as PNG Blob
await generator.exportAsPNG(options?: ExportOptions): Promise<Blob>

// Export as DataURL
await generator.exportAsDataURL(options?: ExportOptions): Promise<string>

// Download PNG file
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
  scale?: number;        // Scale ratio (default: 2)
  quality?: number;      // Quality (0-1, default: 0.9)
  useCORS?: boolean;     // Use CORS (default: true)
  allowTaint?: boolean;  // Allow cross-origin (default: true)
}
```

## Utility Functions

### calculateDefaultQRSettings

Automatically calculate default QR code position and size:

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

### Multi-layer Backgrounds and Text

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

### Gradient Styles

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

### Custom Positioned QR Code

```typescript
const customPositionConfig = {
  text: "https://example.com",
  width: 600,
  height: 400,
  qrPosition: { x: 50, y: 50 },    // Top-left corner
  qrSize: { width: 180, height: 180 },
  texts: [
    {
      content: "Main Content Area",
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

The library provides complete configuration validation:

```typescript
const generator = createQRGenerator(config);
const validation = generator.validateConfig();

if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
  // Handle errors
} else {
  // Configuration is valid, proceed
  await generator.render();
}
```

### Common Validation Errors

- QR code content cannot be empty
- Canvas dimensions must be greater than 0
- QR code position cannot be negative
- QR code position exceeds canvas bounds
- QR code size must be greater than 0
- QR code exceeds canvas boundaries
- Export quality must be between 0-1
- Background image configuration errors

## Performance Optimization Tips

1. **Image Optimization**: Use appropriately sized background images to avoid performance impact from oversized images
2. **Opacity Settings**: Set background image opacity between 0.3-0.8 to ensure QR code readability
3. **Layer Management**: Set zIndex reasonably to avoid unnecessary layer overlapping
4. **Resource Cleanup**: Call `destroy()` method after use to clean up resources
5. **Batch Processing**: Consider using queue processing for large-scale QR code generation

## Error Handling

```typescript
try {
  const generator = createQRGenerator(config);
  const blob = await generator.exportAsPNG();
  // Handle success result
} catch (error) {
  console.error('Generation failed:', error);
  // Handle error
} finally {
  generator?.destroy(); // Clean up resources
}
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Important Notes

1. **Cross-Origin Images**: Properly set CORS when using external images
2. **Memory Management**: Remember to call `destroy()` to clean up resources when using extensively
3. **Async Operations**: All export operations are asynchronous and require `await`
4. **Configuration Validation**: Recommend validating configuration before use
5. **Image Formats**: Background images support all browser-supported formats, PNG or JPEG recommended

## API Reference

### Core Functions

```typescript
// Create QR generator instance
createQRGenerator(config: Partial<QRGeneratorConfig>): QRGenerator

// Quick PNG generation
generateQRAsPNG(config, exportOptions?): Promise<Blob>

// Quick DataURL generation
generateQRAsDataURL(config, exportOptions?): Promise<string>

// Quick download
generateAndDownloadQR(config, filename?, exportOptions?): Promise<void>

// Calculate default settings
calculateDefaultQRSettings(width, height, ratio?): { qrPosition, qrSize }
```

### Export Options

```typescript
interface ExportOptions {
  scale?: number;        // Scale factor (1-4, default: 2)
  quality?: number;      // Image quality (0-1, default: 0.9)
  useCORS?: boolean;     // Enable CORS (default: true)
  allowTaint?: boolean;  // Allow tainted canvas (default: true)
}
```

### Validation Result

```typescript
interface ValidationResult {
  isValid: boolean;      // Whether configuration is valid
  errors: string[];      // Array of error messages
}
```

## Advanced Usage

### Custom QR Code Styling

```typescript
const styledConfig = {
  text: "https://example.com",
  width: 400,
  height: 400,
  qrPosition: { x: 100, y: 100 },
  qrSize: { width: 200, height: 200 },
  dotsOptions: {
    color: "#2196f3",
    type: "classy-rounded",
    gradient: {
      type: "linear",
      rotation: 90,
      colorStops: [
        { offset: 0, color: "#2196f3" },
        { offset: 1, color: "#21cbf3" }
      ]
    }
  },
  cornersSquareOptions: {
    color: "#ff5722",
    type: "extra-rounded"
  },
  cornersDotOptions: {
    color: "#4caf50",
    type: "square"
  }
};
```

### Dynamic Configuration Updates

```typescript
const generator = createQRGenerator(initialConfig);

// Update QR content
generator.updateConfig({ text: "https://new-url.com" });

// Update position
generator.updateConfig({ 
  qrPosition: { x: 150, y: 150 },
  qrSize: { width: 250, height: 250 }
});

// Re-export with new configuration
const newBlob = await generator.exportAsPNG();
```

### Batch Processing

```typescript
async function generateMultipleQRCodes(configs: Partial<QRGeneratorConfig>[]) {
  const results = [];
  
  for (const config of configs) {
    try {
      const blob = await generateQRAsPNG(config);
      results.push({ success: true, blob });
    } catch (error) {
      results.push({ success: false, error });
    }
  }
  
  return results;
}
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please create an issue in the repository.