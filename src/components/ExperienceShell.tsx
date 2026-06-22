import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AnchorHTMLAttributes,
  ComponentPropsWithoutRef,
  PointerEvent,
  ReactNode,
} from 'react';
import {
  getNextMotionMode,
  getNextVibeMode,
  readExperiencePreferences,
  saveExperiencePreferences,
  type ExperiencePreferences,
} from '../lib/uiPreferences';

type ExperienceController = {
  cycleMotion: () => void;
  cycleVibe: () => void;
  preferences: ExperiencePreferences;
  setPreferences: (
    preferences:
      | ExperiencePreferences
      | ((current: ExperiencePreferences) => ExperiencePreferences),
  ) => void;
};

type ExperienceShellProps = {
  children: ReactNode;
  experience: ExperienceController;
};

type StorageLike = Parameters<typeof readExperiencePreferences>[0];

export function useExperiencePreferences(storage: StorageLike = getBrowserStorage()): ExperienceController {
  const [preferences, setPreferenceState] = useState<ExperiencePreferences>(() =>
    readExperiencePreferences(storage),
  );

  useEffect(() => {
    saveExperiencePreferences(storage, preferences);
  }, [preferences, storage]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.vibe = preferences.vibe;
    document.documentElement.dataset.motion = preferences.motion;
  }, [preferences]);

  const setPreferences: ExperienceController['setPreferences'] = useCallback((nextPreferences) => {
    setPreferenceState((current) =>
      typeof nextPreferences === 'function' ? nextPreferences(current) : nextPreferences,
    );
  }, []);

  const cycleVibe = useCallback(() => {
    setPreferences((current) => ({ ...current, vibe: getNextVibeMode(current.vibe) }));
  }, [setPreferences]);

  const cycleMotion = useCallback(() => {
    setPreferences((current) => ({ ...current, motion: getNextMotionMode(current.motion) }));
  }, [setPreferences]);

  return { cycleMotion, cycleVibe, preferences, setPreferences };
}

export function ExperienceShell({ children, experience }: ExperienceShellProps) {
  const { preferences } = experience;

  return (
    <ClickSpark enabled={preferences.motion === 'cinematic'}>
      <div className="experience-root" data-motion={preferences.motion} data-vibe={preferences.vibe}>
        <AuroraBackdrop />
        <ExperienceControls experience={experience} />
        <ExperienceDock />
        {children}
      </div>
    </ClickSpark>
  );
}

export function MagneticAnchor({
  className = '',
  onPointerLeave,
  onPointerMove,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / 9;
    const y = (event.clientY - rect.top - rect.height / 2) / 9;

    event.currentTarget.style.setProperty('--magnet-x', `${x}px`);
    event.currentTarget.style.setProperty('--magnet-y', `${y}px`);
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--magnet-x', '0px');
    event.currentTarget.style.setProperty('--magnet-y', '0px');
    onPointerLeave?.(event);
  };

  return (
    <a
      className={`magnetic-target ${className}`.trim()}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      {...props}
    />
  );
}

type SpotlightCardProps = ComponentPropsWithoutRef<'article'> & {
  as?: 'article' | 'div' | 'section';
};

export function SpotlightCard({
  as = 'article',
  className = '',
  onPointerMove,
  ...props
}: SpotlightCardProps) {
  const Component = as;

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  };

  return <Component className={`spotlight-card ${className}`.trim()} onPointerMove={handlePointerMove} {...props} />;
}

function AuroraBackdrop() {
  return (
    <div className="aurora-backdrop" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function ExperienceControls({ experience }: { experience: ExperienceController }) {
  const { cycleMotion, cycleVibe, preferences } = experience;
  const vibeLabel = getDisplayLabel(preferences.vibe);
  const motionLabel = getDisplayLabel(preferences.motion);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || isEditableTarget(event.target)) {
        return;
      }

      if (event.key.toLowerCase() === 'v') {
        cycleVibe();
      }

      if (event.key.toLowerCase() === 'm') {
        cycleMotion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleMotion, cycleVibe]);

  return (
    <aside className="experience-controls" aria-label="Experience controls">
      <p>Trust cockpit</p>
      <button aria-label={`Cycle vibe. Current vibe: ${vibeLabel}`} type="button" onClick={cycleVibe}>
        Vibe: {vibeLabel}
      </button>
      <button
        aria-label={`Cycle motion intensity. Current motion: ${motionLabel}`}
        type="button"
        onClick={cycleMotion}
      >
        Motion: {motionLabel}
      </button>
      <small aria-live="polite">Shortcuts: V / M</small>
    </aside>
  );
}

function ExperienceDock() {
  const dockLinks = [
    { href: '#scanner', label: 'Scan', code: 'SC' },
    { href: '#signals', label: 'Signals', code: 'SI' },
    { href: '#validator', label: 'Validate', code: 'VA' },
    { href: '#proof-studio', label: 'Proof', code: 'PR' },
    { href: '#answer-desk', label: 'Answers', code: 'AN' },
    { href: '#action-plan', label: 'Plan', code: 'PL' },
  ];

  return (
    <nav className="experience-dock" aria-label="Trust cockpit quick actions">
      {dockLinks.map((link) => (
        <a href={link.href} key={link.href}>
          <span>{link.code}</span>
          <small>{link.label}</small>
        </a>
      ))}
    </nav>
  );
}

function ClickSpark({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || !stageRef.current || typeof document === 'undefined') {
      return;
    }

    const spark = document.createElement('span');
    spark.className = 'click-spark';
    spark.style.left = `${event.clientX}px`;
    spark.style.top = `${event.clientY}px`;

    for (let index = 0; index < 8; index += 1) {
      const ray = document.createElement('i');
      ray.style.setProperty('--ray-index', `${index}`);
      spark.appendChild(ray);
    }

    stageRef.current.appendChild(spark);
    window.setTimeout(() => spark.remove(), 620);
  };

  return (
    <div className="click-spark-layer" onPointerDownCapture={handlePointerDown}>
      {children}
      <div className="click-spark-stage" ref={stageRef} aria-hidden="true" />
    </div>
  );
}

function getBrowserStorage(): StorageLike {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function getDisplayLabel(value: string) {
  return value
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLSelectElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  );
}
