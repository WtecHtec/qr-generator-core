import React, { useState } from 'react';
import type { useQRGenerator } from '../../hooks/useQRGenerator';

interface QRSettingsProps extends ReturnType<typeof useQRGenerator> {}

export const QRSettings: React.FC<QRSettingsProps> = ({
  config,
  updateQRConfig,
  generateQR,
  isGenerating,
}) => {
  const [logoInputType, setLogoInputType] = useState<'file' | 'url'>('file');
  const [logoUrl, setLogoUrl] = useState('');
  const [isLoadingLogo, setIsLoadingLogo] = useState(false);

  // 辅助函数：将颜色和透明度合并
  const combineColorWithOpacity = (color: string, opacity: number): string => {
    if (color === 'transparent') return 'transparent';
    
    // 如果是十六进制颜色
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // 如果已经是rgba格式，替换透明度
    if (color.startsWith('rgba')) {
      return color.replace(/[\d\.]+\)$/g, `${opacity})`);
    }
    
    return color;
  };

  // 从rgba或hex颜色中提取基础颜色
  const extractBaseColor = (color: string): string => {
    if (color === 'transparent') return '#ffffff';
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
      if (match) {
        const [, r, g, b] = match;
        return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
      }
    }
    return color;
  };

  // 从rgba颜色中提取透明度
  const extractOpacity = (color: string): number => {
    if (color === 'transparent') return 0;
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d\.]+)\)/);
      if (match) {
        return parseFloat(match[1]);
      }
    }
    return 1;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        updateQRConfig({
          logo: {
            src,
            size: 40,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlLoad = async () => {
    if (!logoUrl.trim()) return;
    
    setIsLoadingLogo(true);
    try {
      // 验证URL是否为有效的图片
      const img = new Image();
      img.crossOrigin = 'anonymous'; // 支持跨域
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = logoUrl;
      });

      // 将图片转换为base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建canvas上下文');
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/png');
      
      updateQRConfig({
        logo: {
          src: dataUrl,
          size: 40,
        },
      });
      
    } catch (error) {
      console.error('加载图片失败:', error);
      alert('加载图片失败，请检查URL是否正确或图片是否支持跨域访问');
    } finally {
      setIsLoadingLogo(false);
    }
  };

  const removeLogo = () => {
    updateQRConfig({ logo: undefined });
    setLogoUrl('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">二维码设置</h3>
      
      {/* 二维码内容 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          二维码内容
        </label>
        <textarea
          value={config.qr.content}
          onChange={(e) => updateQRConfig({ content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="输入要生成二维码的内容..."
        />
      </div>

      {/* 二维码大小 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          大小: {config.qr.size}px
        </label>
        <input
          type="range"
          min="100"
          max="400"
          value={config.qr.size}
          onChange={(e) => updateQRConfig({ size: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* 位置设置 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X坐标
          </label>
          <input
            type="number"
            value={config.qr.position.x}
            onChange={(e) => updateQRConfig({
              position: { ...config.qr.position, x: parseInt(e.target.value) || 0 }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Y坐标
          </label>
          <input
            type="number"
            value={config.qr.position.y}
            onChange={(e) => updateQRConfig({
              position: { ...config.qr.position, y: parseInt(e.target.value) || 0 }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 点样式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          点样式
        </label>
        <select
          value={config.qr.dotsOptions.type}
          onChange={(e) => updateQRConfig({
            dotsOptions: { 
              ...config.qr.dotsOptions, 
              type: e.target.value as any 
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="square">方形</option>
          <option value="dots">圆点</option>
          <option value="rounded">圆角</option>
          <option value="extra-rounded">大圆角</option>
          <option value="classy">优雅</option>
          <option value="classy-rounded">优雅圆角</option>
        </select>
      </div>

      {/* 前景色设置 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          前景色（数据点）
        </label>
        <div className="space-y-2">
          <input
            type="color"
            value={extractBaseColor(config.qr.dotsOptions.color)}
            onChange={(e) => updateQRConfig({
              dotsOptions: { 
                ...config.qr.dotsOptions, 
                color: combineColorWithOpacity(e.target.value, extractOpacity(config.qr.dotsOptions.color))
              }
            })}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              透明度: {Math.round(extractOpacity(config.qr.dotsOptions.color) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={extractOpacity(config.qr.dotsOptions.color)}
              onChange={(e) => updateQRConfig({
                dotsOptions: { 
                  ...config.qr.dotsOptions, 
                  color: combineColorWithOpacity(extractBaseColor(config.qr.dotsOptions.color), parseFloat(e.target.value))
                }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 背景色设置 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          背景色
        </label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={extractBaseColor(config.qr.backgroundOptions.color)}
              onChange={(e) => updateQRConfig({
                backgroundOptions: { 
                  ...config.qr.backgroundOptions, 
                  color: combineColorWithOpacity(e.target.value, extractOpacity(config.qr.backgroundOptions.color))
                }
              })}
              className="flex-1 h-10 border border-gray-300 rounded-md"
              disabled={config.qr.backgroundOptions.color === 'transparent'}
            />
            <button
              onClick={() => updateQRConfig({
                backgroundOptions: { 
                  ...config.qr.backgroundOptions, 
                  color: config.qr.backgroundOptions.color === 'transparent' ? '#ffffff' : 'transparent'
                }
              })}
              className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                config.qr.backgroundOptions.color === 'transparent'
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {config.qr.backgroundOptions.color === 'transparent' ? '透明' : '设为透明'}
            </button>
          </div>
          {config.qr.backgroundOptions.color !== 'transparent' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                透明度: {Math.round(extractOpacity(config.qr.backgroundOptions.color) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={extractOpacity(config.qr.backgroundOptions.color)}
                onChange={(e) => updateQRConfig({
                  backgroundOptions: { 
                    ...config.qr.backgroundOptions, 
                    color: combineColorWithOpacity(extractBaseColor(config.qr.backgroundOptions.color), parseFloat(e.target.value))
                  }
                })}
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* 角落方块设置 */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-800 mb-3">角落方块设置</h4>
        
        {/* 角落方块样式 */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            角落方块样式
          </label>
          <select
            value={config.qr.cornersSquareOptions.type}
            onChange={(e) => updateQRConfig({
              cornersSquareOptions: { 
                ...config.qr.cornersSquareOptions, 
                type: e.target.value as any 
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="square">方形</option>
            <option value="extra-rounded">圆角</option>
            <option value="dot">圆点</option>
          </select>
        </div>

        {/* 角落方块颜色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            角落方块颜色
          </label>
          <div className="space-y-2">
            <input
              type="color"
              value={extractBaseColor(config.qr.cornersSquareOptions.color)}
              onChange={(e) => updateQRConfig({
                cornersSquareOptions: { 
                  ...config.qr.cornersSquareOptions, 
                  color: combineColorWithOpacity(e.target.value, extractOpacity(config.qr.cornersSquareOptions.color))
                }
              })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                透明度: {Math.round(extractOpacity(config.qr.cornersSquareOptions.color) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={extractOpacity(config.qr.cornersSquareOptions.color)}
                onChange={(e) => updateQRConfig({
                  cornersSquareOptions: { 
                    ...config.qr.cornersSquareOptions, 
                    color: combineColorWithOpacity(extractBaseColor(config.qr.cornersSquareOptions.color), parseFloat(e.target.value))
                  }
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 角落点设置 */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-800 mb-3">角落点设置</h4>
        
        {/* 角落点样式 */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            角落点样式
          </label>
          <select
            value={config.qr.cornersDotOptions.type}
            onChange={(e) => updateQRConfig({
              cornersDotOptions: { 
                ...config.qr.cornersDotOptions, 
                type: e.target.value as any 
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="square">方形</option>
            <option value="dot">圆点</option>
          </select>
        </div>

        {/* 角落点颜色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            角落点颜色
          </label>
          <div className="space-y-2">
            <input
              type="color"
              value={extractBaseColor(config.qr.cornersDotOptions.color)}
              onChange={(e) => updateQRConfig({
                cornersDotOptions: { 
                  ...config.qr.cornersDotOptions, 
                  color: combineColorWithOpacity(e.target.value, extractOpacity(config.qr.cornersDotOptions.color))
                }
              })}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                透明度: {Math.round(extractOpacity(config.qr.cornersDotOptions.color) * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={extractOpacity(config.qr.cornersDotOptions.color)}
                onChange={(e) => updateQRConfig({
                  cornersDotOptions: { 
                    ...config.qr.cornersDotOptions, 
                    color: combineColorWithOpacity(extractBaseColor(config.qr.cornersDotOptions.color), parseFloat(e.target.value))
                  }
                })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 快速颜色预设 */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-800 mb-3">快速颜色预设</h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateQRConfig({
              dotsOptions: { ...config.qr.dotsOptions, color: '#000000' },
              cornersSquareOptions: { ...config.qr.cornersSquareOptions, color: '#000000' },
              cornersDotOptions: { ...config.qr.cornersDotOptions, color: '#000000' },
            })}
            className="px-3 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            经典黑色
          </button>
          <button
            onClick={() => updateQRConfig({
              dotsOptions: { ...config.qr.dotsOptions, color: '#3b82f6' },
              cornersSquareOptions: { ...config.qr.cornersSquareOptions, color: '#1d4ed8' },
              cornersDotOptions: { ...config.qr.cornersDotOptions, color: '#1e40af' },
            })}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            蓝色渐变
          </button>
          <button
            onClick={() => updateQRConfig({
              dotsOptions: { ...config.qr.dotsOptions, color: '#10b981' },
              cornersSquareOptions: { ...config.qr.cornersSquareOptions, color: '#059669' },
              cornersDotOptions: { ...config.qr.cornersDotOptions, color: '#047857' },
            })}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            绿色渐变
          </button>
          <button
            onClick={() => updateQRConfig({
              dotsOptions: { ...config.qr.dotsOptions, color: '#f59e0b' },
              cornersSquareOptions: { ...config.qr.cornersSquareOptions, color: '#d97706' },
              cornersDotOptions: { ...config.qr.cornersDotOptions, color: '#b45309' },
            })}
            className="px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            橙色渐变
          </button>
          <button
            onClick={() => updateQRConfig({
              dotsOptions: { ...config.qr.dotsOptions, color: '#ef4444' },
              cornersSquareOptions: { ...config.qr.cornersSquareOptions, color: '#dc2626' },
              cornersDotOptions: { ...config.qr.cornersDotOptions, color: '#b91c1c' },
            })}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            红色渐变
          </button>
          <button
            onClick={() => updateQRConfig({
              dotsOptions: { ...config.qr.dotsOptions, color: '#8b5cf6' },
              cornersSquareOptions: { ...config.qr.cornersSquareOptions, color: '#7c3aed' },
              cornersDotOptions: { ...config.qr.cornersDotOptions, color: '#6d28d9' },
            })}
            className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            紫色渐变
          </button>
        </div>
      </div>

      {/* Logo设置 */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Logo图片
        </label>
        
        {/* 输入方式选择 */}
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setLogoInputType('file')}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              logoInputType === 'file'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            本地上传
          </button>
          <button
            onClick={() => setLogoInputType('url')}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              logoInputType === 'url'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            URL链接
          </button>
        </div>

        {/* 文件上传 */}
        {logoInputType === 'file' && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* URL输入 */}
        {logoInputType === 'url' && (
          <div className="space-y-2">
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="输入图片URL地址..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUrlLoad}
              disabled={!logoUrl.trim() || isLoadingLogo}
              className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingLogo ? '加载中...' : '加载图片'}
            </button>
          </div>
        )}

        {/* Logo预览和设置 */}
        {config.qr.logo && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={config.qr.logo.src}
                  alt="Logo预览"
                  className="w-12 h-12 object-cover rounded border"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Logo已设置</div>
                  <div className="text-xs text-gray-500">大小: {config.qr.logo.size}px</div>
                </div>
              </div>
              <button
                onClick={removeLogo}
                className="text-red-600 hover:text-red-800 text-sm p-1 hover:bg-red-50 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo大小: {config.qr.logo.size}px
              </label>
              <input
                type="range"
                min="20"
                max="1000"
                value={config.qr.logo.size}
                onChange={(e) => updateQRConfig({
                  logo: { ...config.qr.logo!, size: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* URL示例 */}
        {logoInputType === 'url' && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="mb-1">示例URL:</div>
            <div className="space-y-1">
              <div>• https://example.com/logo.png</div>
              <div>• https://cdn.example.com/images/logo.jpg</div>
            </div>
            <div className="mt-2 text-yellow-600">
              ⚠️ 注意：图片服务器需要支持跨域访问(CORS)
            </div>
          </div>
        )}
      </div>

      {/* 容错级别 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          容错级别
        </label>
        <select
          value={config.qr.qrOptions.errorCorrectionLevel}
          onChange={(e) => updateQRConfig({
            qrOptions: {
              ...config.qr.qrOptions,
              errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="L">低 (7%)</option>
          <option value="M">中 (15%)</option>
          <option value="Q">高 (25%)</option>
          <option value="H">最高 (30%)</option>
        </select>
      </div>

      {/* 生成按钮 */}
      <button
        onClick={generateQR}
        disabled={isGenerating}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? '生成中...' : '生成二维码'}
      </button>
    </div>
  );
};