import Head from 'next/head';
import Link from 'next/link';

const notes = [
    {
        tag: 'Gestión',
        title: 'Ordenar antes de digitalizar',
        text: 'Una herramienta puede acelerar un proceso, pero también puede acelerar el desorden. El primer paso es entender qué información existe, quién la necesita y dónde se corta el flujo.',
        state: 'Publicado',
        href: '/blog/ordenar-antes-de-digitalizar'
    },
    {
        tag: 'Turismo',
        title: 'La estacionalidad cambia la forma de gestionar',
        text: 'Un negocio turístico no funciona igual en temporada alta que en meses de baja demanda. La planificación, los indicadores y la propuesta de valor necesitan reconocer esos ritmos.',
        state: 'En preparación'
    },
    {
        tag: 'Territorio',
        title: 'Diseñar con el lugar y no solo para el lugar',
        text: 'Las comunidades, proveedores, capacidades locales y ciclos naturales forman parte del sistema. Una solución útil debe conversar con esas condiciones.',
        state: 'En preparación'
    }
];

export default function BlogPage() {
    return (
        <>
            <Head>
                <title>Notas JoinHook — Gestión, turismo, territorio y tecnología aplicada</title>
                <meta name="description" content="Notas y aprendizajes de JoinHook sobre gestión, turismo, hospitalidad, diseño de servicios y tecnología aplicada a contextos reales." />
                <link rel="canonical" href="https://joinhook.cl/blog" />
            </Head>
            <main className="jh-v1-inner-page">
                <header className="jh-header">
                    <Link className="jh-brand" href="/" aria-label="Volver a JoinHook"><span className="jh-brand-mark" aria-hidden="true">JH</span><span>JoinHook</span></Link>
                    <Link className="jh-header-cta" href="/#contacto">Conversemos</Link>
                </header>
                <section className="jh-inner-hero jh-blog-hero">
                    <span className="jh-eyebrow">Notas JoinHook</span>
                    <h1>Aprendizajes que vale la pena dejar disponibles para otros.</h1>
                    <p>Este espacio reúne observaciones, criterios y experiencias de trabajo sobre gestión, turismo, hospitalidad, diseño de servicios, territorio y tecnología aplicada. No busca producir contenido por volumen; cada nota nace de una pregunta o una experiencia concreta.</p>
                </section>
                <section className="jh-note-grid" aria-label="Notas publicadas y en preparación">
                    {notes.map((note, index) => (
                        <article className="jh-surface jh-note-card" key={note.title}>
                            <div className="jh-note-meta"><span>{note.tag}</span><b>{note.state}</b></div>
                            <span className="jh-note-index">0{index + 1}</span>
                            <h2>{note.title}</h2>
                            <p>{note.text}</p>
                            {note.href ? <Link className="jh-note-link" href={note.href}>Leer nota ↗</Link> : <span className="jh-note-link">Próximamente ↗</span>}
                        </article>
                    ))}
                </section>
                <section className="jh-surface jh-note-bottom">
                    <div><span className="jh-eyebrow">Criterio editorial</span><h2>Menos ruido. Más experiencia compartida.</h2></div>
                    <p>Las publicaciones se incorporarán de forma gradual a medida que existan aprendizajes suficientemente concretos para que otra persona, negocio o proyecto pueda aprovecharlos.</p>
                </section>
                <footer className="jh-inner-footer"><Link href="/">← Volver al inicio</Link><Link href="/#proyectos">Ver proyectos →</Link></footer>
            </main>
            <style jsx global>{`
                .jh-blog-hero{padding-bottom:4rem}.jh-note-grid{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}.jh-note-card{padding:1.8rem;min-height:390px;display:flex;flex-direction:column}.jh-note-meta{display:flex;justify-content:space-between;gap:1rem;font-size:.73rem;letter-spacing:.06em;text-transform:uppercase;color:#69756e}.jh-note-meta b{font-weight:700;color:#a96751}.jh-note-index{font-family:Lora,Georgia,serif;font-size:3rem;line-height:1;margin:2.3rem 0 1rem;color:#355b4a}.jh-note-card h2{font-family:Lora,Georgia,serif;font-size:1.8rem;line-height:1.1;margin:0 0 .9rem}.jh-note-card p{color:#69756e;line-height:1.65;margin:0}.jh-note-link{margin-top:auto;padding-top:1.5rem;color:#355b4a;font-weight:700;text-decoration:none}.jh-note-link:hover{text-decoration:underline}.jh-note-bottom{max-width:1180px;margin:1.25rem auto 0;padding:2.3rem;display:grid;grid-template-columns:.8fr 1.2fr;gap:2rem}.jh-note-bottom h2{font-family:Lora,Georgia,serif;font-size:2rem;line-height:1.1;margin:.7rem 0 0}.jh-note-bottom p{color:#69756e;line-height:1.75;margin:0}
                @media(max-width:900px){.jh-note-grid{grid-template-columns:1fr 1fr}.jh-note-bottom{grid-template-columns:1fr}}@media(max-width:620px){.jh-note-grid{grid-template-columns:1fr}.jh-note-card{min-height:0}}
            `}</style>
        </>
    );
}
