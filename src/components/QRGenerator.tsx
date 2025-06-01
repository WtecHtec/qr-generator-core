import React, { useEffect } from 'react';
import { useQRGenerator } from '../hooks/useQRGenerator';
import { SettingsPanel } from './SettingsPanel';
import { PreviewCanvas } from './PreviewCanvas';

export const QRGenerator: React.FC = () => {
  const qrGenerator = useQRGenerator();

  // 初始化时生成二维码
  useEffect(() => {
    qrGenerator.generateQR();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 左侧设置面板 */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <SettingsPanel {...qrGenerator} />
      </div>
      
      {/* 右侧预览区域 */}
      <div className="flex-1 p-6">
        <PreviewCanvas {...qrGenerator} />
      </div>
    </div>
  );
}; 