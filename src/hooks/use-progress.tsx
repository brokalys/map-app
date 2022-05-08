import { useEffect, useState } from 'react';

export default function useProgress(
  maxProgress: number,
  currentProgress: number = 0,
) {
  const [progress, setProgress] = useState(currentProgress);

  useEffect(() => {
    if (progress < maxProgress) {
      setTimeout(() => setProgress((state) => state + 1), 1000);
    }
  }, [progress, maxProgress]);

  useEffect(() => {
    setProgress(currentProgress);
  }, [currentProgress]);

  return currentProgress > progress ? currentProgress : progress;
}
