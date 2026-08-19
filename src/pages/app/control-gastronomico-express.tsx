import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CGEBadge, CGEEmpty, CGEField, CGEIcon, CGEModal, CGEStatCard } from '@/features/cge/components';
import { createBlankState, createDemoState, downloadBackup, exportInventoryCsv, loadState, makeId, resetState, saveState } from '@/features/cge/storage';
import { CGEState, CGEView, Product, ProductUnit, Supplier, WasteReason } from '@/features/cge/types';

const money = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });
const dateFmt = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short' });
const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_SUPPLIERS: Supplier[] = [];
const units: ProductUnit[] = ['kg', 'g', 'l', 'ml', 'unidad', 'caja', 'bolsa'];
const wasteReasons: WasteReason[] = ['Vencimiento', 'Preparación', 'Daño', 'Error de producción', 'Cortesía', 'Otro'];

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
        name: product?.name || '',
        category: product?.category || '',
        unit: (product?.unit || 'kg') as ProductUnit,
        stock: String(product?.stock ?? ''),
        minStock: String(product?.minStock ?? ''),
        unitCost: String(product?.unitCost ?? ''),
        supplierId: product?.supplierId || ''
    };
}

function csvLine(line: string, delimiter: string) {
    const values: string[] = [];
    let value = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        if (char === '"' && line[index + 1] === '"' && quoted) {
            value += '"';
            index += 1;
        } else if (char === '"') {
            quoted = !quoted;
        } else if (char === delimiter && !quoted) {
            values.push(value.trim());
            value = '';
        } else {
            value += char;
        }
    }
    values.push(value.trim());
    return values;
}

function normalizeHeader(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function downloadSuggestions(rows: { product: Product; quantity: number; estimatedCost: number }[]) {
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const data = [
        ['Producto', 'Cantidad sugerida', 'Unidad', 'Costo unitario estimado', 'Costo estimado'],
        ...rows.map((row) => [row.product.name, row.quantity, row.product.unit, row.product.unitCost, row.estimatedCost])
    ];
    const blob = new Blob(['\ufeff' + data.map((row) => row.map(escape).join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `sugerencia-compra-${today()}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

export default function ControlGastronomicoExpressApp() {
    const [state, setState] = useState<CGEState | null>(null);
    const [view, setView] = useState<CGEView>('resumen');
    const [search, setSearch] = useState('');
    const [productModal, setProductModal] = useState<{ open: boolean; product?: Product }>({ open: false });
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [purchaseDraft, setPurchaseDraft] = useState<{ productId?: string; quantity?: number }>({});
    const [wasteOpen, setWasteOpen] = useState(false);
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [onboardingName, setOnboardingName] = useState('');
    const [notice, setNotice] = useState('');
    const backupRef = useRef<HTMLInputElement>(null);
    const csvRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loaded = loadState();
        setState(loaded);
        if (!loaded.onboardingCompleted) {
            setOnboardingName(loaded.businessName || '');
            setOnboardingOpen(true);
        }
    }, []);

    useEffect(() => {
        if (state) saveState(state);
    }, [state]);

    useEffect(() => {
        if (!notice) return;
        const timer = window.setTimeout(() => setNotice(''), 3200);
        return () => window.clearTimeout(timer);
    }, [notice]);

    const products = state?.products ?? EMPTY_PRODUCTS;
    const suppliers = state?.suppliers ?? EMPTY_SUPPLIERS;

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

    const filteredProducts = useMemo(
        () => products.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())),
        [products, search]
    );

    const criticalProducts = useMemo(
        () => products.filter((item) => item.active && item.stock <= item.minStock).sort((a, b) => a.stock / Math.max(a.minStock, 1) - b.stock / Math.max(b.minStock, 1)),
        [products]
    );

    const suggestions = useMemo(
        () => criticalProducts.map((product) => {
            const target = Math.max(product.minStock * 2, product.minStock);
            const quantity = Math.max(0, Number((target - product.stock).toFixed(2)));
            return { product, quantity, estimatedCost: quantity * product.unitCost };
        }).filter((item) => item.quantity > 0),
        [criticalProducts]
    );

    const recentMovements = useMemo(
        () => (state?.movements || []).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
        [state]
    );

    if (!state) return <div className="cge-loading"><span>CG</span><p>Preparando Control Gastronómico Express…</p></div>;

    const mutate = (recipe: (draft: CGEState) => CGEState) => setState((current) => current ? recipe(current) : current);
    const notify = (message: string) => setNotice(message);

    const finishOnboarding = (blank: boolean) => {
        const name = onboardingName.trim() || 'Mi negocio gastronómico';
        if (blank) {
            setState(createBlankState(name));
        } else {
            mutate((draft) => ({ ...draft, businessName: name, mode: 'demo', onboardingCompleted: true }));
        }
        setOnboardingOpen(false);
        notify(blank ? 'Espacio creado. Agrega tu primer producto.' : 'Demo preparada. Puedes explorar y modificar los datos.');
    };

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
            stock: current ? current.stock : Number(data.get('stock') || 0),
            minStock: Number(data.get('minStock') || 0),
            unitCost: Number(data.get('unitCost') || 0),
            supplierId: String(data.get('supplierId') || '') || undefined,
            active: true,
            createdAt: current?.createdAt || stamp,
            updatedAt: stamp
        };
        if (!next.name) return;
        mutate((draft) => ({
            ...draft,
            products: current ? draft.products.map((item) => item.id === current.id ? next : item) : [...draft.products, next]
        }));
        setProductModal({ open: false });
        notify(current ? `${next.name}: ficha actualizada.` : `${next.name}: producto agregado.`);
    };

    const openPurchase = (productId?: string, quantity?: number) => {
        setPurchaseDraft({ productId, quantity });
        setPurchaseOpen(true);
    };

    const registerPurchase = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const productId = String(data.get('productId') || '');
        const quantity = Number(data.get('quantity') || 0);
        const unitCost = Number(data.get('unitCost') || 0);
        const date = String(data.get('date') || today());
        const product = state.products.find((item) => item.id === productId);
        if (!product || quantity <= 0) return;
        const newStock = product.stock + quantity;
        mutate((draft) => ({
            ...draft,
            products: draft.products.map((item) => item.id === productId ? { ...item, stock: newStock, unitCost: unitCost || item.unitCost, updatedAt: new Date().toISOString() } : item),
            purchases: [{ id: makeId(), productId, quantity, unitCost: unitCost || product.unitCost, supplierId: String(data.get('supplierId') || '') || product.supplierId, date, notes: String(data.get('notes') || '') }, ...draft.purchases],
            movements: [{ id: makeId(), productId, type: 'compra', quantity, previousStock: product.stock, newStock, date, note: 'Compra registrada' }, ...draft.movements]
        }));
        setPurchaseOpen(false);
        setPurchaseDraft({});
        notify(`${product.name}: compra registrada. Nuevo stock ${decimal.format(newStock)} ${product.unit}.`);
    };

    const registerWaste = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const productId = String(data.get('productId') || '');
        const quantity = Number(data.get('quantity') || 0);
        const reason = String(data.get('reason') || 'Otro') as WasteReason;
        const date = String(data.get('date') || today());
        const product = state.products.find((item) => item.id === productId);
        if (!product || quantity <= 0) return;
        const safeQuantity = Math.min(quantity, product.stock);
        const newStock = Math.max(0, product.stock - safeQuantity);
        mutate((draft) => ({
            ...draft,
            products: draft.products.map((item) => item.id === productId ? { ...item, stock: newStock, updatedAt: new Date().toISOString() } : item),
            wastes: [{ id: makeId(), productId, quantity: safeQuantity, reason, date, notes: String(data.get('notes') || '') }, ...draft.wastes],
            movements: [{ id: makeId(), productId, type: 'merma', quantity: -safeQuantity, previousStock: product.stock, newStock, date, note: reason }, ...draft.movements]
        }));
        setWasteOpen(false);
        notify(quantity > product.stock ? `${product.name}: se descontó solo el stock disponible (${decimal.format(safeQuantity)} ${product.unit}).` : `${product.name}: merma registrada.`);
    };

    const registerAdjustment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!adjustProduct) return;
        const data = new FormData(event.currentTarget);
        const newStock = Math.max(0, Number(data.get('newStock') || 0));
        const note = String(data.get('note') || '').trim() || 'Ajuste manual de inventario';
        const difference = Number((newStock - adjustProduct.stock).toFixed(2));
        mutate((draft) => ({
            ...draft,
            products: draft.products.map((item) => item.id === adjustProduct.id ? { ...item, stock: newStock, updatedAt: new Date().toISOString() } : item),
            movements: [{ id: makeId(), productId: adjustProduct.id, type: 'ajuste', quantity: difference, previousStock: adjustProduct.stock, newStock, date: today(), note }, ...draft.movements]
        }));
        setAdjustProduct(null);
        notify(`${adjustProduct.name}: stock ajustado a ${decimal.format(newStock)} ${adjustProduct.unit}.`);
    };

    const saveSupplier = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const supplier: Supplier = {
            id: makeId(),
            name: String(data.get('name') || '').trim(),
            contactName: String(data.get('contactName') || '').trim(),
            phone: String(data.get('phone') || '').trim(),
            email: String(data.get('email') || '').trim(),
            notes: String(data.get('notes') || '').trim(),
            createdAt: new Date().toISOString()
        };
        if (!supplier.name) return;
        mutate((draft) => ({ ...draft, suppliers: [supplier, ...draft.suppliers] }));
        setSupplierOpen(false);
        notify(`${supplier.name}: proveedor guardado.`);
    };

    const importBackup = async (file?: File) => {
        if (!file) return;
        try {
            const parsed = JSON.parse(await file.text()) as CGEState;
            if (parsed.version !== 1 || !Array.isArray(parsed.products)) throw new Error('Formato inválido');
            setState({ ...parsed, onboardingCompleted: true, mode: parsed.mode || 'real' });
            notify('Respaldo restaurado correctamente.');
        } catch {
            window.alert('No pude leer este respaldo. Verifica que sea un archivo exportado desde Control Gastronómico Express.');
        }
    };

    const importInventoryCsv = async (file?: File) => {
        if (!file) return;
        try {
            const text = (await file.text()).replace(/^\uFEFF/, '').trim();
            const lines = text.split(/\r?\n/).filter(Boolean);
            if (lines.length < 2) throw new Error('Archivo vacío');
            const delimiter = (lines[0].match(/;/g) || []).length >= (lines[0].match(/,/g) || []).length ? ';' : ',';
            const headers = csvLine(lines[0], delimiter).map(normalizeHeader);
            const indexes = {
                name: headers.indexOf('producto'),
                category: headers.indexOf('categoria'),
                unit: headers.indexOf('unidad'),
                stock: headers.indexOf('stock'),
                minStock: headers.indexOf('stock minimo'),
                unitCost: headers.indexOf('costo unitario')
            };
            if (indexes.name < 0 || indexes.stock < 0 || indexes.minStock < 0 || indexes.unitCost < 0) throw new Error('Columnas requeridas ausentes');
            const stamp = new Date().toISOString();
            const imported = lines.slice(1).map((line) => {
                const row = csvLine(line, delimiter);
                const rawUnit = indexes.unit >= 0 ? String(row[indexes.unit] || 'unidad').toLowerCase() : 'unidad';
                const unit = units.includes(rawUnit as ProductUnit) ? rawUnit as ProductUnit : 'unidad';
                const product: Product = {
                    id: makeId(),
                    name: String(row[indexes.name] || '').trim(),
                    category: indexes.category >= 0 ? String(row[indexes.category] || '').trim() || 'General' : 'General',
                    unit,
                    stock: Number(String(row[indexes.stock] || '0').replace(',', '.')) || 0,
                    minStock: Number(String(row[indexes.minStock] || '0').replace(',', '.')) || 0,
                    unitCost: Number(String(row[indexes.unitCost] || '0').replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0,
                    active: true,
                    createdAt: stamp,
                    updatedAt: stamp
                };
                return product;
            }).filter((item) => item.name);
            if (!imported.length) throw new Error('Sin productos válidos');
            mutate((draft) => {
                const byName = new Map(draft.products.map((item) => [item.name.trim().toLowerCase(), item]));
                imported.forEach((item) => {
                    const current = byName.get(item.name.trim().toLowerCase());
                    byName.set(item.name.trim().toLowerCase(), current ? { ...current, ...item, id: current.id, createdAt: current.createdAt } : item);
                });
                return { ...draft, products: Array.from(byName.values()) };
            });
            notify(`${imported.length} productos procesados desde CSV.`);
        } catch {
            window.alert('No pude importar el CSV. Usa las columnas Producto, Categoría, Unidad, Stock, Stock mínimo y Costo unitario.');
        } finally {
            if (csvRef.current) csvRef.current.value = '';
        }
    };

    const deleteProduct = (product: Product) => {
        if (!window.confirm(`¿Eliminar “${product.name}”? El historial de movimientos se conservará.`)) return;
        mutate((draft) => ({ ...draft, products: draft.products.filter((item) => item.id !== product.id) }));
        notify(`${product.name}: producto eliminado.`);
    };

    const selectedPurchaseProduct = products.find((item) => item.id === purchaseDraft.productId);

    return <>
        <Head>
            <title>Control Gastronómico Express — JoinHook</title>
            <meta name="description" content="Beta local-first para inventario, compras, mermas y proveedores de pequeños negocios gastronómicos." />
            <meta name="robots" content="noindex,nofollow" />
            <meta name="theme-color" content="#eee8dc" />
        </Head>

        <main className="cge-app">
            <aside className="cge-sidebar">
                <Link className="cge-logo" href="/" aria-label="Volver a JoinHook"><span>JH</span><div><strong>Control</strong><small>Gastronómico Express</small></div></Link>
                <nav>
                    {views.map((item) => <button type="button" key={item.key} className={view === item.key ? 'is-active' : ''} onClick={() => setView(item.key)}><CGEIcon name={item.key} /><span><strong>{item.label}</strong><small>{item.caption}</small></span></button>)}
                </nav>
                <div className="cge-sidebar-foot"><span className="cge-local-dot" /><div><strong>Local-first · {state.mode === 'real' ? 'Uso real' : 'Demo'}</strong><small>Guardado en este dispositivo</small></div></div>
            </aside>

            <section className="cge-main">
                <header className="cge-topbar">
                    <div><span className="cge-kicker">JoinHook · Beta 0.3</span><h1>{views.find((item) => item.key === view)?.label}</h1></div>
                    <div className="cge-top-actions"><div className="cge-business"><small>Negocio</small><input value={state.businessName} onChange={(event) => mutate((draft) => ({ ...draft, businessName: event.target.value }))} aria-label="Nombre del negocio" /></div><button type="button" className="cge-avatar" title="Proyecto local de prueba">FC</button></div>
                </header>

                {notice && <div className="cge-toast" role="status"><span>✓</span>{notice}</div>}

                {view === 'resumen' && <>
                    <section className="cge-welcome"><div><span>Buenos datos, mejores decisiones.</span><h2>{state.businessName || 'Mi negocio gastronómico'}</h2><p>Una vista simple de stock, compras y pérdidas. Sin convertir la operación en otro problema.</p></div><div className="cge-welcome-actions"><button type="button" className="cge-btn cge-btn-primary" onClick={() => openPurchase()}><CGEIcon name="plus" /> Registrar compra</button><button type="button" className="cge-btn" onClick={() => setWasteOpen(true)}>Registrar merma</button></div></section>
                    <section className="cge-stats"><CGEStatCard label="Valor inventario" value={money.format(metrics.inventoryValue)} detail={`${products.length} productos registrados`} tone="sage"/><CGEStatCard label="Stock crítico" value={String(metrics.critical).padStart(2, '0')} detail="productos por revisar" tone={metrics.critical ? 'clay' : 'sage'}/><CGEStatCard label="Compras registradas" value={money.format(metrics.purchases)} detail="acumulado de la beta" tone="gold"/><CGEStatCard label="Costo de merma" value={money.format(metrics.wasteCost)} detail={`${decimal.format(metrics.wasteRate)}% sobre unidades compradas`} tone="stone"/></section>
                    <section className="cge-dashboard-grid">
                        <article className="cge-panel cge-stock-panel"><header><div><small>Atención</small><h3>Stock que necesita revisión</h3></div><button type="button" onClick={() => setView('inventario')}>Ver inventario <CGEIcon name="chevron" /></button></header>{criticalProducts.length ? <div className="cge-critical-list">{criticalProducts.slice(0, 5).map((item) => { const pct = Math.min(100, (item.stock / Math.max(item.minStock, 1)) * 100); return <button type="button" key={item.id} onClick={() => setAdjustProduct(item)}><div className="cge-product-symbol">{item.name.slice(0, 2).toUpperCase()}</div><div><strong>{item.name}</strong><small>{item.category}</small></div><div className="cge-stock-meter"><span><i style={{ width: `${pct}%` }} /></span><small>{decimal.format(item.stock)} / mín. {decimal.format(item.minStock)} {item.unit}</small></div><CGEBadge tone={item.stock === 0 ? 'danger' : 'warn'}>{item.stock === 0 ? 'Sin stock' : 'Bajo'}</CGEBadge></button>})}</div> : <CGEEmpty title="Todo bajo control" text="No hay productos bajo el stock mínimo." />}</article>
                        <article className="cge-panel cge-movement-panel"><header><div><small>Actividad</small><h3>Últimos movimientos</h3></div></header>{recentMovements.length ? <div className="cge-movement-list">{recentMovements.map((movement) => { const product = products.find((item) => item.id === movement.productId); return <div key={movement.id}><span className={`cge-movement-dot ${movement.type}`} /><div><strong>{product?.name || 'Producto eliminado'}</strong><small>{movement.note || movement.type}</small></div><div><strong className={movement.quantity >= 0 ? 'positive' : 'negative'}>{movement.quantity >= 0 ? '+' : ''}{decimal.format(movement.quantity)}</strong><small>{dateFmt.format(new Date(movement.date + 'T12:00:00'))}</small></div></div>})}</div> : <CGEEmpty title="Todavía sin movimientos" text="Registra una compra, merma o ajuste para comenzar el historial." />}</article>
                    </section>

                    <section className="cge-panel cge-suggestions">
                        <header><div><small>Reposición simple</small><h3>Compra sugerida</h3><p>Regla inicial: llevar los productos críticos a 2× su stock mínimo. No es un pronóstico de demanda.</p></div>{suggestions.length > 0 && <button type="button" onClick={() => downloadSuggestions(suggestions)}>Descargar CSV</button>}</header>
                        {suggestions.length ? <div className="cge-suggestion-list">{suggestions.slice(0, 6).map((item) => <div key={item.product.id}><div className="cge-product-symbol">{item.product.name.slice(0, 2).toUpperCase()}</div><div><strong>{item.product.name}</strong><small>Actual {decimal.format(item.product.stock)} · mínimo {decimal.format(item.product.minStock)} {item.product.unit}</small></div><div><small>Sugerencia</small><strong>{decimal.format(item.quantity)} {item.product.unit}</strong></div><div><small>Estimado</small><strong>{money.format(item.estimatedCost)}</strong></div><button type="button" onClick={() => openPurchase(item.product.id, item.quantity)}>Registrar</button></div>)}</div> : <CGEEmpty title="No necesitas reponer según mínimos" text="Cuando un producto llegue a su stock mínimo aparecerá aquí." />}
                    </section>

                    <section className="cge-quick-grid"><button type="button" onClick={() => setProductModal({ open: true })}><span><CGEIcon name="inventario" /></span><div><strong>Nuevo producto</strong><small>Agregar al inventario</small></div><CGEIcon name="chevron" /></button><button type="button" onClick={() => setSupplierOpen(true)}><span><CGEIcon name="proveedores" /></span><div><strong>Nuevo proveedor</strong><small>Guardar contacto</small></div><CGEIcon name="chevron" /></button><button type="button" onClick={() => csvRef.current?.click()}><span>CSV</span><div><strong>Cargar inventario</strong><small>Importar desde Excel/Sheets</small></div><CGEIcon name="chevron" /></button></section>
                </>}

                {view === 'inventario' && <section className="cge-view"><div className="cge-view-tools"><div className="cge-search"><CGEIcon name="search"/><input placeholder="Buscar producto o categoría…" value={search} onChange={(event) => setSearch(event.target.value)} /></div><div className="cge-tool-actions"><button className="cge-btn" type="button" onClick={() => csvRef.current?.click()}>Importar CSV</button><button className="cge-btn cge-btn-primary" type="button" onClick={() => setProductModal({ open: true })}><CGEIcon name="plus"/> Nuevo producto</button></div></div><div className="cge-table-wrap"><table className="cge-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Mínimo</th><th>Costo unit.</th><th>Valor</th><th>Estado</th><th /></tr></thead><tbody>{filteredProducts.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{suppliers.find((s) => s.id === item.supplierId)?.name || 'Sin proveedor'}</small></td><td>{item.category}</td><td>{decimal.format(item.stock)} {item.unit}</td><td>{decimal.format(item.minStock)} {item.unit}</td><td>{money.format(item.unitCost)}</td><td><strong>{money.format(item.stock * item.unitCost)}</strong></td><td><CGEBadge tone={item.stock === 0 ? 'danger' : item.stock <= item.minStock ? 'warn' : 'good'}>{item.stock === 0 ? 'Sin stock' : item.stock <= item.minStock ? 'Revisar' : 'Correcto'}</CGEBadge></td><td><div className="cge-row-actions"><button type="button" onClick={() => setAdjustProduct(item)}>Ajustar</button><button type="button" onClick={() => setProductModal({ open: true, product: item })}>Editar</button><button type="button" className="danger" onClick={() => deleteProduct(item)}>Eliminar</button></div></td></tr>)}</tbody></table>{!filteredProducts.length && <CGEEmpty title="No encontré productos" text="Prueba con otra búsqueda o crea uno nuevo." />}</div></section>}

                {view === 'compras' && <section className="cge-view"><div className="cge-view-tools"><div><span className="cge-kicker">Entradas de mercadería</span><h2>Compras registradas</h2></div><button className="cge-btn cge-btn-primary" type="button" onClick={() => openPurchase()}><CGEIcon name="plus"/> Registrar compra</button></div>{state.purchases.length ? <div className="cge-card-list">{state.purchases.map((item) => { const product = products.find((p) => p.id === item.productId); return <article key={item.id}><div className="cge-product-symbol">{product?.name.slice(0,2).toUpperCase() || '—'}</div><div><strong>{product?.name || 'Producto eliminado'}</strong><small>{suppliers.find((s) => s.id === item.supplierId)?.name || 'Compra sin proveedor'}</small></div><div><small>Cantidad</small><strong>{decimal.format(item.quantity)} {product?.unit}</strong></div><div><small>Costo unitario</small><strong>{money.format(item.unitCost)}</strong></div><div><small>Total</small><strong>{money.format(item.quantity * item.unitCost)}</strong></div><time>{dateFmt.format(new Date(item.date + 'T12:00:00'))}</time></article>})}</div> : <CGEEmpty title="Aún no has registrado compras" text="La primera compra actualizará automáticamente el stock del producto." />}</section>}

                {view === 'mermas' && <section className="cge-view"><div className="cge-view-tools"><div><span className="cge-kicker">Pérdidas controladas</span><h2>Mermas registradas</h2></div><button className="cge-btn cge-btn-clay" type="button" onClick={() => setWasteOpen(true)}><CGEIcon name="plus"/> Registrar merma</button></div>{state.wastes.length ? <div className="cge-card-list">{state.wastes.map((item) => { const product = products.find((p) => p.id === item.productId); return <article key={item.id}><div className="cge-product-symbol clay">{product?.name.slice(0,2).toUpperCase() || '—'}</div><div><strong>{product?.name || 'Producto eliminado'}</strong><small>{item.reason}</small></div><div><small>Cantidad</small><strong>{decimal.format(item.quantity)} {product?.unit}</strong></div><div><small>Costo estimado</small><strong>{money.format(item.quantity * (product?.unitCost || 0))}</strong></div><div className="cge-notes"><small>{item.notes || 'Sin observaciones'}</small></div><time>{dateFmt.format(new Date(item.date + 'T12:00:00'))}</time></article>})}</div> : <CGEEmpty title="Todavía no hay mermas" text="Registrarlas ayuda a entender dónde se pierde producto y dinero." />}</section>}

                {view === 'proveedores' && <section className="cge-view"><div className="cge-view-tools"><div><span className="cge-kicker">Red de abastecimiento</span><h2>Proveedores</h2></div><button className="cge-btn cge-btn-primary" type="button" onClick={() => setSupplierOpen(true)}><CGEIcon name="plus"/> Nuevo proveedor</button></div>{suppliers.length ? <div className="cge-supplier-grid">{suppliers.map((item) => <article className="cge-panel" key={item.id}><div className="cge-supplier-head"><span>{item.name.slice(0,2).toUpperCase()}</span><CGEBadge>{products.filter((p) => p.supplierId === item.id).length} productos</CGEBadge></div><h3>{item.name}</h3><p>{item.contactName || 'Sin persona de contacto'}</p><div className="cge-supplier-data"><span><small>Teléfono</small><strong>{item.phone || '—'}</strong></span><span><small>Correo</small><strong>{item.email || '—'}</strong></span></div></article>)}</div> : <CGEEmpty title="Sin proveedores todavía" text="Agrega proveedores para asociarlos a productos y compras." />}</section>}

                {view === 'respaldo' && <section className="cge-view"><div className="cge-backup-hero cge-panel"><div><span className="cge-kicker">Tus datos son tuyos</span><h2>Respalda antes de cambiar de dispositivo.</h2><p>Esta beta guarda todo localmente en este navegador. Puedes descargar un respaldo completo, exportar/importar inventario por CSV o recuperar un archivo anterior.</p></div><div className="cge-backup-mark"><CGEIcon name="respaldo"/></div></div><div className="cge-backup-grid"><button type="button" onClick={() => downloadBackup(state)}><span><CGEIcon name="respaldo"/></span><strong>Descargar respaldo</strong><small>Productos, compras, mermas y proveedores en JSON.</small></button><button type="button" onClick={() => exportInventoryCsv(state)}><span>CSV</span><strong>Exportar inventario</strong><small>Archivo compatible con Excel y Google Sheets.</small></button><button type="button" onClick={() => csvRef.current?.click()}><span>↥</span><strong>Importar inventario CSV</strong><small>Agrega o actualiza productos por nombre.</small></button><button type="button" onClick={() => backupRef.current?.click()}><span>↥</span><strong>Restaurar respaldo</strong><small>Reemplaza los datos actuales con un respaldo válido.</small></button><button type="button" className="danger" onClick={() => { if (window.confirm('¿Volver a los datos de demostración? Se perderán los datos actuales de este navegador.')) { resetState(); const demo = createDemoState(); setState({ ...demo, onboardingCompleted: true, businessName: state.businessName || 'Mi negocio gastronómico' }); notify('Demo reiniciada.'); } }}><span>↺</span><strong>Reiniciar demo</strong><small>Volver al conjunto de datos inicial.</small></button></div><input ref={backupRef} hidden type="file" accept="application/json,.json" onChange={(event) => importBackup(event.target.files?.[0])}/><div className="cge-privacy-note"><CGEIcon name="alert"/><div><strong>Privacidad de la beta</strong><p>No se está enviando información del negocio a un servidor de JoinHook. Si luego activamos cuentas y sincronización, la arquitectura de seguridad y consentimiento se implementará antes de almacenar datos en la nube.</p></div></div></section>}
            </section>
        </main>

        <input ref={csvRef} hidden type="file" accept="text/csv,.csv" onChange={(event) => importInventoryCsv(event.target.files?.[0])} />

        {onboardingOpen && <CGEModal title="Prepara tu espacio" eyebrow="Primer inicio · 1 minuto" onClose={() => setOnboardingOpen(false)}><div className="cge-onboarding"><p>Control Gastronómico Express puede abrir con datos de ejemplo para explorar o completamente en blanco para comenzar con tu negocio.</p><CGEField label="Nombre del negocio"><input value={onboardingName} onChange={(event) => setOnboardingName(event.target.value)} placeholder="Ej. Cafetería del Lago" autoFocus /></CGEField><div className="cge-onboarding-options"><button type="button" onClick={() => finishOnboarding(false)}><span>Explorar</span><strong>Usar datos de ejemplo</strong><small>Ideal para conocer el flujo sin cargar información todavía.</small></button><button type="button" className="primary" onClick={() => finishOnboarding(true)}><span>Comenzar</span><strong>Crear espacio en blanco</strong><small>Para registrar desde cero tus productos y proveedores.</small></button></div><p className="cge-onboarding-note">En ambos casos los datos permanecen únicamente en este dispositivo durante esta beta.</p></div></CGEModal>}

        {productModal.open && <CGEModal title={productModal.product ? 'Editar producto' : 'Nuevo producto'} eyebrow="Inventario" onClose={() => setProductModal({ open: false })}><form className="cge-form" onSubmit={saveProduct} key={productModal.product?.id || 'new'}>{(() => { const defaults = productFormDefaults(productModal.product); return <><CGEField label="Nombre"><input name="name" required defaultValue={defaults.name} placeholder="Ej. Harina" autoFocus /></CGEField><div className="cge-form-grid"><CGEField label="Categoría"><input name="category" defaultValue={defaults.category} placeholder="Secos, lácteos…" /></CGEField><CGEField label="Unidad"><select name="unit" defaultValue={defaults.unit}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></CGEField></div>{productModal.product ? <div className="cge-stock-readonly"><div><small>Stock actual</small><strong>{decimal.format(productModal.product.stock)} {productModal.product.unit}</strong></div><button type="button" onClick={() => { setProductModal({ open: false }); setAdjustProduct(productModal.product || null); }}>Ajustar stock</button></div> : <CGEField label="Stock inicial"><input name="stock" type="number" min="0" step="0.01" required defaultValue={defaults.stock}/></CGEField>}<div className="cge-form-grid"><CGEField label="Stock mínimo"><input name="minStock" type="number" min="0" step="0.01" required defaultValue={defaults.minStock}/></CGEField><CGEField label="Costo unitario"><input name="unitCost" type="number" min="0" step="1" required defaultValue={defaults.unitCost}/></CGEField></div><CGEField label="Proveedor"><select name="supplierId" defaultValue={defaults.supplierId}><option value="">Sin proveedor</option>{suppliers.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setProductModal({ open: false })}>Cancelar</button><button className="cge-btn cge-btn-primary" type="submit">Guardar producto</button></div></>; })()}</form></CGEModal>}

        {purchaseOpen && <CGEModal title="Registrar compra" eyebrow="Entrada de mercadería" onClose={() => { setPurchaseOpen(false); setPurchaseDraft({}); }}><form className="cge-form" onSubmit={registerPurchase} key={`${purchaseDraft.productId || 'new'}-${purchaseDraft.quantity || 0}`}><CGEField label="Producto"><select name="productId" required defaultValue={purchaseDraft.productId || ''}><option value="" disabled>Selecciona un producto</option>{products.map((item) => <option value={item.id} key={item.id}>{item.name} · {decimal.format(item.stock)} {item.unit}</option>)}</select></CGEField><div className="cge-form-grid"><CGEField label="Cantidad"><input name="quantity" type="number" min="0.01" step="0.01" required defaultValue={purchaseDraft.quantity || ''} /></CGEField><CGEField label="Costo unitario"><input name="unitCost" type="number" min="0" step="1" required defaultValue={selectedPurchaseProduct?.unitCost || ''} /></CGEField></div><div className="cge-form-grid"><CGEField label="Proveedor"><select name="supplierId" defaultValue={selectedPurchaseProduct?.supplierId || ''}><option value="">Usar proveedor del producto</option>{suppliers.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></CGEField><CGEField label="Fecha"><input name="date" type="date" defaultValue={today()} required /></CGEField></div><CGEField label="Nota opcional"><textarea name="notes" rows={3} placeholder="Factura, condición, observación…" /></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => { setPurchaseOpen(false); setPurchaseDraft({}); }}>Cancelar</button><button className="cge-btn cge-btn-primary" type="submit">Registrar y sumar stock</button></div></form></CGEModal>}

        {wasteOpen && <CGEModal title="Registrar merma" eyebrow="Salida por pérdida" onClose={() => setWasteOpen(false)}><form className="cge-form" onSubmit={registerWaste}><CGEField label="Producto"><select name="productId" required defaultValue=""><option value="" disabled>Selecciona un producto</option>{products.filter((item) => item.stock > 0).map((item) => <option value={item.id} key={item.id}>{item.name} · disponible {decimal.format(item.stock)} {item.unit}</option>)}</select></CGEField><div className="cge-form-grid"><CGEField label="Cantidad"><input name="quantity" type="number" min="0.01" step="0.01" required /></CGEField><CGEField label="Causa"><select name="reason" defaultValue="Preparación">{wasteReasons.map((reason) => <option key={reason}>{reason}</option>)}</select></CGEField></div><CGEField label="Fecha"><input name="date" type="date" defaultValue={today()} required /></CGEField><CGEField label="Observación"><textarea name="notes" rows={3} placeholder="Qué ocurrió y cómo podría evitarse…" /></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setWasteOpen(false)}>Cancelar</button><button className="cge-btn cge-btn-clay" type="submit">Registrar y descontar stock</button></div></form></CGEModal>}

        {adjustProduct && <CGEModal title={`Ajustar ${adjustProduct.name}`} eyebrow="Corrección de inventario" onClose={() => setAdjustProduct(null)}><form className="cge-form" onSubmit={registerAdjustment}><div className="cge-stock-readonly"><div><small>Stock registrado</small><strong>{decimal.format(adjustProduct.stock)} {adjustProduct.unit}</strong></div><CGEBadge tone={adjustProduct.stock <= adjustProduct.minStock ? 'warn' : 'good'}>{adjustProduct.stock <= adjustProduct.minStock ? 'Bajo mínimo' : 'Correcto'}</CGEBadge></div><CGEField label="Nuevo stock"><input name="newStock" type="number" min="0" step="0.01" required defaultValue={adjustProduct.stock} autoFocus /></CGEField><CGEField label="Motivo del ajuste" hint="Quedará guardado en el historial."><textarea name="note" rows={3} required placeholder="Ej. Conteo físico, corrección de registro…" /></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setAdjustProduct(null)}>Cancelar</button><button className="cge-btn cge-btn-primary" type="submit">Guardar ajuste</button></div></form></CGEModal>}

        {supplierOpen && <CGEModal title="Nuevo proveedor" eyebrow="Abastecimiento" onClose={() => setSupplierOpen(false)}><form className="cge-form" onSubmit={saveSupplier}><CGEField label="Nombre comercial"><input name="name" required autoFocus placeholder="Ej. Distribuidora Sur" /></CGEField><CGEField label="Persona de contacto"><input name="contactName" placeholder="Nombre y apellido" /></CGEField><div className="cge-form-grid"><CGEField label="Teléfono"><input name="phone" placeholder="+56 9…" /></CGEField><CGEField label="Correo"><input name="email" type="email" placeholder="ventas@…" /></CGEField></div><CGEField label="Notas"><textarea name="notes" rows={3} placeholder="Días de despacho, mínimo de compra…" /></CGEField><div className="cge-form-actions"><button className="cge-btn" type="button" onClick={() => setSupplierOpen(false)}>Cancelar</button><button className="cge-btn cge-btn-primary" type="submit">Guardar proveedor</button></div></form></CGEModal>}
    </>;
}
