export type DataProfile = 'none' | 'basic' | 'regulated';
export type AuthProfile = 'none' | 'password' | 'sso-mfa';
export type ValidationSeverity = 'Critical' | 'High' | 'Medium';
export type ValidationStatus = 'Blocked' | 'Needs work' | 'Valid launch candidate';

export type LaunchValidationInputs = {
  productUrl: string;
  securityEmail: string;
  dataProfile: DataProfile;
  authProfile: AuthProfile;
  hasPrivacyPage: boolean;
};

export type ValidationIssue = {
  severity: ValidationSeverity;
  message: string;
  fix: string;
};

export type ValidationResult = {
  score: number;
  status: ValidationStatus;
  normalizedUrl: string;
  host: string;
  issues: ValidationIssue[];
  proofUrls: string[];
  summary: string;
};

const severityPenalty: Record<ValidationSeverity, number> = {
  Critical: 24,
  High: 15,
  Medium: 8,
};

const placeholderTlds = ['.example', '.invalid', '.localhost', '.test', '.local'];
const privateHostPatterns = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
];
const secretParamPattern = /(token|secret|password|apikey|api_key|key|session)/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const defaultValidationInputs: LaunchValidationInputs = {
  productUrl: 'https://maxk-cyber.com',
  securityEmail: 'security@maxk-cyber.com',
  dataProfile: 'basic',
  authProfile: 'password',
  hasPrivacyPage: true,
};

export function validateLaunch(inputs: LaunchValidationInputs): ValidationResult {
  const issues: ValidationIssue[] = [];
  const parsedUrl = parseUrl(inputs.productUrl);
  const normalizedUrl = parsedUrl?.toString() ?? inputs.productUrl.trim();
  const host = parsedUrl?.hostname ?? 'Invalid host';

  if (!parsedUrl) {
    issues.push({
      severity: 'Critical',
      message: 'The product URL is not valid.',
      fix: 'Enter a complete public URL, for example https://app.example.com.',
    });
  } else {
    if (parsedUrl.protocol !== 'https:') {
      issues.push({
        severity: 'Critical',
        message: 'The launch URL is not HTTPS.',
        fix: 'Serve the production site over HTTPS before collecting customer data.',
      });
    }

    if (isPlaceholderOrPrivateHost(parsedUrl.hostname)) {
      issues.push({
        severity: 'Critical',
        message: 'The launch URL looks private, local, or placeholder-only.',
        fix: 'Use the real production domain buyers and customers will visit.',
      });
    }

    if (Array.from(parsedUrl.searchParams.keys()).some((key) => secretParamPattern.test(key))) {
      issues.push({
        severity: 'High',
        message: 'The URL includes a query parameter that looks secret-like.',
        fix: 'Remove tokens, API keys, session IDs, and password-like values from shareable URLs.',
      });
    }
  }

  if (!emailPattern.test(inputs.securityEmail.trim())) {
    issues.push({
      severity: 'Critical',
      message: 'The security contact email is not valid.',
      fix: 'Use a monitored email address such as security@yourdomain.com.',
    });
  } else if (parsedUrl && !emailMatchesSite(inputs.securityEmail, parsedUrl.hostname)) {
    issues.push({
      severity: 'Medium',
      message: 'The security contact domain does not align with the launch domain.',
      fix: 'Use a same-domain or clearly owned security contact to reduce buyer confusion.',
    });
  }

  if (inputs.dataProfile !== 'none' && !inputs.hasPrivacyPage) {
    issues.push({
      severity: 'High',
      message: 'Customer data is in scope, but no privacy page is confirmed.',
      fix: 'Publish a clear privacy page before launch and link it from the product footer.',
    });
  }

  if (inputs.dataProfile === 'regulated' && inputs.authProfile !== 'sso-mfa') {
    issues.push({
      severity: 'High',
      message: 'Regulated data needs stronger authentication evidence.',
      fix: 'Require SSO/MFA for privileged workflows and document access review evidence.',
    });
  }

  if (inputs.authProfile === 'none' && inputs.dataProfile !== 'none') {
    issues.push({
      severity: 'Critical',
      message: 'Customer data is in scope, but authentication is not.',
      fix: 'Add authentication before collecting, storing, or displaying customer data.',
    });
  }

  const score = Math.max(
    0,
    100 - issues.reduce((total, issue) => total + severityPenalty[issue.severity], 0),
  );
  const status = getStatus(score, issues);
  const proofUrls = buildProofUrls(parsedUrl);
  const summary = formatValidationSummary({ score, status, normalizedUrl, host, issues, proofUrls });

  return {
    score,
    status,
    normalizedUrl,
    host,
    issues,
    proofUrls,
    summary,
  };
}

function parseUrl(value: string): URL | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
}

function isPlaceholderOrPrivateHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();

  return (
    placeholderTlds.some((suffix) => normalized.endsWith(suffix)) ||
    privateHostPatterns.some((pattern) => pattern.test(normalized))
  );
}

function emailMatchesSite(email: string, hostname: string): boolean {
  const emailDomain = email.trim().split('@')[1]?.toLowerCase();
  const siteDomain = rootDomain(hostname);

  return Boolean(emailDomain && (emailDomain === siteDomain || emailDomain.endsWith(`.${siteDomain}`)));
}

function rootDomain(hostname: string): string {
  const parts = hostname.toLowerCase().split('.').filter(Boolean);

  if (parts.length <= 2) {
    return hostname.toLowerCase();
  }

  return parts.slice(-2).join('.');
}

function getStatus(score: number, issues: ValidationIssue[]): ValidationStatus {
  if (issues.some((issue) => issue.severity === 'Critical')) {
    return 'Blocked';
  }

  if (issues.length > 0 || score < 86) {
    return 'Needs work';
  }

  return 'Valid launch candidate';
}

function buildProofUrls(parsedUrl: URL | null): string[] {
  if (!parsedUrl) {
    return [];
  }

  const origin = parsedUrl.origin;

  return [
    `${origin}/.well-known/security.txt`,
    `${origin}/privacy`,
    `${origin}/security`,
    `${origin}/status`,
  ];
}

function formatValidationSummary(result: Omit<ValidationResult, 'summary'>): string {
  const issues =
    result.issues.length === 0
      ? ['No blocking validation issues found.']
      : result.issues.map((issue) => `${issue.severity}: ${issue.message} Fix: ${issue.fix}`);

  return [
    `Launch validation for ${result.normalizedUrl}`,
    `Status: ${result.status} (${result.score}/100)`,
    `Host: ${result.host}`,
    '',
    'Issues:',
    ...issues.map((issue) => `- ${issue}`),
    '',
    'Proof URLs to publish or verify:',
    ...(result.proofUrls.length > 0 ? result.proofUrls.map((url) => `- ${url}`) : ['- Add a valid public URL first.']),
  ].join('\n');
}
