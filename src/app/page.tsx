import type { Metadata } from 'next'
import QRGeneratorApp from '../App'
import '../index.css'
export const metadata: Metadata = {
  title: '二维码生成器 - 免费在线QR码制作工具',
  description: '免费在线二维码生成器，支持文本、网址、WiFi密码等多种内容。可自定义样式、颜色、Logo，支持高清导出。一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。',
  alternates: {
    canonical: 'https://xujingyichang.top',
  },
}

// 结构化数据
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '如何生成二维码？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '在输入框中输入您要生成二维码的内容，选择样式和颜色，点击生成即可。支持文本、网址、WiFi密码等多种内容类型。一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。'
      }
    },
    {
      '@type': 'Question',
      name: '生成的二维码是免费的吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '是的，我们的二维码生成器完全免费使用，无需注册，无水印，支持高清导出。'
      }
    }
  ]
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* SEO友好的静态内容 */}
      <div className="sr-only">
        <h1>免费在线二维码生成器</h1>
        <p>
          专业的QR码制作工具，支持文本、网址、WiFi密码、联系人信息等多种内容类型。
          可自定义颜色、样式、添加Logo，支持高清PNG/SVG格式导出。
          完全免费，无需注册，保护隐私安全。
        </p>
        <h2>主要功能特色</h2>
        <ul>
          <li>支持多种内容类型：文本、网址、WiFi、联系人、邮件等</li>
          <li>自定义样式：颜色、背景、边框、圆角等</li>
          <li>Logo添加：支持上传自定义Logo图片</li>
          <li>高清导出：PNG、SVG、PDF多种格式</li>
          <li>实时预览：所见即所得的编辑体验</li>
          <li>移动友好：响应式设计，支持手机平板</li>
        </ul>
      </div>
      
      <QRGeneratorApp />
    </>
  )
} 