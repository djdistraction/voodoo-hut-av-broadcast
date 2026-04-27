# The Voodoo Hut — AV & Broadcast Integration System

> **Transforming a 14,000 sq ft venue into a broadcast-ready digital entertainment powerhouse.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: Active](https://img.shields.io/badge/Status-Active%20Development-brightgreen)]()
[![Venue: Kemah, TX](https://img.shields.io/badge/Venue-Kemah%2C%20TX-blue)]()

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Hardware Overview](#hardware-overview)
- [Repository Structure](#repository-structure)
- [Subsystems](#subsystems)
  - [24/7 Internet Radio (AzuraCast)](#247-internet-radio-azuracast)
  - [Live Streaming (OBS + BUTT)](#live-streaming-obs--butt)
  - [Zone Audio Management](#zone-audio-management)
  - [Video Distribution (NDI)](#video-distribution-ndi)
  - [Network Infrastructure](#network-infrastructure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Executive Summary

The Voodoo Hut AV & Broadcast Integration Plan transforms the venue from a standard bar setup into a **fully automated, broadcast-ready digital entertainment powerhouse**. The system provides:

- **3 simultaneous live stage performances** with independent audio/video management
- **15 acoustic zones** covering the entire 14,000 sq ft facility (including 37 televisions)
- **3 studio-quality live streams** broadcast to the internet concurrently
- **24/7 custom internet radio station** with legally compliant house music
- **Seamless AutoDJ transitions** between house music and live performances via Liquidsoap + BUTT
- A **"set it once" resilient architecture** built around the Behringer X32 / AES50 ecosystem

### Business Value

| Opportunity | Impact |
|---|---|
| 🌍 Global Audience Reach | 1.2B+ internet radio listeners worldwide |
| 🎤 Talent Attraction | Studio-quality multitrack recordings attract top-tier acts |
| 📅 365-Day Brand Presence | 24/7 radio keeps the brand alive beyond weekend visits |
| 💰 New Revenue Streams | Digital sponsorships, VOD, merch, ticketed online events |

---

## System Architecture

The signal chain has two parallel paths from the stage: one feeds the **venue PA** via AES50/ZonePRO, and one feeds the **broadcast infrastructure** via X32 USB Card Out → OBS → AzuraCast.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      THE VOODOO HUT — SIGNAL FLOW                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   MAIN STAGE           CORNER STAGE          PATIO STAGE                  │
│   S16 Stage Box        X32 Local XLR 1-8     SD8 Stage Box               │
│   (16 preamps)         (Ch 17-24)             (8 preamps)                 │
│        │                     │                     │                      │
│        └──── AES50-A ────────┘      AES50-B ───────┘                     │
│                               │                                            │
│                    Behringer X32 (FOH Console)                             │
│                    AES50 Clock Master / Mix Engine                         │
│                               │                                            │
│           ┌───────────────────┼───────────────────┐                       │
│           │                   │                   │                        │
│    PA PATH (analog)    ZONE PATH (analog)   BROADCAST PATH (USB)          │
│           │                   │                   │                        │
│      S16 Out 7/8        Local Out 13/14     Card Out 25-32                │
│      DriveRack          ZonePRO 1260        X32 USB to OBS PCs            │
│      Main PA Amps       15 Zone Amps        (Bus 9/10, 11/12, 13/14)      │
│      Main Stage         37 Televisions           │                         │
│                                            BUTT Software                   │
│                                     (Broadcast Using This Tool)            │
│                                                  │                         │
│                                            AzuraCast                       │
│                                        (Oracle Cloud)                      │
│                                                  │                         │
│                                    ┌─────────────┴──────────────┐         │
│                                    ▼                             ▼         │
│                             Internet Stream               Venue Speakers   │
│                            (Global Audience)              (via ZonePRO)    │
└──────────────────────────────────────────────────────────────────────────┘
```

### AES50 Chain (Physical Audio Backbone)

```
X32 (AES50-A) ──Cat5e STP──► S16 Main Stage (AES50-B) ──Cat5e STP──► SD8 Patio Stage
```

> **Note:** The X32↔S16↔SD8 connectivity uses **AES50 over Cat5e/etherCON** — not Dante. Dante Virtual Soundcard is used only on the three Stream PCs to receive their assigned broadcast mix channels from the X32 USB Card Out.

---

## Key Features

### 🎙️ Multi-Stage Broadcasting
- Three independent stages: **Main Stage** (S16), **Corner Stage** (X32 Local), **Patio Stage** (SD8)
- Dedicated **Broadcast Mix buses** (9/10, 11/12, 13/14) using Sends on Faders — completely independent from FOH
- Per-stage mastering: HPF 50Hz, –2.5dB@300Hz, +1.5dB@6kHz, Precision Limiter at –16 LUFS
- X32 USB Card Out (25–32) delivers mastered broadcast audio digitally to OBS computers

### 🎚️ X32 DCA & Stage Control
- **6 DCA groups** (Drum Kit, Guitars/Keys, Lead Vocals, Corner Stage, Patio Stage, DJ/Playback)
- **3 Mute Groups** for instant stage kill during changeovers without touching individual faders
- **MC Mic talkback workaround** via Mixing Station custom toggle button: Aux 7 (Shure wireless MC mic) silently re-routes from house PA to monitor buses for private band communication

### 📻 24/7 Internet Radio (AzuraCast + BUTT)
- Free Oracle Cloud Ampere A1.Flex server (4 OCPUs / 24GB RAM — Always Free tier)
- Liquidsoap AutoDJ plays licensed house music continuously
- **BUTT** (Broadcast Using This Tool) on the venue PC captures the X32 USB broadcast mix and pushes RTMP to AzuraCast on port 8005
- When BUTT connects live, Liquidsoap crossfades from house music → live stage feed with no dead air
- Returns to house playlist automatically when BUTT disconnects at show end

### 🔊 15-Zone Audio Management
- **ZonePRO 1260** handles interior bar zones (Inputs from X32 Local Out 13/14 via Matrix 3/4)
- Patio stage driven by SD8 with X32 Matrix delay (~90ms / 1ms per 1.13 ft) for acoustic alignment
- Independent volume, EQ, and HPF per zone (80Hz HPF on Inside Bar; AutoWarmth on Main Bar)
- Schedule-based zone automation (weekday/weekend/event profiles)

### 📺 37-Screen Video Distribution (NDI)
- **Mevo cameras** output NDI|HX (1080p @ 15 Mbps) over the AV VLAN
- **BirdDog PLAY decoders** convert NDI → HDMI at each of the 37 televisions
- **IGMP Snooping** required on AV switches to prevent NDI multicast from flooding POS network
- OBS uses **DistroAV (obs-ndi)** plugin to ingest Mevo camera feeds per stage
- Audio lip-sync corrected via OBS Sync Offset (150–300ms typical; measured with clap test)

### 🌐 Network Architecture
- **7 VLANs**: AV-DANTE (10), AV-VIDEO (20), STREAMING (30), MANAGEMENT (40), GUEST-WIFI (50), POS (60), STAFF (70)
- Dante/NDI VLANs completely isolated from Guest and POS
- QoS DSCP: Dante = EF (46), NDI = AF41 (34), OBS streaming = AF21 (18)

---

## Hardware Overview

### Audio

| Device | Model | Role | Protocol |
|---|---|---|---|
| FOH Console | Behringer X32 | Mix engine, clock master, broadcast bus source | AES50, USB, Ethernet |
| Main Stage Box | Behringer S16 | 16 preamp inputs for Main Stage | AES50-A from X32 |
| Patio Stage Box | Behringer SD8 | 8 preamp inputs for Patio Stage | AES50-B from S16 |
| Main PA Processor | dbx DriveRack | Crossover, limiting, delay for Main PA | XLR from S16 Out 7/8 |
| Zone Processor | dbx ZonePRO 1260 | 15-zone distribution (interior bar spaces) | XLR from X32 Local Out 13/14 |
| Remote Control | Mixing Station (tablet) | Wireless X32 control with custom talkback button | Wi-Fi (Staff VLAN) |

### Video

| Device | Model | Quantity | Role |
|---|---|---|---|
| Stage Cameras | Mevo (Start / Core) | 3 | NDI|HX source per stage |
| TV Decoders | BirdDog PLAY | 37 | NDI → HDMI at each display |
| Video Matrix | TBD | 1 | Central HDMI routing |
| Televisions | Various large-screen | 37 | Distributed across all zones |

### Streaming / Compute

| Machine | Role | Audio Source | OBS Scene Collection |
|---|---|---|---|
| Stream PC A | Main Stage stream | X32 USB Card Out (Bus 9/10) | `voodoo-main-stage.json` |
| Stream PC B | Corner Stage stream | X32 USB Card Out (Bus 11/12) | `voodoo-dj-booth.json` |
| Stream PC C | Patio Stage stream | X32 USB Card Out (Bus 13/14) | `voodoo-acoustic.json` |
| Venue PC | BUTT live RTMP push | X32 USB broadcast mix | BUTT → AzuraCast port 8005 |

### Cloud

| Resource | Details |
|---|---|
| Provider | Oracle Cloud Infrastructure (Always Free) |
| Instance | Ampere A1.Flex — 4 OCPUs, 24GB RAM, Ubuntu 22.04 aarch64 |
| Service | AzuraCast (Docker) |
| Open Ports | 22, 80, 443, 8000 (Icecast), 8005/8006/8007 (RTMP ingest per stage) |

---

## Repository Structure

```
voodoo-hut-av-broadcast/
│
├── 📁 docs/                          # Project documentation
│   ├── architecture/                 # System diagrams and signal flow
│   │   ├── system-overview.md        # Layered architecture breakdown
│   │   └── comprehensive-av-integration-framework.md  # Full 8-phase implementation guide
│   ├── runbooks/                     # Operational procedures
│   │   └── show-day-checklist.md     # Pre/during/post-show checklist
│   └── hardware/                     # Hardware specs and wiring diagrams
│       └── inventory.md              # Full hardware registry
│
├── 📁 radio/                         # AzuraCast / Internet Radio
│   ├── azuracast/                    # AzuraCast configuration exports
│   ├── liquidsoap/                   # AutoDJ scripts
│   │   └── autodj.liq               # Main Liquidsoap script (crossfade logic)
│   ├── playlists/                    # Playlist management
│   └── licensing/                    # Music licensing documentation
│       └── README.md                # PRO licenses, SoundExchange, DMCA guide
│
├── 📁 streaming/                     # OBS & Live Streaming
│   ├── obs-scenes/                   # OBS scene collections (per stage)
│   ├── obs-profiles/                 # OBS stream profiles (encoder/bitrate)
│   ├── overlays/                     # Broadcast graphic overlays
│   └── scripts/                      # OBS Python/Lua automation scripts
│
├── 📁 audio/                         # Audio Routing & Zone Management
│   ├── dante/                        # Dante Controller presets (Stream PC routing)
│   ├── zones/                        # Zone configuration files
│   ├── dsp/                          # DSP processor settings (ZonePRO, DriveRack)
│   └── schedules/                    # Automated zone schedules
│
├── 📁 video/                         # Video Routing & Display [planned]
│   ├── matrix/                       # Video matrix configurations
│   ├── displays/                     # BirdDog/display zone assignments
│   └── content/                      # Digital signage content specs
│
├── 📁 network/                       # Network Infrastructure
│   └── README.md                    # 7-VLAN plan, IP allocations, QoS, IGMP
│
├── 📁 automation/                    # System Automation & Scripts [planned]
│   ├── show-start/                   # Pre-show automation routines
│   ├── show-end/                     # Post-show routines
│   ├── scheduled-tasks/              # Cron jobs and scheduled automation
│   └── monitoring/                   # Health checks and alerts
│
├── 📁 infrastructure/                # Server & Cloud Infrastructure
│   └── docker/
│       ├── docker-compose.yml        # AzuraCast full stack (web + DB + Nginx)
│       └── azuracast.env.example    # Environment variable template (copy → .env)
│
├── 📄 README.md                      # This file
├── 📄 .gitignore                     # Git ignore rules
├── 📄 LICENSE                        # MIT License
└── 📄 CHANGELOG.md                  # Version history
```

> 📌 Folders marked **[planned]** are defined in the architecture but not yet populated with files.

---

## Subsystems

### 24/7 Internet Radio (AzuraCast)

A free **Oracle Cloud Ampere A1.Flex** server runs **AzuraCast** (Docker) to broadcast continuous, properly licensed house music to the venue and website.

**Live transition flow:**
1. House music playlist plays continuously via Liquidsoap AutoDJ
2. When a live show begins, the sound tech launches **BUTT** on the venue PC
3. BUTT captures the X32's USB broadcast mix and pushes RTMP to AzuraCast on port 8005
4. Liquidsoap detects the incoming stream and **crossfades** house music → live feed (3-second fade)
5. When BUTT disconnects at show end, Liquidsoap crossfades back to the house playlist — no dead air

Key components: **AzuraCast** (station management) · **Liquidsoap** (AutoDJ + crossfade engine) · **Icecast2** (stream distribution) · **BUTT** (RTMP push client)

See `radio/` for full configuration.

### Live Streaming (OBS + BUTT)

Three dedicated **OBS Studio** instances handle independent stage streams:

| Instance | Stage | Audio Source | RTMP Target |
|---|---|---|---|
| OBS-A | Main Stage | X32 USB Card Out — Bus 9/10 | AzuraCast / Twitch / YouTube |
| OBS-B | Corner Stage | X32 USB Card Out — Bus 11/12 | AzuraCast / Twitch / YouTube |
| OBS-C | Patio Stage | X32 USB Card Out — Bus 13/14 | AzuraCast / Twitch / YouTube |

**Broadcast Mix isolation:** Each stream bus is mixed separately using Sends on Faders on the X32 (tap point: Post-Fader). The Vocal Delay FX return (Bus 14) is explicitly excluded from stream buses so the online mix stays clean. Each bus is mastered to –16 LUFS via the X32 Precision Limiter before leaving over USB.

**NDI video sync:** After connecting Mevo cameras via the DistroAV plugin, perform the clap test to measure lip-sync offset (typically 150–300ms) and enter it in OBS Advanced Audio Properties → Sync Offset for the USB audio input.

See `streaming/` for scene files, profiles, and configuration.

### Zone Audio Management

The venue is divided into **15 independent acoustic zones**:

| Zones | Area | Driver | Notes |
|---|---|---|---|
| 1–3 | Main Stage Front, Rear, Dance Floor | Amp Rack A | High-SPL; fed from S16 / DriveRack |
| 4–6 | DJ Booth, Corner Stage, Acoustic Stage | Amp Rack B | Independent PA per stage |
| 7–9 | Inside Bar (N/S), Main Bar | dbx ZonePRO 1260 | Fed from X32 Local Out 13/14 via Matrix 3/4 |
| 10–11 | Outdoor Patio, Patio Bar | SD8 Out (delayed) | ~90ms matrix delay for acoustic alignment |
| 12 | Dining Area | ZonePRO | Reduced SPL |
| 13–15 | Restrooms, Corridors, Staff/Kitchen | Amp Rack C | Background level only |

**ZonePRO DSP:** 80Hz HPF on Inside Bar zones; AutoWarmth algorithm on Main Bar for low-volume daytime warmth. See `audio/` for routing presets, zone schedules, and DSP configurations.

### Video Distribution (NDI)

Video is distributed over the AV-VIDEO VLAN (192.168.20.0/24) using NDI|HX:

- **Mevo cameras** → NDI|HX output (1080p / 15 Mbps) over Ethernet
- **BirdDog PLAY decoders** (one per TV) → NDI input / HDMI output to each display
- **IGMP Snooping** must be enabled on all switches on this VLAN — without it, NDI multicast will flood every port and can crash the POS system
- OBS ingests camera feeds using the **DistroAV** plugin (formerly obs-ndi)

See `video/` (planned) for matrix presets and display zone assignments.

### Network Infrastructure

A **7-VLAN architecture** completely isolates AV traffic from guest and POS systems:

| VLAN | Purpose | Key Requirement |
|---|---|---|
| 10 — AV-DANTE | Dante Virtual Soundcard (Stream PCs) | Jumbo frames, no flow control |
| 20 — AV-VIDEO | NDI (Mevo → BirdDog → TVs) | IGMP Snooping enabled |
| 30 — STREAMING | OBS PCs + AzuraCast access | 50 Mbps upload minimum |
| 50 — GUEST-WIFI | Guest internet | Isolated from all AV VLANs |
| 60 — POS | Point-of-sale terminals | Isolated from all AV VLANs |

See `network/` for full VLAN plan, IP allocations, and QoS configuration.

---

## Getting Started

### Prerequisites

- Git
- Docker & Docker Compose (for AzuraCast deployment)
- OBS Studio 30+ with DistroAV (obs-ndi) plugin
- BUTT (Broadcast Using This Tool) — free download at danielnoethen.de
- Dante Controller (free from Audinate) — for Stream PC routing
- Mixing Station Pro (tablet app) — for remote X32 control
- Access to the Voodoo Hut AV network

### Clone the Repository

```bash
git clone https://github.com/djdistraction/voodoo-hut-av-broadcast.git
cd voodoo-hut-av-broadcast
```

### Initial Setup Order

1. **Read the full implementation guide first:** `docs/architecture/comprehensive-av-integration-framework.md`
2. Configure network VLANs and QoS per `network/README.md`
3. Cable hardware per Phase 1 of the implementation guide (AES50 backbone, ZonePRO, DriveRack)
4. Program the X32 per Phases 2–5 (input routing, FX, DCA/mute groups, matrix outputs)
5. Deploy AzuraCast: `cd infrastructure/docker && cp azuracast.env.example azuracast.env` then fill in secrets and run `docker compose up -d`
6. Configure BUTT on the venue PC to push to AzuraCast port 8005
7. Import OBS scene collections from `streaming/obs-scenes/` and set USB audio as source
8. Perform the NDI clap test per the streaming guide and set OBS Sync Offset
9. Load Dante preset `HOUSE_MUSIC` from `audio/dante/presets/` as the default state

---

## Deployment

A high-level deployment order (each phase documented in `docs/architecture/comprehensive-av-integration-framework.md`):

| Phase | Task | Reference |
|---|---|---|
| 1 | Physical cabling — AES50 backbone, ZonePRO, DriveRack | Phase 1 in framework doc |
| 2 | X32 input routing (40-channel patch) | Phase 2 in framework doc |
| 3 | X32 FX routing and DSP strategy | Phase 3 in framework doc |
| 4 | DCA/mute groups + Mixing Station talkback button | Phase 4 in framework doc |
| 5 | Zone matrix routing + ZonePRO configuration | Phase 5 in framework doc |
| 6 | Broadcast mix buses (Sends on Faders + USB routing) | Phase 6 in framework doc |
| 7 | Oracle Cloud + AzuraCast + BUTT setup | Phase 7 in framework doc |
| 8 | NDI network + OBS ingestion + lip-sync correction | Phase 8 in framework doc |

---

## Contributing

This is an internal operational repository for The Voodoo Hut. To propose changes:

1. Create a feature branch: `git checkout -b feature/your-change`
2. Commit your changes with descriptive messages
3. Open a Pull Request with a description of what changed and why
4. Changes to live production configs require review before merging

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built for The Voodoo Hut — Kemah, TX | #VoodooCult*
