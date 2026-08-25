import { FormEvent, useState } from 'react';
import styles from './LocalAdmin.module.css';
import { createLocalOperator, listLocalOperators, loginLocalAdmin, updateLocalOperator, type LocalOperator } from './supabaseGateway';

type Role = Exclude<LocalOperator['role'], null>;

export function LocalOperators() {
  const [accessToken, setAccessToken] = useState('');
  const [signedInAs, setSignedInAs] = useState('');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [operator, setOperator] = useState({ email: '', password: '', role: 'viewer' as Role });
  const [users, setUsers] = useState<LocalOperator[]>([]);
  const [status, setStatus] = useState('Inicia sesión con una cuenta admin');
  const [busy, setBusy] = useState(false);

  async function reload(token = accessToken) {
    if (!token) return;
    const rows = await listLocalOperators(token);
    setUsers(rows);
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const session = await loginLocalAdmin(login.email.trim(), login.password);
      setAccessToken(session.accessToken);
      setSignedInAs(session.user.email || 'admin');
      setLogin((current) => ({ ...current, password: '' }));
      await reload(session.accessToken);
      setStatus('Gestión de operadores habilitada');
    } catch {
      setStatus('La cuenta no pudo acceder a la gestión de operadores');
    } finally { setBusy(false); }
  }

  async function createOperator(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await createLocalOperator(accessToken, operator.email.trim(), operator.password, operator.role);
      setOperator({ email: '', password: '', role: 'viewer' });
      await reload();
      setStatus('Operador creado');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No fue posible crear el operador');
    } finally { setBusy(false); }
  }

  async function changeUser(user: LocalOperator, role: Role, active: boolean) {
    setBusy(true);
    try {
      await updateLocalOperator(accessToken, user.id, role, active);
      await reload();
      setStatus('Permisos actualizados');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No fue posible actualizar el rol');
    } finally { setBusy(false); }
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div><div className={styles.muted}>JoinHook Local · Seguridad y equipo</div><h1>Operadores y roles</h1></div>
          <div className={styles.status}>{status}</div>
        </header>

        {!accessToken ? <form className={styles.card} onSubmit={signIn}>
          <h2>Acceso de administrador</h2>
          <div className={styles.form}>
            <div className={styles.field}><label>Correo</label><input type="email" required autoComplete="username" value={login.email} onChange={(e)=>setLogin({...login,email:e.target.value})} /></div>
            <div className={styles.field}><label>Contraseña</label><input type="password" required autoComplete="current-password" value={login.password} onChange={(e)=>setLogin({...login,password:e.target.value})} /></div>
            <div className={`${styles.actions} ${styles.full}`}><button className={styles.button} disabled={busy}>Iniciar sesión</button></div>
          </div>
        </form> : <>
          <article className={styles.card}><div className={styles.actions}><span className={styles.muted}>Sesión: {signedInAs}</span><button className={`${styles.button} ${styles.secondary}`} onClick={()=>{setAccessToken('');setUsers([]);setSignedInAs('');}}>Cerrar sesión</button></div></article>

          <form className={styles.card} onSubmit={createOperator}>
            <h2>Crear operador</h2>
            <div className={styles.form}>
              <div className={styles.field}><label>Correo</label><input type="email" required value={operator.email} onChange={(e)=>setOperator({...operator,email:e.target.value})} /></div>
              <div className={styles.field}><label>Contraseña inicial</label><input type="password" minLength={10} required autoComplete="new-password" value={operator.password} onChange={(e)=>setOperator({...operator,password:e.target.value})} /></div>
              <div className={styles.field}><label>Rol</label><select value={operator.role} onChange={(e)=>setOperator({...operator,role:e.target.value as Role})}><option value="viewer">Viewer</option><option value="moderator">Moderator</option><option value="editor">Editor</option><option value="admin">Admin</option></select></div>
              <div className={styles.actions}><button className={styles.button} disabled={busy}>Crear usuario</button></div>
            </div>
          </form>

          <article className={styles.card}>
            <div className={styles.actions}><h2 style={{marginRight:'auto'}}>Equipo</h2><button className={`${styles.button} ${styles.secondary}`} onClick={()=>void reload()} disabled={busy}>Actualizar</button></div>
            <div className={styles.list}>
              {users.map((user)=><div className={styles.row} key={user.id}>
                <div><strong>{user.email || user.id}</strong><div className={styles.muted}>{user.active ? 'Activo' : 'Desactivado'}</div></div>
                <div className={styles.actions}>
                  <select value={user.role || 'viewer'} onChange={(e)=>void changeUser(user,e.target.value as Role,user.active)} disabled={busy}>
                    <option value="viewer">Viewer</option><option value="moderator">Moderator</option><option value="editor">Editor</option><option value="admin">Admin</option>
                  </select>
                  <button className={`${styles.button} ${styles.secondary}`} onClick={()=>void changeUser(user,(user.role || 'viewer') as Role,!user.active)} disabled={busy}>{user.active ? 'Desactivar' : 'Activar'}</button>
                </div>
              </div>)}
              {!users.length && <p className={styles.muted}>No hay operadores visibles.</p>}
            </div>
          </article>
        </>}
      </section>
    </main>
  );
}
