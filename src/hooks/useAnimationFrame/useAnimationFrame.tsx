import { useEffect, useRef } from 'react';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/

type Callback = () => void;

export default function useInterval(callback: Callback, enable: boolean) {
  const savedCallback = useRef<Callback | null>(null);
  const id = useRef(0);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function cancel() {
      id.current && cancelAnimationFrame(id.current);
      id.current = 0;
    }
    function tick(ts: DOMHighResTimeStamp) {
      savedCallback.current && savedCallback.current();
      id.current = requestAnimationFrame(tick);
    }
    if (enable) {
      id.current = requestAnimationFrame(tick);
    } else {
      cancel();
    }
    return () => cancel();
  }, [enable]);
}
