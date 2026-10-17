import { describe, expect, it } from 'vitest';
import { STATUS, STATE_LABEL, getStatus, byState } from '../../src/data/status';

describe('status data', () => {
  it('has unique ids', () => {
    const ids = STATUS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every item a non-empty source', () => {
    expect(STATUS.filter((s) => !s.source.trim()).map((s) => s.id)).toEqual([]);
  });

  it('uses only the three states', () => {
    const states = new Set(['preview', 'in-development', 'planned']);
    expect(STATUS.filter((s) => !states.has(s.state)).map((s) => s.id)).toEqual([]);
  });

  it('labels developer preview honestly', () => {
    expect(STATE_LABEL.preview).toBe('Developer preview');
    expect(STATE_LABEL['in-development']).toBe('In development');
    expect(STATE_LABEL.planned).toBe('Planned');
  });

  it('throws on an unknown id', () => {
    expect(() => getStatus('nope')).toThrow('Unknown status id: nope');
  });

  it('filters by state', () => {
    for (const item of byState('planned')) expect(item.state).toBe('planned');
  });
});
