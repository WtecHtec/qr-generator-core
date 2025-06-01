import React from 'react';
import { useQRGenerator } from '../../hooks/useQRGenerator';

interface HtmlSettingsProps extends ReturnType<typeof useQRGenerator> {}

export const HtmlSettings: React.FC<HtmlSettingsProps> = ({
  config,
  addHtmlModule,
  updateHtmlModule,
  removeHtmlModule,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">HTML模块</h3>
        <button
          onClick={addHtmlModule}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
        >
          添加HTML
        </button>
      </div>

      {config.htmlModules.length === 0 ? (
        <p className="text-gray-500 text-sm">暂无HTML模块</p>
      ) : (
        <div className="space-y-4">
          {config.htmlModules.map((module) => (
            <div key={module.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">HTML #{module.id.slice(-4)}</h4>
                <button
                  onClick={() => removeHtmlModule(module.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  删除
                </button>
              </div>

              {/* HTML内容 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  HTML代码
                </label>
                <textarea
                  value={module.content}
                  onChange={(e) => updateHtmlModule(module.id, { content: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  rows={4}
                  placeholder="输入HTML代码..."
                />
              </div>

              {/* 预览 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  预览效果
                </label>
                <div 
                  className="w-full p-2 border border-gray-200 rounded bg-gray-50 text-xs"
                  style={{ minHeight: '40px' }}
                  dangerouslySetInnerHTML={{ __html: module.content }}
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
                    value={module.position.x}
                    onChange={(e) => updateHtmlModule(module.id, {
                      position: { ...module.position, x: parseInt(e.target.value) || 0 }
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
                    value={module.position.y}
                    onChange={(e) => updateHtmlModule(module.id, {
                      position: { ...module.position, y: parseInt(e.target.value) || 0 }
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
                    value={module.size.width}
                    onChange={(e) => updateHtmlModule(module.id, {
                      size: { ...module.size, width: parseInt(e.target.value) || 0 }
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
                    value={module.size.height}
                    onChange={(e) => updateHtmlModule(module.id, {
                      size: { ...module.size, height: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 层级和透明度 */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    层级: {module.zIndex}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={module.zIndex}
                    onChange={(e) => updateHtmlModule(module.id, {
                      zIndex: parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    透明度: {Math.round(module.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={module.opacity}
                    onChange={(e) => updateHtmlModule(module.id, {
                      opacity: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* 常用HTML模板 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  快速模板
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => updateHtmlModule(module.id, {
                      content: '<div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 10px; border-radius: 8px; color: white; text-align: center;">渐变背景</div>'
                    })}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    渐变背景
                  </button>
                  <button
                    onClick={() => updateHtmlModule(module.id, {
                      content: '<div style="border: 2px dashed #ccc; padding: 15px; text-align: center; color: #666;">虚线边框</div>'
                    })}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    虚线边框
                  </button>
                  <button
                    onClick={() => updateHtmlModule(module.id, {
                      content: '<div style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 20px; font-size: 14px;">标签样式</div>'
                    })}
                    className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                  >
                    标签样式
                  </button>
                  <button
                    onClick={() => updateHtmlModule(module.id, {
                      content: '<div style="box-shadow: 0 4px 8px rgba(0,0,0,0.1); background: white; padding: 12px; border-radius: 8px;">阴影卡片</div>'
                    })}
                    className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                  >
                    阴影卡片
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};