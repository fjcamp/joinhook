import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function RecoverPurchase() {
  const router = useRouter();
  const [orderCode, setOrderCode] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const token = typeof router.query.token === 'string' ? router.query.token : '';
    const order = typeof router.query.order === 'string' ? router.query.order : '';
    if (!token || !order) return;

    let cancelled = false;
    setBusy(true);
    setMessage('Validando el enlace de recuperación…');
    fetch('/api/commerce/recovery/claim', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, orderCode: order }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || 'recovery_failed');
        return data as { orderCode: string };
      })
      .then(async (data) => {
        if (cancelled) return;
        setMessage('Compra recuperada. Abriendo Mi compra…');
        await router.replace(`/mi-compra?order=${encodeURIComponent(data.orderCode)}`);
      })
      .catch((error) => {
        console.error('[commerce/recovery/claim]', error);
        if (!cancelled) {
          setBusy(false);
          setMessage('El enlace de recuperación no es válido, ya fue utilizado o venció. Puedes solicitar uno nuevo.');
        }
      });

    return () => { cancelled = true; };
  }, [router]);

  async function requestRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('Procesando solicitud…');
    try {
      const response = await fetch('/api/commerce/recovery/request', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok && response.status !== 202) throw new Error(data?.error || 'recovery_request_failed');
      setMessage('Si los datos coinciden con una compra elegible, recibirás un enlace de recuperación en el correo registrado. Revisa también spam o correo no deseado.');
    } catch (error) {
      console.error('[commerce/recovery/request]', error);
      setMessage('La recuperación no está disponible temporalmente. Intenta más tarde o escribe a soporte@joinhook.cl.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Recuperar compra | JoinHook</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="jh-site">
        <header className="jh-header">
          <Link className="jh-brand" href="/" aria-label="Volver a JoinHook"><span className="jh-brand-mark">JH</span><span>JoinHook</span></Link>
          <a className="jh-header-cta" href="mailto:soporte@joinhook.cl">Soporte</a>
        </header>
        <section className="jh-section" style={{ maxWidth: 820, margin: '0 auto', paddingTop: 80 }}>
          <span className="jh-eyebrow">JoinHook Commerce</span>
          <h1 style={{ fontSize: 'clamp(2.7rem,5vw,5rem)', lineHeight: .95, marginTop: 12 }}>Recupera tu compra.</h1>
          <p style={{ maxWidth: 660, marginTop: 18 }}>Usa el código de compra y el mismo correo utilizado al pagar. Por privacidad, JoinHook muestra la misma respuesta exista o no una coincidencia.</p>

          <form className="jh-surface" onSubmit={requestRecovery} style={{ marginTop: 30, padding: 'clamp(22px,4vw,38px)', borderRadius: 28 }}>
            <label style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
              <strong>Código de compra</strong>
              <input
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value.toUpperCase())}
                placeholder="JH-20260822-XXXXXXXX"
                autoComplete="off"
                required
                style={{ minHeight: 48, padding: '0 14px', borderRadius: 12 }}
              />
            </label>
            <label style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
              <strong>Correo usado en la compra</strong>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.cl"
                autoComplete="email"
                required
                style={{ minHeight: 48, padding: '0 14px', borderRadius: 12 }}
              />
            </label>
            <button className="jh-button jh-button-primary" type="submit" disabled={busy}>{busy ? 'Procesando…' : 'Enviar enlace de recuperación'}</button>
            {message && <p aria-live="polite" style={{ marginTop: 18 }}>{message}</p>}
          </form>

          <p style={{ marginTop: 22, opacity: .75 }}>Nunca te pediremos número de tarjeta, CVV, Access Token ni claves de Mercado Pago para recuperar una compra.</p>
        </section>
      </main>
    </>
  );
}
