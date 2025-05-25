// apps/webapp/next.config.js
// Configuration to fix Edge Runtime issues

const nextConfig = {
  experimental: {
    // Disable instrumentation that causes Edge Runtime issues
    instrumentationHook: false,
    // Disable server actions that can cause eval issues
    serverActions: false
  },
  // Force Node.js runtime for all routes
  runtime: 'nodejs',
  // Disable SWC minification that can cause dynamic code issues
  swcMinify: false,
  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Output configuration
  output: 'standalone'
}

module.exports = nextConfig
