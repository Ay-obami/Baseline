import {
  creditContribution,
  creditLimit,
  signedHeadroom,
  availableToDraw,
  deficiency,
} from './money.ts';

export const CENTS_PER_DOLLAR = 100n;
export const ONE_MILLION_DOLLARS = 1_000_000n * CENTS_PER_DOLLAR;
export const ADVANCE_BPS = 8000n;
export const FACILITY_LIMIT = 40n * ONE_MILLION_DOLLARS;
export const INITIAL_PRINCIPAL = 35n * ONE_MILLION_DOLLARS;
export const FUNDED_RESERVE = 10n * ONE_MILLION_DOLLARS;
export const INSUFFICIENT_RESERVE = 2n * ONE_MILLION_DOLLARS;
export const RESERVE_FLOOR = 1n * ONE_MILLION_DOLLARS;
export const MANDATE_CAP = 5n * ONE_MILLION_DOLLARS;

export const initialEligible = {
  alpha: 20n * ONE_MILLION_DOLLARS,
  beta: 10n * ONE_MILLION_DOLLARS,
  gamma: 20n * ONE_MILLION_DOLLARS,
} as const;

export const postEventEligible = {
  ...initialEligible,
  beta: 0n,
} as const;

export function computeBase(positions: Record<string, bigint>): bigint {
  return Object.values(positions)
    .map((amount) => creditContribution(amount, ADVANCE_BPS))
    .reduce((sum, amount) => sum + amount, 0n);
}

export function fixtureSnapshot(positions: Record<string, bigint>, principal = INITIAL_PRINCIPAL) {
  const borrowingBase = computeBase(positions);
  const limit = creditLimit(borrowingBase, FACILITY_LIMIT);
  return {
    borrowingBase,
    creditLimit: limit,
    principal,
    headroom: signedHeadroom(limit, principal),
    available: availableToDraw(limit, principal),
    deficiency: deficiency(limit, principal),
  };
}
