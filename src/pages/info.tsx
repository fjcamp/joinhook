import Head from 'next/head';
import Link from 'next/link';

const principles = [
    'Escuchar a las personas que viven la operación.',
    'Separar el problema real de la herramienta que podría resolverlo.',
    'Trabajar por etapas, con decisiones y alcances visibles.',
    'Respetar el contexto local, los recursos disponibles y el territorio.'
];

export default function InfoPage() {
    return (
        <>
            <Head>
                <title>Sobre JoinHook — Experiencia, criterio y acompañamiento</title>
                <meta name="description" content="Conoce la mirada de JoinHook: experiencia en operación, administración, hospitalidad, turismo y desarrollo de soluciones prácticas." />
                <link rel="canonical" href="https://joinhook.cl/info" />
            </Head>
            <main className="jh-v1-inner-page">
                <header className="jh-header">
                    <Link className="jh-brand" href="/" aria-label="Volver a JoinHook">
                        <span className="jh-brand-mark" aria-hidden="true">JH</span><span>JoinHook</span>
                    </Link>
                    <Link className="jh-header-cta" href="/#contacto">Conversemos</Link>
                </header>
                <section className="jh-inner-hero">
                    <span className="jh-eyebrow">Sobre mí</span>
                    <h1>No se trata de tener más herramientas. Se trata de entender mejor lo que está pasando.</h1>
                    <p>JoinHook es una iniciativa independiente de Francisco Javier Campos, creada para acompañar negocios y proyectos desde una mirada práctica de operación, administración, hospitalidad, turismo y desarrollo digital.</p>
                </section>
                <section className="jh-inner-grid">
                    <article className="jh-surface jh-inner-card">
                        <span className="jh-eyebrow">Desde la experiencia</span>
                        <h2>Primero la realidad; después la solución.</h2>
                        <p>La experiencia en servicios y gestión permite partir desde preguntas sencillas: qué ocurre hoy, dónde se pierde información, qué frena al equipo, qué vive el cliente y qué necesita realmente la persona que toma decisiones.</p>
                        <p>Desde ahí se puede diseñar un proceso, un servicio, una mejora organizacional o una herramienta digital. No todo problema necesita software.</p>
                    </article>
                    <article className="jh-surface jh-inner-card">
                        <span className="jh-eyebrow">Principios</span>
                        <h2>Una forma de trabajar</h2>
                        <div className="jh-principle-list">
                            {principles.map((item, index) => <div key={item}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span></div>)}
                        </div>
                    </article>
                </section>
                <section className="jh-surface jh-inner-story">
                    <div><span className="jh-eyebrow">JoinHook</span><h2>Un gancho de unión.</h2></div>
                    <p>El nombre representa una idea simple: acompañar, conectar y sostener sin quitar autonomía. Como un gancho en una ruta de montaña, la función no es hacer el recorrido por otro, sino aportar seguridad y un punto de apoyo para avanzar.</p>
                </section>
                <footer className="jh-inner-footer"><Link href="/">← Volver al inicio</Link><Link href="/#contacto">Conversar sobre un proyecto →</Link></footer>
            </main>
            <style jsx global>{`
                .jh-v1-inner-page{min-height:100vh;background:#f3f0e8;color:#26302b;padding:0 5vw 5rem}
                .jh-v1-inner-page .jh-header{max-width:1180px;margin:0 auto;padding:1.4rem 0;position:static}
                .jh-inner-hero,.jh-inner-grid,.jh-inner-story,.jh-inner-footer{max-width:1180px;margin:0 auto}
                .jh-inner-hero{padding:7rem 0 5rem}.jh-inner-hero h1{max-width:900px;font-family:Lora,Georgia,serif;font-size:clamp(2.8rem,6vw,5.6rem);line-height:.98;letter-spacing:-.04em;margin:.8rem 0 1.5rem}.jh-inner-hero p{max-width:760px;font-size:1.15rem;line-height:1.75;color:#69756e}
                .jh-inner-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}.jh-inner-card{padding:2rem}.jh-inner-card h2,.jh-inner-story h2{font-family:Lora,Georgia,serif;font-size:2rem;line-height:1.1;margin:.7rem 0 1rem}.jh-inner-card p,.jh-inner-story p{color:#69756e;line-height:1.75}
                .jh-principle-list{display:grid;gap:.9rem;margin-top:1.5rem}.jh-principle-list div{display:grid;grid-template-columns:2.5rem 1fr;gap:.8rem;align-items:start;padding-bottom:.9rem;border-bottom:1px solid rgba(38,48,43,.12)}.jh-principle-list b{font-size:.78rem;letter-spacing:.08em}.jh-principle-list span{line-height:1.45}
                .jh-inner-story{margin-top:1.25rem;padding:2.3rem;display:grid;grid-template-columns:.7fr 1.3fr;gap:2rem}.jh-inner-story p{margin:0;font-size:1.08rem}
                .jh-inner-footer{display:flex;justify-content:space-between;gap:1rem;padding:2rem 0}.jh-inner-footer a{color:#355b4a;font-weight:700;text-decoration:none}.jh-inner-footer a:hover{text-decoration:underline}
                @media(max-width:760px){.jh-inner-hero{padding:4rem 0 3rem}.jh-inner-grid,.jh-inner-story{grid-template-columns:1fr}.jh-inner-footer{flex-direction:column}.jh-v1-inner-page{padding:0 1.1rem 3rem}}
            `}</style>
        </>
    );
}
