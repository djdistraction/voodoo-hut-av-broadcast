# Repository Structure & Contents

## Overview

This repository contains the complete technical blueprint for The Voodoo Hut's AV & Broadcast Integration System — a comprehensive audio-visual infrastructure project that transforms a 14,000 sq ft live music venue into a broadcast-ready digital entertainment platform.

The repo documents:
- **System architecture** — 3 stages, 15 audio zones, 37 screens, 24/7 internet radio
- **Implementation plan** — 8-phase roadmap from physical cabling to live streaming
- **Hardware specifications** — Complete inventory of audio, video, network equipment
- **Configuration templates** — X32 routing, zone management, Docker deployments
- **Operational procedures** — Show day checklists, licensing compliance, maintenance schedules

---

## Directory Structure

```
voodoo-hut-av-broadcast/
│
├── 📋 README.md                          # Main project overview (start here)
├── 📋 STRUCTURE.md                       # This file
├── 📋 CHANGELOG.md                       # Version history and updates
├── 📋 LICENSE                            # MIT License
└── 📋 .gitignore                         # Git exclusions (secrets, media, etc.)
│
├── 📁 pitch/                             # ⭐ Stakeholder presentation
│   ├── index.html                        # Interactive pitch deck (open in browser)
│   ├── README.md                         # Pitch deck guide
│   └── assets/                           # (Logos, images go here)
│
├── 📁 docs/                              # 📚 Project documentation
│   ├── architecture/
│   │   ├── system-overview.md            # 5-layer system breakdown
│   │   └── comprehensive-av-integration-framework.md  # 8-phase implementation guide
│   ├── hardware/
│   │   └── inventory.md                  # Complete hardware specs + serial #s
│   └── runbooks/                         # (Operational procedures — planned)
│
├── 📁 audio/                             # 🔊 Audio routing & zone management
│   ├── README.md                         # Audio system overview
│   ├── dante/                            # Dante Virtual Soundcard presets
│   │   └── presets/                      # Pre/show/multishow routing (planned)
│   ├── zones/                            # Zone configuration files (planned)
│   ├── dsp/                              # DSP processor configs (X32, ZonePRO) (planned)
│   └── schedules/                        # Zone automation schedules (planned)
│
├── 📁 streaming/                         # 📡 OBS & live broadcast
│   ├── README.md                         # OBS setup, BUTT configuration
│   ├── obs-scenes/                       # OBS scene collections (3 stages) (planned)
│   ├── obs-profiles/                     # OBS encoder profiles (planned)
│   ├── overlays/                         # Lower thirds, bugs, graphics (planned)
│   ├── scripts/                          # OBS automation scripts (planned)
│   └── butt/                             # BUTT (Broadcast Using This Tool) configs (planned)
│
├── 📁 radio/                             # 📻 AzuraCast & internet radio
│   ├── README.md                         # AzuraCast overview (planned)
│   ├── azuracast/                        # AzuraCast config exports (planned)
│   ├── liquidsoap/                       # AutoDJ scripts & crossfade logic (planned)
│   ├── playlists/                        # House music playlist templates (planned)
│   └── licensing/
│       └── README.md                     # Music licensing guide (ASCAP, BMI, SoundExchange)
│
├── 📁 network/                           # 🌐 Network infrastructure
│   └── README.md                         # 7-VLAN architecture, QoS, IP plan
│
├── 📁 video/                             # 🎬 Video routing & display (planned)
│   ├── matrix/                           # HDMI matrix configs
│   ├── displays/                         # BirdDog decoder assignments
│   └── content/                          # Digital signage specs
│
├── 📁 automation/                        # ⚙️ System automation (planned)
│   ├── show-start/                       # Pre-show automation routines
│   ├── show-end/                         # Post-show cleanup routines
│   ├── scheduled-tasks/                  # Cron jobs, daily operations
│   └── monitoring/                       # Health checks, alerting
│
└── 📁 infrastructure/                    # ☁️ Cloud & server infrastructure
    └── docker/
        ├── docker-compose.yml            # AzuraCast Docker stack
        └── azuracast.env.example         # Environment variables template

```

---

## Key Sections Explained

### 🎯 Pitch (`pitch/`)

**What it is:** Interactive HTML presentation for stakeholder meetings.

**Contains:**
- `index.html` — Self-contained, works offline, no dependencies
- 13 slides covering vision, revenue, technical details, implementation roadmap
- Designed for tech-savvy audiences (Jordan — the GM)

**Use:** Open in any browser. Keyboard navigation: spacebar/arrows to advance.

---

### 📚 Docs (`docs/`)

**What it is:** The authoritative technical documentation.

**Key files:**

| File | Purpose |
|------|---------|
| `architecture/system-overview.md` | 5-layer architecture: Source → Mixing → Dante → Broadcast/Venue → Distribution |
| `architecture/comprehensive-av-integration-framework.md` | **The implementation bible.** 8-phase step-by-step guide: cabling, X32 routing, FX, DCA, zones, broadcast buses, AzuraCast, NDI. This is your build checklist. |
| `hardware/inventory.md` | Every device, model number, location, serial # placeholder, maintenance schedule |

**When to use:** Read the system-overview first for architecture. Then reference the comprehensive-av-integration-framework for implementation details.

---

### 🔊 Audio (`audio/`)

**What it is:** All audio routing configuration and zone management.

**Contains:**
- X32 input/output routing (40-channel logical patch sheet)
- DCA & mute group assignments
- FX processor routing (reverb, delay, enhancement)
- Broadcast mix bus configuration (–16 LUFS mastering per stage)
- Zone map: 15 zones across 14,000 sq ft
- Talkback workaround via Mixing Station
- Dante routing presets (when configured)

**Reference:** Before configuring X32 or ZonePRO, read `audio/README.md` to understand the full signal chain.

---

### 📡 Streaming (`streaming/`)

**What it is:** OBS Studio and BUTT (live RTMP push) configuration.

**Contains:**
- How the broadcast chain works (X32 USB → OBS/BUTT → AzuraCast)
- OBS instance setup (3 independent streams, one per stage)
- Audio source verification (X32 USB routing)
- NDI video integration (Mevo cameras → BirdDog decoders)
- Lip-sync correction procedure (clap test)
- BUTT configuration (lightweight RTMP push client)
- Scene collections (Live, Intermission, Countdown, Technical Difficulties)

**Files (planned):** Scene .json files, encoder profiles, overlay templates.

---

### 📻 Radio (`radio/`)

**What it is:** AzuraCast (internet radio) and 24/7 AutoDJ setup.

**Contains:**
- AzuraCast Docker configuration
- Liquidsoap AutoDJ script (house music → live crossfade → back to house)
- 3 RTMP ingest ports (8005/8006/8007 for stages A/B/C)
- **Licensing guide** — ASCAP, BMI, SESAC, SoundExchange compliance

**Critical:** Read `radio/licensing/README.md` before going live. It covers:
- In-venue performance licenses (PROs)
- Internet streaming licenses (separate from in-venue)
- SoundExchange reporting requirements
- Pre-licensed music alternatives (Pretzel.rocks, Epidemic Sound)

---

### 🌐 Network (`network/`)

**What it is:** Complete network architecture and IP planning.

**Contains:**
- 7-VLAN design:
  - VLAN 10 — AV-DANTE (Dante audio-over-IP, low latency)
  - VLAN 20 — AV-VIDEO (NDI video distribution)
  - VLAN 30 — STREAMING (OBS PCs, AzuraCast access)
  - VLAN 40 — MANAGEMENT (X32, ZonePRO, switches)
  - VLAN 50 — GUEST-WIFI (isolated from AV)
  - VLAN 60 — POS (isolated from AV)
  - VLAN 70 — STAFF (tablets, management devices)
- IP address plan (all device IPs)
- QoS configuration (DSCP markings, bandwidth budgets)
- Switch requirements (IGMP Snooping, jumbo frames, flow control)
- Internet uplink specs (50+ Mbps upload minimum)

**Critical:** The AV VLANs (10, 20) must be completely isolated from Guest (50) and POS (60). NDI multicast flooding can crash a POS system.

---

### ☁️ Infrastructure (`infrastructure/docker/`)

**What it is:** AzuraCast Docker deployment.

**Contains:**
- `docker-compose.yml` — Full AzuraCast stack (web, database, Icecast)
- `azuracast.env.example` — Environment variables template
  - Passwords, email, RTMP mount points, Liquidsoap settings

**Important:**
- Copy `.env.example` → `.env` and fill in values
- **NEVER commit `azuracast.env`** to git (it's in .gitignore)
- Deploy with: `docker compose up -d`

---

## What's Included vs. What's Planned

### ✅ Included (Ready Now)

- Full architectural documentation
- Hardware inventory with specs
- Network VLAN and QoS design
- Audio routing explanation (X32, zones, broadcast buses)
- Streaming setup guide (OBS, BUTT, NDI, lip-sync)
- Music licensing compliance guide
- Implementation framework (8 phases, step-by-step)
- Docker Compose for AzuraCast
- Interactive pitch presentation

### 📋 Planned (Documented Structure, Not Yet Populated)

- OBS scene collections (.json files)
- Dante Controller routing presets (.xml files)
- X32 scene exports
- Zone configuration JSON files
- Zone automation schedules
- Liquidsoap AutoDJ script
- Show-day operational checklists
- Automation routines (show start/end)
- Health monitoring scripts
- Video matrix configuration templates

---

## How the Pieces Fit Together

```
Physical Venue (14,000 sq ft)
    ↓
3 Stage Inputs (Main/Corner/Patio)
    ↓
Behringer X32 (FOH mixer, AES50 master)
    ↓
    ├─ PA Output Path → DriveRack → Amps → 15 zones, 37 screens
    ├─ Zone Path → ZonePRO → Interior bar zones
    └─ Broadcast Path → USB → OBS + BUTT
         ↓
         ├─ OBS (video composition, NDI cameras, encoding)
         └─ BUTT (audio RTMP push)
             ↓
             AzuraCast (Oracle Cloud)
                 ↓
                 ├─ Icecast (internet stream)
                 ├─ Liquidsoap (AutoDJ, live crossfade)
                 └─ RTMP ingest (3 stages)
```

---

## Getting Started

### First Time Exploring

1. **Understand the vision:** Read `README.md` (full system overview)
2. **See the pitch:** Open `pitch/index.html` in a browser (13-slide deck)
3. **Learn the architecture:** Read `docs/architecture/system-overview.md` (5-layer model)
4. **Deep dive on implementation:** Read `docs/architecture/comprehensive-av-integration-framework.md` (8 phases, step-by-step)

### Pre-Implementation

1. **Verify hardware:** Check `docs/hardware/inventory.md` (specs, models, serial #s)
2. **Plan the network:** Read `network/README.md` (VLANs, IPs, QoS)
3. **Understand licensing:** Read `radio/licensing/README.md` (critical compliance)
4. **Audio routing reference:** Read `audio/README.md` (40-channel patch, DCA groups, zones)

### During Implementation

1. Follow **8 phases** in `comprehensive-av-integration-framework.md`
2. Reference `audio/README.md` for X32 configuration
3. Reference `streaming/README.md` for OBS setup
4. Reference `infrastructure/docker/` for AzuraCast deployment

### Operations

1. Pre-show: Check `docs/runbooks/show-day-checklist.md` (planned)
2. Daily: Monitor `automation/monitoring/` health checks (planned)
3. Monthly: Update `infrastructure/docker/` images and review `docs/hardware/inventory.md`

---

## Key Contacts & Resources

| Topic | Resource |
|-------|----------|
| System Architecture | `docs/architecture/comprehensive-av-integration-framework.md` |
| X32 Configuration | `audio/README.md` |
| Network Design | `network/README.md` |
| Streaming Setup | `streaming/README.md` |
| Music Licensing | `radio/licensing/README.md` |
| Hardware Specs | `docs/hardware/inventory.md` |
| Pitch to Stakeholders | `pitch/index.html` |

---

## Version & Status

**Current Version:** 0.1.0 (2026-04-27)  
**Status:** Active Development  
**Last Updated:** 2026-04-27

See `CHANGELOG.md` for version history.

---

## Questions?

This repo is self-documenting. Every section has a `README.md` explaining what's there and why. Start with the file that matches your question:

- *"How do I understand the system?"* → `README.md`
- *"How do I build it?"* → `docs/architecture/comprehensive-av-integration-framework.md`
- *"How do I configure X32?"* → `audio/README.md`
- *"How do I set up streaming?"* → `streaming/README.md`
- *"What does the network look like?"* → `network/README.md`
- *"What hardware do I need?"* → `docs/hardware/inventory.md`
