const baseUrl = (process.env.STAGING_URL || '').trim().replace(/\/$/, '');

if (!baseUrl) {
  console.error('Missing STAGING_URL, for example: STAGING_URL=https://staging.joinhook.cl npm run smoke:staging');
  process.exit(1);
}

const routes = [
  '/',
  '/info',
  '/blog',
  '/herramientas/control-gastronomico-express',
  '/app/control-gastronomico-express',
  '/privacidad',
  '/condiciones-beta',
  '/robots.txt',
  '/sitemap.xml',
  '/cge-manifest.webmanifest',
  '/app/cge-sw.js',
  '/project-covers/joinops-cover.svg',
  '/project-covers/snowwise-cover.svg',
  '/project-covers/mi-gestion-cover.svg'
];

const requiredSitemapEntries = [
  'https://joinhook.cl/',
  'https://joinhook.cl/info',
  'https://joinhook.cl/blog',
  'https://joinhook.cl/herramientas/control-gastronomico-express'
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function checkRoute(route) {
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: 'follow',
    headers: { 'user-agent': 'JoinHook-staging-smoke/1.0' }
  });
  assert(response.ok, `${route} returned HTTP ${response.status}`);
  return response;
}

(async () => {
  console.log(`Checking staging: ${baseUrl}`);

  for (const route of routes) {
    const response = await checkRoute(route);
    console.log(`OK  ${response.status} ${route}`);
  }

  const home = await fetch(`${baseUrl}/`, { redirect: 'follow' });
  const csp = home.headers.get('content-security-policy') || '';
  const contentType = home.headers.get('content-type') || '';
  assert(contentType.includes('text/html'), `Home content-type is ${contentType}`);
  assert(csp.includes("default-src 'self'"), 'Missing baseline Content-Security-Policy');
  assert((home.headers.get('x-content-type-options') || '').toLowerCase() === 'nosniff', 'Missing X-Content-Type-Options: nosniff');
  assert(Boolean(home.headers.get('referrer-policy')), 'Missing Referrer-Policy');
  assert(!home.headers.get('x-powered-by'), 'X-Powered-By must not be exposed');

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  for (const entry of requiredSitemapEntries) {
    assert(sitemap.includes(`<loc>${entry}</loc>`), `Missing sitemap entry: ${entry}`);
  }

  console.log('Security headers and sitemap checks passed.');
  console.log('STAGING SMOKE PASS');
})().catch((error) => {
  console.error(`STAGING SMOKE FAIL: ${error.message}`);
  process.exit(1);
});
