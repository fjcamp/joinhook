import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { GASTRO_EXPRESS_PRODUCT } from '@/lib/commerce/catalog';

type CardBrickFormData = {
  payer?: {
    email?: string;
    identification?: { type?: string; number?: string };
  };
  token?: string;
  payment_method_id?: string;
  installments?: number | string;
};

type CardBrickAdditionalData = { paymentTypeId?: string };

type RuntimeCommerceConfig = {
  enabled: boolean;
  environment: 'test' | 'production';
  publicKey: string;
};

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string) => { bricks: () => { create: (name: string, container: string, settings: unknown) => Promise<{ unmount: () => void }> } };
  }
}

export default function ControlExpressCheckout() {
  const router = useRouter();
  const controller = useRef<{ unmount: () => void } | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [runtimeConfig, setRuntimeConfig] = useState<RuntimeCommerceConfig | null>(null);
  const [configFailed, setConfigFailed] = useState(false);
  const [message, setMessage] = useState('Preparando pago seguro…');

  useEffect(() => {
    let active = true;
    fetch('/api/commerce/public-config', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`commerce_public_config_${response.status}`);
        return response.json() as Promise<RuntimeCommerceConfig>;
      })
      .then((config) => {
        if (!active) return;
        setRuntimeConfig(config);
        setConfigFailed(false);
      })
      .catch((error) => {
        console.error('[commerce/public-config]', error);
        if (!active) return;
        setConfigFailed(true);
        setMessage('El checkout seguro no está disponible temporalmente.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const publicKey = runtimeConfig?.publicKey || '';
    const commerceEnabled = runtimeConfig?.enabled === true;
    if (!sdkReady || !publicKey || !commerceEnabled || !window.MercadoPago) return;

    let active = true;
    const mp = new window.MercadoPago(publicKey);
    const builder = mp.bricks();
    const settings = {
      initialization: { amount: GASTRO_EXPRESS_PRODUCT.amount },
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
        onSubmit: async (formData: CardBrickFormData, additionalData: CardBrickAdditionalData) => {
          try {
            const payload = {
              productCode: GASTRO_EXPRESS_PRODUCT.code,
              email: formData?.payer?.email,
              cardToken: formData?.token,
              paymentMethodId: formData?.payment_method_id,
              paymentMethodType: additionalData?.paymentTypeId,
              installments: formData?.installments,
              identificationType: formData?.payer?.identification?.type,
              identificationNumber: formData?.payer?.identification?.number,
            };
            const response = await fetch('/api/commerce/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'same-origin',
              body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.error || 'payment_failed');
            // The purchase claim is delivered as an HttpOnly same-site cookie by
            // the backend, so sensitive entitlement credentials never live in
            // localStorage/sessionStorage or client-visible JSON.
            await router.push(`/mi-compra?order=${encodeURIComponent(data.orderCode)}`);
          } catch (error) {
            console.error(error);
            if (active) setMessage('No pudimos completar el pago. Revisa los datos o intenta nuevamente. No se libera ninguna descarga si el pago no es verificado.');
            throw error;
          }
        },
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
  }, [router, runtimeConfig, sdkReady]);

  const configured = Boolean(runtimeConfig?.publicKey && runtimeConfig.enabled);
  const formattedAmount = new Intl.NumberFormat('es-CL', { style: 'currency', currency: GASTRO_EXPRESS_PRODUCT.currency, maximumFractionDigits: 0 }).format(GASTRO_EXPRESS_PRODUCT.amount);

  return (
    <>
      <Head>
        <title>Pago seguro | {GASTRO_EXPRESS_PRODUCT.name} · JoinHook</title>
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
            <div><span className="jh-eyebrow">Checkout JoinHook · Mercado Pago</span><h1 style={{ fontSize: 'clamp(2.5rem,5vw,4.8rem)', lineHeight: .95 }}>{GASTRO_EXPRESS_PRODUCT.name}</h1></div>
            <p>Pack fundador · <strong>{formattedAmount}</strong>. Los datos de tarjeta son capturados y tokenizados por Mercado Pago; JoinHook no almacena número de tarjeta ni CVV.</p>
          </div>
          <div className="jh-surface" style={{ padding: 'clamp(18px,4vw,34px)', borderRadius: 28 }}>
            {!runtimeConfig && !configFailed ? (
              <div><h2>Preparando checkout seguro</h2><p>Validando la configuración de prueba de JoinHook Commerce…</p></div>
            ) : !configured ? (
              <div>
                <h2>Integración en preparación</h2>
                <p>El checkout API todavía está deshabilitado. El Link de Pago actual permanece como respaldo hasta completar sandbox, QA y formalización para producción.</p>
                {configFailed && <p aria-live="polite">No pudimos consultar la configuración del checkout en este momento.</p>}
              </div>
            ) : (
              <>
                {runtimeConfig?.environment === 'test' && <p style={{ marginBottom: 16 }}><strong>Entorno de prueba:</strong> no utilices tarjetas reales.</p>}
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
