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

const legacyRoutes = [
  '/projects',
  '/projects/project-one',
  '/blog/post-one',
  '/redesign',
  '/redesign-v2'
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

async function fetchText(route) {
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: 'follow',
    headers: { 'user-agent': 'JoinHook-staging-smoke/1.1' }
  });
  assert(response.ok, `${route} returned HTTP ${response.status}`);
  return { response, text: await response.text() };
}

(async () => {
  console.log(`Checking staging: ${baseUrl}`);

  for (const route of routes) {
    const { response } = await fetchText(route);
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

  const cge = await (await fetchText('/herramientas/control-gastronomico-express')).text;
  assert(cge.includes('name="cge-founder-price" content="4990"'), 'Missing CGE founder price metadata');
  assert(cge.includes('name="cge-founder-currency" content="CLP"'), 'Missing CGE founder currency metadata');
  assert(cge.includes('rel="canonical"'), 'Missing CGE canonical link');
  assert(cge.includes('https://joinhook.cl/herramientas/control-gastronomico-express'), 'Missing CGE canonical URL');

  const sitemap = await (await fetchText('/sitemap.xml')).text;
  for (const entry of requiredSitemapEntries) {
    assert(sitemap.includes(`<loc>${entry}</loc>`), `Missing sitemap entry: ${entry}`);
  }

  const sw = await (await fetchText('/app/cge-sw.js')).text;
  assert(sw.includes('/app/control-gastronomico-express'), 'CGE service worker does not precache the app route');
  assert(sw.includes('/plantillas/control-gastronomico-inventario.csv'), 'CGE service worker does not precache the inventory template');

  for (const route of legacyRoutes) {
    const response = await fetch(`${baseUrl}${route}`, {
      redirect: 'manual',
      headers: { 'user-agent': 'JoinHook-staging-smoke/1.1' }
    });
    assert(response.status === 404, `Expected 404 for ${route}, got ${response.status}`);
  }

  const manifest = await fetch(`${baseUrl}/cge-manifest.webmanifest`);
  assert(manifest.ok, `Manifest returned HTTP ${manifest.status}`);
  const manifestType = manifest.headers.get('content-type') || '';
  assert(manifestType.includes('manifest') || manifestType.includes('json'), `Unexpected manifest content-type: ${manifestType}`);

  console.log('Security headers, CGE offer metadata, sitemap, PWA assets and legacy-route checks passed.');
  console.log('STAGING SMOKE PASS');
})().catch((error) => {
  console.error(`STAGING SMOKE FAIL: ${error.message}`);
  process.exit(1);
});
