# 🌐 Network Infrastructure

## Overview

The Voodoo Hut's AV and broadcast system relies on a properly segmented network to ensure audio-over-IP (Dante), NDI video, internet streaming, and guest/POS systems all operate without interfering with each other.

---

## Directory Structure

```
network/
├── vlans/
│   ├── vlan-plan.md              # VLAN segmentation design
│   └── switch-config-template.md # Managed switch configuration guide
│
├── qos/
│   ├── qos-profiles.md           # QoS DSCP markings and queue priorities
│   └── bandwidth-budget.md       # Bandwidth allocation per VLAN
│
├── diagrams/
│   ├── topology-overview.md      # Network topology description
│   └── ip-address-plan.md        # IP address allocations
│
└── README.md                     # This file
```

---

## Network Segmentation (VLAN Design)

| VLAN ID | Name | Subnet | Purpose |
|---|---|---|---|
| 10 | AV-DANTE | 192.168.10.0/24 | Dante audio-over-IP (low latency, isolated) |
| 20 | AV-VIDEO | 192.168.20.0/24 | NDI video (Mevo cameras → BirdDog decoders → TVs) |
| 30 | STREAMING | 192.168.30.0/24 | OBS stream PCs + AzuraCast server access |
| 40 | MANAGEMENT | 192.168.40.0/24 | AV equipment management (X32, ZonePRO, switches) |
| 50 | GUEST-WIFI | 10.0.50.0/24 | Guest internet access (completely isolated from AV) |
| 60 | POS | 10.0.60.0/24 | Point-of-sale terminals (isolated from all AV) |
| 70 | STAFF | 10.0.70.0/24 | Staff devices and tablets (Mixing Station) |

> ⚠️ **Critical:** VLANs 10 and 20 must be completely isolated from VLAN 50 (Guest) and VLAN 60 (POS). Any broadcast leakage from Dante or NDI multicast can saturate a POS network and interrupt transactions.

---

## IP Address Allocations

### VLAN 10 — AV-DANTE (192.168.10.0/24)

| IP | Device | Role |
|---|---|---|
| 192.168.10.1 | Core Switch | Gateway / IGMP Querier |
| 192.168.10.10 | X32 FOH Console | Dante master clock |
| 192.168.10.20 | S16 Main Stage | Stage box |
| 192.168.10.21 | SD8 Patio Stage | Stage box |
| 192.168.10.31 | Stream PC A | Dante Virtual Soundcard |
| 192.168.10.32 | Stream PC B | Dante Virtual Soundcard |
| 192.168.10.33 | Stream PC C | Dante Virtual Soundcard |

### VLAN 20 — AV-VIDEO (192.168.20.0/24)

| IP | Device | Role |
|---|---|---|
| 192.168.20.1 | Core Switch | Gateway / IGMP Querier |
| 192.168.20.10 | Mevo (Main Stage) | NDI|HX source |
| 192.168.20.11 | Mevo (DJ Booth) | NDI|HX source |
| 192.168.20.12 | Mevo (Acoustic Stage) | NDI|HX source |
| 192.168.20.20–56 | BirdDog Decoders | NDI → HDMI (37 TVs) |
| 192.168.20.60 | HDMI Matrix Switcher | Central video routing |

### VLAN 30 — STREAMING (192.168.30.0/24)

| IP | Device | Role |
|---|---|---|
| 192.168.30.1 | Core Switch | Gateway |
| 192.168.30.10 | Stream PC A | OBS Studio — Main Stage |
| 192.168.30.11 | Stream PC B | OBS Studio — DJ Booth |
| 192.168.30.12 | Stream PC C | OBS Studio — Acoustic Stage |

### External — Oracle Cloud AzuraCast Server

| Resource | Value |
|---|---|
| Public IP | [Assigned at provisioning] |
| Domain | radio.voodoo-hut.com |
| Ports Open | 22, 80, 443, 8000, 8005 |
| Stream RTMP | rtmp://radio.voodoo-hut.com/[stage-mount] |

---

## QoS Configuration

Network QoS ensures Dante audio and NDI video packets are never dropped in favor of lower-priority traffic.

### DSCP Markings

| Traffic Type | DSCP Value | Queue Priority |
|---|---|---|
| Dante Audio | EF (46) | Strict Priority (Queue 0) |
| NDI Video | AF41 (34) | Assured Forwarding (Queue 1) |
| OBS Streaming | AF21 (18) | Best Effort+ (Queue 2) |
| Management | CS2 (16) | Best Effort (Queue 3) |
| Guest / POS | BE (0) | Best Effort (Queue 4) |

### Bandwidth Budget per VLAN

| VLAN | Reserved Bandwidth | Peak Usage |
|---|---|---|
| DANTE | 100 Mbps guaranteed | ~20 Mbps typical |
| VIDEO (NDI) | 200 Mbps guaranteed | ~150 Mbps (37 streams) |
| STREAMING | 100 Mbps guaranteed | ~18–24 Mbps (3 streams @ 6 Mbps) |
| GUEST | Best effort, rate-limited 25 Mbps per user | Variable |

---

## Managed Switch Requirements

- **IGMP Snooping:** MUST be enabled on all switches handling VLANs 10 and 20
  - Prevents Dante/NDI multicast flooding to non-subscriber ports
- **Jumbo Frames:** Enable 9000-byte MTU on VLAN 10 (Dante) switches
- **Flow Control (802.3x):** Disable on Dante VLAN (causes latency spikes)
- **Spanning Tree:** Configure RSTP; ensure AV VLANs have a designated root bridge

---

## Internet Uplink

| Parameter | Requirement |
|---|---|
| Minimum Upload | 50 Mbps (for 3 simultaneous 6 Mbps streams with headroom) |
| Recommended Upload | 100 Mbps |
| Failover | Secondary ISP connection or LTE failover device |
| DNS | Static assignment preferred for AV devices |

---

## Related Documents

- `audio/dante/device-map.md` — Dante device IP and channel mapping
- `streaming/README.md` — OBS RTMP configuration
- `infrastructure/oracle-cloud/` — Cloud server setup
- `docs/architecture/comprehensive-av-integration-framework.md` — Full system reference
