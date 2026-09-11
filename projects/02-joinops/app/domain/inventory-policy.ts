export type InventoryLot = {
  id: string;
  expiresAt?: string | null;
  quantity: number;
  status: 'AVAILABLE' | 'BLOCKED' | 'EXPIRED' | 'DEPLETED';
};

export type ReasonCode = {
  code: string;
  requiresNote: boolean;
  active: boolean;
};

/**
 * FEFO is deterministic: available lots with an expiry date are consumed first,
 * then non-expiring lots. Ties are resolved by lot id so allocation is reproducible.
 */
export function orderLotsForIssue(lots: InventoryLot[], today = new Date()): InventoryLot[] {
  const date = today.toISOString().slice(0, 10);
  return [...lots]
    .filter((lot) => lot.status === 'AVAILABLE' && lot.quantity > 0)
    .filter((lot) => !lot.expiresAt || lot.expiresAt >= date)
    .sort((a, b) => {
      if (!a.expiresAt && !b.expiresAt) return a.id.localeCompare(b.id);
      if (!a.expiresAt) return 1;
      if (!b.expiresAt) return -1;
      return a.expiresAt.localeCompare(b.expiresAt) || a.id.localeCompare(b.id);
    });
}

export function allocateByFefo(lots: InventoryLot[], requested: number, today = new Date()) {
  if (!Number.isFinite(requested) || requested <= 0) throw new Error('REQUESTED_QUANTITY_INVALID');
  const ordered = orderLotsForIssue(lots, today);
  const total = ordered.reduce((sum, lot) => sum + lot.quantity, 0);
  if (total < requested) throw new Error('INSUFFICIENT_INVENTORY');

  let remaining = requested;
  return ordered.map((lot) => {
    const quantity = Math.min(lot.quantity, remaining);
    remaining -= quantity;
    return { lotId: lot.id, quantity };
  }).filter((allocation) => allocation.quantity > 0);
}

export function validateReasonCode(reason: ReasonCode | undefined, note?: string | null) {
  if (!reason || !reason.active) throw new Error('REASON_CODE_INVALID');
  if (reason.requiresNote && !note?.trim()) throw new Error('REASON_NOTE_REQUIRED');
  return true;
}
