import { FormEvent, useState } from 'react';
import styles from './LocalAdmin.module.css';
import { loginLocalAdmin } from './supabaseGateway';

const SAMPLE = `{
  "businesses": [
    {"slug":"ejemplo-local","name":"Ejemplo Local","category":"Gastronomía","city":"Puerto Varas","region":"Los Lagos","status":"draft","verification":"pending"}
  ],
  "catalog": [],
  "signals": []
}`;

export function LocalImport() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [payload, setPayload] = useState(SAMPLE);
  const [status, setStatus] = useState('Inicia sesión con un rol admin o editor.');
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const session = await loginLocalAdmin(email.trim(), password);
      setAccessToken(session.accessToken);
      setPassword('');
      setStatus('Sesión autenticada. Puedes validar e importar el lote.');
    } catch {
      setStatus('No fue posible iniciar sesión.');
    } finally { setBusy(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return setStatus('Inicia sesión primero.');
    setBusy(true);
    try {
      const parsed = JSON.parse(payload);
      const response = await fetch('/api/local/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(parsed),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.error || `import ${response.status}`);
      setStatus(`Importación completa · comercios ${body.imported.businesses}, catálogo ${body.imported.catalog}, señales ${body.imported.signals}`);
    } catch (error) {
      setStatus(error instanceof SyntaxError ? 'El JSON no es válido.' : error instanceof Error ? error.message : 'Importación fallida.');
    } finally { setBusy(false); }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div><div className={styles.muted}>JoinHook Local · Ingesta territorial</div><h1>Importación por lote</h1></div>
          <div className={styles.status}>{status}</div>
        </header>

        {!accessToken ? (
          <form className={styles.card} onSubmit={signIn}>
            <h2>Acceso</h2>
            <div className={styles.form}>
              <div className={styles.field}><label>Correo</label><input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div className={styles.field}><label>Contraseña</label><input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
              <div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={busy}>Ingresar</button></div>
            </div>
          </form>
        ) : (
          <form className={styles.card} onSubmit={submit}>
            <h2>Datos JSON</h2>
            <div className={styles.field}>
              <label>businesses / catalog / signals</label>
              <textarea style={{minHeight:360,fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace'}} value={payload} onChange={(e)=>setPayload(e.target.value)} spellCheck={false} />
            </div>
            <div className={styles.actions} style={{marginTop:12}}><button className={styles.button} disabled={busy}>{busy ? 'Importando…' : 'Importar lote'}</button></div>
            <p className={styles.muted}>La importación crea registros en borrador por defecto, limita el tamaño del lote, exige rol admin/editor y registra la operación en auditoría.</p>
          </form>
        )}
      </section>
    </main>
  );
}
