import Head from 'next/head';
import Link from 'next/link';

export default function TravelBudgetInsight() {
    return (
        <>
            <Head>
                <title>Presupuesto de viaje | JoinHook Insights</title>
                <meta name="description" content="Cómo construir un presupuesto de viaje realista con transporte, alojamiento, alimentación, actividades, conectividad, seguros e imprevistos." />
                <link rel="canonical" href="https://joinhook.cl/insights/presupuesto-viaje" />
                <meta property="og:title" content="El presupuesto de viaje que realmente sirve empieza antes de comprar" />
                <meta property="og:description" content="Una estructura práctica para estimar el costo total de un viaje." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://joinhook.cl/insights/presupuesto-viaje" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: 'El presupuesto de viaje que realmente sirve empieza antes de comprar',
                            author: { '@type': 'Person', name: 'Francisco Javier Campos', url: 'https://joinhook.cl/' },
                            publisher: { '@type': 'Person', name: 'Francisco Javier Campos', url: 'https://joinhook.cl/' },
                            mainEntityOfPage: 'https://joinhook.cl/insights/presupuesto-viaje',
                            datePublished: '2026-10-06'
                        })
                    }}
                />
            </Head>

            <main className="jh-site">
                <header className="jh-header">
                    <Link className="jh-brand" href="/"><span className="jh-brand-mark">JH</span><span>JoinHook</span></Link>
                    <nav className="jh-nav" aria-label="Navegación del artículo">
                        <Link href="/insights">Insights</Link>
                        <a href="#presupuesto">Presupuesto</a>
                        <a href="#metodo">Método</a>
                    </nav>
                    <Link className="jh-header-cta" href="/insights">Más análisis</Link>
                </header>

                <article className="jh-legal jh-surface" style={{ margin: 'clamp(5rem, 9vw, 9rem) auto 0' }}>
                    <span className="jh-eyebrow">Planificación de viajes · 06 octubre 2026</span>
                    <h1>El presupuesto de viaje que realmente sirve empieza antes de comprar</h1>
                    <p className="jh-hero-lead">Pasaje + hotel no es el costo total del viaje. Un presupuesto útil intenta capturar el viaje completo, no solamente la primera compra.</p>

                    <h2 id="presupuesto">Los componentes</h2>
                    <div className="jh-capability-grid" style={{ margin: '2rem 0' }}>
                        <article className="jh-capability">
                            <span>01</span>
                            <h3>Transporte</h3>
                            <p>Pasajes, combustible, peajes, estacionamientos, transfers o arriendo.</p>
                        </article>
                        <article className="jh-capability">
                            <span>02</span>
                            <h3>Alojamiento</h3>
                            <p>No solo la tarifa publicada: noches y cargos aplicables.</p>
                        </article>
                        <article className="jh-capability">
                            <span>03</span>
                            <h3>Alimentación</h3>
                            <p>Un promedio diario ayuda a convertir días de viaje en una cifra operativa.</p>
                        </article>
                        <article className="jh-capability">
                            <span>04</span>
                            <h3>Actividades</h3>
                            <p>Entradas, excursiones, tours y experiencias.</p>
                        </article>
                        <article className="jh-capability">
                            <span>05</span>
                            <h3>Conectividad</h3>
                            <p>SIM, eSIM o roaming según destino y necesidades.</p>
                        </article>
                        <article className="jh-capability">
                            <span>06</span>
                            <h3>Seguro e imprevistos</h3>
                            <p>El presupuesto no debería terminar exactamente en cero.</p>
                        </article>
                    </div>

                    <h2 id="metodo">Qué gráfico tendría sentido</h2>
                    <p>Para un viaje individual, el gráfico principal debería ser un <strong>waterfall</strong> del costo total. Para comparar escenarios, barras apiladas muestran bien qué proporción corresponde a transporte, alojamiento, alimentación y otros componentes.</p>
                    <p>Un <strong>histograma o boxplot</strong> solo sería válido después de reunir una muestra suficiente de viajes individuales mediante una encuesta o datos con licencia. Una regresión, por ejemplo gasto total vs duración, requiere una base de observaciones adecuada y una hipótesis explícita.</p>

                    <h2>Regla de trazabilidad</h2>
                    <p>Cuando una cifra dependa de un precio dinámico, debe guardar moneda, fecha de consulta y fuente. Una utility de JoinHook no debería mostrar un precio cambiante sin contexto temporal.</p>

                    <h2>Qué sigue</h2>
                    <p>La idea de un futuro <strong>Travel Budget Diagnostic</strong> sigue en investigación. Antes de construirlo como producto, JoinHook debe validar demanda, datos disponibles y una experiencia suficientemente útil.</p>

                    <section className="jh-contact" style={{ margin: '3rem -1rem -1rem' }}>
                        <span className="jh-eyebrow">JoinHook Insights</span>
                        <h2>Las herramientas vendrán después de entender el problema.</h2>
                        <p>Mientras investigamos, puedes pedir por correo los próximos análisis de viajes, turismo y costos.</p>
                        <div className="jh-actions">
                            <a className="jh-button jh-button-primary" href="mailto:info@joinhook.cl?subject=JoinHook%20Insights%20viajes">Recibir próximos análisis</a>
                            <Link className="jh-button jh-button-soft" href="/insights">Volver a Insights</Link>
                        </div>
                    </section>
                </article>

                <footer className="jh-footer">
                    <Link href="/insights">← Todos los Insights</Link>
                    <span>© {new Date().getFullYear()} JoinHook</span>
                </footer>
            </main>
        </>
    );
}
