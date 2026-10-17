import { describe, expect, it } from 'vitest';
import { sourceUrl, statusUrls } from '../../src/data/sources';
import { STATUS } from '../../src/data/status';

describe('status source urls', () => {
  it('maps a repo path to the contents API', () => {
    expect(sourceUrl('agent/README.md')).toBe(
      'https://api.github.com/repos/freehold-earth/freehold/contents/agent/README.md',
    );
  });

  it('maps a tag to the refs API', () => {
    expect(sourceUrl('tag:agent-v0.1.0')).toBe(
      'https://api.github.com/repos/freehold-earth/freehold/git/ref/tags/agent-v0.1.0',
    );
  });

  it('maps a tree link to the contents API', () => {
    expect(sourceUrl('https://github.com/freehold-earth/freehold/tree/main/agent')).toBe(
      'https://api.github.com/repos/freehold-earth/freehold/contents/agent',
    );
  });

  it('covers every source and every link in STATUS', () => {
    const expected = new Set(STATUS.flatMap((s) => [s.source, ...(s.link ? [s.link] : [])]));
    expect(statusUrls(STATUS).length).toBe(expected.size);
  });
});
