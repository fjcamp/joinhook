import { describe, expect, it } from 'vitest';
import { allocateByFefo, orderLotsForIssue, validateReasonCode } from './inventory-policy';

describe('inventory policy', () => {
  it('orders expiring lots before non-expiring lots', () => {
    const lots = orderLotsForIssue([
      { id: 'B', expiresAt: null, quantity: 10, status: 'AVAILABLE' },
      { id: 'C', expiresAt: '2026-10-10', quantity: 5, status: 'AVAILABLE' },
      { id: 'A', expiresAt: '2026-09-20', quantity: 3, status: 'AVAILABLE' },
    ], new Date('2026-09-11T12:00:00Z'));
    expect(lots.map((lot) => lot.id)).toEqual(['A', 'C', 'B']);
  });

  it('allocates deterministically across lots', () => {
    expect(allocateByFefo([
      { id: 'A', expiresAt: '2026-09-20', quantity: 3, status: 'AVAILABLE' },
      { id: 'B', expiresAt: '2026-10-20', quantity: 10, status: 'AVAILABLE' },
    ], 5, new Date('2026-09-11T12:00:00Z'))).toEqual([
      { lotId: 'A', quantity: 3 },
      { lotId: 'B', quantity: 2 },
    ]);
  });

  it('requires a note for controlled reasons', () => {
    expect(() => validateReasonCode({ code: 'WASTE_DAMAGED', requiresNote: true, active: true })).toThrow('REASON_NOTE_REQUIRED');
    expect(validateReasonCode({ code: 'WASTE_EXPIRED', requiresNote: false, active: true })).toBe(true);
  });
});
