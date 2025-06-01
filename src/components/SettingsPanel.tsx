import React from 'react';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { QRSettings } from './settings/QRSettings';
import { BackgroundSettings } from './settings/BackgroundSettings';
import { TextSettings } from './settings/TextSettings';
import { HtmlSettings } from './settings/HtmlSettings';
import { ExportSettings } from './settings/ExportSettings';
import type { useQRGenerator } from '../hooks/useQRGenerator';

interface SettingsPanelProps extends ReturnType<typeof useQRGenerator> {}

export const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // 图标组件
  const QRIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );

  const BackgroundIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const TextIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const HtmlIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );

  const ExportIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="p-6 space-y-4">
      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">二维码生成器</h1>
        <p className="text-sm text-gray-600">创建个性化的二维码，支持多种样式和图层</p>
      </div>
      
      {/* 二维码设置 */}
      <CollapsibleSection 
        title="二维码设置" 
        defaultOpen={true}
        icon={<QRIcon />}
      >
        <QRSettings {...props} />
      </CollapsibleSection>
      
      {/* 背景设置 */}
      <CollapsibleSection 
        title={`背景图片 (${props.config.backgrounds.length})`}
        icon={<BackgroundIcon />}
      >
        <BackgroundSettings {...props} />
      </CollapsibleSection>
      
      {/* 文案设置 */}
      <CollapsibleSection 
        title={`文案图层 (${props.config.texts.length})`}
        icon={<TextIcon />}
      >
        <TextSettings {...props} />
      </CollapsibleSection>
      
      {/* HTML模块设置 */}
      <CollapsibleSection 
        title={`HTML模块 (${props.config.htmlModules.length})`}
        icon={<HtmlIcon />}
      >
        <HtmlSettings {...props} />
      </CollapsibleSection>
      
      {/* 导出设置 */}
      <CollapsibleSection 
        title="导出设置"
        icon={<ExportIcon />}
      >
        <ExportSettings {...props} />
      </CollapsibleSection>

      {/* 底部信息 */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• 实时预览所有修改</div>
          <div>• 支持透明背景和多图层</div>
          <div>• 高质量PNG/JPG导出</div>
        </div>
      </div>
    </div>
  );
}; 