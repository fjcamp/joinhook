import { PageShell, SiteHead } from '@/components/JoinHookV3';

export default function CookiesPage() {
    return <PageShell>
        <SiteHead title="Política de Cookies | JoinHook" description="Información sobre cookies, almacenamiento local, analítica y preferencias de privacidad utilizadas en JoinHook.cl." path="/cookies" />
        <main className="jh-legal">
            <header className="jh-legal-header"><span className="jh3-kicker">Privacidad</span><h1>Política de Cookies</h1><p>Última actualización: 1 de septiembre de 2026. JoinHook utiliza una arquitectura de consentimiento que diferencia tecnologías necesarias de funciones opcionales.</p></header>
            <article>
                <section><h2>1. Qué entendemos por cookies y tecnologías similares</h2><p>Además de cookies HTTP, un sitio puede usar almacenamiento local, identificadores técnicos o scripts de medición. En JoinHook agrupamos estas tecnologías por finalidad para que puedas decidir sobre las que no sean esenciales.</p></section>
                <section><h2>2. Categorías</h2><ul><li><strong>Necesarias:</strong> seguridad, navegación, estado técnico y funciones esenciales. No se desactivan desde el gestor porque el sitio puede dejar de funcionar correctamente.</li><li><strong>Analítica:</strong> medición de páginas, eventos, rendimiento y conversiones. Se activa únicamente después de una elección favorable.</li><li><strong>Marketing:</strong> reservada para funciones publicitarias o de atribución avanzada si se habilitan en el futuro. Por defecto permanece desactivada.</li><li><strong>Preferencias:</strong> recuerda opciones no esenciales de experiencia cuando el visitante lo autoriza.</li></ul></section>
                <section><h2>3. Herramientas previstas</h2><p>La capa de analítica puede incluir Google Analytics 4 y Cloudflare Web Analytics cuando corresponda a la configuración activa y a las preferencias elegidas. Cloudflare Turnstile se utiliza como control de seguridad anti-bot en formularios y no se emplea para perfilar comercialmente a los visitantes.</p></section>
                <section><h2>4. Qué medimos</h2><p>Podemos medir vistas de página, profundidad de lectura, secciones vistas, clics en CTA, productos o servicios consultados, descargas, inicio y finalización de formularios, suscripciones y clics hacia WhatsApp. No enviamos a analítica nombres, correos, teléfonos ni contenido de mensajes.</p></section>
                <section><h2>5. Google Consent Mode</h2><p>La implementación establece inicialmente el almacenamiento de analítica y marketing como denegado. Cuando guardas una preferencia, el estado se actualiza y las herramientas opcionales se cargan únicamente cuando corresponde.</p></section>
                <section><h2>6. Cambiar tu decisión</h2><p>Puedes volver a abrir el panel mediante el botón “Privacidad” visible en el sitio. También puedes eliminar los datos almacenados por joinhook.cl desde la configuración de tu navegador.</p></section>
                <section><h2>7. Duración</h2><p>Las preferencias se conservan localmente hasta que las modifiques, borres el almacenamiento del navegador o JoinHook solicite una renovación por un cambio material en las finalidades o herramientas utilizadas.</p></section>
                <section><h2>8. Contacto</h2><p>Para consultas relacionadas con privacidad o tecnologías de seguimiento puedes escribir a <a href="mailto:info@joinhook.cl">info@joinhook.cl</a>.</p></section>
            </article>
        </main>
    </PageShell>;
}
