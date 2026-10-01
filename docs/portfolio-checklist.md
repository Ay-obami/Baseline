# BaseLine Portfolio Checklist

Status: **READY FOR REVIEW**  
Repository base: `b7c89fab2152a09ce8a3795fddf2d38ef3da4d2f`

## Reproduce the bounded case study

```bash
npm run verify
cd daml
dpm test
dpm build
```

Fresh 2026-10-01 results:

- Node fixed-precision/fixture checks: 8/8 passing.
- Daml Math script: PASS.
- Daml Smoke script: PASS with 3 transactions.
- DAR build: PASS, `.daml/dist/baseline-0.1.0.dar`.
- Project SDK: 3.5.11.

## What the case study demonstrates

BaseLine models a subscription-credit facility where an investor eligibility event can reduce the borrowing base and prevent stale capacity from being treated as current. The local Daml smoke path demonstrates the intended owner/outsider visibility and authorization boundaries in Daml Script.
The strongest portfolio framing is:

1. **Reproduction** — start from the canonical facility fixture and current Daml package.
2. **Root risk** — eligibility changes can make previously valid borrowing capacity stale.
3. **Control** — shared facility state recalculates the eligible base and exposes only authorized state.
4. **Regression proof** — Node arithmetic checks plus Daml authorization/visibility scripts.
5. **Limit** — the organizer-controlled shared DevNet transaction is not yet available.

## Safe claims

- Local Daml SDK 3.5.11 compilation and tests pass.
- `testMath` and `testSmoke` pass locally.
- The smoke script covers authorized creation, owner visibility, outsider invisibility, unauthorized exercise rejection, and authorized cleanup.
- The repository produces a DAR locally.
- The remaining shared DevNet gate is explicitly documented.

## Do not claim

- Do not claim a completed HackCanton shared-validator deployment.
- Do not claim a live target-network transaction or package ID until one is recorded.
- Do not claim CP2 is complete.
- Do not present local Daml Script behavior as third-party security certification.
## Parked / residual items

- **BLOCKED:** HackCanton organization/shared-validator access in Seaport.
- **PARKED:** CP2 work that requires that environment.
- **LOW-SEVERITY PACKAGING NOTE:** `dpm build` warns that template code and `daml-script` are in the same package. A production package should split scripts/tests from template code.

## Evidence map

- `docs/cp1-runbook.md` — reproduction commands, fresh evidence, release boundary.
- `docs/execution-log.md` — chronological implementation and access history.
- `docs/devnet-deployment.md` — target-network deployment procedure.
- `docs/specs/baseline-mvp-scope.md` — canonical MVP scope.
- `docs/plans/baseline-implementation-plan.md` — implementation plan.
- `daml/Test/Math.daml` and `daml/Test/Smoke.daml` — executable Daml evidence.

## Release verification

Source/local verification: **DONE**.  
HackCanton shared DevNet release verification: **BLOCKED** pending organizer access.
