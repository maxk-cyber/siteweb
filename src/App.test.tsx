import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { ActionPlanBuilder } from './components/ActionPlanBuilder';
import { LaunchValidator } from './components/LaunchValidator';
import { ReadinessScanner } from './components/ReadinessScanner';
import { TrustPacketStudio } from './components/TrustPacketStudio';

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    removeItem: vi.fn((key: string) => values.delete(key)),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  };
}

describe('App', () => {
  it('renders the product-led hero and default readiness score', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /make your next web launch feel safer, sharper, and easier to trust/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('63')).toBeInTheDocument();
    expect(screen.getByText('Trust Builder')).toBeInTheDocument();
  });

  it('updates readiness recommendations from scanner inputs', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText(/security maturity/i), 'ad-hoc');
    await user.selectOptions(screen.getByLabelText(/incident plan/i), 'none');
    await user.selectOptions(screen.getByLabelText(/cloud footprint/i), 'regulated');
    await user.selectOptions(screen.getByLabelText(/security habits/i), 'never');

    expect(screen.getByText('Launch Risk')).toBeInTheDocument();
    expect(
      screen.getByText(/the launch story is moving faster than the security story/i),
    ).toBeInTheDocument();
  });

  it('cycles market signals and launch steps', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^Next$/i }));
    expect(screen.getByText(/customers increasingly ask for proof before they buy/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next step/i }));
    expect(screen.getByText(/fix what buyers notice/i)).toBeInTheDocument();
  });

  it('tailors the trust packet studio and cycles buyer objections', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/founder-safe proof pack/i)).toBeInTheDocument();
    expect(screen.getByText('Procurement answer bank')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/buyer audience/i), 'agency');
    await user.selectOptions(screen.getByLabelText(/buying moment/i), 'incident-refresh');

    expect(screen.getByText(/client-ready trust layer/i)).toBeInTheDocument();
    expect(screen.getByText('First-hour response card')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next concern/i }));
    expect(screen.getByText(/who owns security after agency handoff/i)).toBeInTheDocument();
  });

  it('copies a shareable scanner summary when the clipboard is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<ReadinessScanner clipboard={{ writeText }} />);

    await user.click(screen.getByRole('button', { name: /copy share summary/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Trust Builder (63/100)'));
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });

  it('validates launch inputs and copies a validation summary', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<LaunchValidator clipboard={{ writeText }} />);

    expect(screen.getByText('Valid launch candidate')).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/product url/i));
    await user.type(screen.getByLabelText(/product url/i), 'http://localhost:3000?token=abc');
    await user.clear(screen.getByLabelText(/security contact/i));
    await user.type(screen.getByLabelText(/security contact/i), 'not-an-email');
    await user.selectOptions(screen.getByLabelText(/data profile/i), 'regulated');
    await user.selectOptions(screen.getByLabelText(/authentication/i), 'none');

    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText(/the launch url is not https/i)).toBeInTheDocument();
    expect(screen.getByText(/the security contact email is not valid/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /copy validation/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Status: Blocked'));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('token'));
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });

  it('copies the trust packet handoff when the clipboard is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<TrustPacketStudio clipboard={{ writeText }} />);

    await user.click(screen.getByRole('button', { name: /copy handoff/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('For the sales champion'));
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });

  it('builds a persistent action plan with custom tasks and Markdown copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const storage = createMemoryStorage();

    const user = userEvent.setup();
    render(<ActionPlanBuilder clipboard={{ writeText }} storage={storage} />);

    expect(screen.getByText(/give an internal champion the answers/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/plan scenario/i), 'incident');
    expect(screen.getByText(/practice the first hour before/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/assign incident roles and backups/i));
    expect(screen.getByText('20%')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/add a custom task/i), 'Review pager escalation');
    await user.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByText('Review pager escalation')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /copy markdown/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('# Incident drill Action Plan'));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Review pager escalation'));
    expect(storage.setItem).toHaveBeenCalled();
    expect(screen.getByText('Plan copied')).toBeInTheDocument();
  });
});
