/** @type {import('next').NextConfig} */

const nextConfig = {
  async headers() {
    return [
      {
        source: "*/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "POST" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Acccept-version, Content-Length, Content-MDS, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  webpack: (config, { isServer, webpack }) => {
    /*config.externals = [...config.externals, { canvas: "canvas" }];*/
    /*config.plugins.push(
      webpack.IgnorePlugin({
        resourceRegExp: /canvas|jsdom/,
        contextRegExp: /konva/,
      })
    );
    return config;*/

    /*
    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });

    return config;
    */
  }, experimental: {
    outputFileTracingIncludes: [
      'src/fonts/*']
  },
}

