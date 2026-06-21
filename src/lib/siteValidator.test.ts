import { describe, expect, it } from 'vitest';
import { defaultValidationInputs, validateLaunch } from './siteValidator';

describe('validateLaunch', () => {
  it('accepts a production-looking HTTPS launch with aligned security contact', () => {
    const result = validateLaunch(defaultValidationInputs);

    expect(result.status).toBe('Valid launch candidate');
    expect(result.score).toBe(100);
    expect(result.proofUrls).toContain('https://maxk-cyber.com/.well-known/security.txt');
  });

  it('blocks invalid, private, or under-secured launch inputs', () => {
    const result = validateLaunch({
      productUrl: 'http://localhost:3000?token=abc',
      securityEmail: 'not-an-email',
      dataProfile: 'regulated',
      authProfile: 'none',
      hasPrivacyPage: false,
    });

    expect(result.status).toBe('Blocked');
    expect(result.score).toBeLessThan(30);
    expect(result.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        'The launch URL is not HTTPS.',
        'The launch URL looks private, local, or placeholder-only.',
        'The security contact email is not valid.',
        'Customer data is in scope, but authentication is not.',
      ]),
    );
  });

  it('flags mismatched security contact domains without blocking the launch', () => {
    const result = validateLaunch({
      ...defaultValidationInputs,
      productUrl: 'https://app.maxk-cyber.com',
      securityEmail: 'security@vendor.com',
    });

    expect(result.status).toBe('Needs work');
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: 'Medium',
        message: 'The security contact domain does not align with the launch domain.',
      }),
    );
  });
});
