"use client";

import { useEffect, useRef, useCallback } from "react";
import { AxiosError } from "axios";
import { useAccessToken } from "./useAccessToken";

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface UseTokenRefreshOptions {
  refreshBeforeSeconds?: number;
  onTokenRefreshed?: (expiresIn: number) => void;
  onRefreshError?: (error: Error) => void;
}

/**
 * Hook to automatically refresh access token before expiration
 */
export const useTokenRefresh = ({
  refreshBeforeSeconds = 60,
  onTokenRefreshed,
  onRefreshError,
}: UseTokenRefreshOptions = {}) => {
  const accessTokenMutation = useAccessToken();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCheckedInitialToken = useRef(false);

  const scheduleTokenRefresh = useCallback(
    (expiresIn: number) => {
      // Clear any existing timer
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      // Schedule refresh before token expires
      const refreshIn = Math.max((expiresIn - refreshBeforeSeconds) * 1000, 0);

      console.log(`Token will be refreshed in ${refreshIn / 1000} seconds`);

      refreshTimerRef.current = setTimeout(() => {
        console.log("Refreshing access token...");
        accessTokenMutation.mutate(undefined, {
          onSuccess: (data: AccessTokenResponse) => {
            console.log("Token refreshed successfully");
            onTokenRefreshed?.(data.expires_in);
            // If the response includes expires_in, schedule next refresh
            if (data?.expires_in) {
              scheduleTokenRefresh(data.expires_in);
            }
          },
          onError: (error: AxiosError) => {
            console.error("Failed to refresh token:", error);
            const err = error instanceof Error ? error : new Error(String(error));
            onRefreshError?.(err);
            // Retry after 30 seconds on failure
            refreshTimerRef.current = setTimeout(() => {
              accessTokenMutation.mutate();
            }, 30000);
          },
        });
      }, refreshIn);
    },
    [accessTokenMutation, refreshBeforeSeconds, onTokenRefreshed, onRefreshError]
  );

  // Check for existing token on mount (only once)
  useEffect(() => {
    // Only check once when component mounts
    if (hasCheckedInitialToken.current) {
      return;
    }

    hasCheckedInitialToken.current = true;

    const tokenData = sessionStorage.getItem("ping_access_token_data");

    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData) as {
          expires_in?: number;
          timestamp?: number;
        };
        if (parsed.expires_in) {
          scheduleTokenRefresh(parsed.expires_in);
        }
      } catch (e) {
        console.error("Failed to parse token data:", e);
      }
    }
  }, [scheduleTokenRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  return {
    isLoading: accessTokenMutation.isPending,
    error: accessTokenMutation.error,
  };
};
