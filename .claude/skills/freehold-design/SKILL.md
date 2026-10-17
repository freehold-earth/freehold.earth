---
name: freehold-design
description: Freehold website design system (direction C "Allotment"): tokens, components, tone and honesty rules. Use when creating or changing any page or component on freehold.earth.
---

# Freehold design system

Design rules for freehold.earth. Direction C, "Allotment". Read this before changing any page or component. The same content is installed as a Claude skill at `.claude/skills/freehold-design/SKILL.md`.

## Mission

Make a first-time visitor feel that Freehold is real, built in the open, and something they can be part of. Bold and warm, never salesy. Every claim is true today.

## Brand

- Product: Freehold, open source, local-first infrastructure for data sovereignty. Your data stays on your devices, your own AI works on it, your rules are enforced by cryptography, and communities can run the infrastructure together.
- Audiences: everyday people (lead with community and sovereignty), builders (precise and technical), communities that might host a node.
- Surface: static marketing site, four pages (Home, Build, Communities, Manifesto).
- Metaphor: land you own outright. Plots, allotments, the village hall. "Freehold, not leasehold."
- Our own identity: don't borrow another organisation's colours, marks, fonts or slogans.

## Style foundations

Tokens live in `src/styles/tokens.css`. Always use tokens, never raw hex values in components.

| Token         | Value     | Use                                                                  |
| ------------- | --------- | -------------------------------------------------------------------- |
| `--clay`      | `#d4734a` | Hero, header, highlighted cards. Ink on clay 5.22:1                  |
| `--clay-soft` | `#d98a63` | Secondary warm sections. Ink on clay-soft 6.38:1                     |
| `--ink`       | `#1f1a16` | Text, primary buttons, dark sections                                 |
| `--soil`      | `#2b2420` | Dark argument sections. Chalk on soil 13.36:1, clay on soil 4.62:1   |
| `--chalk`     | `#f6efe4` | Light background, text on dark                                       |
| `--moss`      | `#3f5a3a` | Status section. Chalk on moss 6.72:1                                 |
| `--sun`       | `#e8b04a` | Warm highlight sections (ink on sun 8.82:1); large text on moss only |
| `--sun-light` | `#f3cf80` | Small labels on moss, soil and ink (5.14:1 on moss)                  |
| `--grid`      | ink @ 7%  | 44px plot-grid texture on clay and chalk                             |

The clay was lightened from the mockup's `#c8643b` (ink on it was 4.39:1, below AA).

Typography

- Sans: Inter Tight 400/500/600/800. Mono: JetBrains Mono 400/600. Self-hosted via `@fontsource`, latin subset.
- h1: 800, `clamp(2.5rem, 7vw + 0.5rem, 4.5rem)`, tracking -0.035em, line-height 1.
- h2: 800, `clamp(1.9rem, 3.5vw + 0.5rem, 2.6rem)`, tracking -0.03em.
- Body: 17px, line-height 1.55, max width 60ch.
- Labels and buttons: mono 600, uppercase, 0.05 to 0.08em tracking, 12 to 13px.

Spacing: `--space-1` to `--space-8` (0.25rem to 4.5rem). Page max 72rem, gutter `clamp(1rem, 4vw, 3rem)`.

Shape and motion: square corners, 2px ink borders, no shadows, no gradients except the grid texture. Minimal motion, always off under `prefers-reduced-motion`.

Light theme only. The palette is the brand.

## Components

- `Section` (`tone`, `grid`, `id`, `labelledby`): full-bleed band. Sets text colour for its tone.
- `Button` (`href`, `variant`: primary, secondary, on-dark): always a link. States: default, hover (tint), focus-visible (3px outline, 3px offset).
- `Kicker`: mono uppercase label above headings; switches to `--sun-light` on dark tones.
- `Status` (`id`): tag showing Developer preview, In development or Planned, from `src/data/status.ts`.
- `GatedCta` (`statusId`, `href`): live button only when the item is a developer preview; otherwise "Coming soon" plus "Watch on GitHub".
- `Header`, `Footer`, `Logo`: the plots mark (four plots, the chalk one is yours) with the FREEHOLD wordmark.

## Accessibility

- Target WCAG 2.2 AA. Body text 4.5:1 minimum; check every new colour pairing and add it to the table above.
- Every interactive element has a visible focus outline. Never remove outlines.
- One h1 per page. Landmarks: header, nav "Main", main, footer. Skip link first.
- Works at 320px wide with no horizontal scroll. Multi-column layouts collapse to one column.
- Everything works with JavaScript off. JavaScript only enhances.

## Writing tone

Plain, warm and confident. Short sentences. British English (neighbourhood, datacentre, organisation, licence).

- Lead with community, open source and sovereignty. Chain names (Cardano, Midnight) only on the Build page.
- Never use "Nightframe" or Midnight vocabulary as a headline.
- No militant language: no "resistance", "revolution", "digital soul".
- No em dashes. Use full stops, commas, colons or parentheses. `pnpm emdash` enforces this.

## Rules: do

- Check every factual claim against https://github.com/freehold-earth/freehold before it ships, and record the source.
- Describe status honestly with the three status labels.
- Give every section a real next step that exists today.
- Label precedents (Guifi.net, El Servidor del Barri, Community Box) as inspiration, never partners.

## Rules: don't

- Don't link to things that don't exist yet. Use `GatedCta`.
- Don't add third-party requests: no analytics, cookies, Google Fonts, CDNs or embeds.
- Don't add testimonials, counters or invented numbers.
- Don't use one-off colours, sizes or spacing outside the tokens.

## QA checklist

- [ ] `pnpm verify` passes (lint, types, unit, build, em dash scan, links, Playwright with axe).
- [ ] No third-party requests (e2e test).
- [ ] No horizontal scroll at 320px (e2e test).
- [ ] Focus visible on every link and button.
- [ ] Every new claim has a source in the repo.
- [ ] Screenshots reviewed at 1280px and 390px (`pnpm shots`).
