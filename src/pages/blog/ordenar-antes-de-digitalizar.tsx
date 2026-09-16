import Head from 'next/head';
import Link from 'next/link';

export default function OrdenarAntesDeDigitalizarPage() {
    return (
        <>
            <Head>
                <title>Ordenar antes de digitalizar — Notas JoinHook</title>
                <meta name="description" content="Por qué conviene entender procesos, información y responsabilidades antes de incorporar una herramienta digital a un negocio o proyecto." />
                <link rel="canonical" href="https://joinhook.cl/blog/ordenar-antes-de-digitalizar" />
                <meta property="og:title" content="Ordenar antes de digitalizar — Notas JoinHook" />
                <meta property="og:description" content="Una herramienta puede acelerar un proceso, pero también puede acelerar el desorden. Primero entendamos qué está pasando." />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://joinhook.cl/blog/ordenar-antes-de-digitalizar" />
            </Head>
            <main className="jh-v1-inner-page">
                <header className="jh-header">
                    <Link className="jh-brand" href="/" aria-label="Volver a JoinHook">
                        <span className="jh-brand-mark" aria-hidden="true">JH</span><span>JoinHook</span>
                    </Link>
                    <Link className="jh-header-cta" href="/#contacto">Conversemos</Link>
                </header>

                <article className="jh-article">
                    <header className="jh-article-header">
                        <Link className="jh-article-back" href="/blog">← Notas JoinHook</Link>
                        <span className="jh-eyebrow">Gestión · Nota editorial</span>
                        <h1>Ordenar antes de digitalizar</h1>
                        <p className="jh-article-lead">Una herramienta puede acelerar un proceso, pero también puede acelerar el desorden. Antes de elegir tecnología, conviene entender qué información existe, quién la necesita y dónde se corta el flujo.</p>
                    </header>

                    <div className="jh-article-body">
                        <p>Digitalizar no significa simplemente reemplazar una planilla, un cuaderno o una conversación por una pantalla. Significa hacer más visible y repetible una forma de trabajar.</p>
                        <p>Por eso, cuando un negocio siente que necesita una herramienta, la primera pregunta no debería ser cuál comprar o desarrollar. Debería ser qué problema concreto se quiere resolver.</p>

                        <h2>1. Entender el recorrido de la información</h2>
                        <p>Una venta puede comenzar en una mesa, continuar en cocina, pasar por caja y terminar en un registro administrativo. En cada paso puede aparecer información distinta, duplicada o incompleta.</p>
                        <p>Antes de digitalizar, vale la pena observar ese recorrido: qué se registra, quién lo registra, cuándo se registra y quién necesita utilizarlo después.</p>

                        <h2>2. Separar síntomas de problemas</h2>
                        <p>“Necesitamos un sistema” puede describir un síntoma. El problema puede estar en otro lugar: responsabilidades poco claras, información dispersa, falta de indicadores, procesos que dependen de una sola persona o decisiones tomadas sin datos suficientes.</p>
                        <p>Si el problema no está definido, una herramienta más completa no necesariamente lo resuelve.</p>

                        <h2>3. Ordenar no significa burocratizar</h2>
                        <p>Un proceso útil debe ser comprensible para las personas que lo ejecutan. Agregar controles que nadie puede sostener en la operación cotidiana puede aumentar la carga sin mejorar la gestión.</p>
                        <p>La tecnología debería acompañar el trabajo real, no obligar al equipo a trabajar para la tecnología.</p>

                        <h2>4. Después sí: diseñar la solución</h2>
                        <p>Cuando el problema, el flujo y las responsabilidades están claros, recién entonces tiene sentido decidir si la respuesta es un cambio de proceso, una capacitación, una herramienta existente, una integración o el desarrollo de algo específico.</p>
                        <p>Ese orden también permite avanzar por etapas: probar una parte, observar resultados, corregir y recién después ampliar.</p>

                        <aside className="jh-article-note">
                            <span className="jh-eyebrow">Una pregunta para comenzar</span>
                            <p>Si mañana desapareciera una de tus herramientas actuales, ¿qué información o proceso sería realmente difícil reconstruir?</p>
                        </aside>
                    </div>
                </article>

                <footer className="jh-inner-footer">
                    <Link href="/blog">← Volver a las notas</Link>
                    <Link href="/#contacto">Conversar sobre un proyecto →</Link>
                </footer>
            </main>
            <style jsx global>{`
                .jh-article{max-width:900px;margin:0 auto}.jh-article-header{padding:5rem 0 3rem;border-bottom:1px solid rgba(38,48,43,.12)}.jh-article-back{display:inline-block;color:#355b4a;font-weight:700;text-decoration:none;margin-bottom:2.5rem}.jh-article-back:hover{text-decoration:underline}.jh-article-header h1{font-family:Lora,Georgia,serif;font-size:clamp(3rem,7vw,5.8rem);line-height:.98;letter-spacing:-.045em;margin:.8rem 0 1.5rem}.jh-article-lead{max-width:780px;color:#69756e;font-size:1.25rem;line-height:1.75;margin:0}.jh-article-body{padding:3rem 0 1rem}.jh-article-body p{max-width:760px;color:#3f4944;font-size:1.08rem;line-height:1.85;margin:0 0 1.35rem}.jh-article-body h2{font-family:Lora,Georgia,serif;font-size:2rem;line-height:1.15;margin:3rem 0 1rem}.jh-article-note{margin:3rem 0 1rem;padding:2rem;background:#faf8f2;border-left:4px solid #a96751}.jh-article-note p{font-family:Lora,Georgia,serif;font-size:1.35rem;line-height:1.45;margin:.8rem 0 0;color:#26302b}.jh-inner-footer{max-width:900px}
                @media(max-width:760px){.jh-article-header{padding:3.5rem 0 2.5rem}.jh-article-body{padding-top:2.2rem}.jh-article-body h2{margin-top:2.3rem}.jh-article-header h1{font-size:clamp(2.8rem,14vw,4rem)}}
            `}</style>
        </>
    );
}
