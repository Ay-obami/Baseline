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


## 2026-09-21 — Canonical GitHub repository and CP1 verification branch

- Canonical repository established at `Ay-obami/Baseline`.
- Canonical MVP scope and implementation plan copied into the repository.
- Current TypeScript fixed-precision verification: 8/8 tests passing, including JSON/string money boundaries.
- Added `package-lock.json` for reproducible Node metadata.
- Opened PR #1 (`ci/cp1-daml-verification`) with a Daml authorization/visibility smoke script.
- Added CP1 Daml GitHub Actions workflow using the documented `dpm install`, `dpm test`, and `dpm build` sequence.
- GitHub reports zero workflow runs for connector-created pushes and PR events; no CI result is claimed.
- Added `docs/cp1-runbook.md` with the exact remaining compiler and DevNet evidence steps.
- CP1 remains OPEN until the Daml package is actually compiled/tested and a target-network smoke transaction is recorded.
