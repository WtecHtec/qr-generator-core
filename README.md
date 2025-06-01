# QR Generator Core 文档
[EN](./README_EN.md)

[前往试试](https://qrcode.xujingyichang.top/)
## 概述

QR Generator Core 是一个功能强大的二维码生成库，支持自定义位置、尺寸、背景图片、文本、HTML模块等高级功能。基于 `html2canvas` 和 `qr-code-styling` 构建，提供高质量的二维码生成和导出能力。

## 特性

- ✅ **自定义二维码位置和尺寸** - 精确控制二维码在画布中的位置和大小
- ✅ **多层背景图片支持** - 支持多个背景图片，可配置位置、尺寸、透明度、层级
- ✅ **文本和HTML模块** - 在二维码周围添加自定义文本和HTML内容
- ✅ **渐变样式支持** - 支持线性和径向渐变效果
- ✅ **高质量导出** - 基于 html2canvas 的高质量 PNG 导出
- ✅ **圆角支持** - 支持圆角边框导出
- ✅ **配置验证** - 完整的配置验证和错误提示
- ✅ **TypeScript 支持** - 完整的类型定义

## 安装

```bash
npm install @wtechtec/qr-generator-core
```

## 基础用法

### 快速开始

```typescript
import { createQRGenerator, generateQRAsPNG } from '@wtechtec/qr-generator-core';

// 基础配置
const config = {
  text: "https://example.com",
  width: 400,
  height: 300,
  qrPosition: { x: 100, y: 75 },
  qrSize: { width: 200, height: 150 }
};

// 创建生成器
const generator = createQRGenerator(config);

// 渲染并导出
const blob = await generator.exportAsPNG();
```

### 便捷函数

```typescript
// 快速生成并导出 PNG
const blob = await generateQRAsPNG(config);

// 快速生成并下载
await generateAndDownloadQR(config, 'my-qr-code.png');

// 快速生成 DataURL
const dataURL = await generateQRAsDataURL(config);
```

## 配置接口

### QRGeneratorConfig

```typescript
interface QRGeneratorConfig {
  // 基础配置
  text: string;                    // 二维码内容
  width: number;                   // 画布宽度
  height: number;                  // 画布高度
  
  // 二维码位置和尺寸
  qrPosition: { x: number; y: number };      // 二维码位置
  qrSize: { width: number; height: number }; // 二维码尺寸
  
  // QR码样式配置
  qrOptions: {
    typeNumber: number;
    mode: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  };
  
  // 图像配置
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
    crossOrigin: string;
  };
  
  // 点样式
  dotsOptions: {
    color: string;
    type: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    gradient?: GradientConfig;
  };
  
  // 背景样式
  backgroundOptions: {
    color: string;
    gradient?: GradientConfig;
  };
  
  // 角落样式
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
  
  // Logo配置
  logo?: {
    src: string;
    size: number;
    position?: { x: number; y: number };
  };
  
  // 导出配置
  exportOptions: {
    format: 'png' | 'jpeg' | 'svg';
    quality: number;
    borderRadius: number;
  };
  
  // 背景图片数组
  backgrounds?: BackgroundConfig[];
  
  // 文本数组
  texts?: TextConfig[];
  
  // HTML模块数组
  htmlModules?: HtmlModuleConfig[];
}
```

### 背景图片配置

```typescript
interface BackgroundConfig {
  src: string;                              // 图片URL或base64
  position: { x: number; y: number };       // 位置坐标
  size: { width: number; height: number };  // 图片尺寸
  mode: 'fill' | 'contain' | 'cover' | 'stretch'; // 填充模式
  zIndex: number;                           // 层级
  opacity: number;                          // 透明度 (0-1)
}
```

### 文本配置

```typescript
interface TextConfig {
  content: string;                          // 文本内容
  position: { x: number; y: number };       // 位置坐标
  fontSize: number;                         // 字体大小
  color: string;                           // 文本颜色
  fontFamily: string;                      // 字体族
  fontWeight: number;                      // 字体粗细
  zIndex: number;                          // 层级
  opacity: number;                         // 透明度
  textAlign?: 'left' | 'center' | 'right'; // 文本对齐
  lineHeight?: number;                     // 行高
}
```

### 渐变配置

```typescript
interface GradientConfig {
  type: 'linear' | 'radial';               // 渐变类型
  rotation: number;                        // 旋转角度
  colorStops: Array<{                      // 颜色停止点
    offset: number;                        // 位置 (0-1)
    color: string;                         // 颜色
  }>;
}
```

## 核心类

### QRGenerator

主要的二维码生成器类，提供完整的生成和导出功能。

#### 构造函数

```typescript
const generator = new QRGenerator(config: Partial<QRGeneratorConfig>);
```

#### 主要方法

```typescript
// 渲染画布
await generator.render(): Promise<HTMLDivElement>

// 导出为PNG Blob
await generator.exportAsPNG(options?: ExportOptions): Promise<Blob>

// 导出为DataURL
await generator.exportAsDataURL(options?: ExportOptions): Promise<string>

// 下载PNG文件
await generator.downloadAsPNG(filename?: string, options?: ExportOptions): Promise<void>

// 更新配置
generator.updateConfig(newConfig: Partial<QRGeneratorConfig>): void

// 获取当前配置
generator.getConfig(): QRGeneratorConfig

// 验证配置
generator.validateConfig(): { isValid: boolean; errors: string[] }

// 清理资源
generator.cleanup(): void

// 销毁实例
generator.destroy(): void
```

#### 导出选项

```typescript
interface ExportOptions {
  scale?: number;        // 缩放比例 (默认: 2)
  quality?: number;      // 质量 (0-1, 默认: 0.9)
  useCORS?: boolean;     // 是否使用CORS (默认: true)
  allowTaint?: boolean;  // 是否允许跨域 (默认: true)
}
```

## 辅助函数

### calculateDefaultQRSettings

自动计算二维码的默认位置和尺寸：

```typescript
const settings = calculateDefaultQRSettings(
  canvasWidth: number, 
  canvasHeight: number, 
  qrRatio: number = 0.6
);

// 返回
{
  qrPosition: { x: number; y: number };
  qrSize: { width: number; height: number };
}
```

## 使用示例

### 基础二维码

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

### 带背景图片的二维码

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

### 多层背景和文本

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
      content: "扫码访问项目",
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

### 渐变样式

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

### 自定义位置的二维码

```typescript
const customPositionConfig = {
  text: "https://example.com",
  width: 600,
  height: 400,
  qrPosition: { x: 50, y: 50 },    // 左上角
  qrSize: { width: 180, height: 180 },
  texts: [
    {
      content: "主要内容区域",
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

## 配置验证

库提供完整的配置验证功能：

```typescript
const generator = createQRGenerator(config);
const validation = generator.validateConfig();

if (!validation.isValid) {
  console.error('配置错误:', validation.errors);
  // 处理错误
} else {
  // 配置有效，继续处理
  await generator.render();
}
```

### 常见验证错误

- 二维码内容不能为空
- 画布尺寸必须大于0
- 二维码位置不能为负数
- 二维码位置超出画布范围
- 二维码尺寸必须大于0
- 二维码超出画布边界
- 导出质量必须在0-1之间
- 背景图片配置错误

## 性能优化建议

1. **图片优化**：使用适当尺寸的背景图片，避免过大的图片影响性能
2. **透明度设置**：背景图片透明度建议设置在0.3-0.8之间，保证二维码可读性
3. **层级管理**：合理设置zIndex，避免不必要的层级重叠
4. **资源清理**：使用完毕后调用 `destroy()` 方法清理资源
5. **批量处理**：对于大量二维码生成，考虑使用队列处理

## 错误处理

```typescript
try {
  const generator = createQRGenerator(config);
  const blob = await generator.exportAsPNG();
  // 处理成功结果
} catch (error) {
  console.error('生成失败:', error);
  // 处理错误
} finally {
  generator?.destroy(); // 清理资源
}
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 注意事项

1. **跨域图片**：使用外部图片时需要正确设置CORS
2. **内存管理**：大量使用时注意调用 `destroy()` 清理资源
3. **异步操作**：所有导出操作都是异步的，需要使用 `await`
4. **配置验证**：建议在使用前进行配置验证
5. **图片格式**：背景图片支持所有浏览器支持的格式，推荐使用PNG或JPEG
6. **base64**: 需要删除内容“base64:data:” 中的 base64:
## 许可证

MIT License