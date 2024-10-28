/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
    experimental: {
      serverActions: {
        allowedOrigins: [
          'localhost:3000',
          'profitonn.com',
          "js-next-nu.vercel.app"
        ],
      },
    },
    swcMinify: true,
    webpack: (config) => {
      // Enable polling based on env variable being set
      if (process.env.NEXT_WEBPACK_USEPOLLING) {
        config.watchOptions = {
          poll: 500,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
    // output: 'export',
    async headers() {
      return [
        {
          // matching all API routes
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ],
        },
      ];
    },
    async rewrites() {
      return [
        {
          // Example rewrite rule
          source: '/old-page/:slug*',
          destination: '/new-page/:slug*', // Update this to your actual paths
        },
        // You can add more rewrite rules here if needed
      ];
    },
  };
  
  module.exports = nextConfig;
  