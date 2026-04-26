# 🔊 Audio — Routing, Zone Management & DSP Configuration

## Overview

This directory contains all audio routing configurations, Dante network presets, zone schedules, and DSP settings for The Voodoo Hut's 15-zone audio distribution system.

**Hardware:** Behringer X32 (FOH) + S16 (Main Stage) + SD8 (Patio) + dbx ZonePRO 1260 + Dante Network

---

## Directory Structure

```
audio/
├── dante/
│   ├── presets/
│   │   ├── HOUSE_MUSIC.xml          # Default: house music to all zones
│   │   ├── SHOW_A_MAIN_STAGE.xml    # Main Stage show routing
│   │   ├── SHOW_B_DJ_BOOTH.xml      # DJ Booth show routing
│   │   ├── SHOW_C_ACOUSTIC.xml      # Acoustic Stage show routing
│   │   └── MULTISHOW.xml            # All three stages simultaneously
│   └── device-map.md                # Network map of all Dante devices
│
├── zones/
│   ├── zone-map.md                  # Physical zone locations and descriptions
│   ├── zone-assignments.json        # Zone-to-amplifier routing config
│   └── volume-presets.json          # Pre-show / show / late night volume levels
│
├── dsp/
│   ├── zonepro-config.dsc           # ZonePRO Designer export file
│   ├── x32-scenes/
│   │   ├── scene-01-house.scn       # X32 scene: house music mode
│   │   ├── scene-02-main-show.scn   # X32 scene: main stage live show
│   │   └── scene-03-multishow.scn   # X32 scene: all stages active
│   └── eq-curves/
│       ├── main-pa-eq.md            # Main PA system EQ documentation
│       └── zone-eq-notes.md         # Per-zone EQ and delay settings
│
├── schedules/
│   ├── weekday-schedule.json        # Mon–Thu zone automation schedule
│   ├── weekend-schedule.json        # Fri–Sun zone automation schedule
│   └── event-override.json          # Manual event override template
│
└── README.md                        # This file
```

---

## Hardware Overview

### Mixing Console Network

```
X32 (FOH / Tech Booth)
  │
  ├─ AES50-A ──► S16 (Main Stage)
  │               └─ AES50-B ──► SD8 (Patio Stage)
  │
  ├─ Local Out 13/14 ──► ZonePRO 1260 (Zone Distribution)
  │
  └─ USB Card ──► Broadcast PC (OBS — 8 channels via USB audio)
```

### Dante Device Network

| Device | Role | Dante Channels | IP Address |
|---|---|---|---|
| X32 FOH Console | Master Clock / Router | 32 in / 32 out | 192.168.10.10 |
| S16 (Main Stage) | Stage Input Box | 16 in / 8 out | 192.168.10.20 |
| SD8 (Patio Stage) | Stage Input Box | 8 in / 8 out | 192.168.10.21 |
| Dante Virtual Soundcard A | Stream PC A (Stage A) | 2 in / 2 out | 192.168.10.31 |
| Dante Virtual Soundcard B | Stream PC B (Stage B) | 2 in / 2 out | 192.168.10.32 |
| Dante Virtual Soundcard C | Stream PC C (Stage C) | 2 in / 2 out | 192.168.10.33 |

---

## Zone Map

| Zone # | Area | Amplifier | Notes |
|---|---|---|---|
| 1 | Main Stage Front | Amp Rack A, Ch 1-2 | High-SPL zone |
| 2 | Main Stage Rear | Amp Rack A, Ch 3-4 | Coverage fill |
| 3 | Dance Floor | Amp Rack A, Ch 5-6 | High-SPL, subwoofer |
| 4 | DJ Booth | Amp Rack B, Ch 1-2 | Monitor wedges |
| 5 | Corner Stage | Amp Rack B, Ch 3-4 | Small PA |
| 6 | Acoustic Stage | Amp Rack B, Ch 5-6 | Low-SPL zone |
| 7 | Inside Bar (North) | ZonePRO Out 3-4 | — |
| 8 | Inside Bar (South) | ZonePRO Out 3-4 | — |
| 9 | Main Bar | ZonePRO Out 5-6 | AutoWarmth engaged |
| 10 | Outdoor Patio | SD8 Out 1-2 | Delayed ~90ms |
| 11 | Patio Bar | SD8 Out 3-4 | Delayed ~90ms |
| 12 | Dining Area | ZonePRO Out 7-8 | Reduced SPL |
| 13 | Restrooms | Amp Rack C, Ch 1-2 | Background only |
| 14 | Corridors / Entry | Amp Rack C, Ch 3-4 | Background only |
| 15 | Staff / Kitchen | Amp Rack C, Ch 5-6 | Separate feed |

> Full wiring details: `docs/hardware/wiring-diagrams.md`

---

## Dante Routing Presets

### Loading a Preset

1. Open **Dante Controller** on any networked PC
2. Navigate to **File → Load Preset**
3. Select the appropriate preset from `audio/dante/presets/`
4. Apply — routing changes are instantaneous with no audio interruption

### Preset Descriptions

| Preset | Use Case |
|---|---|
| `HOUSE_MUSIC` | Default state: X32 Aux 3/4 (PC-2 house music feed) routed to all zones |
| `SHOW_A_MAIN_STAGE` | Main Stage active: Bus 9/10 to Stream PCs; Zones 1-3 get live mix |
| `SHOW_B_DJ_BOOTH` | DJ Booth active: Bus 11/12 to Stream PC B; Zone 3-4 get live mix |
| `SHOW_C_ACOUSTIC` | Acoustic Stage: Bus 13/14 to Stream PC C; Zone 6 isolated |
| `MULTISHOW` | All stages simultaneously active with independent zone assignments |

---

## Broadcast Mix Buses (X32)

| Bus | Assignment | Tap Point | Audio Processing |
|---|---|---|---|
| Bus 9/10 | Main Stage Stream | Post-Fader | HPF 50Hz, –2.5dB@300Hz, +1.5dB@6kHz, Precision Limiter –16 LUFS |
| Bus 11/12 | Corner Stage Stream | Post-Fader | Same mastering chain |
| Bus 13/14 | Patio Stage Stream | Post-Fader | Same mastering chain |

USB Routing: X32 Card Out 25–32 → OBS Computer (8-channel USB audio)

---

## FX Processor Assignments

| FX Slot | Bus | Effect | Stream Assignment |
|---|---|---|---|
| FX 1 | Bus 13 | Plate Reverb | Returns to Stream buses |
| FX 2 | Bus 14 | Stereo Delay | Returns to PA only — EXCLUDED from streams |
| FX 3 | Bus 15 | Drum Room Reverb | Returns to all |
| FX 4 | Bus 16 | Stereo Enhancer | Returns to all |

---

## Zone Schedules

Zone volumes and sources are automated based on time of day. See `audio/schedules/` for full schedule files.

**Example (Weekend):**

| Time | Zone 7-9 (Bar) | Zone 10-11 (Patio) |
|---|---|---|
| 11:00 AM | House music, –20dB | House music, –25dB |
| 5:00 PM | House music, –12dB | House music, –15dB |
| 8:00 PM | Live stage feed | Live stage feed |
| 2:00 AM | House music, –18dB | OFF |

---

## Related Documents

- `docs/architecture/comprehensive-av-integration-framework.md` — Full wiring and routing reference
- `docs/runbooks/show-day-checklist.md` — Pre-show audio verification
- `docs/hardware/inventory.md` — Hardware specs and serial numbers
