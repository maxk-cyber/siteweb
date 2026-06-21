export type Signal = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  urgency: 'High' | 'Rising' | 'Evergreen';
  payoff: string;
};

export type Service = {
  title: string;
  description: string;
  outcomes: string[];
};

export type ProofPoint = {
  value: string;
  label: string;
};

export type LaunchStep = {
  title: string;
  detail: string;
  action: string;
};

export const proofPoints: ProofPoint[] = [
  { value: '72h', label: 'to first risk map' },
  { value: '4x', label: 'faster buyer trust review prep' },
  { value: '0', label: 'security theater deliverables' },
];

export const signals: Signal[] = [
  {
    id: 'ai-impersonation',
    eyebrow: 'AI Impersonation',
    title: 'Spoofed founders and finance leads are the new phishing front door.',
    summary:
      'Teams need lightweight verification rituals, inbox hardening, and response playbooks before a deepfake or cloned voice becomes an invoice approval.',
    urgency: 'High',
    payoff: 'Protects cash movement and executive trust.',
  },
  {
    id: 'supply-chain',
    eyebrow: 'Vendor Exposure',
    title: 'Customers increasingly ask for proof before they buy.',
    summary:
      'A clean security packet, dependency review, and incident narrative help small teams pass diligence without slowing the sales cycle.',
    urgency: 'Rising',
    payoff: 'Shortens procurement and reassures enterprise buyers.',
  },
  {
    id: 'cloud-drift',
    eyebrow: 'Cloud Drift',
    title: 'Fast launches create quiet privilege and storage mistakes.',
    summary:
      'Cloud posture reviews catch public buckets, stale admin access, missing MFA, and logging gaps before they become screenshots on social feeds.',
    urgency: 'High',
    payoff: 'Turns launch velocity into safer operating rhythm.',
  },
  {
    id: 'incident-readiness',
    eyebrow: 'Incident Readiness',
    title: 'A written plan beats panic when customers start asking questions.',
    summary:
      'Clear escalation, status-page copy, evidence capture, and recovery checklists reduce chaos during the first hour of a suspected breach.',
    urgency: 'Evergreen',
    payoff: 'Preserves trust when response speed matters most.',
  },
];

export const services: Service[] = [
  {
    title: 'Launch Hardening Sprint',
    description:
      'A focused review of the web app, cloud surface, analytics scripts, DNS, auth, and release workflow before a public launch.',
    outcomes: ['Priority risk map', 'Fix-ready remediation list', 'Executive launch brief'],
  },
  {
    title: 'Trust Packet Builder',
    description:
      'A buyer-ready security story with policies, controls, incident language, and evidence that helps founders move through procurement.',
    outcomes: ['Security FAQ', 'Control summary', 'Reusable diligence answers'],
  },
  {
    title: 'Response Tabletop',
    description:
      'A realistic incident simulation that gives teams escalation muscle memory and customer-facing communication templates.',
    outcomes: ['Role-based runbook', 'First-hour checklist', 'Post-incident improvement backlog'],
  },
];

export const launchSteps: LaunchStep[] = [
  {
    title: 'Map the blast radius',
    detail: 'Identify crown-jewel workflows, third-party scripts, cloud entry points, and trust-critical customer promises.',
    action: 'Create a shared risk canvas',
  },
  {
    title: 'Fix what buyers notice',
    detail: 'Prioritize controls that reduce real risk and answer the security questions prospects ask before signing.',
    action: 'Ship the top five remediations',
  },
  {
    title: 'Package the proof',
    detail: 'Turn hardening work into crisp evidence, screenshots, policies, and plain-language answers for sales and support.',
    action: 'Publish a trust packet',
  },
  {
    title: 'Practice the bad day',
    detail: 'Rehearse escalation, customer updates, containment, recovery, and follow-up before adrenaline enters the room.',
    action: 'Run a tabletop drill',
  },
];
