/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production';
const isStaging = process.env.JOINHOOK_DEPLOY_TARGET === 'staging';

const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://sdk.mercadopago.com${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.mercadopago.com https://*.mercadopago.com https://*.mercadopago.cl",
    "frame-src 'self' https://*.mercadopago.com https://*.mercadopago.cl",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "form-action 'self'"
].join('; ');

const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value: contentSecurityPolicy
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'
    }
];

if (isStaging) {
    securityHeaders.push({
        key: 'X-Robots-Tag',
        value: 'noindex, nofollow, noarchive'
    });
}

const nextConfig = {
    output: 'standalone',
    trailingSlash: true,
    reactStrictMode: true,
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders
            }
        ];
    }
};

module.exports = nextConfig;
