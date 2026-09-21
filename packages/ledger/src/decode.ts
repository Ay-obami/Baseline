import { parseMoney, type Money } from './money.ts';

export type MoneyJson = string;

export function encodeMoney(value: Money): MoneyJson {
  if (value < 0n) throw new Error('Money cannot be negative');
  return value.toString(10);
}

export function decodeMoney(value: unknown): Money {
  if (typeof value !== 'string') {
    throw new Error('Money JSON value must be a decimal string');
  }
  return parseMoney(value);
}

export function roundTripMoneyJson(value: Money): Money {
  return decodeMoney(JSON.parse(JSON.stringify(encodeMoney(value))));
}
