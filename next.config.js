/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  // SEO优化
  async generateBuildId() {
    return 'qr-generator-' + Date.now()
  },
  // 静态导出（如果需要）
  // output: 'export',
  trailingSlash: true,
  // 压缩优化
  compress: true,
  // // PWA支持
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // }
}

// module.exports = nextConfig 
export default nextConfig