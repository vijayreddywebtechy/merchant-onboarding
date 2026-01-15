"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthFlow, setIsAuthFlow] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    
    // Only process if there's a code parameter (auth callback)
    if (!code) {
      setIsLoading(false);
      return;
    }

    setIsAuthFlow(true);
    setIsLoading(true);

    async function fetchToken() {
      try {
        const body = new URLSearchParams();
        body.append("grant_type", process.env.NEXT_PUBLIC_PING_GRANT_TYPE || "authorization_code");
        body.append("client_id", process.env.NEXT_PUBLIC_PING_CLIENT_ID || "");
        body.append("redirect_uri", process.env.NEXT_PUBLIC_PING_REDIRECT_URI || "");
        body.append("code_verifier", process.env.NEXT_PUBLIC_PING_CODE_VERIFIER || "");
        body.append("code", code || "");

        const response = await fetch(process.env.NEXT_PUBLIC_ACCESS_TOKEN_URL || "", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        const data = await response.json();

        if (!response.ok || !data?.access_token) {
          sessionStorage.removeItem("ping_access_token");
          sessionStorage.removeItem("ping_access_token_data");
          document.cookie = `isAuthenticated=false; path=/; max-age=0;`;
          setError("Failed to authenticate. No access token received.");
          setIsLoading(false);
          return;
        }

        sessionStorage.setItem("ping_access_token", data.access_token);

        // Save token data with expiry for auto-refresh
        if (data?.expires_in) {
          const tokenData = {
            access_token: data.access_token,
            expires_in: data.expires_in,
            timestamp: Date.now(),
          };
          sessionStorage.setItem("ping_access_token_data", JSON.stringify(tokenData));
        }

        document.cookie = `isAuthenticated=true; path=/; max-age=1800; secure; samesite=lax;`;

        // Redirect to customer onboarding page after successful authentication
        router.push("/account-onboarding/customer-onboarding");
      } catch (err) {
        console.error("Error fetching token:", err);
        setError("Failed to exchange authorization code for token.");
        setIsLoading(false);
      }
    }

    fetchToken();
  }, [router, searchParams]);

  // If not in auth flow, don't render anything
  if (!isAuthFlow) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push("/account-onboarding")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Authenticating...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we complete your login</p>
        </div>
      </div>
    </div>
  );
}
