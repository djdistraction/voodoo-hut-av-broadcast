# 🔊 Audio — Routing, Zone Management & DSP Configuration

## Overview

This directory contains all audio routing configurations, Dante presets (for Stream PC broadcast routing), zone schedules, and DSP settings for The Voodoo Hut's 15-zone audio distribution system.

**Console:** Behringer X32 (FOH) — AES50 clock master  
**Stage Boxes:** Behringer S16 (Main Stage, AES50-A) · Behringer SD8 (Patio Stage, AES50-B from S16)  
**Zone Processor:** dbx ZonePRO 1260 (interior bar zones)  
**PA Processor:** dbx DriveRack (Main Stage PA crossover/limiting)

> **Important:** The X32↔S16↔SD8 physical audio backbone runs over **AES50 (Cat5e STP / etherCON)** — not Dante. Dante Virtual Soundcard is used only on the three Stream PCs to receive broadcast mix channels from the X32 USB Card Out.

---

## Directory Structure

```
audio/
├── dante/
│   ├── presets/
│   │   ├── HOUSE_MUSIC.xml          # Default: PC-2 house music feed to all zones
│   │   ├── SHOW_MAIN_STAGE.xml      # Main Stage show routing
│   │   ├── SHOW_CORNER_STAGE.xml    # Corner Stage show routing
│   │   ├── SHOW_PATIO_STAGE.xml     # Patio Stage show routing
│   │   └── MULTISHOW.xml            # All three stages simultaneously
│   └── device-map.md                # Network map of all Dante-capable devices
│
├── zones/
│   ├── zone-map.md                  # Physical zone locations and driver details
│   ├── zone-assignments.json        # Zone-to-amplifier routing config
│   └── volume-presets.json          # Pre-show / show / late night volume levels
│
├── dsp/
│   ├── zonepro-config.dsc           # ZonePRO Designer export file
│   ├── x32-scenes/
│   │   ├── scene-01-house.scn       # X32 scene: house music / idle
│   │   ├── scene-02-main-show.scn   # X32 scene: Main Stage live show
│   │   └── scene-03-multishow.scn   # X32 scene: all stages active
│   └── eq-curves/
│       ├── main-pa-eq.md            # Main PA DriveRack EQ documentation
│       └── zone-eq-notes.md         # Per-zone EQ, delay, and HPF settings
│
├── schedules/
│   ├── weekday-schedule.json        # Mon–Thu zone automation schedule
│   ├── weekend-schedule.json        # Fri–Sun zone automation schedule
│   └── event-override.json          # Manual event override template
│
└── README.md                        # This file
```

---

## Physical Audio Chain

### AES50 Backbone (Stage Box Network)

```
X32 FOH Console
  │
  ├─ AES50-A (Cat5e STP / etherCON) ──► S16 Main Stage Box (16 XLR preamps)
  │                                           │
  │                                      AES50-B ──► SD8 Patio Stage Box (8 XLR preamps)
  │
  ├─ Local Out 13 / 14 (XLR) ──► ZonePRO 1260 Inputs 1/2  (interior bar zones)
  │
  ├─ S16 Out 7 / 8 (XLR, via AES50-A) ──► DriveRack ──► Main Stage PA Amps
  │
  └─ USB Card Out 25–32 ──► OBS Stream PCs (broadcast bus audio, 8 channels)
```

### Clock Synchronization

- X32: `SETUP → GLOBAL → Synchronization = Internal` (X32 is master clock)
- S16: Hold `CONFIG`, turn encoder to `1-8` (receives clock from X32 via AES50-A)
- SD8: Receives clock from S16 via AES50-B daisy-chain

---

## 40-Channel Input Patch

| Logical Ch | Source | Physical Patch | X32 Routing |
|---|---|---|---|
| Ch 01–16 | Main Stage Band / DJ | S16 XLR Inputs 1–16 | `ROUTING → INPUTS → AES50 A1-16` |
| Ch 17–24 | Corner Stage Band / DJ | X32 Local XLR 1–8 | `ROUTING → INPUTS → Local 1-8` |
| Ch 25–32 | Patio Stage Band / DJ | SD8 XLR Inputs 1–8 | `ROUTING → INPUTS → AES50 A17-24` |
| Aux 1–2 | PC-1 Backing Track (Main Stage) | X32 Local Aux TRS 1–2 | AUX IN REMAP → Local 1-2 |
| Aux 3–4 | PC-2 House Music | X32 Local Aux TRS 3–4 | AUX IN REMAP → Local 3-4 |
| Aux 5–6 | TV Audio Returns | X32 Local Aux TRS 5–6 | AUX IN REMAP → Local 5-6 |
| Aux 7 | MC Mic-1 (Shure Wireless) | X32 Local XLR 9 (remapped) | AUX IN REMAP → Local 9 |
| Aux 8 | MC Mic-2 (Shure Wireless) | X32 Local XLR 10 (remapped) | AUX IN REMAP → Local 10 |

> The Aux 7/8 remap moves the two wireless MC microphones off the S16 (which is at hard capacity with 16 inputs) onto the X32 local XLRs 9 and 10 — bypassing the S16 preamp limitation entirely.

---

## DCA & Mute Group Assignments

| DCA | Assigned Channels | Mute Group | Stage Kill |
|---|---|---|---|
| DCA 1 | Drum Kit (Ch 1–5) | Mute Group 1 | Main Stage |
| DCA 2 | Guitars / Keys (Ch 6–9) | Mute Group 1 | Main Stage |
| DCA 3 | Lead Vocals (Ch 10–12) | Mute Group 1 | Main Stage |
| DCA 4 | Corner Stage (Ch 17–24) | Mute Group 2 | Corner Stage |
| DCA 5 | Patio Stage (Ch 25–32) | Mute Group 3 | Patio Stage |
| DCA 6 | DJ / Playback (Aux 1–4) | — | — |

> **Mute Groups** allow instant kill of an entire stage during changeovers — press one button rather than lowering individual faders.

---

## FX Processor Assignments (Buses 13–16)

| FX Slot | Bus | Effect | Stream Assignment |
|---|---|---|---|
| FX 1 | Bus 13 | Plate Reverb | Returns to Main PA **and** stream buses |
| FX 2 | Bus 14 | Stereo Delay (quarter-note) | Returns to Main PA **only** — **explicitly excluded from stream buses 9–14** |
| FX 3 | Bus 15 | Drum Room Reverb | Returns to all |
| FX 4 | Bus 16 | Stereo Enhancer | Returns to all |

> The FX 2 Vocal Delay return is un-assigned from Mix Buses 9–14 to keep the broadcast mix clean and intelligible while still giving the live audience the delay effect.

---

## Broadcast Mix Buses

| Bus Pair | Stream | Stage | Tap Point | Processing |
|---|---|---|---|---|
| 9 / 10 | Main Stage Stream | Main Stage | Post-Fader | HPF 50Hz · –2.5dB@300Hz · +1.5dB@6kHz · Precision Limiter –16 LUFS |
| 11 / 12 | Corner Stage Stream | Corner Stage | Post-Fader | Same mastering chain |
| 13 / 14 | Patio Stage Stream | Patio Stage | Post-Fader | Same mastering chain |

**X32 USB Routing:** `ROUTING → CARD OUT` → Assign Outputs 25–32 to Out 9–16. This sends all three mastered broadcast bus pairs over USB to the Stream PCs simultaneously.

---

## Talkback — MC Mic Workaround (Mixing Station)

Because the X32 is operated remotely via tablet, the physical talkback mic on the console is inaccessible. The Shure Wireless MC Mic (Aux 7) serves double duty as house PA mic and private stage talkback.

**Mixing Station custom button setup:**
1. Settings → Layouts → Edit → Add Button
2. Action Type: Channel → Aux 7 → Main LR (Mix On) → Toggle mode
3. Label: **"TALKBACK MODE"**

| Button State | MC Mic Routing |
|---|---|
| **Unlit** (normal) | Aux 7 → Main LR (house PA — audience hears MC) |
| **Lit** (talkback) | Aux 7 removed from Main LR, active in monitor buses only (band hears MC, audience does not) |

---

## Zone Map & Audio Drivers

| Zone # | Area | Driver | Source | Notes |
|---|---|---|---|---|
| 1 | Main Stage Front | Amp Rack A Ch 1–2 | S16 / DriveRack | High-SPL |
| 2 | Main Stage Rear | Amp Rack A Ch 3–4 | S16 / DriveRack | Coverage fill |
| 3 | Dance Floor | Amp Rack A Ch 5–6 | S16 / DriveRack | High-SPL + subwoofer |
| 4 | DJ Booth Monitors | Amp Rack B Ch 1–2 | X32 Local Out | Stage monitors |
| 5 | Corner Stage PA | Amp Rack B Ch 3–4 | X32 Local Out | Small PA |
| 6 | Acoustic Stage PA | Amp Rack B Ch 5–6 | X32 Local Out | Low-SPL zone |
| 7 | Inside Bar (North) | ZonePRO 1260 Out 3–4 | X32 Local Out 13/14 → Matrix 3/4 | 80Hz HPF engaged |
| 8 | Inside Bar (South) | ZonePRO 1260 Out 3–4 | X32 Local Out 13/14 → Matrix 3/4 | 80Hz HPF engaged |
| 9 | Main Bar | ZonePRO 1260 Out 5–6 | X32 Local Out 13/14 → Matrix 3/4 | AutoWarmth engaged |
| 10 | Outdoor Patio | SD8 Out 1–2 | X32 Matrix 1/2 (delayed ~90ms) | 1ms per 1.13 ft distance |
| 11 | Patio Bar | SD8 Out 3–4 | X32 Matrix 1/2 (delayed ~90ms) | Matched to Zone 10 delay |
| 12 | Dining Area | ZonePRO 1260 Out 7–8 | X32 Local Out 13/14 → Matrix 3/4 | Reduced SPL |
| 13 | Restrooms | Amp Rack C Ch 1–2 | ZonePRO or X32 Aux | Background only |
| 14 | Corridors / Entry | Amp Rack C Ch 3–4 | ZonePRO or X32 Aux | Background only |
| 15 | Staff / Kitchen | Amp Rack C Ch 5–6 | ZonePRO or X32 Aux | Separate feed |

### ZonePRO 1260 — Input/Output Assignment

| ZonePRO I/O | Connection | Signal |
|---|---|---|
| Input 1 / 2 | XLR from X32 Local Out 13 / 14 | Main mix (via X32 Matrix 3/4) |
| Output 1 / 2 | Main Stage / Dance Floor amps | — |
| Output 3 / 4 | Inside Bar amps | 80Hz HPF |
| Output 5 / 6 | Main Bar amps | AutoWarmth |
| Output 7 / 8 | Dining Area | Reduced SPL |

### Patio Delay Calculation

The patio stage (SD8) receives audio from X32 Matrix 1/2 with a calculated time delay to prevent acoustic echo with the main PA:

```
Delay (ms) = Distance from Main PA to Patio (feet) ÷ 1.13
Example: 100 ft ÷ 1.13 = ~88.5ms → round to 90ms
```

---

## Dante Routing Presets (Stream PC Audio)

These presets route broadcast mix channels from the X32 USB Card Out to the appropriate Stream PC via Dante Virtual Soundcard. Load in Dante Controller (`File → Load Preset`).

| Preset | Use Case |
|---|---|
| `HOUSE_MUSIC` | Default: Aux 3/4 (PC-2 house music) to all zones; no live stream |
| `SHOW_MAIN_STAGE` | Bus 9/10 to Stream PC A; Zones 1–3 get Main Stage mix |
| `SHOW_CORNER_STAGE` | Bus 11/12 to Stream PC B; Zones 4–5 get Corner Stage mix |
| `SHOW_PATIO_STAGE` | Bus 13/14 to Stream PC C; Zones 10–11 get Patio mix |
| `MULTISHOW` | All three stages active simultaneously |

---

## Zone Volume Schedules

| Time | Zones 7–9 (Bar) | Zones 10–11 (Patio) | Zones 1–3 (Stage) |
|---|---|---|---|
| Open (11 AM) | House music, –20 dB | House music, –25 dB | OFF |
| Afternoon (5 PM) | House music, –12 dB | House music, –15 dB | OFF |
| Pre-show (7 PM) | House music, –10 dB | House music, –12 dB | Soundcheck |
| Show (8 PM+) | Live stage feed | Live stage feed | Full show level |
| Late night (12 AM) | House music, –15 dB | OFF | OFF |

See `audio/schedules/` for full schedule JSON files.

---

## Related Documents

- `docs/architecture/comprehensive-av-integration-framework.md` — Phases 1–6 (full wiring and X32 configuration)
- `docs/runbooks/show-day-checklist.md` — Pre-show audio verification steps
- `docs/hardware/inventory.md` — Hardware specs and serial numbers
- `streaming/README.md` — OBS USB audio source and BUTT configuration
