import { useEffect, useState } from 'react';
import type { MotionMode } from '../lib/uiPreferences';
import { useIterator } from '../lib/useIterator';

type HeroProofDeckProps = {
  motion: MotionMode;
};

type HeroProofState = {
  label: string;
  title: string;
  metric: string;
  detail: string;
};

const heroProofStates: HeroProofState[] = [
  {
    label: 'Founder sprint',
    title: 'Answer security questions before they enter the deal room.',
    metric: '3',
    detail: 'Reusable proof assets for the questions founders hear every enterprise review.',
  },
  {
    label: 'Agency handoff',
    title: 'Show clients exactly what is safe to launch, monitor, and improve.',
    metric: '72h',
    detail: 'A risk map, launch validator, and first-fix queue ready for client approvals.',
  },
  {
    label: 'Incident rehearsal',
    title: 'Make the first hour feel practiced instead of improvised.',
    metric: '4x',
    detail: 'Role clarity, response copy, and customer-safe evidence in one guided flow.',
  },
];

export function HeroProofDeck({ motion }: HeroProofDeckProps) {
  const proofIterator = useIterator(heroProofStates);
  const proof = proofIterator.current;
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isAutoPlaying, setIsAutoPlaying] = useState(motion === 'cinematic');

  useEffect(() => {
    setIsAutoPlaying(motion === 'cinematic');
  }, [motion]);

  useEffect(() => {
    if (!isAutoPlaying || motion !== 'cinematic' || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(proofIterator.next, 4200);

    return () => window.clearInterval(intervalId);
  }, [isAutoPlaying, motion, prefersReducedMotion, proofIterator.next]);

  return (
    <article className="hero-proof-deck" aria-live="polite">
      <div className="hero-proof-topline">
        <span>Buyer mode</span>
        <strong>
          {proofIterator.index + 1}/{proofIterator.count}
        </strong>
      </div>

      <div className="hero-proof-body">
        <p>{proof.label}</p>
        <h2>{proof.title}</h2>
        <div>
          <strong>{proof.metric}</strong>
          <span>{proof.detail}</span>
        </div>
      </div>

      <div className="hero-proof-controls" aria-label="Hero proof controls">
        {heroProofStates.map((item, index) => (
          <button
            aria-label={`Show ${item.label} proof state`}
            aria-pressed={proofIterator.index === index}
            key={item.label}
            onClick={() => proofIterator.goTo(index)}
            type="button"
          >
            {item.label}
          </button>
        ))}
        <button type="button" onClick={proofIterator.next}>
          Next proof state
        </button>
        <button type="button" onClick={() => setIsAutoPlaying((current) => !current)}>
          {isAutoPlaying ? 'Pause rotation' : 'Resume rotation'}
        </button>
      </div>
    </article>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);

    const handleChange = () => setPrefersReducedMotion(media.matches);

    media.addEventListener?.('change', handleChange);

    return () => media.removeEventListener?.('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
