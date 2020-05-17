import { useState, useEffect } from 'react';

export function useThrottle<T>(value: T, limiter: (previous: T, current: T) => boolean) {
  const [throttledValue, setThrottledValue] = useState(value);

  useEffect(() => {
    setThrottledValue(previous => (limiter(previous, value) ? value : previous));
  }, [value, limiter]);

  return throttledValue;
}
