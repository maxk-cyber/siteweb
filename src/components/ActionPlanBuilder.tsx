import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import {
  buildActionPlan,
  calculatePlanProgress,
  formatActionPlanMarkdown,
  scenarioOptions,
  type ActionPlanItem,
  type CustomActionPlanItem,
  type PlanScenario,
} from '../lib/actionPlan';

const STORAGE_KEY = 'maxk-cyber-action-plan-v1';

type StorageClient = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

type PersistedPlanState = {
  scenario: PlanScenario;
  completedIds: string[];
  customItems: CustomActionPlanItem[];
};

type ActionPlanBuilderProps = {
  clipboard?: Pick<Clipboard, 'writeText'>;
  storage?: StorageClient;
};

const defaultState: PersistedPlanState = {
  scenario: 'enterprise',
  completedIds: [],
  customItems: [],
};

export function ActionPlanBuilder({
  clipboard: clipboardClient,
  storage: storageClient,
}: ActionPlanBuilderProps = {}) {
  const storage = storageClient ?? window.localStorage;
  const [state, setState] = useState<PersistedPlanState>(() => loadPlanState(storage));
  const [customTitle, setCustomTitle] = useState('');
  const [status, setStatus] = useState('Saved locally');
  const plan = useMemo(() => buildActionPlan(state.scenario), [state.scenario]);
  const allItems = useMemo<ActionPlanItem[]>(
    () => [...plan.items, ...state.customItems],
    [plan.items, state.customItems],
  );
  const completedIds = useMemo(
    () => state.completedIds.filter((id) => allItems.some((item) => item.id === id)),
    [allItems, state.completedIds],
  );
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const progress = calculatePlanProgress(allItems.length, completedIds.length);
  const planMarkdown = formatActionPlanMarkdown(plan, allItems, completedIds);

  useEffect(() => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ ...state, completedIds }));
  }, [completedIds, state, storage]);

  const updateScenario = (scenario: PlanScenario) => {
    setState((current) => ({
      ...current,
      scenario,
      completedIds: current.completedIds.filter((id) => id.startsWith('custom-')),
    }));
    setStatus('Scenario updated');
  };

  const toggleItem = (itemId: string) => {
    setState((current) => {
      const isComplete = current.completedIds.includes(itemId);
      const completed = isComplete
        ? current.completedIds.filter((id) => id !== itemId)
        : [...current.completedIds, itemId];

      return { ...current, completedIds: completed };
    });
    setStatus('Progress saved');
  };

  const addCustomItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = customTitle.trim();

    if (!title) {
      return;
    }

    const customItem: CustomActionPlanItem = {
      id: `custom-${Date.now()}`,
      title,
      category: 'Custom',
      priority: 'Medium',
      owner: 'Team owner',
      evidence: 'Internal note',
      why: 'Added by the visitor to match their launch reality.',
      custom: true,
    };

    setState((current) => ({
      ...current,
      customItems: [...current.customItems, customItem],
    }));
    setCustomTitle('');
    setStatus('Custom task added');
  };

  const copyPlan = async () => {
    const clipboard = clipboardClient ?? window.navigator.clipboard;

    if (!clipboard) {
      setStatus('Plan ready to copy');
      return;
    }

    await clipboard.writeText(planMarkdown);
    setStatus('Plan copied');
  };

  const downloadPlan = () => {
    const blob = new Blob([planMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${plan.scenario}-security-action-plan.md`;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setStatus('Markdown downloaded');
  };

  const resetPlan = () => {
    storage.removeItem(STORAGE_KEY);
    setState(defaultState);
    setCustomTitle('');
    setStatus('Plan reset');
  };

  return (
    <section id="action-plan" className="section planner-section" aria-labelledby="action-plan-title">
      <div className="section-copy">
        <p className="eyebrow">Action Plan Builder</p>
        <h2 id="action-plan-title">Build a security plan you can actually execute.</h2>
        <p>
          Pick a buying or launch scenario, track progress, add team-specific work, and export the
          plan as Markdown for Slack, Notion, GitHub issues, or a client handoff.
        </p>
      </div>

      <div className="planner-card">
        <div className="planner-controls">
          <label className="field" htmlFor="plan-scenario">
            <span>Plan scenario</span>
            <select
              id="plan-scenario"
              value={state.scenario}
              onChange={(event) => updateScenario(event.target.value as PlanScenario)}
            >
              {scenarioOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="plan-summary" aria-live="polite">
            <div
              className="plan-meter"
              style={{ '--plan-progress': `${progress}%` } as CSSProperties}
            >
              <span>{progress}%</span>
            </div>
            <div>
              <p className="tier">{plan.label}</p>
              <h3>{plan.outcome}</h3>
              <small>{status}</small>
            </div>
          </div>
        </div>

        <div className="task-list" aria-label="Security action plan tasks">
          {allItems.map((item) => {
            const isComplete = completedSet.has(item.id);

            return (
              <label className={`task-card ${isComplete ? 'done' : ''}`} key={item.id}>
                <input
                  checked={isComplete}
                  onChange={() => toggleItem(item.id)}
                  type="checkbox"
                />
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {item.priority} / {item.category} / {item.owner}
                  </small>
                  <em>{item.why}</em>
                  <b>Evidence: {item.evidence}</b>
                </span>
              </label>
            );
          })}
        </div>

        <form className="custom-task-form" onSubmit={addCustomItem}>
          <label className="field" htmlFor="custom-task">
            <span>Add a custom task</span>
            <input
              id="custom-task"
              placeholder="Example: Review Stripe webhook signing secret"
              value={customTitle}
              onChange={(event) => setCustomTitle(event.target.value)}
            />
          </label>
          <button className="button button-primary" type="submit">
            Add task
          </button>
        </form>

        <div className="planner-actions">
          <button className="button button-secondary" type="button" onClick={copyPlan}>
            Copy Markdown
          </button>
          <button className="button button-secondary" type="button" onClick={downloadPlan}>
            Download plan
          </button>
          <button className="button button-ghost" type="button" onClick={resetPlan}>
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

function loadPlanState(storage: StorageClient): PersistedPlanState {
  const saved = storage.getItem(STORAGE_KEY);

  if (!saved) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(saved) as PersistedPlanState;
    const scenario = scenarioOptions.some((option) => option.value === parsed.scenario)
      ? parsed.scenario
      : defaultState.scenario;

    return {
      scenario,
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      customItems: Array.isArray(parsed.customItems) ? parsed.customItems : [],
    };
  } catch {
    return defaultState;
  }
}
