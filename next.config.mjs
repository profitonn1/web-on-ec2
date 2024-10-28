/** @type {import('next').NextConfig} */
const nextConfig = {

     output: 'export',
     // next.config.js
async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://js-next-nu.vercel.app/:path*",
      },
    ];
   },
};

export default nextConfig;
