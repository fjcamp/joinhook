import Head from 'next/head';
import Link from 'next/link';

export default function ControlGastronomicoExpress() {
    return (
        <>
            <Head>
                <title>Control Gastronómico Express | JoinHook</title>
                <meta
                    name="description"
                    content="Herramienta simple para pequeños negocios gastronómicos: inventario, compras, mermas, proveedores y dashboard sin mensualidad ni software complejo."
                />
                <link rel="canonical" href="https://joinhook.cl/herramientas/control-gastronomico-express" />
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
                        <a href="#mvp">MVP</a>
                    </nav>
                    <Link className="jh-header-cta" href="/app/control-gastronomico-express">Abrir demo</Link>
                </header>

                <section className="jh-hero" style={{ minHeight: '720px' }}>
                    <div className="jh-hero-copy">
                        <div className="jh-kicker"><span className="jh-status-dot" /> Herramienta JoinHook · MVP en validación</div>
                        <h1 style={{ fontSize: 'clamp(3.2rem, 6vw, 6.3rem)' }}>
                            Controla tu negocio gastronómico <span>sin complicarlo más.</span>
                        </h1>
                        <p className="jh-hero-lead">
                            Control Gastronómico Express está pensado para restaurantes pequeños, cafeterías, pastelerías, panaderías, food trucks y emprendimientos que necesitan ordenar inventario, compras y mermas sin comenzar con un ERP completo ni pagar otra mensualidad.
                        </p>
                        <div className="jh-actions">
                            <Link className="jh-button jh-button-primary" href="/app/control-gastronomico-express">Probar el MVP</Link>
                            <a className="jh-button jh-button-soft" href="#incluye">Ver qué incluye</a>
                        </div>
                        <div className="jh-hero-footnotes">
                            <span>Simple de comenzar</span>
                            <span>Datos locales en el MVP</span>
                            <span>Pensado para Chile</span>
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
                        <div><span className="jh-eyebrow">Problema real</span><h2>Si no sabes qué tienes, qué pierdes o qué comprar, es difícil decidir.</h2></div>
                        <p>La primera versión no intenta reemplazar la caja, el SII ni un ERP completo. Su objetivo es ayudarte a ordenar la base operativa con la menor fricción posible.</p>
                    </div>
                    <div className="jh-capability-grid">
                        {[
                            ['01', 'Inventario', 'Productos, unidades, stock actual y niveles mínimos.'],
                            ['02', 'Compras', 'Registro de entradas y seguimiento básico de compras.'],
                            ['03', 'Mermas', 'Qué se perdió, cuánto costó y por qué ocurrió.'],
                            ['04', 'Proveedores', 'Información útil para volver a comprar con más contexto.']
                        ].map(([n, title, text]) => (
                            <article className="jh-capability jh-surface" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>
                        ))}
                    </div>
                </section>

                <section className="jh-section" id="incluye">
                    <div className="jh-product-panel jh-surface">
                        <div className="jh-product-copy">
                            <span className="jh-eyebrow">MVP inicial</span>
                            <h2>Lo necesario para empezar. Nada de relleno.</h2>
                            <p>Dashboard, inventario, stock mínimo, compras, mermas clasificadas, proveedores, historial de movimientos y respaldo. La primera versión trabaja localmente para que podamos validar el flujo sin sumar backend, cuentas ni costos innecesarios.</p>
                            <div className="jh-tags"><span>Dashboard</span><span>Inventario</span><span>Compras</span><span>Mermas</span><span>Proveedores</span><span>Respaldo</span></div>
                            <div className="jh-actions"><Link className="jh-button jh-button-primary" href="/app/control-gastronomico-express">Abrir Control Gastronómico</Link></div>
                        </div>
                        <div className="jh-about-quote jh-surface">
                            <span>“</span>
                            <p>No quiero venderte un sistema enorme si todavía necesitas resolver algo mucho más simple.</p>
                        </div>
                    </div>
                </section>

                <section className="jh-section" id="mvp">
                    <div className="jh-section-heading">
                        <div><span className="jh-eyebrow">Evolución</span><h2>Primero validar. Después crecer.</h2></div>
                        <p>Si esta herramienta demuestra uso real, puede evolucionar hacia sincronización en nube, cuentas, multi-dispositivo, recetas y producción. Esas funciones entrarán después de probar que la base realmente ayuda.</p>
                    </div>
                </section>

                <section className="jh-contact" id="interes">
                    <span className="jh-eyebrow">Lanzamiento</span>
                    <h2>¿Tienes un negocio gastronómico y quieres probar la primera versión?</h2>
                    <p>Estoy buscando los primeros usuarios para validar que la herramienta sea realmente simple y útil antes de agregar más funciones.</p>
                    <div className="jh-actions">
                        <Link className="jh-button jh-button-primary" href="/app/control-gastronomico-express">Probar MVP</Link>
                        <a className="jh-button jh-button-soft" href="mailto:info@joinhook.cl?subject=Control%20Gastronómico%20Express">Contarme mi caso</a>
                        <Link className="jh-button jh-button-soft" href="/">Volver a JoinHook</Link>
                    </div>
                </section>

                <footer className="jh-footer"><span>JoinHook · proyecto independiente</span><span>Diseñado y construido por Francisco Javier Campos</span></footer>
            </main>
        </>
    );
}
