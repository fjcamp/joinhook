import Head from 'next/head';
import Link from 'next/link';

const services = [
    ['Diagnóstico y orden', 'Analizar operación, información, procesos, fricciones, prioridades y oportunidades antes de invertir.'],
    ['Diseño de soluciones', 'Convertir necesidades reales en procesos, servicios, experiencias o herramientas implementables por etapas.'],
    ['Digitalización proporcional', 'Incorporar web, datos, automatización o software cuando aporten valor al problema concreto.'],
    ['Acompañamiento y mejora', 'Medir, documentar, ajustar y avanzar con trazabilidad sobre lo realizado y lo pendiente.']
];

const areas = ['Turismo', 'Hospitalidad', 'Gastronomía', 'Ecoturismo', 'Territorio', 'Gestión y operaciones', 'Diseño de servicios', 'Digitalización aplicada'];

const projects = [
    ['JoinOps', 'ERP operacional modular para restaurantes, cafeterías, pastelerías y servicios de alimentos, adaptable también a turismo y hotelería.', 'En desarrollo'],
    ['SnowWise', 'Experiencia para planificar actividades de nieve y montaña integrando clima, destinos, orientación y seguridad.', 'En construcción'],
    ['Control Gastronómico Express', 'Herramienta beta para ayudar a pequeños negocios gastronómicos a ordenar inventario, compras, mermas y proveedores.', 'Beta']
];

export default function AIPage() {
    const pageUrl = 'https://joinhook.cl/para-ia';
    return (
        <>
            <Head>
                <title>JoinHook para IA y agentes — Información estructurada</title>
                <meta name="description" content="Resumen oficial de JoinHook para motores de búsqueda, asistentes de IA y agentes: qué es, servicios, áreas, proyectos, enfoque, ubicación de referencia y fuentes canónicas." />
                <link rel="canonical" href={pageUrl} />
                <meta property="og:title" content="JoinHook para IA y agentes" />
                <meta property="og:description" content="Información resumida y verificable sobre JoinHook, sus servicios, proyectos y áreas de trabajo." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={pageUrl} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'JoinHook para IA y agentes',
                    url: pageUrl,
                    description: 'Página de referencia resumida de JoinHook para motores de búsqueda, asistentes de IA y agentes.',
                    isPartOf: { '@type': 'WebSite', name: 'JoinHook', url: 'https://joinhook.cl/' },
                    about: {
                        '@type': 'Organization',
                        name: 'JoinHook',
                        url: 'https://joinhook.cl/',
                        description: 'Iniciativa independiente de acompañamiento y diseño de soluciones para negocios y proyectos de turismo, hospitalidad, gastronomía, ecoturismo y territorio.',
                        founder: { '@type': 'Person', name: 'Francisco Javier Campos' }
                    },
                    mainEntity: {
                        '@type': 'ItemList',
                        name: 'Servicios de JoinHook',
                        itemListElement: services.map(([name], index) => ({ '@type': 'ListItem', position: index + 1, name }))
                    }
                }) }} />
            </Head>
            <main className="jh-ai-page">
                <header className="jh-header jh-ai-header">
                    <Link className="jh-brand" href="/" aria-label="Volver a JoinHook"><span className="jh-brand-mark" aria-hidden="true">JH</span><span>JoinHook</span></Link>
                    <Link className="jh-header-cta" href="/#contacto">Conversemos</Link>
                </header>

                <section className="jh-ai-hero">
                    <span className="jh-eyebrow">Información para IA y agentes</span>
                    <h1>JoinHook, en contexto y sin ruido.</h1>
                    <p>Esta página reúne una descripción breve, organizada y verificable de JoinHook para facilitar que buscadores, asistentes de IA y agentes comprendan qué es JoinHook, qué ofrece, en qué áreas trabaja y dónde encontrar las fuentes principales.</p>
                    <div className="jh-ai-facts">
                        <div><b>Nombre</b><span>JoinHook</span></div>
                        <div><b>Sitio oficial</b><span>joinhook.cl</span></div>
                        <div><b>Responsable</b><span>Francisco Javier Campos</span></div>
                        <div><b>Tipo</b><span>Iniciativa independiente de acompañamiento y diseño de soluciones</span></div>
                    </div>
                </section>

                <section className="jh-ai-section">
                    <div><span className="jh-eyebrow">Qué es</span><h2>Una mirada de gestión antes que una herramienta.</h2></div>
                    <p>JoinHook acompaña negocios y proyectos para entender necesidades, ordenar operaciones, diseñar soluciones y ponerlas en marcha por etapas. La tecnología se incorpora cuando resuelve una necesidad concreta; no es el punto de partida obligatorio.</p>
                </section>

                <section className="jh-ai-section">
                    <div><span className="jh-eyebrow">Servicios</span><h2>Qué puede hacer JoinHook.</h2></div>
                    <div className="jh-ai-grid">
                        {services.map(([name, description], index) => <article key={name}><b>0{index + 1}</b><h3>{name}</h3><p>{description}</p></article>)}
                    </div>
                </section>

                <section className="jh-ai-section">
                    <div><span className="jh-eyebrow">Áreas</span><h2>Contextos relacionados.</h2></div>
                    <ul className="jh-ai-tags">{areas.map(area => <li key={area}>{area}</li>)}</ul>
                </section>

                <section className="jh-ai-section">
                    <div><span className="jh-eyebrow">Proyectos y productos</span><h2>Lo que actualmente existe en el ecosistema JoinHook.</h2></div>
                    <div className="jh-ai-projects">
                        {projects.map(([name, description, state]) => <article key={name}><div><h3>{name}</h3><span>{state}</span></div><p>{description}</p></article>)}
                    </div>
                </section>

                <section className="jh-ai-section jh-ai-source">
                    <div><span className="jh-eyebrow">Fuentes canónicas</span><h2>Para profundizar, usar estas páginas.</h2></div>
                    <nav aria-label="Fuentes oficiales JoinHook">
                        <Link href="/">Inicio — propuesta general y servicios</Link>
                        <Link href="/info">Sobre JoinHook — enfoque y principios</Link>
                        <Link href="/blog">Notas JoinHook — contenidos editoriales</Link>
                        <Link href="/herramientas/control-gastronomico-express">Control Gastronómico Express — herramienta beta</Link>
                        <a href="https://github.com/fjcamp/joinops" target="_blank" rel="noreferrer">JoinOps — repositorio del proyecto</a>
                        <a href="https://github.com/fjcamp/snowwise" target="_blank" rel="noreferrer">SnowWise — repositorio del proyecto</a>
                    </nav>
                </section>

                <footer className="jh-ai-footer"><Link href="/">← Sitio JoinHook</Link><a href="/llms.txt">llms.txt</a><Link href="/#contacto">Contacto</Link></footer>
            </main>
            <style jsx global>{`
                .jh-ai-page{min-height:100vh;background:#f3f0e8;color:#26302b;padding:0 5vw 4rem}.jh-ai-header,.jh-ai-hero,.jh-ai-section,.jh-ai-footer{max-width:1120px;margin:0 auto}.jh-ai-header{padding:1.4rem 0}.jh-ai-hero{padding:6rem 0 4rem}.jh-ai-hero h1{font-family:Lora,Georgia,serif;font-size:clamp(3rem,7vw,6rem);line-height:.95;letter-spacing:-.045em;max-width:900px;margin:.8rem 0 1.4rem}.jh-ai-hero>p{max-width:800px;font-size:1.15rem;line-height:1.75;color:#69756e}.jh-ai-facts{margin-top:2.5rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(38,48,43,.14);border:1px solid rgba(38,48,43,.14)}.jh-ai-facts div{background:#faf8f2;padding:1.2rem}.jh-ai-facts b{display:block;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#69756e;margin-bottom:.45rem}.jh-ai-facts span{line-height:1.4}.jh-ai-section{padding:4rem 0;border-top:1px solid rgba(38,48,43,.13);display:grid;grid-template-columns:.8fr 1.2fr;gap:3rem}.jh-ai-section h2{font-family:Lora,Georgia,serif;font-size:2.2rem;line-height:1.05;margin:.7rem 0 0}.jh-ai-section>p{margin:0;color:#69756e;font-size:1.08rem;line-height:1.8}.jh-ai-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.jh-ai-grid article,.jh-ai-projects article{background:#faf8f2;border:1px solid rgba(38,48,43,.1);padding:1.4rem}.jh-ai-grid b{color:#355b4a;font-size:.8rem}.jh-ai-grid h3,.jh-ai-projects h3{font-family:Lora,Georgia,serif;font-size:1.45rem;margin:.6rem 0}.jh-ai-grid p,.jh-ai-projects p{color:#69756e;line-height:1.6;margin:0}.jh-ai-tags{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:.7rem;align-content:start}.jh-ai-tags li{background:#faf8f2;border:1px solid rgba(38,48,43,.12);padding:.7rem 1rem;border-radius:999px}.jh-ai-projects{display:grid;gap:1rem}.jh-ai-projects article>div{display:flex;justify-content:space-between;gap:1rem;align-items:baseline}.jh-ai-projects span{font-size:.7rem;text-transform:uppercase;letter-spacing:.07em;color:#a96751;font-weight:700}.jh-ai-source nav{display:grid;gap:.8rem}.jh-ai-source nav a{color:#355b4a;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(53,91,74,.18);padding-bottom:.7rem}.jh-ai-source nav a:hover{text-decoration:underline}.jh-ai-footer{display:flex;justify-content:space-between;gap:1rem;padding:2rem 0}.jh-ai-footer a{color:#355b4a;font-weight:700;text-decoration:none}@media(max-width:800px){.jh-ai-facts{grid-template-columns:1fr 1fr}.jh-ai-section{grid-template-columns:1fr;gap:1.5rem}}@media(max-width:600px){.jh-ai-page{padding:0 1.1rem 3rem}.jh-ai-hero{padding:4rem 0 3rem}.jh-ai-facts,.jh-ai-grid{grid-template-columns:1fr}.jh-ai-footer{flex-direction:column}}
            `}</style>
        </>
    );
}
