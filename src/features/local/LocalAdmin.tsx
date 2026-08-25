import { FormEvent, useEffect, useState } from 'react';
import styles from './LocalAdmin.module.css';
import { adminMutation, loadSupabaseDashboard, loginLocalAdmin } from './supabaseGateway';
import type { LocalDashboard } from './types';

export function LocalAdmin() {
  const [accessToken, setAccessToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedInAs, setSignedInAs] = useState('');
  const [dashboard, setDashboard] = useState<LocalDashboard | null>(null);
  const [status, setStatus] = useState('Cargando estado público…');
  const [busy, setBusy] = useState(false);

  const [business, setBusiness] = useState({
    slug: '', name: '', category: '', city: 'Puerto Varas', region: 'Los Lagos', summary: '',
    verification: 'pending', status: 'draft', openNow: false,
  });
  const [signal, setSignal] = useState({
    kind: 'event', title: '', summary: '', city: 'Puerto Varas', region: 'Los Lagos',
    verification: 'pending', status: 'draft', sponsored: false, sourceUrl: '',
  });

  async function refresh() {
    try {
      const data = await loadSupabaseDashboard();
      setDashboard(data);
      setStatus('Backend territorial conectado');
    } catch {
      setStatus('Backend público no configurado en este entorno');
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const session = await loginLocalAdmin(email.trim(), password);
      setAccessToken(session.accessToken);
      setSignedInAs(session.user.email || 'usuario autenticado');
      setPassword('');
      setStatus('Sesión autenticada. Los permisos se validan en servidor.');
    } catch {
      setStatus('No fue posible iniciar sesión');
    } finally { setBusy(false); }
  }

  function signOut() {
    setAccessToken('');
    setSignedInAs('');
    setPassword('');
    setStatus('Sesión cerrada');
  }

  async function submitBusiness(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return setStatus('Inicia sesión con una cuenta autorizada');
    setBusy(true);
    try {
      const result = await adminMutation(accessToken, { entity: 'business', action: 'create', data: business });
      setStatus(`Comercio guardado · rol ${result.actor?.role || 'autorizado'}`);
      setBusiness((current) => ({ ...current, slug: '', name: '', category: '', summary: '' }));
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No fue posible guardar');
    } finally { setBusy(false); }
  }

  async function submitSignal(event: FormEvent) {
    event.preventDefault();
    if (!accessToken) return setStatus('Inicia sesión con una cuenta autorizada');
    setBusy(true);
    try {
      const result = await adminMutation(accessToken, { entity: 'signal', action: 'create', data: signal });
      setStatus(`Señal guardada · rol ${result.actor?.role || 'autorizado'}`);
      setSignal((current) => ({ ...current, title: '', summary: '', sourceUrl: '' }));
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No fue posible guardar');
    } finally { setBusy(false); }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div><div className={styles.muted}>JoinHook Local · Operación territorial</div><h1>Panel administrativo</h1></div>
          <div className={styles.status}>{status}</div>
        </header>

        <article className={styles.card}>
          <h2>Acceso administrativo</h2>
          {accessToken ? (
            <div className={styles.actions}><span className={styles.muted}>Sesión: {signedInAs}</span><button type="button" className={`${styles.button} ${styles.secondary}`} onClick={signOut}>Cerrar sesión</button></div>
          ) : (
            <form className={styles.form} onSubmit={signIn}>
              <div className={styles.field}><label htmlFor="local-admin-email">Correo</label><input id="local-admin-email" type="email" autoComplete="username" required value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div className={styles.field}><label htmlFor="local-admin-password">Contraseña</label><input id="local-admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
              <div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={busy}>Iniciar sesión</button></div>
            </form>
          )}
          <p className={styles.muted}>Autenticación mediante Supabase Auth. La autorización se resuelve en servidor con roles admin, editor, moderator o viewer. Las credenciales de servicio nunca se envían al navegador.</p>
        </article>

        <section className={styles.grid}>
          <form className={styles.card} onSubmit={submitBusiness}>
            <h2>Nuevo comercio / experiencia</h2>
            <div className={styles.form}>
              <div className={styles.field}><label>Slug</label><input required value={business.slug} onChange={(e)=>setBusiness({...business,slug:e.target.value})} /></div>
              <div className={styles.field}><label>Nombre</label><input required value={business.name} onChange={(e)=>setBusiness({...business,name:e.target.value})} /></div>
              <div className={styles.field}><label>Categoría</label><input required value={business.category} onChange={(e)=>setBusiness({...business,category:e.target.value})} /></div>
              <div className={styles.field}><label>Ciudad</label><input required value={business.city} onChange={(e)=>setBusiness({...business,city:e.target.value})} /></div>
              <div className={`${styles.field} ${styles.full}`}><label>Descripción</label><textarea value={business.summary} onChange={(e)=>setBusiness({...business,summary:e.target.value})} /></div>
              <div className={styles.field}><label>Verificación</label><select value={business.verification} onChange={(e)=>setBusiness({...business,verification:e.target.value})}><option value="pending">Pendiente</option><option value="community">Comunidad</option><option value="verified">Verificado</option></select></div>
              <div className={styles.field}><label>Estado</label><select value={business.status} onChange={(e)=>setBusiness({...business,status:e.target.value})}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></div>
              <label className={styles.muted}><input type="checkbox" checked={business.openNow} onChange={(e)=>setBusiness({...business,openNow:e.target.checked})} /> Abierto ahora</label>
              <div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={busy || !accessToken}>Guardar comercio</button></div>
            </div>
          </form>

          <form className={styles.card} onSubmit={submitSignal}>
            <h2>Nueva señal territorial</h2>
            <div className={styles.form}>
              <div className={styles.field}><label>Tipo</label><select value={signal.kind} onChange={(e)=>setSignal({...signal,kind:e.target.value})}><option value="event">Evento</option><option value="offer">Oferta</option><option value="editorial">Editorial</option><option value="tourism">Turismo</option><option value="community">Comunidad</option></select></div>
              <div className={styles.field}><label>Ciudad</label><input value={signal.city} onChange={(e)=>setSignal({...signal,city:e.target.value})} /></div>
              <div className={`${styles.field} ${styles.full}`}><label>Título</label><input required value={signal.title} onChange={(e)=>setSignal({...signal,title:e.target.value})} /></div>
              <div className={`${styles.field} ${styles.full}`}><label>Resumen</label><textarea value={signal.summary} onChange={(e)=>setSignal({...signal,summary:e.target.value})} /></div>
              <div className={`${styles.field} ${styles.full}`}><label>Fuente</label><input value={signal.sourceUrl} onChange={(e)=>setSignal({...signal,sourceUrl:e.target.value})} placeholder="https://…" /></div>
              <div className={styles.field}><label>Verificación</label><select value={signal.verification} onChange={(e)=>setSignal({...signal,verification:e.target.value})}><option value="pending">Pendiente</option><option value="community">Comunidad</option><option value="verified">Verificado</option></select></div>
              <div className={styles.field}><label>Estado</label><select value={signal.status} onChange={(e)=>setSignal({...signal,status:e.target.value})}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></div>
              <label className={styles.muted}><input type="checkbox" checked={signal.sponsored} onChange={(e)=>setSignal({...signal,sponsored:e.target.checked})} /> Contenido patrocinado</label>
              <div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={busy || !accessToken}>Guardar señal</button></div>
            </div>
          </form>
        </section>

        <article className={styles.card}>
          <div className={styles.actions}><h2 style={{marginRight:'auto'}}>Vista del contenido publicado</h2><button type="button" className={`${styles.button} ${styles.secondary}`} onClick={()=>void refresh()}>Actualizar</button></div>
          {dashboard ? <div className={styles.list}>
            <div className={styles.row}><div><strong>{dashboard.business.name}</strong><div className={styles.muted}>{dashboard.business.category} · {dashboard.business.city}</div></div><span className={styles.badge}>{dashboard.business.verification}</span></div>
            {dashboard.signals.map((item)=><div className={styles.row} key={item.id}><div><strong>{item.title}</strong><div className={styles.muted}>{item.summary}</div></div><span className={styles.badge}>{item.kind}</span></div>)}
          </div> : <p className={styles.muted}>Configura las variables de backend para consultar el contenido territorial real.</p>}
        </article>
      </section>
    </main>
  );
}
