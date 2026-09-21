# BaseLine

**Private commitments. Enforceable borrowing limits.**

BaseLine is a HackCanton Season 3 MVP exploring privacy-preserving fund-finance control on Canton. A pre-agreed private investor event can change eligibility, invalidate stale borrowing capacity, create a credit deficiency, and permit a bounded repayment while unrelated investors do not receive protected terms.

## Current status

Implementation has started at CP1/Task 2. The canonical scope and implementation plan live under `docs/`.

- ✅ Repository initialized
- ✅ Commercial fixture recorded
- ✅ TypeScript fixed-precision arithmetic tests passing
- ✅ DPM 1.0.22 + Daml SDK 3.5.11 verified locally
- ✅ `dpm test` and `dpm build` pass; `baseline-0.1.0.dar` produced
- ⏳ CP1 remains open only until a real hackathon DevNet/Seaport transaction is recorded

## Verify currently runnable checks

```bash
npm run test:math
```

## Canonical docs

- `docs/specs/baseline-mvp-scope.md`
- `docs/plans/baseline-implementation-plan.md`
- `docs/requirements.md`
- `docs/execution-log.md`

- `docs/devnet-deployment.md` — CP1 Seaport/DevNet deployment runbook
