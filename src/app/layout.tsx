import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '二维码生成器 - 免费在线QR码制作工具 | QR Generator',
    template: '%s | QR Generator'
  },
  description: '免费在线二维码生成器，支持文本、网址、WiFi密码等多种内容。可自定义样式、颜色、Logo，支持高清导出。简单易用的QR码制作工具。一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。',
  keywords: ['二维码生成器', 'QR码生成', '二维码制作', '在线二维码', '免费二维码', '二维码生成器', '二维码', '二维码图片', '二维码生成', '二维码扫描', '二维码美化', '二维码印刷', '批量生成二维码', '一物一码', '微信二维码'],
  authors: [{ name: 'Ruk' }],
  creator: 'Ruk',
  publisher: 'Ruk',
  // 添加图标配置
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://xujingyichang.top',
    siteName: 'QR Generator',
    title: '二维码生成器 - 免费在线QR码制作工具',
    description: '免费在线二维码生成器，支持文本、网址、WiFi密码等多种内容。可自定义样式、颜色、Logo，支持高清导出。简单易用的QR码制作工具。一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '二维码生成器',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '二维码生成器 - 免费在线QR码制作工具',
    description: '免费在线二维码生成器，支持文本、网址、WiFi密码等多种内容。可自定义样式、颜色、Logo，支持高清导出。简单易用的QR码制作工具。一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。',
    images: ['/twitter-image.png'],
  },
  verification: {
    google: '3Mfwnw6fQp9Pk18GY2h4QfuB14utEF5jnd2OjeTTtH0',
  },
  alternates: {
    canonical: 'https://xujingyichang.top',
    languages: {
      'zh-CN': 'https://xujingyichang.top',
      'en-US': 'https://xujingyichang.top/en',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LSK98R13Z4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LSK98R13Z4');
            `,
          }}
        />
        
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2463152068592975"
          crossOrigin="anonymous"
        />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "二维码生成器",
              "alternateName": "QR Generator",
              "description": "免费在线二维码生成器，支持文本、网址、WiFi密码等多种内容。可自定义样式、颜色、Logo，支持高清导出。简单易用的QR码制作工具。一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。",
              "url": "https://xujingyichang.top",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CNY"
              },
              "author": {
                "@type": "Organization",
                "name": "Ruk"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* 无障碍访问 */}
        <noscript>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>免费在线二维码生成器，支持文本、网址、WiFi密码等多种内容。可自定义样式、颜色、Logo，支持高清导出。简单易用的QR码制作工具。一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。</h1>
            <p>此应用需要启用JavaScript才能正常工作。</p>
          </div>
        </noscript>
      </body>
    </html>
  )
} 