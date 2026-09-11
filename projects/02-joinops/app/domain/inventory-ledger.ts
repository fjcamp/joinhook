export type InventoryMovementType =
  | 'RECEIPT'
  | 'ISSUE'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'SALE'
  | 'WASTE'
  | 'RETURN_TO_SUPPLIER'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'CONSUMPTION';

export type InventoryMovement = {
  movementType: InventoryMovementType;
  quantity: number;
};

const positive = new Set<InventoryMovementType>([
  'RECEIPT',
  'TRANSFER_IN',
  'ADJUSTMENT_IN',
]);

const negative = new Set<InventoryMovementType>([
  'ISSUE',
  'TRANSFER_OUT',
  'SALE',
  'WASTE',
  'RETURN_TO_SUPPLIER',
  'ADJUSTMENT_OUT',
  'CONSUMPTION',
]);

export function signedInventoryQuantity(movement: InventoryMovement): number {
  if (!Number.isFinite(movement.quantity) || movement.quantity <= 0) {
    throw new Error('Inventory movement quantity must be greater than zero');
  }
  if (positive.has(movement.movementType)) return movement.quantity;
  if (negative.has(movement.movementType)) return -movement.quantity;
  throw new Error(`Unsupported inventory movement type: ${movement.movementType}`);
}

export function calculateInventoryBalance(movements: InventoryMovement[]): number {
  return movements.reduce((balance, movement) => balance + signedInventoryQuantity(movement), 0);
}

export function validateIssueAgainstBalance(balance: number, quantity: number): void {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Issue quantity must be greater than zero');
  }
  if (quantity > balance) {
    throw new Error('Insufficient inventory balance');
  }
}

export function compareFefo(
  a: { expiresAt?: string | null },
  b: { expiresAt?: string | null },
): number {
  if (!a.expiresAt && !b.expiresAt) return 0;
  if (!a.expiresAt) return 1;
  if (!b.expiresAt) return -1;
  return a.expiresAt.localeCompare(b.expiresAt);
}
