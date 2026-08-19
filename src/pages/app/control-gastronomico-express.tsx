import Head from 'next/head';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CGEBadge, CGEEmpty, CGEField, CGEIcon, CGEModal, CGEStatCard } from '@/features/cge/components';
import { createDemoState, downloadBackup, exportInventoryCsv, loadState, makeId, resetState, saveState } from '@/features/cge/storage';
import { CGEState, CGEView, Product, ProductUnit, Supplier, WasteReason } from '@/features/cge/types';

const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });
const dateFmt = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short' });

const views: { key: CGEView; label: string; caption: string }[] = [
    { key: 'resumen', label: 'Resumen', caption: 'Lo importante hoy' },
    { key: 'inventario', label: 'Inventario', caption: 'Stock y costos' },
    { key: 'compras', label: 'Compras', caption: 'Entradas de mercadería' },
    { key: 'mermas', label: 'Mermas', caption: 'Pérdidas y causas' },
    { key: 'proveedores', label: 'Proveedores', caption: 'Contactos y compras' },
    { key: 'respaldo', label: 'Respaldo', caption: 'Exportar y recuperar' }
];

const today = () => new Date().toISOString().slice(0, 10);

function productFormDefaults(product?: Product) {
    return {
        name: product?.name || '', category: product?.category || '', unit: (product?.unit || 'kg') as ProductUnit,
        stock: String(product?.stock ?? ''), minStock: String(product?.minStock ?? ''), unitCost: String(product?.unitCost ?? ''), supplierId: product?.supplierId || ''
    };
}

export default function ControlGastronomicoExpressApp() {
    const [state, setState] = useState<CGEState | null>(null);
    const [view, setView] = useState<CGEView>('resumen');
    const [search, setSearch] = useState('');
    const [productModal, setProductModal] = useState<{ open: boolean; product?: Product }>({ open: false });
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [wasteOpen, setWasteOpen] = useState(false);
    const [supplierOpen, setSupplierOpen] = useState(false);
    const importRef = useRef<HTMLInputElement>(null);

    useEffect(() => setState(loadState()), []);
    useEffect(() => { if (state) saveState(state); }, [state]);

    const products = state?.products || [];
    const suppliers = state?.suppliers || [];

    const metrics = useMemo(() => {
        if (!state) return { inventoryValue: 0, critical: 0, wasteCost: 0, purchases: 0, wasteRate: 0 };
        const inventoryValue = state.products.reduce((sum, item) => sum + item.stock * item.unitCost, 0);
        const critical = state.products.filter((item) => item.active && item.stock <= item.minStock).length;
        const wasteCost = state.wastes.reduce((sum, item) => sum + item.quantity * (state.products.find((p) => p.id === item.productId)?.unitCost || 0), 0);
        const purchases = state.purchases.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
        const purchasedUnits = state.purchases.reduce((sum, item) => sum + item.quantity, 0);
        const wasteUnits = state.wastes.reduce((sum, item) => sum + item.quantity, 0);
        return { inventoryValue, critical, wasteCost, purchases, wasteRate: purchasedUnits ? (wasteUnits / purchasedUnits) * 100 : 0 };
    }, [state]);

    const filteredProducts = useMemo(() => products.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
    const criticalProducts = useMemo(() => products.filter((item) => item.stock <= item.minStock).sort((a, b) => a.stock / Math.max(a.minStock, 1) - b.stock / Math.max(b.minStock, 1)), [products]);
    const recentMovements = useMemo(() => (state?.movements || []).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6), [state]);

    if (!state) return <div className="cge-loading"><span>CG</span><p>Preparando Control Gastronómico Express…</p></div>;

    const mutate = (recipe: (draft: CGEState) => CGEState) => setState((current) => current ? recipe(current) : current);

    const saveProduct = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const current = productModal.product;
        const stamp = new Date().toISOString();
        const next: Product = {
            id: current?.id || makeId(),
            name: String(data.get('name') || '').trim(),
            category: String(data.get('category') || '').trim() || 'General',
            unit: String(data.get('unit') || 'unidad') as ProductUnit,
            stock: Number(data.get('stock') || 0),
            minStock: Number(data.get('minStock') || 0),
            unitCost: Number(data.get('unitCost') || 0),
            supplierId: String(data.get('supplierId') || '') || undefined,
            active: true,
            createdAt: current?.createdAt || stamp,
            updatedAt: stamp
        };
        mutate((draft) => ({ ...draft, products: current ? draft.products.map((item) => item.id === current.id ? next : item) : [...draft.products, next] }));
        setProductModal({ open: false });
    };

    const registerPurchase = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const productId = String(data.get('productId'));
        const quantity = Number(data.get('quantity') || 0);
        const unitCost = Number(data.get('unitCost') || 0);
        const date = String(data.get('date') || today());
        if (!productId || quantity <= 0) return;
        mutate((draft) => {
            const product = draft.products.find((item) => item.id === productId);
            if (!product) return draft;
            const newStock = product.stock + quantity;
            return {
                ...draft,
                products: draft.products.map((item) => item.id === productId ? { ...item, stock: newStock, unitCost: unitCost || item.unitCost, updatedAt: new Date().toISOString() } : item),
                purchases: [{ id: makeId(), productId, quantity, unitCost: unitCost || product.unitCost, supplierId: String(data.get('supplierId') || '') || product.supplierId, date, notes: String(data.get('notes') || '') }, ...draft.purchases],
                movements: [{ id: makeId(), productId, type: 'compra', quantity, previousStock: product.stock, newStock, date, note: 'Compra registrada' }, ...draft.movements]
            };
        });
        setPurchaseOpen(false);
    };

    const registerWaste = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const productId = String(data.get('productId'));
        const quantity = Number(data.get('quantity') || 0);
        const reason = String(data.get('reason') || 'Otro') as WasteReason;
        const date = String(data.get('date') || today());
        if (!productId || quantity <= 0) return;
        mutate((draft) => {
            const product = draft.products.find((item) => item.id === productId);
            if (!product) return draft;
            const safeQuantity = Math.min(quantity, product.stock);
            const newStock = Math.max(0, product.stock - safeQuantity);
            return {
                ...draft,
                products: draft.products.map((item) => item.id === productId ? { ...item, stock: newStock, updatedAt: new Date().toISOString() } : item),
                wastes: [{ id: makeId(), productId, quantity: safeQuantity, reason, date, notes: String(data.get('notes') || '') }, ...draft.wastes],
                movements: [{ id: makeId(), productId, type: 'merma', quantity: -safeQuantity, previousStock: product.stock, newStock, date, note: reason }, ...draft.movements]
            };
        });
        setWasteOpen(false);
    };

    const saveSupplier = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const supplier: Supplier = {
            id: makeId(), name: String(data.get('name') || '').trim(), contactName: String(data.get('contactName') || '').trim(), phone: String(data.get('phone') || '').trim(), email: String(data.get('email') || '').trim(), notes: String(data.get('notes') || '').trim(), createdAt: new Date().toISOString()
        };
        if (!supplier.name) return;
        mutate((draft) => ({ ...draft, suppliers: [supplier, ...draft.suppliers] }));
        setSupplierOpen(false);
    };

    const importBackup = async (file?: File) => {
        if (!file) return;
        try {
            const parsed = JSON.parse(await file.text()) as CGEState;
            if (parsed.version !== 1 || !Array.isArray(parsed.products)) throw new Error('Formato inválido');
            setState(parsed);
        } catch {
            window.alert('No pude leer este respaldo. Verifica que sea un archivo exportado desde Control Gastronómico Express.');
        }
    };

    const deleteProduct = (product: Product) => {
        if (!window.confirm(`¿Eliminar “${product.name}”? El historial de movimientos se conservará.`)) return;
        mutate((draft) => ({ ...draft, products: draft.products.filter((item) => item.id !== product.id) }));
    };

    return <>
        <Head>
            <title>Control Gastronómico Express — JoinHook</title>
            <meta name="description" content="MVP local-first para inventario, compras, mermas y proveedores de pequeños negocios gastronómicos." />
            <meta name="robots" content="noindex,nofollow" />
            <meta name="theme-color" content="#eee8dc" />
        </Head>

        <main className="cge-app">
            <aside className="cge-sidebar">
                <a className="cge-logo" href="/" aria-label="Volver a JoinHook"><span>JH</span><div><strong>Control</strong><small>Gastronómico Express</small></div></a>
                <nav>
                    {views.map((item) => <button type="button" key={item.key} className={view === item.key ? 'is-active' : ''} onClick={() => setView(item.key)}><CGEIcon name={item.key} /><span><strong>{item.label}</strong><small>{item.caption}</small></span></button>)}
                </nav>
                <div className="cge-sidebar-foot"><span className="cge-local-dot" /><div><strong>Local-first</strong><small>Guardado en este dispositivo</small></div></div>
            </aside>

            <section className="cge-main">
                <header className="cge-topbar">
                    <div><span className="cge-kicker">JoinHook · MVP 0.1</span><h1>{views.find((item) => item.key === view)?.label}</h1></div>
                    <div className="cge-top-actions"><div className="cge-business"><small>Negocio</small><input value={state.businessName} onChange={(event) => mutate((draft) => ({ ...draft, businessName: event.target.value }))} aria-label="Nombre del negocio" /></div><button type="button" className="cge-avatar" title="Proyecto local de prueba">FC</button></div>
                </header>

                {view === 'resumen' && <>
                    <section className="cge-welcome"><div><span>Buenos datos, mejores decisiones.</span><h2>{state.businessName || 'Mi negocio gastronómico'}</h2><p>Una vista simple de stock, compras y pérdidas. Sin convertir la operación en otro problema.</p></div><div className="cge-welcome-actions"><button type="button" className="cge-btn cge-btn-primary" onClick={() => setPurchaseOpen(true)}><CGEIcon name="plus" /> Registrar compra</button><button type="button" className="cge-btn" onClick={() => setWasteOpen(true)}>Registrar merma</button></div></section>
                    <section className="cge-stats"><CGEStatCard label="Valor inventario" value={money.format(metrics.inventoryValue)} detail={`${products.length} productos registrados`} tone="sage"/><CGEStatCard label="Stock crítico" value={String(metrics.critical).padStart(2, '0')} detail="productos por revisar" tone={metrics.critical ? 'clay' : 'sage'}/><CGEStatCard label="Compras registradas" value={money.format(metrics.purchases)} detail="acumulado del MVP" tone="gold"/><CGEStatCard label="Costo de merma" value={money.format(metrics.wasteCost)} detail={`${decimal.format(metrics.wasteRate)}% sobre unidades compradas`} tone="stone"/></section>
                    <section className="cge-dashboard-grid">
                        <article className="cge-panel cge-stock-panel"><header><div><small>Atención</small><h3>Stock que necesita revisión</h3></div><button type="button" onClick={() => setView('inventario')}>Ver inventario <CGEIcon name="chevron" /></button></header>{criticalProducts.length ? <div className="cge-critical-list">{criticalProducts.slice(0, 5).map((item) => { const pct = Math.min(100, (item.stock / Math.max(item.minStock, 1)) * 100); return <button type="button" key={item.id} onClick={() => setProductModal({ open: true, product: item })}><div className="cge-product-symbol">{item.name.slice(0, 2).toUpperCase()}</div><div><strong>{item.name}</strong><small>{item.category}</small></div><div className="cge-stock-meter"><span><i style={{ width: `${pct}%` }} /></span><small>{decimal.format(item.stock)} / mín. {decimal.format(item.minStock)} {item.unit}</small></div><CGEBadge tone={item.stock === 0 ? 'danger' : 'warn'}>{item.stock === 0 ? 'Sin stock' : 'Bajo'}</CGEBadge></button>})}</div> : <CGEEmpty title="Todo bajo control" text="No hay productos bajo el stock mínimo." />}</article>
                        <article className="cge-panel cge-movement-panel"><header><div><small>Actividad</small><h3>Últimos movimientos</h3></div></header>{recentMovements.length ? <div className="cge-movement-list">{recentMovements.map((movement) => { const product = products.find((item) => item.id === movement.productId); return <div key={movement.id}><span className={`cge-movement-dot ${movement.type}`} /><div><strong>{product?.name || 'Producto eliminado'}</strong><small>{movement.note || movement.type}</small></div><div><strong className={movement.quantity >= 0 ? 'positive' : 'negative'}>{movement.quantity >= 0 ? '+' : ''}{decimal.format(movement.quantity)}</strong><small>{dateFmt.format(new Date(movement.date + 'T12:00:00'))}</small></div></div>})}</div> : <CGEEmpty title="Todavía sin movimientos" text="Registra una compra o una merma para comenzar el historial." />}</article>
                    </section>
                    <section className="cge-quick-grid"><button type="button" onClick={() => setProductModal({ open: true })}><span><CGEIcon name="inventario" /></span><div><strong>Nuevo producto</strong><small>Agregar al inventario</small></div><CGEIcon name="chevron" /></button><button type="button" onClick={() => setSupplierOpen(true)}><span><CGEIcon name="proveedores" /></span><div><strong>Nuevo proveedor</strong><small>Guardar contacto</small></div><CGEIcon name="chevron" /></button><button type="button" onClick={() => downloadBackup(state)}><span><CGEIcon name="respaldo" /></span><div><strong>Crear respaldo</strong><small>Descargar archivo JSON</small></div><CGEIcon name="chevron" /></button></section>
                </>}

                {view === 'inventario' && <section className="cge-view"><div className="cge-view-tools"><div className="cge-search"><CGEIcon name="search"/><input placeholder="Buscar producto o categoría…" value={search} onChange={(event) => setSearch(event.target.value)} /></div><button className="cge-btn cge-btn-primary" type="button" onClick={() => setProductModal({ open: true })}><CGEIcon name="plus"/> Nuevo producto</button></div><div className="cge-table-wrap"><table className="cge-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Mínimo</th><th>Costo unit.</th><th>Valor</th><th>Estado</th><th /></tr></thead><tbody>{filteredProducts.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{suppliers.find((s) => s.id === item.supplierId)?.name || 'Sin proveedor'}</small></td><td>{item.category}</td><td>{decimal.format(item.stock)} {item.unit}</td><td>{decimal.format(item.minStock)} {item.unit}</td><td>{money.format(item.unitCost)}</td><td><strong>{money.format(item.stock * item.unitCost)}</strong></td><td><CGEBadge tone={item.stock === 0 ? 'danger' : item.stock <= item.minStock ? 'warn' : 'good'}>{item.stock === 0 ? 'Sin stock' : item.stock <= item.minStock ? 'Revisar' : 'Correcto'}</CGEBadge></td><td><div className="cge-row-actions"><button type="button" onClick={() => setProductModal({ open: true, product: item })}>Editar</button><button type="button" className="danger" onClick={() => deleteProduct(item)}>Eliminar</button></div></td></tr>)}</tbody></table>{!filteredProducts.length && <CGEEmpty title="No encontré productos" text="Prueba con otra búsqueda o crea uno nuevo." />}</div></section>}

                {view === 'compras' && <section className="cge-view"><div className="cge-view-tools"><div><span className="cge-kicker">Entradas de mercadería</span><h2>Compras registradas</h2></div><button className="cge-btn cge-btn-primary" type="button" onClick={() => setPurchaseOpen(true)}><CGEIcon name="plus"/> Registrar compra</button></div>{state.purchases.length ? <div className="cge-card-list">{state.purchases.map((item) => { const product = products.find((p) => p.id === item.productId); return <article key={item.id}><div className="cge-product-symbol">{product?.name.slice(0,2).toUpperCase() || '—'}</div><div><strong>{product?.name || 'Producto eliminado'}</strong><small>{suppliers.find((s) => s.id === item.supplierId)?.name || 'Compra sin proveedor'}</small></div><div><small>Cantidad</small><strong>{decimal.format(item.quantity)} {product?.unit}</strong></div><div><small>Costo unitario</small><strong>{money.format(item.unitCost)}</strong></div><div><small>Total</small><strong>{money.format(item.quantity * item.unitCost)}</strong></div><time>{dateFmt.format(new Date(item.date + 'T12:00:00'))}</time></article>})}</div> : <CGEEmpty title="Aún no has registrado compras" text="La primera compra actualizará automáticamente el stock del producto." />}</section>}

                {view === 'mermas' && <section className="cge-view"><div className="cge-view-tools"><div><span className="cge-kicker">Pérdidas controladas</span><h2>Mermas registradas</h2></div><button className="cge-btn cge-btn-clay" type="button" onClick={() => setWasteOpen(true)}><CGEIcon name="plus"/> Registrar merma</button></div>{state.wastes.length ? <div className="cge-card-list">{state.wastes.map((item) => { const product = products.find((p) => p.id === item.productId); return <article key={item.id}><div className="cge-product-symbol clay">{product?.name.slice(0,2).toUpperCase() || '—'}</div><div><strong>{product?.name || 'Producto eliminado'}</strong><small>{item.reason}</small></div><div><small>Cantidad</small><strong>{decimal.format(item.quantity)} {product?.unit}</strong></div><div><small>Costo estimado</small><strong>{money.format(item.quantity * (product?.unitCost || 0))}</strong></div><div className="cge-notes"><small>{item.notes || 'Sin observaciones'}</small></div><time>{dateFmt.format(new Date(item.date + 'T12:00:00'))}</time></article>})}</div> : <CGEEmpty title="Todavía no hay mermas" text="Registrarlas ayuda a entender dónde se pierde producto y dinero." />}</section>}

                {view === 'proveedores' && <section className="cge-view"><div className="cge-view-tools"><div><span className="cge-kicker">Red de abastecimiento</span><h2>Proveedores</h2></div><button className="cge-btn cge-btn-primary" type="button" onClick={() => setSupplierOpen(true)}><CGEIcon name="plus"/> Nuevo proveedor</button></div>{suppliers.length ? <div className="cge-supplier-grid">{suppliers.map((item) => <article className="cge-panel" key={item.id}><div className="cge-supplier-head"><span>{item.name.slice(0,2).toUpperCase()}</span><CGEBadge>{products.filter((p) => p.supplierId === item.id).length} productos</CGEBadge></div><h3>{item.name}</h3><p>{item.contactName || 'Sin persona de contacto'}</p><div className="cge-supplier-data"><span><small>Teléfono</small><strong>{item.phone || '—'}</strong></span><span><small>Correo</small><strong>{item.email || '—'}</strong></span></div></article>)}</div> : <CGEEmpty title="Sin proveedores todavía" text="Agrega proveedores para asociarlos a productos y compras." />}</section>}

                {view === 'respaldo' && <section className="cge-view"><div className="cge-backup-hero cge-panel"><div><span className="cge-kicker">Tus datos son tuyos</span><h2>Respalda antes de cambiar de dispositivo.</h2><p>Este MVP guarda todo localmente en este navegador. Puedes descargar un respaldo completo, exportar inventario a CSV o recuperar un archivo anterior.</p></div><div className="cge-backup-mark"><CGEIcon name="respaldo"/></div></div><div className="cge-backup-grid"><button type="button" onClick={() => downloadBackup(state)}><span><CGEIcon name="respaldo"/></span><strong>Descargar respaldo</strong><small>Productos, compras, mermas y proveedores en JSON.</small></button><button type="button" onClick={() => exportInventoryCsv(state)}><span>CSV</span><strong>Exportar inventario</strong><small>Archivo compatible con Excel y Google Sheets.</small></button><button type="button" onClick={() => importRef.current?.click()}><span>↥</span><strong>Restaurar respaldo</strong><small>Reemplaza los datos actuales con un respaldo válido.</small></button><button type="button" className="danger" onClick={() => { if (window.confirm('¿Volver a los datos de demostración? Se perderán los datos actuales de este navegador.')) { resetState(); setState(createDemoState()); } }}><span>↺</span><strong>Reiniciar demo</strong><small>Volver al conjunto de datos inicial.</small></button></div><input ref={importRef} hidden type="file" accept="application/json,.json" onChange={(event) => importBackup(event.target.files?.[0])}/><div className="cge-privacy-note"><CGEIcon name="alert"/><div><strong>Privacidad del MVP</strong><p>No se está enviando información del negocio a un servidor de JoinHook. Si luego activamos cuentas y sincronización, la arquitectura de seguridad y consentimiento se implementará antes de almacenar datos en la nube.</p></div></div></section>}
            </section>
        </main>

        {productModal.open && <CGEModal title={productModal.product ? 'Editar producto' : 'Nuevo producto'} eyebrow="Inventario" onClose={() => setProductModal({ open: false })}><form className="cge-form" onSubmit={saveProduct} key={productModal.product?.id || 'new'}>{(() => { const defaults = productFormDefaults(productModal.product); return <><CGEField label="Nombre"><input name="name" required defaultValue={defaults.name} placeholder="Ej. Harina" autoFocus /></CGEField><div className="cge-form-grid"><CGEField label="Categoría"><input name="category" defaultValue={defaults.category} placeholder="Secos, lácteos…" /></CGEField><CGEField label="Unidad"><select name="unit" defaultValue={defaults.unit}>{['kg','g','l','ml','unidad','caja','bolsa'].map((unit) => <option key={unit}>{unit}</option>)}</select></CGEField></div><div className="cge-form-grid three"><CGEField label="Stock actual"><input name="stock" type="number" min="0" step="0.01" required defaultValue={defaults.stock}/></CGEField><CGEField label="Stock mínimo"><input name="minStock" type="number" min="0" step="0.01" required defaultValue={defaults.minStock}/></CGEField><CGEField label="Costo unitario"><input name="unitCost" type="number" min="0" step="1" required defaultValue={defaults.unitCost}/></CGEField></div><CGEField label="Proveedor"><select name="supplierId" defaultValue={defaults.supplierId}><option value="">Sin proveedor</option>{suppliers.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setProductModal({ open: false })}>Cancelar</button><button className="cge-btn cge-btn-primary" type="submit">Guardar producto</button></div></>; })()}</form></CGEModal>}

        {purchaseOpen && <CGEModal title="Registrar compra" eyebrow="Entrada de mercadería" onClose={() => setPurchaseOpen(false)}><form className="cge-form" onSubmit={registerPurchase}><CGEField label="Producto"><select name="productId" required defaultValue=""><option value="" disabled>Selecciona un producto</option>{products.map((item) => <option value={item.id} key={item.id}>{item.name} · {decimal.format(item.stock)} {item.unit}</option>)}</select></CGEField><div className="cge-form-grid"><CGEField label="Cantidad"><input name="quantity" type="number" min="0.01" step="0.01" required /></CGEField><CGEField label="Costo unitario"><input name="unitCost" type="number" min="0" step="1" required /></CGEField></div><div className="cge-form-grid"><CGEField label="Proveedor"><select name="supplierId" defaultValue=""><option value="">Usar proveedor del producto</option>{suppliers.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></CGEField><CGEField label="Fecha"><input name="date" type="date" defaultValue={today()} required /></CGEField></div><CGEField label="Nota opcional"><textarea name="notes" rows={3} placeholder="Factura, condición, observación…" /></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setPurchaseOpen(false)}>Cancelar</button><button className="cge-btn cge-btn-primary" type="submit">Registrar y sumar stock</button></div></form></CGEModal>}

        {wasteOpen && <CGEModal title="Registrar merma" eyebrow="Salida por pérdida" onClose={() => setWasteOpen(false)}><form className="cge-form" onSubmit={registerWaste}><CGEField label="Producto"><select name="productId" required defaultValue=""><option value="" disabled>Selecciona un producto</option>{products.filter((item) => item.stock > 0).map((item) => <option value={item.id} key={item.id}>{item.name} · disponible {decimal.format(item.stock)} {item.unit}</option>)}</select></CGEField><div className="cge-form-grid"><CGEField label="Cantidad"><input name="quantity" type="number" min="0.01" step="0.01" required /></CGEField><CGEField label="Causa"><select name="reason" defaultValue="Preparación">{['Vencimiento','Preparación','Daño','Error de producción','Cortesía','Otro'].map((reason) => <option key={reason}>{reason}</option>)}</select></CGEField></div><CGEField label="Fecha"><input name="date" type="date" defaultValue={today()} required /></CGEField><CGEField label="Observación"><textarea name="notes" rows={3} placeholder="Qué ocurrió y cómo podría evitarse…" /></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setWasteOpen(false)}>Cancelar</button><button className="cge-btn cge-btn-clay" type="submit">Registrar y descontar stock</button></div></form></CGEModal>}

        {supplierOpen && <CGEModal title="Nuevo proveedor" eyebrow="Abastecimiento" onClose={() => setSupplierOpen(false)}><form className="cge-form" onSubmit={saveSupplier}><CGEField label="Nombre comercial"><input name="name" required autoFocus placeholder="Ej. Distribuidora Sur" /></CGEField><CGEField label="Persona de contacto"><input name="contactName" placeholder="Nombre y apellido" /></CGEField><div className="cge-form-grid"><CGEField label="Teléfono"><input name="phone" placeholder="+56 9…" /></CGEField><CGEField label="Correo"><input name="email" type="email" placeholder="ventas@…" /></CGEField></div><CGEField label="Notas"><textarea name="notes" rows={3} placeholder="Días de despacho, mínimo de compra…" /></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setSupplierOpen(false)}>Cancelar</button><button className="cge-btn cge-btn-primary" type="submit">Guardar proveedor</button></div></form></CGEModal>}
    </>;
}
