import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useIterator } from './useIterator';

describe('useIterator', () => {
  it('cycles forward and backward through items', () => {
    const { result } = renderHook(() => useIterator(['alpha', 'bravo', 'charlie']));

    expect(result.current.current).toBe('alpha');

    act(() => result.current.next());
    expect(result.current.current).toBe('bravo');

    act(() => result.current.previous());
    expect(result.current.current).toBe('alpha');

    act(() => result.current.previous());
    expect(result.current.current).toBe('charlie');
  });

  it('clamps direct navigation and shuffles away from the current item', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.8);
    const { result } = renderHook(() => useIterator(['alpha', 'bravo', 'charlie'], 10));

    expect(result.current.current).toBe('charlie');

    act(() => result.current.goTo(-1));
    expect(result.current.current).toBe('alpha');

    act(() => result.current.shuffle());
    expect(result.current.current).toBe('charlie');

    randomSpy.mockRestore();
  });

  it('rejects empty item collections', () => {
    expect(() => renderHook(() => useIterator([]))).toThrow('useIterator requires at least one item.');
  });
});
