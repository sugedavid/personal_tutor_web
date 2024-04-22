import { perf } from '@/firebase';
import { trace } from 'firebase/performance';

export const withTrace = (name, fn) => {
  const t = trace(perf, name);

  return async (...args) => {
    try {
      // start trace
      t.start();
      // execute function
      await fn(...args);
    } finally {
      // stop trace
      t.stop();
    }
  };
};
