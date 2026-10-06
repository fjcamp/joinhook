import Head from 'next/head';
import Link from 'next/link';

const source = 'https://www.7shifts.com/blog/restaurant-prime-cost-guide/';

export default function RestaurantPrimeCostInsight() {
    return (
        <>
            <Head>
                <title>Prime Cost en restaurantes | JoinHook Insights</title>
                <meta name="description" content="Cómo leer Food Cost, Labor Cost y Prime Cost en un restaurante y por qué el porcentaje no basta para entender el resultado." />
                <link rel="canonical" href="https://joinhook.cl/insights/restaurantes-prime-cost" />
                <meta property="og:title" content="¿Tu restaurante vende mucho pero gana poco? Mira primero el Prime Cost" />
                <meta property="og:description" content="Una lectura práctica de Food Cost, Labor Cost, Prime Cost, delivery y punto de equilibrio." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://joinhook.cl/insights/restaurantes-prime-cost" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: '¿Tu restaurante vende mucho pero gana poco? Mira primero el Prime Cost',
                            author: { '@type': 'Person', name: 'Francisco Javier Campos', url: 'https://joinhook.cl/' },
                            publisher: { '@type': 'Person', name: 'Francisco Javier Campos', url: 'https://joinhook.cl/' },
                            mainEntityOfPage: 'https://joinhook.cl/insights/restaurantes-prime-cost',
                            datePublished: '2026-10-06'
                        })
                    }}
                />
            </Head>

            <main className="jh-site">
                <header className="jh-header">
                    <Link className="jh-brand" href="/"><span className="jh-brand-mark" aria-hidden="true">JH</span><span>JoinHook</span></Link>
                    <nav className="jh-nav" aria-label="Navegación del artículo">
                        <Link href="/insights">Insights</Link>
                        <a href="#diagnostico">Diagnóstico</a>
                        <a href="#metodo">Método</a>
                    </nav>
                    <Link className="jh-header-cta" href="/herramientas/control-gastronomico-express">Ver herramienta</Link>
                </header>

                <article className="jh-legal jh-surface" style={{ margin: 'clamp(5rem, 9vw, 9rem) auto 0' }}>
                    <span className="jh-eyebrow">Economía gastronómica · 06 octubre 2026</span>
                    <h1>¿Tu restaurante vende mucho pero gana poco? Mira primero el Prime Cost</h1>
                    <p className="jh-hero-lead">Vender más no responde por sí solo la pregunta más importante: cuánto de esa venta queda disponible después de los costos que realmente importan.</p>

                    <h2 id="diagnostico">La primera lectura</h2>
                    <p><strong>Food Cost</strong> representa el peso de los costos de alimentos y bebidas identificados respecto de las ventas. <strong>Labor Cost</strong> representa el peso de los costos laborales. <strong>Prime Cost</strong> combina ambos: COGS + Labor.</p>
                    <p>En el MVP experimental de JoinHook usamos un ejemplo matemático de ventas por <strong>$10.000.000 CLP</strong>, COGS de <strong>$3.000.000</strong> y labor de <strong>$2.800.000</strong>. Eso produce Food Cost de 30%, Labor Cost de 28% y Prime Cost de 58%.</p>
                    <p><strong>Ese 58% no es un benchmark universal ni un caso real.</strong> Es solamente una comprobación matemática de nuestra herramienta.</p>

                    <div className="jh-capability-grid" style={{ margin: '2rem 0' }}>
                        <article className="jh-capability">
                            <span>30%</span>
                            <h3>Food Cost</h3>
                            <p>Parte de la venta absorbida por COGS en el ejemplo.</p>
                        </article>
                        <article className="jh-capability">
                            <span>28%</span>
                            <h3>Labor Cost</h3>
                            <p>Parte de la venta absorbida por labor en el ejemplo.</p>
                        </article>
                        <article className="jh-capability">
                            <span>58%</span>
                            <h3>Prime Cost</h3>
                            <p>Food Cost + Labor Cost en el ejemplo.</p>
                        </article>
                    </div>

                    <h2>Por qué no basta con mirar un porcentaje</h2>
                    <p>Después del Prime Cost aparecen otras preguntas: ¿qué ocurre con la comisión de delivery?, ¿cuánto representan las mermas?, ¿cuál es el margen de contribución?, ¿qué nivel de ventas cubre los costos fijos?</p>
                    <p>Por eso el diagnóstico de JoinHook no busca solamente entregar un número. Busca conectar el número con una decisión.</p>

                    <h2 id="metodo">¿Qué gráfico tendría sentido?</h2>
                    <p>Para un caso individual, un <strong>waterfall</strong> es más informativo que un histograma: muestra cómo las ventas se transforman en resultado después de COGS, labor, delivery, otros costos variables y costos fijos. Un gráfico de sensibilidad puede mostrar después qué variable mueve más el resultado.</p>
                    <p>Histogramas, boxplots, medidas de asociación y regresiones tendrán sentido cuando dispongamos de una muestra anonimizada de negocios, no con un único ejemplo.</p>

                    <h2>Fuentes y límites</h2>
                    <p>La definición metodológica de Prime Cost utilizada en este contenido sigue la referencia de 7shifts, que define Prime Cost como COGS + labor. <a href={source} target="_blank" rel="noreferrer">Ver fuente de referencia</a>.</p>
                    <p>Los datos del ejemplo son propios del MVP y no describen el rendimiento de un restaurante real.</p>

                    <section className="jh-contact" style={{ margin: '3rem -1rem -1rem' }}>
                        <span className="jh-eyebrow">Validación comercial</span>
                        <h2>Estamos buscando restaurantes para probar el diagnóstico con datos reales.</h2>
                        <p>La herramienta está en validación. La idea es detectar qué indicadores ayudan realmente a tomar decisiones operativas.</p>
                        <div className="jh-actions">
                            <a className="jh-button jh-button-primary" href="mailto:info@joinhook.cl?subject=Piloto%20Restaurant%20Margin%20Diagnostic">Quiero participar en el piloto</a>
                            <Link className="jh-button jh-button-soft" href="/herramientas/control-gastronomico-express">Conocer Control Gastronómico Express</Link>
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
