import { signals } from '../data/siteContent';
import { useIterator } from '../lib/useIterator';

export function SignalCarousel() {
  const signalIterator = useIterator(signals);
  const signal = signalIterator.current;

  return (
    <section className="section signal-section" aria-labelledby="signals-title">
      <div className="section-copy">
        <p className="eyebrow">Market Signals</p>
        <h2 id="signals-title">Security pressure points your customers already care about.</h2>
        <p>
          Browse the trust risks shaping modern launches and shuffle to pressure-test what your next
          campaign should address first.
        </p>
      </div>

      <div className="signal-shell">
        <article className="signal-card">
          <div className="signal-topline">
            <span>{signal.eyebrow}</span>
            <strong>{signal.urgency}</strong>
          </div>
          <h3>{signal.title}</h3>
          <p>{signal.summary}</p>
          <div className="payoff">
            <span>Market payoff</span>
            <strong>{signal.payoff}</strong>
          </div>
        </article>

        <div className="carousel-controls" aria-label="Signal carousel controls">
          <button className="icon-button" type="button" onClick={signalIterator.previous}>
            Previous
          </button>
          <button className="icon-button" type="button" onClick={signalIterator.next}>
            Next
          </button>
          <button className="button button-secondary" type="button" onClick={signalIterator.shuffle}>
            Shuffle signal
          </button>
        </div>

        <div className="signal-tabs" role="tablist" aria-label="Choose market signal">
          {signals.map((item, index) => (
            <button
              aria-selected={signal.id === item.id}
              className={signal.id === item.id ? 'active' : ''}
              key={item.id}
              onClick={() => signalIterator.goTo(index)}
              role="tab"
              type="button"
            >
              {item.eyebrow}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
