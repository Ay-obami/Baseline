export const MAX_CENTS = 1_000_000_000_000n;
export const BPS_DENOMINATOR = 10_000n;

export type Money = bigint;

export function parseMoney(input: string): Money {
  if (!/^(0|[1-9][0-9]*)$/.test(input)) {
    throw new Error('Money must be a canonical nonnegative base-10 integer string');
  }
  const value = BigInt(input);
  if (value > MAX_CENTS) throw new Error('Money exceeds MAX_CENTS');
  return value;
}

export function validateBps(bps: bigint): bigint {
  if (bps < 0n || bps > BPS_DENOMINATOR) {
    throw new Error('Basis points must be between 0 and 10000');
  }
  return bps;
}

export function creditContribution(amount: Money, bps: bigint): Money {
  if (amount < 0n || amount > MAX_CENTS) throw new Error('Invalid amount');
  validateBps(bps);
  return (amount * bps) / BPS_DENOMINATOR;
}

export function creditLimit(borrowingBase: Money, facilityLimit: Money): Money {
  if (borrowingBase < 0n || facilityLimit < 0n) throw new Error('Negative credit input');
  return borrowingBase < facilityLimit ? borrowingBase : facilityLimit;
}

export function signedHeadroom(limit: Money, principal: Money): bigint {
  if (limit < 0n || principal < 0n) throw new Error('Negative credit input');
  return limit - principal;
}

export function availableToDraw(limit: Money, principal: Money, current = true, paused = false): Money {
  if (!current || paused) return 0n;
  const headroom = signedHeadroom(limit, principal);
  return headroom > 0n ? headroom : 0n;
}

export function deficiency(limit: Money, principal: Money): Money {
  const headroom = signedHeadroom(limit, principal);
  return headroom < 0n ? -headroom : 0n;
}
