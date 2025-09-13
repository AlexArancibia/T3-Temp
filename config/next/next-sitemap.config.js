/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/api/', '/admin/', '/dashboard/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://example.com'}/sitemap.xml`,
    ],
  },
  exclude: ['/api/*', '/admin/*', '/dashboard/*'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
}
