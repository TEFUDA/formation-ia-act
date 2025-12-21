const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Support des 9 domaines pour chaque langue
  async rewrites() {
    return [];
  },
  
  // Optimisation images
  images: {
    domains: ['images.unsplash.com', 'www.youtube.com', 'i.ytimg.com'],
  },
};

module.exports = withNextIntl(nextConfig);
