export type CompanyStage = 'solo' | 'startup' | 'scaleup';
export type SecurityMaturity = 'ad-hoc' | 'documented' | 'measured';
export type IncidentPlan = 'none' | 'draft' | 'tested';
export type CloudFootprint = 'simple' | 'multi-service' | 'regulated';
export type TrainingCadence = 'never' | 'annual' | 'quarterly';

export type ReadinessAnswers = {
  stage: CompanyStage;
  maturity: SecurityMaturity;
  incidentPlan: IncidentPlan;
  cloudFootprint: CloudFootprint;
  trainingCadence: TrainingCadence;
};

export type ReadinessResult = {
  score: number;
  tier: 'Launch Risk' | 'Trust Builder' | 'Market Ready';
  headline: string;
  recommendation: string;
  focusAreas: string[];
};

const stageScores: Record<CompanyStage, number> = {
  solo: 12,
  startup: 18,
  scaleup: 22,
};

const maturityScores: Record<SecurityMaturity, number> = {
  'ad-hoc': 8,
  documented: 18,
  measured: 26,
};

const incidentScores: Record<IncidentPlan, number> = {
  none: 4,
  draft: 14,
  tested: 22,
};

const cloudComplexityPenalty: Record<CloudFootprint, number> = {
  simple: 10,
  'multi-service': 4,
  regulated: 0,
};

const trainingScores: Record<TrainingCadence, number> = {
  never: 3,
  annual: 9,
  quarterly: 16,
};

export const defaultAnswers: ReadinessAnswers = {
  stage: 'startup',
  maturity: 'documented',
  incidentPlan: 'draft',
  cloudFootprint: 'multi-service',
  trainingCadence: 'annual',
};

export function calculateReadiness(answers: ReadinessAnswers): ReadinessResult {
  const score = Math.min(
    100,
    stageScores[answers.stage] +
      maturityScores[answers.maturity] +
      incidentScores[answers.incidentPlan] +
      cloudComplexityPenalty[answers.cloudFootprint] +
      trainingScores[answers.trainingCadence],
  );

  const focusAreas = getFocusAreas(answers);

  if (score >= 76) {
    return {
      score,
      tier: 'Market Ready',
      headline: 'You can lead with trust, not just features.',
      recommendation:
        'Package your controls into a buyer-facing trust packet and rehearse a response drill so growth does not outpace proof.',
      focusAreas,
    };
  }

  if (score >= 52) {
    return {
      score,
      tier: 'Trust Builder',
      headline: 'You are close, but customers will still find gaps.',
      recommendation:
        'Prioritize incident readiness, cloud access review, and crisp security answers before the next public campaign.',
      focusAreas,
    };
  }

  return {
    score,
    tier: 'Launch Risk',
    headline: 'The launch story is moving faster than the security story.',
    recommendation:
      'Start with a hardening sprint and a first-hour incident runbook before scaling traffic, partnerships, or paid acquisition.',
    focusAreas,
  };
}

function getFocusAreas(answers: ReadinessAnswers): string[] {
  const focusAreas: string[] = [];

  if (answers.maturity === 'ad-hoc') {
    focusAreas.push('Document your highest-risk controls and owner responsibilities.');
  }

  if (answers.incidentPlan !== 'tested') {
    focusAreas.push('Run a tabletop drill and publish a first-hour response checklist.');
  }

  if (answers.cloudFootprint !== 'simple') {
    focusAreas.push('Review cloud identity, storage exposure, logging, and third-party scripts.');
  }

  if (answers.trainingCadence !== 'quarterly') {
    focusAreas.push('Refresh team security habits around AI impersonation and payment changes.');
  }

  if (focusAreas.length === 0) {
    focusAreas.push('Keep proof fresh with quarterly evidence updates and vendor review notes.');
  }

  return focusAreas.slice(0, 3);
}
