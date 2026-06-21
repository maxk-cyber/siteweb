import { describe, expect, it } from 'vitest';
import { calculateReadiness, defaultAnswers, type ReadinessAnswers } from './readiness';

describe('calculateReadiness', () => {
  it('returns a practical default trust-builder recommendation', () => {
    const result = calculateReadiness(defaultAnswers);

    expect(result.score).toBe(63);
    expect(result.tier).toBe('Trust Builder');
    expect(result.focusAreas).toContain(
      'Run a tabletop drill and publish a first-hour response checklist.',
    );
  });

  it('identifies market-ready teams with tested controls', () => {
    const answers: ReadinessAnswers = {
      stage: 'scaleup',
      maturity: 'measured',
      incidentPlan: 'tested',
      cloudFootprint: 'simple',
      trainingCadence: 'quarterly',
    };

    const result = calculateReadiness(answers);

    expect(result.score).toBe(96);
    expect(result.tier).toBe('Market Ready');
    expect(result.focusAreas).toEqual([
      'Keep proof fresh with quarterly evidence updates and vendor review notes.',
    ]);
  });

  it('surfaces launch risk for immature, complex environments', () => {
    const answers: ReadinessAnswers = {
      stage: 'solo',
      maturity: 'ad-hoc',
      incidentPlan: 'none',
      cloudFootprint: 'regulated',
      trainingCadence: 'never',
    };

    const result = calculateReadiness(answers);

    expect(result.score).toBe(27);
    expect(result.tier).toBe('Launch Risk');
    expect(result.focusAreas).toHaveLength(3);
  });
});
