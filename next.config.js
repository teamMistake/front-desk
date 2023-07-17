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
        // does not add /docs since basePath: false is set
        source: '/login',
        destination: '/api/oauth2/sign_in',
        permanent: false,
      },
    ]
  },
}
