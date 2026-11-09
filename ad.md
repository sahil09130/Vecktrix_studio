# Vectrix Studio: 60-second company introduction video

**Purpose:** introduce Vectrix Studio to new clients, partners and talent, and point viewers to the services and the partner network.
**Length:** 60 seconds (about 130 words of voice-over at a calm pace).
**Format:** 16:9 for web and presentations (1920 × 1080), with a 9:16 cut-down for social.
**Tone:** confident, precise, warm. Short sentences. No hype, no invented numbers.

---

## 1. Look and feel (use with the website)

Everything matches the website and `DESIGN.md`. If anything here conflicts with the site, the site wins.

| Role | Hex | Use in the video |
|---|---|---|
| Background | `#07080C` | Every frame. Never pure black. |
| Surface | `#0E1016` | Panels and cards behind text |
| Text | `#F2EFE9` | Headlines, voice-over captions, line art |
| Muted | `#9A978F` | Labels, secondary captions |
| Accent | `#FF4D2E` | One highlight per scene, never more |

- **Colour ratio:** about 85% dark, 10% cream, 5% orange.
- **No** purple or blue gradients, no rainbow colour, no pure white.

**Typography (on-screen text):**
- Headlines: **Bricolage Grotesque** Bold, tight tracking.
- Captions and body: **DM Sans**.
- Labels (`01.`, section names, timecodes on the end card): **JetBrains Mono**, UPPERCASE, wide tracking.

**Visual language:**
- Thin cream **line art** with one orange accent element, the same style as the website's service illustrations.
- Motifs: a projector beam, a timeline, a browser wireframe, a funnel, a network of nodes. These tie to the services.
- Slow, deliberate camera moves. Eases like `cubic-bezier(0.2, 0.7, 0.2, 1)`. Headlines rise into place with a small mask reveal.
- Left-aligned text. Avoid centred layouts except for the final card.
- Generous negative space. One idea per frame.

**Space motif (optional):** soft ember nebula haze and a few distant planets in the background of scenes 1 and 9, at low opacity, the same as the website's backdrop.

---

## 2. Script and storyboard

Timecodes are approximate. Voice-over (VO) is shown exactly as it should be read. On-screen text (OST) appears as overlay captions.

### Scene 1: Cold open (0:00 to 0:06)
- **Visual:** black frame. A single orange dot appears in the centre and expands into a thin ring, then the Vectrix Studio diamond mark (accent square turned 45°) settles in.
- **OST:** none yet.
- **VO:** "Every brand has a story. Most never get it told well."
- **Sound:** a soft, low pad rises under a light tick.

### Scene 2: Who we are (0:06 to 0:14)
- **Visual:** the wordmark lock-up. Headline draws in word by word.
- **OST (headline, Bricolage Bold):** `Content, code and campaigns.` with `grow` in accent, if the phrase is used.
- **VO:** "Vectrix Studio is a digital growth and creative studio. One team for brand, web, content, search, advertising and automation."
- **Sound:** a soft whoosh as the headline lands (matches the site's arrival sound).

### Scene 3: Strategy and identity (0:14 to 0:22)
- **Visual:** line-art **target rings** with people-dot nodes around a central persona. The accent dot lands at the centre. Quick cut to colour swatches fanning out.
- **OST:** `01. Brand Strategy & Identity`
- **VO:** "We start with strategy: who you are, who you serve, and how you stand out."

### Scene 4: Websites and digital experience (0:22 to 0:30)
- **Visual:** a browser window draws itself block by block. A cursor clicks the accent button. A dashboard panel slides in beside it.
- **OST:** `02. Website & Digital Experience`
- **VO:** "Then we build the websites and web apps that carry it."

### Scene 5: Creative and content (0:30 to 0:38)
- **Visual:** a vertical phone frame with reaction hearts rising, then a video timeline with a clip snapping in. A product rotates as a 3D wireframe box. Use real footage from the team where possible; see section 4.
- **OST:** `03. Creative & Content Production`
- **VO:** "Creative and content, from short-form video and motion to 3D product visuals, delivered by KritCuts by Vectrix Studio."

### Scene 6: Growth (0:38 to 0:46)
- **Visual:** a search result climbs to the top spot (accent row). A chat bubble cites a source. A funnel fills, and only the accent dots reach the bottom.
- **OST:** `04. SEO & AI Search`, `05. Digital Marketing`, `06. AI & Business Automation`, shown as three quick labels that stack.
- **VO:** "We make people find you: search, AI visibility and campaigns. Then automation follows up on every lead."

### Scene 7: Part of Vectrix (0:46 to 0:52)
- **Visual:** two nodes connect: the **Vectrix** node (larger) and the **Vectrix Studio** node. The accent link pulses between them.
- **OST:** `A Vectrix company`
- **VO:** "We're part of Vectrix, a technology, AI and digital solutions company."

### Scene 8: Partner network (0:52 to 0:57)
- **Visual:** a network diagram builds: a central studio node with partners and clients around it. Accent pulses travel the links. Then the words land.
- **OST:** `Partner Network: refer, and earn.`
- **VO:** "Know a business that needs this? Join our partner network."

### Scene 9: End card (0:57 to 1:00)
- **Visual:** the diamond mark returns. Ember backdrop. The end card holds for three seconds.
- **OST (end card, in a mono label row):**
  - `Vectrix Studio`
  - `[WEBSITE URL]`
  - `[CONTACT EMAIL]`
- **VO:** "Let's build something valuable together."
- **Sound:** the pad resolves to a single soft tone, then silence.

---

## 3. Music and sound

- **Music:** a sparse, modern ambient track with a slow pulse, no vocals, no lyrics. Under the voice-over it drops about 12 dB. It should rise at the end card.
- **Sound design:** soft, airy whooshes for transitions, matching the site's arrival sound. Light clicks for labels. No cartoon sound effects, no heavy bass drops.
- **Voice-over:** one clear, warm, professional voice. Calm pace, about 130 words per minute. Neutral accent. Record in a treated room. Keep breaths natural.

---

## 4. Footage and assets checklist

Mark anything still missing as a placeholder. Do not replace it with stock footage that implies a client or result.

| Item | Status | Notes |
|---|---|---|
| Wordmark (diamond + text) | Ready | Use from `components/Wordmark.tsx`. No separate logo file exists yet. |
| Line-art motifs | Ready | Generated from the website library. Export as vector or high-res frames. |
| Team footage | **Needed** | Office, people working. Use `[TEAM FOOTAGE]` placeholders until shot. |
| Creative work examples | **Needed** | Only work the studio has permission to show. Use `[WORK SAMPLE]` placeholders. |
| Client logos or testimonials | **Not included** | Do not show any until real, approved content is supplied. |
| Voice-over recording | **Needed** | Use the script above. |
| Music licence | **Needed** | Royalty-free, licensed for commercial use. |
| Website URL and contact email | Placeholder | `hello@vectrixstudio.example` on the site. Replace before publishing. |

---

## 5. Accuracy rules (must follow)

- **No invented numbers.** Do not add client counts, growth percentages, team sizes or awards.
- **No invented clients or results.** Do not show brand logos or testimonials unless approved in writing.
- **Name the delivery correctly.** Creative and content work is "delivered by KritCuts by Vectrix Studio". Everything else is Vectrix Studio.
- **Services wording** must match the website's practice names (see `content/services.ts`).
- **Partner network terms:** say only "join our partner network". Do not promise or quote commission in the video.

---

## 6. Deliverables

1. **Master cut:** 1920 × 1080, 60 seconds, with captions burned in.
2. **Captions file:** `.vtt` (for the website's `introVideo.captions`).
3. **Social cut:** 1080 × 1920, 30 seconds (scenes 1, 2, 6 and 9, with larger captions).
4. **Poster frame:** the end card, for `introVideo.poster`.
5. **Web file:** H.264 MP4, optimised for streaming, to be placed in `public/video/intro.mp4` and set as `introVideo.src` on the site.

---

## 7. Production notes

- Shoot or animate at 4K where possible, then deliver at 1080p.
- Keep all motion graphics in one master template so future edits stay on brand.
- Export the colours as exact hex values. Check the orange on a calibrated screen.
- Run captions through a readability check: at least 4 seconds per line, one line per idea.
