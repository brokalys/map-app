import { useEffect, useState } from 'react';

export default function useProgress(maxProgress, currentProgress = 0) {
  const [progress, setProgress] = useState(currentProgress);

  useEffect(() => {
    if (progress < maxProgress) {
      setTimeout(() => setProgress((state) => state + 1), 800);
    }
  }, [progress, maxProgress]);

  useEffect(() => {
    setProgress((state) => {
      if (state > currentProgress) {
        return state;
      }
      return currentProgress;
    });
  }, [currentProgress]);

  return progress;
}
