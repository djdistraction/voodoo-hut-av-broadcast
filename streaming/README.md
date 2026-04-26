# 🎥 Streaming — OBS, BUTT & Live Broadcast Configuration

## Overview

This directory contains OBS Studio scene collections, stream profiles, graphic overlays, and automation scripts for The Voodoo Hut's three-stage live streaming setup, plus configuration for **BUTT** (Broadcast Using This Tool) — the software that bridges the X32 USB broadcast mix to the AzuraCast RTMP ingest.

---

## How the Broadcast Chain Works

```
Behringer X32
  │
  └─ USB Card Out 25-32 (Bus 9/10 · 11/12 · 13/14 mastered to –16 LUFS)
        │
        ├─ Stream PC A ──► OBS-A (video: Mevo NDI, audio: Bus 9/10)  ──► AzuraCast RTMP
        ├─ Stream PC B ──► OBS-B (video: Mevo NDI, audio: Bus 11/12) ──► AzuraCast RTMP
        └─ Stream PC C ──► OBS-C (video: Mevo NDI, audio: Bus 13/14) ──► AzuraCast RTMP

Venue PC
  └─ BUTT ──► captures X32 USB audio ──► RTMP push to AzuraCast port 8005
              (triggers Liquidsoap to crossfade from house music → live feed)
```

> **Key distinction:** OBS handles *scene composition and video*. **BUTT** handles the *live RTMP trigger* that tells AzuraCast a show has started. Both run in parallel during a live event.

---

## Directory Structure

```
streaming/
├── obs-scenes/
│   ├── voodoo-main-stage.json       # Stage A (Main Stage) scene collection
│   ├── voodoo-corner-stage.json     # Stage B (Corner Stage) scene collection
│   └── voodoo-patio-stage.json      # Stage C (Patio Stage) scene collection
│
├── obs-profiles/
│   ├── stage-a-profile/             # OBS output profile: Main Stage
│   │   └── basic.ini
│   ├── stage-b-profile/             # OBS output profile: Corner Stage
│   │   └── basic.ini
│   └── stage-c-profile/             # OBS output profile: Patio Stage
│       └── basic.ini
│
├── overlays/
│   ├── templates/
│   │   ├── lower-third-artist.html  # Artist name lower third (browser source)
│   │   ├── lower-third-song.html    # Song title lower third
│   │   ├── bug-logo.png             # Corner bug / station logo
│   │   └── intermission-screen.png  # BRB / intermission screen
│   └── fonts/                       # Custom venue fonts
│
├── scripts/
│   ├── auto-scene-switch.lua        # OBS Lua: audio-triggered scene transitions
│   ├── audio-monitor.py             # Python: audio level watchdog
│   └── stream-health-check.py      # Python: dropped frames / bitrate monitor
│
├── butt/
│   ├── butt-config-stage-a.cfg      # BUTT config for Main Stage RTMP push
│   ├── butt-config-stage-b.cfg      # BUTT config for Corner Stage RTMP push
│   ├── butt-config-stage-c.cfg      # BUTT config for Patio Stage RTMP push
│   └── butt-setup-guide.md          # Step-by-step BUTT installation and config
│
└── README.md                        # This file
```

---

## OBS Instance Configuration

| Instance | Machine | Stage | Audio Source | RTMP Target |
|---|---|---|---|---|
| OBS-A | Stream PC A | Main Stage | X32 USB — Bus 9/10 | `rtmp://radio.voodoo-hut.com/voodoo-stage-a` |
| OBS-B | Stream PC B | Corner Stage | X32 USB — Bus 11/12 | `rtmp://radio.voodoo-hut.com/voodoo-stage-b` |
| OBS-C | Stream PC C | Patio Stage | X32 USB — Bus 13/14 | `rtmp://radio.voodoo-hut.com/voodoo-stage-c` |

---

## OBS Stream Settings

### Video

| Setting | Value |
|---|---|
| Base (Canvas) Resolution | 1920×1080 |
| Output (Scaled) Resolution | 1920×1080 |
| FPS | 30 |
| Downscale Filter | Lanczos |

### Encoder (NVIDIA NVENC preferred)

| Setting | Value |
|---|---|
| Encoder | NVENC H.264 (or x264 fallback) |
| Rate Control | CBR |
| Bitrate | 6,000 Kbps |
| Keyframe Interval | 2 seconds |
| Profile | High |
| Preset | Quality |
| B-frames | 2 |

### Audio

| Setting | Value |
|---|---|
| Sample Rate | 48,000 Hz |
| Channels | Stereo |
| Bitrate | 320 Kbps (AAC) |
| Audio Source | X32 USB (Windows: "Behringer X-USB"; Linux: `hw:X32,0`) |

> The X32 USB audio source receives the **mastered broadcast mix** from X32 Card Out 25–32 (Buses 9/10 · 11/12 · 13/14). Each OBS instance picks up its assigned bus pair. Do **not** use Dante Virtual Soundcard as the OBS audio source — the USB Card Out path is lower-latency and does not require additional Dante routing for OBS.

---

## Audio Source Setup in OBS

1. In OBS: **Settings → Audio** → set Sample Rate to **48000 Hz**
2. Under **Audio Mixer**, click the gear icon → **Advanced Audio Properties**
3. For the X32 USB audio source, set **Audio Monitoring** to Monitor Off (prevent feedback)
4. Confirm that the bus pair for that stage is arriving: meters should show signal during soundcheck

### X32 USB Routing Verification

On the X32: `ROUTING → CARD OUT`
- Outputs 25–26 → Bus 9 / Bus 10 (Main Stage stream L/R)
- Outputs 27–28 → Bus 11 / Bus 12 (Corner Stage stream L/R)
- Outputs 29–30 → Bus 13 / Bus 14 (Patio Stage stream L/R)

---

## NDI Video Integration (Mevo Cameras)

### Plugin Required
Install **DistroAV** (formerly obs-ndi): https://github.com/DistroAV/DistroAV/releases

### Setup
1. Ensure Mevo cameras are on the **AV-VIDEO VLAN (192.168.20.0/24)**
2. In Mevo app: three dots → **Settings → NDI** → Enable → Set bandwidth to **1080p / 15 Mbps (NDI|HX)**
3. In OBS: **Sources → + → NDI Source** → select the Mevo for that stage from the dropdown
4. Confirm video is live in the OBS preview

### Audio Lip-Sync Correction (The Clap Test)

NDI video encoding introduces latency (typically **150–300ms**) relative to the X32 USB audio, causing lip-sync error.

**To measure and correct:**

1. Record a short clip in OBS of someone clapping sharply on stage mic
2. Step through the recording frame by frame (VLC: `E` key, or DaVinci Resolve)
3. Find the frame where the hands visually impact → note timestamp
4. Find the audio waveform spike for the same clap → note timestamp
5. Calculate the difference in milliseconds (video will lag behind audio)
6. In OBS: gear icon on Audio Mixer → **Advanced Audio Properties**
7. Enter the measured value in the **Sync Offset** field for the X32 USB input (positive value = delay the audio to match video)

> Typical value: **200ms**. Re-measure after any change to NDI bandwidth or network configuration.

---

## BUTT — Broadcast Using This Tool

BUTT is the lightweight application that pushes a live RTMP stream from the venue PC to AzuraCast. When BUTT connects, Liquidsoap detects the incoming stream and automatically crossfades from house music to the live feed.

### Download
https://danielnoethen.de/butt/ (free, Windows / macOS / Linux)

### Configuration (per stage)

Settings → Main tab:
- **Server type:** Icecast or RTMP (select RTMP)
- **Address:** `radio.voodoo-hut.com`
- **Port:** `8005` (Stage A) / `8006` (Stage B) / `8007` (Stage C)
- **Password:** from AzuraCast Streamers/DJs panel (stored in `azuracast.env`, not this repo)
- **Mount:** `/voodoo-stage-a` (or b / c)

Settings → Audio tab:
- **Device:** X32 USB (same device as OBS audio source)
- **Sample Rate:** 48000 Hz
- **Channel:** Stereo
- **Codec:** MP3 or AAC, 192–320 kbps

### Live Show Workflow

| Step | Action |
|---|---|
| **Pre-show** | AzuraCast AutoDJ playing house music playlist |
| **Go live** | Sound tech launches BUTT and clicks **Connect** |
| **BUTT connects** | Liquidsoap detects RTMP → 3-second crossfade to live feed |
| **Show in progress** | BUTT streams X32 broadcast mix; OBS streams video + audio |
| **Show ends** | Sound tech clicks **Disconnect** in BUTT |
| **BUTT disconnects** | Liquidsoap crossfades back to house music playlist |

> See `butt/butt-setup-guide.md` for the full illustrated setup guide.

---

## Scene Collections

### Standard Scenes Per Stage

Each scene collection includes:

| Scene Name | Content |
|---|---|
| **Live — Wide** | Full stage camera (Mevo wide angle) + audio |
| **Live — Close Up** | PTZ zoomed on lead performer + audio |
| **Intermission** | BRB screen + venue logo + house music visual |
| **Pre-Show Countdown** | Countdown timer overlay |
| **Technical Difficulties** | Fallback slate with venue contact |

### Loading a Scene Collection

1. OBS: **Scene Collection → Import**
2. Navigate to `streaming/obs-scenes/voodoo-[stage].json`
3. Import and verify all sources resolve (NDI camera, USB audio)

---

## RTMP Stream Keys

> ⚠️ Stream keys are **not stored in this repository**. Retrieve them from the AzuraCast admin panel: **Stations → The Voodoo Hut → Streamers/DJs**. Store in `infrastructure/docker/azuracast.env` (git-ignored).

---

## Related Documents

- `audio/README.md` — X32 USB routing (Card Out 25–32) and broadcast bus setup
- `radio/README.md` — AzuraCast RTMP ingest configuration
- `radio/liquidsoap/autodj.liq` — Crossfade logic triggered by BUTT connection
- `docs/runbooks/show-day-checklist.md` — Pre-show OBS and BUTT verification steps
- `docs/architecture/comprehensive-av-integration-framework.md` — Phases 6–8 (broadcast mix, radio, NDI)
