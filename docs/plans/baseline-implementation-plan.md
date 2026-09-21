# BaseLine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task. Use superpowers:subagent-driven-development only if the user selects delegated execution. Steps use checkbox syntax for tracking.

**Goal:** Build and demonstrate the improved BaseLine MVP: a private investor event changes enforceable borrowing capacity, triggers a bounded repayment, and safely blocks borrowing when processing or payment cannot complete.

**Architecture:** Daml contracts are authoritative for eligibility, freshness, borrowing limits, authority, and settlement. Three committed stages separate investor exercise, facility application, and cure; a narrowly authorized worker advances them. A party-scoped server exposes ledger results to a React/Next.js interface without granting browser users other parties' authority.

**Tech stack:** Canton and its environment-supported Daml SDK; TypeScript for the ledger adapter, worker, and web application; React/Next.js for the interface; Daml Script for contract tests; Node test runner for adapter and integration assertions; Playwright for browser verification. Pin actual supported versions during Task 1; no version or network compatibility is assumed by this plan.

**Spec:** [BaseLine MVP Scope](../specs/baseline-mvp-scope.md), version 2. At repository initialization, copy the complete specification into `docs/specs/baseline-mvp-scope.md`; keep its source identity and any subsequent approved changes in the plan's execution log.

**Starting state:** This is a greenfield implementation plan. No application repository, existing source code, network credentials, or working deployment has been inspected. All paths below are proposed repository-relative paths. This document plans implementation; it does not claim that any tests or deployments have run.

## Global constraints

- One fund; Alpha, Beta, and Gamma; one facility; one investment-scoped eligibility event; one test asset.
- Advance rate: 80%. Initial eligible commitments: $50M. Initial base and contractual limit: $40M. Initial principal: $35M.
- Beta remaining commitment stays $10M; its eligible amount changes from $10M to $0.
- Successful cure: $3M paid, principal $32M, reserve $7M, zero additional draw capacity.
- Failed-cure fixture: $2M reserve; preserve $35M principal and $3M deficiency.
- Cure mandate: $5M cumulative cap, $1M reserve floor, exact full cure or no cure payment.
- A committed event must prevent subsequent use of stale borrowing capacity, even with the worker stopped.
- Privacy must hold in transaction consequences, historical updates, API responses, logs, and browser caches.
- No financial arithmetic or spending authority may depend on the frontend.
- No AI, OCR, NAV lending, concentration rules, extra lenders, secondary market, cross-chain work, or generalized governance.
- Separate party IDs do not prove independently controlled participant infrastructure.
- Use the organizer-confirmed deployment and account requirements; label all fixture balances and test assets honestly.
- No implementation begins as part of writing this plan. During execution, do not bypass a failed checkpoint to work on presentation.

## Review focus

Five easily overlooked cases are assigned explicit tests below:

1. A ledger commit succeeds but its response is lost: reconcile without paying twice — Tasks 11 and 12.
2. A previously valid gate contract or omitted position is supplied after an event: no stale draw — Tasks 4 and 8.
3. A user switches identities while an earlier request is still in flight: discard the old response — Tasks 13 and 14.
4. The reserve is split into several holdings or includes a lookalike asset: use only the correct asset and preserve change — Tasks 7 and 10.
5. Expiry, repayment, or mandate revocation races with cure: ledger order determines the valid result; never overpay — Tasks 10 and 12.

## Execution and checkpoint rules

Implement sequentially. Each numbered task ends with a passing focused test, a reviewed diff, and a small commit. Within a task, write the specified failing assertion first, implement the smallest behavior that passes it, then run the listed regression group. Split large implementation bullets into small commits without weakening the task's exit gate.

Do not invent passing evidence, SDK commands, organizer requirements, or account integration details. Task 1 binds environment-dependent commands to working wrappers. Later tasks use those wrappers rather than guessed SDK flags.

At each checkpoint report: completed task IDs; commit; commands run; passed/failed results; ledger/browser evidence where relevant; remaining blocker; next task. A checkpoint that needs code changes remains open.

| Checkpoint | Tasks | Visible result | Gate |
| --- | --- | --- | --- |
| CP1: Environment | 1–2 | Minimal deployed transaction and fixture calculator | Supported toolchain and reproducible numeric rules |
| CP2: Privacy and freshness | 3–5 | Private event blocks stale borrowing without leaking facility state | Full transaction visibility and concurrent-order tests pass |
| CP3: Financial flow | 6–10 | Draw, repayment, funded cure, insufficient-reserve failure | Cash and principal invariants pass |
| CP4: Recovery | 11–12 | Restart and lost-response recovery | No duplicate effects or reopened stale credit |
| CP5: Application | 13–15 | Independently authenticated, usable demo | Browser, account, reset, and privacy tests pass |
| CP6: Submission | 16–17 | Deployed demo, evidence, documentation, video | Clean reproduction and complete scope coverage |

## Proposed file map

| Path | Responsibility |
| --- | --- |
| `daml/daml.yaml` | Pinned package definition and SDK dependencies |
| `daml/daml/BaseLine/Types.daml` | Identifiers, money, scope, enums, result records |
| `daml/daml/BaseLine/Math.daml` | Credit arithmetic and bounds |
| `daml/daml/BaseLine/Fund.daml` | Fund identity and approved initial configuration |
| `daml/daml/BaseLine/Commitment.daml` | Validated LP commitments |
| `daml/daml/BaseLine/Rights.daml` | Right exercise, gates, eligibility-change instructions |
| `daml/daml/BaseLine/Eligibility.daml` | Canonical applied positions |
| `daml/daml/BaseLine/Facility.daml` | Policy, state, processing, draw, repayment orchestration |
| `daml/daml/BaseLine/Settlement.daml` | Test issuance, holdings, transfer authorization and change |
| `daml/daml/BaseLine/Cure.daml` | Cure requirement, mandate, atomic remediation |
| `daml/daml/BaseLine/Bootstrap.daml` | Authorized creation of the three fixtures |
| `daml/daml/Test/` | Daml Script tests; same source root as the package |
| `packages/ledger/src/{types,client,decode,evidence}.ts` | Version-specific API adapter and safe DTO decoding |
| `packages/ledger/test/` | Adapter, visibility, and live concurrency tests |
| `services/worker/src/{main,reconcile,retry}.ts` | Event processing and automatic cure submission |
| `services/worker/test/` | Recovery and fault-injection tests |
| `apps/web/src/server/{session,ledger,commands,views}.ts` | Authenticated party-scoped backend |
| `apps/web/src/app/` | Entry, investor, fund, lender and evidence pages |
| `apps/web/src/components/` | Credit summary, event explanation, timeline, draw form, evidence drawer |
| `apps/web/e2e/` | Browser tests using separate contexts |
| `scripts/{verify,deploy,seed,scenario,evidence,smoke}.mjs` | Stable execution wrappers |
| `config/toolchain.json`, `.env.example` | Pinned versions and names of required settings; no secrets |
| `docs/{requirements,authority,privacy,architecture,demo,execution-log}.md` | Requirements, trust boundaries, evidence, runbook and progress |
| `docs/evidence/` | Sanitized test summaries and deployment records |
| `.github/workflows/ci.yml` | Reproducible build and tests; external deployment separate |

Avoid circular Daml module imports. Put shared result/parameter records in `Types.daml`. If settlement orchestration requires references across Facility and Cure, keep the orchestration choice in Facility and move mandate data/leaf choices into Cure. Never fix an import cycle by duplicating authoritative state.

## Stable interfaces and test conventions

These are application-owned interfaces to implement, not claims about native Canton API method names.

### Money and identity

Daml money uses signed integer cents with an explicit nonnegative bound for balances; signed headroom may be negative. Set `MAX_CENTS = 1_000_000_000_000` for this demo (ten billion dollars). Validate inputs before multiplication; `MAX_CENTS * 10000` fits within signed 64-bit arithmetic. Sum the fixed three contributions using checked bounds. Reject values outside the bound instead of silently wrapping.

TypeScript money uses `bigint`; HTTP and evidence JSON use base-10 integer strings. Never serialize money through `Number`.

```ts
export type Money = string; // validated canonical integer cents
export type Role = 'manager' | 'agent' | 'alpha' | 'beta' | 'gamma' | 'worker' | 'issuer' | 'outsider';
export type Scenario = 'funded' | 'insufficient' | 'draw-boundary';
export type Ref = string; // opaque ledger contract reference
export type Scope = { runId: string; fundId: string; facilityId: string; investmentId: string; policyVersion: string; assetId: string; issuer: string };
export type PositionRef = { lp: string; gate: Ref; position: Ref };
export type FacilitySnapshot = {
  scope: Scope; version: string; principal: Money; borrowingBase: Money;
  creditLimit: Money; headroom: Money; available: Money; deficiency: Money;
  processing: 'Current' | 'EligibilityUpdatePending' | 'Paused';
};
export type Receipt = { updateId: string; commandId: string; committedAt: string; created: Ref[]; archived: Ref[] };
export type Outcome = { status: 'committed'; receipt: Receipt } |
  { status: 'rejected'; code: string } | { status: 'unknown'; commandId: string };
```

`unknown` is an uncertain transport outcome, never a reason to assume rollback. Only role-permitted fields leave the backend; `FacilitySnapshot` is not an LP response type.

### Ledger adapter contract

```ts
interface PartyLedger {
  query(template: string): Promise<unknown[]>;
  exercise(ref: Ref, choice: string, args: unknown, commandId: string): Promise<Outcome>;
  updates(after?: string): AsyncIterable<unknown>;
}
```

Create instances from authenticated server-side identities. Never expose an HTTP parameter that lets a client choose arbitrary `actAs`, `readAs`, or a raw ledger command.

### Verification commands

Task 1 implements `node scripts/verify.mjs <group>` with groups `math`, `rights`, `freshness`, `privacy`, `facility`, `settlement`, `draw`, `repayment`, `cure`, `worker`, `adversarial`, `api`, `ui`, and `all`. It must exit nonzero on any failure and propagate original diagnostics. Register groups as their tests are added; unknown groups fail rather than return success.

`node scripts/scenario.mjs <name>` creates a fresh live fixture, executes the specified real commands, and emits a JSON record. `packages/ledger/test/scenarios.test.ts` uses Node's `assert/strict` against those records. Scenario names are introduced in their owning tasks below. Test-only process/transport fault injection stays outside deployed Daml choices.

Numeric assertions below use cents: `$3M = "300000000"`.

## Task 1 — Supported environment and first ledger transaction

**Files:** Create toolchain config, package manifests and lockfile, Daml package, `scripts/verify.mjs`, `scripts/deploy.mjs`, `packages/ledger/src/{types,client,decode}.ts`, `daml/daml/Test/Smoke.daml`, `docs/requirements.md` and `.env.example`.

**Consumes:** The organizer's actual supported environment and access method. **Produces:** Pinned toolchain, working `PartyLedger`, documented build/test/deploy wrappers, and a deployment receipt.

- [ ] Record the official requirement URL, access date, supported SDK/API, target environment, submission materials, and account integration requirements. If target access is unavailable, record that blocker and continue local work without labeling CP1 passed.
- [ ] Add a smoke test which creates an innocuous contract as its allowed party, queries it as that party, and rejects an unauthorized exercise.
- [ ] Run the smoke test and preserve the failure before wiring the adapter.
- [ ] Implement SDK-specific create/query/exercise/update mappings inside the adapter. Keep environment URLs and credentials in runtime configuration.
- [x] Pin the locally working DPM/SDK versions (DPM 1.0.22, SDK 3.5.11); target-network compatibility still requires proof.
- [ ] Execute a smoke transaction on the organizer-provided DevNet/hosted environment. Record package ID, update ID, environment and commit; omit credentials.
- [ ] Commit: `chore: establish supported Canton toolchain and deployment smoke test`.

**Implementation algorithm:** `read config → validate required settings → connect as scoped identity → submit → wait for committed/rejected result → query → assert permitted visibility`. Connection or authorization failure must exit nonzero.

**Test assertion:**

```ts
assert.equal(result.authorizedCreate, 'committed');
assert.equal(result.ownerCanQuery, true);
assert.equal(result.outsiderCanQuery, false);
assert.equal(result.unauthorizedExercise, 'rejected');
```

**Gate:** One actual recorded deployed transaction. No fabricated SDK compatibility.

## Task 2 — Fixed-precision arithmetic and scenario constants

**Files:** Create `Types.daml`, `Math.daml`, `Test/Math.daml`, and `packages/ledger/test/money.test.ts`; extend `decode.ts`.

**Consumes:** Toolchain. **Produces:** `creditContribution : Int -> Int -> Int`, `creditLimit : Int -> Int -> Int`, `deficiency : Int -> Int -> Int`, and `parseMoney(input: string): bigint`.

- [x] Add failing table cases: 20M at 8000 bps → 16M; 10M → 8M; one cent at 8000 bps → zero cents; rate −1 and 10001 rejected; negative balances rejected; max bound enforced.
- [ ] Run `node scripts/verify.mjs math` and confirm missing/incorrect behavior fails.
- [x] Implement the validated arithmetic below and canonical decimal decoding. Reject signs on nonnegative amounts, decimal fractions, exponent notation, and empty strings.
- [x] Assert sums produce 40M initially and 32M after exclusion; cap the base by contractual limit.
- [x] Test HTTP/JSON round-trip without conversion through JavaScript `Number`.
- [ ] Commit: `feat: define bounded money and borrowing-base arithmetic`.

```text
contribution(amount, bps):
  require 0 <= amount <= MAX_CENTS
  require 0 <= bps <= 10000
  return (amount * bps) integer-divided-by 10000
headroom = min(base, facilityLimit) - principal
available = max(0, headroom) only if processing is Current and not paused
shortfall = max(0, principal - min(base, facilityLimit))
```

```ts
assert.equal(parseMoney('300000000'), 300000000n);
assert.throws(() => parseMoney('3e8'));
assert.throws(() => parseMoney('300000000.00'));
```

**CP1 gate:** Tasks 1–2 pass and the exact commercial fixture is recorded in `docs/requirements.md`.

## Task 3 — Authority skeleton and private right exercise

**Files:** Create Fund, Commitment, Rights, Bootstrap modules; `Test/Rights.daml`; `docs/authority.md`.

**Consumes:** Scope and bounded money. **Produces:** Available right, per-LP gate, and `ExerciseRight(gateRef) -> eventRef`.

- [ ] Write tests for Beta-only exercise, unchanged commitment, incremented gate epoch, exactly one change instruction, replay failure and mismatched scope failure.
- [ ] Run `node scripts/verify.mjs rights` to establish failure.
- [ ] Define every template's signatories, observers and choice controllers in the authority document. Approval/creation must require the relevant parties; the manager alone cannot create lender-authorized credit state.
- [ ] Implement the right transition. Require the input gate's LP, scope and current epoch to match. The leaf gate operation archives/recreates only that LP's gate.
- [ ] Confirm exercise arguments/results and child operations contain only Beta-permitted information. Store the source right ID and epoch in the change instruction.
- [ ] Run rights tests and commit: `feat: record private eligibility events with explicit authority`.

```text
ExerciseRight:
  require right Available and controller == owning LP
  require matching current gate and agreed policy/scope
  consume right
  advance own gate epoch
  create exercised-right record and one EligibilityChange
  return EligibilityChange reference only
```

```ts
assert.equal(result.betaRemaining, '1000000000');
assert.equal(result.oldEpoch, '0');
assert.equal(result.newEpoch, '1');
assert.equal(result.changeCount, 1);
assert.equal(result.replay, 'rejected');
```

## Task 4 — Canonical gates and concurrency-safe freshness

**Files:** Create Facility and Eligibility skeletons, `Test/Freshness.daml`, `packages/ledger/test/concurrency.test.ts`; extend `scenario.mjs`.

**Consumes:** Current LP gates and event epochs. **Produces:** Canonical registry validation and `assertFresh(registry, appliedEpochs, suppliedRefs)` inside every credit-increasing choice.

- [ ] Add scenarios `pending-draw`, `omitted-position`, `stale-gate`, and `event-draw-race` before implementing the guard.
- [ ] Test that fetching a consumed old gate fails even when it contains the desired old epoch. Test duplicate Alpha supplied in place of Beta, an unrelated facility's gate, and a missing Gamma.
- [ ] Implement exact set matching: one current gate for every registry LP; matching scope and applied epoch; no extras or duplicates. Registry is co-approved and immutable in the MVP.
- [ ] Confirm target-ledger concurrency behavior using real simultaneous submissions. A stale query followed by a command must still fail at commit if invalidated by the earlier-ordered event.
- [ ] If fetch/current-state conflict validation is insufficient, implement a consuming leaf gate check that recreates the same epoch and forces contention. Keep all facility operations outside that leaf's consequences. Re-run the visibility proof before selecting this fallback.
- [ ] Commit: `feat: reject draws against stale or incomplete eligibility state`.

```text
assertFresh:
  supplied LP set == canonical LP set, with no duplicates
  for each registered LP:
    fetch live gate and check scope, LP, epoch == appliedEpochs[LP]
  reject any missing, archived, substituted, or mismatched gate
```

```ts
assert.equal(result.eventThenDraw, 'rejected');
assert.equal(result.omittedBeta, 'rejected');
assert.equal(result.archivedGate, 'rejected');
assert.equal(result.invalidLedgerOrderCount, 0);
```

**No shortcut:** An offchain pending boolean or “worker is usually fast” cannot satisfy this task.

## Task 5 — Complete visibility proof of stages A and B

**Files:** Create `packages/ledger/src/evidence.ts`, `packages/ledger/test/privacy.test.ts`, `Test/Privacy.daml`, `docs/privacy.md`; extend Facility and Rights.

**Consumes:** Right exercise and freshness skeleton. **Produces:** Facility-owned `ApplyEligibility(changeRef, currentPositionRefs, currentGateRefs)` layout and party projection evidence.

- [ ] Seed unique sentinels in Beta, Alpha, and facility data; capture active contracts, update history, choice inputs/results and known-ID attempts as every role.
- [ ] Add a deliberately leaky test fixture with facility changes nested under Beta's exercise; confirm the privacy test detects the sentinel. Keep that fixture test-only.
- [ ] Implement facility-owned orchestration with a narrow event-consumption leaf. Validate event content through the leaf; put facility operations in sibling actions afterward, not within the Beta-visible subtree.
- [ ] Inspect the worker's observer/signatory implications explicitly. The worker can receive the minimum financing data necessary to apply and cure; disclose this service trust boundary instead of pretending it has no data access.
- [ ] Assert absence of protected sentinels from the full role-specific evidence, including history after consumption. Retain positive controls proving each query actually worked.
- [ ] Run `node scripts/verify.mjs privacy` and `freshness`; commit: `test: prove transaction-level privacy and freshness boundaries`.

```ts
assert.equal(betaEvidence.includes(alphaSentinel), false);
assert.equal(betaEvidence.includes(facilityBalanceSentinel), false);
assert.equal(alphaEvidence.includes(betaRightSentinel), false);
assert.equal(agentEvidence.includes(authorizedEligibilitySentinel), true);
```

**CP2 gate:** Both privacy and stale-state protection pass on real transactions. Do not implement the UI until this design works. If it does not, record the failed invariant and revise the transaction structure; do not silently weaken the scope.

## Task 6 — Canonical eligibility and deficiency lifecycle

**Files:** Complete Eligibility and Facility; add CureRequirement data/leaf choices in Cure; create `Test/Facility.daml` and fixture scripts in Bootstrap.

**Consumes:** Approved registry, private event, validated orchestration. **Produces:** Applied eligibility, versioned facility, and at most one current open cure requirement.

- [ ] Write failing fixture assertions for $40M initial base, $32M after Beta exclusion, $3M deficiency and unchanged $35M principal.
- [ ] Add wrong amount, right identity, investment, fund, policy version, event epoch and position-substitution tests. Reject both duplicate and omitted position references.
- [ ] Implement application against all three canonical positions; fetch current commitment limits, update only Beta, recompute using Math, and increment the facility version. At this size, full recomputation is preferable to an unchecked delta.
- [ ] Consume the change once, acknowledge its epoch, and replace any old requirement with the current deficiency. If deficiency is zero, leave no open requirement.
- [ ] Verify identical applied facility version as manager and agent. LP output remains restricted to its receipt.
- [ ] Run `node scripts/verify.mjs facility`; commit: `feat: apply eligibility changes and maintain current deficiency`.

```text
apply(change):
  require source event matches approved scope and exactly next epoch
  require supplied positions == canonical positions
  require adjustment within remaining commitment
  consume validated change through leaf choice
  replace affected position
  recompute base and credit limit
  replace facility(version + 1, appliedEpoch + 1)
  replace current requirement if shortfall > 0, otherwise remove it
```

```ts
assert.equal(result.baseBefore, '4000000000');
assert.equal(result.baseAfter, '3200000000');
assert.equal(result.principalAfter, '3500000000');
assert.equal(result.deficiencyAfter, '300000000');
assert.equal(result.openRequirements, 1);
```

## Task 7 — Test asset, transfer authorization and reserve

**Files:** Create Settlement, `Test/Settlement.daml`; extend Bootstrap.

**Consumes:** Bounded money and party setup. **Produces:** Test issuance, `Transfer(amount, recipient, acceptanceRef)` with consumed inputs, recipient output and change outputs.

- [ ] Add conservation tests for issuance, exact transfer, splitting, combining matching holdings and insufficient balance. Issuance alone may increase supply.
- [ ] Reject lookalike assets with another issuer or asset ID; reject negative amounts, overflows and unauthorized spending. Require recipient acceptance through a standing asset account or equivalent scoped authority.
- [ ] Implement issuer/owner-authorized holdings and narrowly scoped transfer leaf operations. Avoid putting facility calculations underneath issuer-visible settlement actions.
- [ ] Create a dedicated reserve account/bucket identifier distinct from ordinary borrower proceeds. A draw must not be mistaken for an increase in reserve or cure receipts.
- [ ] Test fragmented reserve holdings: $1M + $2M + $7M can fund a $3M cure while conserving $7M change. Bind the reserve floor to all canonical reserve holdings or a single authoritative reserve balance, not a caller-selected subset.
- [ ] Run `node scripts/verify.mjs settlement` and `privacy`; commit: `feat: implement authorized test cash and reserve accounting`.

```ts
assert.equal(result.totalBeforeTransfer, result.totalAfterTransfer);
assert.equal(result.recipientIncrease, '300000000');
assert.equal(result.reserveAfter, '700000000');
assert.equal(result.lookalikeAssetTransfer, 'rejected');
```

**Authority note:** A simple owner transfer must not confer unrestricted owner authority on the worker. Worker spending is introduced only through Task 10's bounded mandate.

## Task 8 — Atomic draws and complete credit guard

**Files:** Complete `RequestDraw` in Facility; create `Test/Draw.daml`; extend scenarios with `draw-exact`, `draw-over`, `draw-pending`, `draw-after-cure`.

**Consumes:** Fresh canonical positions, current facility, lender holding and transfer acceptance. **Produces:** `RequestDraw(amount, positionRefs, lenderFundingRefs, acceptanceRef) -> replacementFacilityRef`.

- [ ] Write failure-first tests: exact $5M allowed; $5M plus one cent rejected; zero/negative draw rejected; pending event rejected; deficient or paused facility rejected.
- [ ] Implement freshness and credit-limit checks inside the consuming facility choice. Add co-authorized `PauseFacility` and `ResumeFacility` choices controlled by manager and agent; pause never erases debt or a deficiency, and resume never bypasses freshness. Test unauthorized pause/resume and an independently lower contractual limit as well as borrowing-base limits.
- [ ] Transfer lender funds and increase principal in the same update. Keep settlement leaf consequences limited to transfer data.
- [ ] Force an otherwise valid draw's transfer to fail; compare balances, principal, facility version and funding holdings before and after.
- [ ] Run live event/draw concurrency again with actual cash movement, not only the CP2 skeleton.
- [ ] Run `node scripts/verify.mjs draw`, `freshness`, and `privacy`; commit: `feat: enforce live credit capacity on atomic facility draws`.

```text
RequestDraw:
  require borrower authority, amount > 0, Current, not Paused
  assertFresh(canonical registry, applied epochs, supplied gates)
  require principal + amount <= min(base, contractualLimit)
  transfer correct lender asset to borrower proceeds
  replace facility with principal + amount and version + 1
```

```ts
assert.equal(result.exactDraw.status, 'committed');
assert.equal(result.exactDraw.principal, '4000000000');
assert.equal(result.oneCentOver.status, 'rejected');
assert.deepEqual(result.failedTransferAfter, result.failedTransferBefore);
```

## Task 9 — Ordinary repayment and cure refresh

**Files:** Complete `Repay` in Facility; create `Test/Repayment.daml`.

**Consumes:** Current facility and authorized borrower cash. **Produces:** `Repay(amount, fundingRefs, acceptanceRef) -> replacementFacilityRef` and refreshed requirement.

- [ ] Write tests for $1M repayment from a $3M deficiency, exact full repayment, zero/negative repayment, overpayment and wrong asset.
- [ ] Implement cash transfer and principal reduction in one consuming facility transaction. Bound amount by current principal.
- [ ] Permit repayment while processing is pending: it reduces debt safely, but must not clear pending status, acknowledge a missing event, or unlock a draw. Label any credit summary based on unapplied eligibility as pending.
- [ ] Refresh the open requirement against the currently applied base; Stage B subsequently recalculates it when the event is applied. A pending facility cannot use this intermediate quote to execute cure.
- [ ] Test repayment between deficiency creation and cure attempt. The old requirement/old facility reference must fail; the refreshed amount must be used.
- [ ] Run `node scripts/verify.mjs repayment`; commit: `feat: settle repayments and refresh current cure obligations`.

```ts
assert.equal(result.principalAfter, '3400000000');
assert.equal(result.deficiencyAfter, '200000000');
assert.equal(result.oldCureAttempt, 'rejected');
assert.equal(result.pendingRepaymentClearedPending, false);
```

## Task 10 — Bounded mandate and atomic cure

**Files:** Complete Cure and facility cure orchestration; create `Test/Cure.daml`; extend Bootstrap and scenarios with `funded`, `insufficient`, `cure-fragmented`, `cure-expiry`, `cure-revoked`, `cure-stale`.

**Consumes:** Fresh current facility, reserve, current requirement, standing recipient acceptance. **Produces:** `SatisfyCure(requirementRef, mandateRef, reserveRefs, positionRefs) -> replacementFacilityRef` and manager-controlled `RevokeMandate`.

- [ ] Add funded/insufficient assertions and a table of wrong executor, payee, issuer, asset, scope, cap, floor, expiry and revocation cases.
- [ ] Represent the mandate's spending allowance and used amount as ledger state. Creation requires manager authorization; executor permission is limited to the named facility and payment rules. Fix expiry using ledger time; `now >= expiresAt` rejects.
- [ ] Implement checks and effects in the ordering below. Consuming current mandate and facility state provides conflict control for revocation, repayment and duplicate cure.
- [ ] Verify a revoked mandate cannot be replaced unilaterally by the worker. Record a leaf authorization path whose consequences cannot be used for arbitrary transfers or to bypass the cap.
- [ ] Force settlement failure after valid eligibility application. Assert right exercised, base $32M, debt $35M, mandate used zero, unchanged reserve and no receipt.
- [ ] Run `node scripts/verify.mjs cure`, `settlement`, and `privacy`; commit: `feat: execute bounded atomic cures and preserve failed obligations`.

```text
SatisfyCure:
  require Current eligibility and exact live facility/requirement match
  amount := current principal - current credit limit
  require amount > 0 and requirement.amount == amount
  require executor, facility, lender, issuer and asset match mandate
  require not revoked and ledgerNow < expiresAt
  require used + amount <= cap
  require authoritative reserve total - amount >= reserveFloor
  transfer exact amount to lender
  consume current requirement and mandate
  create mandate replacement with used + amount
  replace facility with principal - amount, version + 1
  create restricted settlement evidence
```

```ts
assert.deepEqual(result.funded, {
  principal: '3200000000', reserve: '700000000', received: '300000000',
  mandateUsed: '300000000', deficiency: '0', available: '0'
});
assert.deepEqual(result.insufficient, {
  principal: '3500000000', reserve: '200000000', received: '0',
  mandateUsed: '0', deficiency: '300000000', available: '0'
});
```

**CP3 gate:** Both main scenarios, exact draw boundary, ordinary repayment, atomicity and visibility pass without a frontend. This is the first complete product checkpoint.

## Task 11 — Automatic processing and restart recovery

**Files:** Create worker main/reconcile/retry modules, `services/worker/test/recovery.test.ts`; extend adapter and evidence helpers.

**Consumes:** `PartyLedger`, approved executor authority, current contracts. **Produces:** `reconcileRun(runId: string): Promise<void>` and automatically submitted apply/cure commands.

- [ ] Write tests for stop after Stage A, stop after Stage B, restart after payment, and commit-with-lost-response. Fault injection occurs in the adapter/process layer.
- [ ] Implement startup discovery of active changes and unsatisfied requirements. The ledger is the source of work; a local cursor only accelerates reading. A scan must recover if the cursor is lost.
- [ ] Use stable business IDs and command IDs. On unknown outcome, reconcile current contracts and receipts before resubmitting. Refetch after version conflicts rather than reusing stale contract references.
- [ ] Retry transient connection failures with bounded exponential backoff and jitter (1, 2, 4, 8, then at most 30 seconds). Treat insufficient reserve and invalid mandate as blocked states, not a rapid retry loop.
- [ ] Reconsider a blocked cure on a relevant balance/mandate update, service restart, or authorized manual retry. Automatic normal flow requires no button click.
- [ ] Run `node scripts/verify.mjs worker`; commit: `feat: reconcile eligibility and cure work across restarts`.

```text
reconcileRun(run):
  discover live unapplied events for run
  for each event in eligible epoch order:
    submit application using current references
    reconcile committed, rejected, or unknown outcome
  discover current open requirements
  for each requirement with Current eligibility:
    submit bounded cure with current references
    on business rejection, record safe reason and await relevant change
```

```ts
assert.equal(result.appliedEventCount, 1);
assert.equal(result.successfulCureCount, 1);
assert.equal(result.lenderReceived, '300000000');
assert.equal(result.rightRemainedExercised, true);
assert.equal(result.drawWhileWorkerStopped, 'rejected');
```

## Task 12 — Adversarial sequences, CI and evidence

**Files:** Create `Test/Sequences.daml`, `packages/ledger/test/adversarial.test.ts`, `.github/workflows/ci.yml`, `scripts/evidence.mjs`.

**Consumes:** All completed contract and worker interfaces. **Produces:** Repeatable contract regression suite, live race results, and sanitized evidence summaries.

- [ ] Add deterministic action sequences: exercise→repay→apply→cure; exercise→apply→repay→stale cure; double worker submission; revoke→cure; cure→revoke; expired mandate; reused event from another run.
- [ ] Test ordinary parties cannot create replacement facility/mandate state, invoke unrestricted archive paths, or edit policy to manufacture capacity.
- [ ] Run races against the deployed SDK environment. Assert outcomes against observed ledger order, not wall-clock button-click order. At exact expiry, cure must reject.
- [ ] Add sequence/property checks for cash conservation, nonnegative balances, registry completeness and no principal reduction without settlement. Keep seeds and failing action traces reproducible.
- [ ] Configure CI for pinned builds, Daml tests, TypeScript tests and browser tests when available. Keep credentialed target-network verification a separately recorded gate.
- [ ] Run `node scripts/verify.mjs all`; commit: `test: cover recovery races and financial invariants`.

```ts
assert.equal(result.duplicatePaymentCount, 0);
assert.equal(result.unbackedPrincipalReductionCount, 0);
assert.equal(result.staleDrawAcceptedCount, 0);
assert.equal(result.cureAtExactExpiry, 'rejected');
assert.equal(result.foreignRunEvent, 'rejected');
```

**CP4 gate:** Recovery and ledger-order behavior pass. Record exact test commands, environment and commit in `docs/execution-log.md`.

## Task 13 — Authenticated API and role-safe data views

**Files:** Create web server session/ledger/commands/views modules; `apps/web/src/server/api.test.ts`; connect account flow required in Task 1.

**Consumes:** Adapter and scoped server credentials or verified connected-account identity. **Produces:** Authenticated read/command endpoints and safe role DTOs.

Endpoints: `GET /api/me`, `GET /api/view`, `GET /api/evidence`, `POST /api/rights/exercise`, `POST /api/facility/draw`, `POST /api/facility/repay`, `POST /api/cure/retry`. Task 15 adds operator-only reset. Resolve contract references server-side within the authenticated run; do not accept arbitrary ledger choices.

- [ ] Write tests for missing session, forged role/party fields, cross-run IDs, known protected contract ID, negative amount, invalid decimal string and wrong action role.
- [ ] Implement server-side identity mapping and per-role queries. Demo role selection must mint only isolated demo identities; production-like identities cannot be selected by arbitrary role text.
- [ ] Implement separate investor and facility DTOs. Alpha's payload must not contain keys or values for Beta, not even masked placeholders containing private amounts.
- [ ] Use `Cache-Control: no-store` for private responses and identity/run-scoped caches where caching is necessary. Never log raw private ledger responses or credentials.
- [ ] Preserve `unknown` command outcomes as pending verification; prevent blind double submission. Connect/disconnect must reset server session and client data where applicable.
- [ ] Run `node scripts/verify.mjs api`; commit: `feat: expose authenticated party-scoped application commands`.

```ts
assert.equal(result.alphaViewContainsBeta, false);
assert.equal(result.forgedActAsStatus, 403);
assert.equal(result.crossRunCommandStatus, 403);
assert.equal(result.unknownOutcomeUiState, 'pending-verification');
```

## Task 14 — Focused interface and economic explanation

**Files:** Create entry/investor/fund/lender pages and CreditSummary, EventExplanation, Timeline, DrawForm, EvidenceDrawer components; `apps/web/e2e/workflow.spec.ts`.

**Consumes:** Role-safe API outputs. **Produces:** User-facing complete flow with genuine committed state.

- [ ] Write browser tests in separate Beta, lender, Alpha contexts: initial fixture, exercise, eventual application/cure, failed-reserve state and unauthorized data absence.
- [ ] Implement the entry headline and scope copy. Show remaining commitment separately from eligible commitment in Beta's view.
- [ ] Render signed headroom separately from available-to-draw. Show pending processing as a blocking status and zero available, even if the last applied calculation looked compliant.
- [ ] Implement historical event explanation from committed receipts: −$10M eligibility, −$8M capacity, $3M deficiency, payment result. Make historical steps explicit if auto-cure already completed.
- [ ] On identity/run change, abort in-flight reads, increment a session generation, discard old-generation responses and clear state. Test a delayed lender response arriving after switch to Alpha.
- [ ] Run `node scripts/verify.mjs ui`; commit: `feat: present the private credit workflow and ledger evidence`.

```text
onSessionChange:
  abort outstanding requests
  generation := generation + 1
  clear previous identity data
onResponse(response, requestGeneration):
  apply response only if requestGeneration == current generation
```

```ts
await expect(lenderPage.getByTestId('principal')).toHaveText('$32,000,000');
await expect(lenderPage.getByTestId('available')).toHaveText('$0');
await expect(alphaPage.getByTestId('beta-right')).toHaveCount(0);
await expect(alphaPage.getByTestId('facility-principal')).toHaveCount(0);
```

## Task 15 — Isolated scenario reset and usable demo sessions

**Files:** Complete `scripts/seed.mjs`, Bootstrap fixtures, operator reset route and `apps/web/e2e/reset.spec.ts`; write `docs/demo.md`.

**Consumes:** Fixture constructors and authenticated session model. **Produces:** `seed(scenario: Scenario) -> { runId, permittedSessionReferences }` and operator-only fresh-run reset.

- [ ] Write tests that two sessions/scenarios never share active contract references and an LP cannot invoke reset.
- [ ] Generate a unique run ID for every reset. Seed three investors, correct policy, fixture principal, lender liquidity, reserve, right, mandate, and asset acceptances. Do not delete ledger history.
- [ ] Seed the failed-reserve scenario with exactly $2M and the success scenario with $10M. Seed draw-boundary independently with unchanged $35M principal.
- [ ] Return only the current user's permitted session information; never expose all role credentials in a public reset response.
- [ ] Add error/loading states, desktop and narrow-viewport checks, keyboard actions and refreshed state after reload. Demonstrate required connect/disconnect behavior if mandated by the confirmed rules.
- [ ] Run `node scripts/verify.mjs ui` and `api`; commit: `feat: isolate demo runs and provide repeatable scenario setup`.

```ts
assert.notEqual(result.firstRunId, result.secondRunId);
assert.equal(result.sharedActiveReferences, 0);
assert.equal(result.lpResetStatus, 403);
assert.equal(result.insufficientReserve, '200000000');
assert.equal(result.reloadedPrincipalMatchesLedger, true);
```

**CP5 gate:** Complete authenticated flow from browser to ledger, without fake calculations, hidden broad credentials, or cross-role cache leakage.

## Task 16 — Target deployment and submission evidence

**Files:** Complete deploy/smoke/evidence scripts, `README.md`, `docs/{architecture,privacy,authority,requirements,demo}.md`, `docs/evidence/deployment.json`.

**Consumes:** Tested application, confirmed target requirements. **Produces:** Working deployed demo and reproducible instructions linked to a commit.

- [ ] Run clean installation and build using lockfiles. Verify all required settings are documented by name and none contain secrets in the repository.
- [ ] Deploy contracts, worker and web application to the appropriate supported environments. Record network and hosting roles separately; web hosting is not ledger deployment.
- [ ] Run both main scenarios and the boundary scenario from the deployed UI/API. Capture observed update references, party scope, package ID, git commit, balances and timings.
- [ ] Complete architecture and privacy documentation from actual evidence, including host/operator access, service data visibility, test issuer trust, seeded debt and custom-token limitations.
- [ ] Add README reproduction commands, account setup, reset instructions and known blockers. Remove statements about integrations or isolation that were not demonstrated.
- [ ] Commit: `docs: publish reproducible deployment and privacy evidence`.

Evidence contract (application-owned TypeScript):

```ts
type DeploymentEvidence = {
  schemaVersion: 1;
  commit: string;
  environment: string;
  packageId: string;
  scenario: Scenario;
  expected: { principal: Money; reserve: Money; received: Money };
  observed: { principal: Money; reserve: Money; received: Money };
  receipts: Receipt[];
  timingsMs: { eventToApplication: number; applicationToSettlement?: number };
  privacyChecks: { identity: Role; assertion: string; passed: boolean }[];
};
```

The evidence script obtains commit, environment, package ID, observed balances and receipts from the actual run. It refuses to mark evidence complete when observed values differ from expected values, receipts are empty, or required privacy checks are absent or failing. Failed cure has no settlement timing; record its rejected `Outcome` separately without inventing a committed settlement receipt.

## Task 17 — Judge rehearsal, video and final scope audit

**Files:** Update `docs/demo.md`, `docs/execution-log.md`, README submission links and `docs/evidence/submission-checklist.md`.

**Consumes:** Verified deployment. **Produces:** A concise 60–90 second main demonstration, working submission links, and final coverage checklist.

- [ ] Rehearse from a fresh run: initial facility → Beta exercise → automatic cure → rejected extra draw → Alpha privacy → insufficient-reserve outcome.
- [ ] Record the economic result in the first 30 seconds. Show real balances and distinguish historical timeline steps from current state.
- [ ] Explain the buyer, agreed exclusion policy, exact asset type, host trust boundaries and measured timing. Include practitioner feedback only if actually obtained and permitted.
- [ ] Test all submission links and clean setup instructions. Record the package/deployment and video version that correspond to the tested commit.
- [ ] Complete the coverage matrix below. Any failed mandatory item blocks the “submission-ready” claim; optional integrations do not compensate.
- [ ] Commit: `docs: finalize BaseLine demo and submission checklist`.

**CP6 gate:** Main and failure stories are reproducible, evidence matches deployed behavior, and organizer-confirmed requirements are met.

## Spec-to-task coverage

| Scope requirement | Owning tasks | Evidence |
| --- | --- | --- |
| Business framing, policy assumption, current event requirements | 1, 16–17 | Requirements and README |
| Three LPs, one fund/facility, exact fixtures | 2–3, 6, 15 | Seed and arithmetic assertions |
| Right exercise leaves underlying commitment unchanged | 3, 6 | Rights and facility tests |
| Canonical registry, fresh gates and concurrency | 4, 8, 12 | Archived-input and ledger-order tests |
| Transaction consequences and selective privacy | 5, 7, 10, 13–14 | Positive/negative role evidence |
| Facility calculation and current deficiency | 2, 6, 9 | Numeric and lifecycle assertions |
| Draw, contractual limit, atomic funding | 8 | Boundary and transfer-failure cases |
| Ordinary repayment and stale cure | 9–10 | Repayment-before-cure assertions |
| Mandate cap, reserve floor, expiry, revocation | 10, 12 | Authorization and race tests |
| Cash conservation, identity and fragmented holdings | 7, 10 | Settlement invariants |
| Automatic execution and failure persistence | 10–12 | Funded/insufficient and restart tests |
| Unknown responses, retry and duplicate submission | 11–13 | Fault-injection evidence |
| Session identity, API payloads and cache isolation | 13–14 | API and browser tests |
| Role views, financial explanation and evidence drawer | 14 | Browser workflow |
| Unique reset runs and deterministic fixtures | 15 | Isolation and reload tests |
| Target deployment, evidence and clean reproduction | 1, 16 | Actual deployed receipts |
| Demo, buyer hypothesis, accurate claims and final materials | 16–17 | Submission checklist |
| Optional participant/asset integrations | Deferred until CP6 passes | Separate explicit scope decision |

## Change control and scope protection

A task is complete only when its exit test and checkpoint evidence pass. Update this plan's checkboxes during execution and keep a short dated execution log. Every proposed addition must identify the required invariant or judge-visible outcome it improves.

If time becomes constrained, cut stretch integrations, decorative animations, presenter composite views and optional capacity-reopening demonstration first. Retain financial correctness, transaction-level privacy, stale-state enforcement, authentication, both main outcomes, and evidence.

If a core privacy or concurrency assumption fails, stop the dependent tasks and revise that design. If external target access is blocked, continue independent local tasks but report the network gate as incomplete. Do not silently replace deployment evidence with a local simulation.

## Execution choice

Recommended: **native sequential execution**, because authority and transaction layout are tightly coupled across these tasks. It minimizes handoff drift while the CP2 proof determines the viable structure. Use focused review at checkpoint boundaries; delegated task-by-task implementation and review is an alternative if explicitly selected.

This plan is ready for review. Repository selection, actual environment access and supported SDK versions are established at execution start; they are not presumed to exist from this planning work.