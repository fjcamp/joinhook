import Link from 'next/link';
import { CTA, IconBadge, PageShell, SectionTitle, SiteHead } from '@/components/JoinHookV3';

const foundations = ['Comprender el trabajo real', 'Escuchar al usuario', 'Diseñar con intención', 'Implementar con sentido práctico', 'Mejorar con evidencia'];
const sectors = [
    ['food', 'Gastronomía', 'Operaciones de cocina, servicio, inventario y gestión.'],
    ['bed', 'Hotelería', 'Procesos de atención, coordinación, servicio y administración.'],
    ['camera', 'Turismo', 'Experiencias, información y servicios antes, durante y después del viaje.'],
    ['briefcase', 'Servicios', 'Flujos de trabajo, seguimiento y coordinación entre personas.'],
    ['folder', 'Administración', 'Tareas, documentos, indicadores y decisiones cotidianas.']
] as const;

export default function About() {
    return (
        <PageShell>
            <SiteHead title="Sobre JoinHook | Mirada operativa y soluciones digitales" description="Conoce el enfoque de JoinHook: comprender procesos, usuarios y fricciones reales antes de diseñar tecnología, sistemas y experiencias digitales." path="/sobre-joinhook" image="/images/francisco-campos.svg" />
            <section className="jh3-hero jh3-hero-about">
                <div className="jh3-hero-copy">
                    <span className="jh3-kicker">Sobre JoinHook</span>
                    <h1>Una mirada operativa aplicada a soluciones digitales.</h1>
                    <p>JoinHook nace desde la observación de procesos reales: cómo se trabaja, dónde se pierde tiempo, qué tareas se duplican y qué decisiones podrían mejorar con información más clara y herramientas mejor diseñadas.</p>
                    <div className="jh3-actions"><Link href="/contacto" className="jh3-button jh3-button-primary">Conversemos →</Link></div>
                </div>
                <div className="jh3-about-photo jh3-card"><img src="/images/francisco-javier-campos.jpg" alt="Francisco Javier Campos en terreno, referencia de la mirada operativa de JoinHook" /></div>
            </section>

            <section className="jh3-section">
                <div className="jh3-grid-2">
                    <article className="jh3-card jh3-content-card"><h2>Nuestra base</h2><div className="jh3-check-list">{foundations.map((item) => <div key={item}><IconBadge name="check" /><span>{item}</span></div>)}</div></article>
                    <article className="jh3-card jh3-content-card"><h2>Qué nos mueve</h2><div className="jh3-wave" /><p>Creemos que la tecnología debe acompañar a las personas, no complicarlas. Preferimos soluciones claras, útiles y sostenibles antes que sistemas complejos sin propósito.</p><p>La herramienta correcta puede ser una PWA, un panel, una automatización, un sistema completo o simplemente una mejor forma de organizar la información.</p></article>
                </div>
            </section>

            <section className="jh3-section">
                <SectionTitle title="Qué aporta esta mirada" />
                <div className="jh3-grid-4">
                    {[['flow','Procesos más claros','Comprender el flujo antes de digitalizarlo.'],['data','Mejor trazabilidad','Información ordenada para seguir, medir y aprender.'],['people','Menos fricción operativa','Herramientas que respetan al usuario y su contexto.'],['chart','Decisiones con mejor información','Datos relevantes presentados en el momento adecuado.']].map(([i,t,d]) => <article className="jh3-card jh3-feature-card" key={t}><IconBadge name={i as 'flow'} /><h3>{t}</h3><p>{d}</p></article>)}
                </div>
            </section>

            <section className="jh3-section">
                <SectionTitle title="Sectores donde esta mirada aporta valor" text="No son límites comerciales: son contextos donde la experiencia operativa permite formular mejores preguntas desde el inicio." />
                <div className="jh3-grid-5">{sectors.map(([icon,title,text]) => <article className="jh3-card jh3-sector-card" key={title}><IconBadge name={icon} /><h3>{title}</h3><p>{text}</p></article>)}</div>
            </section>

            <section className="jh3-section">
                <SectionTitle title="Quién está detrás" />
                <div className="jh3-founder-feature jh3-card">
                    <div className="jh3-founder-photo-wrap"><img src="/images/francisco-javier-campos.jpg" alt="Francisco Javier Campos, fundador de JoinHook" loading="lazy" /></div>
                    <div className="jh3-founder-feature-copy"><h2>Francisco Javier Campos</h2><p>Impulsa JoinHook desde una combinación de experiencia en operaciones, administración, servicio y desarrollo digital. Esa mezcla permite identificar oportunidades reales de mejora y transformarlas en soluciones útiles.</p><p>El foco no está en publicar cargos, empresas o estudios, sino en trasladar aprendizajes de terreno a decisiones de producto, experiencia y proceso.</p></div>
                </div>
            </section>

            <section className="jh3-section">
                <SectionTitle title="Cómo entendemos un proyecto" />
                <div className="jh3-process is-five">
                    {[['eye','Contexto','Entendemos entorno, personas y forma actual de trabajar.'],['search','Problema','Separamos síntomas de los nudos que realmente impactan.'],['flow','Proceso','Mapeamos el flujo y sus puntos de fricción.'],['tool','Solución','Elegimos una herramienta proporcional al objetivo.'],['refresh','Mejora continua','Medimos, aprendemos y ajustamos.']].map(([icon,title,text]) => <article className="jh3-card jh3-process-card" key={title}><IconBadge name={icon as 'eye'} /><h3>{title}</h3><p>{text}</p></article>)}
                </div>
            </section>

            <CTA title="Si quieres revisar una idea, un proceso o una herramienta, conversemos." />
        </PageShell>
    );
}
