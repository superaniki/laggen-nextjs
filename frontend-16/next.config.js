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
  // Server-side component configuration
  serverExternalPackages: ['canvas', 'react-konva', 'konva'],
  // Webpack configuration (forces webpack when TURBOPACK=0)
  webpack: (config, { isServer }) => {
    // Externalize packages on server-side
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'react-konva', 'konva'];
    }
    return config;
  },
  // Include additional files in the standalone build (moved from experimental in Next.js 16)
  outputFileTracingIncludes: {
    '/**/*': ['src/fonts/*']
  }
}

module.exports = nextConfig