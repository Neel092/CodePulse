const nextConfig = {
  output: 'standalone',
  transpilePackages: ['lucide-react'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};
export default nextConfig;