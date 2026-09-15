import Head from 'next/head';
import Link from 'next/link';

const purchaseMail = 'mailto:info@joinhook.cl?subject=Quiero%20el%20pack%20fundador%20de%20Control%20Gastron%C3%B3mico%20Express&body=Hola%20Francisco%2C%0A%0AMe%20interesa%20el%20pack%20fundador%20de%20Control%20Gastron%C3%B3mico%20Express%20por%20%244.990%20CLP.%0A%0AMi%20negocio%20es%3A%20%0ACiudad%3A%20%0AGracias.';
const checkoutUrl = process.env.NEXT_PUBLIC_CGE_CHECKOUT_URL?.trim();
const seller = {
    name: process.env.NEXT_PUBLIC_SELLER_NAME?.trim(),
    rut: process.env.NEXT_PUBLIC_SELLER_RUT?.trim(),
    email: process.env.NEXT_PUBLIC_SELLER_EMAIL?.trim(),
    address: process.env.NEXT_PUBLIC_SELLER_ADDRESS?.trim()
};
const sellerReady = Boolean(seller.name && seller.rut && seller.email && seller.address);
const checkoutEnabled = process.env.NEXT_PUBLIC_CGE_CHECKOUT_ENABLED === 'true' && Boolean(checkoutUrl?.startsWith('https://'));
const purchaseHref = checkoutEnabled && checkoutUrl ? checkoutUrl : purchaseMail;

const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Control Gastronómico Express',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, PWA',
    description: 'Herramienta local-first para pequeños negocios gastronómicos con inventario, compras, mermas, proveedores, alertas y respaldo.',
    url: 'https://joinhook.cl/herramientas/control-gastronomico-express',
    author: {
        '@type': 'Person',
        name: 'Francisco Javier Campos',
        url: 'https://joinhook.cl/'
    },
    offers: {
        '@type': 'Offer',
        priceCurrency: 'CLP',
        price: '4990',
        availability: 'https://schema.org/PreOrder',
        url: 'https://joinhook.cl/herramientas/control-gastronomico-express'
    }
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: '¿Necesito pagar una mensualidad?',
            acceptedAnswer: { '@type': 'Answer', text: 'El pack fundador está planteado como pago único de lanzamiento, sin mensualidad para el alcance inicial descrito.' }
        },
        {
            '@type': 'Question',
            name: '¿Qué compro si la beta se puede probar gratis?',
            acceptedAnswer: { '@type': 'Answer', text: 'La beta abierta sirve para evaluar la herramienta. El pack fundador reserva el acceso a la versión de lanzamiento e incluye guía de puesta en marcha, soporte inicial y actualizaciones correctivas dentro de ese alcance.' }
        },
        {
            '@type': 'Question',
            name: '¿Dónde se guardan mis datos?',
            acceptedAnswer: { '@type': 'Answer', text: 'La beta actual es local-first: los datos operativos se guardan en el navegador del dispositivo y no se sincronizan con una nube de JoinHook.' }
        },
        {
            '@type': 'Question',
            name: '¿Funciona sin internet?',
            acceptedAnswer: { '@type': 'Answer', text: 'Después de una primera carga compatible, la PWA está preparada para continuar funcionando sin conexión en el dispositivo, sujeto a la prueba final de staging y navegador.' }
        },
        {
            '@type': 'Question',
            name: '¿Reemplaza un ERP, POS o sistema contable?',
            acceptedAnswer: { '@type': 'Answer', text: 'No. Express se concentra en inventario, compras, mermas, proveedores y control operativo básico. No emite documentos tributarios ni reemplaza un sistema contable o POS.' }
        }
    ]
};

export default function ControlGastronomicoExpress() {
    return (
        <>
            <Head>
                <title>Control Gastronómico Express | Inventario y mermas para pequeños negocios</title>
                <meta
                    name="description"
                    content="Controla inventario, compras, mermas y proveedores sin partir por un ERP complejo. Control Gastronómico Express: beta PWA local-first y pack fundador de lanzamiento por $4.990 CLP."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#f3f0e8" />
                <meta name="cge-founder-price" content="4990" />
                <meta name="cge-founder-currency" content="CLP" />
                <link rel="canonical" href="https://joinhook.cl/herramientas/control-gastronomico-express" />
                <meta property="og:title" content="Control Gastronómico Express | JoinHook" />
                <meta property="og:description" content="Inventario, compras, mermas y proveedores en una herramienta simple para pequeños negocios gastronómicos." />
                <meta property="og:type" content="product" />
                <meta property="og:url" content="https://joinhook.cl/herramientas/control-gastronomico-express" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            </Head>

            <main className="jh-site">
                <header className="jh-header">
                    <Link className="jh-brand" href="/" aria-label="Volver a JoinHook">
                        <span className="jh-brand-mark" aria-hidden="true">JH</span>
                        <span>JoinHook</span>
                    </Link>
                    <nav className="jh-nav" aria-label="Navegación del producto">
                        <a href="#que-resuelve">Qué resuelve</a>
                        <a href="#incluye">Qué incluye</a>
                        <a href="#precio">Precio</a>
                        <a href="#faq">Preguntas</a>
                    </nav>
                    <Link className="jh-header-cta" href="/app/control-gastronomico-express">Probar beta</Link>
                </header>

                <section className="jh-hero jh-sales-hero">
                    <div className="jh-hero-copy">
                        <div className="jh-kicker"><span className="jh-status-dot" /> Beta de lanzamiento · proyecto independiente</div>
                        <h1 style={{ fontSize: 'clamp(3.1rem, 6vw, 6.2rem)' }}>
                            Ordena tu negocio gastronómico <span>sin partir por un sistema enorme.</span>
                        </h1>
                        <p className="jh-hero-lead">
                            Inventario, compras, mermas, proveedores y alertas de stock en una PWA simple. Pensada para restaurantes pequeños, cafeterías, pastelerías, panaderías, food trucks y emprendimientos que hoy necesitan control antes que complejidad.
                        </p>
                        <div className="jh-actions">
                            <Link className="jh-button jh-button-primary" href="/app/control-gastronomico-express">Probar gratis la beta</Link>
                            <a className="jh-button jh-button-soft" href="#precio">Ver pack fundador</a>
                        </div>
                        <div className="jh-hero-footnotes">
                            <span>PWA instalable</span>
                            <span>Datos locales en esta beta</span>
                            <span>Pack fundador sin mensualidad</span>
                        </div>
                    </div>

                    <div className="jh-product-dashboard" aria-label="Vista conceptual del dashboard">
                        <div className="jh-product-kpis">
                            <article><small>Stock crítico</small><strong>06</strong><span>productos</span></article>
                            <article><small>Merma</small><strong>2,4%</strong><span>del período</span></article>
                            <article><small>Compras</small><strong>$248k</strong><span>ejemplo</span></article>
                        </div>
                        <div className="jh-product-graph">
                            <div className="jh-graph-head"><span>Movimiento de inventario</span><small>Vista demostrativa</small></div>
                            <div className="jh-bars" aria-hidden="true">
                                {[42, 68, 51, 84, 62, 93, 71, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="jh-section" id="que-resuelve">
                    <div className="jh-section-heading">
                        <div><span className="jh-eyebrow">El problema</span><h2>Vender no basta si no sabes qué tienes, qué perdiste y qué necesitas reponer.</h2></div>
                        <p>Express no intenta reemplazar tu caja, el SII ni un ERP completo. Resuelve primero la capa operativa que suele terminar repartida entre cuadernos, mensajes y planillas.</p>
                    </div>
                    <div className="jh-capability-grid">
                        {[
                            ['01', 'Inventario', 'Productos, unidades, stock actual, costos y niveles mínimos.'],
                            ['02', 'Compras', 'Entradas de mercadería que actualizan el stock y dejan historial.'],
                            ['03', 'Mermas', 'Registra qué se perdió, cuánto y por qué ocurrió.'],
                            ['04', 'Proveedores', 'Mantén los contactos y el contexto necesario para volver a comprar.']
                        ].map(([n, title, text]) => (
                            <article className="jh-capability jh-surface" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>
                        ))}
                    </div>
                </section>

                <section className="jh-section" id="incluye">
                    <div className="jh-product-panel jh-surface">
                        <div className="jh-product-copy">
                            <span className="jh-eyebrow">Incluido en la beta</span>
                            <h2>Una base operativa que puedes empezar a usar en minutos.</h2>
                            <p>Dashboard, inventario, compras, mermas, proveedores, ajustes trazables, sugerencias de reposición, importación/exportación CSV, respaldo JSON, onboarding y modo PWA.</p>
                            <div className="jh-tags">
                                <span>Dashboard</span><span>Inventario</span><span>Compras</span><span>Mermas</span><span>Proveedores</span><span>CSV</span><span>Respaldo</span><span>PWA</span>
                            </div>
                            <div className="jh-actions"><Link className="jh-button jh-button-primary" href="/app/control-gastronomico-express">Abrir la aplicación</Link></div>
                        </div>
                        <div className="jh-about-quote jh-surface">
                            <span>“</span>
                            <p>Primero quiero ayudarte a ver y ordenar lo básico. Si el negocio necesita más, recién ahí tiene sentido crecer.</p>
                        </div>
                    </div>
                </section>

                <section className="jh-section" id="precio">
                    <div className="jh-sales-grid">
                        <article className="jh-price-card jh-surface">
                            <span className="jh-eyebrow">Pack fundador · lanzamiento</span>
                            <h2>Control Gastronómico Express</h2>
                            <div className="jh-price"><strong>$4.990</strong><span>CLP · pago único</span></div>
