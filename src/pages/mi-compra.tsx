import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type PurchaseStatus = {
  orderCode: string;
  status: string;
  verificationRequired?: boolean;
  buyerEmail?: string;
  product?: { code: string; name: string };
  access?: { downloadUrl: string; expiresAt: string };
};

export default function MyPurchase() {
  const router = useRouter();
  const orderCode = typeof router.query.order === 'string' ? router.query.order : '';
  const [status, setStatus] = useState<PurchaseStatus | null>(null);
  const [message, setMessage] = useState('Verificando la compra con Mercado Pago…');

  useEffect(() => {
    if (!router.isReady || !orderCode) return;
    const claim = sessionStorage.getItem(`jh-commerce-claim:${orderCode}`) || '';
    if (!claim) {
      setMessage('No encontramos la credencial temporal de esta compra en este navegador. Si ya pagaste, no vuelvas a pagar: contacta a soporte@joinhook.cl.');
      return;
    }
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const check = async () => {
      attempts += 1;
      try {
        const response = await fetch('/api/commerce/order-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderCode, claimToken: claim }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'status_failed');
        if (cancelled) return;
        setStatus(data);
        if (data.status === 'paid') {
          setMessage('Pago verificado. Tu producto está listo.');
          return;
        }
        if (data.verificationRequired || data.status === 'verification_pending') {
          setMessage('La operación necesita verificación adicional. Por seguridad no realices un segundo pago. Conserva tu código de compra y contacta a soporte@joinhook.cl; revisaremos la transacción antes de liberar o repetir cualquier cobro.');
          return;
        }
        if (data.status === 'failed') {
          setMessage('Mercado Pago confirmó que esta orden no fue creada correctamente. No se realizó ninguna entrega. Puedes volver al producto e iniciar un nuevo intento de pago.');
          return;
        }
        setMessage('El pago todavía está pendiente de confirmación. Estamos consultando nuevamente…');
        if (attempts < 8) timer = setTimeout(check, 3000);
        else setMessage('La confirmación está demorando más de lo esperado. No vuelvas a pagar. Conserva tu código de compra y contacta a soporte@joinhook.cl.');
      } catch (error) {
        console.error(error);
        if (!cancelled) setMessage('No pudimos verificar la compra en este momento. No vuelvas a pagar; intenta actualizar la página o contacta soporte@joinhook.cl.');
      }
    };
    void check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [router.isReady, orderCode]);

  return <>
    <Head><title>Mi compra | JoinHook</title><meta name="robots" content="noindex,nofollow,noarchive" /><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
    <main className="jh-site">
      <header className="jh-header">
        <Link className="jh-brand" href="/"><span className="jh-brand-mark">JH</span><span>JoinHook</span></Link>
        <a className="jh-header-cta" href="mailto:soporte@joinhook.cl">Soporte</a>
      </header>
      <section className="jh-section" style={{ maxWidth: 900, margin: '0 auto', paddingTop: 80 }}>
        <span className="jh-eyebrow">Compra JoinHook</span>
        <h1 style={{ fontSize: 'clamp(2.7rem,5vw,5.4rem)', lineHeight: .94, marginTop: 12 }}>{status?.status === 'paid' ? 'Compra confirmada.' : 'Verificando tu compra.'}</h1>
        <div className="jh-surface" style={{ marginTop: 28, padding: 'clamp(20px,4vw,36px)', borderRadius: 28 }}>
          <p aria-live="polite">{message}</p>
          {orderCode && <p><strong>Código de compra:</strong> {orderCode}</p>}
          {status?.product?.name && <p><strong>Producto:</strong> {status.product.name}</p>}
          {status?.buyerEmail && <p><strong>Comprador:</strong> {status.buyerEmail}</p>}
          {status?.status && <p><strong>Estado:</strong> {status.status === 'paid' ? 'Pagado y verificado' : status.status === 'verification_pending' ? 'Verificación adicional' : status.status}</p>}
          {status?.access?.downloadUrl && <div className="jh-actions" style={{ marginTop: 22 }}><a className="jh-button jh-button-primary" href={status.access.downloadUrl}>Obtener producto</a></div>}
          {status?.access?.expiresAt && <small>El acceso temporal vence el {new Date(status.access.expiresAt).toLocaleString('es-CL')} y tiene un límite global de descargas asociado a la compra.</small>}
        </div>
      </section>
    </main>
  </>;
}
