import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  buildQuestionnairePack,
  defaultQuestionnaireInputs,
  evidenceMaturityOptions,
  formatQuestionnaireAnswerMarkdown,
  questionCategoryOptions,
  reviewAudienceOptions,
  type EvidenceMaturity,
  type QuestionCategory,
  type QuestionnaireAnswer,
  type QuestionnaireInputs,
  type QuestionnairePack,
  type ReviewAudience,
  type SelectOption,
} from '../lib/questionnaire';
import { useIterator } from '../lib/useIterator';

type QuestionnaireAnswerDeskProps = {
  clipboard?: Pick<Clipboard, 'writeText'>;
};

export function QuestionnaireAnswerDesk({
  clipboard: clipboardClient,
}: QuestionnaireAnswerDeskProps = {}) {
  const [inputs, setInputs] = useState<QuestionnaireInputs>(defaultQuestionnaireInputs);
  const [copyStatus, setCopyStatus] = useState('Copy answer pack');
  const pack = useMemo(() => buildQuestionnairePack(inputs), [inputs]);

  const updateInput = <Key extends keyof QuestionnaireInputs>(
    key: Key,
    value: QuestionnaireInputs[Key],
  ) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopyStatus('Copy answer pack');
  };

  const copyPack = async () => {
    const clipboard = clipboardClient ?? window.navigator.clipboard;

    if (!clipboard) {
      setCopyStatus('Pack ready');
      return;
    }

    await clipboard.writeText(pack.markdown);
    setCopyStatus('Pack copied');
  };

  return (
    <section id="answer-desk" className="section answer-desk" aria-labelledby="answer-desk-title">
      <div className="section-copy">
        <p className="eyebrow">Questionnaire Answer Desk</p>
        <h2 id="answer-desk-title">Generate the answers buyers ask for before the deal stalls.</h2>
        <p>
          Build a lightweight security-review answer pack with traceable evidence, owners, and next
          steps. Browse common buyer questions, shuffle concerns, and copy the exact answer or the
          full packet.
        </p>
      </div>

      <div className="answer-desk-card">
        <div className="answer-controls">
          <AnswerSelect
            id="review-audience"
            label="Review audience"
            options={reviewAudienceOptions}
            value={inputs.audience}
            onChange={(value) => updateInput('audience', value)}
          />
          <AnswerSelect
            id="evidence-maturity"
            label="Evidence maturity"
            options={evidenceMaturityOptions}
            value={inputs.evidenceMaturity}
            onChange={(value) => updateInput('evidenceMaturity', value)}
          />
          <AnswerSelect
            id="question-focus"
            label="Question focus"
            options={questionCategoryOptions}
            value={inputs.category}
            onChange={(value) => updateInput('category', value)}
          />
        </div>

        <div className="answer-pack-summary" aria-live="polite">
          <div
            className="answer-pack-meter"
            style={{ '--answer-pack-score': `${pack.score}%` } as CSSProperties}
          >
            <span>{pack.score}</span>
            <small>/100</small>
          </div>
          <div>
            <p className="tier">
              {pack.label} / {pack.categoryLabel}
            </p>
            <h3>{pack.headline}</h3>
            <p>{pack.summary}</p>
          </div>
          <button className="button button-primary" type="button" onClick={copyPack}>
            {copyStatus}
          </button>
        </div>

        <AnswerDeck
          key={`${inputs.audience}-${inputs.evidenceMaturity}-${inputs.category}`}
          clipboard={clipboardClient}
          pack={pack}
        />
      </div>
    </section>
  );
}

type AnswerDeckProps = {
  clipboard?: Pick<Clipboard, 'writeText'>;
  pack: QuestionnairePack;
};

function AnswerDeck({ clipboard: clipboardClient, pack }: AnswerDeckProps) {
  const answerIterator = useIterator(pack.answers);
  const answer = answerIterator.current;
  const [answerStatus, setAnswerStatus] = useState('Copy answer');

  const copyAnswer = async (currentAnswer: QuestionnaireAnswer) => {
    const clipboard = clipboardClient ?? window.navigator.clipboard;

    if (!clipboard) {
      setAnswerStatus('Answer ready');
      return;
    }

    await clipboard.writeText(formatQuestionnaireAnswerMarkdown(currentAnswer));
    setAnswerStatus('Answer copied');
  };

  const move = (action: () => void) => {
    action();
    setAnswerStatus('Copy answer');
  };

  return (
    <div className="answer-workspace">
      <article className="question-card">
        <div className="question-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="question-meta">
          <span>{answer.category.replace('-', ' ')}</span>
          <strong>{answer.confidence}/100 confidence</strong>
        </div>
        <p className="step-count">
          Question {answerIterator.index + 1} of {answerIterator.count}
        </p>
        <h3>{answer.question}</h3>
        <p>{answer.answer}</p>

        <div className="answer-evidence">
          <div>
            <span>Evidence</span>
            <strong>{answer.evidence}</strong>
          </div>
          <div>
            <span>Trust center asset</span>
            <strong>{answer.trustCenterAsset}</strong>
          </div>
          <div>
            <span>Owner</span>
            <strong>{answer.owner}</strong>
          </div>
          <div>
            <span>Next step</span>
            <strong>{answer.nextStep}</strong>
          </div>
        </div>

        <div className="answer-actions">
          <button className="button button-secondary" type="button" onClick={() => move(answerIterator.previous)}>
            Previous answer
          </button>
          <button className="button button-secondary" type="button" onClick={() => move(answerIterator.shuffle)}>
            Shuffle concern
          </button>
          <button className="button button-primary" type="button" onClick={() => copyAnswer(answer)}>
            {answerStatus}
          </button>
          <button className="button button-secondary" type="button" onClick={() => move(answerIterator.next)}>
            Next answer
          </button>
        </div>
      </article>

      <div className="trust-center-rail" aria-label="Trust center assets to publish">
        <h3>Trust Center Assets</h3>
        <p>Publish these self-serve proof assets to deflect repetitive security review questions.</p>
        <ul>
          {pack.trustCenterAssets.map((asset) => (
            <li key={asset}>{asset}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type AnswerSelectProps<T extends string> = {
  id: string;
  label: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

function AnswerSelect<T extends ReviewAudience | EvidenceMaturity | QuestionCategory>({
  id,
  label,
  options,
  value,
  onChange,
}: AnswerSelectProps<T>) {
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
