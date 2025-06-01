import React from 'react';
import { useQRGenerator } from '../../hooks/useQRGenerator';

interface TextSettingsProps extends ReturnType<typeof useQRGenerator> {}

export const TextSettings: React.FC<TextSettingsProps> = ({
  config,
  addText,
  updateText,
  removeText,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">文案设置</h3>
        <button
          onClick={addText}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
        >
          添加文案
        </button>
      </div>

      {config.texts.length === 0 ? (
        <p className="text-gray-500 text-sm">暂无文案</p>
      ) : (
        <div className="space-y-4">
          {config.texts.map((text) => (
            <div key={text.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">文案 #{text.id.slice(-4)}</h4>
                <button
                  onClick={() => removeText(text.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  删除
                </button>
              </div>

              {/* 文案内容 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  内容
                </label>
                <textarea
                  value={text.content}
                  onChange={(e) => updateText(text.id, { content: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              {/* 位置设置 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    X坐标
                  </label>
                  <input
                    type="number"
                    value={text.position.x}
                    onChange={(e) => updateText(text.id, {
                      position: { ...text.position, x: parseInt(e.target.value) || 0 }
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
                    value={text.position.y}
                    onChange={(e) => updateText(text.id, {
                      position: { ...text.position, y: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 字体设置 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    字体大小: {text.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={text.fontSize}
                    onChange={(e) => updateText(text.id, {
                      fontSize: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    字重: {text.fontWeight}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="900"
                    step="100"
                    value={text.fontWeight}
                    onChange={(e) => updateText(text.id, {
                      fontWeight: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* 颜色和字体 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    颜色
                  </label>
                  <input
                    type="color"
                    value={text.color}
                    onChange={(e) => updateText(text.id, { color: e.target.value })}
                    className="w-full h-8 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    字体
                  </label>
                  <select
                    value={text.fontFamily}
                    onChange={(e) => updateText(text.id, { fontFamily: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="微软雅黑">微软雅黑</option>
                    <option value="宋体">宋体</option>
                    <option value="黑体">黑体</option>
                  </select>
                </div>
              </div>

              {/* 层级和透明度 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    层级: {text.zIndex}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={text.zIndex}
                    onChange={(e) => updateText(text.id, {
                      zIndex: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    透明度: {Math.round(text.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={text.opacity}
                    onChange={(e) => updateText(text.id, {
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