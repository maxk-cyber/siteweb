export type PlanScenario = 'launch' | 'enterprise' | 'incident' | 'compliance';
export type TaskPriority = 'Critical' | 'High' | 'Medium';

export type ScenarioOption = {
  label: string;
  value: PlanScenario;
};

export type ActionPlanItem = {
  id: string;
  title: string;
  category: string;
  priority: TaskPriority;
  owner: string;
  evidence: string;
  why: string;
};

export type ActionPlan = {
  scenario: PlanScenario;
  label: string;
  outcome: string;
  items: ActionPlanItem[];
};

export type CustomActionPlanItem = ActionPlanItem & {
  custom: true;
};

export const scenarioOptions: ScenarioOption[] = [
  { label: 'Launch hardening', value: 'launch' },
  { label: 'Enterprise sale', value: 'enterprise' },
  { label: 'Incident drill', value: 'incident' },
  { label: 'Compliance review', value: 'compliance' },
];

const planCatalog: Record<PlanScenario, ActionPlan> = {
  launch: {
    scenario: 'launch',
    label: 'Launch hardening',
    outcome: 'Reduce launch-day exposure before traffic, press, or paid campaigns spike.',
    items: [
      {
        id: 'launch-public-entry',
        title: 'Map public entry points',
        category: 'Attack surface',
        priority: 'Critical',
        owner: 'Engineering lead',
        evidence: 'Endpoint and DNS inventory',
        why: 'Unknown forms, subdomains, and scripts are the easiest launch risks to miss.',
      },
      {
        id: 'launch-auth-review',
        title: 'Review auth, admin roles, and MFA',
        category: 'Identity',
        priority: 'Critical',
        owner: 'Product owner',
        evidence: 'Access review screenshot',
        why: 'Buyers and attackers both notice weak access control first.',
      },
      {
        id: 'launch-script-audit',
        title: 'Audit analytics and third-party scripts',
        category: 'Data flow',
        priority: 'High',
        owner: 'Marketing ops',
        evidence: 'Approved script list',
        why: 'Campaign pixels and embeds can quietly expand the data exposure story.',
      },
      {
        id: 'launch-backup-restore',
        title: 'Confirm backup and restore path',
        category: 'Resilience',
        priority: 'High',
        owner: 'Infrastructure owner',
        evidence: 'Restore test note',
        why: 'A backup is only useful if the team knows how fast it can restore.',
      },
      {
        id: 'launch-trust-note',
        title: 'Publish buyer-safe security notes',
        category: 'Proof',
        priority: 'Medium',
        owner: 'Founder',
        evidence: 'Security FAQ draft',
        why: 'A clear trust story keeps security questions from becoming launch friction.',
      },
    ],
  },
  enterprise: {
    scenario: 'enterprise',
    label: 'Enterprise sale',
    outcome: 'Give an internal champion the answers and evidence needed to move a deal forward.',
    items: [
      {
        id: 'enterprise-question-bank',
        title: 'Build the top-question answer bank',
        category: 'Proof',
        priority: 'Critical',
        owner: 'Sales lead',
        evidence: 'Reusable questionnaire answers',
        why: 'Repeated security questions should become reusable sales infrastructure.',
      },
      {
        id: 'enterprise-control-index',
        title: 'Create a control evidence index',
        category: 'Evidence',
        priority: 'Critical',
        owner: 'Security owner',
        evidence: 'Mapped control/evidence table',
        why: 'Procurement confidence rises when claims link directly to artifacts.',
      },
      {
        id: 'enterprise-data-flow',
        title: 'Document customer data flows',
        category: 'Data flow',
        priority: 'High',
        owner: 'Product owner',
        evidence: 'Data flow diagram',
        why: 'Buyers need to understand what data is collected, stored, shared, and deleted.',
      },
      {
        id: 'enterprise-vendor-review',
        title: 'Summarize key vendor controls',
        category: 'Vendor risk',
        priority: 'High',
        owner: 'Operations',
        evidence: 'Vendor oversight note',
        why: 'Third-party dependencies are part of the buyer risk decision.',
      },
      {
        id: 'enterprise-response-proof',
        title: 'Package incident response proof',
        category: 'Resilience',
        priority: 'Medium',
        owner: 'Support lead',
        evidence: 'First-hour checklist',
        why: 'Customers want to know how communication works when something goes wrong.',
      },
    ],
  },
  incident: {
    scenario: 'incident',
    label: 'Incident drill',
    outcome: 'Practice the first hour before a suspicious event becomes customer-visible.',
    items: [
      {
        id: 'incident-roles',
        title: 'Assign incident roles and backups',
        category: 'Response',
        priority: 'Critical',
        owner: 'Founder',
        evidence: 'Role roster',
        why: 'Response speed depends on clear decision rights before adrenaline hits.',
      },
      {
        id: 'incident-templates',
        title: 'Prepare internal and customer templates',
        category: 'Communication',
        priority: 'High',
        owner: 'Customer lead',
        evidence: 'Notification drafts',
        why: 'Calm communication is easier when the structure is written in advance.',
      },
      {
        id: 'incident-evidence',
        title: 'Define evidence capture steps',
        category: 'Investigation',
        priority: 'Critical',
        owner: 'Engineering lead',
        evidence: 'Evidence checklist',
        why: 'Good evidence collection protects recovery, disclosure, and learning.',
      },
      {
        id: 'incident-tabletop',
        title: 'Run a realistic tabletop scenario',
        category: 'Practice',
        priority: 'High',
        owner: 'Security owner',
        evidence: 'Tabletop notes',
        why: 'The drill reveals gaps that a written policy hides.',
      },
      {
        id: 'incident-after-action',
        title: 'Create the after-action backlog',
        category: 'Improvement',
        priority: 'Medium',
        owner: 'Operations',
        evidence: 'Prioritized backlog',
        why: 'Every drill should leave the team more prepared than it started.',
      },
    ],
  },
  compliance: {
    scenario: 'compliance',
    label: 'Compliance review',
    outcome: 'Organize the evidence reviewers need without pretending a checklist is an audit.',
    items: [
      {
        id: 'compliance-scope',
        title: 'Define review scope and systems',
        category: 'Scope',
        priority: 'Critical',
        owner: 'Operations',
        evidence: 'In-scope system list',
        why: 'Unclear scope causes wasted evidence collection and reviewer confusion.',
      },
      {
        id: 'compliance-policy-gap',
        title: 'Identify policy and control gaps',
        category: 'Controls',
        priority: 'Critical',
        owner: 'Security owner',
        evidence: 'Gap register',
        why: 'A gap register turns vague compliance anxiety into fixable work.',
      },
      {
        id: 'compliance-access',
        title: 'Review privileged access',
        category: 'Identity',
        priority: 'High',
        owner: 'Engineering lead',
        evidence: 'Privileged access export',
        why: 'Access control is one of the first places reviewers look for operational rigor.',
      },
      {
        id: 'compliance-vendors',
        title: 'Collect vendor and data-processing proof',
        category: 'Vendor risk',
        priority: 'High',
        owner: 'Operations',
        evidence: 'Vendor evidence folder',
        why: 'Regulated buyers expect vendor risk to be visible and maintained.',
      },
      {
        id: 'compliance-leadership',
        title: 'Prepare leadership risk summary',
        category: 'Governance',
        priority: 'Medium',
        owner: 'Founder',
        evidence: 'Board-ready risk brief',
        why: 'Executives need decisions, owners, and residual risk, not raw control lists.',
      },
    ],
  },
};

export function buildActionPlan(scenario: PlanScenario): ActionPlan {
  return planCatalog[scenario];
}

export function calculatePlanProgress(totalItems: number, completedCount: number): number {
  if (totalItems <= 0) {
    return 0;
  }

  return Math.round((completedCount / totalItems) * 100);
}

export function formatActionPlanMarkdown(
  plan: ActionPlan,
  items: ActionPlanItem[],
  completedIds: string[],
): string {
  const completed = new Set(completedIds);
  const progress = calculatePlanProgress(items.length, completed.size);
  const rows = items.map((item) => {
    const status = completed.has(item.id) ? 'x' : ' ';

    return `- [${status}] **${item.title}** (${item.priority}, ${item.category}) - Owner: ${item.owner}. Evidence: ${item.evidence}.`;
  });

  return [
    `# ${plan.label} Action Plan`,
    '',
    plan.outcome,
    '',
    `Progress: ${progress}%`,
    '',
    ...rows,
  ].join('\n');
}
