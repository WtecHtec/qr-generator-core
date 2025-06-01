import { useState, useCallback, useMemo } from 'react';
import type {
  CanvasConfig,
  QRConfig,
  BackgroundImage,
  TextLayer,
  HtmlModule,
  ExportConfig,
} from '../types/qr-generator';
import {
  generateQRCode,
  exportCanvasAsPNG,
  downloadImage,
  generateId,
} from '../utils/qr-generator';

// 默认配置
const defaultQRConfig: QRConfig = {
  content: 'https://example.com',
  size: 200,
  position: { x: 50, y: 50 },
  margin: 4,
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
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'M',
  },
};

// ... 其余代码保持不变 ...

const defaultExportConfig: ExportConfig = {
  width: 800,
  height: 600,
  format: 'png',
  quality: 0.9,
  borderRadius: 0, // 默认无圆角
};

export const useQRGenerator = () => {
  const [config, setConfig] = useState<CanvasConfig>({
    qr: defaultQRConfig,
    backgrounds: [],
    texts: [],
    htmlModules: [],
    export: defaultExportConfig,
  });

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 生成二维码
  const generateQR = useCallback(async () => {
    setIsGenerating(true);
    try {
      // qr-code-styling 库已经内置了logo功能，直接生成即可
      const dataUrl = await generateQRCode(config.qr);
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('生成二维码失败:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [config.qr]);

  // 更新二维码配置
  const updateQRConfig = useCallback((updates: Partial<QRConfig>) => {
    setConfig(prev => ({
      ...prev,
      qr: { ...prev.qr, ...updates },
    }));
  }, []);

  // 添加背景图片
  const addBackground = useCallback((src: string) => {
    const newBackground: BackgroundImage = {
      id: generateId(),
      src,
      position: { x: 0, y: 0 },
      size: { width: config.export.width, height: config.export.height },
      mode: 'fill',
      zIndex: 1,
      opacity: 1,
    };
    
    setConfig(prev => ({
      ...prev,
      backgrounds: [...prev.backgrounds, newBackground],
    }));
  }, [config.export.width, config.export.height]);

  // 更新背景图片
  const updateBackground = useCallback((id: string, updates: Partial<BackgroundImage>) => {
    setConfig(prev => ({
      ...prev,
      backgrounds: prev.backgrounds.map(bg =>
        bg.id === id ? { ...bg, ...updates } : bg
      ),
    }));
  }, []);

  // 删除背景图片
  const removeBackground = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      backgrounds: prev.backgrounds.filter(bg => bg.id !== id),
    }));
  }, []);

  // 添加文案
  const addText = useCallback(() => {
    const newText: TextLayer = {
      id: generateId(),
      content: '新文案',
      position: { x: 100, y: 100 },
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial',
      fontWeight: 400,
      zIndex: 10,
      opacity: 1,
    };
    
    setConfig(prev => ({
      ...prev,
      texts: [...prev.texts, newText],
    }));
  }, []);

  // 更新文案
  const updateText = useCallback((id: string, updates: Partial<TextLayer>) => {
    setConfig(prev => ({
      ...prev,
      texts: prev.texts.map(text =>
        text.id === id ? { ...text, ...updates } : text
      ),
    }));
  }, []);

  // 删除文案
  const removeText = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      texts: prev.texts.filter(text => text.id !== id),
    }));
  }, []);

  // 添加HTML模块
  const addHtmlModule = useCallback(() => {
    const newModule: HtmlModule = {
      id: generateId(),
      content: '<div>HTML内容</div>',
      position: { x: 200, y: 200 },
      size: { width: 200, height: 100 },
      zIndex: 5,
      opacity: 1,
    };
    
    setConfig(prev => ({
      ...prev,
      htmlModules: [...prev.htmlModules, newModule],
    }));
  }, []);

  // 更新HTML模块
  const updateHtmlModule = useCallback((id: string, updates: Partial<HtmlModule>) => {
    setConfig(prev => ({
      ...prev,
      htmlModules: prev.htmlModules.map(module =>
        module.id === id ? { ...module, ...updates } : module
      ),
    }));
  }, []);

  // 删除HTML模块
  const removeHtmlModule = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      htmlModules: prev.htmlModules.filter(module => module.id !== id),
    }));
  }, []);

  // 更新导出配置
  const updateExportConfig = useCallback((updates: Partial<ExportConfig>) => {
    setConfig(prev => ({
      ...prev,
      export: { ...prev.export, ...updates },
    }));
  }, []);

  // 导出图片
  const exportImage = useCallback(async () => {
    setIsExporting(true);
    try {
      const dataUrl = await exportCanvasAsPNG('qr-canvas', {
        width: config.export.width,
        height: config.export.height,
        quality: config.export.quality,
      });
      
      downloadImage(dataUrl, `qr-code-${Date.now()}.png`);
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setIsExporting(false);
    }
  }, [config.export]);

  // 排序后的图层（按zIndex排序）
  const sortedLayers = useMemo(() => {
    const allLayers = [
      ...config.backgrounds.map(bg => ({ ...bg, type: 'background' as const })),
      ...config.texts.map(text => ({ ...text, type: 'text' as const })),
      ...config.htmlModules.map(module => ({ ...module, type: 'html' as const })),
    ];
    
    return allLayers.sort((a, b) => a.zIndex - b.zIndex);
  }, [config.backgrounds, config.texts, config.htmlModules]);

  return {
    config,
    qrDataUrl,
    isGenerating,
    isExporting,
    sortedLayers,
    generateQR,
    updateQRConfig,
    addBackground,
    updateBackground,
    removeBackground,
    addText,
    updateText,
    removeText,
    addHtmlModule,
    updateHtmlModule,
    removeHtmlModule,
    updateExportConfig,
    exportImage,
  };
}; 