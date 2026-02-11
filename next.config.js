/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.tese.com'],
  },
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Fix for Windows ESM path issues
    if (!isServer) {
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((r) => {
            if (r.use && Array.isArray(r.use)) {
              r.use.forEach((u) => {
                if (u.loader && u.loader.includes('css-loader')) {
                  // Ensure css-loader options are properly handled
                  if (u.options && u.options.modules) {
                    u.options.modules.exportOnlyLocals = true;
                  }
                }
              });
            }
          });
        }
      });
    }
    return config;
  },
};

module.exports = nextConfig;
