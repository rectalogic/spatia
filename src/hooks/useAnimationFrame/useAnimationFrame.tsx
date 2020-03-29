import { useEffect, useRef, useLayoutEffect } from 'react';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// https://blog.jakuba.net/request-animation-frame-and-use-effect-vs-use-layout-effect/

type Callback = () => void;

export default function useInterval(callback: Callback, enable: boolean) {
  const savedCallback = useRef<Callback | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    if (enable) {
      let timerId = 0;
      function tick(ts: DOMHighResTimeStamp) {
        savedCallback.current && savedCallback.current();
        timerId = requestAnimationFrame(tick);
      }
      timerId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(timerId);
    }
  }, [enable]);
}
