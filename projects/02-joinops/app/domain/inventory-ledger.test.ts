import { describe, expect, it } from 'vitest';
import {
  calculateInventoryBalance,
  compareFefo,
  signedInventoryQuantity,
  validateIssueAgainstBalance,
} from './inventory-ledger';

describe('inventory ledger', () => {
  it('signs receipts and issues correctly', () => {
    expect(signedInventoryQuantity({ movementType: 'RECEIPT', quantity: 10 })).toBe(10);
    expect(signedInventoryQuantity({ movementType: 'WASTE', quantity: 2 })).toBe(-2);
  });

  it('calculates balance from append-only movements', () => {
    expect(
      calculateInventoryBalance([
        { movementType: 'RECEIPT', quantity: 20 },
        { movementType: 'SALE', quantity: 3 },
        { movementType: 'CONSUMPTION', quantity: 2 },
      ]),
    ).toBe(15);
  });

  it('rejects issuing more than the available balance', () => {
    expect(() => validateIssueAgainstBalance(5, 6)).toThrow('Insufficient inventory balance');
  });

  it('orders dated lots by FEFO and undated lots last', () => {
    expect(compareFefo({ expiresAt: '2026-09-20' }, { expiresAt: '2026-09-25' })).toBeLessThan(0);
    expect(compareFefo({ expiresAt: null }, { expiresAt: '2026-09-25' })).toBeGreaterThan(0);
  });
});
