# QR Generator Core

一个功能强大的二维码生成器库，支持高度自定义的样式选项。

## 安装

```bash
npm install @wtechtec/qr-generator-core
```

## 快速开始

```typescript
import { createQRGenerator } from '@wtechtec/qr-generator-core';

// 基础使用
const generator = createQRGenerator({
  text: 'Hello World',
  width: 300,
  height: 300,
});

// 渲染到DOM元素
const container = document.getElementById('qr-container');
await generator.renderTo(container);

// 导出为PNG
const blob = await generator.exportAsPNG();
```

## 配置选项

### 基础配置

```typescript
interface QRGeneratorConfig {
  text: string;           // 二维码内容
  width: number;          // 宽度
  height: number;         // 高度
  
  // QR码选项
  qrOptions: {
    typeNumber: number;
    mode: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
  
  // 点样式
  dotsOptions: {
    color: string;
    type: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    gradient?: GradientOptions;
  };
  
  // 背景样式
  backgroundOptions: {
    color: string;
    gradient?: GradientOptions;
  };
  
  // Logo配置
  logo?: {
    src: string;    // base64 或 URL
    size: number;   // Logo大小(像素)
  };
  
  // 导出选项
  exportOptions?: {
    format: 'png' | 'jpeg' | 'svg';
    quality: number;      // 0-1
    borderRadius: number; // 圆角半径
  };
}
```

## API 方法

### createQRGenerator(config?)

创建QR生成器实例。

```typescript
const generator = createQRGenerator({
  text: 'https://example.com',
  width: 400,
  height: 400,
  dotsOptions: {
    color: '#1976d2',
    type: 'rounded'
  }
});
```

### generator.updateConfig(newConfig)

更新配置。

```typescript
generator.updateConfig({
  text: 'New content',
  dotsOptions: {
    color: '#ff5722'
  }
});
```

### generator.renderTo(container)

渲染到指定DOM容器。

```typescript
const container = document.getElementById('qr-container');
await generator.renderTo(container);
```

### generator.exportAsPNG(options?)

导出为PNG格式。

```typescript
const blob = await generator.exportAsPNG({
  quality: 0.9,
  borderRadius: 16
});

// 下载文件
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'qrcode.png';
a.click();
```

### generator.exportAsDataURL(options?)

导出为DataURL。

```typescript
const dataURL = await generator.exportAsDataURL({
  quality: 1,
  borderRadius: 8
});

// 显示在img标签中
const img = document.createElement('img');
img.src = dataURL;
```

### generator.createPreview()

创建预览canvas。

```typescript
const canvas = await generator.createPreview();
document.body.appendChild(canvas);
```


## 高级用法

### 渐变色配置

```typescript
const generator = createQRGenerator({
  text: 'Gradient QR',
  dotsOptions: {
    color: '#000000',
    type: 'rounded',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#1976d2' },
        { offset: 1, color: '#42a5f5' }
      ]
    }
  }
});
```

### Logo配置

```typescript
const generator = createQRGenerator({
  text: 'QR with Logo',
  logo: {
    src: 'data:image/png;base64,iVBOR...', // base64图片
    size: 60
  }
});
```

### 圆角导出

```typescript
const blob = await generator.exportAsPNG({
  borderRadius: 20,  // 20px圆角
  quality: 1
});
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT 