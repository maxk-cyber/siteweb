export type BuyerAudience = 'founder' | 'agency' | 'regulated';
export type BuyingMotion = 'public-launch' | 'enterprise-sale' | 'incident-refresh';

export type SelectOption<T extends string> = {
  label: string;
  value: T;
};

export type EvidenceAsset = {
  title: string;
  detail: string;
  impact: string;
};

export type BuyerObjection = {
  question: string;
  answer: string;
  proof: string;
};

export type TrustPacketInputs = {
  audience: BuyerAudience;
  motion: BuyingMotion;
};

export type TrustPacket = {
  audienceLabel: string;
  motionLabel: string;
  score: number;
  headline: string;
  summary: string;
  evidenceAssets: EvidenceAsset[];
  objections: BuyerObjection[];
  nextSteps: string[];
  handoff: string;
};

export const audienceOptions: SelectOption<BuyerAudience>[] = [
  { label: 'Founder-led SaaS', value: 'founder' },
  { label: 'Agency launch team', value: 'agency' },
  { label: 'Regulated operator', value: 'regulated' },
];

export const buyingMotionOptions: SelectOption<BuyingMotion>[] = [
  { label: 'Public product launch', value: 'public-launch' },
  { label: 'Enterprise buyer review', value: 'enterprise-sale' },
  { label: 'Incident readiness refresh', value: 'incident-refresh' },
];

type AudienceProfile = {
  label: string;
  score: number;
  headline: string;
  summary: string;
  assets: EvidenceAsset[];
  objections: BuyerObjection[];
  nextStep: string;
};

type MotionProfile = {
  label: string;
  scoreBoost: number;
  asset: EvidenceAsset;
  nextSteps: string[];
  handoffLead: string;
};

const audienceProfiles: Record<BuyerAudience, AudienceProfile> = {
  founder: {
    label: 'Founder-led SaaS',
    score: 67,
    headline: 'A founder-safe proof pack for launch week and early enterprise calls.',
    summary:
      'Lead with the controls a buyer can understand quickly: ownership, incident response, AI impersonation habits, and evidence that the product is operated deliberately.',
    assets: [
      {
        title: 'Security FAQ',
        detail: 'Plain-language answers for procurement, investors, and technical champions.',
        impact: 'Cuts repeated founder follow-up during sales calls.',
      },
      {
        title: 'Control owner map',
        detail: 'A one-page view of who owns auth, cloud, data retention, vendor review, and releases.',
        impact: 'Shows the team is small but accountable.',
      },
      {
        title: 'AI impersonation ritual',
        detail: 'Payment-change and executive-request verification steps the team can actually use.',
        impact: 'Addresses the fastest-growing social engineering concern.',
      },
    ],
    objections: [
      {
        question: 'Can a lean team really handle security responsibly?',
        answer:
          'Yes, when the critical controls have owners, review rhythms, and escalation paths instead of vague promises.',
        proof: 'Control owner map plus quarterly evidence log.',
      },
      {
        question: 'What happens if something suspicious happens after launch?',
        answer:
          'The first-hour runbook defines who investigates, who updates customers, and what evidence gets preserved.',
        proof: 'Incident contact tree and first-hour checklist.',
      },
      {
        question: 'How do we know customer data is treated carefully?',
        answer:
          'The packet explains data flows, retention choices, access review, and vendor boundaries in buyer-friendly language.',
        proof: 'Data handling note and vendor review summary.',
      },
    ],
    nextStep: 'Run a 45-minute proof gap review with the founder and product owner.',
  },
  agency: {
    label: 'Agency launch team',
    score: 71,
    headline: 'A client-ready trust layer for campaigns, redesigns, and handoffs.',
    summary:
      'Package security as part of launch quality: third-party scripts, DNS, analytics, CMS access, client approvals, and a clean handoff narrative.',
    assets: [
      {
        title: 'Launch surface checklist',
        detail: 'DNS, forms, analytics tags, CMS roles, dependencies, and backup posture in one review.',
        impact: 'Prevents embarrassing launch-day exposure.',
      },
      {
        title: 'Client approval brief',
        detail: 'A concise summary of risks fixed, residual decisions, and owner responsibilities.',
        impact: 'Makes security visible without slowing creative delivery.',
      },
      {
        title: 'Handoff runbook',
        detail: 'Post-launch access cleanup, monitoring checks, and escalation contacts.',
        impact: 'Reduces support churn after the site goes live.',
      },
    ],
    objections: [
      {
        question: 'Will security slow the launch timeline?',
        answer:
          'The sprint focuses on launch-blocking exposure first, then turns lower-risk items into a clean backlog.',
        proof: 'Priority risk map with must-fix and can-wait lanes.',
      },
      {
        question: 'Who owns security after agency handoff?',
        answer:
          'The handoff runbook names owners, access changes, backup checks, and escalation steps before the agency exits.',
        proof: 'Client approval brief and owner matrix.',
      },
      {
        question: 'Are third-party scripts and forms safe?',
        answer:
          'The review traces data capture, script permissions, consent behavior, and alerting for customer-facing workflows.',
        proof: 'Launch surface checklist and remediation notes.',
      },
    ],
    nextStep: 'Review the launch surface with the project lead before content freeze.',
  },
  regulated: {
    label: 'Regulated operator',
    score: 74,
    headline: 'A diligence-ready trust packet for compliance-heavy buyers and boards.',
    summary:
      'Translate operational security into evidence: policies, controls, incident readiness, vendor oversight, and leadership-facing decisions.',
    assets: [
      {
        title: 'Board risk brief',
        detail: 'Executive summary of top risks, business impact, owners, and remediation status.',
        impact: 'Turns security into an operating decision, not a technical appendix.',
      },
      {
        title: 'Control evidence index',
        detail: 'Mapped evidence for identity, logging, backups, vendor review, and incident response.',
        impact: 'Speeds audits and buyer diligence.',
      },
      {
        title: 'Vendor oversight note',
        detail: 'A clear view of key vendors, data access, review cadence, and contingency owners.',
        impact: 'Answers common regulated-environment concerns early.',
      },
    ],
    objections: [
      {
        question: 'Can this satisfy procurement or compliance reviewers?',
        answer:
          'The packet does not pretend to replace an audit; it organizes the evidence reviewers ask for first.',
        proof: 'Control evidence index and policy summary.',
      },
      {
        question: 'Is incident response more than a document?',
        answer:
          'A tabletop exercise validates decision paths, communications, and recovery dependencies before an actual event.',
        proof: 'Tabletop notes and first-hour response scorecard.',
      },
      {
        question: 'How do leaders see what matters most?',
        answer:
          'Risks are framed by business impact, owners, and next decisions so executives can fund the right fixes.',
        proof: 'Board risk brief with decision log.',
      },
    ],
    nextStep: 'Align evidence with the next audit, renewal, or board checkpoint.',
  },
};

const motionProfiles: Record<BuyingMotion, MotionProfile> = {
  'public-launch': {
    label: 'Public product launch',
    scoreBoost: 6,
    asset: {
      title: 'Launch confidence snapshot',
      detail: 'A before-go-live view of open risks, accepted decisions, and launch-safe fixes.',
      impact: 'Gives the team a confident go/no-go conversation.',
    },
    nextSteps: [
      'Confirm launch-critical data flows and public entry points.',
      'Fix the highest-risk exposure before paid traffic starts.',
    ],
    handoffLead: 'For the launch room',
  },
  'enterprise-sale': {
    label: 'Enterprise buyer review',
    scoreBoost: 11,
    asset: {
      title: 'Procurement answer bank',
      detail: 'Reusable answers for security questionnaires, customer calls, and legal review.',
      impact: 'Keeps diligence from stalling the deal.',
    },
    nextSteps: [
      'Collect the top ten buyer security questions already appearing in sales.',
      'Package evidence next to each answer so champions can forward it internally.',
    ],
    handoffLead: 'For the sales champion',
  },
  'incident-refresh': {
    label: 'Incident readiness refresh',
    scoreBoost: 8,
    asset: {
      title: 'First-hour response card',
      detail: 'Who decides, who investigates, who communicates, and what gets preserved first.',
      impact: 'Reduces panic when a suspicious event becomes customer-visible.',
    },
    nextSteps: [
      'Rehearse escalation with engineering, support, leadership, and communications owners.',
      'Update templates for customer notices, status posts, and internal evidence capture.',
    ],
    handoffLead: 'For the response team',
  },
};

export const defaultTrustPacketInputs: TrustPacketInputs = {
  audience: 'founder',
  motion: 'enterprise-sale',
};

export function buildTrustPacket(inputs: TrustPacketInputs): TrustPacket {
  const audience = audienceProfiles[inputs.audience];
  const motion = motionProfiles[inputs.motion];
  const score = Math.min(98, audience.score + motion.scoreBoost);
  const evidenceAssets = [motion.asset, ...audience.assets];
  const nextSteps = [...motion.nextSteps, audience.nextStep];
  const handoff = `${motion.handoffLead}: ${audience.headline} Start with ${evidenceAssets[0].title.toLowerCase()}, then share the ${evidenceAssets[1].title.toLowerCase()} and ${evidenceAssets[2].title.toLowerCase()}.`;

  return {
    audienceLabel: audience.label,
    motionLabel: motion.label,
    score,
    headline: audience.headline,
    summary: audience.summary,
    evidenceAssets,
    objections: audience.objections,
    nextSteps,
    handoff,
  };
}
