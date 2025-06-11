"use client"
import { useState, useEffect } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { QRGeneratorTest } from './test/QRGeneratorTest';
import { useQRGenerator } from './hooks/useQRGenerator';
import { SEOHead } from './components/SEOHead';
import './App.css';

function App() {
  const qrGenerator = useQRGenerator();
  const [showTest, setShowTest] = useState(false);

  // 初始生成二维码
  // useEffect(() => {
  //   qrGenerator.generateQR();
  // }, []);

  // 当配置变化时重新生成二维码
   // 初始生成二维码
   useEffect(() => {
    qrGenerator.generateQR();
  }, [qrGenerator.generateQR]); // 添加依赖

  // 当配置变化时重新生成二维码
  useEffect(() => {
    qrGenerator.generateQR();
  }, [qrGenerator.config.qr, qrGenerator.generateQR]); // 添加依赖


  // 动态更新页面标题
  useEffect(() => {
    const content = qrGenerator.config.qr.content;
    if (content && content !== 'Hello World') {
      document.title = `${content} - 二维码生成器 | QR Generator`;
    } else {
      document.title = '二维码生成器 - 免费在线QR码制作工具 | QR Generator';
    }
  }, [qrGenerator.config.qr.content]);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-gray-100">
        {/* 顶部导航 */}
       {/* 顶部导航 */}
       <header className="bg-white shadow-sm border-b" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                二维码生成器
              </h1>
              <nav role="navigation" aria-label="主导航">
                <div className="flex items-center space-x-4">
                  {/* GitHub 和 npm 跳转入口 */}
                  <div className="flex items-center space-x-3">
                    <a
                      href="https://github.com/wtechtec/qr-generator-core"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="查看GitHub源码"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href="https://www.npmjs.com/package/@wtechtec/qr-generator-core"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="查看npm包"
                      >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 7v10h6.5v1.5h3V17H24V7H0zm6.5 6H5v-3h1.5v3zm6.5 0h-1.5v-3H10v3h-1.5V9.5H8.5v3.5H7V8h6v5zm6.5-3v3H17v-3h-1.5v3H14V8h6v2h-1.5z"/>
                      </svg>
                      npm
                    </a>
                  </div>
                  <div className="border-l border-gray-300 h-6"></div>
                  <button
                    onClick={() => setShowTest(!showTest)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showTest 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    aria-label={showTest ? '关闭测试模式' : '开启测试模式'}
                  >
                    {showTest ? '关闭测试' : '测试Core库'}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
          {/* SEO友好的页面描述 */}
          <div className="sr-only">
            <h2>免费在线二维码生成器</h2>
            <p>
              使用我们的免费在线二维码生成器，轻松创建个性化的QR码。
              支持文本、网址、WiFi密码等多种内容类型，可自定义颜色、样式和Logo。
              高质量导出，适用于名片、海报、产品包装等各种场景。
            </p>
          </div>

          {showTest ? (
            /* 测试页面 */
            <section aria-labelledby="test-section">
              <h2 id="test-section" className="sr-only">测试功能</h2>
              <QRGeneratorTest />
            </section>
          ) : (
            /* 正常应用界面 */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 设置面板 */}
              <aside className="lg:col-span-1" aria-labelledby="settings-section">
                <h2 id="settings-section" className="sr-only">二维码设置</h2>
                <div className="bg-white rounded-lg shadow-lg max-h-screen overflow-y-auto">
                  <SettingsPanel {...qrGenerator} />
                </div>
              </aside>

              {/* 预览区域 */}
              <section className="lg:col-span-2" aria-labelledby="preview-section">
                <h2 id="preview-section" className="sr-only">二维码预览</h2>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <PreviewCanvas {...qrGenerator} />
                </div>
              </section>
            </div>
          )}
        </main>

        {/* 页脚 */}
        <footer className="bg-white border-t mt-16" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">关于我们</h3>
                <p className="text-gray-600 text-sm">
                  专业的在线二维码生成工具，为用户提供免费、高质量的QR码制作服务。
                  支持多种内容类型和自定义样式，满足各种使用场景需求。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">功能特色</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• 支持文本、网址、WiFi等多种内容</li>
                  <li>• 自定义颜色和样式</li>
                  <li>• 添加个性化Logo</li>
                  <li>• 高清图片导出</li>
                  <li>• 完全免费使用</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">使用场景</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>• 名片和宣传材料</li>
                  <li>• 产品包装标签</li>
                  <li>• 活动推广海报</li>
                  <li>• WiFi密码分享</li>
                  <li>• 网站链接推广</li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-8 mt-8 text-center text-gray-500 text-sm">
              <p>&copy; 2024 QR Generator. 保留所有权利。</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
