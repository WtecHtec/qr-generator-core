export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://xujingyichang.top/sitemap.xml
`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
} 