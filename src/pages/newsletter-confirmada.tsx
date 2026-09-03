import Link from 'next/link';
import { PageShell, SiteHead } from '@/components/JoinHookV3';

export default function NewsletterConfirmed() {
    return <PageShell>
        <SiteHead title="Suscripción confirmada | JoinHook" description="Tu suscripción a las novedades de JoinHook fue confirmada." path="/newsletter-confirmada" noindex />
        <section className="jh3-hero jh-simple-hero"><div className="jh3-hero-copy"><span className="jh3-kicker">Newsletter</span><h1>Suscripción confirmada.</h1><p>Gracias por confirmar tu correo. Recibirás novedades seleccionadas sobre productos, proyectos y contenidos de JoinHook. Puedes cancelar la suscripción desde el enlace incluido en cada envío.</p><div className="jh3-actions"><Link className="jh3-button jh3-button-primary" href="/">Volver al inicio →</Link><Link className="jh3-button jh3-button-secondary" href="/blog">Explorar el blog</Link></div></div></section>
    </PageShell>;
}
