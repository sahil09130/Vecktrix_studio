# Vectrix Studio: hub website

## Brand rules (do not break these)

- **Vectrix** is the parent company (technology, AI and digital solutions).
- **Vectrix Studio** is the client-facing studio. This site is its main hub.
- Services (107) are grouped into 7 practices (`categories` in `content/services.ts`). Every service in **"02. Creative & Content Production"** (video, motion, 3D, photography, design) is delivered by **KritCuts**, always written as **"KritCuts by Vectrix Studio"**. The `group` field is set per category, so a service inherits it. KritCuts keeps its own name and has its own website with a separate design (red, cream, condensed type). Do not restyle KritCuts pages to match this site.
- **Every other service** is delivered by Vectrix Studio.
- **Never invent** clients, testimonials, statistics, awards or results. Until real content is supplied, use clearly marked placeholder data, kept in one editable file per type under `/content`.
- Every service links to its own site once it has one (`serviceUrls` in `content/services.ts`). Until then it links to the placeholder page `/services/[category]/[service]`. Each practice has a page at `/services/[category]`, and `/services` lists everything.
- Service descriptions are plain statements of what the service is. No claims, numbers or promised results.

## Design

- Dark, deep-space. Tokens live in `app/globals.css`: bg `#07080C`, text `#F2EFE9`, muted `#9A978F`, one accent `#FF4D2E`. Use the Tailwind tokens (`bg-bg`, `text-fg`, `text-muted`, `bg-accent`, `border-line`), never hard-coded hex in components.
- Fonts: Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (small uppercase labels). Loaded in `app/layout.tsx` with `next/font`.
- Avoid the generic AI look: no purple-to-blue gradients, no emoji, no centred-everything layouts. Left-aligned, bold type, restrained colour.
- Respect `prefers-reduced-motion` everywhere. No horizontal scrolling at 390px or 1440px.

## Motion

- Every service has a 3-slide animated carousel (`components/MotionCarousel.tsx`). The slides are line-art motifs drawn on canvas from a shared library in `components/motion/` (ids in `ids.ts`). Services pick 3 motif ids; the first is also drawn on the service's homepage 3D tile.
- Motifs are cream lines with one orange accent, drawn in a 160 x 100 design space with the helpers in `kit.ts`. No real product logos (no platform play buttons, brand marks or app icons).
- Carousels animate only while on screen, share one 30fps loop, and show a still frame with reduced motion.

- Sound (asteroid whoosh) is opt-in only: off by default, started by a click on the toggle. No autoplay and no audio files.

## Stack and conventions

- Next.js App Router, TypeScript, Tailwind v4, Framer Motion, React Three Fiber + drei.
- Editable copy and data are typed files in `/content` (`site.ts`, `services.ts`, `clients.ts`, `testimonials.ts`, `why-us.ts`). Components should not contain copy.
- The 3D service scene is lazy-loaded (`next/dynamic`, `ssr: false`). A real HTML list of services is always in the DOM and is the fallback when WebGL is unavailable or reduced motion is on.
- One `h1` per page. Icon-only controls need an `aria-label`.
- No unused dependencies.

## Commands

- `npm run dev`: dev server
- `npm run lint` and `npx tsc --noEmit`: run both after every change
- `npm run build`: production build
- The hero intro video is a placeholder until a real video is supplied (`introVideo` in `content/site.ts`). Do not add a fake video.
- Phones and browsers without WebGL get the lite services layout (`components/ServicesLite.tsx`): HTML and links, with CSS transform and opacity motion only. Never run WebGL on phones. The 3D scene stays lazy-loaded and desktop only.
