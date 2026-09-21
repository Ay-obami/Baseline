# BaseLine — Improved HackCanton MVP Scope

**Private commitments. Enforceable borrowing limits.**

Version 2 · September 21, 2026

## 1. Executive summary

BaseLine is a private fund-finance application on Canton that keeps borrowing limits synchronized with agreed changes in investor eligibility.

A fund borrows against eligible uncalled investor commitments. When an investor exercises a pre-agreed financing-relevant right, BaseLine records the event, updates eligible collateral, recalculates borrowing capacity, blocks unsupported draws, and settles an authorized repayment when sufficient reserve liquidity exists.

Each participant receives only the information required for its role. A lender can verify the financing consequence without unrelated investors receiving confidential terms.

The MVP proves one complete workflow:

**Private investor event → eligibility adjustment → enforceable credit limit → deficiency → authorized repayment → reconciled facility state.**

It also proves the failure case: when the reserve cannot pay, the obligation remains recorded, debt remains outstanding, and further borrowing is rejected.

## 2. One-sentence pitch

BaseLine keeps private fund borrowing limits enforceable as investor obligations change: an agreed private event updates credit capacity, blocks excess borrowing, and triggers an authorized repayment, with each participant seeing only the information it is entitled to receive.

## 3. Problem, buyer, and outcome

### Problem

The product hypothesis is that financing-relevant investor terms and credit calculations are maintained across documents, fund-administration records, lender systems, and reconciliation processes. A change in an investor's eligibility can leave the lender and fund working from different credit states until those records are reconciled.

BaseLine starts after the relevant terms and eligibility treatment have been agreed. It executes that agreed treatment; it does not interpret legal documents or determine whether an investor is legally entitled to an excuse.

### Initial buyer hypothesis

The initial buyer is a subscription facility agent's operations team. Fund administrators are a possible implementation and distribution partner. The fund manager and investors participate in the workflow.

### Measurable MVP outcomes

- A committed eligibility event cannot leave old borrowing capacity usable.
- The lender and fund see the same applied facility version.
- An unsupported draw is rejected by contract logic.
- A successful cure transfers the exact settlement amount and reduces principal by that amount.
- A failed cure leaves principal and cash balances unchanged.
- Unauthorized parties cannot retrieve protected data through the application or their ledger views.

Measure event-to-application and application-to-settlement time in the demo. Report measured results and test conditions. Do not invent operating-cost savings or describe repaid principal as money earned or loss avoided.

## 4. Hackathon positioning

Position BaseLine as **private credit control infrastructure for fund finance**.

The intended category is investment infrastructure or real-world business workflows, depending on the organizer's confirmed track names. Before submission, verify the current rules, deadline, deployment environment, wallet requirements, judging criteria, and required materials directly with the organizers.

This scope does not treat previously stated track names or dates as verified requirements.

The submission should make four things immediately clear:

1. A concrete business event changes actual borrowing permission.
2. Canton carries shared contractual state across parties with different information rights.
3. Settlement and debt reduction occur together.
4. Failure leaves a safe, observable state.

## 5. Fixed MVP boundaries

| Dimension | MVP commitment |
| --- | --- |
| Fund | One fund |
| Investors | Alpha, Beta, and Gamma |
| Facility | One subscription-style demonstration facility |
| Financing event | One pre-agreed, investment-scoped eligibility exclusion |
| Advance rate | 80% for every eligible position |
| Currency | One denomination |
| Settlement | One clearly labeled test asset |
| Credit actions | Draw, repayment, eligibility application, cure |
| Authorization | One bounded automatic-cure mandate |
| Demo scenarios | Funded reserve; insufficient reserve; independent draw boundary scenario |
| Privacy | Separate authenticated party views and ledger-level evidence |

The MVP excludes AI, OCR, document ingestion, NAV lending, multiple lenders, concentration limits, investor ratings, secondary trading, cross-chain execution, and generalized governance.

## 6. Commercial assumptions for the demonstration

The demo uses a deliberately specified policy, not a claim that every subscription facility treats excuse rights this way:

> For the Investment X financing scope, exercise of Beta's agreed right excludes its specified $10M commitment from this facility's borrowing-base calculation. The exclusion becomes effective when the authorized event commits to the ledger. Beta's underlying remaining commitment is unchanged.

The policy and right must bind the same fund, facility, investment scope, currency, amount, and policy version.

The document reference records the source of agreed terms. A reference or hash establishes linkage, not legal correctness. Authorized participants approve the structured terms before the demo begins.

Validate this scenario with a fund-finance practitioner if access is available. If the commercial treatment is rejected, use a validated eligibility event and update the narrative and tests consistently before implementation. Do not imply that practitioner validation has already occurred.

## 7. Actors and authority

| Actor | Permitted role |
| --- | --- |
| Fund manager / GP | Approves initial terms and policy with the agent; requests draws; manages repayment liquidity; grants the cure mandate |
| LP Beta | Sees its own commitment and right; exercises only its available right |
| LP Alpha and LP Gamma | See their own commitments; serve as privacy-isolation subjects |
| Facility agent / lender | Co-authorizes policy; sees agreed financing inputs; funds draws; receives repayment; applies valid eligibility events |
| Settlement issuer | Issues the test asset and enforces its transfer rules |
| Automation service | Submits narrowly authorized application and cure commands; cannot invent eligibility changes or change policy |
| Unrelated party | Has no access to protected fund, investor, or facility data |

The fund is the economic owner of the reserve, represented in the MVP by its authorized manager party. The issuer is a trusted test issuer, not evidence of backing by real money.

## 8. Seeded economic scenario

| Investor | Remaining commitment | Initially eligible | Advance rate | Credit contribution |
| --- | ---: | ---: | ---: | ---: |
| Alpha | $20M | $20M | 80% | $16M |
| Beta | $10M | $10M | 80% | $8M |
| Gamma | $20M | $20M | 80% | $16M |
| Total | $50M | $50M | — | $40M |

Initial facility limit: $40M. Initial principal: $35M. Initial headroom: $5M. Funded-scenario reserve: $10M. Reserve floor: $1M. Automatic-cure mandate cap: $5M for this demonstration mandate.

After Beta exercises the right:

| Metric | Before | After eligibility application | After successful cure |
| --- | ---: | ---: | ---: |
| Beta remaining commitment | $10M | $10M | $10M |
| Beta eligible commitment | $10M | $0 | $0 |
| Total eligible commitments | $50M | $40M | $40M |
| Borrowing base | $40M | $32M | $32M |
| Outstanding principal | $35M | $35M | $32M |
| Signed headroom | $5M | −$3M | $0 |
| Deficiency | $0 | $3M | $0 |
| Reserve | $10M | $10M | $7M |
| Lender receipts from cure | $0 | $0 | $3M |

The final state is compliant but has **zero additional draw capacity**.

## 9. Canton-specific value and proof boundary

The application combines selective disclosure, explicit contractual authority, shared credit state, and atomic settlement operations.

Without Canton, the proposed workflow would require a trusted shared operator and database, coordination between separately maintained records, and a settlement mechanism whose result must be reconciled with debt state. Canton does not eliminate every trusted party: legal-term onboarding, the settlement issuer, hosting operators, and the automation service's availability remain explicit dependencies.

The MVP must demonstrate the guarantees it claims. One application using a custom token proves the implemented workflow; it does not by itself prove integration with independent production assets or institutions.

## 10. Privacy requirements

| Information | Owning LP | Other LPs | Fund manager | Facility agent | Settlement issuer / service |
| --- | --- | --- | --- | --- | --- |
| LP commitment | Own only | No | Yes | Agreed financing view | No |
| Financing right | Own only | No | Yes | Agreed relevant terms | No |
| Unrelated side-letter terms | Not modeled | Not modeled | Not modeled | Not modeled | Not modeled |
| LP eligibility event | Own only | No | Yes | Yes | No |
| Facility balances and aggregate base | No | No | Yes | Yes | No |
| Cure mandate and requirement | No | No | Yes | Yes | Only necessary settlement details |
| Settlement transfer | No | No | Relevant leg | Relevant leg | Necessary asset data |
| Other LP identities | No | No | Yes | As agreed | No |

All protected information is unavailable to an unrelated party. Hosting operators' trust and access must be documented separately from party-level visibility.

A party can learn data through transaction consequences even when it is not a contract observer. Privacy testing must cover the full transaction structure, command results, historical updates, API responses, and logs.

The facility agent is allowed the financing inputs required to verify the calculation. Do not claim hidden-input computation or zero-knowledge underwriting.

## 11. Transaction structure and stale-state protection

The workflow uses separate committed stages so that Beta's exercise does not contain private facility operations as descendants.

### Stage A — Exercise the right

Beta exercises an available right. In one transaction:

- Consume the available right and create its exercised state.
- Advance Beta's eligibility-event epoch.
- Create a uniquely identified eligibility-change instruction.
- Preserve the existing commitment amount.

Only Beta's authorized information appears in this transaction. No facility balances, other LP positions, or cash movements are nested beneath Beta's exercise.

### Freshness gate

Maintain a small per-LP eligibility gate with a current event epoch. Facility state records the last applied epoch for each registered position.

Every credit-increasing operation must verify the current gates for the complete registered position set and require that they match the facility's applied epochs. It must reject missing gates, omitted positions, mismatches, and unresolved changes. The caller cannot choose a convenient subset of investors.

The gate check must use ledger validation of current state, not an offchain cached flag. A draw concurrent with an event must serialize consistently: a draw ordered before the event can use the then-current state; a draw ordered after it cannot use stale eligibility.

If the automation service stops after Stage A, borrowing is blocked until the event is applied. The UI displays **Eligibility update pending — draws blocked** rather than presenting the old balance as current credit authority.

### Stage B — Apply the financing consequence

The authorized service submits an application command under a fund/agent-visible orchestration context. It:

- Validates the event's identity, authority, scope, amount, and policy version.
- Consumes the event once.
- Updates the affected eligibility position.
- Recalculates borrowing capacity from the canonical positions.
- Advances the facility's applied epoch and version.
- Creates or refreshes the deficiency requirement.

Event consumption must be a narrow leaf operation. Facility changes must not be descendants of a Beta-visible event-consumption exercise. Choice arguments and return values visible to Beta must also exclude facility details.

This transaction layout and the freshness gate require an early executable privacy and concurrency proof before the rest of the application is built.

### Stage C — Cure

After Stage B commits, the service attempts cure under a valid mandate. Cash transfer, principal reduction, mandate usage, and cure satisfaction commit atomically.

Failure in Stage C must not roll back Stages A or B. The right remains exercised and the facility remains deficient.

## 12. Core contract model

Keep templates small enough to reason about, but avoid creating contracts that merely duplicate derived values.

| Contract | Essential data and purpose |
| --- | --- |
| Fund | Fund identity, manager, agent, settlement configuration |
| LPCommitment | Investor, original and called capital, remaining commitment, fund and currency |
| FinancingRight | Unique right ID, owner, affected amount, agreed scope, policy binding, availability |
| EligibilityGate | Investor/position identity and current event epoch; invalidates stale credit state |
| EligibilityChange | Unique event ID, source right, position, epoch, effective time, agreed adjustment |
| EligibilityPosition | Current eligible amount, advance rate, applied event epoch, position identity |
| FacilityPolicy | Facility limit, canonical position registry, advance treatment, accepted asset, agreed exclusion rule |
| FacilityState | Current principal, borrowing base, applied epochs, version, operational status |
| CureRequirement | Current deficiency, facility version, creation time, open/satisfied state |
| CureMandate | Authorized executor, facility, payee, asset, cap, usage, expiry, reserve floor, revocation state |
| CashHolding | Issuer, owner, asset identity, denomination, amount |

Each material choice must specify its controller, signatories supplying authority, observers, permitted consequences, and expected disclosure. Avoid an implementation that resolves authorization errors by granting every party visibility or broad spending rights.

## 13. Credit calculations and numeric rules

Use fixed-precision amounts with a documented rounding policy. Do not use floating-point frontend arithmetic as credit authority.

For the demo's cent-denominated asset:

- Round each eligible credit contribution down to cents.
- Borrowing base = sum of rounded eligible contributions.
- Credit limit = minimum of borrowing base and contractual facility limit.
- Signed headroom = credit limit − principal.
- Available to draw = maximum of zero and signed headroom, provided freshness and operational checks pass.
- Deficiency = maximum of zero and principal − credit limit.

The fixture has a $40M contractual limit, so the documented $40M → $32M example is unchanged.

Do not store derived headroom or deficiency independently unless every transition validates consistency.

## 14. Draw enforcement

`RequestDraw(amount)` must enforce:

- Authorized borrower and positive amount.
- Current, complete eligibility epochs.
- Facility open and not paused.
- No unresolved deficiency.
- Principal plus requested amount no greater than the current credit limit.
- Correct lender funding asset and sufficient balance.

A successful draw transfers the asset to the borrower and increases principal in the same transaction. A rejected draw changes neither balances nor principal.

The independent boundary scenario proves: $5M initial capacity permits an exact $5M draw; $5M plus one cent fails. Reset before the main cure demonstration so its opening principal remains $35M.

After the main $3M cure, a $1M draw still fails because capacity is zero. An optional demonstration of a further $1M repayment followed by a $1M draw can show capacity reopening, but is not required for the primary video.

## 15. Bounded automatic-cure mandate

The manager grants authority in advance for a named executor to pay the named lender for this facility, using only the specified issuer's test asset.

The mandate must enforce:

- Current deficiency and facility version.
- Exact full-cure amount for the MVP.
- Remaining cumulative cap.
- Expiry and revocation state.
- Reserve balance after payment at or above the reserve floor.
- Correct recipient, currency, and asset identity.

Demo settings: $5M cumulative cap, $1M reserve floor, expiry safely beyond the recorded demonstration session. Successful $3M cure leaves $2M unused mandate capacity.

The service automatically submits the cure after the eligibility application. A manual retry uses the same mandate checks. Revocation prevents future uncommitted cure execution; it does not reverse a completed payment or remove a deficiency.

Daml contracts do not wake themselves up. The service initiates commands; contracts enforce whether they may succeed.

## 16. Settlement and repayment

The test token must support controlled issuance, transfer, splitting, and change where necessary. Match issuer and asset identity, not merely a text currency label.

A cure atomically:

1. Checks current eligibility freshness, facility version, deficiency, and mandate.
2. Transfers exactly the deficiency from the reserve to the lender.
3. Reduces principal by the transferred amount.
4. Updates mandate usage.
5. Consumes the current cure requirement and records satisfaction.
6. Creates the replacement facility state.

Ordinary repayment must also transfer cash and reduce principal atomically. A repayment may reduce a current deficiency; any open requirement must be refreshed to the remaining amount. Never settle an old quoted cure amount without validating current state.

The MVP requires full cure or no cure payment. Partial-cure automation is outside scope.

## 17. Operational states and recovery

Expose two separate dimensions:

- **Credit state:** Compliant or Deficient, based on applied current eligibility.
- **Processing state:** Current, EligibilityUpdatePending, or Paused.

A compliant historical calculation with a pending event is not permission to borrow.

Automation must resume safely after restart, consume events exactly once at the business level, and tolerate repeated submission attempts. Contract consumption and version checks provide protection beyond transport-level command deduplication.

If cure fails, display its reason: insufficient available reserve, mandate expired, mandate revoked, limit exceeded, or stale state. Preserve the obligation. Do not include a general-purpose `CancelCure` that can erase a deficiency.

## 18. Required demo scenarios

### Scenario A — Automatic cure succeeds

Start at $40M base, $35M principal, $10M reserve. Beta exercises. The system first blocks stale draws, applies the event, records the $3M deficiency, and automatically settles $3M.

End at $32M base, $32M principal, $7M reserve, and $3M lender receipts. Status: compliant, current, zero available to draw.

### Scenario B — Reserve is insufficient

Reset the same facility with only $2M reserve and the same $1M reserve floor. Beta exercises. The new base is $32M and principal remains $35M. Full cure cannot execute.

Reserve stays $2M, lender cure receipts remain zero, deficiency stays $3M, and a $1M draw fails. The right remains exercised.

### Scenario C — Draw boundary

Use an independent reset fixture with $5M headroom and sufficient lender liquidity. Prove the exact-boundary success and one-cent-over failure. Do not reuse the modified balance in Scenario A.

## 19. Privacy and authentication proof

Provide separate authenticated sessions for Beta, Alpha, and the lender. A role switch may select seeded demo identities, but every query and command must run with the corresponding restricted authority.

Never retrieve all parties' data to the browser and hide it with components. Clear cached data when sessions change and scope backend caches by identity.

A presenter page may combine separate authorized views for a recording. Label it as a presenter view; do not present its combined visibility as a normal user's capability.

Test active contracts, historical update streams, transaction consequences, command results, attempted access by known contract ID, API payloads, and application logs. Error responses must not reveal private payloads.

If all parties share a participant or backend operator, disclose that operator's trust boundary. Separate fund and lender participants are a valuable stretch goal after the core works, not a claim assumed from distinct party IDs.

## 20. Essential interface

### Entry screen

Headline: **Private commitments. Enforceable borrowing limits.**

Subheading: **An agreed investor event changes credit capacity, blocks unsupported borrowing, and triggers an authorized repayment.**

Primary action: Launch demo. Secondary action: View evidence.

### Investor view

Show only the investor's commitment, eligible treatment where authorized, available right, exercise action, and event receipt. Beta's screen distinguishes remaining commitment from eligible collateral.

### Fund and lender view

Show eligible commitments, borrowing base, contractual limit, principal, signed headroom, available to draw, reserve where authorized, and processing status. Include draw and repayment actions with contract-backed results.

### Event explanation

For authorized users, show: affected eligible amount −$10M; rate 80%; capacity impact −$8M; policy version; resulting deficiency $3M; settlement result. Bind the explanation to committed ledger state.

### Evidence drawer

Show current identity, environment, package and contract identifiers, event and facility versions, transaction references, calculation inputs permitted to that party, and settlement receipts. Include links only where an actual explorer or evidence endpoint exists.

The timeline can show a deficiency after it has already been cured, but must label it as a historical committed step rather than slowing or simulating live ledger state.

## 21. Core invariants

- Original commitment is positive; called capital is nonnegative and no greater than original commitment.
- Remaining commitment equals original less called capital.
- Eligible amount is nonnegative and no greater than remaining commitment.
- Advance rate is between zero and 10,000 basis points.
- All positions match the correct fund, scope, currency, and canonical registry.
- Borrowing base uses current eligible positions with no omissions or duplicate contributions.
- No credit-increasing action uses unapplied eligibility epochs.
- Principal and cash amounts never become negative.
- Deficiency reflects current principal and credit limit.
- No successful draw exceeds current capacity or lacks cash settlement.
- No principal reduction occurs without the corresponding cash settlement.
- No cure pays a stale amount, an incorrect party, or an incorrect asset.
- No event or cure can be applied twice.
- A failed cure leaves the valid right exercise and applied exclusion intact.
- Transfers conserve test-asset value; issuance is separately authorized.
- Party visibility matches the privacy specification throughout transaction history.

## 22. Acceptance tests

| Area | Required proof |
| --- | --- |
| Initial fixture | $50M eligible, $40M base, $35M principal, $5M headroom |
| Rights | Correct LP succeeds; wrong LP fails; consumed right cannot execute again |
| Scope | Wrong investment, fund, facility, policy version, or amount rejected |
| Event processing | Replay and out-of-order application rejected; canonical position set enforced |
| Freshness | Draw after committed event but before application rejected |
| Concurrency | Concurrent draw/event outcomes are consistent with ledger order |
| Service recovery | Restart after event commit processes it without duplicating economic effects |
| Privacy | Beta cannot see facility or other LP data through nested consequences; other LPs cannot see Beta |
| Draw | Positive authorized draw settles; exact limit succeeds; one cent over fails |
| Successful cure | Exactly $3M transfers; principal becomes $32M; reserve becomes $7M |
| Failed cure | $2M reserve unchanged; principal stays $35M; deficiency persists |
| Mandate | Wrong executor, payee, asset, expiry, revocation, cap, and reserve-floor violations fail |
| Stale cure | Intervening repayment or state version change cannot cause overpayment |
| Atomicity | Forced settlement failure does not change principal or consume mandate allowance |
| Numeric boundaries | Invalid rates and amounts rejected; rounding never overstates capacity |
| Application | Separate sessions and caches do not leak data; reload reconstructs committed state |

Assert the actual ledger failure or invariant. Do not promise custom error names where rejection is supplied by the ledger's authorization or contract-consumption rules.

## 23. Build checkpoints

### Checkpoint 1 — Environment and scenario

Confirm current organizer requirements, pin the supported SDK, deploy a minimal contract to the target environment, and record the exact demo policy and asset assumptions.

Pass condition: a reproducible deployed transaction and a self-consistent commercial fixture.

### Checkpoint 2 — Privacy and freshness proof

Implement the smallest right, gate, event, and facility skeleton. Prove that a private event invalidates stale draws without disclosing facility state to Beta. Verify transaction history and a draw/event race.

Pass condition: the transaction structure satisfies both disclosure and freshness requirements.

### Checkpoint 3 — Complete financial flow

Implement canonical eligibility, calculation, deficiency, test cash, mandate, settlement, draw, and repayment. Complete the successful and insufficient-reserve scenarios without frontend dependency.

Pass condition: all economic balances and required atomicity assertions pass.

### Checkpoint 4 — Recovery and adversarial behavior

Add replay, stale-state, mandate, authorization, and restart tests. Confirm that failed cure cannot restore old eligibility or reopen borrowing.

Pass condition: no known path bypasses the key invariants.

### Checkpoint 5 — Authenticated interface

Build focused party views, the event explanation, scenario reset, and evidence drawer. Connect the required account/wallet flow according to confirmed event requirements.

Pass condition: the full workflow runs from the interface using restricted identities.

### Checkpoint 6 — Submission rehearsal

Run against the target environment, record timings and identifiers, rehearse both outcomes, capture the video, and verify clean setup from the README.

Pass condition: a judge can reproduce or inspect the demonstrated claims.

## 24. Demo script

Target a 60–90 second primary recording, with the economic change in the first 30 seconds.

1. Show the lender: “This fund can borrow $40M against eligible investor commitments. It currently owes $35M.”
2. Show Beta: “Under this agreed policy, Beta can exercise a private right that removes $10M from eligible collateral without changing its remaining commitment.”
3. Exercise: capacity becomes $32M and the $3M deficiency is recorded.
4. Show automatic cure: reserve pays $3M, debt becomes $32M, and lender receipts increase by $3M.
5. Show a further draw rejected: “Compliance has been restored, but there is no spare borrowing capacity.”
6. Show Alpha's separate session and the privacy evidence.
7. Briefly show the insufficient-reserve fixture: “If payment cannot complete, debt remains and borrowing stays blocked.”

Keep raw IDs in the evidence drawer. Use actual committed results; do not substitute timed frontend animations for settlement.

## 25. Demo reset and reproducibility

Create fresh scenario instances with unique run IDs rather than attempting to erase ledger history. Seed the three investors, approved policy, initial debt, lender funding, reserve, right, and mandate deterministically.

Restrict reset authority to the demo operator. Avoid cross-session collisions and never reuse an old event or cure against a new scenario.

Document initial balance issuance and debt seeding clearly. Seeded initial debt is fixture setup; subsequent draws and repayments must be actual contract operations.

## 26. Submission package

- README: problem, buyer hypothesis, demo, workflow, why Canton, limitations, setup, tests, deployment evidence.
- Architecture document: contract authority, transaction boundaries, freshness gates, service recovery, settlement semantics.
- Privacy document: matrix, party and hosting trust boundaries, test method, and observed evidence.
- Demo guide: fixtures, reset, primary sequence, failure sequence, and expected balances.
- Live application on the supported environment.
- Short video showing the complete economic loop and privacy evidence.
- Passing automated tests and reproducible commands.
- Exact package/deployment identifiers and committed transaction references.
- Optional practitioner feedback, included only if actually obtained and permitted for use.

## 27. Stretch goals, in priority order

Only begin after all core acceptance criteria pass:

1. Demonstrate fund and lender operation on separately controlled participants.
2. Replace the custom test asset through a supported settlement adapter and demonstrate a real test integration.
3. Add a concise export of the authorized borrowing-base calculation and event receipts.
4. Demonstrate additional repayment reopening draw capacity.

Do not add AI, another credit product, or a new chain to fill presentation space.

## 28. Definition of done

BaseLine is submission-ready when:

- The agreed eligibility scenario is explicit and internally consistent.
- Beta's right changes eligibility without changing its underlying remaining commitment.
- A committed event prevents subsequent use of stale borrowing limits.
- The complete $40M → $32M → $3M cure scenario works on the target environment.
- The insufficient-reserve scenario preserves debt, exclusion, and draw restrictions.
- Spending follows an enforceable mandate.
- Draws and repayments settle atomically with principal changes.
- Privacy holds across actual transaction consequences and authenticated application views.
- Automation recovers without duplicate economic effects.
- The UI explains the financing consequence and exposes verifiable evidence.
- The submission accurately distinguishes seeded fixtures, test assets, measured behavior, trust assumptions, and future integrations.

## 29. Technical references

These references support the authorization and privacy design principles; the implementation must use documentation for its pinned, supported SDK version.

- [Daml privacy model](https://docs.daml.com/concepts/ledger-model/ledger-privacy.html): projections, exercise consequences, and disclosure to non-stakeholders.
- [Daml parties and authority](https://docs.daml.com/daml/intro/6_Parties.html): controllers, signatories, and standing authorization patterns.
- [Daml composing choices](https://docs.daml.com/daml/intro/7_Composing.html): composition of authorized operations and privacy considerations.

**Product principle:** every feature must strengthen the path from a private agreed fact to an enforceable financing consequence, or make that path easier to verify.