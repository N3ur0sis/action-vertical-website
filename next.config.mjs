/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xdaoihbxajsgsvz0.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
