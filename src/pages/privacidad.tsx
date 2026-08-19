import Head from 'next/head';
import Link from 'next/link';

export default function Privacidad() {
    return (
        <>
            <Head>
                <title>Privacidad | JoinHook</title>
                <meta name="description" content="Política de privacidad de JoinHook y Control Gastronómico Express durante su etapa beta local-first." />
                <link rel="canonical" href="https://joinhook.cl/privacidad" />
            </Head>
            <main className="jh-site jh-legal-page">
                <header className="jh-header">
                    <Link className="jh-brand" href="/"><span className="jh-brand-mark" aria-hidden="true">JH</span><span>JoinHook</span></Link>
                    <Link className="jh-header-cta" href="/herramientas/control-gastronomico-express">Control Gastronómico</Link>
                </header>

                <article className="jh-legal jh-surface">
                    <span className="jh-eyebrow">Privacidad · actualización 19 agosto 2026</span>
                    <h1>Privacidad en JoinHook y Control Gastronómico Express</h1>
                    <p>JoinHook es un proyecto independiente de Francisco Javier Campos. Esta política describe el funcionamiento de privacidad de la web y de la beta actual de Control Gastronómico Express.</p>

                    <h2>1. Datos operativos de Control Gastronómico Express</h2>
                    <p>La beta actual es local-first. Inventario, compras, mermas, proveedores, movimientos y configuración del negocio se almacenan en el navegador del dispositivo mediante almacenamiento local. JoinHook no recibe ni sincroniza automáticamente esos datos con una base de datos propia en esta versión.</p>

                    <h2>2. Respaldos</h2>
                    <p>La aplicación permite descargar un respaldo JSON y archivos CSV. Esos archivos permanecen bajo control del usuario y no se envían automáticamente a JoinHook. El usuario debe conservar sus respaldos en un lugar seguro.</p>

                    <h2>3. Contacto por correo</h2>
                    <p>Los enlaces de contacto abren el cliente de correo del usuario. Si escribes a <a href="mailto:info@joinhook.cl">info@joinhook.cl</a>, se recibirán los datos que voluntariamente incluyas en el mensaje, como nombre, correo, negocio, ciudad o descripción de tu necesidad. Esa información se utilizará para responder la consulta, gestionar una solicitud de beta o coordinar una eventual compra.</p>

                    <h2>4. Hosting y registros técnicos</h2>
                    <p>La web puede ser servida por proveedores de infraestructura y alojamiento que generen registros técnicos necesarios para seguridad, diagnóstico y entrega del servicio, como dirección IP, fecha, navegador o ruta solicitada. JoinHook no incorpora actualmente publicidad comportamental ni una plataforma propia de perfiles de usuario en Control Gastronómico Express.</p>

                    <h2>5. Cookies y analítica</h2>
                    <p>La versión actual no necesita cookies publicitarias para funcionar. Si posteriormente se incorpora analítica, autenticación, pagos o servicios externos que requieran tratamiento adicional de datos, esta política se actualizará antes de activarlos cuando corresponda.</p>

                    <h2>6. Derechos y consultas</h2>
                    <p>Para consultar por información entregada directamente a JoinHook, solicitar su corrección o pedir su eliminación cuando corresponda, escribe a <a href="mailto:info@joinhook.cl?subject=Privacidad%20JoinHook">info@joinhook.cl</a>. La operación de datos personales se ajustará a la normativa chilena aplicable y esta política será revisada antes de la entrada en vigencia de las nuevas disposiciones de protección de datos previstas para diciembre de 2026.</p>

                    <h2>7. Cambios</h2>
                    <p>Control Gastronómico Express está en beta. Si cambia la arquitectura —por ejemplo al incorporar cuentas, sincronización cloud o pagos— esta política también deberá cambiar antes de utilizar esas funciones.</p>

                    <div className="jh-actions">
                        <Link className="jh-button jh-button-primary" href="/herramientas/control-gastronomico-express">Volver al producto</Link>
                        <Link className="jh-button jh-button-soft" href="/condiciones-beta">Condiciones de beta</Link>
                    </div>
                </article>
            </main>
        </>
    );
}
