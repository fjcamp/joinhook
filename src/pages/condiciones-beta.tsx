import Head from 'next/head';
import Link from 'next/link';

export default function CondicionesBeta() {
    return (
        <>
            <Head>
                <title>Condiciones de beta | Control Gastronómico Express</title>
                <meta name="description" content="Alcance, limitaciones y condiciones de uso de la beta de Control Gastronómico Express." />
                <link rel="canonical" href="https://joinhook.cl/condiciones-beta" />
            </Head>
            <main className="jh-site jh-legal-page">
                <header className="jh-header">
                    <Link className="jh-brand" href="/"><span className="jh-brand-mark" aria-hidden="true">JH</span><span>JoinHook</span></Link>
                    <Link className="jh-header-cta" href="/herramientas/control-gastronomico-express">Control Gastronómico</Link>
                </header>

                <article className="jh-legal jh-surface">
                    <span className="jh-eyebrow">Beta · actualización 19 agosto 2026</span>
                    <h1>Condiciones de uso de Control Gastronómico Express</h1>
                    <p>Control Gastronómico Express es una herramienta en etapa beta creada dentro de JoinHook, proyecto independiente de Francisco Javier Campos. Estas condiciones buscan explicar de forma simple qué ofrece hoy la aplicación y qué límites tiene antes de utilizarla con datos reales.</p>

                    <h2>1. Alcance actual</h2>
                    <p>La beta incluye gestión básica de inventario, compras, mermas, proveedores, ajustes de stock, alertas de mínimos, sugerencias simples de reposición, importación/exportación CSV, respaldo JSON y funcionamiento PWA compatible.</p>

                    <h2>2. No reemplaza sistemas contables ni tributarios</h2>
                    <p>La aplicación no emite boletas, facturas ni documentos tributarios; no calcula impuestos ni sustituye un sistema POS, ERP, software contable o asesoría profesional. Las cifras y sugerencias que muestra son apoyo operativo basado en los datos ingresados por el usuario.</p>

                    <h2>3. Almacenamiento local</h2>
                    <p>En esta versión los datos se guardan en el navegador del dispositivo. No existe sincronización automática entre equipos. Borrar datos del navegador, cambiar de dispositivo o perder acceso al perfil del navegador puede provocar pérdida de información si no existe un respaldo.</p>

                    <h2>4. Responsabilidad de respaldo</h2>
                    <p>Antes de utilizar la beta de forma habitual se recomienda generar respaldos periódicos desde la propia aplicación. JoinHook no puede recuperar información que nunca haya sido enviada a sus sistemas porque la arquitectura actual es local-first.</p>

                    <h2>5. Beta y cambios</h2>
                    <p>Durante la beta pueden corregirse errores, modificarse interfaces y ajustar funciones. Los cambios que alteren de forma relevante la forma de usar o proteger los datos deberán reflejarse en la documentación correspondiente.</p>

                    <h2>6. Precio de lanzamiento</h2>
                    <p>La landing presenta una oferta inicial de $4.990 CLP, pago único, para el alcance de lanzamiento indicado. Durante el staging actual el sitio no procesa pagos automáticos. El envío de un correo de solicitud no genera por sí solo un cobro ni perfecciona una compra.</p>

                    <h2>7. Antes de recibir un pago</h2>
                    <p>Antes de habilitar un checkout directo o aceptar un pago se informarán al comprador, de forma clara y previa, el precio total aplicable, las características y alcance de la versión adquirida, forma de entrega, condiciones de soporte, identificación y contacto del proveedor, condiciones generales de contratación y demás antecedentes exigibles para una contratación electrónica en Chile. El comprador deberá poder revisar y conservar esas condiciones antes de aceptar.</p>
                    <p>También se informará de manera destacada el derecho de retracto que resulte aplicable a la contratación a distancia y, si legalmente correspondiera alguna exclusión, ésta no se aplicará de forma implícita: deberá ser informada de manera previa, inequívoca y fácilmente accesible. Mientras el checkout no esté habilitado, esta página no pretende reemplazar la información contractual definitiva de una compra.</p>
                    <p>Una compra electrónica deberá quedar confirmada por escrito o por un medio que permita conservar la información de la operación.</p>

                    <h2>8. Soporte de beta</h2>
                    <p>Las consultas de esta etapa se reciben en <a href="mailto:info@joinhook.cl">info@joinhook.cl</a>. El soporte inicial se orienta a instalación, uso básico, respaldo y reporte de errores; no incluye consultoría contable, tributaria o gastronómica especializada.</p>

                    <h2>9. Privacidad</h2>
                    <p>El tratamiento de información de contacto y el funcionamiento local de la aplicación se describen en la <Link href="/privacidad">Política de Privacidad</Link>.</p>

                    <div className="jh-actions">
                        <Link className="jh-button jh-button-primary" href="/herramientas/control-gastronomico-express">Volver al producto</Link>
                        <Link className="jh-button jh-button-soft" href="/privacidad">Privacidad</Link>
                    </div>
                </article>
            </main>
        </>
    );
}
