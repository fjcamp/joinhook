'use client';

const modules = ['Inicio','POS / Caja','Tesorería','Pedidos','Bodega','Compras','Recetas','Producción','Finanzas','RRHH','Clientes / CRM','Marketing','Calidad','Activos','Migraciones','SII','BI / KPI','Administración','Seguridad','Configuración'];

export default function Home(){
  return <main className="shell">
    <header className="topbar"><div className="brand">JOINOPS</div><div className="status">● Núcleo operativo — modo seguro</div></header>
    <aside className="sidebar"><div className="muted">MÓDULOS</div><nav className="nav">{modules.map(m=><button key={m}>{m}</button>)}</nav></aside>
    <section className="content"><div className="grid">
      <article className="card wide"><h2>Estado operacional</h2><div className="metric">Sistema listo para construir</div><p className="muted">Foundation activo · auditoría y permisos forman parte del diseño base.</p></article>
      <article className="card"><h2>Seguridad</h2><span className="badge">BASE PROTEGIDA</span><div className="list"><div className="item"><span>RBAC</span><b>Preparado</b></div><div className="item"><span>Auditoría</span><b>Preparado</b></div><div className="item"><span>Idempotencia</span><b>Preparado</b></div></div></article>
      <article className="card"><h2>Integraciones</h2><div className="list"><div className="item"><span>Tax / SII Hub</span><span className="badge">Diseñado</span></div><div className="item"><span>Payment Hub</span><span className="badge">Diseñado</span></div><div className="item"><span>Migration Factory</span><span className="badge">Diseñado</span></div></div></article>
      <article className="card tall"><h2>Control de procesos</h2><div className="list"><div className="item"><span>Eventos</span><span>Kernel</span></div><div className="item"><span>Workflows</span><span>Kernel</span></div><div className="item"><span>Master Data</span><span>Core</span></div><div className="item"><span>Documents</span><span>Core</span></div><div className="item"><span>Audit Ledger</span><span>Core</span></div><div className="item"><span>Feature Flags</span><span>Kernel</span></div></div></article>
      <article className="card wide"><h2>Próxima fase</h2><p>Implementar persistencia, identidad, tenant isolation, RBAC, audit ledger y contratos de eventos antes de activar operaciones críticas.</p><span className="badge critical">No conectar producción todavía</span></article>
    </div></section>
  </main>
}
