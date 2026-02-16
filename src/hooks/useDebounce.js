import { useState, useEffect } from 'react';

/**
 * Hook ini akan menunda pembaruan nilai sampai user berhenti mengetik
 * selama durasi yang ditentukan (delay).
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Menghapus timeout jika user mengetik lagi sebelum delay selesai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};