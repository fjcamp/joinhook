/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';
const isStaging = process.env.JOINHOOK_DEPLOY_TARGET === 'staging';
const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self' blob: https:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
].join('; ');

const securityHeaders = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' }
];
if (!isDev) securityHeaders.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' });
if (isStaging) securityHeaders.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' });

const noIndexHeaders = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }, { key: 'Cache-Control', value: 'no-store' }];

const nextConfig = {
    output: 'standalone',
    trailingSlash: true,
    reactStrictMode: true,
    poweredByHeader: false,
    async headers() {
        return [
            { source: '/:path*', headers: securityHeaders },
            { source: '/api/:path*', headers: noIndexHeaders },
            { source: '/agent-center/:path*', headers: noIndexHeaders },
            { source: '/local-admin:path*', headers: noIndexHeaders },
            { source: '/local-setup:path*', headers: noIndexHeaders },
            { source: '/local-import:path*', headers: noIndexHeaders }
        ];
    }
};
module.exports = nextConfig;
