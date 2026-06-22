import { describe, expect, it, vi } from 'vitest';
import {
  EXPERIENCE_STORAGE_KEY,
  defaultExperiencePreferences,
  getNextMotionMode,
  getNextVibeMode,
  normalizeExperiencePreferences,
  readExperiencePreferences,
  saveExperiencePreferences,
} from './uiPreferences';

function createMemoryStorage(initialValue?: string) {
  const values = new Map<string, string>();

  if (initialValue) {
    values.set(EXPERIENCE_STORAGE_KEY, initialValue);
  }

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  };
}

describe('uiPreferences', () => {
  it('normalizes missing or unknown values to safe defaults', () => {
    expect(normalizeExperiencePreferences(null)).toEqual(defaultExperiencePreferences);
    expect(normalizeExperiencePreferences({ vibe: 'unknown', motion: 'wired' })).toEqual(
      defaultExperiencePreferences,
    );
    expect(normalizeExperiencePreferences({ vibe: 'pulse', motion: 'calm' })).toEqual({
      vibe: 'pulse',
      motion: 'calm',
    });
  });

  it('reads and saves preferences in storage', () => {
    const storage = createMemoryStorage(JSON.stringify({ vibe: 'terminal', motion: 'calm' }));

    expect(readExperiencePreferences(storage)).toEqual({ vibe: 'terminal', motion: 'calm' });

    saveExperiencePreferences(storage, { vibe: 'pulse', motion: 'cinematic' });

    expect(storage.setItem).toHaveBeenCalledWith(
      EXPERIENCE_STORAGE_KEY,
      JSON.stringify({ vibe: 'pulse', motion: 'cinematic' }),
    );
  });

  it('falls back to defaults for corrupt saved data and cycles settings', () => {
    expect(readExperiencePreferences(createMemoryStorage('{not-json'))).toEqual(
      defaultExperiencePreferences,
    );

    expect(getNextVibeMode('aurora')).toBe('terminal');
    expect(getNextVibeMode('pulse')).toBe('aurora');
    expect(getNextMotionMode('cinematic')).toBe('calm');
    expect(getNextMotionMode('calm')).toBe('cinematic');
  });
});
