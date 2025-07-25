/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
    experimental: {
        appDir: true,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, 'src'),
        };
        return config;
    },
}

module.exports = nextConfig 