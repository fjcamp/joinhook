import { CGEState, Product, Supplier } from './types';

export const CGE_STORAGE_KEY = 'joinhook.cge.state.v1';

const now = () => new Date().toISOString();
const id = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

function supplier(name: string, contactName: string, phone: string): Supplier {
    return { id: id(), name, contactName, phone, createdAt: now() };
}

function product(name: string, category: string, unit: Product['unit'], stock: number, minStock: number, unitCost: number, supplierId?: string): Product {
    const timestamp = now();
    return { id: id(), name, category, unit, stock, minStock, unitCost, supplierId, active: true, createdAt: timestamp, updatedAt: timestamp };
}

export function createDemoState(): CGEState {
    const s1 = supplier('Distribuidora Sur', 'Camila Rojas', '+56 9 5555 0101');
    const s2 = supplier('Frutas y Verduras Villarrica', 'Luis Muñoz', '+56 9 5555 0102');
    const s3 = supplier('Lácteos del Lago', 'Andrea Soto', '+56 9 5555 0103');

    const products = [
        product('Harina', 'Secos', 'kg', 18, 12, 980, s1.id),
        product('Azúcar', 'Secos', 'kg', 8, 10, 1120, s1.id),
        product('Mantequilla', 'Refrigerados', 'kg', 4.5, 5, 7490, s3.id),
        product('Crema', 'Refrigerados', 'l', 7, 4, 3650, s3.id),
        product('Frutilla', 'Frutas', 'kg', 3.2, 4, 4290, s2.id),
        product('Chocolate cobertura', 'Pastelería', 'kg', 9, 5, 8990, s1.id)
    ];

    return {
        version: 1,
        businessName: 'Mi negocio gastronómico',
        products,
        suppliers: [s1, s2, s3],
        purchases: [],
        wastes: [],
        movements: [],
        lastSavedAt: now()
    };
}

export function loadState(): CGEState {
    if (typeof window === 'undefined') return createDemoState();
    const raw = window.localStorage.getItem(CGE_STORAGE_KEY);
    if (!raw) return createDemoState();
    try {
        const parsed = JSON.parse(raw) as CGEState;
        return parsed?.version === 1 ? parsed : createDemoState();
    } catch {
        return createDemoState();
    }
}

export function saveState(state: CGEState) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CGE_STORAGE_KEY, JSON.stringify({ ...state, lastSavedAt: now() }));
}

export function resetState() {
    if (typeof window !== 'undefined') window.localStorage.removeItem(CGE_STORAGE_KEY);
}

export function makeId() {
    return id();
}

export function downloadBackup(state: CGEState) {
    if (typeof window === 'undefined') return;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `control-gastronomico-express-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

export function exportInventoryCsv(state: CGEState) {
    if (typeof window === 'undefined') return;
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [
        ['Producto', 'Categoría', 'Unidad', 'Stock', 'Stock mínimo', 'Costo unitario', 'Valor inventario'],
        ...state.products.map((item) => [item.name, item.category, item.unit, item.stock, item.minStock, item.unitCost, item.stock * item.unitCost])
    ];
    const csv = '\ufeff' + rows.map((row) => row.map(escape).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `inventario-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}
