import React, { useState } from 'react';
import type { useQRGenerator } from '../hooks/useQRGenerator';
import type { QRGeneratorConfig } from '../lib/qr-generator-core';

interface PreviewCanvasProps extends ReturnType<typeof useQRGenerator> {}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  config,
  qrDataUrl,
  sortedLayers,
  isExporting,
  exportImage,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configString, setConfigString] = useState('');

  // 生成配置字符串
  const generateConfigString = () => {
    // 转换当前配置为npm包格式
    const npmConfig: Partial<QRGeneratorConfig> = {
      text: config.qr.content,
      width: config.export.width,
      height: config.export.height,
      qrPosition: config.qr.position,
      qrSize: { width: config.qr.size, height: config.qr.size },
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: config.qr.qrOptions.errorCorrectionLevel,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: config.qr.margin,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: config.qr.dotsOptions.color,
        type: config.qr.dotsOptions.type,
        ...(config.qr?.dotsOptions?.gradient && {
          gradient: config.qr.dotsOptions.gradient,
        }),
      },
      backgroundOptions: {
        color: config.qr.backgroundOptions.color,
        ...(config.qr.backgroundOptions.gradient && {
          gradient: config.qr.backgroundOptions.gradient,
        }),
      },
      cornersSquareOptions: {
        color: config.qr.cornersSquareOptions.color,
        type: config.qr.cornersSquareOptions.type,
        ...(config.qr.cornersSquareOptions.gradient && {
          gradient: config.qr.cornersSquareOptions.gradient,
        }),
      },
      cornersDotOptions: {
        color: config.qr.cornersDotOptions.color,
        type: config.qr.cornersDotOptions.type,
        ...(config.qr.cornersDotOptions.gradient && {
          gradient: config.qr.cornersDotOptions.gradient,
        }),
      },
      ...(config.qr.logo && {
        logo: {
          src: config.qr.logo.src.startsWith('data:') 
            ? `base64:${config.qr.logo.src}` 
            : config.qr.logo.src,
          size: config.qr.logo.size,
        },
      }),
      exportOptions: {
        format: 'png',
        quality: config.export.quality,
        borderRadius: config.export.borderRadius,
      },
    };

    // 添加背景图片配置（如果有的话）
    if (config.backgrounds.length > 0) {
      npmConfig.backgrounds = config.backgrounds.map(bg => ({
        src: bg.src.startsWith('data:') ? `base64:${bg.src}` : bg.src,
        position: bg.position,
        size: bg.size,
        mode: bg.mode,
        zIndex: bg.zIndex,
        opacity: bg.opacity,
      }));
    }

    // 添加文本图层配置（如果有的话）
    if (config.texts.length > 0) {
      npmConfig.texts = config.texts.map(text => ({
        content: text.content,
        position: text.position,
        fontSize: text.fontSize,
        color: text.color,
        fontFamily: text.fontFamily,
        fontWeight: text.fontWeight,
        zIndex: text.zIndex,
        opacity: text.opacity,
      }));
    }

    // 添加HTML模块配置（如果有的话）
    if (config.htmlModules.length > 0) {
      npmConfig.htmlModules = config.htmlModules.map(module => ({
        content: module.content,
        position: module.position,
        size: module.size,
        zIndex: module.zIndex,
        opacity: module.opacity,
      }));
    }

    return JSON.stringify(npmConfig, null, 2);
  };

  const handleExportConfig = () => {
    const configStr = generateConfigString();
    setConfigString(configStr);
    setShowConfigModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(configString);
      alert('配置已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = configString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('配置已复制到剪贴板！');
    }
  };

  const downloadConfig = () => {
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">预览</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleExportConfig}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>获取配置</span>
          </button>
          <button
            onClick={exportImage}
            disabled={isExporting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>导出中...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>导出PNG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 画布容器 */}
      <div className="flex justify-center">
        <div className="border border-gray-300 shadow-lg">
          <div
            id="qr-canvas"
            className="relative bg-white overflow-hidden"
            style={{
              width: config.export.width,
              height: config.export.height,
              borderRadius: config.export.borderRadius > 0 ? `${config.export.borderRadius}px` : '0',
            }}
          >
            {/* 渲染所有图层 */}
            {sortedLayers.map((layer) => {
              if (layer.type === 'background') {
                return (
                  <div
                    key={layer.id}
                    className="absolute"
                    style={{
                      left: layer.position.x,
                      top: layer.position.y,
                      width: layer.size.width,
                      height: layer.size.height,
                      zIndex: layer.zIndex,
                      opacity: layer.opacity,
                      backgroundImage: `url(${layer.src})`,
                      backgroundSize: layer.mode === 'contain' ? 'contain' : 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                );
              }

              if (layer.type === 'text') {
                return (
                  <div
                    key={layer.id}
                    className="absolute whitespace-pre-wrap"
                    style={{
                      left: layer.position.x,
                      top: layer.position.y,
                      fontSize: layer.fontSize,
                      color: layer.color,
                      fontFamily: layer.fontFamily,
                      fontWeight: layer.fontWeight,
                      zIndex: layer.zIndex,
                      opacity: layer.opacity,
                    }}
                  >
                    {layer.content}
                  </div>
                );
              }

              if (layer.type === 'html') {
                return (
                  <div
                    key={layer.id}
                    className="absolute"
                    style={{
                      left: layer.position.x,
                      top: layer.position.y,
                      width: layer.size.width,
                      height: layer.size.height,
                      zIndex: layer.zIndex,
                      opacity: layer.opacity,
                    }}
                    dangerouslySetInnerHTML={{ __html: layer.content }}
                  />
                );
              }

              return null;
            })}

            {/* 二维码 */}
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="absolute"
                style={{
                  left: config.qr.position.x,
                  top: config.qr.position.y,
                  width: config.qr.size,
                  height: config.qr.size,
                  zIndex: 1000, // 二维码始终在最上层
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 画布信息 */}
      <div className="text-sm text-gray-500 text-center space-y-1">
        <div>画布尺寸: {config.export.width} × {config.export.height} 像素</div>
        {config.export.borderRadius > 0 && (
          <div>圆角半径: {config.export.borderRadius}px</div>
        )}
        <div className="flex justify-center items-center space-x-4 mt-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>背景图片: {config.backgrounds.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>文本图层: {config.texts.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>HTML模块: {config.htmlModules.length}</span>
          </div>
        </div>
      </div>

      {/* 配置模态框 */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-9999 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  QR生成器配置参数
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                以下配置可用于npm包初始化，包含当前所有设置（二维码样式、背景图片、文本图层、HTML模块等）
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* 配置统计 */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">配置统计:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-blue-600">画布尺寸</div>
                    <div className="font-medium">{config.export.width}×{config.export.height}</div>
                  </div>
                  <div>
                    <div className="text-blue-600">背景图片</div>
                    <div className="font-medium">{config.backgrounds.length} 个</div>
                  </div>
                  <div>
                    <div className="text-blue-600">文本图层</div>
                    <div className="font-medium">{config.texts.length} 个</div>
                  </div>
                  <div>
                    <div className="text-blue-600">HTML模块</div>
                    <div className="font-medium">{config.htmlModules.length} 个</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">使用示例:</h4>
                <div className="bg-gray-100 p-3 rounded-md text-sm font-mono">
                  <div className="text-gray-600">// 1. 安装npm包</div>
                  <div className="text-green-600">npm install @wtechtec/qr-generator-core</div>
                  <br />
                  <div className="text-gray-600">// 2. 导入并使用</div>
                  <div>import &#123; createQRGenerator &#125; from '@wtechtec/qr-generator-core';</div>
                  <br />
                  <div className="text-gray-600">// 3. 使用配置初始化</div>
                  <div>const config = &#123;...&#125;; <span className="text-gray-600">// 下方配置</span></div>
                  <div>const generator = createQRGenerator(config);</div>
                  <br />
                  <div className="text-gray-600">// 4. 渲染到页面</div>
                  <div>const container = document.getElementById('qr-container');</div>
                  <div>await generator.renderTo(container);</div>
                  <br />
                  <div className="text-gray-600">// 5. 导出图片</div>
                  <div>const blob = await generator.exportAsPNG(&#123;</div>
                  <div>&nbsp;&nbsp;borderRadius: {config.export.borderRadius},</div>
                  <div>&nbsp;&nbsp;quality: {config.export.quality}</div>
                  <div>&#125;);</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">配置参数:</h4>
                <textarea
                  value={configString}
                  readOnly
                  className="w-full h-96 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none"
                  placeholder="配置生成中..."
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex flex-wrap gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 min-w-[120px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>复制配置</span>
              </button>
              <button
                onClick={downloadConfig}
                className="flex-1 min-w-[120px] px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>下载配置</span>
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 