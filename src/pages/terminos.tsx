import { PageShell, SiteHead, SITE_EMAIL } from '@/components/JoinHookV3';

export default function TermsPage() {
    return <PageShell>
        <SiteHead title="Términos de Uso | JoinHook" description="Condiciones generales de uso del sitio público JoinHook.cl." path="/terminos" />
        <main className="jh-legal">
            <header className="jh-legal-header"><span className="jh3-kicker">Información legal</span><h1>Términos de Uso</h1><p>Última actualización: 1 de septiembre de 2026. Estas condiciones regulan el uso general de joinhook.cl. Productos, betas o servicios contratados pueden contar con condiciones específicas adicionales.</p></header>
            <article>
                <section><h2>1. Objeto del sitio</h2><p>JoinHook.cl presenta servicios, proyectos, productos en distintas etapas de desarrollo, herramientas, contenidos y medios de contacto. La información pública no constituye por sí sola una oferta contractual vinculante ni garantiza disponibilidad permanente de una funcionalidad.</p></section>
                <section><h2>2. Estados de productos</h2><p>JoinHook procura indicar de manera visible si un producto está disponible, en beta, prototipo, exploración o desarrollo. Las funciones, disponibilidad y condiciones pueden variar a medida que el producto evoluciona.</p></section>
                <section><h2>3. Uso permitido</h2><p>No está permitido utilizar el sitio para introducir código malicioso, automatizar abuso de formularios, intentar eludir controles de seguridad, acceder sin autorización a áreas internas, interferir con la operación o utilizar contenidos de forma contraria a la ley o a derechos de terceros.</p></section>
                <section><h2>4. Propiedad intelectual</h2><p>Salvo indicación diferente, la marca JoinHook, textos propios, interfaces, documentación, código publicado bajo condiciones específicas y materiales originales están protegidos por las normas aplicables. El uso de marcas, bibliotecas o servicios de terceros se rige por sus respectivas licencias.</p></section>
                <section><h2>5. Enlaces y servicios externos</h2><p>El sitio puede incluir enlaces a proveedores, redes, productos o herramientas externas. JoinHook no controla sus políticas, disponibilidad ni contenido y cada servicio externo puede aplicar sus propios términos.</p></section>
                <section><h2>6. Disponibilidad y cambios</h2><p>Podemos mantener, actualizar, reorganizar o suspender partes del sitio para corregir errores, reforzar seguridad o evolucionar los servicios. Buscamos continuidad razonable, pero no garantizamos disponibilidad ininterrumpida del sitio público.</p></section>
                <section><h2>7. Privacidad</h2><p>El tratamiento de datos del sitio se describe en la <a href="/privacidad">Política de Privacidad</a> y las tecnologías de almacenamiento y medición en la <a href="/cookies">Política de Cookies</a>.</p></section>
                <section><h2>8. Contacto</h2><p>Consultas relacionadas con estos términos pueden enviarse a <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>.</p></section>
            </article>
        </main>
    </PageShell>;
}
