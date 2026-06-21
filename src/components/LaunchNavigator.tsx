import { launchSteps } from '../data/siteContent';
import { useIterator } from '../lib/useIterator';

export function LaunchNavigator() {
  const stepIterator = useIterator(launchSteps);
  const step = stepIterator.current;

  return (
    <section className="section launch-flow" aria-labelledby="flow-title">
      <div className="section-copy">
        <p className="eyebrow">Guided Engagement</p>
        <h2 id="flow-title">A practical path from launch anxiety to buyer confidence.</h2>
      </div>

      <div className="flow-card">
        <div className="flow-progress" aria-hidden="true">
          {launchSteps.map((item, index) => (
            <button
              className={stepIterator.index === index ? 'current' : ''}
              key={item.title}
              onClick={() => stepIterator.goTo(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="flow-body">
          <p className="step-count">
            Step {stepIterator.index + 1} of {stepIterator.count}
          </p>
          <h3>{step.title}</h3>
          <p>{step.detail}</p>
          <strong>{step.action}</strong>
        </div>

        <div className="flow-controls">
          <button className="button button-secondary" type="button" onClick={stepIterator.previous}>
            Back
          </button>
          <button className="button button-primary" type="button" onClick={stepIterator.next}>
            Next step
          </button>
        </div>
      </div>
    </section>
  );
}
