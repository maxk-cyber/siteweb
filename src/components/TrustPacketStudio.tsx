import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  audienceOptions,
  buildTrustPacket,
  buyingMotionOptions,
  defaultTrustPacketInputs,
  type BuyerAudience,
  type BuyingMotion,
  type SelectOption,
  type TrustPacketInputs,
} from '../lib/trustPacket';
import { useIterator } from '../lib/useIterator';

type TrustPacketStudioProps = {
  clipboard?: Pick<Clipboard, 'writeText'>;
};

export function TrustPacketStudio({ clipboard: clipboardClient }: TrustPacketStudioProps = {}) {
  const [inputs, setInputs] = useState<TrustPacketInputs>(defaultTrustPacketInputs);
  const [copyStatus, setCopyStatus] = useState('Copy handoff');
  const packet = useMemo(() => buildTrustPacket(inputs), [inputs]);
  const objectionIterator = useIterator(packet.objections);
  const objection = objectionIterator.current;

  const updateInput = <Key extends keyof TrustPacketInputs>(
    key: Key,
    value: TrustPacketInputs[Key],
  ) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopyStatus('Copy handoff');
  };

  const copyHandoff = async () => {
    const clipboard = clipboardClient ?? window.navigator.clipboard;

    if (!clipboard) {
      setCopyStatus('Handoff ready');
      return;
    }

    await clipboard.writeText(packet.handoff);
    setCopyStatus('Copied');
  };

  return (
    <section id="proof-studio" className="section trust-studio" aria-labelledby="proof-studio-title">
      <div className="section-copy">
        <p className="eyebrow">Trust Packet Studio</p>
        <h2 id="proof-studio-title">Turn buyer anxiety into proof they can forward.</h2>
        <p>
          Choose the audience and buying moment to generate the evidence bundle, objection answers,
          and next actions most likely to keep a security review moving.
        </p>
      </div>

      <div className="studio-card">
        <div className="studio-controls">
          <StudioSelect
            id="audience"
            label="Buyer audience"
            options={audienceOptions}
            value={inputs.audience}
            onChange={(value) => updateInput('audience', value)}
          />
          <StudioSelect
            id="motion"
            label="Buying moment"
            options={buyingMotionOptions}
            value={inputs.motion}
            onChange={(value) => updateInput('motion', value)}
          />
        </div>

        <div className="packet-hero" aria-live="polite">
          <div
            className="packet-meter"
            style={{ '--packet-score': `${packet.score}%` } as CSSProperties}
          >
            <span>{packet.score}</span>
            <small>proof fit</small>
          </div>
          <div>
            <p className="tier">
              {packet.audienceLabel} / {packet.motionLabel}
            </p>
            <h3>{packet.headline}</h3>
            <p>{packet.summary}</p>
          </div>
        </div>

        <div className="asset-grid" aria-label="Recommended evidence assets">
          {packet.evidenceAssets.map((asset) => (
            <article className="asset-card" key={asset.title}>
              <span>{asset.impact}</span>
              <h4>{asset.title}</h4>
              <p>{asset.detail}</p>
            </article>
          ))}
        </div>

        <div className="objection-panel">
          <div>
            <p className="step-count">
              Objection {objectionIterator.index + 1} of {objectionIterator.count}
            </p>
            <h3>{objection.question}</h3>
            <p>{objection.answer}</p>
            <strong>{objection.proof}</strong>
          </div>

          <div className="flow-controls">
            <button className="button button-secondary" type="button" onClick={objectionIterator.previous}>
              Previous concern
            </button>
            <button className="button button-primary" type="button" onClick={objectionIterator.next}>
              Next concern
            </button>
          </div>
        </div>

        <div className="handoff-panel">
          <div>
            <p className="eyebrow">What Happens Next</p>
            <ol>
              {packet.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <button className="button button-secondary" type="button" onClick={copyHandoff}>
            {copyStatus}
          </button>
        </div>
      </div>
    </section>
  );
}

type StudioSelectProps<T extends string> = {
  id: string;
  label: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

function StudioSelect<T extends BuyerAudience | BuyingMotion>({
  id,
  label,
  options,
  value,
  onChange,
}: StudioSelectProps<T>) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
