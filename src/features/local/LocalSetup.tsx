import { FormEvent, useEffect, useState } from 'react';
import styles from './LocalAdmin.module.css';

type Readiness = {
  ok: boolean;
  checks: {
    supabaseUrl: 'ready' | 'missing' | 'error';
    publishableKey: 'ready' | 'missing' | 'error';
    serviceRoleKey: 'ready' | 'missing' | 'error';
    setupToken: 'ready' | 'missing' | 'error';
    database: 'ready' | 'missing' | 'error';
    adminInitialized: boolean | null;
  };
};

export function LocalSetup() {
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [message, setMessage] = useState('Verificando infraestructura…');
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const response = await fetch('/api/local/status', { cache: 'no-store' });
      const body = await response.json();
      setReadiness(body);
      if (body?.checks?.adminInitialized) setMessage('JoinHook Local ya tiene un administrador inicializado.');
      else if (body?.ok && body?.checks?.setupToken === 'ready') setMessage('Infraestructura lista para crear el primer administrador.');
      else setMessage('Faltan variables o conectividad de producción. Revisa el diagnóstico.');
    } catch {
      setMessage('No fue posible consultar el estado operativo.');
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch('/api/local/setup-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, setupToken }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || `setup ${response.status}`);
      setPassword('');
      setSetupToken('');
      setMessage('Primer administrador creado correctamente. Retira o rota LOCAL_ADMIN_SETUP_TOKEN y entra a /local-admin.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible crear el administrador.');
    } finally {
      setBusy(false);
    }
  }

  const checks = readiness?.checks;
  const canInitialize = Boolean(readiness?.ok && checks?.setupToken === 'ready' && checks?.adminInitialized === false);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div><div className={styles.muted}>JoinHook Local · Puesta en operación</div><h1>Inicialización segura</h1></div>
          <div className={styles.status}>{message}</div>
        </header>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>Diagnóstico de producción</h2>
            <div className={styles.list}>
              {checks ? Object.entries(checks).map(([key, value]) => (
                <div className={styles.row} key={key}>
                  <strong>{key}</strong>
                  <span className={styles.badge}>{String(value)}</span>
                </div>
              )) : <p className={styles.muted}>Consultando configuración…</p>}
            </div>
            <p className={styles.muted}>Este diagnóstico nunca devuelve valores de secretos; solo indica si existen y si la base responde.</p>
          </article>

          <form className={styles.card} onSubmit={submit}>
            <h2>Crear primer administrador</h2>
            <div className={styles.form}>
              <div className={`${styles.field} ${styles.full}`}><label>Correo</label><input type="email" required autoComplete="username" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div className={`${styles.field} ${styles.full}`}><label>Contraseña</label><input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
              <div className={`${styles.field} ${styles.full}`}><label>Token temporal de instalación</label><input type="password" required autoComplete="off" value={setupToken} onChange={(e)=>setSetupToken(e.target.value)} /></div>
              <div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={!canInitialize || busy}>{busy ? 'Inicializando…' : 'Crear administrador'}</button><button type="button" className={`${styles.button} ${styles.secondary}`} onClick={()=>void refresh()}>Revisar estado</button></div>
            </div>
            <p className={styles.muted}>El endpoint se bloquea automáticamente después del primer rol creado. Luego debes retirar el token temporal del hosting.</p>
          </form>
        </section>
      </section>
    </main>
  );
}
