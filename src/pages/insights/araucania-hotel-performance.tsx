import Head from 'next/head';
import Link from 'next/link';

const ineUrl = 'https://regiones.ine.gob.cl/araucania/estadisticas-por-tema/comercio-y-servicios/actividad-del-turismo/las-pernoctaciones-en-establecimientos-de-alojamiento-tur%C3%ADstico-decrecieron-13-1-en-agosto-2026';

export default function HotelPerformanceInsight() {
    return (
        <>
            <Head>
                <title>La Araucanía: ocupación, ADR y RevPAR | JoinHook Insights</title>
                <meta name="description" content="Cómo leer ocupación, ADR y RevPAR de La Araucanía usando estadísticas oficiales del INE y evitando conclusiones causales." />
                <link rel="canonical" href="https://joinhook.cl/insights/araucania-hotel-performance" />
                <meta property="og:title" content="La Araucanía: más tarifa no significa automáticamente más rendimiento" />
                <meta property="og:description" content="Una lectura de ocupación, ADR, RevPAR y pernoctaciones con datos oficiales del INE." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://joinhook.cl/insights/araucania-hotel-performance" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: 'La Araucanía: más tarifa no significa automáticamente más rendimiento',
                            author: { '@type': 'Person', name: 'Francisco Javier Campos', url: 'https://joinhook.cl/' },
                            publisher: { '@type': 'Person', name: 'Francisco Javier Campos', url: 'https://joinhook.cl/' },
                            mainEntityOfPage: 'https://joinhook.cl/insights/araucania-hotel-performance',
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
                        <a href="#lectura">Lectura</a>
                        <a href="#graficos">Gráficos</a>
                    </nav>
                    <Link className="jh-header-cta" href="/insights">Más análisis</Link>
                </header>

                <article className="jh-legal jh-surface" style={{ margin: 'clamp(5rem, 9vw, 9rem) auto 0' }}>
                    <span className="jh-eyebrow">Hotelería · La Araucanía · 06 octubre 2026</span>
                    <h1>La Araucanía: más tarifa no significa automáticamente más rendimiento</h1>
                    <p className="jh-hero-lead">Los indicadores hoteleros cuentan historias distintas. Mirarlos juntos evita conclusiones demasiado rápidas.</p>

                    <h2 id="lectura">Agosto de 2026</h2>
                    <div className="jh-capability-grid" style={{ margin: '2rem 0' }}>
                        <article className="jh-capability">
                            <span>25,3%</span>
                            <h3>Ocupación</h3>
                            <p>Habitaciones ocupadas respecto de las disponibles en la región.</p>
                        </article>
                        <article className="jh-capability">
                            <span>$90.000</span>
                            <h3>ADR</h3>
                            <p>Tarifa promedio diaria de las habitaciones vendidas.</p>
                        </article>
                        <article className="jh-capability">
                            <span>$22.785</span>
                            <h3>RevPAR</h3>
                            <p>Ingreso por habitación disponible, incorporando el efecto de la ocupación.</p>
                        </article>
                    </div>

                    <p>Además, La Araucanía registró <strong>62.660 pernoctaciones</strong> y una variación interanual de <strong>-13,1%</strong> en agosto de 2026. Estas cifras corresponden al ámbito regional y no describen la rentabilidad de un establecimiento individual.</p>

                    <h2 id="graficos">El gráfico correcto</h2>
                    <p>Para una serie como EMAT, el gráfico principal debe ser una <strong>línea temporal</strong> de ocupación, ADR y RevPAR. Un segundo gráfico puede mostrar la variación interanual de pernoctaciones. Para comparar La Araucanía con Chile en un mismo mes, son preferibles barras separadas o índices base 100.</p>
                    <p>Con una base comparable de establecimientos, un <strong>scatter</strong> ADR vs ocupación permitiría estudiar asociación mediante Pearson o Spearman. No debe confundirse correlación con causalidad.</p>
                    <p>Tampoco usaría una regresión de RevPAR sobre ADR para afirmar que una tarifa “causa” mayor RevPAR: ambas métricas están mecánicamente relacionadas.</p>

                    <h2>Fuente oficial</h2>
                    <p><a href={ineUrl} target="_blank" rel="noreferrer">INE Araucanía — resultados de EMAT, agosto de 2026</a>.</p>

                    <section className="jh-contact" style={{ margin: '3rem -1rem -1rem' }}>
                        <span className="jh-eyebrow">Hotel Performance Diagnostic</span>
                        <h2>Estamos explorando cómo convertir estadísticas públicas en decisiones para operadores.</h2>
                        <p>JoinHook todavía no presenta este diagnóstico como producto terminado. Primero queremos validar qué indicadores son realmente útiles en terreno.</p>
                        <div className="jh-actions">
                            <a className="jh-button jh-button-primary" href="mailto:info@joinhook.cl?subject=Hotel%20Performance%20Diagnostic">Quiero conversar</a>
                            <Link className="jh-button jh-button-soft" href="/insights">Ver más análisis</Link>
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
