import React, { useState } from 'react';
import type { useQRGenerator } from '../../hooks/useQRGenerator';

interface BackgroundSettingsProps extends ReturnType<typeof useQRGenerator> {}

export const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  config,
  addBackground,
  updateBackground,
  removeBackground,
}) => {
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        addBackground(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlLoad = async () => {
    if (!imageUrl.trim()) return;
    
    setIsLoadingImage(true);
    try {
      // 验证URL是否为有效的图片
      const img = new Image();
      img.crossOrigin = 'anonymous'; // 支持跨域
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
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
      addBackground(dataUrl);
      setImageUrl(''); // 清空输入框
      
    } catch (error) {
      console.error('加载图片失败:', error);
      alert('加载图片失败，请检查URL是否正确或图片是否支持跨域访问');
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 添加背景图片 */}
      <div className="space-y-3">
        {/* 输入方式选择 */}
        <div className="flex space-x-2">
          <button
            onClick={() => setInputType('file')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
              inputType === 'file'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            本地上传
          </button>
          <button
            onClick={() => setInputType('url')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
              inputType === 'url'
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            URL链接
          </button>
        </div>

        {/* 文件上传 */}
        {inputType === 'file' && (
          <label className="block w-full px-4 py-3 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 cursor-pointer transition-colors text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>选择背景图片</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}

        {/* URL输入 */}
        {inputType === 'url' && (
          <div className="space-y-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="输入图片URL地址..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUrlLoad}
              disabled={!imageUrl.trim() || isLoadingImage}
              className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingImage ? '加载中...' : '添加背景图片'}
            </button>
          </div>
        )}

        {/* URL示例 */}
        {inputType === 'url' && (
          <div className="text-xs text-gray-500">
            <div className="mb-1">支持的图片格式: JPG, PNG, GIF, WebP</div>
            <div className="text-yellow-600">
              ⚠️ 注意：图片服务器需要支持跨域访问(CORS)
            </div>
          </div>
        )}
      </div>

      {/* 背景列表 */}
      {config.backgrounds.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-sm">暂无背景图片</p>
          <p className="text-gray-400 text-xs mt-1">选择上方方式添加背景</p>
        </div>
      ) : (
        <div className="space-y-4">
          {config.backgrounds.map((bg) => (
            <div key={bg.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              {/* 预览图 */}
              <div className="flex justify-between items-start">
                <img
                  src={bg.src}
                  alt="背景预览"
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  onClick={() => removeBackground(bg.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  删除
                </button>
              </div>

              {/* 位置设置 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    X坐标
                  </label>
                  <input
                    type="number"
                    value={bg.position.x}
                    onChange={(e) => updateBackground(bg.id, {
                      position: { ...bg.position, x: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Y坐标
                  </label>
                  <input
                    type="number"
                    value={bg.position.y}
                    onChange={(e) => updateBackground(bg.id, {
                      position: { ...bg.position, y: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 尺寸设置 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    宽度
                  </label>
                  <input
                    type="number"
                    value={bg.size.width}
                    onChange={(e) => updateBackground(bg.id, {
                      size: { ...bg.size, width: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    高度
                  </label>
                  <input
                    type="number"
                    value={bg.size.height}
                    onChange={(e) => updateBackground(bg.id, {
                      size: { ...bg.size, height: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 显示模式 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  显示模式
                </label>
                <select
                  value={bg.mode}
                  onChange={(e) => updateBackground(bg.id, {
                    mode: e.target.value as 'fill' | 'contain'
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="fill">填充</option>
                  <option value="contain">平铺</option>
                </select>
              </div>

              {/* 层级和透明度 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    层级: {bg.zIndex}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={bg.zIndex}
                    onChange={(e) => updateBackground(bg.id, {
                      zIndex: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    透明度: {Math.round(bg.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={bg.opacity}
                    onChange={(e) => updateBackground(bg.id, {
                      opacity: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 