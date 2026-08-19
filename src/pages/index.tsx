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
        title: 'Web y PWA',
        text: 'Experiencias rápidas, responsive y pensadas para crecer sin empezar de cero cada vez.'
    },
    {
        index: '02',
        title: 'Sistemas de gestión',
        text: 'Interfaces y flujos que transforman procesos desordenados en herramientas más entendibles.'
    },
    {
        index: '03',
        title: 'Automatización',
        text: 'Exploro cómo conectar tareas, datos e IA para reducir trabajo repetitivo sin perder control humano.'
    },
    {
        index: '04',
        title: 'Diseño de producto',
        text: 'Prototipo, pruebo y refino experiencias digitales combinando utilidad, estética y contexto real.'
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
                    content="Soy Francisco, creador independiente detrás de JoinHook. Diseño, investigo y construyo productos digitales, sistemas de gestión, PWA y experimentos de interfaz."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#07111f" />
                <link rel="canonical" href="https://joinhook.cl/" />
                <meta property="og:title" content="JoinHook — ideas, productos y experiencias digitales" />
                <meta
                    property="og:description"
                    content="Un espacio independiente para construir, probar y compartir ideas digitales con visión práctica y creativa."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://joinhook.cl/" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Person',
                            name: 'Francisco Javier Campos',
                            url: 'https://joinhook.cl/',
                            description:
                                'Creador independiente detrás de JoinHook. Diseño y desarrollo de productos digitales, sistemas de gestión y experiencias web.'
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
                        <a href="#lab">Lab</a>
                        <a href="#sobre-mi">Sobre mí</a>
                    </nav>
                    <a className="jh-header-cta" href="#contacto">Conversemos</a>
                </header>

                <section className="jh-hero" id="inicio">
                    <div className="jh-hero-copy">
                        <div className="jh-kicker"><span className="jh-status-dot" /> Creador independiente · Chile</div>
                        <h1>
                            Ideas digitales con <span>criterio, movimiento y propósito.</span>
                        </h1>
                        <p className="jh-hero-lead">
                            Hola, soy Francisco. JoinHook es mi espacio para investigar, diseñar y construir productos digitales que intentan resolver problemas reales de una forma más clara y humana.
                        </p>
                        <div className="jh-actions">
                            <a className="jh-button jh-button-primary" href="#proyectos">
                                Explorar lo que construyo <ArrowIcon />
                            </a>
                            <a className="jh-button jh-button-soft" href="#sobre-mi">Conocer mi enfoque</a>
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

                        <div className="jh-project-deck" role="list" aria-label="Proyectos JoinHook">
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
                                        role="listitem"
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
                            <span className="jh-eyebrow">Primera herramienta comercial</span>
                            <h2 id="product-title">Control Gastronómico Express</h2>
                            <p>
                                Estoy preparando una herramienta simple para pequeños negocios gastronómicos: inventario, compras, mermas, proveedores y un dashboard entendible, sin transformar cada tarea en otro software complejo.
                            </p>
                            <div className="jh-tags">
                                <span>Inventario</span><span>Mermas</span><span>Compras</span><span>Dashboard</span>
                            </div>
                            <div className="jh-actions">
                                <a className="jh-button jh-button-primary" href="#contacto">Quiero conocer el MVP <ArrowIcon /></a>
                                <span className="jh-product-status"><i /> En preparación</span>
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
                    <h2 id="contact-title">Si tienes un problema interesante, una idea o simplemente curiosidad, hablemos.</h2>
                    <p>La siguiente etapa integrará el canal de contacto definitivo y las herramientas comerciales. Primero quiero que la experiencia y el mensaje sean correctos.</p>
                    <a className="jh-button jh-button-primary" href="https://github.com/fjcamp" target="_blank" rel="noreferrer">
                        Ver mi GitHub <ArrowIcon />
                    </a>
                </section>

                <footer className="jh-footer">
                    <a className="jh-brand" href="#inicio"><span className="jh-brand-mark">JH</span><span>JoinHook</span></a>
                    <p>Un espacio independiente para diseñar, construir y aprender.</p>
                    <span>© {new Date().getFullYear()} Francisco Javier Campos</span>
                </footer>
            </main>
        </>
    );
}
