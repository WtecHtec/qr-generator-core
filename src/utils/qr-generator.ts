import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import type { QRConfig } from '../types/qr-generator';

// 生成二维码数据URL
export const generateQRCode = async (config: QRConfig): Promise<string> => {
  try {
    const qrCodeOptions: any = {
      width: config.size,
      height: config.size,
      type: 'canvas',
      data: config.content,
      margin: config.margin,
      qrOptions: {
        typeNumber: config?.qrOptions?.typeNumber,
        mode: config?.qrOptions?.mode,
        errorCorrectionLevel: config?.qrOptions?.errorCorrectionLevel,
      },
      dotsOptions: {
        color: config?.dotsOptions?.color,
        type: config?.dotsOptions?.type,
      },
      backgroundOptions: {
        color: config?.backgroundOptions?.color,
      },
      cornersSquareOptions: {
        color: config?.cornersSquareOptions?.color,
        type: config?.cornersSquareOptions?.type,
      },
      cornersDotOptions: {
        color: config?.cornersDotOptions?.color,
        type: config?.cornersDotOptions?.type,
      },
    };      

    // 只有当有logo时才添加image相关配置
    if (config.logo?.src) {
      qrCodeOptions.image = config.logo.src;
      qrCodeOptions.imageOptions = {
        hideBackgroundDots: config.imageOptions?.hideBackgroundDots ?? true,
        imageSize: (config.logo.size / config.size) || 0.4, // 转换为比例
        margin: config.imageOptions?.margin ?? 5,
        crossOrigin: config.imageOptions?.crossOrigin ?? 'anonymous',
      };
    }

    const qrCode = new QRCodeStyling(qrCodeOptions);

    return new Promise((resolve, reject) => {
      qrCode.getRawData('png').then((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob as Blob);
        } else {
          reject(new Error('生成二维码失败'));
        }
      }).catch(reject);
    });
  } catch (error) {
    console.error('生成二维码失败:', error);
    throw new Error('生成二维码失败');
  }
};

// 应用圆角效果
const applyRoundedCorners = (canvas: HTMLCanvasElement, borderRadius: number): HTMLCanvasElement => {
  if (borderRadius <= 0) {
    return canvas;
  }

  const roundedCanvas = document.createElement('canvas');
  const ctx = roundedCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('无法创建圆角canvas上下文');
  }

  roundedCanvas.width = canvas.width;
  roundedCanvas.height = canvas.height;

  // 创建圆角路径
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, borderRadius);
  ctx.clip();

  // 绘制原始图像
  ctx.drawImage(canvas, 0, 0);

  return roundedCanvas;
};

// 导出画布为图片（支持圆角）
export const exportCanvasAsPNG = async (
  elementId: string,
  config: { width: number; height: number; quality?: number; borderRadius?: number }
): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('找不到要导出的元素');
  }

  try {
    const canvas = await html2canvas(element, {
      width: config.width,
      height: config.height,
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });

    // 如果设置了圆角，应用圆角效果
    const finalCanvas = config.borderRadius && config.borderRadius > 0 
      ? applyRoundedCorners(canvas, config.borderRadius * 2) // 乘以2因为scale是2
      : canvas;

    return finalCanvas.toDataURL('image/png', config.quality || 0.9);
  } catch (error) {
    console.error('导出图片失败:', error);
    throw new Error('导出图片失败');
  }
};

// 下载图片
export const downloadImage = (dataUrl: string, filename: string = 'qr-code.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 工具函数：生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 工具函数：限制数值范围
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// 工具函数：格式化位置
export const formatPosition = (position: { x: number; y: number }) => {
  return {
    x: Math.round(position.x),
    y: Math.round(position.y),
  };
};

// 工具函数：格式化尺寸
export const formatSize = (size: { width: number; height: number }) => {
  return {
    width: Math.round(size.width),
    height: Math.round(size.height),
  };
};