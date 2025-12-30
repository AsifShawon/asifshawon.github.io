/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.pixabay.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
    // Exclude heavy packages from client bundle
    serverExternalPackages: ['tesseract.js'],
    webpack: (config, { isServer }) => {
      // Don't bundle tesseract.js on client - it's too large
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        };
      }
      return config;
    },
};

export default nextConfig;
