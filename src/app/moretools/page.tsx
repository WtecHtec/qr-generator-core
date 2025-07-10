// src/app/daily-link/page.tsx
'use client';

import React, { useState, useEffect, createElement } from 'react'; // Import createElement
import Link from 'next/link';
import { SEOHead }  from '../../components/SEOHead';
import "../../index.css"
// 导入所有可能用到的 React Icons 组件
// 重要的是，你需要在这里导入所有你可能在 JSON 中引用的图标
import * as FaIcons from 'react-icons/fa'; // 导入整个 Font Awesome 库
// import * as MdIcons from 'react-icons/md'; // 如果你也想用 Material Design Icons
// import * as HiIcons from 'react-icons/hi'; // 如果你也想用 Heroicons

// 定义 types
interface LinkItem {
  name: string;
  url: string;
  icon?: string; // 这个字段将直接对应 React Icons 的组件名称字符串，如 "FaGithub"
}

interface LinkCategory {
  category: string;
  description: string;
  links: LinkItem[];
}

const DailyLinkPage = () => {
  const [categories, setCategories] = useState<LinkCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorizedLinks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await import('./externalLinks.json');
        const categorizedLinks: LinkCategory[] = data.default;
        setCategories(categorizedLinks);
      } catch (err) {
        setError("未能加载外链数据，请稍后再试。");
        console.error("Error fetching categorized links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorizedLinks();
  }, []);

  // 动态渲染图标的函数
  const renderIconComponent = (iconName?: string) => {
    if (!iconName) {
      return <FaIcons.FaExternalLinkAlt />; // 默认图标
    }

    // 尝试从 FaIcons 中查找对应的组件
    const IconComponent = (FaIcons as any)[iconName];
    // 如果 FaIcons 中没有，可以尝试从其他导入的库中查找
    // const IconComponent = (FaIcons as any)[iconName] || (MdIcons as any)[iconName] || (HiIcons as any)[iconName];

    if (IconComponent) {
      return createElement(IconComponent);
    }

    return <FaIcons.FaExternalLinkAlt />; // 如果找不到，返回默认图标
  };

  return (
    <>
      <SEOHead
        title="更多工具-精选外链 - 二维码生成器 | QR Generator"
        description="每日为您精选推荐的优质外部链接，发现更多精彩内容！"
      />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto" role="main">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">精选工具</h1>
          <p className="text-gray-600 text-center mb-8">
            探索我们为您精心挑选的各类优质网站和资源。滚动查看所有分类。
          </p>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">正在加载外链数据...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <strong className="font-bold">错误！</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : (
            <div className="space-y-10">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <section key={cat.category} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                      {cat.category}
                    </h2>
                    <p className="text-gray-600 mb-6 text-center text-sm">
                      {cat.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cat.links.length > 0 ? (
                        cat.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group"
                            aria-label={`访问 ${link.name}`}
                          >
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
                              {renderIconComponent(link.icon)} {/* 直接渲染图标 */}
                            </div>
                            <div className="flex-grow">
                              <p className="text-gray-900 font-medium group-hover:text-blue-600">
                                {link.name}
                              </p>
                              <p className="text-gray-500 text-xs truncate group-hover:text-blue-500">
                                {link.url.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
                              </p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-7 7m7-7v6"></path>
                            </svg>
                          </a>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 col-span-full">
                          此分类暂无链接。
                        </p>
                      )}
                    </div>
                  </section>
                ))
              ) : (
                <p className="text-center text-gray-500">没有找到任何外链分类。</p>
              )}
            </div>
          )}

       
        </div>
      </div>
    </>
  );
};

export default DailyLinkPage;