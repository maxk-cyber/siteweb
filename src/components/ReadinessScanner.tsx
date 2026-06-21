import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  calculateReadiness,
  defaultAnswers,
  type CloudFootprint,
  type CompanyStage,
  type IncidentPlan,
  type ReadinessAnswers,
  type SecurityMaturity,
  type TrainingCadence,
} from '../lib/readiness';

type Option<T extends string> = {
  label: string;
  value: T;
};

const stageOptions: Option<CompanyStage>[] = [
  { label: 'Solo builder', value: 'solo' },
  { label: 'Startup team', value: 'startup' },
  { label: 'Scaling company', value: 'scaleup' },
];

const maturityOptions: Option<SecurityMaturity>[] = [
  { label: 'Ad hoc', value: 'ad-hoc' },
  { label: 'Documented', value: 'documented' },
  { label: 'Measured', value: 'measured' },
];

const incidentOptions: Option<IncidentPlan>[] = [
  { label: 'No plan', value: 'none' },
  { label: 'Draft plan', value: 'draft' },
  { label: 'Tested plan', value: 'tested' },
];

const cloudOptions: Option<CloudFootprint>[] = [
  { label: 'Simple web stack', value: 'simple' },
  { label: 'Multi-service cloud', value: 'multi-service' },
  { label: 'Regulated data', value: 'regulated' },
];

const trainingOptions: Option<TrainingCadence>[] = [
  { label: 'Rarely', value: 'never' },
  { label: 'Annually', value: 'annual' },
  { label: 'Quarterly', value: 'quarterly' },
];

type ReadinessScannerProps = {
  clipboard?: Pick<Clipboard, 'writeText'>;
};

export function ReadinessScanner({ clipboard: clipboardClient }: ReadinessScannerProps = {}) {
  const [answers, setAnswers] = useState<ReadinessAnswers>(defaultAnswers);
  const [copyStatus, setCopyStatus] = useState('Copy share summary');
  const result = useMemo(() => calculateReadiness(answers), [answers]);

  const updateAnswer = <Key extends keyof ReadinessAnswers>(
    key: Key,
    value: ReadinessAnswers[Key],
  ) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setCopyStatus('Copy share summary');
  };

  const shareSummary = `${result.tier} (${result.score}/100): ${result.headline} ${result.recommendation}`;

  const copySummary = async () => {
    const clipboard = clipboardClient ?? window.navigator.clipboard;

    if (!clipboard) {
      setCopyStatus('Summary ready to copy');
      return;
    }

    await clipboard.writeText(shareSummary);
    setCopyStatus('Copied');
  };

  return (
    <section className="scanner-card" aria-labelledby="scanner-title">
      <div className="scanner-heading">
        <p className="eyebrow">Interactive Trust Scan</p>
        <h2 id="scanner-title">Find the security story your buyers will believe.</h2>
        <p>
          Tune the signals below to get an instant readiness score, priority focus areas, and a
          shareable summary for your team.
        </p>
      </div>

      <div className="scanner-grid">
        <SelectField
          id="stage"
          label="Company stage"
          value={answers.stage}
          options={stageOptions}
          onChange={(value) => updateAnswer('stage', value)}
        />
        <SelectField
          id="maturity"
          label="Security maturity"
          value={answers.maturity}
          options={maturityOptions}
          onChange={(value) => updateAnswer('maturity', value)}
        />
        <SelectField
          id="incidentPlan"
          label="Incident plan"
          value={answers.incidentPlan}
          options={incidentOptions}
          onChange={(value) => updateAnswer('incidentPlan', value)}
        />
        <SelectField
          id="cloudFootprint"
          label="Cloud footprint"
          value={answers.cloudFootprint}
          options={cloudOptions}
          onChange={(value) => updateAnswer('cloudFootprint', value)}
        />
        <SelectField
          id="trainingCadence"
          label="Security habits"
          value={answers.trainingCadence}
          options={trainingOptions}
          onChange={(value) => updateAnswer('trainingCadence', value)}
        />
      </div>

      <div className="score-panel" aria-live="polite">
        <div className="score-ring" style={{ '--score': `${result.score}%` } as CSSProperties}>
          <span>{result.score}</span>
          <small>/100</small>
        </div>
        <div>
          <p className="tier">{result.tier}</p>
          <h3>{result.headline}</h3>
          <p>{result.recommendation}</p>
        </div>
      </div>

      <ul className="focus-list" aria-label="Recommended focus areas">
        {result.focusAreas.map((focusArea) => (
          <li key={focusArea}>{focusArea}</li>
        ))}
      </ul>

      <button className="button button-secondary" type="button" onClick={copySummary}>
        {copyStatus}
      </button>
    </section>
  );
}

type SelectFieldProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

function SelectField<T extends string>({ id, label, value, options, onChange }: SelectFieldProps<T>) {
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
