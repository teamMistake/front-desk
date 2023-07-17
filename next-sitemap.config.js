/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://chatmoja.seda.club/',
    changefreq: 'daily',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
    },
  };