import { useEffect, useRef, useState } from 'react';

export function usePromiseEffect({ execute, executeIf = [true], deps }) {
  const [state, setState] = useState({
    status: 'idle',
    result: null,
    error: null
  });

  useEffect(() => {
    if (executeIf.every(condition => condition)) {
      setState({ status: 'pending', result: null, error: null });
      execute()
        .then(result => setState({ status: 'fulfilled', result, error: null }))
        .catch(error => setState({ status: 'rejected', result: null, error }));
    }
  }, deps);

  return [state.result, state.status === 'pending', state.error];
}

export function useRenderCount(name = '') {
  const counterRef = useRef(0);
  counterRef.current += 1;
  console.info(name, 'renders:', counterRef.current);
  return counterRef.current;
}
