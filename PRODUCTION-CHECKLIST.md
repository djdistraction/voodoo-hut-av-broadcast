# Production Checklist — Voodoo Hut AV & Broadcast Integration

**Project:** The Voodoo Hut Digital Entertainment & Broadcast Platform  
**Production Partner:** HTXPunk.com  
**Status:** Pre-Production

Items are ordered by dependency — each phase must be substantially complete before the next begins. Parallel tracks are noted where work can happen simultaneously.

---

## PHASE 0 — Business & Legal Foundation
*Must be complete before any production work begins.*

- [ ] **Contract signed** with The Voodoo Hut / management
- [ ] **Scope of work finalized** — hardware, software, installation, maintenance
- [ ] **Budget approved** — hardware procurement, cloud hosting, licensing
- [ ] **Timeline agreed** — target go-live date established
- [ ] **Access granted** — venue access, tech booth access, network closet access
- [ ] **ASCAP blanket license** obtained (in-venue performance)
- [ ] **BMI blanket license** obtained (in-venue performance)
- [ ] **SESAC blanket license** obtained (in-venue performance)
- [ ] **SoundExchange** webcasting registration completed
- [ ] **Pre-licensed music library** subscribed (Pretzel.rocks or Epidemic Sound — for AutoDJ)

---

## PHASE 1 — Network Infrastructure
*Everything runs on the network. This must come first.*

- [ ] **Site survey** — existing switches, cable runs, internet uplink speed tested
- [ ] **Internet uplink verified** — 50 Mbps upload minimum (100 Mbps recommended)
- [ ] **Managed switches procured** — Gigabit, VLAN-capable, IGMP Snooping support
- [ ] **Switches installed** and racked
- [ ] **7-VLAN architecture configured** (see `network/README.md`):
  - [ ] VLAN 10 — AV-DANTE (192.168.10.0/24)
  - [ ] VLAN 20 — AV-VIDEO (192.168.20.0/24)
  - [ ] VLAN 30 — STREAMING (192.168.30.0/24)
  - [ ] VLAN 40 — MANAGEMENT (192.168.40.0/24)
  - [ ] VLAN 50 — GUEST-WIFI (10.0.50.0/24)
  - [ ] VLAN 60 — POS (10.0.60.0/24)
  - [ ] VLAN 70 — STAFF (10.0.70.0/24)
- [ ] **IGMP Snooping enabled** on all AV switches (VLANs 10, 20)
- [ ] **Jumbo frames enabled** on VLAN 10 (Dante — 9000 MTU)
- [ ] **Flow control disabled** on VLAN 10 (causes Dante latency)
- [ ] **QoS DSCP markings** applied (Dante = EF46, NDI = AF41, OBS = AF21)
- [ ] **IP addresses assigned** — all AV devices on static IPs per `network/README.md`
- [ ] **POS VLAN confirmed isolated** from all AV VLANs
- [ ] **Network tested** end-to-end before any AV equipment connects

---

## PHASE 2 — Physical AV Hardware Installation
*Parallel with Phase 1 where possible.*

### Audio Hardware
- [ ] **Behringer X32** positioned in tech booth / FOH
- [ ] **Behringer S16** installed at Main Stage — etherCON/Cat5e STP run to X32 AES50-A
- [ ] **Behringer SD8** installed at Patio Stage — etherCON/Cat5e STP run from S16 AES50-B
- [ ] **AES50 chain verified** — X32 → S16 → SD8 clock sync confirmed
- [ ] **dbx DriveRack** installed in Main Stage rack — XLR from S16 Out 7/8
- [ ] **dbx ZonePRO 1260** installed in tech booth rack — XLR from X32 Local Out 13/14
- [ ] **Amp racks installed** (Rack A/B/C) and wired to zones
- [ ] **All 15 zones cabled** and tested for signal

### Video Hardware
- [ ] **Mevo cameras installed** at each stage (Main, Corner, Patio) — on AV-VIDEO VLAN
- [ ] **BirdDog PLAY decoders installed** at all 37 TVs — on AV-VIDEO VLAN
- [ ] **HDMI matrix switcher installed** (central routing hub)
- [ ] **All 37 TVs** receiving signal and tested

### Compute Hardware
- [ ] **Stream PC A** procured and installed (Main Stage stream) — see `docs/hardware/inventory.md` for specs
- [ ] **Stream PC B** procured and installed (Corner Stage stream)
- [ ] **Stream PC C** procured and installed (Patio Stage stream)
- [ ] **Venue PC** designated for BUTT operation
- [ ] **All stream PCs** on STREAMING VLAN (192.168.30.x)
- [ ] **Mixing Station tablet** configured on STAFF VLAN

---

## PHASE 3 — X32 Console Programming
*Depends on Phase 2 physical install.*

- [ ] **Input routing programmed** (40-channel logical patch per `audio/README.md`):
  - [ ] Ch 01–16 → AES50 A1-16 (Main Stage via S16)
  - [ ] Ch 17–24 → Local 1-8 (Corner Stage)
  - [ ] Ch 25–32 → AES50 A17-24 (Patio Stage via SD8)
  - [ ] Aux In Remap → Local 1-6 + Local 9-10 (PC feeds + MC mics)
- [ ] **DCA groups assigned** (DCA 1–6 per `audio/README.md`)
- [ ] **Mute groups configured** (3 mute groups — one per stage)
- [ ] **FX processors assigned**:
  - [ ] FX1 Bus 13 — Plate Reverb
  - [ ] FX2 Bus 14 — Stereo Delay (excluded from stream buses 9–14)
  - [ ] FX3 Bus 15 — Drum Room Reverb
  - [ ] FX4 Bus 16 — Stereo Enhancer
- [ ] **Broadcast mix buses configured** (Sends on Faders — Post-Fader tap):
  - [ ] Bus 9/10 — Main Stage (HPF 50Hz, –2.5dB@300Hz, +1.5dB@6kHz, –16 LUFS)
  - [ ] Bus 11/12 — Corner Stage (same mastering chain)
  - [ ] Bus 13/14 — Patio Stage (same mastering chain)
- [ ] **USB Card Out routing** set → ROUTING → CARD OUT → Outputs 25–32 to Out 9–16
- [ ] **Matrix outputs configured**:
  - [ ] Output 13/14 → Matrix 3/4 (ZonePRO feed)
  - [ ] Matrix 1/2 → SD8 Out (Patio delay feed)
  - [ ] Patio delay calculated and set (~90ms — 1ms per 1.13ft from main PA)
- [ ] **Mixing Station talkback button** programmed (Aux 7 toggle per `audio/README.md`)
- [ ] **X32 scenes saved**:
  - [ ] Scene 01 — House / Idle
  - [ ] Scene 02 — Main Stage Show
  - [ ] Scene 03 — Multishow (all stages)
- [ ] **Full soundcheck** — signal verified at all outputs

---

## PHASE 4 — Zone Audio Configuration
*Depends on Phase 3.*

- [ ] **ZonePRO Designer** installed on tech laptop
- [ ] **ZonePRO connected** via Ethernet (MANAGEMENT VLAN)
- [ ] **Configuration Wizard** run — Inputs 1/2 as stereo pair from X32
- [ ] **15 zones assigned** to outputs per zone map in `audio/README.md`
- [ ] **Per-zone DSP configured**:
  - [ ] Inside Bar — 80Hz HPF engaged
  - [ ] Main Bar — AutoWarmth algorithm enabled
  - [ ] Dining Area — reduced SPL ceiling
- [ ] **Zone volume schedules** programmed:
  - [ ] Weekday schedule (11AM open → 5PM → 7PM pre-show → 8PM show → 12AM)
  - [ ] Weekend schedule
  - [ ] Event override template
- [ ] **All 15 zones tested** with program music

---

## PHASE 5 — Cloud Infrastructure
*Can run parallel with Phases 2–4.*

- [ ] **Oracle Cloud account** created (free tier)
- [ ] **Ampere A1.Flex instance** provisioned (4 OCPUs, 24GB RAM, Ubuntu 22.04 aarch64)
- [ ] **Security list configured** — ingress rules open:
  - [ ] Port 22 (SSH)
  - [ ] Port 80 (HTTP)
  - [ ] Port 443 (HTTPS)
  - [ ] Port 8000 (Icecast stream)
  - [ ] Port 8005 (RTMP — Stage A)
  - [ ] Port 8006 (RTMP — Stage B)
  - [ ] Port 8007 (RTMP — Stage C)
- [ ] **OS firewall** configured (iptables + netfilter-persistent)
- [ ] **AzuraCast** installed via Docker (`infrastructure/docker/docker-compose.yml`)
- [ ] **`azuracast.env`** created from `azuracast.env.example` — all passwords filled in
- [ ] **AzuraCast web setup** completed (admin account, station created)
- [ ] **Radio domain** configured — `radio.voodoo-hut.com` DNS → Oracle instance IP
- [ ] **SSL certificate** issued via Let's Encrypt (auto via AzuraCast)
- [ ] **3 RTMP streamer accounts** created (Stage A, Stage B, Stage C)
- [ ] **Stream keys** documented in secure storage (NOT in this repo)

---

## PHASE 6 — Radio Station Setup
*Depends on Phase 5.*

- [ ] **Liquidsoap AutoDJ script** deployed (`radio/liquidsoap/autodj.liq`)
  - [ ] Crossfade duration set (3 seconds)
  - [ ] Target LUFS set (–16.0)
  - [ ] Live input detection configured
- [ ] **Pre-licensed music library** imported to AzuraCast
- [ ] **Playlist rotation** configured (genre, time-of-day, energy curve)
- [ ] **Station tested** — stream accessible at radio.voodoo-hut.com:8000
- [ ] **Audio branding created**:
  - [ ] Station ID recorded ("You're listening to Voodoo Hut Radio...")
  - [ ] Custom jingles / drops
  - [ ] Branded transitions between songs
  - [ ] Station IDs inserted into rotation (hourly)
- [ ] **BUTT configured** on venue PC:
  - [ ] Server: radio.voodoo-hut.com, Port 8005
  - [ ] Audio source: X32 USB
  - [ ] Crossfade trigger tested (house → live → back to house)
- [ ] **Live handoff tested** end-to-end — BUTT connect/disconnect triggers crossfade correctly

---

## PHASE 7 — Live Streaming Setup
*Depends on Phases 3, 5.*

- [ ] **OBS Studio** installed on all 3 Stream PCs (latest stable)
- [ ] **DistroAV plugin** installed (obs-ndi) on all 3 Stream PCs
- [ ] **NDI sources added** in OBS — Mevo cameras appear in dropdown
- [ ] **USB audio sources configured** per stage (X32 USB Bus pair)
- [ ] **Lip-sync clap test** performed per stage — sync offsets entered in OBS
- [ ] **OBS scene collections created** per stage:
  - [ ] `voodoo-main-stage` — Main Stage scenes
  - [ ] `voodoo-corner-stage` — Corner Stage scenes
  - [ ] `voodoo-patio-stage` — Patio Stage scenes
- [ ] **Scenes built per collection**:
  - [ ] Live — Wide (full stage camera)
  - [ ] Live — Close Up (PTZ zoomed)
  - [ ] Intermission / BRB
  - [ ] Pre-Show Countdown
  - [ ] Technical Difficulties slate
- [ ] **OBS encoder profiles configured** (6000 Kbps CBR, NVENC H.264, 1080p30)
- [ ] **Graphic overlays created**:
  - [ ] Artist name lower third
  - [ ] Song title lower third
  - [ ] Voodoo Hut logo bug (corner)
  - [ ] Intermission screen
- [ ] **YouTube channels** set up for Voodoo Hut
- [ ] **Twitch channel** set up for Voodoo Hut
- [ ] **Facebook page** streaming enabled
- [ ] **Stream keys** entered in OBS profiles (AzuraCast + YouTube + Twitch)
- [ ] **Test stream** — all 3 stages streaming simultaneously verified
- [ ] **Multistream tested** — AzuraCast + YouTube + Twitch simultaneously

---

## PHASE 8 — Website
*Can run parallel with Phases 5–7.*

- [ ] **Full website built** (see `website/` directory):
  - [ ] `index.html` — Landing page
  - [ ] `about.html` — Venue story and culture
  - [ ] `menu.html` — Food & cocktail menus
  - [ ] `events.html` — Upcoming shows calendar
  - [ ] `live.html` — 3 stage live stream embeds
  - [ ] `radio.html` — Radio station player
  - [ ] `gallery.html` — Photos & videos
  - [ ] `contact.html` — Hours, location, reservations
- [ ] **Persistent radio player** implemented (floating bar, all pages)
- [ ] **Live stream embeds** connected to YouTube/Twitch channels
- [ ] **Radio player** connected to AzuraCast stream URL
- [ ] **Menu content** populated with actual food and drink items
- [ ] **Events calendar** populated with upcoming shows
- [ ] **Gallery** populated with venue photos
- [ ] **Contact info** — address, hours, phone, social links verified
- [ ] **SEO metadata** — title tags, descriptions, Open Graph, structured data
- [ ] **Google Analytics** or equivalent tracking added
- [ ] **Mobile responsive** — tested on iOS and Android
- [ ] **Cross-browser tested** — Chrome, Firefox, Safari, Edge
- [ ] **Hosted at htxpunk.com/voodoohut** — accessible and live
- [ ] **Forms tested** — reservations/contact form delivering correctly

---

## PHASE 9 — Content & Original Programming
*Begins after radio + streaming are live.*

- [ ] **Content calendar created** — weekly/monthly programming schedule
- [ ] **Podcast format defined** — show name, format, length, frequency
- [ ] **Podcast recording workflow** established (which mics, OBS or standalone)
- [ ] **Podcast distributed** — Spotify, Apple Podcasts, etc.
- [ ] **Interview format defined** — artist spotlights, band features
- [ ] **Sports event coverage plan** — post-game recap show format
- [ ] **Sports schedule mapped** — NFL, Boxing, UFC, MLB — which events get recap coverage
- [ ] **Social media strategy** — clipping streams for Instagram/TikTok
- [ ] **VOD archive process** — where recordings go, how long retained
- [ ] **YouTube channel managed** — playlists organized by stage/genre

---

## PHASE 10 — Revenue Activation
*Begins after website + streams are established.*

- [ ] **Digital sponsorship packages** created (tiered: logo bug, pre-roll, branded segment)
- [ ] **Sponsorship rate card** defined
- [ ] **First sponsor** secured
- [ ] **Ad insertion** configured in AzuraCast (radio spots)
- [ ] **Ticketed streaming events** — platform selected (Eventbrite, Dice, etc.)
- [ ] **VOD sales** — platform selected (YouTube Members, Vimeo OTT, etc.)
- [ ] **Artist recording fees** — pricing sheet created, booking process defined
- [ ] **Revenue tracking** — monthly reporting system established

---

## PHASE 11 — Operations & Maintenance
*Documented before go-live, executed ongoing.*

- [ ] **Show-day checklist** documented (`docs/runbooks/show-day-checklist.md`)
- [ ] **Staff trained**:
  - [ ] Sound tech: X32 operation, Mixing Station, BUTT workflow
  - [ ] Stream operator: OBS scene switching, stream monitoring
- [ ] **Health monitoring** set up — AzuraCast uptime, stream bitrate alerts
- [ ] **Backup procedures** documented — AzuraCast config, OBS scenes
- [ ] **Emergency contacts** list — who to call if X system fails
- [ ] **Maintenance schedule** — weekly, monthly, quarterly tasks per `docs/hardware/inventory.md`

---

## PHASE 12 — Domain Migration
*When Voodoo Hut is ready to own their online presence.*

- [ ] **Domain confirmed** (thevoodoohut.com or equivalent)
- [ ] **DNS transfer coordinated**
- [ ] **Website files migrated** — relative paths require zero code changes
- [ ] **Radio subdomain updated** — radio.voodoo-hut.com DNS updated
- [ ] **SSL certificates re-issued** for new domain
- [ ] **Old htxpunk.com/voodoohut** redirected to new domain (301)
- [ ] **All social media links** updated

---

## Current Status Snapshot

| Area | Status |
|------|--------|
| Architecture documentation | ✅ Complete |
| Hardware inventory | ✅ Documented (serial #s TBD at install) |
| Network design | ✅ Designed, not yet deployed |
| AV implementation guide | ✅ Complete (8-phase) |
| Licensing guide | ✅ Complete |
| Docker/cloud config | ✅ Configured, not yet deployed |
| Pitch presentation | ✅ Complete |
| X32 configuration | 📋 Documented, not yet programmed |
| Zone configuration | 📋 Documented, not yet programmed |
| Liquidsoap AutoDJ script | ❌ Not yet written |
| OBS scene collections | ❌ Not yet created |
| Graphic overlays | ❌ Not yet created |
| Audio branding | ❌ Not yet created |
| Website | ❌ Not yet built |
| Content programming | ❌ Not yet started |
| Revenue activation | ❌ Pending production |

---

*Last updated: 2026-04-27 | HTXPunk.com for The Voodoo Hut, Kemah TX*
