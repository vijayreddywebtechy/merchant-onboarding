"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";

interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that automatically refreshes access tokens
 */
export default function TokenRefreshProvider({
  children,
}: TokenRefreshProviderProps) {
  // Initialize token refresh with default settings
  useTokenRefresh({
    refreshBeforeSeconds: 60,
    onTokenRefreshed: (expiresIn) => {
      console.log(`Token refreshed, next refresh in ${expiresIn} seconds`);
    },
    onRefreshError: (error) => {
      console.error("Token refresh failed:", error);
    },
  });

  return <>{children}</>;
}