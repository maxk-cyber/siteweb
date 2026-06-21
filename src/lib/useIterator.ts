import { useCallback, useMemo, useState } from 'react';

export type IteratorControls<T> = {
  current: T;
  index: number;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  shuffle: () => void;
};

export function useIterator<T>(items: T[], initialIndex = 0): IteratorControls<T> {
  if (items.length === 0) {
    throw new Error('useIterator requires at least one item.');
  }

  const [index, setIndex] = useState(() => clampIndex(initialIndex, items.length));

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(clampIndex(nextIndex, items.length));
    },
    [items.length],
  );

  const next = useCallback(() => {
    setIndex((currentIndex) => (currentIndex + 1) % items.length);
  }, [items.length]);

  const previous = useCallback(() => {
    setIndex((currentIndex) => (currentIndex - 1 + items.length) % items.length);
  }, [items.length]);

  const shuffle = useCallback(() => {
    setIndex((currentIndex) => {
      if (items.length === 1) {
        return currentIndex;
      }

      let nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * items.length);
      }

      return nextIndex;
    });
  }, [items.length]);

  return useMemo(
    () => ({
      current: items[index],
      index,
      count: items.length,
      isFirst: index === 0,
      isLast: index === items.length - 1,
      next,
      previous,
      goTo,
      shuffle,
    }),
    [goTo, index, items, next, previous, shuffle],
  );
}

function clampIndex(index: number, length: number): number {
  if (!Number.isFinite(index)) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(index), 0), length - 1);
}
