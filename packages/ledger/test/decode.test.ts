import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_CENTS } from '../src/money.ts';
import { decodeMoney, encodeMoney, roundTripMoneyJson } from '../src/decode.ts';

test('money JSON encoding stays a decimal string and preserves bigint exactly', () => {
  const value = 300000000n;
  const encoded = encodeMoney(value);
  assert.equal(typeof encoded, 'string');
  assert.equal(encoded, '300000000');
  assert.equal(roundTripMoneyJson(value), value);
  assert.equal(roundTripMoneyJson(MAX_CENTS), MAX_CENTS);
});

test('money JSON decoding rejects Number and noncanonical string forms', () => {
  assert.throws(() => decodeMoney(300000000));
  assert.throws(() => decodeMoney('300000000.00'));
  assert.throws(() => decodeMoney('3e8'));
  assert.throws(() => decodeMoney('-1'));
  assert.equal(decodeMoney('0'), 0n);
});
