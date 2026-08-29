import Head from 'next/head';
import { CSSProperties, useMemo, useState } from 'react';

const projects = [
    {
        key: 'joinops',
        name: 'JoinOps',
        stage: 'EN DESARROLLO',
        eyebrow: 'Operaciones · Gestión · Gastronomía',
        description:
            'ERP operacional modular para ordenar inventario, producción, personas, compras y operación diaria con trazabilidad y una arquitectura preparada para crecer por etapas.',
        tags: ['Inventario', 'Operaciones', 'RR.HH.', 'PWA'],
        metric: 'Arquitectura modular',
        accent: '#6e7cff',
        glow: 'rgba(110, 124, 255, .36)',
        cover: '/project-covers/joinops-cover.svg',
        coverLabel: 'Vista de inicio · operaciones y gestión'
    },
    {
        key: 'snowwise',
        name: 'SnowWise',
        stage: 'EN CONSTRUCCIÓN',
        eyebrow: 'Montaña · Seguridad · Clima',
        description:
            'Plataforma para planificar actividades de nieve y montaña combinando meteorología, mapas, destinos, seguridad, equipamiento y contexto útil en una sola experiencia.',
        tags: ['Weather', 'GPS', 'Maps', 'Safety'],
        metric: 'Producto insignia',
        accent: '#32d7e8',
        glow: 'rgba(50, 215, 232, .28)',
        cover: '/project-covers/snowwise-cover.svg',
        coverLabel: 'Vista de inicio · montaña, clima y seguridad'
    },
    {
        key: 'mi-gestion',
        name: 'Mi Gestión',
        stage: 'EXPERIMENTAL',
        eyebrow: 'Organización · Datos · Decisiones',
        description:
            'Herramienta administrativa para reunir tareas, agenda, operaciones, equipo, proveedores, documentos, indicadores y seguimiento cotidiano en un solo espacio.',
        tags: ['Dashboard', 'Procesos', 'Datos', 'Offline'],
        metric: 'Gestión práctica',
        accent: '#58e2a3',
        glow: 'rgba(88, 226, 163, .24)',
        cover: '/project-covers/mi-gestion-cover.svg',
        coverLabel: 'Vista de inicio · agenda, tareas e indicadores'
    }
];

const capabilities = [
    {
        index: '01',
        title: 'Desarrollo Web & PWA',
        text: 'Sitios, aplicaciones web y experiencias instalables, responsive y preparadas para evolucionar sin rehacer todo desde cero.'
    },
    {
        index: '02',
        title: 'Sistemas & Automatización',
        text: 'Flujos, paneles y automatizaciones que ayudan a ordenar procesos, conectar información y reducir trabajo repetitivo manteniendo control humano.'
    },
    {
        index: '03',
        title: 'UX/UI & Diseño',
        text: 'Interfaces claras, accesibles y coherentes, diseñadas para que la tecnología sea útil antes que decorativa.'
    },
    {
        index: '04',
        title: 'Ideas & Prototipos',
        text: 'Investigación, validación y prototipado para convertir una necesidad real en una solución que se pueda probar, medir y mejorar.'
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
                <title>JoinHook — Ideas reales, productos digitales</title>
                <meta
                    name="description"
                    content="Diseño, investigo y construyo soluciones digitales que convierten problemas reales en herramientas útiles. Desarrollo web y PWA, sistemas, automatización, UX/UI y prototipos."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#f3f0e8" />
                <link rel="canonical" href="https://joinhook.cl/" />
                <meta property="og:title" content="JoinHook — Ideas reales, productos digitales" />
                <meta
                    property="og:description"
                    content="Soluciones digitales que convierten problemas reales en herramientas útiles. Proyectos, productos y servicios construidos con criterio, transparencia y visión de futuro."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://joinhook.cl/" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebSite',
                            name: 'JoinHook',
                            url: 'https://joinhook.cl/',
                            description:
                                'Espacio de Francisco Javier Campos para investigar, diseñar y construir productos digitales, sistemas de gestión, aplicaciones web y PWA.',
                            author: {
                                '@type': 'Person',
                                name: 'Francisco Javier Campos'
                            }
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
                        <a href="#inicio">Inicio</a>
                        <a href="#proyectos">Proyectos</a>
                        <a href="#herramientas">Herramientas</a>
                        <a href="#lab">Lab</a>
                        <a href="#blog">Blog</a>
                        <a href="#contacto">Contacto</a>
                    </nav>
                    <a className="jh-header-cta" href="mailto:info@joinhook.cl?subject=Hablemos%20sobre%20un%20proyecto">Hablemos</a>
                </header>

                <section className="jh-hero" id="inicio">
                    <div className="jh-hero-copy">
                        <div className="jh-kicker"><span className="jh-status-dot" /> Hola, soy Francisco</div>
                        <h1>
                            Ideas reales, <span>productos digitales.</span>
                        </h1>
                        <p className="jh-hero-lead">
                            Diseño, investigo y construyo soluciones digitales que convierten problemas reales en herramientas útiles. JoinHook es mi espacio para explorar, crear y compartir proyectos con visión de futuro.
                        </p>
                        <div className="jh-actions">
                            <a className="jh-button jh-button-primary" href="#proyectos">
                                Explorar proyectos <ArrowIcon />
                            </a>
                            <a className="jh-button jh-button-soft" href="#contacto">Conversemos</a>
                        </div>
                        <div className="jh-hero-footnotes" aria-label="Áreas de trabajo">
                            <span>Desarrollo Web & PWA</span>
                            <span>Sistemas & Automatización</span>
                            <span>UX/UI & Diseño</span>
                            <span>Ideas & Prototipos</span>
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
                                    <div className="jh-mini-label">JoinHook</div>
                                    <h3>Grandes proyectos comienzan con una buena idea.</h3>
                                    <p>Investigar, diseñar, construir, operar y mejorar con evidencia y trazabilidad.</p>
                                    <div className="jh-mini-chart" aria-hidden="true">
                                        <i /><i /><i /><i /><i /><i />
                                    </div>
                                </article>
                                <article className="jh-mini-card">
                                    <span className="jh-chip jh-chip-blue">JoinOps</span>
                                    <strong>EN DESARROLLO</strong>
                                    <small>Operaciones y gestión</small>
                                </article>
                                <article className="jh-mini-card">
                                    <span className="jh-chip jh-chip-cyan">SnowWise</span>
                                    <strong>EN CONSTRUCCIÓN</strong>
                                    <small>Montaña, clima y seguridad</small>
                                </article>
                                <article className="jh-mini-card jh-mini-wide">
                                    <div>
                                        <span className="jh-mini-label">JoinHook Lab</span>
                                        <strong>Explorando nuevas ideas y tecnologías</strong>
                                    </div>
                                    <div className="jh-toggle-demo" aria-hidden="true"><span /></div>
                                </article>
                            </div>
                        </div>
                        <div className="jh-floating-note jh-surface">
                            <span>✦</span>
                            <div><small>En construcción</small><strong>Producto, diseño, sistemas y automatización</strong></div>
                        </div>
                    </div>
                </section>

                <section className="jh-section jh-capabilities" aria-labelledby="capabilities-title">
                    <div className="jh-section-heading">
                        <div>
                            <span className="jh-eyebrow">Qué hago</span>
                            <h2 id="capabilities-title">De una necesidad real a una solución digital útil.</h2>
                        </div>
                        <p>JoinHook trabaja desde la investigación y el entendimiento del problema hasta el prototipo, desarrollo, operación y mejora. Las capacidades disponibles, las que están en desarrollo y las propuestas futuras se comunican por separado.</p>
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
                                <div><small>Disponibilidad</small><strong>Próximamente</strong></div>
                            </div>
                        </div>

                        <div className="jh-project-deck-shell">
                            <button className="jh-project-side-nav is-prev" type="button" onClick={() => moveProject(-1)} aria-label="Proyecto anterior">
                                <span aria-hidden="true">←</span>
                            </button>

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
                                            aria-label={`Mostrar ${item.name}`}
                                        >
                                            <div className="jh-project-card-top">
                                                <span>{item.name}</span>
                                                <small>{String(index + 1).padStart(2, '0')}</small>
                                            </div>
                                            <div className={`jh-project-visual jh-project-visual-${item.key}`}>
                                                <img
                                                    className="jh-project-cover"
                                                    src={item.cover}
                                                    alt={`Vista de inicio de ${item.name}`}
                                                    loading={index === activeProject ? 'eager' : 'lazy'}
                                                    decoding="async"
                                                />
                                                <span className="jh-project-cover-label">{item.coverLabel}</span>
                                            </div>
                                            <div className="jh-project-card-bottom">
                                                <small>{item.stage}</small>
                                                <span>Próximamente</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button className="jh-project-side-nav is-next" type="button" onClick={() => moveProject(1)} aria-label="Proyecto siguiente">
                                <span aria-hidden="true">→</span>
                            </button>

                            <div className="jh-project-pagination" aria-live="polite" aria-label={`Proyecto ${activeProject + 1} de ${projects.length}`}>
                                <span className="jh-project-pagination-current">{String(activeProject + 1).padStart(2, '0')}</span>
                                <span>/</span>
                                <span>{String(projects.length).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="jh-section jh-product" id="herramientas" aria-labelledby="product-title">
                    <div className="jh-product-panel jh-surface">
                        <div className="jh-product-copy">
                            <span className="jh-eyebrow">Herramienta disponible · BETA</span>
                            <h2 id="product-title">Control Gastronómico Express</h2>
                            <p>
                                Una herramienta enfocada en pequeños negocios gastronómicos para registrar y controlar inventario, compras, mermas, proveedores, stock mínimo y respaldos sin partir por un ERP completo.
                            </p>
                            <div className="jh-tags">
                                <span>Inventario</span><span>Mermas</span><span>Compras</span><span>Dashboard</span><span>PWA</span>
                            </div>
                            <div className="jh-actions">
                                <a className="jh-button jh-button-primary" href="/herramientas/control-gastronomico-express">Conocer y probar <ArrowIcon /></a>
                                <span className="jh-product-status"><i /> BETA · disponible</span>
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
                        <div><span className="jh-eyebrow">JoinHook Lab</span><h2 id="lab-title">Explorar, probar y convertir aprendizaje en producto.</h2></div>
                        <p>El laboratorio reúne experimentos de interfaz, automatización, agentes, datos y nuevas tecnologías. Una prueba no se presenta como producto terminado: cada iniciativa mantiene su estado visible.</p>
                    </div>
                    <div className="jh-lab-grid">
                        <article className="jh-lab-card jh-surface">
                            <small>Interacción</small>
                            <div className="jh-demo-buttons"><button>Acción</button><button className="pressed">Activo</button></div>
                            <p>Profundidad, tactilidad y movimiento aplicados solo cuando mejoran la experiencia.</p>
                        </article>
                        <article className="jh-lab-card jh-surface">
                            <small>Estados transparentes</small>
                            <div className="jh-demo-status"><span className="green">Disponible</span><span className="blue">Beta</span><span className="amber">En desarrollo</span></div>
                            <p>Disponible, beta, experimental y en desarrollo significan cosas distintas y se muestran como tales.</p>
                        </article>
                        <article className="jh-lab-card jh-surface">
                            <small>Datos</small>
                            <div className="jh-demo-ring"><span>72%</span></div>
                            <p>Indicadores y visualización pensados para apoyar decisiones, no para decorar un panel.</p>
                        </article>
                    </div>
                </section>

                <section className="jh-section jh-lab" id="blog" aria-labelledby="blog-title">
                    <div className="jh-section-heading">
                        <div><span className="jh-eyebrow">Blog</span><h2 id="blog-title">Decisiones, aprendizaje y construcción en proceso.</h2></div>
                        <p>Este espacio reunirá notas sobre desarrollo de producto, administración, automatización, experiencia de usuario, tecnología y lo aprendido mientras los proyectos avanzan.</p>
                    </div>
                    <div className="jh-lab-grid">
                        <article className="jh-lab-card jh-surface">
                            <small>Producto</small>
                            <p>Cómo una necesidad se transforma en alcance, prototipo, métricas y una solución que pueda validarse.</p>
                        </article>
                        <article className="jh-lab-card jh-surface">
                            <small>Tecnología</small>
                            <p>Arquitectura, seguridad, despliegues, datos y automatización explicados desde proyectos reales.</p>
                        </article>
                        <article className="jh-lab-card jh-surface">
                            <small>Próximamente</small>
                            <p>La publicación del blog se habilitará de forma progresiva junto con el resto del ecosistema JoinHook.</p>
                        </article>
                    </div>
                </section>

                <section className="jh-section jh-about" id="sobre-mi" aria-labelledby="about-title">
                    <div className="jh-about-quote jh-surface">
                        <span>“</span>
                        <p>Construir con transparencia: mostrar lo que está disponible, lo que sigue en desarrollo y lo que todavía es una propuesta.</p>
                    </div>
                    <div className="jh-about-copy">
                        <span className="jh-eyebrow">Detrás de JoinHook</span>
                        <h2 id="about-title">Un espacio independiente que conecta administración, tecnología, diseño y nuevos productos.</h2>
                        <p>
                            Soy Francisco Javier Campos. JoinHook nace para convertir problemas y oportunidades reales en herramientas digitales útiles. El trabajo combina investigación, experiencia de usuario, desarrollo, automatización y gestión, manteniendo alcance, estados y capacidades comunicados con claridad.
                        </p>
                        <div className="jh-process">
                            <span>Descubrir</span><i>→</i><span>Prototipar</span><i>→</i><span>Desarrollar</span><i>→</i><span>Operar</span><i>→</i><span>Medir</span>
                        </div>
                    </div>
                </section>

                <section className="jh-contact" id="contacto" aria-labelledby="contact-title">
                    <span className="jh-eyebrow">Hablemos</span>
                    <h2 id="contact-title">Cuéntame qué necesitas resolver.</h2>
                    <p>Antes de proponer una solución, prefiero entender la necesidad, el contexto, los objetivos, las restricciones y el resultado esperado. Puedes consultar por un sitio web, una PWA, un sistema interno, automatización o alguno de los productos de JoinHook.</p>
                    <div className="jh-actions">
                        <a className="jh-button jh-button-primary" href="mailto:info@joinhook.cl?subject=Hablemos%20desde%20JoinHook">Escribirme <ArrowIcon /></a>
                        <a className="jh-button jh-button-soft" href="https://github.com/fjcamp" target="_blank" rel="noreferrer">Ver GitHub</a>
                    </div>
                </section>

                <footer className="jh-footer">
                    <a className="jh-brand" href="#inicio"><span className="jh-brand-mark">JH</span><span>JoinHook</span></a>
                    <p>Ideas reales, productos digitales.</p>
                    <span>© {new Date().getFullYear()} Francisco Javier Campos · <a href="/privacidad">Privacidad</a></span>
                </footer>
            </main>
        </>
    );
}
