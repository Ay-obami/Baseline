import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ONE_MILLION_DOLLARS as M,
  initialEligible,
  postEventEligible,
  fixtureSnapshot,
  FUNDED_RESERVE,
  INSUFFICIENT_RESERVE,
  RESERVE_FLOOR,
  MANDATE_CAP,
} from '../src/fixture.ts';

test('canonical initial fixture is exactly $40M base / $35M principal / $5M headroom', () => {
  const s = fixtureSnapshot(initialEligible);
  assert.deepEqual(s, {
    borrowingBase: 40n * M,
    creditLimit: 40n * M,
    principal: 35n * M,
    headroom: 5n * M,
    available: 5n * M,
    deficiency: 0n,
  });
});

test('Beta exclusion leaves commitment economics separate from facility eligibility', () => {
  assert.equal(initialEligible.beta, 10n * M);
  assert.equal(postEventEligible.beta, 0n);
  const s = fixtureSnapshot(postEventEligible);
  assert.equal(s.borrowingBase, 32n * M);
  assert.equal(s.headroom, -3n * M);
  assert.equal(s.available, 0n);
  assert.equal(s.deficiency, 3n * M);
});

test('demo reserve and mandate constants are internally consistent', () => {
  const cure = fixtureSnapshot(postEventEligible).deficiency;
  assert.equal(cure, 3n * M);
  assert.equal(FUNDED_RESERVE - cure, 7n * M);
  assert.ok(FUNDED_RESERVE - cure >= RESERVE_FLOOR);
  assert.ok(INSUFFICIENT_RESERVE - RESERVE_FLOOR < cure);
  assert.ok(cure <= MANDATE_CAP);
});
