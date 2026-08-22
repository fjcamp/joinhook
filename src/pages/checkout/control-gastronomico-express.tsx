import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { GASTRO_EXPRESS_PRODUCT_CODE } from '@/lib/commerce/catalog';

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string) => { bricks: () => { create: (name: string, container: string, settings: unknown) => Promise<{ unmount: () => void }> } };
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '';
const COMMERCE_ENABLED = process.env.NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED === 'true';

export default function ControlExpressCheckout() {
  const controller = useRef<{ unmount: () => void } | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [message, setMessage] = useState('Preparando pago seguro…');

  useEffect(() => {
    if (!sdkReady || !PUBLIC_KEY || !COMMERCE_ENABLED || !window.MercadoPago) return;
    let active = true;
    const mp = new window.MercadoPago(PUBLIC_KEY);
    const builder = mp.bricks();
    const settings = {
      initialization: { amount: 4990 },
      customization: {
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          prepaidCard: 'all',
        },
        visual: { style: { theme: 'default' } },
      },
      callbacks: {
        onReady: () => active && setMessage(''),
        onSubmit: (formData: any, additionalData: any) => new Promise<void>((resolve, reject) => {
          const payload = {
            productCode: GASTRO_EXPRESS_PRODUCT_CODE,
            email: formData?.payer?.email,
            cardToken: formData?.token,
            paymentMethodId: formData?.payment_method_id,
            paymentMethodType: additionalData?.paymentTypeId,
            installments: formData?.installments,
            identificationType: formData?.payer?.identification?.type,
            identificationNumber: formData?.payer?.identification?.number,
          };
          fetch('/api/commerce/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
            .then(async (response) => {
              const data = await response.json();
              if (!response.ok) throw new Error(data?.error || 'payment_failed');
              sessionStorage.setItem(`jh-commerce-claim:${data.orderCode}`, data.claimToken);
              window.location.assign(`/mi-compra?order=${encodeURIComponent(data.orderCode)}`);
              resolve();
            })
            .catch((error) => {
              console.error(error);
              setMessage('No pudimos completar el pago. Revisa los datos o intenta nuevamente. No se libera ninguna descarga si el pago no es verificado.');
              reject(error);
            });
        }),
        onError: (error: unknown) => {
          console.error(error);
          if (active) setMessage('El formulario de pago tuvo un inconveniente. Intenta nuevamente.');
        },
      },
    };

    builder.create('cardPayment', 'cardPaymentBrick_container', settings)
      .then((instance) => { if (active) controller.current = instance; else instance.unmount(); })
      .catch((error) => { console.error(error); if (active) setMessage('No pudimos cargar el formulario seguro de Mercado Pago.'); });

    return () => {
      active = false;
      controller.current?.unmount();
      controller.current = null;
    };
  }, [sdkReady]);

  const configured = Boolean(PUBLIC_KEY && COMMERCE_ENABLED);

  return (
    <>
      <Head>
        <title>Pago seguro | Control Gastronómico Express · JoinHook</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" onLoad={() => setSdkReady(true)} />
      <main className="jh-site">
        <header className="jh-header">
          <Link className="jh-brand" href="/" aria-label="Volver a JoinHook"><span className="jh-brand-mark">JH</span><span>JoinHook</span></Link>
          <Link className="jh-header-cta" href="/herramientas/control-gastronomico-express">Volver al producto</Link>
        </header>
        <section className="jh-section" style={{ maxWidth: 920, margin: '0 auto', paddingTop: 72 }}>
          <div className="jh-section-heading">
            <div><span className="jh-eyebrow">Checkout JoinHook · Mercado Pago</span><h1 style={{ fontSize: 'clamp(2.5rem,5vw,4.8rem)', lineHeight: .95 }}>Control Gastronómico Express</h1></div>
            <p>Pack fundador · <strong>$4.990 CLP</strong>. Los datos de tarjeta son capturados y tokenizados por Mercado Pago; JoinHook no almacena número de tarjeta ni CVV.</p>
          </div>
          <div className="jh-surface" style={{ padding: 'clamp(18px,4vw,34px)', borderRadius: 28 }}>
            {!configured ? (
              <div>
                <h2>Integración en preparación</h2>
                <p>El checkout API todavía está en modo de desarrollo. El Link de Pago actual permanece como respaldo hasta completar credenciales de prueba, QA y formalización para producción.</p>
              </div>
            ) : (
              <>
                <div id="cardPaymentBrick_container" />
                {message && <p aria-live="polite" style={{ marginTop: 14 }}>{message}</p>}
              </>
            )}
          </div>
          <p style={{ marginTop: 20, opacity: .72 }}>Una compra solo se considera válida después de que el backend de JoinHook consulta Mercado Pago y confirma orden, monto, referencia y estado aprobado.</p>
        </section>
      </main>
    </>
  );
}
