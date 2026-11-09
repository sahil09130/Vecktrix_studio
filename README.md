# Vectrix Studio: hub website

The main website for Vectrix Studio (a Vectrix company). It is the hub: every service tile links out to that service's own site. Until a service's site exists, its tile opens a "launching soon" page on this site.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and React Three Fiber + drei. Read `CLAUDE.md` for the brand rules.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the production URL. It is used for canonical URLs, the sitemap, JSON-LD and `/llms.txt`.

## Where to edit things

All copy and data lives in `/content`. You should not need to touch components.

| What | File |
| --- | --- |
| Tagline, sub-line, nav links, contact email, social links, budget ranges | `content/site.ts` |
| Practices, services (names, descriptions, carousel motifs, featured tiles, own-site URLs) and services headings | `content/services.ts` |
| "Trusted by" wordmarks (placeholders) | `content/clients.ts` |
| Testimonials (placeholders) | `content/testimonials.ts` |
| "Why choose us" points | `content/why-us.ts` |
| Colours | CSS variables at the top of `app/globals.css` |

### Add a service's real website URL

In `content/services.ts`, add it to `serviceUrls` by slug:

```ts
export const serviceUrls: Record<string, string> = {
  "logo-design": "https://logo.example.com",
};
```

Until then the service links to `/services/[category]/[service]` (a "launching soon" page with its carousel and an enquiry button). The URL is used by the cards, the 3D tiles, `llms.txt` and the JSON-LD.

### Replace the placeholders

- **Clients:** replace the entries in `content/clients.ts` with real names and set `placeholder: false`. To use real logos, add them under `public/` and extend `components/LogoCarousel.tsx` to render an image.
- **Testimonials:** replace the entries in `content/testimonials.ts` with real, approved quotes and set `placeholder: false`. The "Placeholder" tag on the cards is shown while it is `true`.
- **Contact email and socials:** edit `content/site.ts`. Socials with an empty `href` render as plain text.

### Practices, services and pages

There are 7 practices (`categories`) and 107 services. Each service is one row in `content/services.ts`:

```ts
["logo-design", "Logo Design", "Logo concepts, refinement and final marks for every use.", ["brand-construct", "bezier-path", "format-morph"]],
```

The last part is the 3 motifs of its animated carousel. Valid ids are listed in `components/motion/ids.ts`; a typo fails the type-check.

Pages:

- `/services` lists every practice and service.
- `/services/[category]` shows the practice heading and a card per service, each with its carousel.
- `/services/[category]/[service]` is the service's own "launching soon" page.

On the homepage, each practice is a chapter: its big heading appears and fades, then 3 featured services fly in as 3D tiles, followed by a "View all N services" tile that opens the practice page. Pick the 3 tiles with `featured` on the category. Their arrangement (zig-zagging between chapters) is a preset in `lib/tiles-layout.ts`.

## How the 3D tiles work

- `components/ServicesSection.tsx` decides between the 3D scene and the HTML list, and loads the scene lazily (`next/dynamic`, no SSR) only when the section is near the viewport.
- `components/three/ServiceScene.tsx` is the React Three Fiber scene: floating rounded slabs with drift, pointer parallax, a scroll-driven fly-in from depth, and accent glow plus tilt on hover or keyboard focus. The canvas is viewport-sized and sticky; the camera follows the scroll, so the section can be any length without a huge canvas. Tiles far off-screen are not drawn.
- Each tile face shows the service's first carousel motif, animated, in the space above its title.

## Motion library and carousels

- `components/motion/` holds about 48 animated line-art motifs (browser, funnel, chat, timeline, map pin, gauge, shield, dashboard and so on). Each is a small canvas draw function in a 160 x 100 design space, using the helpers and site colours in `kit.ts`. They are grouped into files by theme and registered in `index.ts`.
- To add a motif: add its id to `ids.ts`, write the draw function in one of the files, and add it to that file's export map. In development the console warns about any id without a function, and those fall back to a generic orbit animation.
- `components/MotionCarousel.tsx` plays a service's 3 motifs:
  - It auto-advances every 4 seconds, staggered between cards so they don't all switch at once, with a crossfade.
  - It pauses on hover and focus, and the dots switch slides.
  - It animates only while on screen, and every carousel shares one 30fps loop.
  - With reduced motion it shows a still frame and the dots still work.
- `components/CategoryHeading.tsx` is the big chapter heading (real HTML text) that fades in and out with scroll.
- The real HTML list of services is always in the DOM. It is visually hidden while the 3D scene is active (still keyboard-focusable, and focusing a link brings its tile into view and lights it up). It becomes the visible fallback when WebGL is unavailable, the scene errors, or the user prefers reduced motion.

## Contact form

`/contact` posts to `app/api/contact/route.ts`, which validates the input (`lib/validation.ts`), logs the enquiry on the server and returns success. To send email, follow the TODO at the top of that file. The env variable names to add are `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` and `RESEND_API_KEY` (or SMTP equivalents).

## SEO and LLM SEO

- Metadata and Open Graph: `app/layout.tsx`, `app/opengraph-image.tsx`
- `app/sitemap.ts`, `app/robots.ts`
- JSON-LD: Organization (layout), Service (home page and each `/services/[slug]`), from `lib/schema.ts`
- `/llms.txt`: `app/llms.txt/route.ts`, generated from the content files

## Sound

Each asteroid makes a soft whoosh as it arrives and a quieter sweep as it leaves. The sound is generated in the browser (Web Audio), so there are no audio files. It is **off by default**: browsers only allow sound after a visitor clicks something, so the "Sound off" button in the services section turns it on. Turning it on also plays a short confirmation tone.

- Pointer sounds (also off until "Sound on"): a glassy tick when the mouse moves onto a tile, a softer release when it leaves, and a short "thock" on click. Hover sounds are desktop mouse only, and only once the tile has flown in. Each tile keeps the same note.
- Tuning: the constants at the top of `lib/sound.ts` (loudness, simultaneous sounds, timing, hover notes). The shapes are `playArrive`, `playLeave`, `playHover`, `playHoverEnd` and `playClick`.
- Triggers: `components/three/ServiceScene.tsx`, where each tile's presence changes. Nothing plays with reduced motion or without WebGL, because the 3D section isn't shown then.
- Limits: iPhones with the silent switch on play no Web Audio. The choice resets to off on a full page reload.

## Backdrop

The services section has a deep-space backdrop: drifting ember nebula, a few distant planets, occasional comets, and a sector HUD that shows which practice is in view. It sits far behind the tiles and stays low-contrast on purpose.

- Layer intensity: the `BACKDROP` constants at the top of `components/three/Backdrop.tsx` (set any to 0 to switch it off).
- Star field: `components/three/SpaceDust.tsx`.
- HUD labels come from the practice numbers and titles in `content/services.ts`.
- With reduced motion or no WebGL, the plain list shows a static haze from `.services-fallback` in `app/globals.css`.

## Partner Network (`/partners`)

A partner and affiliate page: hero, how it works, four partnership types, services to refer, indicative commission tiers, an earnings calculator, benefits, an application form, FAQ and a final call to action.

- Copy, tiers, FAQ and business rules: `content/partners.ts`. Commercial terms are indicative. Do not add guarantees.
- Attribution window: `partnersConfig.attributionDays` (90 days).
- Form: `components/partners/PartnerForm.tsx`, validated by `lib/partner-validation.ts` on both client and server.
- API: `app/api/partners/route.ts`. It validates and logs the application, then returns success. **Delivery is not connected yet.** Add `PARTNER_TO_EMAIL`, `PARTNER_FROM_EMAIL` and a sender key (see the TODO at the top of that file). Until then, nothing is emailed.
- Legal links: `termsUrl` and `privacyUrl` in `content/partners.ts` are empty because those pages don't exist yet. The form shows the wording without links until they are set.

## Intro video

The hero has a projector that opens the company intro video in a dialog. Until a video is supplied it shows a clearly marked placeholder.

To add the video, set one of these in `introVideo` in `content/site.ts`:
- `src`: a self-hosted landscape file kept in `public/` (used on tablets and desktops). Optional `poster` and `captions` (a `.vtt` file).
- `mobileSrc`: an optional portrait file, used on phones (under 768px wide) in a portrait-shaped player. If it is empty, phones get `src`.
- `embedUrl`: a YouTube (`youtube-nocookie.com`) or Vimeo embed URL. Used instead of `src`.

The video only loads when the dialog opens.

The call to action plays a short attention sequence on load (beam powers on, a play dot ripples, the label shines, a cursor taps the screen), then settles after about 18 seconds. Hovering brings the ripples back. Timings are in `app/globals.css` (search for "Attention sequence"). The `0:30` chip comes from `introVideo.duration` in `content/site.ts`: update it if you change the video, or leave it empty to hide the chip.

## Services on phones and the 3D stage

The services section has two layouts:
- **Lite** (phones, screens under 768px, and browsers without WebGL, or with reduced motion): normal HTML and links, with CSS transform and opacity motion only. Each tile's line illustration is a small 2D canvas that draws only while on screen. This is what phones get.
- **3D** (desktop with WebGL): the asteroid stage. If it runs below about 28 fps, it switches to lite on its own.

To compare on a real phone, add `?services=lite` or `?services=3d` to the address.

On phones (under 768px), each practice is a "cargo bay": a spaceship-like cylinder where its services start as a neat brick wall (`components/ServicesPlayground.tsx`). Drag a brick and it moves like in zero gravity: it keeps drifting after you let go, knocks other bricks, bounces off the walls and slowly comes to rest (`lib/zero-g.ts`, no physics library). "Restack" rebuilds the wall. A tap without a drag opens the service. The simulation only runs while something moves and the bay is on screen. With reduced motion, bricks move only while dragged.