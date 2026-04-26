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
┌──────────▼───────┐ ┌────────▼────────┐ ┌──────▼──────────┐
│  LAYER 3: ROUTING │ │ LAYER 3: ROUTING│ │ LAYER 3: ROUTING│
│   Dante IP Audio  │ │ Dante IP Audio  │ │ Dante IP Audio  │
│   Network (AoIP)  │ │   Network       │ │   Network       │
└──────────┬───────┘ └────────┬────────┘ └──────┬──────────┘
           │                  │                  │
           └──────────────────┼──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Dante Controller  │
                    │ (Central Router)  │
                    └─────┬──────┬──────┘
                          │      │
              ┌───────────┘      └───────────┐
              │                              │
┌─────────────▼──────────┐    ┌─────────────▼──────────┐
│   LAYER 4A: BROADCAST   │    │   LAYER 4B: VENUE PA    │
│                         │    │                         │
│  OBS-A  OBS-B  OBS-C   │    │   15 Audio Zones        │
│  (Stream per Stage)     │    │   37 Televisions        │
│          │              │    │   DSP + Amplifiers      │
│          ▼              │    └─────────────────────────┘
│     AzuraCast           │
│  (Oracle Cloud)         │
│          │              │
│          ▼              │
│   Internet Streams      │
│   + Website Radio       │
└─────────────────────────┘
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
- **FOH (Front of House) Mix**: Drives the venue PA for that stage's zone
- **Monitor Mix**: In-ear or wedge monitors for performers
- **Broadcast Mix**: Flat, unprocessed mix routed to OBS for streaming (allows post-processing via software)

### Dante Audio Network (Layer 3)

All audio transport uses the **Dante** Audio-over-IP (AoIP) protocol running on a dedicated **AV VLAN** (see `network/`). This allows:
- Any audio channel from any stage to be routed to any destination with sub-millisecond latency
- Central management via Dante Controller software
- Preset-based routing changes for different show types

### Broadcast Layer (Layer 4A)

Three dedicated **OBS Studio** instances (one per stage) capture:
- Dante audio channels assigned to that stage's broadcast mix
- Video signal from the stage cameras (via capture card)
- Scene overlays with venue branding

OBS instances push RTMP streams to **AzuraCast** running on Oracle Cloud. AzuraCast's **Liquidsoap** AutoDJ detects the incoming live stream and crossfades from the house music playlist into the live performance, then back again at show end.

### Venue Distribution (Layer 4B)

- **15 Audio Zones**: Independent DSP-controlled zones; each zone can receive any mix source
- **37 Televisions**: Driven by a central HDMI matrix switcher; displays can show live stage feeds, promotions, or external content

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

1. **"Set it once" automation**: All show transitions are automated via Liquidsoap and OBS triggers
2. **VLAN isolation**: AV traffic is completely separated from guest Wi-Fi and POS systems
3. **Redundant uplinks**: Internet connectivity has failover for uninterrupted streaming
4. **Local fallback**: AzuraCast can serve streams from the Oracle Cloud server independently of venue systems
5. **Preset-based routing**: Dante presets allow rapid reconfiguration for different event types

---

## Related Documents

- `docs/runbooks/initial-setup.md` — First-time configuration guide
- `docs/runbooks/show-day-checklist.md` — Operational show day procedures
- `docs/hardware/inventory.md` — Complete hardware inventory with specs
- `network/README.md` — Network architecture details
- `audio/README.md` — Audio routing details
- `radio/README.md` — AzuraCast and radio configuration
- `streaming/README.md` — OBS and streaming configuration
