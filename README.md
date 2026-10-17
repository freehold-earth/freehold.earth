# freehold.earth

The website for [Freehold](https://github.com/freehold-earth/freehold), live at
[freehold.earth](https://freehold.earth). A static [Astro](https://astro.build) site, published to
GitHub Pages on every push to `main` once all checks pass.

## Develop

Needs Node 24 and pnpm.

```sh
pnpm install
pnpm dev      # local dev server
pnpm verify   # lint, types, tests, build, link and accessibility checks
```

Design rules and tokens are in [DESIGN.md](DESIGN.md). Colours live only in `src/data/brand.ts`.
Every claim about what Freehold can do comes from `src/data/status.ts`, and each item there cites
where it can be checked in the Freehold repo.

## Licence

The code is licensed under [Apache-2.0](LICENSE). The Freehold name and logo are not covered by that
licence (see section 6), so please don't use them in a way that suggests your project is Freehold or
is endorsed by it.
