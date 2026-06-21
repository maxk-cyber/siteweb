import { describe, expect, it } from 'vitest';
import { buildActionPlan, calculatePlanProgress, formatActionPlanMarkdown } from './actionPlan';

describe('action plan builder logic', () => {
  it('builds scenario-specific enterprise action plans', () => {
    const plan = buildActionPlan('enterprise');

    expect(plan.label).toBe('Enterprise sale');
    expect(plan.items).toHaveLength(5);
    expect(plan.items[0]).toMatchObject({
      id: 'enterprise-question-bank',
      priority: 'Critical',
      evidence: 'Reusable questionnaire answers',
    });
  });

  it('calculates rounded completion progress', () => {
    expect(calculatePlanProgress(5, 2)).toBe(40);
    expect(calculatePlanProgress(0, 2)).toBe(0);
  });

  it('exports actionable Markdown with completion state', () => {
    const plan = buildActionPlan('launch');
    const markdown = formatActionPlanMarkdown(plan, plan.items, ['launch-public-entry']);

    expect(markdown).toContain('# Launch hardening Action Plan');
    expect(markdown).toContain('Progress: 20%');
    expect(markdown).toContain('- [x] **Map public entry points**');
    expect(markdown).toContain('- [ ] **Review auth, admin roles, and MFA**');
  });
});
