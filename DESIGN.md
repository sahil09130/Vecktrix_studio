# Vectrix Studio: Visual Identity

The single source for the look of Vectrix Studio. Use it for the website, decks, posters, social posts and any other material. The values here match the site's code (`app/globals.css`, `components/`), so anything built from this file will match the website.

Vectrix Studio is the client-facing studio of **Vectrix**, a technology, AI and digital solutions company. Video services are delivered by **KritCuts by Vectrix Studio**, which has its own separate identity. Do not use KritCuts' look in Vectrix materials, and do not use Vectrix Studio's look in KritCuts materials.

---

## 1. Brand in one line

> Content, code and campaigns that grow your brand.

**Personality:** confident, precise, creative, a little futuristic. Deep space, bold type, one warm signal colour. Never loud, never generic.

**Voice:** plain, direct, specific. Short sentences. Say what we do, not how great we are.

**Never invent** clients, testimonials, statistics, awards or results. Use clearly marked placeholders until real content is supplied.

---

## 2. Colour

| Token | Hex | Use |
|---|---|---|
| `bg` | `#07080C` | Background. Almost black, never pure `#000`. |
| `surface` | `#0E1016` | Cards and panels. |
| `surface-2` | `#14161E` | Raised panels and inputs on hover. |
| `fg` | `#F2EFE9` | Primary text and line art. Warm off-white, never pure `#FFF`. |
| `muted` | `#9A978F` | Secondary text, labels, captions. |
| `accent` | `#FF4D2E` | The one signal colour: key words, buttons, dots, highlights. |
| `line` | `#F2EFE9` at 12% | Hairline borders and dividers. |

**The ratio:** roughly 85% dark background and neutrals, 10% cream text, and 5% orange accent. Orange is for emphasis, not decoration. One orange element per view is ideal; two is the maximum.

**Do not use:** purple or blue gradients, rainbow or multi-hue gradients, neon green, pure white, or any colour not in this table. Subtle warm-to-dark glows (orange into near-black) are allowed for backgrounds.

**Contrast:** `fg` on `bg` and `accent` on `bg` both pass WCAG AA for body text. Do not place `muted` text on `accent`; it is hard to read there.

---

## 3. Typography

Three typefaces. All three are free Google Fonts. Install them locally before opening PowerPoint or Figma.

| Role | Typeface | Weights | Used for |
|---|---|---|---|
| **Display** | Bricolage Grotesque | 400, 600, 700, 800 | Headlines, numbers, names of services |
| **Body** | DM Sans | 400, 500 | Paragraphs, descriptions, UI text |
| **Labels** | JetBrains Mono | 400, 500 | Eyebrows, numbers like `01.`, tags, metadata |

### Type scale (web reference)

| Level | Size (desktop / mobile) | Weight | Tracking | Line height |
|---|---|---|---|---|
| Hero | 116px / 44px (fluid) | Bold 700 | -3% | 0.95 |
| H1 | 96px / 48px | Bold 700 | -3% | 0.98 |
| H2 | 60px / 36px | Bold 700 | -1% | 1.02 |
| H3 | 36px / 24px | Bold 700 | -1% | 1.1 |
| Lead | 20px / 18px | Regular 400 | 0 | 1.5 |
| Body | 16px | Regular 400 | 0 | 1.6 |
| Eyebrow (label) | 11.5px | Medium 500 | +14% | 1.2, UPPERCASE |

**Headline rule:** short lines, left-aligned, tight leading. Break headlines deliberately (the hero reads "Content, code / and campaigns / that grow your / brand."). Put one word in accent, usually the verb or key benefit (`grow`).

**Labels:** every section opens with a mono eyebrow in muted UPPERCASE, e.g. `SERVICES`, `HOW IT WORKS`, and numbered sections use an accent number like `01.`.

---

## 4. Logo and wordmark

- **Wordmark (current):** a small accent diamond (a square rotated 45°) followed by **Vectrix Studio** in Bricolage Bold. "Studio" is set in lighter muted weight.
  - Diamond: 10px square at 45°, colour `accent`.
  - Text: Bricolage 18–20px bold, tight tracking.
- **Clear space:** keep at least the height of the diamond on all sides.
- **Minimum size:** 120px wide on screen, 30mm in print.
- **On light backgrounds:** not yet defined. Ask before producing light-background versions.
- **Do not** add shadows, outlines, gradients, rotations of the wordmark text, or other logos next to it. Do not use real brand marks of third parties (platforms, clients) unless they have been supplied.

> Note: the wordmark is text plus a diamond, not a designed logo file. If a finished logo is supplied, replace this section.

---

## 5. Layout and spacing

- **Grid:** 12 columns on desktop, 4 on mobile, with 40px outer margins on desktop and 20px on mobile.
- **Max content width:** 1320px.
- **Alignment:** left-aligned. Avoid centring everything. Centre only short, single-purpose blocks such as a CTA or a logo lockup.
- **Spacing unit:** 8px. Common gaps: 8, 16, 24, 32, 48, 80, 112. Section padding is 80–112px vertically.
- **Radius:** cards 24px (`rounded-3xl`), inputs and small panels 12px, pills and buttons fully round.
- **Hairlines:** 1px at 12% cream. Use them to separate, not to decorate.
- **Negative space:** generous. If a layout feels crowded, remove an element before shrinking the type.

---

## 6. Components

### Buttons
- **Primary:** pill, `accent` background, `bg` text, 14px semibold, 12px 24px padding. Hover: background becomes `fg`.
- **Ghost:** pill, 1px `line` border, `fg` text. Hover: border becomes `fg`.
- One primary button per view. Action labels are verbs: "Start a project", "Become a Partner", "Send enquiry".

### Cards
- Background `surface`, 1px `line` border, 24px radius, 32px padding.
- Hover: border becomes accent at 60%. No lift, no heavy shadow.
- A card's visual anchor is its line-art image at the top, then the title, then one line of description, then a mono label at the bottom ("Delivered by Vectrix Studio").

### Tags and badges
- Mono, 10–11px, UPPERCASE, +14% tracking.
- Accent badges use a 1px accent outline pill (e.g. the KritCuts badge).

### Forms
- Inputs: `surface` background, 1px `line` border, 12px radius, `fg` text, accent focus border.
- Labels: mono eyebrow above the field. Errors: accent text under the field.

### Focus
- 2px accent outline, 3px offset. Never remove focus rings.

---

## 7. Imagery and iconography

**The house style is line art:** thin cream strokes (about 1px at web scale, proportionally thicker at poster scale) with a single orange accent element. Drawings are diagrams and illustrations of a process: a browser wireframe, a timeline, a funnel, a chart, a network of nodes.

- One accent element per illustration. Everything else is cream at 20–80% opacity.
- Dashed lines for guides, orbits and secondary paths.
- Small filled dots at the ends of lines and at nodes. Accent dots mark the active or important node.
- Background-free: draw on the dark background; never place a line drawing on a white box.
- **Do not** use emoji, clip-art, stock icons with filled shapes, 3D renders with heavy shine, or platform logos (YouTube, Meta, WhatsApp, Google) in the artwork. Use generic shapes instead.

**Photography (when used):** dark, low-key, cool-to-neutral grading, with the accent used sparingly as a light source or highlight. No stock-photo handshakes.

**Space motifs:** the 3D backdrop uses soft ember nebulae, distant planets and comets. Use these as subtle backgrounds only, at low opacity, behind content.

---

## 8. Motion (web and video)

- **Easing:** `cubic-bezier(0.2, 0.7, 0.2, 1)` for reveals. Durations 0.6–1.2s.
- **Reveals:** elements rise 24px and fade in, staggered by 0.12s.
- **Loops:** line illustrations run seamless loops of 3–6 seconds, with one accent element moving.
- **Respect reduced motion:** show a still frame.
- **Sound:** opt-in only, soft, never on by default.

---

## 9. Presentations (PowerPoint and Keynote)

- **Aspect ratio:** 16:9 (13.33 × 7.5 in).
- **Background:** solid `#07080C` on every slide. Use a single soft ember glow in one corner of title and section slides only.
- **Title slide:** eyebrow in mono muted at the top; headline in Bricolage Bold, 66–80pt, `fg`, with one accent word; a short lead in DM Sans 20pt, `muted`; wordmark bottom-left.
- **Section divider:** a large accent number (`01.`) in Bricolage Bold 120pt, a title beside it, nothing else.
- **Content slide:** headline 40–48pt Bricolage Bold at the top left; body DM Sans 16–18pt, `fg` at 85%; eyebrow label in mono 11pt UPPERCASE, `muted`.
- **Charts:** cream bars or lines, one accent bar for the highlight, no legend boxes, no gridlines darker than `line`.
- **Diagrams:** 1–1.5pt cream lines, accent for the key path.
- **Footer on every slide:** mono 9pt `muted` with the wordmark left and the slide number right.
- **Max:** one idea per slide, six lines of body text, one accent element.
- **Fonts:** embed or supply Bricolage Grotesque, DM Sans and JetBrains Mono with the file. Without them, PowerPoint falls back to Calibri and the look breaks.

---

## 10. Posters and print

- **Sizes:** A2 (420 × 594 mm) and A3 for posters; 900 × 1200 mm for large banners.
- **Background:** `#07080C`. Print on matte stock where possible to keep the blacks deep.
- **Headline:** Bricolage Bold, scaled so it reads at 3 metres. Keep the headline to 6 words or fewer.
- **Illustration:** the line art can be scaled up freely; keep stroke weight proportionally consistent (about 0.5 mm at A2).
- **Colour in print:** convert `#FF4D2E` to CMYK with a proof check. It tends to shift toward orange-red; approve a printed sample before a run.
- **Bleed:** 3 mm on all sides, with the background extending into the bleed.

---

## 11. Social posts and ads

| Format | Size | Notes |
|---|---|---|
| Feed square | 1080 × 1080 px | Headline top-left, illustration bottom-right |
| Feed portrait | 1080 × 1350 px | Preferred for feed reach |
| Story / Reel cover | 1080 × 1920 px | Keep text inside the central 1080 × 1420 safe area |
| Link ad | 1200 × 628 px | Headline at 72px minimum |
| LinkedIn post | 1200 × 1200 px or 1200 × 627 px | Calmer layouts; fewer elements |

**Structure for a post:**
1. Mono eyebrow, muted (e.g. `SEARCH & AI VISIBILITY`).
2. Headline, Bricolage Bold, 6–8 words, one accent word.
3. One line of supporting copy, DM Sans, muted.
4. Illustration or motif, bottom-right, with its accent element.
5. Wordmark bottom-left, mono `Vectrix Studio` label optional.

**Copy rules:** no invented numbers, client names, or results. Use "we", say what the service does, end with one clear action.

---

## 12. Accessibility checklist

- Body text at least 16px, with contrast at AA or better.
- Never convey meaning by colour alone; pair the accent with a label or shape.
- Avoid text on busy illustrations; keep text on clear areas.
- Set alt text for every illustration in web and email use. Decorative art can be marked decorative.
- Keep captions and on-screen text legible for at least 4 seconds in video.

---

## 13. Do and don't (quick check)

| Do | Don't |
|---|---|
| Dark background, cream text, one orange accent | Pure white, pure black, or extra colours |
| Bold, left-aligned headlines with one accent word | Centred paragraphs of text and random alignments |
| Thin line art with one accent element | Clip-art, emoji, filled stock icons |
| Generous space | Filling every corner |
| Real content, or clearly marked placeholders | Invented stats, clients, testimonials |
| Vectrix Studio look for Vectrix Studio work | KritCuts' red and cream look on Vectrix work |

---

## 14. Quick reference (copy into any tool)

```
Background   #07080C
Surface      #0E1016
Surface 2    #14161E
Text         #F2EFE9
Muted        #9A978F
Accent       #FF4D2E
Line         #F2EFE9 @ 12%

Display      Bricolage Grotesque  (Bold 700)
Body         DM Sans              (Regular 400)
Labels       JetBrains Mono       (Medium 500, UPPERCASE, +14%)
```

---

## Source files

- Colour and type tokens: `app/globals.css`
- Wordmark: `components/Wordmark.tsx`
- Buttons: `components/Button.tsx`
- Line-art motifs: `components/motion/`
- Brand rules for code and content: `CLAUDE.md`
- Copy: `content/`

**Hero projector:** a line-art film projector beside the headline, its beam in orange fading to nothing, opens the intro video. Use the same line style for any projector or screen motif.

**Attention motion:** calls to action may play a short, finite sequence (a few ripples, one shine, one cursor tap) and then settle. Never loop attention motion forever beside the headline.

**Phone motion:** tiles arrive from their side with a slight perspective turn, then float gently. Use transform and opacity only, and keep every loop slow.

**Phone services:** each practice is a dark metal cylinder ("cargo bay") holding its services as bricks in four tones made only from the site palette: ember for the practice's featured services, then rust, smoke and graphite. Ember and rust take a warm base that is different for each practice, mixed into the dark surface: 01 coral `#FF5B45`, 02 amber `#FF9A2E`, 03 terracotta `#E0653F`, 04 copper `#D98A45`, 05 rose-ember `#FF5470`, 06 peach sand `#EDA27C`, 07 clay `#C9775A`. Keep bases in the red-orange to amber family (avoid yellow-greens, which turn olive on the dark surface), and keep cream text at 4.5:1 or better. Text is always cream. Bright orange is reserved for the brick being held, the KritCuts dot and the bay's status light. Bricks start as a staggered wall and float in zero gravity when moved.