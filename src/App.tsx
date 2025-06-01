import { useState, useEffect } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { QRGeneratorTest } from './test/QRGeneratorTest';
import { useQRGenerator } from './hooks/useQRGenerator';
import './App.css';

function App() {
  const qrGenerator = useQRGenerator();
  const [showTest, setShowTest] = useState(false);

  // 初始生成二维码
  useEffect(() => {
    qrGenerator.generateQR();
  }, []);

  // 当配置变化时重新生成二维码
  useEffect(() => {
    qrGenerator.generateQR();
  }, [qrGenerator.config.qr]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              二维码生成器
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowTest(!showTest)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showTest 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {showTest ? '关闭测试' : '测试Core库'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showTest ? (
          /* 测试页面 */
          <QRGeneratorTest />
        ) : (
          /* 正常应用界面 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 设置面板 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg max-h-screen overflow-y-auto">
                <SettingsPanel {...qrGenerator} />
              </div>
            </div>

            {/* 预览区域 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <PreviewCanvas {...qrGenerator} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
