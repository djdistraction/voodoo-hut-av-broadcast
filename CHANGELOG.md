# Changelog

All notable changes to the Voodoo Hut AV & Broadcast Integration System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Fixed
- Standardized stage naming to "Corner Stage" across all documents (was inconsistently "DJ Booth" in some files)
- Removed duplicate nginx service from docker-compose.yml that conflicted with AzuraCast's internal reverse proxy on ports 80/443
- Corrected OBS scene filename reference in README.md (voodoo-dj-booth.json → voodoo-corner-stage.json)

### Added
- Interactive pitch presentation (`pitch/index.html`) — self-contained HTML deck for stakeholder meetings

### Planned
- OBS scene collections for all three stages
- Liquidsoap AutoDJ configuration for AzuraCast
- Dante Controller routing presets
- Zone audio scheduling automation
- Network VLAN and QoS configuration templates
- Oracle Cloud infrastructure-as-code (Terraform)
- Docker Compose stack for AzuraCast deployment
- Health monitoring and alerting scripts
- Show-start and show-end automation routines

---

## [0.1.0] - 2026-04-26

### Added
- Initial repository structure established
- Comprehensive README with full system architecture documentation
- .gitignore tailored for AV/broadcast project (OS files, audio/video media, secrets, Docker, Terraform)
- MIT License
- CHANGELOG (this file)
- Repository folder structure planned across 8 major subsystems:
  - `docs/` — Architecture, runbooks, hardware specs
  - `radio/` — AzuraCast, Liquidsoap, playlists, licensing
  - `streaming/` — OBS scenes, profiles, overlays, scripts
  - `audio/` — Dante, zones, DSP, schedules
  - `video/` — Matrix routing, display zones, digital signage
  - `network/` — VLANs, QoS, topology diagrams
  - `automation/` — Show start/end routines, monitoring
  - `infrastructure/` — Oracle Cloud, Docker, backups

### Project Scope Defined
- 3 simultaneous live stage streams (Main Stage, Corner Stage, Acoustic/Patio Stage)
- 15 independent acoustic zones across 14,000 sq ft
- 37 televisions managed via video matrix
- 24/7 internet radio via AzuraCast on Oracle Cloud Free Tier
- Liquidsoap AutoDJ with automatic live feed detection and crossfade
- DMCA-compliant licensed music library for continuous broadcast

---

[Unreleased]: https://github.com/djdistraction/voodoo-hut-av-broadcast/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/djdistraction/voodoo-hut-av-broadcast/releases/tag/v0.1.0
