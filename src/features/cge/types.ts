export type ProductUnit = 'kg' | 'g' | 'l' | 'ml' | 'unidad' | 'caja' | 'bolsa';

export type Product = {
    id: string;
    name: string;
    category: string;
    unit: ProductUnit;
    stock: number;
    minStock: number;
    unitCost: number;
    supplierId?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
};

export type Supplier = {
    id: string;
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    notes?: string;
    createdAt: string;
};

export type Purchase = {
    id: string;
    productId: string;
    quantity: number;
    unitCost: number;
    supplierId?: string;
    date: string;
    notes?: string;
};

export type WasteReason = 'Vencimiento' | 'Preparación' | 'Daño' | 'Error de producción' | 'Cortesía' | 'Otro';

export type Waste = {
    id: string;
    productId: string;
    quantity: number;
    reason: WasteReason;
    date: string;
    notes?: string;
};

export type MovementType = 'compra' | 'merma' | 'ajuste';

export type Movement = {
    id: string;
    productId: string;
    type: MovementType;
    quantity: number;
    previousStock: number;
    newStock: number;
    date: string;
    note?: string;
};

export type CGEMode = 'demo' | 'real';

export type CGEState = {
    version: 1;
    businessName: string;
    mode?: CGEMode;
    onboardingCompleted?: boolean;
    products: Product[];
    suppliers: Supplier[];
    purchases: Purchase[];
    wastes: Waste[];
    movements: Movement[];
    lastSavedAt?: string;
};

export type CGEView = 'resumen' | 'inventario' | 'compras' | 'mermas' | 'proveedores' | 'respaldo';
