export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://xujingyichang.top/sitemap.xml

# 禁止访问的路径
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# 爬虫访问延迟
Crawl-delay: 1`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
} 