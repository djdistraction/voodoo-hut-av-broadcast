# System Architecture Overview

## The Voodoo Hut AV & Broadcast Integration System

**Version:** 0.1.0  
**Venue:** The Voodoo Hut, Kemah, TX  
**Facility Size:** 14,000 sq ft

---

## High-Level Architecture

The system is organized into five interconnected layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: SOURCE                           │
│         Live Performers / Instruments / Microphones          │
│              Stage A │ Stage B │ Stage C                     │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    LAYER 2: MIXING                           │
│            Digital Mixing Consoles (Dante-enabled)           │
│         Per-Stage Mix: FOH + Monitor + Broadcast Mix         │
└──────────┬──────────────────┬──────────────────┬────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
     Dante Network      Dante Network      Dante Network
     (AoIP / AV VLAN)
           │
    Dante Controller (Central Router)
           │
     ┌─────┴─────┐
     │           │
  OBS Instances  Zone DSPs
  (A, B, C)      15 Zones + 37 TVs
     │
  AzuraCast
  (Oracle Cloud)
     │
  Internet Streams + Website Radio
```

---

## Component Breakdown

### Stage Sources (Layer 1)

| Stage | Type | Primary Use |
|---|---|---|
| Stage A (Main Stage) | Full Band | Rock, Blues, Country |
| Stage B (DJ Booth) | DJ / Electronic | Dance, EDM, Hip-Hop |
| Stage C (Acoustic Stage) | Solo / Duo Acoustic | Intimate performances |

### Digital Mixing (Layer 2)

Each stage has a dedicated Dante-enabled digital mixing console providing:
- **FOH Mix**: Drives the venue PA for that stage zone
- **Monitor Mix**: In-ear or wedge monitors for performers
- **Broadcast Mix**: Flat mix routed to OBS for streaming

### Dante Audio Network (Layer 3)

All audio transport uses the **Dante** Audio-over-IP (AoIP) protocol on a dedicated **AV VLAN**:
- Any audio channel from any stage routable to any destination
- Central management via Dante Controller software
- Preset-based routing changes for different show types

### Broadcast Layer (Layer 4A)

Three dedicated **OBS Studio** instances capture per-stage:
- Dante audio channels (broadcast mix)
- Video signal from stage cameras
- Scene overlays with venue branding

OBS pushes RTMP streams to **AzuraCast** on Oracle Cloud. Liquidsoap AutoDJ detects the live stream and crossfades from house music to live, then back at show end.

### Venue Distribution (Layer 4B)

- **15 Audio Zones**: Independent DSP-controlled zones
- **37 Televisions**: HDMI matrix switcher driven displays

---

## Data Flow Summary

```
Performer ──► Microphone/DI ──► Stage Console ──► Dante Network
                                                         │
                              ┌──────────────────────────┤
                              │                          │
                    Broadcast Mix                  FOH/Zone Mix
                              │                          │
                         OBS Studio              DSP Processor
                              │                          │
                        AzuraCast                 Power Amps
                              │                          │
                    Internet Stream              Speaker Zones
```

---

## Resilience Design Principles

1. **"Set it once" automation** — All transitions automated via Liquidsoap and OBS triggers
2. **VLAN isolation** — AV traffic separated from guest Wi-Fi and POS
3. **Redundant uplinks** — Internet connectivity has failover
4. **Local fallback** — AzuraCast serves independently of venue systems
5. **Preset-based routing** — Dante presets enable rapid reconfiguration

---

## Related Documents

- `docs/runbooks/initial-setup.md` — First-time configuration guide
- `docs/runbooks/show-day-checklist.md` — Operational show day procedures
- `docs/hardware/inventory.md` — Complete hardware inventory
- `network/README.md` — Network architecture details
- `audio/README.md` — Audio routing details
- `radio/README.md` — AzuraCast and radio configuration
- `streaming/README.md` — OBS and streaming configuration
