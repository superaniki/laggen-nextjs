/** @type {import('next').NextConfig} */

const nextConfig = {
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

