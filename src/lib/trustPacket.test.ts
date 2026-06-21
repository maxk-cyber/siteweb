import { describe, expect, it } from 'vitest';
import { buildTrustPacket, defaultTrustPacketInputs } from './trustPacket';

describe('buildTrustPacket', () => {
  it('builds a default enterprise-ready founder packet', () => {
    const packet = buildTrustPacket(defaultTrustPacketInputs);

    expect(packet.score).toBe(78);
    expect(packet.audienceLabel).toBe('Founder-led SaaS');
    expect(packet.motionLabel).toBe('Enterprise buyer review');
    expect(packet.evidenceAssets.map((asset) => asset.title)).toEqual([
      'Procurement answer bank',
      'Security FAQ',
      'Control owner map',
      'AI impersonation ritual',
    ]);
    expect(packet.handoff).toContain('For the sales champion');
  });

  it('tailors proof for regulated incident readiness', () => {
    const packet = buildTrustPacket({
      audience: 'regulated',
      motion: 'incident-refresh',
    });

    expect(packet.score).toBe(82);
    expect(packet.headline).toMatch(/compliance-heavy buyers and boards/i);
    expect(packet.evidenceAssets[0].title).toBe('First-hour response card');
    expect(packet.nextSteps).toContain(
      'Align evidence with the next audit, renewal, or board checkpoint.',
    );
  });
});
