'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = { id: string; code: string; name: string; category_code?: string; base_unit: string; priceMinor: number };
type CartLine = Product & { quantity: number };
type QueuedOrder = { idempotencyKey: string; totalMinor: number; items: { productCode: string; quantity: number; unitMinor: number }[] };

const seedProducts: Product[] = [
  { id: 'local-cafe', code: 'CAF-001', name: 'Café Americano', category_code: 'BEBIDAS', base_unit: 'unit', priceMinor: 2200 },
  { id: 'local-sandwich', code: 'SND-001', name: 'Sándwich Casa', category_code: 'COCINA', base_unit: 'unit', priceMinor: 6500 },
  { id: 'local-water', code: 'AGU-001', name: 'Agua Mineral', category_code: 'BEBIDAS', base_unit: 'unit', priceMinor: 1800 },
];
const modules = ['Inicio', 'POS / Caja', 'Tesorería', 'Pedidos', 'Bodega', 'Compras', 'Recetas', 'Producción', 'Finanzas', 'RRHH', 'Clientes / CRM', 'Marketing', 'Calidad', 'Migraciones', 'SII', 'BI / KPI', 'Administración', 'Seguridad', 'Configuración'];
function money(minor: number) { return `$${minor.toLocaleString('es-CL')}`; }

export default function Home() {
  const [active, setActive] = useState('Inicio');
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cloud, setCloud] = useState(false);
  const [syncState, setSyncState] = useState('Local listo');
  const [ordersToday, setOrdersToday] = useState(0);

  async function flushQueue() {
    const queue: QueuedOrder[] = JSON.parse(localStorage.getItem('joinops.sync.queue') ?? '[]');
    if (!queue.length) return;
    const remaining: QueuedOrder[] = [];
    for (const payload of queue) {
      try {
        const response = await fetch('/api/mvp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error('sync');
      } catch { remaining.push(payload); }
    }
    localStorage.setItem('joinops.sync.queue', JSON.stringify(remaining));
    setSyncState(remaining.length ? `${remaining.length} venta(s) pendientes` : 'Cola local sincronizada');
  }

  useEffect(() => {
    const saved = localStorage.getItem('joinops.orders.today');
    if (saved) setOrdersToday(Number(saved));
    fetch('/api/mvp').then(r => r.json()).then(async data => {
      if (data.cloud && data.products?.length) {
        setCloud(true);
        setProducts(data.products.map((p: any) => ({ ...p, priceMinor: Number(p.priceMinor ?? 0) })));
        setSyncState('Nube conectada');
        await flushQueue();
      }
    }).catch(() => setSyncState('Modo local / sin red'));
    const online = () => flushQueue();
    window.addEventListener('online', online);
    return () => window.removeEventListener('online', online);
  }, []);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0), [cart]);
  function add(product: Product) {
    setCart(current => {
      const found = current.find(x => x.id === product.id);
      if (found) return current.map(x => x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...current, { ...product, quantity: 1 }];
    });
    setActive('POS / Caja');
  }
  async function checkout() {
    if (!cart.length) return;
    const payload: QueuedOrder = { idempotencyKey: crypto.randomUUID(), totalMinor: total, items: cart.map(x => ({ productCode: x.code, quantity: x.quantity, unitMinor: x.priceMinor })) };
    try {
      const response = await fetch('/api/mvp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error('cloud');
      setSyncState('Venta respaldada en nube');
    } catch {
      const queue = JSON.parse(localStorage.getItem('joinops.sync.queue') ?? '[]');
      localStorage.setItem('joinops.sync.queue', JSON.stringify([...queue, payload]));
      setSyncState('Venta guardada localmente · pendiente de sincronizar');
    }
    const next = ordersToday + 1;
    setOrdersToday(next);
    localStorage.setItem('joinops.orders.today', String(next));
    setCart([]);
  }

  return <main className="shell">
    <header className="topbar"><div className="brand">JOINOPS</div><div className="top-status"><span>{syncState}</span><span className={cloud ? 'dot online' : 'dot'}>●</span></div></header>
    <aside className="sidebar"><div className="muted">MÓDULOS</div><nav className="nav">{modules.map(m => <button className={active === m ? 'active' : ''} key={m} onClick={() => setActive(m)}>{m}</button>)}</nav></aside>
    <section className="content">
      {active === 'Inicio' && <div className="grid">
        <article className="card wide"><div className="eyebrow">BUSINESS OS · MVP</div><h1>Centro operacional</h1><p className="muted">Venta → caja → trazabilidad → respaldo. La operación puede continuar localmente cuando la red falla y sincronizar después.</p><div className="actions"><button onClick={() => setActive('POS / Caja')}>Abrir POS</button><button className="secondary" onClick={() => setActive('Bodega')}>Ver bodega</button></div></article>
        <article className="card"><h2>Ventas hoy</h2><div className="metric">{ordersToday}</div><span className="badge">Operativas</span></article>
        <article className="card"><h2>Respaldo</h2><div className="metric small">{cloud ? 'NUBE' : 'LOCAL'}</div><p className="muted">Cola local protegida contra pérdida de conectividad.</p></article>
        <article className="card tall"><h2>Control</h2><div className="list"><div className="item"><span>Tenant isolation</span><b>Base</b></div><div className="item"><span>Idempotencia</span><b>Activa</b></div><div className="item"><span>Audit Ledger</span><b>Activo</b></div><div className="item"><span>Offline queue</span><b>Activa</b></div><div className="item"><span>SII</span><span className="badge">No productivo</span></div></div></article>
        <article className="card wide"><h2>Flujo MVP</h2><div className="flow"><span>Producto</span><i>→</i><span>POS</span><i>→</i><span>Caja</span><i>→</i><span>Auditoría</span><i>→</i><span>Nube</span></div></article>
      </div>}
      {active === 'POS / Caja' && <div className="pos-layout">
        <article className="card product-panel"><div className="panel-head"><div><div className="eyebrow">OPERACIÓN</div><h1>POS / Caja</h1></div><span className="badge">CLP</span></div><div className="product-grid">{products.map(p => <button className="product" key={p.id} onClick={() => add(p)}><span className="product-name">{p.name}</span><span className="muted">{p.code}</span><strong>{money(p.priceMinor)}</strong></button>)}</div></article>
        <article className="card cart-panel"><div className="panel-head"><h2>Venta actual</h2><span>{cart.length} líneas</span></div><div className="cart">{cart.length === 0 ? <p className="muted">Selecciona productos para iniciar.</p> : cart.map(item => <div className="cart-row" key={item.id}><span>{item.name} × {item.quantity}</span><b>{money(item.priceMinor * item.quantity)}</b></div>)}</div><div className="total"><span>Total</span><strong>{money(total)}</strong></div><button className="pay" disabled={!cart.length} onClick={checkout}>Cobrar y respaldar</button></article>
      </div>}
      {active !== 'Inicio' && active !== 'POS / Caja' && <div className="grid"><article className="card wide"><div className="eyebrow">MÓDULO</div><h1>{active}</h1><p className="muted">Módulo registrado en el Kernel JoinOps. La implementación se activa por contrato, permisos, eventos, auditoría y pruebas; no se crean silos aislados.</p><span className="badge">En construcción controlada</span></article><article className="card"><h2>Estado</h2><div className="metric small">KERNEL</div><p className="muted">Tenant · RBAC · Audit · Eventos</p></article><article className="card tall"><h2>Próximo contrato</h2><div className="list"><div className="item"><span>Datos</span><b>Core</b></div><div className="item"><span>Eventos</span><b>Kernel</b></div><div className="item"><span>Permisos</span><b>RBAC</b></div><div className="item"><span>Auditoría</span><b>Ledger</b></div><div className="item"><span>Integración</span><b>API</b></div></div></article></div>}
    </section>
  </main>;
}
