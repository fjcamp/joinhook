import { CGEMode, CGEState, Movement, Product, Purchase, Supplier, Waste } from './types';

export const CGE_STORAGE_KEY = 'joinhook.cge.state.v1';

const now = () => new Date().toISOString();
const id = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const productUnits: Product['unit'][] = ['kg', 'g', 'l', 'ml', 'unidad', 'caja', 'bolsa'];
const wasteReasons: Waste['reason'][] = ['Vencimiento', 'Preparación', 'Daño', 'Error de producción', 'Cortesía', 'Otro'];
const movementTypes: Movement['type'][] = ['compra', 'merma', 'ajuste'];
const modes: CGEMode[] = ['demo', 'real'];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function isOptionalString(value: unknown): value is string | undefined {
    return value === undefined || isString(value);
}

function isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

function isNonNegativeNumber(value: unknown): value is number {
    return isFiniteNumber(value) && value >= 0;
}

function isDate(value: unknown): value is string {
    return isString(value) && datePattern.test(value);
}

function isProduct(value: unknown): value is Product {
    if (!isRecord(value)) return false;
    return isString(value.id)
        && isString(value.name)
        && isString(value.category)
        && productUnits.includes(value.unit as Product['unit'])
        && isNonNegativeNumber(value.stock)
        && isNonNegativeNumber(value.minStock)
        && isNonNegativeNumber(value.unitCost)
        && isOptionalString(value.supplierId)
        && typeof value.active === 'boolean'
        && isString(value.createdAt)
        && isString(value.updatedAt);
}

function isSupplier(value: unknown): value is Supplier {
    if (!isRecord(value)) return false;
    return isString(value.id)
        && isString(value.name)
        && isOptionalString(value.contactName)
        && isOptionalString(value.phone)
        && isOptionalString(value.email)
        && isOptionalString(value.notes)
        && isString(value.createdAt);
}

function isPurchase(value: unknown): value is Purchase {
    if (!isRecord(value)) return false;
    return isString(value.id)
        && isString(value.productId)
        && isFiniteNumber(value.quantity)
        && value.quantity > 0
        && isNonNegativeNumber(value.unitCost)
        && isOptionalString(value.supplierId)
        && isDate(value.date)
        && isOptionalString(value.notes);
}

function isWaste(value: unknown): value is Waste {
    if (!isRecord(value)) return false;
    return isString(value.id)
        && isString(value.productId)
        && isFiniteNumber(value.quantity)
        && value.quantity > 0
        && wasteReasons.includes(value.reason as Waste['reason'])
        && isDate(value.date)
        && isOptionalString(value.notes);
}

function isMovement(value: unknown): value is Movement {
    if (!isRecord(value)) return false;
    return isString(value.id)
        && isString(value.productId)
        && movementTypes.includes(value.type as Movement['type'])
        && isFiniteNumber(value.quantity)
        && isNonNegativeNumber(value.previousStock)
        && isNonNegativeNumber(value.newStock)
        && isDate(value.date)
        && isOptionalString(value.note);
}

export function normalizeCGEState(input: unknown, fallbackMode: CGEMode = 'demo'): CGEState | null {
    if (!isRecord(input) || input.version !== 1) return null;
    if (!Array.isArray(input.products) || !input.products.every(isProduct)) return null;
    if (!Array.isArray(input.suppliers) || !input.suppliers.every(isSupplier)) return null;
    if (!Array.isArray(input.purchases) || !input.purchases.every(isPurchase)) return null;
    if (!Array.isArray(input.wastes) || !input.wastes.every(isWaste)) return null;
    if (!Array.isArray(input.movements) || !input.movements.every(isMovement)) return null;

    const mode = modes.includes(input.mode as CGEMode) ? input.mode as CGEMode : fallbackMode;
    return {
        version: 1,
        businessName: isString(input.businessName) ? input.businessName : '',
        mode,
        onboardingCompleted: typeof input.onboardingCompleted === 'boolean' ? input.onboardingCompleted : false,
        products: input.products,
        suppliers: input.suppliers,
        purchases: input.purchases,
        wastes: input.wastes,
        movements: input.movements,
        lastSavedAt: isOptionalString(input.lastSavedAt) ? input.lastSavedAt : undefined
    };
}

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
        businessName: '',
        mode: 'demo',
        onboardingCompleted: false,
        products,
        suppliers: [s1, s2, s3],
        purchases: [],
        wastes: [],
        movements: [],
        lastSavedAt: now()
    };
}

export function createBlankState(businessName = ''): CGEState {
    return {
        version: 1,
        businessName,
        mode: 'real',
        onboardingCompleted: true,
        products: [],
        suppliers: [],
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
        return normalizeCGEState(JSON.parse(raw), 'demo') || createDemoState();
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
