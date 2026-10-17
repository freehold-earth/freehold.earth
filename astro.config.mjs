// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://freehold.earth',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
