import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface UseRetryOptions {
  setIsPopupOpen?: (open: boolean) => void;
  maxPopupRetries?: number;
  redirectOnFailure?: string;
  onError?: (errorType: string, attempt: number) => void;
}

interface RetryResult {
  success: boolean;
  [key: string]: any;
}

export const useRetry = ({
  setIsPopupOpen,
  maxPopupRetries = 3,
  redirectOnFailure = "/",
  onError,
}: UseRetryOptions = {}) => {
  const retryCountRef = useRef(0);
  const router = useRouter();

  const executeWithRetry = useCallback(
    async (fn: () => Promise<RetryResult>): Promise<RetryResult> => {
      const result = await fn();

      // If the function returned failure, treat it like an error (QUIETLY)
      const failed = result?.success === false;

      if (!failed) {
        return result; // success case, nothing to do
      }

      // Increase retry counter
      retryCountRef.current += 1;
      const attempt = retryCountRef.current;

      onError?.("retry_failed", attempt);

      // First 3 times → show popup
      if (attempt < maxPopupRetries) {
        setIsPopupOpen?.(true);
        return { success: false };
      }

      // 4th failure → redirect
      router.push(redirectOnFailure);
      return { success: false };
    },
    [setIsPopupOpen, maxPopupRetries, redirectOnFailure, onError, router]
  );

  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0;
  }, []);

  return { executeWithRetry, resetRetryCount };
};
