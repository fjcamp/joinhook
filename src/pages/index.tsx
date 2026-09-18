import Head from 'next/head';
import Link from 'next/link';

const services = [
    {
        number: '01',
        title: 'Diagnóstico y orden',
        text: 'Entender cómo funciona hoy un negocio o proyecto, detectar fugas de información, fricciones y oportunidades, y ordenar prioridades antes de invertir.'
    },
    {
        number: '02',
        title: 'Diseño de soluciones',
        text: 'Traducir necesidades reales en procesos, experiencias, servicios o herramientas que puedan implementarse por etapas y con objetivos claros.'
    },
    {
        number: '03',
        title: 'Digitalización proporcional',
        text: 'Usar web, datos, automatización o software solo cuando aporten valor. La tecnología acompaña la solución; no reemplaza el criterio del negocio.'
    },
    {
        number: '04',
        title: 'Acompañamiento y mejora',
        text: 'Medir, aprender, ajustar y documentar. Cada proyecto debe poder mostrar qué está funcionando, qué falta y cuál es el siguiente paso.'
    }
];

const projects = [
    {
        name: 'JoinOps',
        state: 'En desarrollo',
        category: 'Gastronomía · Operaciones · Gestión',
        description: 'ERP operacional modular para restaurantes, cafeterías, pastelerías y servicios de alimentos, con una arquitectura extensible a turismo y hotelería.',
        cover: '/project-covers/joinops-cover.svg',
        href: 'https://github.com/fjcamp/joinops'
    },
    {
        name: 'SnowWise',
        state: 'En construcción',
        category: 'Montaña · Clima · Seguridad',
        description: 'Experiencia para planificar actividades de nieve y montaña integrando clima, destinos, orientación y seguridad en un solo lugar.',
        cover: '/project-covers/snowwise-cover.svg',
        href: 'https://github.com/fjcamp/snowwise'
    },
    {
        name: 'Otros proyectos',
        state: 'Exploración',
        category: 'Ideas · Territorio · Nuevas necesidades',
        description: 'Experimentos, productos y colaboraciones que nacen desde una necesidad concreta y se desarrollan solo cuando existe una razón para hacerlo.',
        cover: '/project-covers/mi-gestion-cover.svg',
        href: '#contacto'
    }
];

const principles = [
    'Escuchamos antes de proponer.',
    'Ordenamos antes de digitalizar.',
    'Mostramos con claridad lo disponible y lo pendiente.',
    'Buscamos soluciones compatibles con las personas, el negocio y el territorio.'
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Home() {
    return (
        <>
            <Head>
                <title>JoinHook — Acompañamos negocios y proyectos a crecer con sentido</title>
                <meta name="description" content="JoinHook acompaña, diagnostica, ordena, diseña, conecta e impulsa negocios y proyectos de turismo, hospitalidad, gastronomía, ecoturismo y territorio." />
                <meta name="theme-color" content="#f3f0e8" />
                <meta property="og:title" content="JoinHook — Soluciones para negocios y proyectos que quieren avanzar" />
                <meta property="og:description" content="Diagnóstico, orden, diseño, digitalización y acompañamiento para turismo, hospitalidad, gastronomía, ecoturismo y territorio." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://joinhook.cl/" />
                <link rel="canonical" href="https://joinhook.cl/" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'JoinHook',
                    url: 'https://joinhook.cl/',
                    description: 'Acompañamiento y diseño de soluciones para negocios y proyectos vinculados con turismo, hospitalidad, gastronomía, ecoturismo y territorio.',
                    founder: { '@type': 'Person', name: 'Francisco Javier Campos' }
                }) }} />
            </Head>

            <main className="jh-site jh-web-v1">
                <header className="jh-header jh-v1-header">
                    <a className="jh-brand" href="#inicio" aria-label="JoinHook, volver al inicio">
                        <span className="jh-brand-mark" aria-hidden="true">JH</span>
                        <span>JoinHook</span>
                    </a>
                    <nav className="jh-nav" aria-label="Navegación principal">
                        <a href="#que-hacemos">Qué hacemos</a>
                        <a href="#metodo">Cómo trabajamos</a>
                        <a href="#proyectos">Proyectos</a>
                        <Link href="/info">Sobre mí</Link>
                        <a href="#contacto">Contacto</a>
                    </nav>
                    <a className="jh-header-cta" href="mailto:info@joinhook.cl?subject=Conversación%20JoinHook">Conversemos</a>
                </header>

                <section className="jh-v1-hero" id="inicio">
                    <div className="jh-v1-hero-copy">
                        <span className="jh-v1-kicker"><i /> Turismo · Hospitalidad · Gastronomía · Territorio</span>
                        <h1>
                            Antes de buscar una herramienta,
                            <em>entendamos lo que necesitas resolver.</em>
                        </h1>
                        <p>
                            JoinHook acompaña negocios y proyectos para diagnosticar, ordenar, diseñar y poner en marcha soluciones útiles. Cuando la tecnología ayuda, la incorporamos; cuando no, buscamos otra forma.
                        </p>
                        <div className="jh-actions">
                            <a className="jh-button jh-button-primary" href="#contacto">Cuéntame tu desafío <ArrowIcon /></a>
                            <a className="jh-button jh-button-soft" href="#que-hacemos">Conoce JoinHook</a>
                        </div>
                        <div className="jh-v1-proof-row">
                            <span>Escucha activa</span><b />
                            <span>Orden y trazabilidad</span><b />
                            <span>Soluciones por etapas</span>
                        </div>
                    </div>

                    <div className="jh-v1-hero-visual" aria-label="Esquema del acompañamiento JoinHook">
                        <div className="jh-v1-orbit jh-v1-orbit-one" />
                        <div className="jh-v1-orbit jh-v1-orbit-two" />
                        <div className="jh-v1-terrain" aria-hidden="true">
                            <span /><span /><span /><span /><span />
                        </div>
                        <div className="jh-v1-bridge jh-surface">
                            <small>JOINHOOK / ACOMPAÑAMIENTO</small>
                            <div className="jh-v1-bridge-grid">
                                <article><span>01</span><strong>Escuchamos</strong><p>Contexto, personas, clientes y objetivos.</p></article>
                                <article><span>02</span><strong>Observamos</strong><p>Procesos, datos, fricciones y oportunidades.</p></article>
                                <article><span>03</span><strong>Ordenamos</strong><p>Prioridades, decisiones y próximos pasos.</p></article>
                                <article><span>04</span><strong>Impulsamos</strong><p>Implementación, aprendizaje y mejora.</p></article>
                            </div>
                            <div className="jh-v1-bridge-foot"><span>Una solución no empieza por el software.</span><b>Empieza por la necesidad.</b></div>
                        </div>
                    </div>
                </section>

                <section className="jh-v1-intro" id="que-hacemos">
                    <div>
                        <span className="jh-eyebrow">Qué hacemos</span>
                        <h2>Conectamos la mirada del negocio con soluciones que puedan sostenerse en la práctica.</h2>
                    </div>
                    <p>
                        Trabajamos principalmente con emprendimientos, empresas y proyectos de turismo, hospitalidad, gastronomía, ecoturismo y territorio. El punto de partida puede ser un problema de organización, una nueva experiencia para clientes, una oportunidad comercial o una necesidad de digitalización.
                    </p>
                </section>

                <section className="jh-v1-service-grid">
                    {services.map((service) => (
                        <article className="jh-v1-service jh-surface" key={service.number}>
                            <span className="jh-v1-service-number">{service.number}</span>
                            <h3>{service.title}</h3>
                            <p>{service.text}</p>
                            <span className="jh-v1-service-link" aria-hidden="true"><ArrowIcon /></span>
                        </article>
                    ))}
                </section>

                <section className="jh-v1-method" id="metodo" aria-labelledby="method-title">
                    <div className="jh-v1-method-intro">
                        <span className="jh-eyebrow">Cómo trabajamos</span>
                        <h2 id="method-title">Escuchamos → Observamos → Ordenamos → Diseñamos → Conectamos → Impulsamos.</h2>
                        <p>No imponemos una metodología por moda. Ajustamos la forma de trabajar al tamaño del proyecto, las personas involucradas, la temporada, los recursos disponibles y el contexto local.</p>
                    </div>
                    <div className="jh-v1-method-steps" aria-label="Método JoinHook">
                        {['Escuchamos', 'Observamos', 'Ordenamos', 'Diseñamos', 'Conectamos', 'Impulsamos'].map((step, index) => (
                            <div key={step} className="jh-v1-method-step">
                                <span>{String(index + 1).padStart(2, '0')}</span>
                                <strong>{step}</strong>
                                {index < 5 && <i>→</i>}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="jh-v1-territory jh-surface">
                    <div>
                        <span className="jh-eyebrow">Negocio + territorio</span>
                        <h2>Las soluciones tienen que conversar con el lugar donde viven.</h2>
                    </div>
                    <p>
                        La estacionalidad turística, las economías locales, las comunidades, los proveedores, los ritmos de trabajo y las capacidades disponibles importan. JoinHook busca construir puentes entre esas realidades y las decisiones de gestión o desarrollo.
                    </p>
                    <div className="jh-v1-principles">
                        {principles.map((principle) => <span key={principle}><i>✓</i>{principle}</span>)}
                    </div>
                </section>

                <section className="jh-v1-projects" id="proyectos" aria-labelledby="projects-title">
                    <div className="jh-section-heading">
                        <div><span className="jh-eyebrow">Proyectos</span><h2 id="projects-title">Cuando una necesidad se convierte en algo que vale la pena construir.</h2></div>
                        <p>Algunos trabajos se transforman en productos propios. Otros quedan como diseño, acompañamiento o experimentación. Cada estado se comunica tal como es.</p>
                    </div>
                    <div className="jh-v1-project-grid">
                        {projects.map((project) => (
                            <article className="jh-v1-project jh-surface" key={project.name}>
                                <div className="jh-v1-project-image">
                                    <img src={project.cover} alt={`Vista conceptual de ${project.name}`} loading="lazy" decoding="async" />
                                </div>
                                <div className="jh-v1-project-body">
                                    <div className="jh-v1-project-meta"><span>{project.category}</span><b>{project.state}</b></div>
                                    <h3>{project.name}</h3>
                                    <p>{project.description}</p>
                                    {project.href.startsWith('http') ? (
                                        <a href={project.href} target="_blank" rel="noreferrer" className="jh-v1-text-link">Ver proyecto <ArrowIcon /></a>
                                    ) : (
                                        <a href={project.href} className="jh-v1-text-link">Conversar sobre una idea <ArrowIcon /></a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="jh-v1-tool jh-surface" aria-labelledby="tool-title">
                    <div className="jh-v1-tool-copy">
                        <span className="jh-eyebrow">Herramienta en uso · Beta</span>
                        <h2 id="tool-title">Estado de Gastos Operacionales</h2>
                        <p>Una herramienta para pequeños negocios gastronómicos que necesitan empezar a ordenar inventario, compras, mermas y proveedores sin comenzar por un ERP completo.</p>
                        <div className="jh-actions"><Link className="jh-button jh-button-primary" href="/herramientas/estado-gastos-operacionales">Conocer la herramienta <ArrowIcon /></Link></div>
                    </div>
                    <div className="jh-v1-tool-note"><span>Producto propio</span><strong>La herramienta nace de una necesidad operativa concreta.</strong><small>Disponible en etapa beta · alcance comunicado de forma transparente.</small></div>
                </section>

                <section className="jh-v1-about" id="sobre-mi" aria-labelledby="about-title">
                    <div className="jh-v1-about-portrait jh-surface"><span>JH</span><small>JoinHook · desde territorio</small></div>
                    <div className="jh-v1-about-copy">
                        <span className="jh-eyebrow">Sobre mí</span>
                        <h2 id="about-title">Experiencia de operación, administración y tecnología puesta al servicio de problemas reales.</h2>
                        <p>JoinHook es una iniciativa independiente de Francisco Javier Campos. La experiencia en servicios, hospitalidad, administración y desarrollo se cruza aquí para trabajar desde una perspectiva práctica: entender la operación, conversar con quienes participan y construir solo lo que tiene sentido.</p>
                        <Link className="jh-v1-text-link" href="/info">Conocer más <ArrowIcon /></Link>
                    </div>
                </section>

                <section className="jh-v1-notes jh-surface" aria-labelledby="notes-title">
                    <div><span className="jh-eyebrow">Notas</span><h2 id="notes-title">Aprendizajes que quedan disponibles para otros.</h2></div>
                    <p>El blog de JoinHook reunirá observaciones y aprendizajes sobre gestión, turismo, hospitalidad, diseño de servicios, automatización, producto y tecnología aplicada a contextos reales.</p>
                    <Link className="jh-button jh-button-soft" href="/blog">Ver notas</Link>
                </section>

                <section className="jh-v1-contact" id="contacto" aria-labelledby="contact-title">
                    <div>
                        <span className="jh-eyebrow">Contacto</span>
                        <h2 id="contact-title">Cuéntame qué está pasando antes de decidir qué construir.</h2>
                    </div>
                    <div className="jh-v1-contact-side">
                        <p>Una conversación inicial puede servir para delimitar el problema, identificar prioridades y saber si JoinHook es el apoyo adecuado.</p>
                        <a className="jh-button jh-button-primary" href="mailto:info@joinhook.cl?subject=Quiero%20conversar%20con%20JoinHook">Escribir a JoinHook <ArrowIcon /></a>
                    </div>
                </section>

                <footer className="jh-footer jh-v1-footer">
                    <a className="jh-brand" href="#inicio"><span className="jh-brand-mark">JH</span><span>JoinHook</span></a>
                    <p>Acompañamos ideas, negocios y proyectos a avanzar con sentido.</p>
                    <div><a href="/privacidad">Privacidad</a><span>·</span><a href="/condiciones-beta">Condiciones beta</a><span>·</span><a href="https://github.com/fjcamp" target="_blank" rel="noreferrer">GitHub</a></div>
                </footer>
            </main>
        </>
    );
}
