import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  defaultValidationInputs,
  validateLaunch,
  type AuthProfile,
  type DataProfile,
  type LaunchValidationInputs,
} from '../lib/siteValidator';

type LaunchValidatorProps = {
  clipboard?: Pick<Clipboard, 'writeText'>;
};

const dataOptions: Array<{ label: string; value: DataProfile }> = [
  { label: 'No customer data', value: 'none' },
  { label: 'Basic customer data', value: 'basic' },
  { label: 'Regulated or sensitive data', value: 'regulated' },
];

const authOptions: Array<{ label: string; value: AuthProfile }> = [
  { label: 'No login', value: 'none' },
  { label: 'Password login', value: 'password' },
  { label: 'SSO/MFA for privileged users', value: 'sso-mfa' },
];

export function LaunchValidator({ clipboard: clipboardClient }: LaunchValidatorProps = {}) {
  const [inputs, setInputs] = useState<LaunchValidationInputs>(defaultValidationInputs);
  const [copyStatus, setCopyStatus] = useState('Copy validation');
  const result = useMemo(() => validateLaunch(inputs), [inputs]);

  const updateInput = <Key extends keyof LaunchValidationInputs>(
    key: Key,
    value: LaunchValidationInputs[Key],
  ) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopyStatus('Copy validation');
  };

  const copyValidation = async () => {
    const clipboard = clipboardClient ?? window.navigator.clipboard;

    if (!clipboard) {
      setCopyStatus('Validation ready');
      return;
    }

    await clipboard.writeText(result.summary);
    setCopyStatus('Copied');
  };

  return (
    <section id="validator" className="section validator-section" aria-labelledby="validator-title">
      <div className="section-copy">
        <p className="eyebrow">Launch Validator</p>
        <h2 id="validator-title">Validate the public proof before buyers find the gaps.</h2>
        <p>
          Enter the real launch URL and contact details to catch obvious blockers, confirm buyer
          proof URLs, and create a shareable validation summary.
        </p>
      </div>

      <div className="validator-card">
        <div className="validator-grid">
          <label className="field" htmlFor="product-url">
            <span>Product URL</span>
            <input
              id="product-url"
              value={inputs.productUrl}
              onChange={(event) => updateInput('productUrl', event.target.value)}
              placeholder="https://app.company.com"
            />
          </label>

          <label className="field" htmlFor="security-email">
            <span>Security contact</span>
            <input
              id="security-email"
              value={inputs.securityEmail}
              onChange={(event) => updateInput('securityEmail', event.target.value)}
              placeholder="security@company.com"
            />
          </label>

          <label className="field" htmlFor="data-profile">
            <span>Data profile</span>
            <select
              id="data-profile"
              value={inputs.dataProfile}
              onChange={(event) => updateInput('dataProfile', event.target.value as DataProfile)}
            >
              {dataOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="auth-profile">
            <span>Authentication</span>
            <select
              id="auth-profile"
              value={inputs.authProfile}
              onChange={(event) => updateInput('authProfile', event.target.value as AuthProfile)}
            >
              {authOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="privacy-toggle" htmlFor="privacy-page">
            <input
              checked={inputs.hasPrivacyPage}
              id="privacy-page"
              onChange={(event) => updateInput('hasPrivacyPage', event.target.checked)}
              type="checkbox"
            />
            <span>Privacy page is published and linked from the product</span>
          </label>
        </div>

        <div className="validation-result" aria-live="polite">
          <div
            className="validation-meter"
            style={{ '--validation-score': `${result.score}%` } as CSSProperties}
          >
            <span>{result.score}</span>
            <small>/100</small>
          </div>
          <div>
            <p className={`validation-status ${result.status.toLowerCase().replaceAll(' ', '-')}`}>
              {result.status}
            </p>
            <h3>{result.host}</h3>
            <p>{result.normalizedUrl}</p>
          </div>
        </div>

        <div className="validation-columns">
          <div className="issue-panel">
            <h3>Blocking Issues</h3>
            {result.issues.length === 0 ? (
              <p>No blocking validation issues found. Keep the proof URLs current.</p>
            ) : (
              <ul>
                {result.issues.map((issue) => (
                  <li key={`${issue.severity}-${issue.message}`}>
                    <strong>{issue.severity}</strong>
                    <span>{issue.message}</span>
                    <small>{issue.fix}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="proof-url-panel">
            <h3>Proof URLs</h3>
            <ul>
              {result.proofUrls.map((url) => (
                <li key={url}>{url}</li>
              ))}
            </ul>
          </div>
        </div>

        <button className="button button-primary" type="button" onClick={copyValidation}>
          {copyStatus}
        </button>
      </div>
    </section>
  );
}
