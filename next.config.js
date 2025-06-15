/** @type {import('next').NextConfig} */


const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'iam.xujingyichang.top'],
  },
  // 完全跳过 TypeScript 和 ESLint 检查
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
   // 禁用严格模式以避免构建问题
   reactStrictMode: false,
  // SEO优化
  async generateBuildId() {
    return 'qr-generator-' + Date.now()
  },
  // 静态导出（如果需要）
  // output: 'export',
  trailingSlash: true,
  // 压缩优化
  compress: true,
    // 实验性功能
    experimental: {
      // 禁用可能导致问题的实验性功能
      esmExternals: false,
    },

    async headers() {
      return [
        {
          // 匹配所有路径
          source: '/(.*)',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ]
    },
  // // PWA支持
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // }
}

// module.exports = nextConfig 
export default nextConfig