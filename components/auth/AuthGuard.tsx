"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // 1. Check URL parameters
      const prodId = searchParams.get("prodId");
      const prOpt = searchParams.get("prOpt");

      if (prodId && prOpt) {
        // Found in URL, save to localStorage and authorize
        const onboardingData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        onboardingData.prodId = prodId;
        onboardingData.prOpt = prOpt;
        localStorage.setItem("merchantOnboardingData", JSON.stringify(onboardingData));
        setIsAuthorized(true);
      } else {
        // Not in URL, check localStorage
        const onboardingData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        if (onboardingData.prodId && onboardingData.prOpt) {
            // Found in storage, authorize
            setIsAuthorized(true);
            
            // Optional: Restore to URL if needed, but might be annoying to force append
            // const newParams = new URLSearchParams(searchParams.toString());
            // newParams.set("prodId", onboardingData.prodId);
            // newParams.set("prOpt", onboardingData.prOpt);
            // router.replace(`${pathname}?${newParams.toString()}`);
        } else {
          // Not found anywhere
          setIsAuthorized(false);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [searchParams, pathname, router]);

  if (isChecking) {
    return <LoadingOverlay isVisible={true} message="Verifying session..." />;
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Missing required product information. Please return to the source application and try again.
        </p>
        <p className="text-sm text-gray-500">
          (Error: Missing prodId or prOpt parameters)
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
