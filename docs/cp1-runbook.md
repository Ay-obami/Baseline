# CP1 Runbook

Recorded: 2026-10-01

This runbook separates BaseLine's verified local CP1 evidence from the still-open HackCanton target-network gate. Local compiler/test success is real evidence, but it is not a substitute for a transaction on the organizer-provided environment.

## 1. Verified toolchain

The repository pins Daml SDK 3.5.11 in `daml/daml.yaml`. The current Ubuntu environment uses the standalone DPM 1.0.22 launcher with the 3.5.11 project SDK.

```bash
dpm --version
cd daml
dpm install
dpm version --active
```

Official DPM reference: https://docs.canton.network/sdks-tools/cli-tools/dpm

## 2. Reproduce from current main

```bash
git clone https://github.com/Ay-obami/Baseline.git
cd Baseline
git checkout main
npm run verify
cd daml
dpm test
dpm build
find .daml/dist -maxdepth 1 -type f -print
```
## 3. Fresh local evidence

A fresh portfolio-readiness run on 2026-10-01 from `main` base `b7c89fab2152a09ce8a3795fddf2d38ef3da4d2f` produced:

- Node verification: 8/8 tests pass.
- `daml/Test/Math.daml:testMath`: PASS, 0 active contracts, 0 transactions.
- `daml/Test/Smoke.daml:testSmoke`: PASS, 0 active contracts, 3 transactions.
- `dpm build`: PASS and created `.daml/dist/baseline-0.1.0.dar`.
- SDK used by the package: 3.5.11.

The Daml smoke script exercises authorized creation, owner visibility, outsider invisibility, unauthorized exercise rejection, and authorized cleanup in Daml Script.

`dpm build` currently emits a non-blocking packaging warning because the package both defines a template and depends on `daml-script`. For production packaging, tests/scripts should be split into a separate package; this warning does not invalidate the local CP1 behavior above.

## 4. What local CP1 proves

The local checks prove the fixed-precision facility arithmetic, compile the Daml package, and exercise the intended authorization/visibility behavior in Daml Script. They also produce a deployable DAR artifact.

They do **not** prove deployment to the HackCanton shared validator, organizer permissions, or live network visibility semantics.
## 5. HackCanton target-network gate

The remaining CP1 release gate is organizer-controlled access to the HackCanton organization/shared validator in Seaport. The account has previously authenticated to Seaport, but only Personal mode was visible; no replacement organization should be created.

When access is available, record without secrets:

- exact SDK/API version and environment name;
- package ID for the uploaded DAR;
- update/transaction identifier;
- git commit;
- authorized owner visibility result;
- outsider visibility result;
- unauthorized exercise rejection.

A local `dpm sandbox`, `dpm test`, or `dpm build` run must not be presented as this target-network receipt.

## 6. Current status

- Local compiler/test portion of CP1: **DONE**.
- DAR build: **DONE**.
- Shared HackCanton DevNet/Seaport transaction: **BLOCKED** on organizer org access.
- CP2 work that depends on that environment: **PARKED** until access is provided.
