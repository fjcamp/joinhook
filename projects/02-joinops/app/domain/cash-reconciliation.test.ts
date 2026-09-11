import { describe, expect, it } from 'vitest';
import { reconcileCash } from './cash-reconciliation';

describe('reconcileCash', () => {
  it('is balanced when counted cash equals opening plus operational movements', () => {
    expect(
      reconcileCash(10000, 16500, [
        { movement_type: 'OPENING', amount_minor: 10000 },
        { movement_type: 'SALE', amount_minor: 5000 },
        { movement_type: 'CASH_IN', amount_minor: 1500 },
      ]),
    ).toEqual({ expectedAmount: 16500, countedAmount: 16500, varianceAmount: 0, status: 'BALANCED' });
  });

  it('calculates a shortage after an operational cash out', () => {
    expect(
      reconcileCash(10000, 14500, [
        { movement_type: 'SALE', amount_minor: 5000 },
        { movement_type: 'CASH_OUT', amount_minor: -500 },
      ]),
    ).toEqual({ expectedAmount: 14500, countedAmount: 14500, varianceAmount: 0, status: 'BALANCED' });
  });

  it('reports overage and shortage correctly', () => {
    expect(reconcileCash(10000, 16000, [{ movement_type: 'SALE', amount_minor: 5000 }])).toEqual({ expectedAmount: 15000, countedAmount: 16000, varianceAmount: 1000, status: 'OVER' });
    expect(reconcileCash(10000, 14000, [{ movement_type: 'SALE', amount_minor: 5000 }])).toEqual({ expectedAmount: 15000, countedAmount: 14000, varianceAmount: -1000, status: 'SHORT' });
  });
});
