import { LaunchNavigator } from './components/LaunchNavigator';
import { ReadinessScanner } from './components/ReadinessScanner';
import { SignalCarousel } from './components/SignalCarousel';
import { proofPoints, services } from './data/siteContent';
import './styles.css';

function App() {
  return (
    <main>
      <section className="hero">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="MaxK Cyber home">
            <span>MK</span>
            MaxK Cyber
          </a>
          <div className="nav-links">
            <a href="#signals">Signals</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div id="top" className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Launch-Ready Security for Fast Teams</p>
            <h1>Make your next web launch feel safer, sharper, and easier to trust.</h1>
            <p className="hero-lede">
              MaxK Cyber turns practical hardening, incident readiness, and buyer-facing proof into
              a momentum asset for founders, agencies, and growth teams.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#scanner">
                Run the trust scan
              </a>
              <a className="button button-ghost" href="#services">
                Explore services
              </a>
            </div>

            <dl className="proof-strip" aria-label="Proof points">
              {proofPoints.map((point) => (
                <div key={point.label}>
                  <dt>{point.value}</dt>
                  <dd>{point.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div id="scanner" className="hero-panel">
            <ReadinessScanner />
          </div>
        </div>
      </section>

      <div id="signals">
        <SignalCarousel />
      </div>

      <section id="services" className="section services-section" aria-labelledby="services-title">
        <div className="section-copy">
          <p className="eyebrow">What We Build</p>
          <h2 id="services-title">Security work packaged for speed, sales, and real resilience.</h2>
          <p>
            The most useful security programs are visible in product decisions, customer answers, and
            calm incident response. These offers focus on those outcomes.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <LaunchNavigator />

      <section id="contact" className="cta-section" aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">Ready to Ship With Proof?</p>
          <h2 id="contact-title">Turn security into the reason buyers keep moving.</h2>
          <p>
            Bring your launch plan, customer questions, or current site. Leave with a sharper risk
            map and the next trust-building sprint.
          </p>
        </div>
        <a className="button button-primary" href="mailto:hello@maxk-cyber.example?subject=Launch%20readiness%20scan">
          Start a readiness conversation
        </a>
      </section>
    </main>
  );
}

export default App;
