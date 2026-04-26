# Comprehensive Architectural Framework for Multi-Stage Audio-Visual Integration and Live Broadcasting

**Author:** Randall Gene Butler  
**Venue:** The Voodoo Hut, Kemah, Texas  
**Facility:** 14,000 sq ft | 3 Performance Stages | 37 Large-Screen Televisions

---

## Executive Overview

The digital transformation of large-scale, multi-functional entertainment venues requires a highly synchronized, robust, and scalable audio-visual architecture. At The Voodoo Hut, a sprawling 14,000-square-foot facility located in Kemah, Texas, characterized by three distinct performance stages, 37 large-screen televisions, and high-density audience zones, the operational mandate is to implement a "set it once" input/output (I/O) plan and live streaming strategy.

This document provides an exhaustive, step-by-step implementation framework that maximizes the venue's existing hardware ecosystem, anchored by:

- **Behringer X32** digital mixing console (FOH)
- **Behringer S16** digital stage box (Main Stage)
- **Behringer SD8** digital stage box (Patio Stage)
- **dbx ZonePRO 1260** digital zone processor (15-zone distribution)
- **Mevo cameras** (NDI video sources)
- **BirdDog NDI** distribution network (37 TV endpoints)

---

## Phase 1: Physical Cabling & Hardware Connection

Before programming the digital routing, the physical infrastructure must be securely established. The Main Stage S16 feeds a DriveRack for the Main PA, while the FOH X32 controls the network.

### Step-by-Step Hardware Connections

**1. The AES50 Backbone**  
Run a Shielded Twisted Pair (STP) Cat5e cable with etherCON connectors from the X32's `AES50-A` port to the S16's `AES50-A` port at the Main Stage.

**2. Daisy-Chaining the Patio**  
Run a second STP Cat5e cable from the S16's `AES50-B` port to the SD8's `AES50-A` port on the Patio Stage.

**3. Main Stage PA (DriveRack)**  
Connect two XLR cables from the S16 physical Outputs 7 and 8 directly into the Left and Right inputs of the DriveRack. The DriveRack's outputs then connect to the Main PA amplifiers.

**4. ZonePRO Connections**  
Connect two XLR cables from the X32's Local Outputs 13 and 14 into Inputs 1 and 2 of the dbx ZonePRO 1260 located in the tech booth.

**5. Clock Synchronization**  
On the X32: press `SETUP` → `GLOBAL` and ensure **Synchronization** is set to **Internal**.  
On the S16 front panel: hold `CONFIG` and turn the encoder until it displays `1-8`. This sets the S16 to receive its clock from the X32 and assigns its outputs to AES50 1-8.

---

## Phase 2: Digital Input Architecture & Pre-Amplifier Allocation

The performance requirements dictate 20 inputs for the Main Stage, but the S16 has a hard limit of 16 XLR preamplifiers. To resolve this, the two Shure Wireless MC Microphones and the PC-1 feed are relocated to the FOH booth and plugged directly into the X32.

### 40-Channel Logical Patch Sheet

| Logical Channel | Source Description | Signal Format | Physical Hardware Patch | Primary Subsystem Routing |
|---|---|---|---|---|
| Ch 01–16 | Main Stage Band / DJ | Mono/Stereo | S16 Inputs 1–16 | Main PA, Stage Wedges, Main Stream |
| Ch 17–24 | Corner Stage Band / DJ | Mono/Stereo | X32 Local XLR 1–8 | Corner PA, Corner Stream |
| Ch 25–32 | Patio Stage Band / DJ | Mono/Stereo | SD8 Inputs 1–8 | Patio PA, Patio Mon, Patio Stream |
| Aux 1–2 | PC-1 (Main Stage Backing) | Stereo L/R | X32 Local Aux TRS 1–2 | Main PA, Main Stream |
| Aux 3–4 | PC-2 (House Music) | Stereo L/R | X32 Local Aux TRS 3–4 | All Zones |
| Aux 5–6 | TV Audio Returns | Mono | X32 Local Aux TRS 5–6 | Inside Bar / Main Bar |
| Aux 7 | MC Mic-1 (Wireless) | Mono | X32 Local XLR 9 (Remapped) | Main PA, Monitors, Stream |
| Aux 8 | MC Mic-2 (Wireless) | Mono | X32 Local XLR 10 (Remapped) | Main PA, Monitors, Stream |

### Step-by-Step X32 Input Routing

1. Press the `ROUTING` button on the X32 and tab over to the **INPUTS** page.
2. Set Inputs 1–8 to `AES50 A1-8` (pulls from S16).
3. Set Inputs 9–16 to `AES50 A9-16` (pulls from S16).
4. Set Inputs 17–24 to `Local 1-8` (pulls from FOH X32 for Corner Stage).
5. Set Inputs 25–32 to `AES50 A17-24` (pulls from daisy-chained SD8).
6. Tab over to the **AUX IN REMAP** page. Change the Aux In source to `Local 1-6 + Local 9-10`. This brings the TV/PC feeds into Aux 1–6, and maps the two physical FOH Shure wireless receivers (plugged into XLRs 9 and 10) onto the Aux 7 and 8 faders, entirely bypassing the S16 limitation.

---

## Phase 3: Advanced FX Routing and DSP Strategy

The four internal effects processors are assigned to Mix Buses 13 through 16:

| FX Slot | Bus | Effect | Application |
|---|---|---|---|
| FX 1 | Bus 13 | Plate Reverb | Live vocals → returns to Main PA + Streams |
| FX 2 | Bus 14 | Stereo Delay (quarter-note) | Live vocals → returns to Main PA only (excluded from broadcast) |
| FX 3 | Bus 15 | Drum Room Reverb | Drum kit — acoustic space simulation |
| FX 4 | Bus 16 | Stereo Enhancer | DJ mixers and backing tracks |

### Step-by-Step FX Routing Configuration

1. Press the `EFFECTS` button on the X32.
2. On the **HOME** tab, set: FX1 = Plate Reverb, FX2 = Stereo Delay, FX3 = Room Reverb, FX4 = Stereo Enhancer.
3. For each slot, change "Source" to match its bus (FX1 Source = Bus 13, FX2 Source = Bus 14, etc.).
4. Select a vocal channel (e.g., Ch 9). Press the **SENDS** tab. Turn up Bus 13 (Reverb send) and Bus 14 (Delay send).
5. **Crucial Stream Isolation:** Navigate to the FX2 Return channel (Vocal Delay). Un-assign it from Mix Buses 9–14 (the Stream Buses). This ensures the live crowd gets the echo, but the online stream remains clean and intelligible.

---

## Phase 4: Stage Monitor Engineering and FOH Talkback

### DCA & Mute Group Assignments

| DCA | Assignment | Mute Group |
|---|---|---|
| DCA 1 | Drum Kit | Mute Group 1 (Main Stage) |
| DCA 2 | Guitars / Keys | Mute Group 1 (Main Stage) |
| DCA 3 | Lead Vocals | Mute Group 1 (Main Stage) |
| DCA 4 | Corner Stage (All) | Mute Group 2 (Corner Stage) |
| DCA 5 | Patio Stage (All) | Mute Group 3 (Patio Stage) |
| DCA 6 | DJ / Playback | — |

### The "MC Mic" Talkback Workaround via Mixing Station

Because the X32 is located in a separate room and mixed via tablet, the console's built-in talkback microphone cannot be used. Instead, the Shure Wireless MC Mic (Aux 7) serves as a dual-purpose PA and private talkback mic.

**Step-by-Step Mixing Station Custom Button Setup:**

1. Open the Mixing Station App on your tablet and connect to the X32.
2. Tap the gear icon (**Settings**) → **Layouts** → Select your layout → **Edit**.
3. Tap an empty space and select **Add Item** → **Button**.
4. Tap the new button → **Edit Action**.
5. Choose **Action Type: Channel**, select **Aux 7** (MC Mic), select **Main LR (Mix On)**, set mode to **Toggle**.
6. Label the button **"TALKBACK MODE"**.

**How it works:** When unlit, the MC Mic routes to the Main PA. When pressed, it un-assigns the MC Mic from the house PA but leaves it active in the monitor buses — allowing private communication to the band without the audience hearing.

---

## Phase 5: Acoustic Zone Distribution and Matrix Processing

### Step-by-Step Matrix & Output Routing

**Main Stage Output:**  
Press `ROUTING` → `OUT 1-16`. Assign Output 7 to Main L, Output 8 to Main R. (AES50-A 1-8 mirrors Out 1-8, sending the Main Mix down ethernet to the S16 → DriveRack.)

**ZonePRO Output:**  
Assign Output 13 to Matrix 3, Output 14 to Matrix 4. These physical XLRs in the tech booth feed the ZonePRO.

**Patio Delay Matrix:**  
Select Matrix 1 and Matrix 2. Send the Main L/R mix into them. On the Matrix 1/2 processing screens, enable the **Delay** parameter.

> **Delay calculation:** 1ms per 1.13 feet from Main PA to Patio.  
> Typical value: **~90ms** for a 100-foot separation.

**Patio Output:**  
Go to `ROUTING` → `AES50-B`. Assign Outputs 1–8 to Out 1–8. This sends the delayed Matrix feed to the SD8 on the patio.

### Step-by-Step dbx ZonePRO 1260 Setup

1. Connect your PC to the ZonePRO via Ethernet (DHCP or static IP). Open **ZonePRO Designer**.
2. Run the **Configuration Wizard**.
3. Assign Inputs 1 & 2 as a Stereo Pair (receiving the X32 Matrix feed).
4. Assign zone outputs:
   - Outputs 1 & 2 → Main Stage / Dance Floor
   - Outputs 3 & 4 → Inside Bar
   - Outputs 5 & 6 → Main Bar
5. In the **DSP** section:
   - Inside Bar: Engage **High-Pass Filter at 80Hz** (prevents bass build-up in an enclosed space)
   - Main Bar: Engage **AutoWarmth** algorithm (auto-boosts low frequencies during low-volume daytime operation)

---

## Phase 6: The Tri-Stage Live Broadcast Mix Architecture

Sending a FOH mix to a live stream results in overwhelmingly loud vocals and missing drums. Instead, dedicated "Broadcast Mixes" are created using **Sends on Faders**.

### Bus Allocation

| Bus Pair | Stream | Stage |
|---|---|---|
| 9/10 | Main Stream | Main Stage |
| 11/12 | Corner Stream | Corner Stage |
| 13/14 | Patio Stream | Patio Stage |

All bus tap points set to **Post-Fader**.

### Step-by-Step Broadcast Mix Setup

**1. Mastering EQ on Bus 9/10:**
- High-Pass Filter: 50Hz
- Dip: –2.5 dB at 300Hz (removes boxiness)
- Boost: +1.5 dB at 6kHz (vocal clarity)

**2. Precision Limiting:**  
Press `EFFECTS`. Insert the **Precision Limiter** across Bus 9/10.
- Input Gain: increase until integrated loudness measures **–16 LUFS**
- Output Gain: **–1.0 dBFS** (prevents digital clipping absolutely)

**3. USB Routing:**  
Press `ROUTING` → `CARD OUT`. Assign Outputs 25–32 to Out 9–16. This sends the mastered broadcast buses digitally over USB directly into the OBS computer.

---

## Phase 7: 24/7 Internet Radio Infrastructure and Automated House Music

### Step-by-Step Oracle Cloud & AzuraCast Installation

**1. Create the Instance:**
- Oracle Cloud → **Compute** → **Instances**
- Create an **Ampere A1.Flex** instance (Always Free tier)
- Image: Canonical Ubuntu 22.04 aarch64
- Resources: 4 OCPUs, 24GB RAM
- Download your SSH keys

**2. Configure Network Firewalls:**  
Oracle Cloud → Virtual Cloud Networks → Security Lists → Add Ingress Rules:

| Port | Protocol | Purpose |
|---|---|---|
| 22 | TCP | SSH access |
| 80 | TCP | HTTP (AzuraCast web panel) |
| 443 | TCP | HTTPS |
| 8000 | TCP | Icecast / Radio stream |
| 8005 | TCP | Live DJ / OBS RTMP ingest |

**3. Configure OS Firewalls:**  
SSH into the Ubuntu instance and run:

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 7 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 8 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo iptables -I INPUT 9 -m state --state NEW -p tcp --dport 8005 -j ACCEPT
sudo netfilter-persistent save
```

**4. Install AzuraCast (Docker):**

```bash
sudo mkdir -p /var/azuracast
cd /var/azuracast
sudo curl -fsSL https://raw.githubusercontent.com/AzuraCast/AzuraCast/main/docker.sh > docker.sh
sudo chmod a+x docker.sh
sudo ./docker.sh install
```

**5. Live AutoDJ Fallback:**  
In the AzuraCast dashboard, go to **Streamer/DJ Accounts** and create a streamer account. On the venue's OBS computer, configure **BUTT** (Broadcast Using This Tool) to capture the X32's USB broadcast mix and push it to your AzuraCast server on port 8005. When the live band starts, BUTT connects and Liquidsoap automatically crossfades the house music into the live concert stream — with a seamless return to the playlist when the show ends.

---

## Phase 8: Video Over IP — NDI Infrastructure and OBS Sync

### Step-by-Step NDI and Audio Sync Configuration

**1. Network Setup:**  
Ensure Mevo cameras and BirdDog decoders (attached to the 37 TVs) are on a dedicated **AV VLAN** with **IGMP Snooping enabled** on managed Gigabit switches. This prevents multicast video traffic from impacting POS systems.

**2. Mevo NDI|HX Setup:**  
Open Mevo App → three dots → **Settings** → **NDI** → Enable NDI mode.  
Set bandwidth: **1080p at 15 Mbps (NDI|HX)**.

**3. OBS Ingestion:**  
Install the **DistroAV** (formerly obs-ndi) plugin in OBS Studio. Add a new **NDI Source** and select your Mevo cameras from the dropdown.

**4. Audio Sync — The Clap Test:**

NDI video encoding takes longer than X-USB audio processing, causing a lip-sync error (typically 150ms–300ms of video lag).

To correct it:
1. Record a video in OBS of someone clapping loudly on stage into a microphone.
2. Review the recording frame-by-frame and measure the millisecond gap between the visual impact and the audible spike.
3. In OBS: **Gear icon** (Audio Mixer) → **Advanced Audio Properties**.
4. Enter the calculated value into the **Sync Offset** box for the X-USB audio input.

This holds the audio in memory and releases it precisely when the delayed video frame renders on screen — achieving perfect lip-sync.

---

## Strategic Synthesis

Executed correctly, this exhaustive architectural framework guarantees a "set it once" operation. By relying on:

- Custom Mixing Station multi-action buttons for talkback
- The ZonePRO for environmental acoustics across 15 zones
- Separate broadcast mixes via digital USB routing (bypassing FOH to stream buses)
- Oracle Cloud + AzuraCast for automated 24/7 internet radio
- NDI over Ethernet replacing thousands of feet of HDMI/SDI cabling

The Voodoo Hut fundamentally redefines its technological capabilities, solidifying its position as a premier destination for live entertainment — both physically in Kemah and digitally to a global audience.

---

## Works Cited

1. Multi-Stage Live Stream Audio Setup — Internal document
2. Voodoo Hut Live Stream AV Strategy — Internal document
3. VooDoo Hut: Home — https://thevoodoohut.com/
4. Behringer X32: S16, S32, SD8, and SD16 Setup — Sweetwater
5. How to Set Up a Multi-Camera Live Stream (Pro Guide 2025) — Jerad Hill Photography
6. dbx ZonePRO 1260 — dbxpro.com
7. AzuraCast Docker Installation — github.com/AzuraCast/AzuraCast
8. X32/M32: AES50 i/o Sharing between different consoles and stage boxes — YouTube
9. Behringer X32: Sound, Routing, and Recording — Sweetwater
10. Mevo NDI Setup — Mevo App Documentation
11. BirdDog PLAY Decoder — birddog.tv
12. How to build a separate mix for your livestream with the Behringer X32 — YouTube
13. How to setup M32/X32 with Ableton for Multitrack Recording — YouTube
14. Precision Limiting and LUFS Standards — AES / Broadcast Standards Documentation
