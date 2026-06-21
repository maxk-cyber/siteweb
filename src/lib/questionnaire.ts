export type ReviewAudience = 'founder-saas' | 'agency-client' | 'regulated-procurement';
export type EvidenceMaturity = 'starter' | 'documented' | 'audit-ready';
export type QuestionCategory = 'all' | 'identity' | 'data' | 'incident' | 'ai-fraud' | 'vendor';

export type SelectOption<T extends string> = {
  label: string;
  value: T;
};

export type QuestionnaireInputs = {
  audience: ReviewAudience;
  evidenceMaturity: EvidenceMaturity;
  category: QuestionCategory;
};

export type QuestionnaireAnswer = {
  id: string;
  category: Exclude<QuestionCategory, 'all'>;
  question: string;
  answer: string;
  evidence: string;
  owner: string;
  trustCenterAsset: string;
  nextStep: string;
  confidence: number;
};

export type QuestionnairePack = {
  audienceLabel: string;
  maturityLabel: string;
  categoryLabel: string;
  score: number;
  label: 'Draftable' | 'Buyer-ready' | 'Audit-ready';
  headline: string;
  summary: string;
  trustCenterAssets: string[];
  answers: QuestionnaireAnswer[];
  markdown: string;
};

type AudienceProfile = {
  label: string;
  voice: string;
  scoreModifier: number;
  headline: string;
  summary: string;
};

type MaturityProfile = {
  label: string;
  scoreBoost: number;
  evidencePrefix: string;
  claimTone: string;
};

type QuestionTemplate = {
  id: string;
  category: Exclude<QuestionCategory, 'all'>;
  question: string;
  baseConfidence: number;
  owner: string;
  trustCenterAsset: string;
  evidenceByMaturity: Record<EvidenceMaturity, string>;
  answer: (audience: AudienceProfile, maturity: MaturityProfile) => string;
  nextStep: (maturity: EvidenceMaturity) => string;
};

export const reviewAudienceOptions: SelectOption<ReviewAudience>[] = [
  { label: 'Founder-led SaaS', value: 'founder-saas' },
  { label: 'Agency/client launch', value: 'agency-client' },
  { label: 'Regulated procurement', value: 'regulated-procurement' },
];

export const evidenceMaturityOptions: SelectOption<EvidenceMaturity>[] = [
  { label: 'Starter proof', value: 'starter' },
  { label: 'Documented controls', value: 'documented' },
  { label: 'Audit-ready evidence', value: 'audit-ready' },
];

export const questionCategoryOptions: SelectOption<QuestionCategory>[] = [
  { label: 'All questions', value: 'all' },
  { label: 'Identity', value: 'identity' },
  { label: 'Data handling', value: 'data' },
  { label: 'Incident response', value: 'incident' },
  { label: 'AI fraud', value: 'ai-fraud' },
  { label: 'Vendor risk', value: 'vendor' },
];

export const defaultQuestionnaireInputs: QuestionnaireInputs = {
  audience: 'founder-saas',
  evidenceMaturity: 'documented',
  category: 'all',
};

const audienceProfiles: Record<ReviewAudience, AudienceProfile> = {
  'founder-saas': {
    label: 'Founder-led SaaS',
    voice: 'lean team with named owners and practical review rhythms',
    scoreModifier: 0,
    headline: 'A focused answer bank that helps a champion keep the deal moving.',
    summary:
      'Use crisp, source-backed answers that show ownership, data care, and response maturity without pretending to be a large security organization.',
  },
  'agency-client': {
    label: 'Agency/client launch',
    voice: 'launch team coordinating client, creative, engineering, and handoff owners',
    scoreModifier: 2,
    headline: 'A client-safe answer bank for launch approvals and post-launch handoff.',
    summary:
      'Package the security work behind a campaign or rebuild so clients understand what was checked, what was fixed, and what they own next.',
  },
  'regulated-procurement': {
    label: 'Regulated procurement',
    voice: 'operator serving buyers who need traceable evidence and clear risk decisions',
    scoreModifier: 5,
    headline: 'A diligence-grade answer bank for procurement, legal, and leadership review.',
    summary:
      'Connect each answer to an evidence artifact, owner, and next action so reviewers can trace claims instead of chasing one-off follow-ups.',
  },
};

const maturityProfiles: Record<EvidenceMaturity, MaturityProfile> = {
  starter: {
    label: 'Starter proof',
    scoreBoost: 0,
    evidencePrefix: 'Draft evidence',
    claimTone: 'We are formalizing',
  },
  documented: {
    label: 'Documented controls',
    scoreBoost: 11,
    evidencePrefix: 'Published evidence',
    claimTone: 'We maintain',
  },
  'audit-ready': {
    label: 'Audit-ready evidence',
    scoreBoost: 19,
    evidencePrefix: 'Audit-ready evidence',
    claimTone: 'We operate and review',
  },
};

const questionTemplates: QuestionTemplate[] = [
  {
    id: 'identity-access',
    category: 'identity',
    question: 'How do you control privileged access to production systems?',
    baseConfidence: 62,
    owner: 'Engineering lead',
    trustCenterAsset: 'Access control overview',
    evidenceByMaturity: {
      starter: 'Named production admins, MFA requirement notes, and a draft access review checklist.',
      documented: 'Access control policy, privileged user export, MFA screenshots, and quarterly review notes.',
      'audit-ready':
        'Access review evidence, SSO/MFA configuration exports, approval records, and offboarding samples.',
    },
    answer: (audience, maturity) =>
      `${maturity.claimTone} least-privilege access for production systems with named owners, MFA expectations, and review points that fit a ${audience.voice}. Privileged access is limited to people who need it for support, deployment, or incident response.`,
    nextStep: (maturity) =>
      maturity === 'starter'
        ? 'Export the current privileged user list and assign a recurring access review owner.'
        : 'Attach the latest access review evidence and remove stale privileged roles before sharing.',
  },
  {
    id: 'data-flow',
    category: 'data',
    question: 'What customer data do you collect, store, share, and delete?',
    baseConfidence: 64,
    owner: 'Product owner',
    trustCenterAsset: 'Customer data flow note',
    evidenceByMaturity: {
      starter: 'Draft data inventory, privacy page outline, and vendor list.',
      documented: 'Data flow diagram, retention notes, subprocessors, and published privacy page.',
      'audit-ready':
        'Data inventory, retention approvals, DPA/subprocessor records, and deletion request samples.',
    },
    answer: (audience, maturity) =>
      `${maturity.claimTone} a buyer-readable data map that explains collection, storage, subprocessors, retention, and deletion for the workflows in scope. The goal is to make the customer data boundary obvious to reviewers and operators.`,
    nextStep: (maturity) =>
      maturity === 'audit-ready'
        ? 'Link the data map to privacy, subprocessor, and deletion evidence in the trust center.'
        : 'Convert the data inventory into a plain-language diagram that sales and support can use.',
  },
  {
    id: 'incident-response',
    category: 'incident',
    question: 'What happens in the first hour of a suspected security incident?',
    baseConfidence: 66,
    owner: 'Security owner',
    trustCenterAsset: 'First-hour response card',
    evidenceByMaturity: {
      starter: 'Draft escalation list, internal channel, and notification template shell.',
      documented: 'Incident runbook, escalation roster, tabletop notes, and customer update templates.',
      'audit-ready':
        'Tabletop scorecard, evidence capture checklist, incident roles, and after-action backlog samples.',
    },
    answer: (audience, maturity) =>
      `${maturity.claimTone} a first-hour response path that names who investigates, who decides, who communicates, and what evidence gets preserved. This keeps a ${audience.voice} aligned before customers or buyers ask for updates.`,
    nextStep: (maturity) =>
      maturity === 'starter'
        ? 'Run a 30-minute tabletop using a suspicious-login or payment-change scenario.'
        : 'Refresh the tabletop notes and confirm escalation contacts before the next review cycle.',
  },
  {
    id: 'ai-fraud',
    category: 'ai-fraud',
    question: 'How do you reduce AI impersonation, deepfake, and payment-change risk?',
    baseConfidence: 60,
    owner: 'Operations lead',
    trustCenterAsset: 'AI impersonation verification ritual',
    evidenceByMaturity: {
      starter: 'Payment-change verification rule, reporting channel, and role-based awareness note.',
      documented:
        'Out-of-band verification policy, finance approval checklist, phishing-resistant MFA plan, and training log.',
      'audit-ready':
        'Verification control samples, training completion evidence, drill results, and exception approvals.',
    },
    answer: (audience, maturity) =>
      `${maturity.claimTone} out-of-band verification for high-risk requests, especially payment changes, credential recovery, and executive approvals. Team members are expected to slow down, verify through a trusted channel, and escalate suspicious AI-generated messages or calls.`,
    nextStep: (maturity) =>
      maturity === 'starter'
        ? 'Publish a no-banking-changes-by-email rule and add a trusted callback path.'
        : 'Add AI impersonation scenarios to the next tabletop and training refresh.',
  },
  {
    id: 'vendor-risk',
    category: 'vendor',
    question: 'How do you review vendors and third-party scripts that touch customer data?',
    baseConfidence: 63,
    owner: 'Operations owner',
    trustCenterAsset: 'Vendor and script oversight note',
    evidenceByMaturity: {
      starter: 'Key vendor list, data access notes, and launch script inventory.',
      documented: 'Vendor review notes, subprocessors, script approvals, and data-processing boundaries.',
      'audit-ready':
        'Vendor risk register, renewal review history, DPA evidence, and third-party script approval records.',
    },
    answer: (audience, maturity) =>
      `${maturity.claimTone} a visible vendor and script review process for services that process customer data, affect authentication, or run in the public product. Reviews prioritize data access, contractual safeguards, ownership, and removal paths.`,
    nextStep: (maturity) =>
      maturity === 'starter'
        ? 'Inventory customer-facing scripts and rank vendors by data sensitivity.'
        : 'Attach the current vendor register and mark overdue renewals or risk acceptances.',
  },
];

export function buildQuestionnairePack(inputs: QuestionnaireInputs): QuestionnairePack {
  const audience = audienceProfiles[inputs.audience];
  const maturity = maturityProfiles[inputs.evidenceMaturity];
  const categoryLabel = getCategoryLabel(inputs.category);
  const templates =
    inputs.category === 'all'
      ? questionTemplates
      : questionTemplates.filter((question) => question.category === inputs.category);
  const answers = templates.map((template) => {
    const confidence = Math.min(
      98,
      template.baseConfidence + maturity.scoreBoost + audience.scoreModifier,
    );

    return {
      id: template.id,
      category: template.category,
      question: template.question,
      answer: template.answer(audience, maturity),
      evidence: `${maturity.evidencePrefix}: ${template.evidenceByMaturity[inputs.evidenceMaturity]}`,
      owner: template.owner,
      trustCenterAsset: template.trustCenterAsset,
      nextStep: template.nextStep(inputs.evidenceMaturity),
      confidence,
    };
  });
  const score = Math.round(
    answers.reduce((total, answer) => total + answer.confidence, 0) / answers.length,
  );
  const label = getPackLabel(score, inputs.evidenceMaturity);
  const trustCenterAssets = Array.from(new Set(answers.map((answer) => answer.trustCenterAsset)));
  const packWithoutMarkdown = {
    audienceLabel: audience.label,
    maturityLabel: maturity.label,
    categoryLabel,
    score,
    label,
    headline: audience.headline,
    summary: audience.summary,
    trustCenterAssets,
    answers,
  };

  return {
    ...packWithoutMarkdown,
    markdown: formatQuestionnairePackMarkdown(packWithoutMarkdown),
  };
}

export function formatQuestionnaireAnswerMarkdown(answer: QuestionnaireAnswer): string {
  return [
    `## ${answer.question}`,
    '',
    answer.answer,
    '',
    `Evidence: ${answer.evidence}`,
    `Trust center asset: ${answer.trustCenterAsset}`,
    `Owner: ${answer.owner}`,
    `Next step: ${answer.nextStep}`,
    `Confidence: ${answer.confidence}/100`,
  ].join('\n');
}

function formatQuestionnairePackMarkdown(
  pack: Omit<QuestionnairePack, 'markdown'>,
): string {
  return [
    `# ${pack.audienceLabel} Questionnaire Answer Pack`,
    '',
    `${pack.label} (${pack.score}/100)`,
    pack.summary,
    '',
    `Focus: ${pack.categoryLabel}`,
    `Evidence maturity: ${pack.maturityLabel}`,
    '',
    'Trust center assets to publish:',
    ...pack.trustCenterAssets.map((asset) => `- ${asset}`),
    '',
    'Answers:',
    ...pack.answers.flatMap((answer) => [
      '',
      `### ${answer.question}`,
      answer.answer,
      `Evidence: ${answer.evidence}`,
      `Owner: ${answer.owner}`,
      `Next step: ${answer.nextStep}`,
    ]),
  ].join('\n');
}

function getPackLabel(score: number, maturity: EvidenceMaturity): QuestionnairePack['label'] {
  if (maturity === 'audit-ready' && score >= 84) {
    return 'Audit-ready';
  }

  if (score >= 74) {
    return 'Buyer-ready';
  }

  return 'Draftable';
}

function getCategoryLabel(category: QuestionCategory): string {
  return questionCategoryOptions.find((option) => option.value === category)?.label ?? 'All questions';
}
