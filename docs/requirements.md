# BaseLine — CP1 Requirements Record

Recorded: 2026-09-21

## Verified from current official Canton sources

- HackCanton Season 3 kicked off on September 17, 2026.
- The event is fully online and allows solo or team participation.
- The public launch announcement advertises up to $50K in cash + credits.
- Canton currently documents DPM as the primary CLI for Canton development.
- The current DPM documentation's generated `daml.yaml` example uses SDK `3.5.7`.
- Current Canton developer resources document WalletConnect/CIP-103-capable dApp tooling as available ecosystem integration paths.

Sources:
- https://forum.canton.network/t/hackcanton-s3-launch-build-ship-win-cash-prize/9119
- https://forum.canton.network/t/hackcanton-s3-opening-ceremony-and-final-registration-reminder/9142
- https://natokhd.com/video/hackcanton-season-3-opening-ceremony-build-on-canton/_PesNP65N7I
- https://cantonnews.org/hackcanton-season-3-sets-september-17-start-and-october-21-final
- https://docs.canton.network/sdks-tools/cli-tools/dpm
- https://www.canton.network/developer-resources

## Verified HackCanton build requirements

- Build phase: September 18–October 9, 2026.
- Submission deadline: October 9, 2026 at 23:59 UTC.
- Tracks: Real-World Asset & Business Workflows; Financial Applications: DeFi, Exchanges & Prediction Markets; Investment Infrastructure: Funds, DAOs & Governance; Data, Analytics & Ecosystem Dashboards; Open Track: Build Anything.
- Opening materials explicitly provide DevNet environment/resources.

## Still unverified / must be confirmed before CP1 can pass

- Exact DevNet credentials/onboarding for this repository.
- Whether wallet connect/disconnect is mandatory for judging or merely optional.
- Required submission materials and deployment evidence from the organizer portal.
- Organizer-supported/pinned Daml SDK version for the target environment.

The AppsFactory hackathon page is client-rendered in the available text interface. Timeline, tracks, and DevNet availability were recovered from the opening-ceremony materials; portal-specific access and wallet requirements still need direct verification.

## Local execution environment

- Java: 21
- Node: 22.16.0
- npm: 10.9.2
- Git: 2.47.3
- DPM: not installed
- Daml SDK: not installed
- Docker: not available

The sandbox cannot resolve external hosts from the shell, so the official DPM installer/OCI registry cannot be reached here. This leaves CP1's real Daml compile/deploy smoke test OPEN.

## Fixed commercial fixture

- Alpha remaining/eligible commitment: $20M
- Beta remaining/eligible commitment: $10M initially; $0 eligible after event; remaining commitment stays $10M
- Gamma remaining/eligible commitment: $20M
- Advance rate: 80%
- Initial eligible total: $50M
- Initial borrowing base and contractual limit: $40M
- Initial principal: $35M
- Initial signed headroom: $5M
- Funded reserve fixture: $10M
- Insufficient reserve fixture: $2M
- Reserve floor: $1M
- Cure mandate cap: $5M
- Post-event borrowing base: $32M
- Required cure: $3M
- Post-cure principal: $32M
- Post-cure reserve: $7M
- Post-cure available-to-draw: $0
