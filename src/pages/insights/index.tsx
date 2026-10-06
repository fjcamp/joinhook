import Head from 'next/head';
import Link from 'next/link';

const insights = [
    {
        title: '¿Tu restaurante vende mucho pero gana poco? Mira primero el Prime Cost',
        category: 'Economía gastronómica',
        description: 'Una lectura práctica de Food Cost, Labor Cost, Prime Cost, margen de contribución y punto de equilibrio.',
        href: '/insights/restaurantes-prime-cost',
        eyebrow: 'Diagnóstico · Gastronomía'
    },
    {
        title: 'La Araucanía: más tarifa no significa automáticamente más rendimiento',
        category: 'Hotelería y territorio',
        description: 'Cómo leer ocupación, ADR, RevPAR y pernoctaciones sin confundir un indicador con la rentabilidad.',
        href: '/insights/araucania-hotel-performance',
        eyebrow: 'Datos oficiales · La Araucanía'
    },
    {
        title: 'El presupuesto de viaje que realmente sirve empieza antes de comprar',
        category: 'Planificación de viajes',
        description: 'Una estructura simple para estimar el costo total de un viaje y entender qué gastos suelen quedar fuera.',
        href: '/insights/presupuesto-viaje',
        eyebrow: 'Viajes · Chile / LatAm'
    }
];

export default function Insights() {
    return (
        <>
            <Head>
                <title>JoinHook Insights — datos, análisis y herramientas</title>
                <meta
                    name="description"
                    content="Investigación y análisis de turismo, hospitalidad, gastronomía y planificación de viajes, con fuentes trazables y herramientas prácticas."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://joinhook.cl/insights" />
                <meta property="og:title" content="JoinHook Insights — datos, análisis y herramientas" />
                <meta property="og:description" content="Investigación y análisis de turismo, hospitalidad, gastronomía y viajes con enfoque práctico y basado en evidencia." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://joinhook.cl/insights" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'CollectionPage',
                            name: 'JoinHook Insights',
                            url: 'https://joinhook.cl/insights',
                            description: 'Investigación y análisis de turismo, hospitalidad, gastronomía y viajes.'
                        })
                    }}
                />
            </Head>

            <main className="jh-site">
                <header className="jh-header">
                    <Link className="jh-brand" href="/" aria-label="Volver a JoinHook">
                        <span className="jh-brand-mark" aria-hidden="true">JH</span>
                        <span>JoinHook</span>
                    </Link>
                    <nav className="jh-nav" aria-label="Navegación de Insights">
                        <Link href="/">Inicio</Link>
                        <Link href="/insights">Insights</Link>
                        <a href="#metodo">Método</a>
                    </nav>
                    <a className="jh-header-cta" href="mailto:info@joinhook.cl?subject=Quiero%20recibir%20JoinHook%20Insights">Recibir novedades</a>
                </header>

                <section className="jh-hero jh-sales-hero">
                    <div className="jh-hero-copy">
                        <div className="jh-kicker"><span className="jh-status-dot" /> JoinHook Insights · Chile</div>
                        <h1>
                            Datos que se convierten en <span>mejores preguntas y decisiones.</span>
                        </h1>
                        <p className="jh-hero-lead">
                            Publicamos investigaciones sobre turismo, hospitalidad, gastronomía y viajes usando fuentes trazables, cálculos reproducibles y una regla simple: distinguir lo observado de lo interpretado.
                        </p>
                        <div className="jh-hero-footnotes">
                            <span>Fuentes trazables</span>
                            <span>Gráficos con propósito</span>
                            <span>NO EVIDENCE = NO CLAIM</span>
                        </div>
                    </div>
                </section>

                <section className="jh-section" aria-labelledby="latest-title">
                    <div className="jh-section-heading">
                        <div>
                            <span className="jh-eyebrow">Primeras publicaciones</span>
                            <h2 id="latest-title">Tres líneas para empezar.</h2>
                        </div>
                        <p>Restaurantes nos permiten validar una oferta comercial. Hotelería aporta inteligencia territorial. Viajes abre la puerta a una audiencia más amplia.</p>
                    </div>
                    <div className="jh-capability-grid">
                        {insights.map((item, index) => (
                            <article className="jh-capability jh-surface" key={item.href}>
                                <span>{String(index + 1).padStart(2, '0')}</span>
                                <small className="jh-eyebrow">{item.eyebrow}</small>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <Link href={item.href}>Leer investigación →</Link>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="jh-section" id="metodo" aria-labelledby="method-title">
                    <div className="jh-section-heading">
                        <div>
                            <span className="jh-eyebrow">Método JoinHook</span>
                            <h2 id="method-title">El gráfico correcto depende de la pregunta.</h2>
                        </div>
                        <p>No usamos histogramas, asociaciones o regresiones por decoración. Elegimos el método según la estructura del dato y declaramos sus límites.</p>
                    </div>
                    <div className="jh-capability-grid">
                        <article className="jh-capability jh-surface">
                            <span>01</span>
                            <h3>Series de tiempo</h3>
                            <p>EMAT, ISET, IPC y otras series se muestran principalmente con líneas, variaciones interanuales e índices base 100.</p>
                        </article>
                        <article className="jh-capability jh-surface">
                            <span>02</span>
                            <h3>Distribuciones</h3>
                            <p>Histogramas y boxplots se reservan para muestras reales de establecimientos, viajes o registros suficientemente amplios.</p>
                        </article>
                        <article className="jh-capability jh-surface">
                            <span>03</span>
                            <h3>Relaciones y modelos</h3>
                            <p>Scatter, Pearson, Spearman y regresión solo aparecen cuando existe una hipótesis, observaciones adecuadas y supuestos revisables.</p>
                        </article>
                    </div>
                </section>

                <section className="jh-contact" aria-labelledby="subscribe-title">
                    <span className="jh-eyebrow">Audiencia propia</span>
                    <h2 id="subscribe-title">No queremos solo seguidores. Queremos lectores que vuelvan.</h2>
                    <p>Mientras el sistema de newsletter definitivo se prepara, puedes pedir las próximas publicaciones directamente por correo.</p>
                    <div className="jh-actions">
                        <a className="jh-button jh-button-primary" href="mailto:info@joinhook.cl?subject=JoinHook%20Insights">Quiero recibir Insights</a>
                        <Link className="jh-button jh-button-soft" href="/">Volver a JoinHook</Link>
                    </div>
                </section>

                <footer className="jh-footer">
                    <Link className="jh-brand" href="/"><span className="jh-brand-mark">JH</span><span>JoinHook</span></Link>
                    <p>Investigación, diagnóstico, herramientas y construcción digital con criterio.</p>
                    <span>© {new Date().getFullYear()} Francisco Javier Campos · <Link href="/privacidad">Privacidad</Link></span>
                </footer>
            </main>
        </>
    );
}
