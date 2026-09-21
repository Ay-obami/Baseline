# BaseLine Execution Log

## 2026-09-21 — CP1 start

- Reviewed canonical MVP scope and implementation plan.
- Verified current official Canton DPM docs and public HackCanton launch/opening notices.
- Local environment has Java 21 and Node 22.16.0, but no DPM/Daml SDK.
- Shell network access is unavailable, so DPM installation and target-ledger smoke transaction cannot be executed in this sandbox.
- CP1 remains OPEN; no deployment evidence is claimed.
- Continued only with work independent of the missing toolchain: repository setup, fixture record, and TypeScript arithmetic harness.

### Local implementation evidence

- Commit: `815d9cc` (`chore: initialize BaseLine implementation workspace`)
- `node scripts/verify.mjs math`: PASS (3/3 Node tests)
- Canonical numeric assertions verified: initial base $40M; post-exclusion base $32M; initial headroom $5M; post-exclusion signed headroom -$3M; deficiency $3M.
- Daml `Math.daml` and `Test/Math.daml` have been drafted but are NOT counted as passing because DPM is unavailable in this sandbox.
