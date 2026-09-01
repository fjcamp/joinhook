import Link from 'next/link';
import { CTA, DashboardVisual, IconBadge, PageShell, ProjectPreview, SectionTitle, SiteHead } from '@/components/JoinHookV3';
import { JoinHookNewsletter } from '@/components/JoinHookNewsletter';
import { projects } from '@/data-joinhook-v3';

const services = [
    ['code', 'Desarrollo Web & PWA', 'Sitios, aplicaciones y experiencias digitales rápidas, claras, responsivas y preparadas para evolucionar.'],
    ['gear', 'Sistemas & Automatización', 'Flujos y herramientas que ordenan tareas, centralizan información y reducen trabajo repetitivo.'],
    ['design', 'UX/UI & Diseño', 'Interfaces claras y coherentes, pensadas para personas reales y para el contexto donde trabajan.'],
    ['rocket', 'Prototipos & Validación', 'Desde una necesidad o idea hasta una primera solución funcional que permita probar, medir y aprender.']
] as const;

const process = [
    ['eye', 'Observar', 'Entender el contexto y cómo se trabaja hoy.'],
    ['search', 'Analizar', 'Detectar fricciones, prioridades y oportunidades.'],
    ['design', 'Diseñar', 'Definir una solución clara y proporcional al problema.'],
    ['code', 'Implementar', 'Construir e integrar con foco en uso real.'],
    ['chart', 'Medir', 'Revisar adopción, datos y resultados.'],
    ['refresh', 'Mejorar', 'Iterar sin perder simplicidad ni propósito.']
] as const;

export default function Home() {
    return (
        <PageShell>
            <SiteHead
                title="JoinHook | Desarrollo de software y soluciones digitales en Chile"
                description="JoinHook diseña y desarrolla software, aplicaciones web, PWA, automatizaciones y soluciones digitales para empresas, emprendimientos y nuevos productos en Chile."
                path="/"
                image="/images/francisco-javier-campos.jpg"
                jsonLd={{
                    '@type': 'ProfessionalService',
                    '@id': 'https://joinhook.cl/#service',
                    name: 'JoinHook',
                    url: 'https://joinhook.cl/',
                    areaServed: 'Chile',
                    serviceType: ['Desarrollo web y PWA', 'Sistemas digitales', 'Automatización', 'UX/UI', 'Prototipos']
                }}
            />

            <section className="jh3-hero">
                <div className="jh3-hero-copy">
                    <span className="jh3-kicker">Tecnología útil, pensada desde la operación real</span>
                    <h1>Soluciones digitales que nacen de entender cómo se trabaja de verdad.</h1>
                    <p>En JoinHook combinamos mirada operativa, diseño y desarrollo para crear sistemas, herramientas y experiencias digitales que acompañan al usuario, ordenan procesos y ayudan a tomar mejores decisiones.</p>
                    <div className="jh3-actions">
                        <Link className="jh3-button jh3-button-primary" href="/proyectos">Ver proyectos →</Link>
                        <Link className="jh3-button jh3-button-secondary" href="/soluciones">Explorar soluciones →</Link>
                    </div>
                    <div className="jh3-wave" aria-hidden="true" />
                </div>
                <DashboardVisual />
            </section>

            <section className="jh3-section">
                <SectionTitle title="Qué hace JoinHook" text="Diseñamos y construimos soluciones proporcionales al problema, con una experiencia clara y capacidad de evolucionar." />
                <div className="jh3-grid-4">
                    {services.map(([icon, title, text]) => (
                        <article key={title} className="jh3-card jh3-card-lift jh3-feature-card"><IconBadge name={icon} /><h3>{title}</h3><p>{text}</p></article>
                    ))}
                </div>
            </section>

            <section className="jh3-section">
                <SectionTitle title="Productos y proyectos" text="Cada proyecto tiene un estado visible. Diferenciamos lo disponible, lo que está en construcción y lo que aún se encuentra en exploración." />
                <div className="jh3-project-grid">
                    {projects.map((project) => (
                        <article key={project.key} className="jh3-card jh3-card-lift jh3-project-card">
                            <div className="jh3-project-preview"><ProjectPreview project={project.key} /></div>
                            <div className="jh3-project-card-content">
                                <span className={`jh3-status ${project.tone === 'green' ? '' : `is-${project.tone}`}`}>{project.status}</span>
                                <h3>{project.name}</h3><p>{project.description}</p>
                                <div className="jh3-project-card-tags">{project.tags.map((tag) => <span className="jh3-chip" key={tag}>{tag}</span>)}</div>
                                <Link className="jh3-card-link" href={project.href}>Ver más →</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="jh3-section"><JoinHookNewsletter /></section>

            <section className="jh3-section">
                <SectionTitle title="Cómo trabajamos" text="La tecnología aparece después de comprender el contexto y no antes." />
                <div className="jh3-process">
                    {process.map(([icon, title, text]) => (
                        <article key={title} className="jh3-card jh3-process-card"><IconBadge name={icon} /><h3>{title}</h3><p>{text}</p></article>
                    ))}
                </div>
            </section>

            <section className="jh3-section">
                <div className="jh3-founder-feature jh3-card">
                    <div className="jh3-founder-photo-wrap"><img src="/images/francisco-javier-campos.jpg" alt="Francisco Javier Campos en un entorno natural del sur de Chile" loading="lazy" /></div>
                    <div className="jh3-founder-feature-copy">
                        <span className="jh3-eyebrow">Nuestra mirada</span><h2>Experiencia de operación convertida en criterio de diseño.</h2>
                        <p>JoinHook parte de una experiencia cercana a operaciones, administración y servicio. Esa mirada permite reconocer tareas repetitivas, información dispersa, controles manuales y puntos de fricción que pueden mejorar con una herramienta digital bien diseñada.</p>
                        <p>No publicamos un currículum como propuesta de valor. Usamos esa experiencia para comprender mejor el problema, al usuario y el entorno donde una solución deberá funcionar.</p>
                        <div className="jh3-founder-signature"><strong>Francisco Javier Campos</strong><span>Fundador de JoinHook</span></div>
                    </div>
                </div>
            </section>

            <CTA title="¿Tienes una necesidad, una idea o un proceso que mejorar?" text="Conversemos para entender el contexto y evaluar una solución útil, clara y sostenible." />
        </PageShell>
    );
}
