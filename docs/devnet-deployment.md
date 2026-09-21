# CP1 — Hackathon DevNet Deployment via Seaport

Recorded: 2026-09-21

## Why this path

Current Canton hackathon support points builders to Seaport for hosted DevNet deployment. The current Seaport builder guide explicitly states that hackathon builders use a shared `5n sandbox` validator and do not need to configure a validator or IP allowlisting.

References:
- https://forum.canton.network/t/deploying-on-canton-devnet-from-cli/8886
- https://github.com/Jatinp26/Seaport-Guide
- https://app.devnet.seaport.to
- https://devnet.cantonloop.com

## 1. Create / open the DevNet wallet

Open:

https://devnet.cantonloop.com

Create or open the DevNet Loop wallet and copy the wallet Party ID.

The Party ID is used by the hackathon organizer to add the builder to the correct Seaport organization/team.

Do not commit wallet credentials or authentication material to this repository.

## 2. Enter Seaport

Open:

https://app.devnet.seaport.to

Log in with the Loop DevNet wallet.

Use the organization switcher in the top-left and select the hackathon organization/team.

Expected validator in the organization:

`5n sandbox`

If the hackathon organization is not visible, provide the wallet Party ID to the organizer through the official hackathon support channel so they can add it.

## 3. Import BaseLine

In Seaport, use **Connect GitHub** and select:

`Ay-obami/Baseline`

Branch:

`main`

The canonical Daml project is under:

`daml/`

SDK:

`3.5.11`

Local verification before upload:

- `dpm test`: PASS
- `dpm build`: PASS
- DAR: `.daml/dist/baseline-0.1.0.dar`

## 4. Build in Seaport

Build the Daml project from Seaport.

Do not mark CP1 network compatibility as proven unless Seaport successfully builds or accepts the locally built DAR.

Record:

- build timestamp;
- SDK/build version shown by Seaport;
- DAR/package identifier.

## 5. Deploy the DAR

Open **Deploy**, select the built BaseLine DAR, and choose:

`5n sandbox`

Deploy and wait for a successful result.

Record:

- environment: Seaport DevNet / `5n sandbox`;
- package ID;
- repository commit;
- deployment timestamp.

## 6. Execute the smoke transaction

Use the deployed `Test.Smoke:Smoke` template only for CP1 evidence if test templates are exposed by the deployment, or deploy/use an equivalent production smoke template if Seaport filters test modules.

Required evidence:

1. Authorized party creates the smoke contract.
2. Authorized party can query/see the contract.
3. Unrelated party does not receive the protected contract.
4. Unauthorized exercise is rejected.
5. Authorized exercise succeeds and archives the contract.

Record available Seaport contract/update identifiers without credentials.

## 7. CP1 completion record

CP1 can close only when the following are all true:

- DPM 1.0.22 recorded.
- Daml SDK 3.5.11 recorded.
- `dpm test` passes.
- `dpm build` produces `baseline-0.1.0.dar`.
- BaseLine DAR is deployed to the organizer-provided/shared DevNet validator.
- At least one real network transaction is recorded.
- Privacy/authority smoke result is documented.
- No credentials are committed.

The full CP2 privacy/freshness architecture is not part of this smoke test; CP2 begins only after this gate closes.
