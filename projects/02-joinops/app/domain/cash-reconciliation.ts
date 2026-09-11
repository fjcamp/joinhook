export type CashMovementForReconciliation = {
  movement_type: 'OPENING' | 'SALE' | 'REFUND' | 'CASH_IN' | 'CASH_OUT';
  amount_minor: number;
};

export type CashReconciliation = {
  expectedAmount: number;
  countedAmount: number;
  varianceAmount: number;
  status: 'BALANCED' | 'OVER' | 'SHORT';
};

/**
 * Calculates the operational cash position from the opening float and
 * subsequent movements. OPENING is ignored because openingAmount is the
 * canonical opening balance; this also keeps compatibility with sessions
 * created before the opening movement was recorded.
 */
export function reconcileCash(
  openingAmount: number,
  countedAmount: number,
  movements: CashMovementForReconciliation[],
): CashReconciliation {
  if (!Number.isSafeInteger(openingAmount) || openingAmount < 0) throw new Error('Invalid opening amount');
  if (!Number.isSafeInteger(countedAmount) || countedAmount < 0) throw new Error('Invalid counted amount');

  const movementDelta = movements
    .filter((movement) => movement.movement_type !== 'OPENING')
    .reduce((sum, movement) => sum + movement.amount_minor, 0);

  const expectedAmount = openingAmount + movementDelta;
  const varianceAmount = countedAmount - expectedAmount;
  const status = varianceAmount === 0 ? 'BALANCED' : varianceAmount > 0 ? 'OVER' : 'SHORT';

  return { expectedAmount, countedAmount, varianceAmount, status };
}
