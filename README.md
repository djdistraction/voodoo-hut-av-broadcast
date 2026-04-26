# 🎭 The Voodoo Hut — AV & Broadcast Integration System

> **Transforming a 14,000 sq ft venue into a broadcast-ready digital entertainment powerhouse.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: Active](https://img.shields.io/badge/Status-Active%20Development-brightgreen)]()
[![Venue: Kemah, TX](https://img.shields.io/badge/Venue-Kemah%2C%20TX-blue)]()

---

## 📋 Table of Contents

- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Repository Structure](#repository-structure)
- [Subsystems](#subsystems)
  - [24/7 Internet Radio (AzuraCast)](#247-internet-radio-azuracast)
  - [Live Streaming (OBS)](#live-streaming-obs)
  - [Zone Audio Management](#zone-audio-management)
  - [Network Infrastructure](#network-infrastructure)
- [Hardware Inventory](#hardware-inventory)
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
- **Seamless AutoDJ transitions** between house music and live performances
- A **"set it once" resilient architecture** maximizing existing hardware

### Business Value

| Opportunity | Impact |
|---|---|
| 🌍 Global Audience Reach | 1.2B+ internet radio listeners worldwide |
| 🎤 Talent Attraction | Studio-quality multitrack recordings attract top-tier acts |
| 📅 365-Day Brand Presence | 24/7 radio keeps the brand alive beyond weekend visits |
| 💰 New Revenue Streams | Digital sponsorships, VOD, merch, ticketed online events |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE VOODOO HUT — SIGNAL FLOW                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  STAGE A          STAGE B          STAGE C                       │
│  (Main)           (DJ Booth)       (Acoustic)                    │
│    │                │                │                           │
│    ▼                ▼                ▼                           │
│  Dante/AVB      Dante/AVB        Analog/USB                      │
│  Network        Network          Interface                        │
│    │                │                │                           │
│    └────────────────┴────────────────┘                           │
│                         │                                         │
│                    Audio Router                                   │
│                  (Dante Controller)                               │
│                         │                                         │
│          ┌──────────────┼──────────────┐                         │
│          ▼              ▼              ▼                          │
│     OBS Instance    OBS Instance   OBS Instance                  │
│     (Stream A)      (Stream B)     (Stream C)                    │
│          │              │              │                          │
│          └──────────────┴──────────────┘                         │
│                         │                                         │
│                    AzuraCast                                       │
│               (Oracle Cloud Free Tier)                            │
│                         │                                         │
│            ┌────────────┴────────────┐                           │
│            ▼                         ▼                            │
│     Internet Stream           Venue PA System                     │
│    (Global Audience)          (15 Audio Zones)                   │
│                                       │                           │
│                              37 Televisions                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 🎙️ Multi-Stage Broadcasting
- Three independent OBS instances running simultaneously
- Per-stage scene collections with branded overlays
- Isolated multitrack audio capture for post-production

### 📻 24/7 Internet Radio (AzuraCast)
- Free Oracle Cloud server hosting
- Liquidsoap AutoDJ for seamless transitions
- DMCA-compliant licensed music library
- Automatic live feed detection and crossfading

### 🔊 15-Zone Audio Management
- Independent volume control per zone
- Matrix routing via Dante/AVB network
- Schedule-based zone automation
- Emergency override capability

### 📺 37-Screen Video Distribution
- Centralized video routing
- Stage-to-screen assignment flexibility
- Custom content per zone (promotions, social feeds, live video)

### 🌐 Network Architecture
- Dedicated AV VLAN separation from guest/POS traffic
- Redundant uplinks for broadcast reliability
- QoS prioritization for audio-over-IP traffic

---

## Repository Structure

```
voodoo-hut-av-broadcast/
│
├── 📁 docs/                          # Project documentation
│   ├── architecture/                 # System diagrams and signal flow
│   ├── runbooks/                     # Operational procedures
│   └── hardware/                     # Hardware specs and wiring diagrams
│
├── 📁 radio/                         # AzuraCast / Internet Radio
│   ├── azuracast/                    # AzuraCast configuration files
│   ├── liquidsoap/                   # AutoDJ scripts and logic
│   ├── playlists/                    # Playlist management
│   └── licensing/                    # Music licensing documentation
│
├── 📁 streaming/                     # OBS & Live Streaming
│   ├── obs-scenes/                   # OBS scene collections (per stage)
│   ├── obs-profiles/                 # OBS stream profiles
│   ├── overlays/                     # Broadcast graphic overlays
│   └── scripts/                      # OBS Python/Lua automation scripts
│
├── 📁 audio/                         # Audio Routing & Zone Management
│   ├── dante/                        # Dante Controller presets
│   ├── zones/                        # Zone configuration files
│   ├── dsp/                          # DSP processor settings
│   └── schedules/                    # Automated zone schedules
│
├── 📁 video/                         # Video Routing & Display
│   ├── matrix/                       # Video matrix configurations
│   ├── displays/                     # Display zone assignments
│   └── content/                      # Digital signage content specs
│
├── 📁 network/                       # Network Infrastructure
│   ├── vlans/                        # VLAN configurations
│   ├── qos/                          # QoS profiles
│   └── diagrams/                     # Network topology diagrams
│
├── 📁 automation/                    # System Automation & Scripts
│   ├── show-start/                   # Pre-show automation routines
│   ├── show-end/                     # Post-show routines
│   ├── scheduled-tasks/              # Cron jobs and scheduled automation
│   └── monitoring/                   # Health checks and alerts
│
├── 📁 infrastructure/                # Server & Cloud Infrastructure
│   ├── oracle-cloud/                 # Oracle Cloud (AzuraCast server) IaC
│   ├── docker/                       # Docker Compose configurations
│   └── backups/                      # Backup scripts and schedules
│
├── 📄 README.md                      # This file
├── 📄 .gitignore                     # Git ignore rules
├── 📄 LICENSE                        # MIT License
└── 📄 CHANGELOG.md                  # Version history
```

---

## Subsystems

### 24/7 Internet Radio (AzuraCast)

A free **Oracle Cloud** server runs **AzuraCast** to broadcast continuous, properly licensed house music to the venue and website. Key components:

- **AzuraCast**: Web-based radio station management (self-hosted)
- **Liquidsoap**: AutoDJ engine that detects live feeds from OBS and crossfades automatically
- **Icecast2**: Streaming server for distributing audio to listeners
- **Live Transition Logic**: When a band/DJ takes the stage, the AutoDJ detects the incoming RTMP feed and crossfades the house playlist into the live concert stream, then seamlessly returns to house music at show end

See `radio/` directory for full configuration.

### Live Streaming (OBS)

Three dedicated **OBS Studio** instances handle independent stage streams:

| Instance | Stage | Output |
|---|---|---|
| OBS-A | Main Stage | Twitch / YouTube / RTMP |
| OBS-B | DJ Booth | Twitch / YouTube / RTMP |
| OBS-C | Acoustic Stage | Twitch / YouTube / RTMP |

Each instance has branded scene collections, audio routing from the Dante network, and runs automation scripts for unattended operation.

See `streaming/` directory for scene files and configuration.

### Zone Audio Management

The venue is divided into **15 independent acoustic zones**:

| Zone | Area | Notes |
|---|---|---|
| 1 | Main Bar | Primary listening area |
| 2 | Main Stage Front | High-SPL zone |
| 3 | Main Stage Rear | Coverage fill |
| 4 | DJ Booth Area | Dance floor |
| 5 | Acoustic Stage | Intimate setting |
| 6–10 | Dining / Patio Areas | Ambient music |
| 11–15 | Restrooms / Corridors / Staff | Background only |

Audio routing is handled via a **Dante IP audio network**, with presets for each show type (live band, DJ, house music, private event).

See `audio/` directory for routing presets and zone schedules.

### Network Infrastructure

A dedicated **AV VLAN** isolates broadcast traffic from the guest Wi-Fi and POS systems. QoS profiles ensure audio-over-IP packets receive priority queuing.

See `network/` directory for VLAN and QoS configurations.

---

## Hardware Inventory

> See `docs/hardware/` for full specifications, serial numbers, and wiring diagrams.

**Audio**
- Dante-enabled digital mixing consoles (per stage)
- Stage boxes with Dante I/O
- DSP processors for zone EQ and limiting
- Power amplifiers per zone

**Video**
- 37× flat panel televisions (various sizes)
- HDMI matrix switcher
- Video capture cards (per stage)
- PTZ cameras (configurable per stage)

**Streaming / Compute**
- Dedicated PC per OBS instance (3× total)
- Oracle Cloud Free Tier VM (AzuraCast)
- Managed network switch with VLAN support

---

## Getting Started

### Prerequisites

- Git
- Docker & Docker Compose (for local AzuraCast testing)
- OBS Studio 30+
- Access to the Voodoo Hut AV network

### Clone the Repository

```bash
git clone https://github.com/djdistraction/voodoo-hut-av-broadcast.git
cd voodoo-hut-av-broadcast
```

### Initial Setup

1. Review `docs/architecture/` for system overview
2. Follow `docs/runbooks/initial-setup.md` for first-time configuration
3. Deploy AzuraCast using `infrastructure/docker/docker-compose.yml`
4. Import OBS scene collections from `streaming/obs-scenes/`
5. Load Dante presets from `audio/dante/`

---

## Deployment

See the `infrastructure/` directory and individual subsystem `README.md` files for deployment guides.

A high-level deployment order:
1. **Network** — Configure VLANs and QoS
2. **Audio** — Set up Dante routing and zone presets
3. **Radio** — Deploy AzuraCast on Oracle Cloud
4. **Streaming** — Configure OBS instances and test streams
5. **Automation** — Enable scheduled tasks and health monitoring

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
