module.exports = {
  reactStrictMode: true,
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/api/oauth2/sign_in',
        permanent: false,
      },
    ]
  },
  output: "standalone",
  i18n: {
    locales: ["ko"],
    defaultLocale: "ko",
  },
}
