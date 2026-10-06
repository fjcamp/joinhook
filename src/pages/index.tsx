import Head from 'next/head';
import { CSSProperties, useMemo, useState } from 'react';

const projects = [
    {
        key: 'joinops',
        name: 'JoinOps',
        stage: 'MVP en desarrollo',
        eyebrow: 'Operaciones · Gestión · Gastronomía',
        description:
            'Un sistema modular que estoy construyendo para ordenar inventario, producción, personas y operación diaria sin perder trazabilidad.',
        tags: ['Inventario', 'Operaciones', 'RR.HH.', 'PWA'],
        metric: 'Arquitectura modular',
        accent: '#6e7cff',
        glow: 'rgba(110, 124, 255, .36)'
    },
    {
        key: 'snowwise',
        name: 'SnowWise',
        stage: 'Prototipo activo',
        eyebrow: 'Montaña · Seguridad · Clima',
        description:
            'Una experiencia para planificar actividades de nieve y montaña combinando clima, mapas, seguridad, destinos y contexto útil en un solo lugar.',
        tags: ['Weather', 'GPS', 'Maps', 'Safety'],
        metric: 'Diseño inmersivo',
        accent: '#32d7e8',
        glow: 'rgba(50, 215, 232, .28)'
    },
    {
        key: 'mi-gestion',
        name: 'Mi Gestión',
        stage: 'Explorando y probando',
        eyebrow: 'Organización · Datos · Decisiones',
        description:
            'Mi espacio experimental para convertir tareas, documentos, indicadores y seguimiento cotidiano en una experiencia administrativa más clara.',
        tags: ['Dashboard', 'Procesos', 'Datos', 'Offline'],
        metric: 'Gestión práctica',
        accent: '#58e2a3',
        glow: 'rgba(88, 226, 163, .24)'
    }
];

const capabilities = [
    {
        index: '01',
        title: 'Diagnóstico y análisis',
        text: 'Convierto problemas operativos en diagnósticos, indicadores y decisiones más claras antes de recomendar tecnología.'
    },
    {
        index: '02',
        title: 'Web y PWA',
        text: 'Construyo experiencias rápidas, responsive y pensadas para validar una idea sin empezar por una plataforma enorme.'
    },
    {
        index: '03',
        title: 'Herramientas digitales',
        text: 'Diseño utilidades concretas para turismo, hospitalidad y gastronomía, priorizando simplicidad y trazabilidad.'
    },
    {
        index: '04',
        title: 'Automatización con criterio',
        text: 'Exploro datos, automatización e IA como apoyo al trabajo humano, con límites, evidencia y control.'
    }
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Home() {
    const [activeProject, setActiveProject] = useState(1);
    const project = projects[activeProject];

    const projectStyle = useMemo(
        () =>
            ({
                '--project-accent': project.accent,
                '--project-glow': project.glow
            }) as CSSProperties,
        [project]
    );

    const moveProject = (direction: number) => {
        setActiveProject((current) => (current + direction + projects.length) % projects.length);
    };

    return (
        <>
            <Head>
                <title>JoinHook — ideas, productos y experiencias digitales</title>
                <meta
                    name="description"
                    content="JoinHook investiga, diagnostica y construye herramientas y experiencias digitales para turismo, hospitalidad y gastronomía, con enfoque práctico y basado en evidencia."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#f3f0e8" />
                <link rel="canonical" href="https://joinhook.cl/" />
                <meta property="og:title" content="JoinHook — diagnóstico, herramientas y productos digitales" />
                <meta
                    property="og:description"
                    content="Investigación, diagnóstico y herramientas digitales para problemas reales en turismo, hospitalidad y gastronomía."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://joinhook.cl/" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@graph': [
                                {
                                    '@type': 'WebSite',
                                    name: 'JoinHook',
                                    url: 'https://joinhook.cl/',
                                    description:
                                        'Investigación, diagnóstico y herramientas digitales para turismo, hospitalidad y gastronomía.'
                                },
                                {
                                    '@type': 'Person',
                                    name: 'Francisco Javier Campos',
                                    url: 'https://joinhook.cl/',
                                    description:
                                        'Creador independiente detrás de JoinHook. Investigación, diagnóstico y construcción de productos digitales.'
                                }
                            ]
                        })
                    }}
                />
            </Head>

            <main className="jh-site">
                <header className="jh-header">
                    <a className="jh-brand" href="#inicio" aria-label="JoinHook, volver al inicio">
                        <span className="jh-brand-mark" aria-hidden="true">JH</span>
                        <span>JoinHook</span>
                    </a>
                    <nav className="jh-nav" aria-label="Navegación principal">
                        <a href="#proyectos">Proyectos</a>
                        <a href="#herramientas">Herramientas</a>
                        <a href="#insights">Insights</a>
                        <a href="#lab">Lab</a>
                        <a href="#sobre-mi">Sobre mí</a>
                    </nav>
                    <a className="jh-header-cta" href="mailto:info@joinhook.cl?subject=Conversemos%20sobre%20un%20proyecto">Conversemos</a>
                </header>

                <section className="jh-hero" id="inicio">
                    <div className="jh-hero-copy">
                        <div className="jh-kicker"><span className="jh-status-dot" /> Creador independiente · Chile</div>
                        <h1>
                            Investigar primero. <span>Diagnosticar, construir y mejorar.</span>
                        </h1>
                        <p className="jh-hero-lead">
                            Hola, soy Francisco. JoinHook es un proyecto independiente para convertir problemas reales en diagnósticos, herramientas y experiencias digitales útiles, especialmente en turismo, hospitalidad y gastronomía.
                        </p>
                        <div className="jh-actions">
                            <a className="jh-button jh-button-primary" href="#proyectos">
                                Explorar lo que construyo <ArrowIcon />
                            </a>
                            <a className="jh-button jh-button-soft" href="#herramientas">Ver herramienta disponible</a>
                        </div>
                        <div className="jh-hero-footnotes" aria-label="Principios de trabajo">
                            <span>Aprender haciendo</span>
                            <span>Diseñar con intención</span>
                            <span>Construir de forma abierta</span>
                        </div>
                    </div>

                    <div className="jh-hero-visual" aria-label="Vista conceptual de proyectos JoinHook">
                        <div className="jh-orbit jh-orbit-one" />
                        <div className="jh-orbit jh-orbit-two" />
                        <div className="jh-workspace jh-surface">
                            <div className="jh-workspace-bar">
                                <div><span /><span /><span /></div>
                                <small>joinhook / workspace</small>
                                <span className="jh-live">LIVE</span>
                            </div>
                            <div className="jh-workspace-grid">
                                <article className="jh-mini-card jh-mini-main">
                                    <div className="jh-mini-label">Ahora mismo</div>
                                    <h3>Construyendo ideas en público</h3>
                                    <p>Producto, experiencia, código y aprendizaje en el mismo proceso.</p>
                                    <div className="jh-mini-chart" aria-hidden="true">
                                        <i /><i /><i /><i /><i /><i />
                                    </div>
                                </article>
                                <article className="jh-mini-card">
                                    <span className="jh-chip jh-chip-blue">JoinOps</span>
                                    <strong>Sistema</strong>
                                    <small>Operaciones y gestión</small>
                                </article>
                                <article className="jh-mini-card">
                                    <span className="jh-chip jh-chip-cyan">SnowWise</span>
                                    <strong>Experiencia</strong>
                                    <small>Montaña y seguridad</small>
                                </article>
                                <article className="jh-mini-card jh-mini-wide">
                                    <div>
                                        <span className="jh-mini-label">Laboratorio</span>
                                        <strong>Soft UI + interacción</strong>
                                    </div>
                                    <div className="jh-toggle-demo" aria-hidden="true"><span /></div>
                                </article>
                            </div>
                        </div>
                        <div className="jh-floating-note jh-surface">
                            <span>✦</span>
                            <div><small>En exploración</small><strong>Interfaces que se sienten vivas</strong></div>
                        </div>
                    </div>
                </section>

                <section className="jh-section jh-capabilities" aria-labelledby="capabilities-title">
                    <div className="jh-section-heading">
                        <div>
                            <span className="jh-eyebrow">Qué hago</span>
                            <h2 id="capabilities-title">Construyo mientras aprendo, pruebo y mejoro.</h2>
                        </div>
                        <p>No intento parecer una agencia enorme. Prefiero mostrar el proceso, las decisiones y el resultado.</p>
                    </div>
                    <div className="jh-capability-grid">
                        {capabilities.map((item) => (
                            <article className="jh-capability jh-surface" key={item.index}>
                                <span>{item.index}</span>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                                <i aria-hidden="true"><ArrowIcon /></i>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="jh-projects" id="proyectos" style={projectStyle} aria-labelledby="projects-title">
                    <div className="jh-project-glow" aria-hidden="true" />
                    <div className="jh-project-stage">
                        <div className="jh-project-copy" aria-live="polite">
                            <span className="jh-eyebrow">En qué estoy trabajando · {String(activeProject + 1).padStart(2, '0')}</span>
                            <h2 id="projects-title">{project.name}</h2>
                            <div className="jh-project-stage-label"><span /> {project.stage}</div>
                            <p className="jh-project-eyebrow">{project.eyebrow}</p>
                            <p className="jh-project-description">{project.description}</p>
                            <div className="jh-tags">
                                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                            </div>
                            <div className="jh-project-meta">
                                <div><small>Enfoque</small><strong>{project.metric}</strong></div>
                                <div><small>Estado</small><strong>{project.stage}</strong></div>
                            </div>
                            <div className="jh-project-controls">
                                <button type="button" onClick={() => moveProject(-1)} aria-label="Proyecto anterior">←</button>
                                <span>{activeProject + 1} / {projects.length}</span>
                                <button type="button" onClick={() => moveProject(1)} aria-label="Proyecto siguiente">→</button>
                            </div>
                        </div>

                        <div className="jh-project-deck" aria-label="Proyectos JoinHook">
                            {projects.map((item, index) => {
                                const offset = index - activeProject;
                                return (
                                    <button
                                        type="button"
                                        className={`jh-project-card jh-surface ${index === activeProject ? 'is-active' : ''}`}
                                        key={item.key}
                                        onClick={() => setActiveProject(index)}
                                        style={{ '--card-offset': offset } as CSSProperties}
                                        aria-pressed={index === activeProject}
                                    >
                                        <div className="jh-project-card-top">
                                            <span>{item.name}</span>
                                            <small>{String(index + 1).padStart(2, '0')}</small>
                                        </div>
                                        <div className={`jh-project-visual jh-project-visual-${item.key}`}>
                                            <div className="jh-project-screen">
                                                <i /><i /><i />
                                                <div className="jh-screen-line" />
                                                <div className="jh-screen-line short" />
                                                <div className="jh-screen-chart"><span /><span /><span /><span /></div>
                                            </div>
                                        </div>
                                        <div className="jh-project-card-bottom">
                                            <small>{item.stage}</small>
                                            <span>Explorar</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="jh-section jh-product" id="herramientas" aria-labelledby="product-title">
                    <div className="jh-product-panel jh-surface">
                        <div className="jh-product-copy">
                            <span className="jh-eyebrow">Primera herramienta comercial · beta disponible</span>
                            <h2 id="product-title">Control Gastronómico Express</h2>
                            <p>
                                Ya puedes probar una primera versión funcional para pequeños negocios gastronómicos: inventario, compras, mermas, proveedores, stock mínimo, respaldo y PWA, sin partir por un ERP completo.
                            </p>
                            <div className="jh-tags">
                                <span>Inventario</span><span>Mermas</span><span>Compras</span><span>Dashboard</span><span>PWA</span>
                            </div>
                            <div className="jh-actions">
                                <a className="jh-button jh-button-primary" href="/herramientas/control-gastronomico-express">Conocer y probar <ArrowIcon /></a>
                                <span className="jh-product-status"><i /> Beta · $4.990 CLP lanzamiento</span>
                            </div>
                        </div>
                        <div className="jh-product-dashboard">
                            <div className="jh-product-kpis">
                                <article><small>Stock crítico</small><strong>06</strong><span>requieren atención</span></article>
                                <article><small>Merma estimada</small><strong>2,4%</strong><span>del período</span></article>
                                <article><small>Compras</small><strong>$248k</strong><span>vista demo</span></article>
                            </div>
                            <div className="jh-product-graph">
                                <div className="jh-graph-head"><span>Movimiento de inventario</span><small>Vista conceptual</small></div>
                                <div className="jh-bars" aria-hidden="true">
                                    {[42, 68, 51, 84, 62, 93, 71, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="jh-section" id="insights" aria-labelledby="insights-title">
                    <div className="jh-section-heading">
                        <div>
                            <span className="jh-eyebrow">JoinHook Insights</span>
                            <h2 id="insights-title">Investigación que se convierte en decisiones, herramientas y oportunidades.</h2>
                        </div>
                        <p>
                            Datos públicos, análisis y aprendizajes de construcción explicados de forma clara. Una investigación importante no termina en un documento: también debe ser útil para quien la lee.
                        </p>
                    </div>
                    <div className="jh-capability-grid">
                        <article className="jh-capability jh-surface">
                            <span>01</span>
                            <h3>Economía gastronómica</h3>
                            <p>Food Cost, Labor Cost, Prime Cost, margen, delivery y punto de equilibrio para entender dónde se mueve realmente el resultado.</p>
                            <a href="/insights/restaurantes-prime-cost" aria-label="Leer Insight sobre Prime Cost">Leer insight <ArrowIcon /></a>
                        </article>
                        <article className="jh-capability jh-surface">
                            <span>02</span>
                            <h3>Hotelería y territorio</h3>
                            <p>Ocupación, ADR, RevPAR y actividad turística de Chile y La Araucanía, usando fuentes oficiales y contexto regional.</p>
                            <a href="/insights/araucania-hotel-performance" aria-label="Leer Insight sobre rendimiento hotelero">Leer insight <ArrowIcon /></a>
                        </article>
                        <article className="jh-capability jh-surface">
                            <span>03</span>
                            <h3>Planificación de viajes</h3>
                            <p>Presupuestos, componentes del gasto y futuras utilities para viajeros de Chile y Latinoamérica.</p>
                            <a href="/insights/presupuesto-viaje" aria-label="Leer Insight sobre presupuesto de viaje">Leer insight <ArrowIcon /></a>
                        </article>
                    </div>
                    <div className="jh-actions">
                        <a className="jh-button jh-button-soft" href="/insights">Ver todos los Insights <ArrowIcon /></a>
                    </div>
                </section>

                <section className="jh-section jh-lab" id="lab" aria-labelledby="lab-title">
                    <div className="jh-section-heading">
                        <div><span className="jh-eyebrow">JoinHook Lab</span><h2 id="lab-title">La web también será parte del portafolio.</h2></div>
                        <p>Quiero que los componentes demuestren lo que puedo construir: tactilidad, profundidad, estados, interacción y movimiento sin sacrificar claridad.</p>
                    </div>
                    <div className="jh-lab-grid">
                        <article className="jh-lab-card jh-surface">
                            <small>Soft control</small>
                            <div className="jh-demo-buttons"><button>Acción</button><button className="pressed">Activo</button></div>
                            <p>Relieve suave para acciones concretas, no como decoración indiscriminada.</p>
                        </article>
                        <article className="jh-lab-card jh-surface">
                            <small>Estados</small>
                            <div className="jh-demo-status"><span className="green">Disponible</span><span className="blue">Beta</span><span className="amber">En desarrollo</span></div>
                            <p>Los proyectos pueden ser ambiciosos sin fingir estar terminados.</p>
                        </article>
                        <article className="jh-lab-card jh-surface">
                            <small>Datos</small>
                            <div className="jh-demo-ring"><span>72%</span></div>
                            <p>Visualización compacta y legible, pensada para interfaces reales.</p>
                        </article>
                    </div>
                </section>

                <section className="jh-section jh-about" id="sobre-mi" aria-labelledby="about-title">
                    <div className="jh-about-quote jh-surface">
                        <span>“</span>
                        <p>No quiero construir una fachada de gran compañía. Quiero construir cosas buenas, aprender rápido y dejar que el trabajo hable.</p>
                    </div>
                    <div className="jh-about-copy">
                        <span className="jh-eyebrow">Detrás de JoinHook</span>
                        <h2 id="about-title">Una persona, varias disciplinas y una visión que todavía está creciendo.</h2>
                        <p>
                            Me interesa la intersección entre administración, tecnología, turismo, diseño y automatización. JoinHook es el lugar donde esas áreas pueden cruzarse, convertirse en prototipos y, cuando tienen sentido, crecer hasta convertirse en productos.
                        </p>
                        <div className="jh-process">
                            <span>Investigar</span><i>→</i><span>Entender</span><i>→</i><span>Probar</span><i>→</i><span>Construir</span><i>→</i><span>Mejorar</span>
                        </div>
                    </div>
                </section>

                <section className="jh-contact" id="contacto" aria-labelledby="contact-title">
                    <span className="jh-eyebrow">Conversemos</span>
                    <h2 id="contact-title">Si tienes un problema, una idea o quieres probar una herramienta, escríbeme.</h2>
                    <p>Trabajo de forma independiente y prefiero entender primero el problema. Puedes contarme tu proyecto, pedirme información sobre Control Gastronómico Express o simplemente iniciar una conversación.</p>
                    <div className="jh-actions">
                        <a className="jh-button jh-button-primary" href="mailto:info@joinhook.cl?subject=Conversemos%20desde%20JoinHook">Escribirme <ArrowIcon /></a>
                        <a className="jh-button jh-button-soft" href="https://github.com/fjcamp" target="_blank" rel="noreferrer">Ver mi GitHub</a>
                    </div>
                </section>

                <footer className="jh-footer">
                    <a className="jh-brand" href="#inicio"><span className="jh-brand-mark">JH</span><span>JoinHook</span></a>
                    <p>Investigación, diagnóstico, herramientas y construcción digital con criterio.</p>
                    <span>© {new Date().getFullYear()} Francisco Javier Campos · <a href="/insights">Insights</a> · <a href="/privacidad">Privacidad</a></span>
                </footer>
            </main>
        </>
    );
}
