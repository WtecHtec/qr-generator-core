import React, { useState, useRef } from 'react';
import { 
  createQRGenerator, 
  generateQRAsPNG, 
  generateAndDownloadQR,
  type QRGeneratorConfig 
} from '../lib/qr-generator-core';

export const QRGeneratorTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [configInput, setConfigInput] = useState('');
  const [customConfig, setCustomConfig] = useState<Partial<QRGeneratorConfig> | null>(null);
  const testContainerRef = useRef<HTMLDivElement>(null);

  // 创建一个简单的base64图片用于测试
  const createTestImage = (color: string, width: number = 100, height: number = 100): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
      // 添加一些图案
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(10, 10, width - 20, height - 20);
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      for (let i = 0; i < width; i += 20) {
        ctx.fillRect(i, 0, 1, height);
      }
      for (let i = 0; i < height; i += 20) {
        ctx.fillRect(0, i, width, 1);
      }
    }
    return canvas.toDataURL();
  };

  // 默认配置
  const defaultConfig: Partial<QRGeneratorConfig> = {
    text: "https://example.com",
    width: 400,
    height: 300,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "M"
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 4,
      crossOrigin: "anonymous"
    },
    dotsOptions: {
      color: "#0000ff",
      type: "square"
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    cornersSquareOptions: {
      color: "#0000ff",
      type: "square"
    },
    cornersDotOptions: {
      color: "#000000",
      type: "square"
    },
    exportOptions: {
      format: "png",
      quality: 0.9,
      borderRadius: 0
    }
  };

  // 预设配置
  const presetConfigs = {
    basic: {
      name: "基础配置",
      config: defaultConfig
    },
    withBackground: {
      name: "带背景图片",
      config: {
        ...defaultConfig,
      
        width: 500,
        height: 400,
        backgrounds: [
          {
            src: createTestImage('#e3f2fd', 500, 400),
            position: { x: 0, y: 0 },
            size: { width: 500, height: 400 },
            mode: 'cover' as const,
            zIndex: 1,
            opacity: 0.8
          }
        ],
        texts: [
          {
            content: "带背景的二维码",
            position: { x: 50, y: 30 },
            fontSize: 24,
            color: "#1976d2",
            fontFamily: "Arial",
            fontWeight: 600,
            zIndex: 10,
            opacity: 1,
            textAlign: "left" as const
          }
        ]
      }
    },
    multiBackground: {
      name: "多背景图片",
      config: {
        ...defaultConfig,
        "qrPosition": {
          "x": 50,
          "y": 50
        },
        "qrSize": {
          "width": 60,
          "height": 60
        },
        width: 600,
        height: 500,
        backgrounds: [
          {
            src: createTestImage('#ffebee', 600, 500),
            position: { x: 0, y: 0 },
            size: { width: 600, height: 500 },
            mode: 'cover' as const,
            zIndex: 1,
            opacity: 0.6
          },
          {
            src: createTestImage('#e8f5e8', 200, 200),
            position: { x: 50, y: 50 },
            size: { width: 200, height: 200 },
            mode: 'contain' as const,
            zIndex: 2,
            opacity: 0.8
          },
          {
            src: createTestImage('#fff3e0', 150, 150),
            position: { x: 400, y: 300 },
            size: { width: 150, height: 150 },
            mode: 'cover' as const,
            zIndex: 3,
            opacity: 0.7
          }
        ],
        texts: [
          {
            content: "多层背景效果",
            position: { x: 50, y: 20 },
            fontSize: 28,
            color: "#d32f2f",
            fontFamily: "Arial",
            fontWeight: 700,
            zIndex: 10,
            opacity: 1,
            textAlign: "left" as const
          },
          {
            content: "层次丰富的设计",
            position: { x: 50, y: 450 },
            fontSize: 16,
            color: "#388e3c",
            fontFamily: "Arial",
            fontWeight: 400,
            zIndex: 10,
            opacity: 0.9,
            textAlign: "left" as const
          }
        ]
      }
    },
    withText: {
      name: "带文本配置",
      config: {
        ...defaultConfig,
        width: 500,
        height: 400,
        texts: [
          {
            content: "扫码访问网站",
            position: { x: 50, y: 30 },
            fontSize: 24,
            color: "#333333",
            fontFamily: "Arial",
            fontWeight: 600,
            zIndex: 10,
            opacity: 1,
            textAlign: "center" as const
          },
          {
            content: "QR Generator Core 测试",
            position: { x: 50, y: 350 },
            fontSize: 16,
            color: "#666666",
            fontFamily: "Arial",
            fontWeight: 400,
            zIndex: 10,
            opacity: 0.8,
            textAlign: "left" as const
          }
        ]
      }
    },
    gradient: {
      name: "渐变样式",
      config: {
        ...defaultConfig,
        width: 400,
        height: 400,
        backgroundOptions: {
          color: "#ffffff",
          gradient: {
            type: "linear" as const,
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
      }
    },
    rounded: {
      name: "圆角样式",
      config: {
        ...defaultConfig,
        exportOptions: {
          format: "png" as const,
          quality: 0.9,
          borderRadius: 20
        },
        backgroundOptions: {
          color: "#e3f2fd"
        },
        dotsOptions: {
          color: "#1976d2",
          type: "extra-rounded"
        }
      }
    },
    complex: {
      name: "复杂配置",
      config: {
        text: "https://github.com/qr-generator",
        width: 600,
        height: 500,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte" as const,
          errorCorrectionLevel: "H" as const
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.3,
          margin: 8,
          crossOrigin: "anonymous"
        },
        dotsOptions: {
          color: "#2196f3",
          type: "classy-rounded",
          gradient: {
            type: "linear" as const,
            rotation: 90,
            colorStops: [
              { offset: 0, color: "#2196f3" },
              { offset: 1, color: "#21cbf3" }
            ]
          }
        },
        backgroundOptions: {
          color: "#f8f9fa"
        },
        cornersSquareOptions: {
          color: "#ff5722",
          type: "extra-rounded"
        },
        cornersDotOptions: {
          color: "#4caf50",
          type: "square"
        },
        exportOptions: {
          format: "png" as const,
          quality: 1,
          borderRadius: 15
        },
        backgrounds: [
          {
            src: createTestImage('#f3e5f5', 600, 500),
            position: { x: 0, y: 0 },
            size: { width: 600, height: 500 },
            mode: 'cover' as const,
            zIndex: 1,
            opacity: 0.3
          }
        ],
        texts: [
          {
            content: "GitHub QR Code",
            position: { x: 50, y: 40 },
            fontSize: 28,
            color: "#212121",
            fontFamily: "Arial",
            fontWeight: 700,
            zIndex: 10,
            opacity: 1,
            textAlign: "left" as const
          },
          {
            content: "扫码访问项目仓库",
            position: { x: 50, y: 80 },
            fontSize: 16,
            color: "#757575",
            fontFamily: "Arial",
            fontWeight: 400,
            zIndex: 10,
            opacity: 0.9,
            textAlign: "left" as const
          },
          {
            content: "Powered by QR Generator Core",
            position: { x: 50, y: 450 },
            fontSize: 14,
            color: "#9e9e9e",
            fontFamily: "Arial",
            fontWeight: 300,
            zIndex: 10,
            opacity: 0.7,
            textAlign: "left" as const
          }
        ]
      }
    }
  };

  // 获取当前使用的配置
  const getCurrentConfig = () => customConfig || defaultConfig;

  const addResult = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const result = `[${timestamp}] ${isError ? '❌' : '✅'} ${message}`;
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
    if (testContainerRef.current) {
      testContainerRef.current.innerHTML = '';
    }
  };

  // 加载预设配置
  const loadPresetConfig = (presetKey: string) => {
    const preset = presetConfigs[presetKey as keyof typeof presetConfigs];
    if (preset) {
      setCustomConfig(preset.config as any);
      setConfigInput(JSON.stringify(preset.config, null, 2));
      addResult(`✓ 已加载预设配置: ${preset.name}`);
    }
  };

  // 解析配置输入
  const parseConfigInput = () => {
    try {
      const config = JSON.parse(configInput);
      setCustomConfig(config);
      addResult('✓ 配置解析成功');
      return true;
    } catch (error) {
      addResult(`✗ 配置解析失败: ${error}`, true);
      return false;
    }
  };

  // 重置为默认配置
  const resetToDefault = () => {
    setCustomConfig(null);
    setConfigInput(JSON.stringify(defaultConfig, null, 2));
    addResult('✓ 已重置为默认配置');
  };

  // 测试当前配置
  const testCurrentConfig = async () => {
    setCurrentTest('当前配置测试');
    try {
      addResult('开始测试当前配置...');
      
      const config = getCurrentConfig();
      const generator = createQRGenerator(config);
      
      // 验证配置
      const validation = generator.validateConfig();
      if (!validation.isValid) {
        addResult(`✗ 配置验证失败: ${validation.errors.join(', ')}`, true);
        generator.destroy();
        return;
      }
      addResult('✓ 配置验证通过');

      // 渲染画布
      const canvas = await generator.render();
      addResult(`✓ 画布渲染成功 (${config.width}x${config.height})`);

      // 显示预览
      const preview = canvas.cloneNode(true) as HTMLDivElement;
      preview.style.position = 'static';
      preview.style.left = 'auto';
      preview.style.top = 'auto';
      preview.style.transform = 'scale(0.5)';
      preview.style.transformOrigin = 'top left';
      preview.style.margin = '10px';
      preview.style.border = '2px solid #4caf50';
      preview.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      
      if (testContainerRef.current) {
        testContainerRef.current.appendChild(preview);
      }

      // 导出PNG测试
      const blob = await generator.exportAsPNG({
        scale: 1,
        quality: config.exportOptions?.quality || 0.9,
        allowTaint: true,
        useCORS: true
      });

      if (blob.size > 0) {
        addResult(`✓ PNG导出成功 (大小: ${(blob.size / 1024).toFixed(1)}KB)`);
        
        // 显示导出的图片
        const url = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = url;
        img.style.cssText = `
          border: 2px solid #2196f3; 
          margin: 10px; 
          max-width: 200px;
          border-radius: ${config.exportOptions?.borderRadius || 0}px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        `;
        img.onload = () => URL.revokeObjectURL(url);
        
        if (testContainerRef.current) {
          testContainerRef.current.appendChild(img);
        }
      }

      generator.destroy();
      addResult('🎉 当前配置测试完成！');

    } catch (error) {
      addResult(`✗ 当前配置测试失败: ${error}`, true);
    } finally {
      setCurrentTest('');
    }
  };

  // 快速导出当前配置
  const quickExportCurrent = async () => {
    try {
      addResult('开始快速导出...');
      const config = getCurrentConfig();
      
      await generateAndDownloadQR(config, `qr-test-${Date.now()}.png`, {
        scale: 2,
        quality: 1,
        allowTaint: true,
        useCORS: true
      });
      
      addResult('✓ 快速导出完成');
    } catch (error) {
      addResult(`✗ 快速导出失败: ${error}`, true);
    }
  };

  // 运行所有测试（使用当前配置）
  const runAllTestsWithCurrentConfig = async () => {
    setIsLoading(true);
    clearResults();
    
    try {
      const config = getCurrentConfig();
      addResult('🚀 开始使用当前配置进行完整测试...');
      
      // 基础测试
      await testCurrentConfig();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 不同导出选项测试
      addResult('开始测试不同导出选项...');
      
      const exportTests = [
        { name: '高质量导出', options: { scale: 2, quality: 1, allowTaint: true, useCORS: true } },
        { name: '标准质量导出', options: { scale: 1, quality: 0.8, allowTaint: true, useCORS: true } },
        { name: '快速导出', options: { scale: 1, quality: 0.6, allowTaint: true, useCORS: true } }
      ];

      for (const test of exportTests) {
        try {
          const blob = await generateQRAsPNG(config, test.options);
          addResult(`✓ ${test.name}成功 (大小: ${(blob.size / 1024).toFixed(1)}KB)`);
        } catch (error) {
          addResult(`✗ ${test.name}失败: ${error}`, true);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      addResult('🎉 所有测试完成！');
      
    } catch (error) {
      addResult(`💥 测试过程中发生错误: ${error}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          QR Generator Core 测试 (支持背景图片)
        </h2>
        <p className="text-gray-600">
          输入自定义配置参数进行测试，包含背景图片支持
        </p>
      </div>

      {/* 配置区域 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">配置管理</h3>
          <button
            onClick={() => setShowConfigEditor(!showConfigEditor)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showConfigEditor ? '隐藏编辑器' : '显示编辑器'}
          </button>
        </div>

        {/* 预设配置按钮 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">预设配置:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(presetConfigs).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => loadPresetConfig(key)}
                className={`px-3 py-1 rounded-md transition-colors text-sm ${
                  key.includes('Background') || key === 'multiBackground' || key === 'complex'
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {preset.name}
                {(key.includes('Background') || key === 'multiBackground' || key === 'complex') && ' 🖼️'}
              </button>
            ))}
            <button
              onClick={resetToDefault}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              重置默认
            </button>
          </div>
        </div>

        {/* 配置编辑器 */}
        {showConfigEditor && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                配置JSON (可编辑):
              </label>
              <textarea
                value={configInput || JSON.stringify(getCurrentConfig(), null, 2)}
                onChange={(e) => setConfigInput(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-vertical"
                placeholder="输入配置JSON..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={parseConfigInput}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                应用配置
              </button>
              <button
                onClick={() => setConfigInput(JSON.stringify(getCurrentConfig(), null, 2))}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                重新加载
              </button>
            </div>
          </div>
        )}

        {/* 当前配置信息 */}
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">当前配置信息:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">尺寸:</span>
              <span className="ml-1 font-medium">{getCurrentConfig().width}x{getCurrentConfig().height}</span>
            </div>
            <div>
              <span className="text-gray-500">内容:</span>
              <span className="ml-1 font-medium truncate">{getCurrentConfig().text}</span>
            </div>
            <div>
              <span className="text-gray-500">背景数量:</span>
              <span className="ml-1 font-medium">{getCurrentConfig().backgrounds?.length || 0}</span>
            </div>
            <div>
              <span className="text-gray-500">文本数量:</span>
              <span className="ml-1 font-medium">{getCurrentConfig().texts?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={testCurrentConfig}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>测试当前配置</span>
        </button>

        <button
          onClick={runAllTestsWithCurrentConfig}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>运行完整测试</span>
        </button>

        <button
          onClick={quickExportCurrent}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>快速导出</span>
        </button>

        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>清空结果</span>
        </button>
      </div>

      {/* 当前测试状态 */}
      {currentTest && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">正在执行: {currentTest}</span>
          </div>
        </div>
      )}

      {/* 测试结果显示 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">测试日志</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="text-gray-500">等待测试结果...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className={`mb-1 ${result.includes('❌') ? 'text-red-400' : result.includes('🎉') ? 'text-yellow-400' : 'text-green-400'}`}>
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 预览容器 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">预览结果</h3>
        <div 
          ref={testContainerRef}
          className="min-h-32 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-auto"
        >
          <div className="text-gray-500 text-center">测试结果将显示在这里...</div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">使用说明</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>🖼️ 背景图片测试:</strong> 选择"带背景图片"或"多背景图片"预设来测试背景图片功能</p>
          <p><strong>📝 配置编辑:</strong> 点击"显示编辑器"可以手动编辑JSON配置</p>
          <p><strong>🎯 预设配置:</strong> 使用预设配置快速测试不同场景</p>
          <p><strong>🚀 测试流程:</strong> 选择配置 → 测试当前配置 → 查看预览结果</p>
          <p><strong>💾 导出功能:</strong> 使用"快速导出"直接下载生成的二维码</p>
        </div>
      </div>

      {/* 配置字段说明 */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">配置字段说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">基础配置</h4>
            <ul className="space-y-1 text-gray-600">
              <li><code>text</code>: 二维码内容</li>
              <li><code>width/height</code>: 画布尺寸</li>
              <li><code>qrOptions</code>: 二维码生成选项</li>
              <li><code>exportOptions</code>: 导出设置</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">背景图片配置</h4>
            <ul className="space-y-1 text-gray-600">
              <li><code>backgrounds[].src</code>: 图片URL或base64</li>
              <li><code>backgrounds[].mode</code>: 填充模式 (fill/contain/cover/stretch)</li>
              <li><code>backgrounds[].position</code>: 位置坐标</li>
              <li><code>backgrounds[].size</code>: 图片尺寸</li>
              <li><code>backgrounds[].zIndex</code>: 层级</li>
              <li><code>backgrounds[].opacity</code>: 透明度 (0-1)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">文本配置</h4>
            <ul className="space-y-1 text-gray-600">
              <li><code>texts[].content</code>: 文本内容</li>
              <li><code>texts[].position</code>: 位置坐标</li>
              <li><code>texts[].fontSize</code>: 字体大小</li>
              <li><code>texts[].color</code>: 文本颜色</li>
              <li><code>texts[].fontFamily</code>: 字体族</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">样式配置</h4>
            <ul className="space-y-1 text-gray-600">
              <li><code>dotsOptions</code>: 二维码点样式</li>
              <li><code>backgroundOptions</code>: 背景样式</li>
              <li><code>cornersSquareOptions</code>: 角落方块样式</li>
              <li><code>cornersDotOptions</code>: 角落点样式</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 注意事项 */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ 注意事项</h3>
        <ul className="space-y-1 text-sm text-yellow-800">
          <li>• 背景图片支持base64格式和URL格式</li>
          <li>• 跨域图片可能需要设置CORS</li>
          <li>• 大尺寸图片可能影响导出性能</li>
          <li>• 建议背景图片透明度设置在0.3-0.8之间以保证二维码可读性</li>
          <li>• 多层背景时注意zIndex层级设置</li>
        </ul>
      </div>
    </div>
  );
};

export default QRGeneratorTest;