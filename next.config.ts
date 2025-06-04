
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Environment variables prefixed with NEXT_PUBLIC_ are automatically
  // made available to the browser. Explicitly listing them here
  // is not strictly necessary if they are defined in your .env file.
  // Removing this to rely on default behavior.
  // env: {
  //   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  // }
};

export default nextConfig;
