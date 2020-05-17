import { useState, useEffect } from 'react';

export default function useKeyPress(targetKeys: string[]) {
  const [anyKeyPressed, setAnyKeyPressed] = useState(false);
  const [keysPressed, setKeysPressed] = useState(new Set<string>());
  const targetKeySet = new Set(targetKeys);

  useEffect(() => {
    setAnyKeyPressed(keysPressed.size !== 0);
  }, [keysPressed]);

  useEffect(() => {
    function downHandler(e: KeyboardEvent) {
      const key = e.code;
      if (targetKeySet.has(key)) {
        setKeysPressed(keys => new Set([key, ...keys.keys()]));
      }
    }

    function upHandler(e: KeyboardEvent) {
      const key = e.code;
      if (targetKeySet.has(key)) {
        setKeysPressed(keys => {
          keys = new Set(keys);
          keys.delete(key);
          return keys;
        });
      }
    }

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKeySet]);

  return anyKeyPressed;
}
