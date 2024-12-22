// next.config.ts
import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    MINECRAFT_SERVER_IP: process.env.MINECRAFT_SERVER_IP,
  }
};

export default config;
