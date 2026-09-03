import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

export const SITE_URL = 'https://joinhook.cl';
export const SITE_EMAIL = 'info@joinhook.cl';

export const NAV_ITEMS = [
    { href: '/', label: 'Inicio' },
    { href: '/sobre-joinhook', label: 'Sobre JoinHook' },
    { href: '/soluciones', label: 'Soluciones' },
    { href: '/proyectos', label: 'Proyectos' },
    { href: '/herramientas', label: 'Herramientas' },
    { href: '/lab', label: 'Lab' },
    { href: '/blog', label: 'Blog' },
    { href: '/contacto', label: 'Contacto' }
] as const;

type SiteHeadProps = {
    title: string;
    description: string;
    path?: string;
    image?: string;
    type?: 'website' | 'article';
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
    noindex?: boolean;
};

export function SiteHead({
    title,
    description,
    path = '/',
    image = '/project-covers/joinops-cover.svg',
    type = 'website',
    jsonLd,
    noindex = false
}: SiteHeadProps) {
    const canonical = `${SITE_URL}${path === '/' ? '/' : `${path.replace(/\/$/, '')}/`}`;
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    const baseGraph = [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'JoinHook',
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.svg`,
            email: SITE_EMAIL,
            areaServed: { '@type': 'Country', name: 'Chile' },
            founder: {
                '@type': 'Person',
                name: 'Francisco Javier Campos',
                image: `${SITE_URL}/images/francisco-campos.svg`
            },
            description:
                'JoinHook diseña y desarrolla soluciones digitales, sistemas, automatizaciones, PWA y productos digitales a partir de necesidades operativas reales.'
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: 'JoinHook',
            inLanguage: 'es-CL',
            publisher: { '@id': `${SITE_URL}/#organization` }
        }
    ];
    const graph = [...baseGraph, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            <meta name="theme-color" content="#f7f4ec" />
            <meta name="robots" content={noindex ? 'noindex,nofollow,noarchive' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
            <link rel="canonical" href={canonical} />
            <meta property="og:locale" content="es_CL" />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="JoinHook" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={imageUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
            />
        </Head>
    );
}

export function Brand({ compact = false }: { compact?: boolean }) {
    return (
        <Link href="/" className={`jh3-brand ${compact ? 'is-compact' : ''}`} aria-label="JoinHook, inicio">
            <span className="jh3-brand-mark" aria-hidden="true">J</span>
            <span>JoinHook</span>
        </Link>
    );
}

export function SiteHeader() {
    const router = useRouter();
    const activePath = NAV_ITEMS.find((item) => item.href !== '/' && router.pathname.startsWith(`${item.href}/`))?.href || router.pathname;

    return (
        <header className="jh3-header">
            <div className="jh3-header-inner">
                <Brand />
                <nav className="jh3-nav" aria-label="Navegación principal">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className={activePath === item.href ? 'is-active' : ''}>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <Link className="jh3-button jh3-button-primary jh3-header-cta" href="/contacto">
                    Conversemos <span aria-hidden="true">→</span>
                </Link>
                <details className="jh3-mobile-nav">
                    <summary aria-label="Abrir menú"><span /><span /><span /></summary>
                    <div className="jh3-mobile-nav-panel">
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href} className={activePath === item.href ? 'is-active' : ''}>
                                {item.label}
                            </Link>
                        ))}
                        <Link className="jh3-button jh3-button-primary" href="/contacto">Conversemos →</Link>
                    </div>
                </details>
            </div>
        </header>
    );
}

export function SiteFooter() {
    return (
        <footer className="jh3-footer">
            <div className="jh3-footer-grid">
                <div>
                    <Brand compact />
                    <p>Tecnología útil, pensada desde la operación real.</p>
                    <div className="jh3-socials" aria-label="Enlaces de JoinHook">
                        <a href="https://github.com/fjcamp" target="_blank" rel="noreferrer" aria-label="GitHub de JoinHook">GH</a>
                        <a href={`mailto:${SITE_EMAIL}`} aria-label="Correo de JoinHook">✉</a>
                    </div>
                </div>
                <div>
                    <strong>Enlaces rápidos</strong>
                    <Link href="/">Inicio</Link>
                    <Link href="/sobre-joinhook">Sobre JoinHook</Link>
                    <Link href="/soluciones">Soluciones</Link>
                </div>
                <div>
                    <strong>Contenido</strong>
                    <Link href="/proyectos">Proyectos</Link>
                    <Link href="/herramientas">Herramientas</Link>
                    <Link href="/blog">Blog</Link>
                </div>
                <div>
                    <strong>JoinHook</strong>
                    <Link href="/lab">Lab</Link>
                    <Link href="/contacto">Contacto</Link>
                    <Link href="/privacidad">Privacidad</Link>
                </div>
                <div>
                    <strong>¿Hablemos?</strong>
                    <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
                    <span>Chile</span>
                </div>
            </div>
            <div className="jh3-footer-bottom">© {new Date().getFullYear()} JoinHook · Soluciones digitales con mirada operativa</div>
        </footer>
    );
}

export function PageShell({ children }: { children: ReactNode }) {
    return (
        <div className="jh3">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
        </div>
    );
}

export function SectionTitle({ eyebrow, title, text, align = 'center' }: { eyebrow?: string; title: string; text?: string; align?: 'left' | 'center' }) {
    return (
        <div className={`jh3-section-title is-${align}`}>
            {eyebrow && <span className="jh3-eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {text && <p>{text}</p>}
        </div>
    );
}

type IconName = 'code' | 'gear' | 'design' | 'rocket' | 'eye' | 'search' | 'chart' | 'refresh' | 'people' | 'check' | 'map' | 'briefcase' | 'folder' | 'bed' | 'food' | 'camera' | 'message' | 'target' | 'flow' | 'tool' | 'data' | 'mobile' | 'mail' | 'location' | 'screen' | 'lightbulb' | 'document' | 'shield';

export function Icon({ name }: { name: IconName }) {
    const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    const paths: Record<IconName, ReactNode> = {
        code: <><path {...common} d="M9 6 4 12l5 6" /><path {...common} d="m15 6 5 6-5 6" /><path {...common} d="m14 4-4 16" /></>,
        gear: <><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5l-.4 3.1a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L5.1 11A7 7 0 0 0 5 12c0 .3 0 .7.1 1L3 14.5l2 3.4 2.4-1a8 8 0 0 0 1.7 1l.4 3.1h5l.4-3.1a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2.1-1.5c.1-.3.1-.7.1-1Z" /></>,
        design: <><path {...common} d="m4 20 4.5-1 9.8-9.8a2.4 2.4 0 0 0-3.4-3.4L5.1 15.6 4 20Z" /><path {...common} d="m13.8 7 3.2 3.2" /></>,
        rocket: <><path {...common} d="M14 5c3-3 5-2 5-2s1 2-2 5l-4 4-4-4 5-3Z" /><path {...common} d="M9 8 5 9l-2 3 5 1" /><path {...common} d="m13 12 1 5 3-2 1-4" /><circle {...common} cx="15.5" cy="6.5" r="1" /><path {...common} d="M7 16c-2 0-3 1-3 3 2 0 3-1 3-3Z" /></>,
        eye: <><path {...common} d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" /><circle {...common} cx="12" cy="12" r="2.5" /></>,
        search: <><circle {...common} cx="10.5" cy="10.5" r="6" /><path {...common} d="m15 15 5 5" /></>,
        chart: <><path {...common} d="M4 20V10" /><path {...common} d="M10 20V4" /><path {...common} d="M16 20v-7" /><path {...common} d="M22 20H2" /></>,
        refresh: <><path {...common} d="M20 7v5h-5" /><path {...common} d="M4 17v-5h5" /><path {...common} d="M6 8a7 7 0 0 1 12-1l2 2" /><path {...common} d="M18 16a7 7 0 0 1-12 1l-2-2" /></>,
        people: <><circle {...common} cx="9" cy="8" r="3" /><circle {...common} cx="17" cy="9" r="2" /><path {...common} d="M3 20c0-4 2-7 6-7s6 3 6 7" /><path {...common} d="M15 14c3 0 5 2 5 5" /></>,
        check: <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="m8 12 2.5 2.5L16 9" /></>,
        map: <><path {...common} d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path {...common} d="M9 3v15M15 6v15" /></>,
        briefcase: <><rect {...common} x="3" y="7" width="18" height="12" rx="2" /><path {...common} d="M9 7V5h6v2M3 12h18" /></>,
        folder: <path {...common} d="M3 6h7l2 2h9v11H3V6Z" />,
        bed: <><path {...common} d="M3 18V7M21 18v-7H8a5 5 0 0 0-5 5v2h18" /><path {...common} d="M7 11V8h5v3" /></>,
        food: <><path {...common} d="M5 3v8M8 3v8M6.5 11v10" /><path {...common} d="M16 3c3 2 4 6 2 10h-3v8" /></>,
        camera: <><rect {...common} x="3" y="6" width="18" height="14" rx="2" /><path {...common} d="m8 6 2-3h4l2 3" /><circle {...common} cx="12" cy="13" r="4" /></>,
        message: <path {...common} d="M4 4h16v12H9l-5 4V4Z" />,
        target: <><circle {...common} cx="12" cy="12" r="9" /><circle {...common} cx="12" cy="12" r="5" /><circle {...common} cx="12" cy="12" r="1" /></>,
        flow: <><circle {...common} cx="5" cy="6" r="2" /><circle {...common} cx="19" cy="6" r="2" /><circle {...common} cx="12" cy="18" r="2" /><path {...common} d="M7 6h10M5 8v4c0 3 3 4 5 4M19 8v4c0 3-3 4-5 4" /></>,
        tool: <><path {...common} d="M14 6a5 5 0 0 0-6 6L3 17l4 4 5-5a5 5 0 0 0 6-6l-3 3-4-4 3-3Z" /></>,
        data: <><path {...common} d="M4 19V5M4 19h16" /><path {...common} d="m7 15 4-4 3 2 5-6" /></>,
        mobile: <><rect {...common} x="7" y="2" width="10" height="20" rx="2" /><path {...common} d="M10 5h4M11 19h2" /></>,
        mail: <><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><path {...common} d="m4 7 8 6 8-6" /></>,
        location: <><path {...common} d="M12 22s7-6 7-13a7 7 0 1 0-14 0c0 7 7 13 7 13Z" /><circle {...common} cx="12" cy="9" r="2" /></>,
        screen: <><rect {...common} x="3" y="4" width="18" height="13" rx="2" /><path {...common} d="M8 21h8M12 17v4" /></>,
        lightbulb: <><path {...common} d="M9 18h6M10 22h4" /><path {...common} d="M8 14a7 7 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z" /></>,
        document: <><path {...common} d="M6 3h9l3 3v15H6V3Z" /><path {...common} d="M14 3v4h4M9 12h6M9 16h6" /></>,
        shield: <><path {...common} d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path {...common} d="m9 12 2 2 4-4" /></>
    };
    return <svg className="jh3-icon-svg" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function IconBadge({ name, tone = 'green' }: { name: IconName; tone?: 'green' | 'blue' | 'amber' | 'violet' | 'gray' }) {
    return <span className={`jh3-icon-badge is-${tone}`}><Icon name={name} /></span>;
}

export function FounderStrip({ compact = false, quote }: { compact?: boolean; quote?: string }) {
    return (
        <div className={`jh3-founder-strip ${compact ? 'is-compact' : ''}`}>
            {quote && <div className="jh3-founder-quote"><span aria-hidden="true">“</span><p>{quote}</p></div>}
            <img src="/images/francisco-campos.svg" alt="Francisco Javier Campos, fundador de JoinHook" loading="lazy" />
            <div>
                <strong>Francisco Javier Campos</strong>
                <span>Fundador de JoinHook</span>
            </div>
        </div>
    );
}

export function CTA({ title, text, button = 'Conversemos', href = '/contacto' }: { title: string; text?: string; button?: string; href?: string }) {
    return (
        <section className="jh3-cta">
            <IconBadge name="message" />
            <div>
                <h2>{title}</h2>
                {text && <p>{text}</p>}
            </div>
            <Link className="jh3-button jh3-button-primary" href={href}>{button} <span aria-hidden="true">→</span></Link>
        </section>
    );
}

export function DashboardVisual({ variant = 'operations' }: { variant?: 'operations' | 'gastronomy' }) {
    return (
        <div className={`jh3-dashboard-visual is-${variant}`} aria-label={variant === 'gastronomy' ? 'Vista conceptual de Control Gastronómico Express' : 'Vista conceptual de un panel operativo JoinHook'}>
            <div className="jh3-dashboard-shell">
                <aside>
                    <strong>{variant === 'gastronomy' ? 'Control Gastro' : 'JoinOps'}</strong>
                    <span>Inicio</span><span>Operaciones</span><span>Inventario</span><span>Reportes</span><span>Configuración</span>
                </aside>
                <div className="jh3-dashboard-body">
                    <div className="jh3-dashboard-heading"><strong>Resumen operativo</strong><small>Hoy</small></div>
                    <div className="jh3-kpis">
                        <div><small>{variant === 'gastronomy' ? 'Stock total' : 'Ventas del día'}</small><strong>{variant === 'gastronomy' ? '$4,26 M' : '$4,26 M'}</strong><span>+12%</span></div>
                        <div><small>{variant === 'gastronomy' ? 'Productos' : 'Órdenes'}</small><strong>128</strong><span>+8%</span></div>
                        <div><small>Alertas</small><strong>12</strong><span className="is-warn">Revisar</span></div>
                    </div>
                    <div className="jh3-chart-card"><span className="jh3-chart-line one" /><span className="jh3-chart-line two" /></div>
                    <div className="jh3-dashboard-bottom">
                        <div><small>Seguimiento</small><b>Procesos claros</b><i style={{ width: '72%' }} /></div>
                        <div className="jh3-donut"><span>62%</span></div>
                    </div>
                </div>
            </div>
            <div className="jh3-floating-card is-top"><small>Órdenes de hoy</small><strong>128</strong><span>96 completadas</span></div>
            <div className="jh3-floating-card is-bottom"><small>Inventario crítico</small><strong>6 ítems</strong><span>requieren atención</span></div>
        </div>
    );
}

export function ProjectPreview({ project }: { project: 'cge' | 'joinops' | 'snowwise' | 'gestion' }) {
    if (project === 'snowwise') return <img className="jh3-project-preview-image" src="/project-covers/snowwise-cover.svg" alt="Vista conceptual de SnowWise" loading="lazy" />;
    if (project === 'joinops') return <img className="jh3-project-preview-image" src="/project-covers/joinops-cover.svg" alt="Vista conceptual de JoinOps" loading="lazy" />;
    if (project === 'gestion') return <img className="jh3-project-preview-image" src="/project-covers/mi-gestion-cover.svg" alt="Vista conceptual de Mi Gestión" loading="lazy" />;
    return <DashboardVisual variant="gastronomy" />;
}
