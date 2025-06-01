import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import type { CanvasConfig } from '../types/qr-generator';

// 导出配置接口
export interface QRGeneratorConfig {
  // 基础配置
  text: string;
  width: number;
  height: number;

  qrPosition: { x: number; y: number };
  qrSize: { width: number; height: number };
  
  // QR码样式
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
    gradient?: {
      type: 'linear' | 'radial';
      rotation: number;
      colorStops: any;
    };
  };
  
  // 背景样式
  backgroundOptions: {
    color: string;
    gradient?: {
      type: 'linear' | 'radial';
      rotation: number;
      colorStops: any;
    };
  };
  
  // 角落方块样式
  cornersSquareOptions: {
    color: string;
    type: 'dot' | 'square' | 'extra-rounded';
    gradient?: {
      type: 'linear' | 'radial';
      rotation: number;
      colorStops: Array<{ offset: number; color: string }>;
    };
  };
  
  // 角落点样式
  cornersDotOptions: {
    color: string;
    type: 'dot' | 'square';
    gradient?: {
      type: 'linear' | 'radial';
      rotation: number;
      colorStops: Array<{ offset: number; color: string }>;
    };
  };
  
  // Logo配置
  logo?: {
    src: string; // base64 或 URL
    size: number;
    position?: { x: number; y: number };
  };
  
  // 导出配置
  exportOptions: {
    format: 'png' | 'jpeg' | 'svg';
    quality: number;
    borderRadius: number;
  };
  
  // 背景图片
  backgrounds?: Array<{
    src: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    mode: 'fill' | 'contain' | 'cover' | 'stretch';
    zIndex: number;
    opacity: number;
  }>;
  
  // 文本
  texts?: Array<{
    content: string;
    position: { x: number; y: number };
    fontSize: number;
    color: string;
    fontFamily: string;
    fontWeight: number;
    zIndex: number;
    opacity: number;
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;
  }>;
  
  // HTML模块
  htmlModules?: Array<{
    content: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    opacity: number;
  }>;
}

// 平台配置接口 - 直接使用现有的CanvasConfig
export interface PlatformQRGeneratorConfig extends CanvasConfig {
  // 可以添加一些额外的导出选项
  exportOptions?: {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string;
    logging?: boolean;
  };
}

// 默认配置
export const defaultConfig: Partial<QRGeneratorConfig> = {
  text: 'Hello World',
  width: 800,
  height: 600,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'M',
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 4,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#0000ff',
    type: 'square',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    color: '#0000ff',
    type: 'square',
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'square',
  },
  exportOptions: {
    format: 'png',
    quality: 0.9,
    borderRadius: 0,
  },
  texts: [],
  backgrounds: [],
  htmlModules: [],
};

// 计算默认二维码位置和尺寸的辅助函数
export const calculateDefaultQRSettings = (canvasWidth: number, canvasHeight: number, qrRatio: number = 0.6) => {
  const qrSize = Math.min(canvasWidth, canvasHeight) * qrRatio;
  return {
    qrPosition: {
      x: (canvasWidth - qrSize) / 2,
      y: (canvasHeight - qrSize) / 2
    },
    qrSize: {
      width: qrSize,
      height: qrSize
    }
  };
};


// 基于平台预览的QR生成器类
export class PlatformQRGenerator {
  private config: PlatformQRGeneratorConfig;
  private previewElement: HTMLElement | null = null;
  private isInitialized = false;

  constructor(config: PlatformQRGeneratorConfig) {
    this.config = {
      ...config,
      exportOptions: { ...config.exportOptions },
    };
  }

  // 初始化 - 基于现有的预览元素
  initialize(previewElement: HTMLElement): void {
    this.previewElement = previewElement;
    this.isInitialized = true;
  }

  // 更新配置
  updateConfig(newConfig: Partial<PlatformQRGeneratorConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      exportOptions: { ...this.config.exportOptions, ...newConfig.exportOptions },
    };
  }

  // 获取当前配置
  getConfig(): PlatformQRGeneratorConfig {
    return { ...this.config };
  }

  // 检查是否已初始化
  private checkInitialized(): void {
    if (!this.isInitialized || !this.previewElement) {
      throw new Error('QR生成器未初始化，请先调用 initialize() 方法');
    }
  }

  // 创建预览快照
  async createSnapshot(): Promise<HTMLCanvasElement> {
    this.checkInitialized();

    const options = {
      ...this.config.exportOptions,
      width: this.config.export.width,
      height: this.config.export.height,
    };

    const canvas = await html2canvas(this.previewElement!, options);
    return canvas;
  }

  // 应用圆角效果
  private applyRoundedCorners(canvas: HTMLCanvasElement, borderRadius: number): HTMLCanvasElement {
    if (borderRadius <= 0) return canvas;

    const roundedCanvas = document.createElement('canvas');
    const ctx = roundedCanvas.getContext('2d');
    
    if (!ctx) return canvas;

    roundedCanvas.width = canvas.width;
    roundedCanvas.height = canvas.height;

    // 创建圆角路径
    const radius = Math.min(borderRadius * (this.config.exportOptions?.scale || 2), canvas.width / 2, canvas.height / 2);
    
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    // 绘制原始canvas
    ctx.drawImage(canvas, 0, 0);

    return roundedCanvas;
  }

  // 导出为PNG Blob
  async exportAsPNG(options?: { 
    quality?: number; 
    borderRadius?: number;
    scale?: number;
  }): Promise<Blob> {
    this.checkInitialized();

    // 临时更新导出选项
    const originalExportOptions = this.config.exportOptions;
    if (options?.scale) {
      this.config.exportOptions = {
        ...this.config.exportOptions,
        scale: options.scale,
      };
    }

    try {
      let canvas = await this.createSnapshot();
      
      // 应用圆角
      const borderRadius = options?.borderRadius ?? this.config.export.borderRadius;
      if (borderRadius > 0) {
        canvas = this.applyRoundedCorners(canvas, borderRadius);
      }

      // 转换为Blob
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('无法创建PNG Blob'));
            }
          },
          'image/png',
          options?.quality ?? this.config.export.quality
        );
      });
    } finally {
      // 恢复原始导出选项
      this.config.exportOptions = originalExportOptions;
    }
  }

  // 导出为DataURL
  async exportAsDataURL(options?: { 
    quality?: number; 
    borderRadius?: number;
    scale?: number;
  }): Promise<string> {
    this.checkInitialized();

    // 临时更新导出选项
    const originalExportOptions = this.config.exportOptions;
    if (options?.scale) {
      this.config.exportOptions = {
        ...this.config.exportOptions,
        scale: options.scale,
      };
    }

    try {
      let canvas = await this.createSnapshot();
      
      // 应用圆角
      const borderRadius = options?.borderRadius ?? this.config.export.borderRadius;
      if (borderRadius > 0) {
        canvas = this.applyRoundedCorners(canvas, borderRadius);
      }

      return canvas.toDataURL(
        'image/png',
        options?.quality ?? this.config.export.quality
      );
    } finally {
      // 恢复原始导出选项
      this.config.exportOptions = originalExportOptions;
    }
  }

  // 下载PNG文件
  async downloadAsPNG(filename?: string, options?: { 
    quality?: number; 
    borderRadius?: number;
    scale?: number;
  }): Promise<void> {
    const blob = await this.exportAsPNG(options);
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `qr-code-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  // 获取预览元素的尺寸信息
  getPreviewInfo(): { width: number; height: number; element: HTMLElement | null } {
    return {
      width: this.config.export.width,
      height: this.config.export.height,
      element: this.previewElement,
    };
  }

  // 生成配置字符串（用于导出配置）
  generateConfigString(): string {
    const exportConfig = {
      qr: this.config.qr,
      backgrounds: this.config.backgrounds,
      texts: this.config.texts,
      htmlModules: this.config.htmlModules,
      export: this.config.export,
      exportOptions: this.config.exportOptions,
    };

    return JSON.stringify(exportConfig, null, 2);
  }

  // 从配置字符串加载配置
  loadFromConfigString(configString: string): void {
    try {
      const config = JSON.parse(configString);
      this.updateConfig(config);
    } catch (error) {
      throw new Error(`无法解析配置字符串: ${error}`);
    }
  }

  // 销毁实例
  destroy(): void {
    this.previewElement = null;
    this.isInitialized = false;
  }

  // 验证配置
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.qr.content) {
      errors.push('二维码内容不能为空');
    }

    if (this.config.export.width <= 0 || this.config.export.height <= 0) {
      errors.push('导出尺寸必须大于0');
    }

    if (this.config.export.quality < 0 || this.config.export.quality > 1) {
      errors.push('导出质量必须在0-1之间');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 获取预计文件大小（估算）
  async getEstimatedFileSize(): Promise<number> {
    try {
      const blob = await this.exportAsPNG({ scale: 1 }); // 使用较低分辨率估算
      const actualScale = this.config.exportOptions?.scale || 2;
      return blob.size * (actualScale * actualScale); // 按比例估算实际大小
    } catch {
      // 如果无法获取实际大小，返回估算值
      const { width, height } = this.config.export;
      const scale = this.config.exportOptions?.scale || 2;
      return width * height * scale * scale * 0.5; // 粗略估算
    }
  }
}

// 便捷函数：创建平台QR生成器
export const createPlatformQRGenerator = (config: PlatformQRGeneratorConfig): PlatformQRGenerator => {
  return new PlatformQRGenerator(config);
};

// 便捷函数：从预览元素快速导出
export const exportPreviewAsPNG = async (
  previewElement: HTMLElement,
  config: PlatformQRGeneratorConfig,
  options?: { 
    quality?: number; 
    borderRadius?: number;
    scale?: number;
  }
): Promise<Blob> => {
  const generator = createPlatformQRGenerator(config);
  generator.initialize(previewElement);
  
  try {
    return await generator.exportAsPNG(options);
  } finally {
    generator.destroy();
  }
};

// 便捷函数：从预览元素快速获取DataURL
export const exportPreviewAsDataURL = async (
  previewElement: HTMLElement,
  config: PlatformQRGeneratorConfig,
  options?: { 
    quality?: number; 
    borderRadius?: number;
    scale?: number;
  }
): Promise<string> => {
  const generator = createPlatformQRGenerator(config);
  generator.initialize(previewElement);
  
  try {
    return await generator.exportAsDataURL(options);
  } finally {
    generator.destroy();
  }
};

// 类型导出
// export type { PlatformQRGeneratorConfig };

// 主要的QR生成器类
export class QRGenerator {
  private config: QRGeneratorConfig;
  private container: HTMLDivElement | null = null;
  private qrCode: QRCodeStyling | null = null;
  private isRendered = false;

  constructor(config: Partial<QRGeneratorConfig>) {
    // 合并配置，如果没有提供qrPosition和qrSize，则自动计算
    const mergedConfig = { ...defaultConfig, ...config } as QRGeneratorConfig;
    
    // 如果没有明确设置二维码位置和尺寸，则根据画布尺寸自动计算
    if (!config.qrPosition || !config.qrSize) {
      const autoSettings = calculateDefaultQRSettings(
        mergedConfig.width, 
        mergedConfig.height
      );
      if (!config.qrPosition) {
        mergedConfig.qrPosition = autoSettings.qrPosition;
      }
      if (!config.qrSize) {
        mergedConfig.qrSize = autoSettings.qrSize;
      }
    }
    
    this.config = mergedConfig;
  }

  // 创建画布容器
  private createCanvas(): HTMLDivElement {
    const canvas = document.createElement('div');
    canvas.style.cssText = `
      position: relative;
      width: ${this.config.width}px;
      height: ${this.config.height}px;
      background: ${this.config.backgroundOptions.color};
      overflow: hidden;
      font-family: Arial, sans-serif;
    `;

    // 应用渐变背景
    if (this.config.backgroundOptions.gradient) {
      const gradient = this.createGradientStyle(this.config.backgroundOptions.gradient);
      canvas.style.background = gradient;
    }

    // 应用圆角
    if (this.config.exportOptions.borderRadius > 0) {
      canvas.style.borderRadius = `${this.config.exportOptions.borderRadius}px`;
    }

    return canvas;
  }

  // 创建渐变样式
  private createGradientStyle(gradient: NonNullable<QRGeneratorConfig['dotsOptions']['gradient']>): string {
    const { type, rotation, colorStops } = gradient;
    const stops = colorStops.map((stop: any) => `${stop.color} ${stop.offset * 100}%`).join(', ');
    
    if (type === 'linear') {
      return `linear-gradient(${rotation}deg, ${stops})`;
    } else {
      return `radial-gradient(circle, ${stops})`;
    }
  }

  // 获取object-fit样式
  private getObjectFitStyle(mode: string): string {
    switch (mode) {
      case 'fill':
      case 'stretch':
        return 'fill';
      case 'contain':
        return 'contain';
      case 'cover':
        return 'cover';
      default:
        return 'fill';
    }
  }

  // 添加背景图片
  private async addBackgrounds(canvas: HTMLDivElement): Promise<void> {
    if (!this.config.backgrounds || this.config.backgrounds.length === 0) return;

    const loadPromises = this.config.backgrounds.map(async (bg, index) => {
      return new Promise<void>((resolve) => {
        const img = document.createElement('img');
        img.style.cssText = `
          position: absolute;
          left: ${bg.position.x}px;
          top: ${bg.position.y}px;
          width: ${bg.size.width}px;
          height: ${bg.size.height}px;
          z-index: ${bg.zIndex};
          opacity: ${bg.opacity};
          object-fit: ${this.getObjectFitStyle(bg.mode)};
          pointer-events: none;
          background-repeat: no-repeat;
        `;
        
        img.onload = () => {
          console.log(`背景图片 ${index + 1} 加载成功`);
          canvas.appendChild(img);
          resolve();
        };
        
        img.onerror = (error) => {
          console.warn(`背景图片 ${index + 1} 加载失败:`, error);
          resolve(); // 继续执行，不阻塞其他元素
        };
        
        // 设置crossOrigin在设置src之前
        img.crossOrigin = 'anonymous';
        img.src = bg.src;
        
        // 添加超时处理
        setTimeout(() => {
          if (!img.complete) {
            console.warn(`背景图片 ${index + 1} 加载超时`);
            resolve();
          }
        }, 10000); // 10秒超时
      });
    });

    await Promise.all(loadPromises);
  }

  // 添加二维码 - 使用配置中的位置和尺寸
  private async addQRCode(canvas: HTMLDivElement): Promise<void> {
    return new Promise((resolve) => {
      // 使用配置中的二维码位置和尺寸
      const qrX = this.config.qrPosition.x;
      const qrY = this.config.qrPosition.y;
      const qrWidth = this.config.qrSize.width;
      const qrHeight = this.config.qrSize.height;

      console.log(`二维码配置: 位置(${qrX}, ${qrY}), 尺寸(${qrWidth}x${qrHeight})`);

      // 创建二维码容器
      const qrContainer = document.createElement('div');
      qrContainer.style.cssText = `
        position: absolute;
        left: ${qrX}px;
        top: ${qrY}px;
        width: ${qrWidth}px;
        height: ${qrHeight}px;
        z-index: 100;
      `;

      // 配置二维码样式
      const qrConfig = {
        width: qrWidth,
        height: qrHeight,
        type: 'canvas' as const,
        data: this.config.text,
        image: this.config.logo?.src,
        qrOptions: this.config.qrOptions,
        imageOptions: {
          ...this.config.imageOptions,
          imageSize: this.config.logo?.size ? this.config.logo.size / 100 : this.config.imageOptions.imageSize,
        },
        dotsOptions: this.config.dotsOptions,
        backgroundOptions: this.config.backgroundOptions,
        cornersSquareOptions: this.config.cornersSquareOptions,
        cornersDotOptions: this.config.cornersDotOptions,
      };

      this.qrCode = new QRCodeStyling(qrConfig as any);
      
      // 渲染二维码
      this.qrCode.append(qrContainer);
      canvas.appendChild(qrContainer);

      // 等待二维码渲染完成
      setTimeout(() => {
        console.log('二维码渲染完成');
        resolve();
      }, 500);
    });
  }

  // 添加文本
  private addTexts(canvas: HTMLDivElement): void {
    if (!this.config.texts || this.config.texts.length === 0) return;

    this.config.texts.forEach((text, index) => {
      const textElement = document.createElement('div');
      textElement.textContent = text.content;
      textElement.style.cssText = `
        position: absolute;
        left: ${text.position.x}px;
        top: ${text.position.y}px;
        font-size: ${text.fontSize}px;
        color: ${text.color};
        font-family: ${text.fontFamily};
        font-weight: ${text.fontWeight};
        z-index: ${text.zIndex};
        opacity: ${text.opacity};
        text-align: ${text.textAlign || 'left'};
        line-height: ${text.lineHeight || 1.2};
        white-space: pre-wrap;
        word-break: break-word;
        pointer-events: none;
      `;
      
      console.log(`添加文本 ${index + 1}: "${text.content}" 位置(${text.position.x}, ${text.position.y})`);
      canvas.appendChild(textElement);
    });
  }

  // 添加HTML模块
  private addHtmlModules(canvas: HTMLDivElement): void {
    if (!this.config.htmlModules || this.config.htmlModules.length === 0) return;

    this.config.htmlModules.forEach((module, index) => {
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = module.content;
      htmlElement.style.cssText = `
        position: absolute;
        left: ${module.position.x}px;
        top: ${module.position.y}px;
        width: ${module.size.width}px;
        height: ${module.size.height}px;
        z-index: ${module.zIndex};
        opacity: ${module.opacity};
        overflow: hidden;
        pointer-events: none;
      `;
      
      console.log(`添加HTML模块 ${index + 1} 位置(${module.position.x}, ${module.position.y})`);
      canvas.appendChild(htmlElement);
    });
  }

  // 渲染完整画布
  async render(): Promise<HTMLDivElement> {
    // 创建主画布
    this.container = this.createCanvas();
    
    // 添加到DOM（隐藏位置）
    this.container.style.position = 'absolute';
    this.container.style.left = '-9999px';
    this.container.style.top = '-9999px';
    document.body.appendChild(this.container);

    try {
      console.log('开始渲染画布...', {
        canvas: `${this.config.width}x${this.config.height}`,
        qrPosition: this.config.qrPosition,
        qrSize: this.config.qrSize
      });
      
      // 按层级顺序添加元素
      console.log('添加背景图片...');
      await this.addBackgrounds(this.container);
      
      console.log('添加二维码...');
      await this.addQRCode(this.container);
      
      console.log('添加文本...');
      this.addTexts(this.container);
      
      console.log('添加HTML模块...');
      this.addHtmlModules(this.container);
      
      this.isRendered = true;
      console.log('画布渲染完成');
      return this.container;
    } catch (error) {
      console.error('画布渲染失败:', error);
      this.cleanup();
      throw error;
    }
  }

  // 导出为PNG
  async exportAsPNG(options?: {
    scale?: number;
    quality?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }): Promise<Blob> {
    if (!this.isRendered) {
      await this.render();
    }

    if (!this.container) {
      throw new Error('画布未创建');
    }

    const html2canvasOptions = {
      scale: options?.scale || 2,
      useCORS: options?.useCORS !== false,
      allowTaint: options?.allowTaint !== false,
      backgroundColor: null,
      logging: false,
      width: this.config.width,
      height: this.config.height,
    };

    try {
      console.log('开始导出PNG...', html2canvasOptions);
      const canvas = await html2canvas(this.container, html2canvasOptions);
      console.log('html2canvas完成，画布尺寸:', canvas.width, 'x', canvas.height);
      
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log('PNG导出成功，大小:', blob.size, 'bytes');
              resolve(blob);
            } else {
              reject(new Error('无法创建PNG Blob'));
            }
          },
          'image/png',
          options?.quality || this.config.exportOptions.quality
        );
      });
    } catch (error) {
      console.error('导出PNG失败:', error);
      throw new Error(`导出PNG失败: ${error}`);
    }
  }

  // 导出为DataURL
  async exportAsDataURL(options?: {
    scale?: number;
    quality?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }): Promise<string> {
    if (!this.isRendered) {
      await this.render();
    }

    if (!this.container) {
      throw new Error('画布未创建');
    }

    const html2canvasOptions = {
      scale: options?.scale || 2,
      useCORS: options?.useCORS !== false,
      allowTaint: options?.allowTaint !== false,
      backgroundColor: null,
      logging: false,
      width: this.config.width,
      height: this.config.height,
    };

    try {
      const canvas = await html2canvas(this.container, html2canvasOptions);
      return canvas.toDataURL(
        'image/png',
        options?.quality || this.config.exportOptions.quality
      );
    } catch (error) {
      throw new Error(`导出DataURL失败: ${error}`);
    }
  }

  // 下载PNG文件
  async downloadAsPNG(filename?: string, options?: {
    scale?: number;
    quality?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }): Promise<void> {
    const blob = await this.exportAsPNG(options);
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `qr-code-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  // 获取预览元素（用于显示）
  getPreviewElement(): HTMLDivElement | null {
    return this.container;
  }

  // 更新配置
  updateConfig(newConfig: Partial<QRGeneratorConfig>): void {
    // 如果更新了画布尺寸但没有更新二维码位置/尺寸，则自动重新计算
    if ((newConfig.width || newConfig.height) && (!newConfig.qrPosition && !newConfig.qrSize)) {
      const width = newConfig.width || this.config.width;
      const height = newConfig.height || this.config.height;
      const autoSettings = calculateDefaultQRSettings(width, height);
      newConfig.qrPosition = autoSettings.qrPosition;
      newConfig.qrSize = autoSettings.qrSize;
    }
    
    this.config = { ...this.config, ...newConfig };
    this.isRendered = false;
  }

  // 获取当前配置
  getConfig(): QRGeneratorConfig {
    return { ...this.config };
  }

  // 获取配置JSON字符串
  getConfigString(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // 从配置字符串加载
  loadFromConfigString(configString: string): void {
    try {
      const config = JSON.parse(configString);
      this.updateConfig(config);
    } catch (error) {
      throw new Error(`无法解析配置字符串: ${error}`);
    }
  }

  // 验证配置
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.text) {
      errors.push('二维码内容不能为空');
    }

    if (this.config.width <= 0 || this.config.height <= 0) {
      errors.push('画布尺寸必须大于0');
    }

    // 验证二维码位置和尺寸
    if (!this.config.qrPosition) {
      errors.push('二维码位置未设置');
    } else {
      if (this.config.qrPosition.x < 0 || this.config.qrPosition.y < 0) {
        errors.push('二维码位置不能为负数');
      }
      if (this.config.qrPosition.x >= this.config.width || this.config.qrPosition.y >= this.config.height) {
        errors.push('二维码位置超出画布范围');
      }
    }

    if (!this.config.qrSize) {
      errors.push('二维码尺寸未设置');
    } else {
      if (this.config.qrSize.width <= 0 || this.config.qrSize.height <= 0) {
        errors.push('二维码尺寸必须大于0');
      }
      if (this.config.qrPosition && 
          (this.config.qrPosition.x + this.config.qrSize.width > this.config.width ||
           this.config.qrPosition.y + this.config.qrSize.height > this.config.height)) {
        errors.push('二维码超出画布边界');
      }
    }

    if (this.config.exportOptions.quality < 0 || this.config.exportOptions.quality > 1) {
      errors.push('导出质量必须在0-1之间');
    }

    // 验证背景图片配置
    if (this.config.backgrounds && this.config.backgrounds.length > 0) {
      this.config.backgrounds.forEach((bg, index) => {
        if (!bg.src) {
          errors.push(`背景图片 ${index + 1} 缺少src属性`);
        }
        if (bg.size.width <= 0 || bg.size.height <= 0) {
          errors.push(`背景图片 ${index + 1} 尺寸必须大于0`);
        }
        if (bg.opacity < 0 || bg.opacity > 1) {
          errors.push(`背景图片 ${index + 1} 透明度必须在0-1之间`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 清理资源
  cleanup(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.qrCode = null;
    this.isRendered = false;
  }

  // 销毁实例
  destroy(): void {
    this.cleanup();
  }
}

// 便捷函数：创建QR生成器
export const createQRGenerator = (config: Partial<QRGeneratorConfig>): QRGenerator => {
  return new QRGenerator(config);
};

// 便捷函数：快速生成并导出PNG
export const generateQRAsPNG = async (
  config: Partial<QRGeneratorConfig>,
  exportOptions?: {
    scale?: number;
    quality?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }
): Promise<Blob> => {
  const generator = createQRGenerator(config);
  
  try {
    return await generator.exportAsPNG(exportOptions);
  } finally {
    generator.destroy();
  }
};

// 便捷函数：快速生成并导出DataURL
export const generateQRAsDataURL = async (
  config: Partial<QRGeneratorConfig>,
  exportOptions?: {
    scale?: number;
    quality?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }
): Promise<string> => {
  const generator = createQRGenerator(config);
  
  try {
    return await generator.exportAsDataURL(exportOptions);
  } finally {
    generator.destroy();
  }
};

// 便捷函数：快速生成并下载
export const generateAndDownloadQR = async (
  config: Partial<QRGeneratorConfig>,
  filename?: string,
  exportOptions?: {
    scale?: number;
    quality?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  }
): Promise<void> => {
  const generator = createQRGenerator(config);
  
  try {
    await generator.downloadAsPNG(filename, exportOptions);
  } finally {
    generator.destroy();
  }
};

// 类型导出
// export type { QRGeneratorConfig }; 