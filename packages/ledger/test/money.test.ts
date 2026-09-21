import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CENTS,
  parseMoney,
  creditContribution,
  creditLimit,
  signedHeadroom,
  availableToDraw,
  deficiency,
} from '../src/money.ts';

const USD = 100n;
const M = 1_000_000n * USD;

test('parses canonical cent-denominated money without Number conversion', () => {
  assert.equal(parseMoney('300000000'), 300000000n);
  assert.throws(() => parseMoney('3e8'));
  assert.throws(() => parseMoney('300000000.00'));
  assert.throws(() => parseMoney('-1'));
  assert.throws(() => parseMoney('01'));
  assert.equal(parseMoney(MAX_CENTS.toString()), MAX_CENTS);
  assert.throws(() => parseMoney((MAX_CENTS + 1n).toString()));
});

test('computes rounded-down credit contributions', () => {
  assert.equal(creditContribution(20n * M, 8000n), 16n * M);
  assert.equal(creditContribution(10n * M, 8000n), 8n * M);
  assert.equal(creditContribution(1n, 8000n), 0n);
  assert.throws(() => creditContribution(10n * M, -1n));
  assert.throws(() => creditContribution(10n * M, 10001n));
});

test('matches the canonical BaseLine before/after fixture', () => {
  const beforeBase = [20n * M, 10n * M, 20n * M]
    .map((x) => creditContribution(x, 8000n))
    .reduce((a, b) => a + b, 0n);
  const afterBase = [20n * M, 0n, 20n * M]
    .map((x) => creditContribution(x, 8000n))
    .reduce((a, b) => a + b, 0n);
  const contractualLimit = 40n * M;
  const principal = 35n * M;

  assert.equal(beforeBase, 40n * M);
  assert.equal(afterBase, 32n * M);
  assert.equal(creditLimit(beforeBase, contractualLimit), 40n * M);
  assert.equal(creditLimit(afterBase, contractualLimit), 32n * M);
  assert.equal(signedHeadroom(40n * M, principal), 5n * M);
  assert.equal(signedHeadroom(32n * M, principal), -3n * M);
  assert.equal(deficiency(32n * M, principal), 3n * M);
  assert.equal(availableToDraw(32n * M, principal), 0n);
  assert.equal(availableToDraw(40n * M, principal, false, false), 0n);
});
