import { describe, expect, it } from 'vitest';
import {
  buildQuestionnairePack,
  defaultQuestionnaireInputs,
  formatQuestionnaireAnswerMarkdown,
} from './questionnaire';

describe('buildQuestionnairePack', () => {
  it('builds a default buyer-ready answer pack', () => {
    const pack = buildQuestionnairePack(defaultQuestionnaireInputs);

    expect(pack.label).toBe('Buyer-ready');
    expect(pack.score).toBe(74);
    expect(pack.answers).toHaveLength(5);
    expect(pack.trustCenterAssets).toContain('AI impersonation verification ritual');
    expect(pack.markdown).toContain('# Founder-led SaaS Questionnaire Answer Pack');
    expect(pack.markdown).toContain('Trust center assets to publish:');
  });

  it('filters questions by category and raises maturity for regulated reviews', () => {
    const pack = buildQuestionnairePack({
      audience: 'regulated-procurement',
      evidenceMaturity: 'audit-ready',
      category: 'incident',
    });

    expect(pack.label).toBe('Audit-ready');
    expect(pack.categoryLabel).toBe('Incident response');
    expect(pack.answers).toHaveLength(1);
    expect(pack.answers[0]).toMatchObject({
      question: 'What happens in the first hour of a suspected security incident?',
      confidence: 90,
      trustCenterAsset: 'First-hour response card',
    });
  });

  it('formats a copyable answer with evidence and next step', () => {
    const pack = buildQuestionnairePack(defaultQuestionnaireInputs);
    const markdown = formatQuestionnaireAnswerMarkdown(pack.answers[0]);

    expect(markdown).toContain('## How do you control privileged access to production systems?');
    expect(markdown).toContain('Evidence: Published evidence');
    expect(markdown).toContain('Next step: Attach the latest access review evidence');
  });
});
