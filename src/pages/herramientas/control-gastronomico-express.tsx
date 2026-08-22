import Head from 'next/head';
import Link from 'next/link';

const purchaseMail = 'mailto:ventas@joinhook.cl?subject=Quiero%20el%20pack%20fundador%20de%20Control%20Gastron%C3%B3mico%20Express&body=Hola%2C%0A%0AMe%20interesa%20el%20pack%20fundador%20de%20Control%20Gastron%C3%B3mico%20Express%20por%20%244.990%20CLP.%0A%0AMi%20negocio%20es%3A%20%0ACiudad%3A%20%0AGracias.';
const embeddedCommerceEnabled = process.env.NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED === 'true';

// Compatibility fallback while the current Mercado Pago Link remains available.
// New configuration must use CONTROL_EXPRESS names; the historical CGE names are read-only aliases.
const fallbackCheckoutUrl = (
    process.env.NEXT_PUBLIC_CONTROL_EXPRESS_CHECKOUT_URL
    || process.env.NEXT_PUBLIC_CGE_CHECKOUT_URL
)?.trim();
const fallbackCheckoutEnabled = (
    process.env.NEXT_PUBLIC_CONTROL_EXPRESS_CHECKOUT_ENABLED === 'true'
    || process.env.NEXT_PUBLIC_CGE_CHECKOUT_ENABLED === 'true'
) && Boolean(fallbackCheckoutUrl?.startsWith('https://'));

const seller = {
    name: process.env.NEXT_PUBLIC_SELLER_NAME?.trim(),
    rut: process.env.NEXT_PUBLIC_SELLER_RUT?.trim(),
    email: process.env.NEXT_PUBLIC_SELLER_EMAIL?.trim(),
    address: process.env.NEXT_PUBLIC_SELLER_ADDRESS?.trim()
};
const sellerReady = Boolean(seller.name && seller.rut && seller.email && seller.address);
const purchaseMode: 'embedded' | 'external' | 'mail' = embeddedCommerceEnabled
    ? 'embedded'
    : fallbackCheckoutEnabled
        ? 'external'
        : 'mail';
const purchaseHref = purchaseMode === 'embedded'
    ? '/checkout/control-gastronomico-express'
    : purchaseMode === 'external' && fallbackCheckoutUrl
        ? fallbackCheckoutUrl
        : purchaseMail;
const opensExternalCheckout = purchaseMode === 'external';

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
                            <p>La beta se puede probar gratis. El pack fundador reserva tu acceso a la versión de lanzamiento e incluye acompañamiento inicial, sin mensualidad para este alcance.</p>
                            <ul className="jh-check-list">
                                <li>Prueba beta abierta antes de decidir</li>
                                <li>Pack fundador para la versión de lanzamiento</li>
                                <li>Inventario, compras, mermas y proveedores</li>
                                <li>Plantilla CSV, respaldo local y guía de puesta en marcha</li>
                                <li>Actualizaciones correctivas de esta versión y soporte inicial</li>
                            </ul>
                            <div className="jh-actions">
                                <a
                                    className="jh-button jh-button-primary"
                                    href={purchaseHref}
                                    target={opensExternalCheckout ? '_blank' : undefined}
                                    rel={opensExternalCheckout ? 'noreferrer' : undefined}
                                >
                                    {purchaseMode === 'mail' ? 'Solicitar pack fundador · $4.990' : 'Comprar pack fundador · $4.990'}
                                </a>
                                <Link className="jh-button jh-button-soft" href="/app/control-gastronomico-express">Probar antes</Link>
                            </div>
                            <small className="jh-purchase-note">
                                {purchaseMode === 'embedded'
                                    ? 'El pago se realiza dentro de JoinHook mediante Mercado Pago. Los datos de tarjeta son tokenizados por Mercado Pago y JoinHook libera el producto solo después de verificar la operación en el backend.'
                                    : purchaseMode === 'external'
                                        ? 'Mientras terminamos el checkout embebido, el pago se abre de forma segura en Mercado Pago. Antes de pagar, revisa el producto, el monto y los datos del receptor que muestra la pasarela.'
                                        : 'La solicitud abre tu correo y no realiza un cobro automático. El checkout permanecerá deshabilitado hasta configurar medio de pago.'}
                            </small>
                            {sellerReady && (
                                <small className="jh-purchase-note">
                                    <strong>Proveedor:</strong> {seller.name} · RUT {seller.rut} · {seller.email} · {seller.address}
                                </small>
                            )}
                        </article>

                        <article className="jh-surface jh-fit-card">
                            <span className="jh-eyebrow">¿Para quién es?</span>
                            <h3>Buena opción si hoy quieres control, no otro proyecto de implementación.</h3>
                            <p><strong>Sí:</strong> negocios pequeños que quieren ordenar stock, compras y pérdidas con una herramienta simple.</p>
                            <p><strong>Todavía no:</strong> empresas que necesitan POS, facturación electrónica, recetas complejas, multi-sucursal, permisos avanzados o sincronización cloud.</p>
                            <p>Para esos escenarios estoy desarrollando proyectos de mayor alcance, pero Express deliberadamente comienza más pequeño.</p>
                        </article>
                    </div>
                </section>

                <section className="jh-section" id="faq">
                    <div className="jh-section-heading">
                        <div><span className="jh-eyebrow">Preguntas frecuentes</span><h2>Lo importante antes de usar la beta.</h2></div>
                        <p>Prefiero que tengas claro qué hace y qué no hace la primera versión antes de decidir.</p>
                    </div>
                    <div className="jh-faq-grid">
                        <article className="jh-surface"><h3>¿Qué compro si puedo probar gratis?</h3><p>La beta abierta permite evaluar el flujo. El pack fundador corresponde a la versión de lanzamiento, su guía de puesta en marcha, soporte inicial y correcciones dentro de ese alcance.</p></article>
                        <article className="jh-surface"><h3>¿Dónde quedan mis datos?</h3><p>En esta beta los datos operativos se guardan localmente en el navegador del dispositivo. Por eso el respaldo JSON es importante.</p></article>
                        <article className="jh-surface"><h3>¿Puedo usarlo en varios equipos?</h3><p>No existe sincronización cloud todavía. Cada navegador mantiene su propio espacio local; puedes mover información mediante respaldo/restauración.</p></article>
                        <article className="jh-surface"><h3>¿Funciona sin internet?</h3><p>La PWA está preparada para continuidad local después de una primera carga compatible. Esta función se terminará de validar en staging antes de la beta externa.</p></article>
                        <article className="jh-surface"><h3>¿Emite boletas o factura?</h3><p>No. Express no reemplaza un POS, un sistema contable ni las herramientas tributarias que correspondan a tu negocio.</p></article>
                        <article className="jh-surface"><h3>¿Puedo cargar mi inventario?</h3><p>Sí. La beta permite importar productos desde CSV y exportar el inventario para Excel o Google Sheets.</p></article>
                        <article className="jh-surface"><h3>¿Qué pasa si borro los datos del navegador?</h3><p>Puedes perder la información local. Por eso la app incorpora respaldo y restauración; antes de usarla en operación real conviene respaldar periódicamente.</p></article>
                    </div>
                </section>

                <section className="jh-contact" id="interes">
                    <span className="jh-eyebrow">Primeros usuarios</span>
                    <h2>¿Tu negocio todavía controla inventario y mermas con demasiados pasos?</h2>
                    <p>Prueba la beta, cuéntame dónde se te hace difícil y ayúdame a convertir Express en una herramienta realmente útil para pequeños negocios gastronómicos de Chile.</p>
                    <div className="jh-actions">
                        <Link className="jh-button jh-button-primary" href="/app/control-gastronomico-express">Probar ahora</Link>
                        <a
                            className="jh-button jh-button-soft"
                            href={purchaseHref}
                            target={opensExternalCheckout ? '_blank' : undefined}
                            rel={opensExternalCheckout ? 'noreferrer' : undefined}
                        >
                            {purchaseMode === 'mail' ? 'Solicitar pack fundador' : 'Comprar pack fundador'}
                        </a>
                        <a className="jh-button jh-button-soft" href="mailto:contacto@joinhook.cl?subject=Mi%20caso%20gastron%C3%B3mico">Contarme mi caso</a>
                    </div>
                </section>

                <footer className="jh-footer">
                    <span>JoinHook · proyecto independiente de Francisco Javier Campos</span>
                    <span><Link href="/privacidad">Privacidad</Link> · <Link href="/condiciones-beta">Condiciones de beta</Link> · <Link href="/">Volver a JoinHook</Link></span>
                </footer>
            </main>
        </>
    );
}
