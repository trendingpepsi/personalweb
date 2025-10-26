/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "education.ufl.edu" }, // allows your UF headshot URL
    ],
  },
};

module.exports = nextConfig;
