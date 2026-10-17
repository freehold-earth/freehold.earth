// Serves /favicon.svg from the brand mark so it can never drift from the logo.
import { markSvg } from '../data/brand';

export function GET() {
  return new Response(markSvg(), { headers: { 'content-type': 'image/svg+xml' } });
}
