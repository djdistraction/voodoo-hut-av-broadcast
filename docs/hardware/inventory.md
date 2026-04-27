# Hardware Inventory

## The Voodoo Hut AV & Broadcast System

**Last Updated:** 2026-04-26  
**Facility:** The Voodoo Hut, Kemah, TX — 14,000 sq ft

> **Note:** Serial numbers, purchase dates, and warranty expiry dates should be filled in during initial system commissioning. Keep this document updated after any hardware additions or replacements.

---

## Audio — Mixing & Signal Processing

### FOH Console

| Item | Details |
|---|---|
| **Model** | Behringer X32 Full-Size Digital Mixing Console |
| **Location** | Tech Booth / FOH Position |
| **I/O** | 40 Input Channels, 25 Mix Buses, 16 DCA Groups |
| **Connectivity** | AES50-A (to S16), AES50-B (spare), USB (to OBS), Ethernet |
| **Role** | Master mixing console, clock master, broadcast bus source |
| **Serial Number** | [Fill in] |
| **Purchase Date** | [Fill in] |
| **Firmware Version** | [Fill in — update to latest stable] |

### Stage Boxes

| Item | Model | Location | AES50 Connection | Preamps |
|---|---|---|---|---|
| Main Stage Box | Behringer S16 | Main Stage | X32 AES50-A | 16 × Midas-design XLR |
| Patio Stage Box | Behringer SD8 | Patio Stage | S16 AES50-B | 8 × Midas-design XLR |

### Zone Processor

| Item | Details |
|---|---|
| **Model** | dbx ZonePRO 1260 |
| **Location** | Tech Booth Rack |
| **I/O** | 12 balanced analog outputs (6 stereo zones), 2 analog inputs |
| **Software** | ZonePRO Designer |
| **Role** | 15-zone acoustic environment control (interior bar zones) |
| **Serial Number** | [Fill in] |

### Speaker Drive Rack

| Item | Details |
|---|---|
| **Model** | dbx DriveRack (model TBD) |
| **Location** | Main Stage Rack |
| **Role** | Main PA system processing (crossover, limiting, delay alignment) |

---

## Audio — Amplification

| Amplifier | Location | Zones Served | Channels |
|---|---|---|---|
| Amp Rack A | Stage Left | Main Stage Front, Rear, Dance Floor | 6 ch |
| Amp Rack B | Stage Right | Corner Stage, Corner Stage, Acoustic Stage | 6 ch |
| Amp Rack C | Bar Area | Restrooms, Corridors, Staff | 6 ch |

---

## Audio — Networking

| Item | Model | Quantity | Role |
|---|---|---|---|
| Dante Virtual Soundcard | Audinate DVS License | 3 | Dante RX on each Stream PC |
| Ethernet Switches (AV VLAN) | Managed Gigabit (TBD) | 2 | Dante + NDI switching |
| etherCON Cables (AES50) | Cat5e STP w/ etherCON | 2 | X32→S16, S16→SD8 |

---

## Video — Cameras

| Item | Model | Location | Output | Notes |
|---|---|---|---|---|
| Main Stage Cam | Mevo Start / Mevo Core | Main Stage | NDI|HX | PTZ control via app |
| Corner Stage Cam | Mevo Start / Mevo Core | Corner Stage | NDI|HX | Fixed wide angle |
| Acoustic Stage Cam | Mevo Start / Mevo Core | Acoustic Stage | NDI|HX | PTZ control via app |

---

## Video — Distribution

| Item | Model | Quantity | Role |
|---|---|---|---|
| NDI Decoders | BirdDog PLAY | 37 | NDI → HDMI for each television |
| HDMI Matrix Switcher | [Model TBD] | 1 | Central routing hub |
| Televisions | Various (large-screen) | 37 | Distributed across all zones |

---

## Streaming — Compute

| Machine | Role | Location | OBS Instance |
|---|---|---|---|
| Stream PC A | Main Stage Stream | Tech Booth | OBS-A (voodoo-main-stage) |
| Stream PC B | Corner Stage Stream | Tech Booth | OBS-B (voodoo-corner-stage) |
| Stream PC C | Acoustic Stage Stream | Tech Booth | OBS-C (voodoo-acoustic) |

### Recommended Stream PC Specs

| Spec | Minimum | Recommended |
|---|---|---|
| CPU | 8-core (Intel i7 / AMD Ryzen 7) | 12-core or higher |
| GPU | NVIDIA RTX 3060 (NVENC) | NVIDIA RTX 4070 |
| RAM | 16 GB | 32 GB |
| Storage | 500 GB SSD | 2 TB NVMe SSD |
| Network | Gigabit Ethernet | Gigabit Ethernet (wired, no Wi-Fi) |
| OS | Windows 10/11 or Ubuntu 22.04 | Windows 11 |

---

## Cloud Infrastructure

| Resource | Details |
|---|---|
| **Provider** | Oracle Cloud Infrastructure (OCI) |
| **Instance Type** | Ampere A1.Flex (Always-Free Tier) |
| **vCPUs** | 4 (ARM64) |
| **RAM** | 24 GB |
| **Storage** | 200 GB boot volume |
| **OS** | Ubuntu 22.04 LTS (aarch64) |
| **Primary Service** | AzuraCast (Docker) |
| **Domain** | radio.voodoo-hut.com |
| **SSH Key Location** | Secure storage — NOT in this repository |

---

## Control & Management

| Item | Model | Role |
|---|---|---|
| Mixing Station Tablet | iPad / Android Tablet | Remote X32 control (Mixing Station Pro app) |
| Laptop (AV Tech) | [Any] | Dante Controller, ZonePRO Designer |
| Wireless Router (Mgmt) | [Model TBD] | Dedicated tablet/management VLAN access |

---

## Consumables & Spares

| Item | Quantity On Hand | Reorder Threshold |
|---|---|---|
| XLR cables (various lengths) | [Fill in] | < 5 of each length |
| etherCON/Cat5e STP patch cables | [Fill in] | < 2 |
| BirdDog PLAY (spare) | [Fill in] | 0 |
| HDMI cables (6 ft, 10 ft) | [Fill in] | < 5 |
| IEC power cables | [Fill in] | < 5 |

---

## Maintenance Schedule

| Interval | Task |
|---|---|
| Weekly | Check AzuraCast server health, disk usage, update status |
| Monthly | Update OBS Studio and AzuraCast Docker images |
| Quarterly | Test all 37 BirdDog NDI decoders, check XLR connections |
| Annually | Full system audit: firmware updates, cable inspection, hardware inventory reconciliation |

---

## Related Documents

- `docs/architecture/comprehensive-av-integration-framework.md` — Full wiring guide
- `docs/runbooks/show-day-checklist.md` — Pre-show hardware checks
- `audio/dante/device-map.md` — Dante device IP mapping
