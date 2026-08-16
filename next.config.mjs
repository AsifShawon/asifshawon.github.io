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
          {
            protocol: 'https',
            hostname: 'fuavyyerkhwkzvhwhjvy.supabase.co',
            port: '',
            pathname: '/storage/v1/object/public/**',
          },
        ],
      },
    // Exclude heavy packages from client bundle
    serverExternalPackages: ['tesseract.js'],
    // `/hello` used to prefix every portfolio route (aboutme, projects, tools,
    // chatbot, notes). It's now a route group — `src/app/(portfolio)` — so the
    // segment no longer appears in the URL. These permanent redirects keep old
    // bookmarks/search results/shared links working.
    async redirects() {
      return [
        {
          source: '/hello',
          destination: '/',
          permanent: true,
        },
        {
          source: '/hello/:path*',
          destination: '/:path*',
          permanent: true,
        },
      ];
    },
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
