// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'gnews.io', 
      'static.gnews.io',
      'www.gnews.io', 
      // Add other domains that might serve news images
      'cdn.cnn.com',
      'media.npr.org',
      's.abcnews.com',
      'img.huffingtonpost.com',
      'nypost.com',
      'a57.foxnews.com',
      'ichef.bbci.co.uk',
      'image.cnbcfm.com'
    ],
    // This is required when you can't predict all image domains
    unoptimized: true,
  },
  env: {
    // The actual values should be set in .env.local
    WORLD_NEWS_API_KEY: "4f49e902b3a3d131b0d43204f1868cff",
    GROQ_API_KEY: "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",
  }
};

module.exports = nextConfig;