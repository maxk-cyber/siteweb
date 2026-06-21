import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

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

  it('copies a shareable scanner summary when the clipboard is available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      get: () => ({ writeText }),
    });

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /copy share summary/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Trust Builder (63/100)'));
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
  });
});
