import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = '二维码生成器 - 免费在线QR码制作工具 | QR Generator',
  description = '免费在线二维码生成器，支持文本、网址、WiFi密码等多种内容。可自定义样式、颜色、Logo，支持高清导出。简单易用的QR码制作工具。',
  keywords = '二维码生成器,QR码生成,二维码制作,在线二维码,免费二维码,QR Generator,二维码工具,条码生成器',
  image = '/og-image.png',
  url = typeof window !== 'undefined' ? window.location.href : ''
}) => {
  useEffect(() => {
    // 动态更新meta标签
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // 更新基础SEO标签
    document.title = title;
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // 更新Open Graph标签
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);

    // 更新Twitter Card标签
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // 更新canonical链接
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

  }, [title, description, keywords, image, url]);

  return null;
}; 