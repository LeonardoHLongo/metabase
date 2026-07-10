import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Local input state for a setting-backed control: hydrates once from the
 * setting after it has loaded (`isLoading` goes false), unless the user has
 * already started editing — a hydration must never clobber their input.
 *
 * Report user edits through the returned `setInputValueFromUser` (not a raw
 * setState) so the hook knows hydration is no longer allowed.
 */
export function useHydratedInput<T>({
  value,
  isLoading,
  onHydrate,
}: {
  value: T;
  isLoading: boolean;
  /** Runs alongside the (single) hydration with the hydrated value. */
  onHydrate?: (value: T) => void;
}) {
  const [inputValue, setInputValue] = useState<T>(value);
  const hasHydrated = useRef(false);
  const hasUserEdited = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current && !isLoading && !hasUserEdited.current) {
      setInputValue(value);
      onHydrate?.(value);
      hasHydrated.current = true;
    }
  }, [isLoading, value, onHydrate]);

  const setInputValueFromUser = useCallback((newValue: T) => {
    hasUserEdited.current = true;
    setInputValue(newValue);
  }, []);

  return { inputValue, setInputValueFromUser };
}
