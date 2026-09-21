import { spawnSync } from 'node:child_process';

const groups = {
  math: ['node', ['--test', '--experimental-strip-types', 'packages/ledger/test/money.test.ts', 'packages/ledger/test/fixture.test.ts', 'packages/ledger/test/decode.test.ts']],
};

const requested = process.argv[2] ?? 'all';
if (requested === 'all') {
  for (const name of Object.keys(groups)) run(name);
  process.exit(0);
}
if (!groups[requested]) {
  console.error(`Unknown verify group: ${requested}`);
  process.exit(2);
}
run(requested);

function run(name) {
  const [cmd, args] = groups[name];
  console.log(`
== verify:${name} ==`);
  const result = spawnSync(cmd, args, { cwd: process.cwd(), stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
