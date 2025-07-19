/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  distDir: 'out',
  experimental: {
    forceSwcTransforms: false,
  },
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  }
}

module.exports = nextConfig 