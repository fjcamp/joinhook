import Head from 'next/head';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <>
            <Head>
                <title>Página no encontrada | JoinHook</title>
                <meta name="robots" content="noindex,follow" />
                <meta name="theme-color" content="#f3f0e8" />
            </Head>
            <main className="jh-site jh-legal-page">
                <header className="jh-header">
                    <Link className="jh-brand" href="/" aria-label="Volver a JoinHook">
                        <span className="jh-brand-mark" aria-hidden="true">JH</span>
                        <span>JoinHook</span>
                    </Link>
                    <Link className="jh-header-cta" href="/herramientas/control-gastronomico-express">Probar herramienta</Link>
                </header>

                <section className="jh-contact" style={{ marginTop: 'clamp(3rem, 10vw, 8rem)' }}>
                    <span className="jh-eyebrow">404 · Esta ruta ya no está aquí</span>
                    <h1 style={{ maxWidth: '14ch', marginInline: 'auto', fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: '.98' }}>
                        Algunas ideas cambian de lugar mientras las construyo.
                    </h1>
                    <p>
                        Esta página pertenecía a una versión anterior o la dirección no existe. La nueva JoinHook está concentrando solo proyectos, herramientas y contenido que realmente quiero mostrar.
                    </p>
                    <div className="jh-actions" style={{ justifyContent: 'center' }}>
                        <Link className="jh-button jh-button-primary" href="/">Volver al inicio</Link>
                        <Link className="jh-button jh-button-soft" href="/herramientas/control-gastronomico-express">Ver Control Gastronómico</Link>
                    </div>
                </section>
            </main>
        </>
    );
}
