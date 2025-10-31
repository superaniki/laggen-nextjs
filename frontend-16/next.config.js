/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Fix CORS configuration
  async headers() {
    return [
      {
        // Fix source pattern
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' }
        ]
      }
    ]
  },
  // Webpack configuration
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
  // Experimental features
  experimental: {
    // Include additional files in the standalone build
    outputFileTracingIncludes: {
      '/**/*': ['src/fonts/*']
    }
  }
}

module.exports = nextConfig