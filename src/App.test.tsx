import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { ReadinessScanner } from './components/ReadinessScanner';
import { TrustPacketStudio } from './components/TrustPacketStudio';

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

  it('copies the trust packet handoff when the clipboard is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<TrustPacketStudio clipboard={{ writeText }} />);

    await user.click(screen.getByRole('button', { name: /copy handoff/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('For the sales champion'));
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });
});
