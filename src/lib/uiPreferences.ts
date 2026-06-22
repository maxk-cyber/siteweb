export type VibeMode = 'aurora' | 'terminal' | 'pulse';
export type MotionMode = 'cinematic' | 'calm';

export type ExperiencePreferences = {
  vibe: VibeMode;
  motion: MotionMode;
};

export const vibeModes: VibeMode[] = ['aurora', 'terminal', 'pulse'];
export const motionModes: MotionMode[] = ['cinematic', 'calm'];

export const defaultExperiencePreferences: ExperiencePreferences = {
  vibe: 'aurora',
  motion: 'cinematic',
};

export const EXPERIENCE_STORAGE_KEY = 'maxk-cyber-experience-v1';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function normalizeExperiencePreferences(value: unknown): ExperiencePreferences {
  if (!value || typeof value !== 'object') {
    return defaultExperiencePreferences;
  }

  const candidate = value as Partial<ExperiencePreferences>;
  const vibe = vibeModes.includes(candidate.vibe as VibeMode)
    ? (candidate.vibe as VibeMode)
    : defaultExperiencePreferences.vibe;
  const motion = motionModes.includes(candidate.motion as MotionMode)
    ? (candidate.motion as MotionMode)
    : defaultExperiencePreferences.motion;

  return { vibe, motion };
}

export function readExperiencePreferences(storage: StorageLike | undefined): ExperiencePreferences {
  if (!storage) {
    return defaultExperiencePreferences;
  }

  const saved = storage.getItem(EXPERIENCE_STORAGE_KEY);

  if (!saved) {
    return defaultExperiencePreferences;
  }

  try {
    return normalizeExperiencePreferences(JSON.parse(saved));
  } catch {
    return defaultExperiencePreferences;
  }
}

export function saveExperiencePreferences(
  storage: StorageLike | undefined,
  preferences: ExperiencePreferences,
) {
  if (!storage) {
    return;
  }

  storage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(preferences));
}

export function getNextVibeMode(current: VibeMode): VibeMode {
  return getNextValue(vibeModes, current);
}

export function getNextMotionMode(current: MotionMode): MotionMode {
  return getNextValue(motionModes, current);
}

function getNextValue<T extends string>(values: T[], current: T): T {
  const index = values.indexOf(current);
  const nextIndex = index === -1 ? 0 : (index + 1) % values.length;

  return values[nextIndex];
}
