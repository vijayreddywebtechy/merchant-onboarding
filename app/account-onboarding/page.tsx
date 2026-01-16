"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BusinessDetailsForm from "@/components/onboarding/BusinessDetailsForm";
import TellusMore from "@/components/onboarding/TellusMore";
import VerifyBlock from "@/components/VerifyIdentity/VerifyBlock";
import { useOnboardingSubmit } from "@/hooks/useOnboardingSubmit";
import { useAccessToken } from "@/hooks/useAccessToken";

type Props = {};

const Page = (props: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleFormSubmit, error } = useOnboardingSubmit();
  const accessTokenMutation = useAccessToken();

  useEffect(() => {
    const prodId = searchParams.get("prodId");
    const prOpt = searchParams.get("prOpt");

    if (prodId === "ZPOS" && prOpt === "ZSIB") {
      const existingData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
      existingData.prodId = prodId;
      existingData.prOpt = prOpt;
      localStorage.setItem("merchantOnboardingData", JSON.stringify(existingData));
    }
  }, [searchParams]);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleBusinessDetailsNext = async (formData: any) => {
    setIsLoading(true);
    setLocalError(null);

    try {
      // Get access token from sessionStorage or generate new one
      let accessToken = null;
      const storedToken = sessionStorage.getItem("ping_access_token_data");
      
      if (storedToken) {
        const tokenData = JSON.parse(storedToken);
        const tokenAge = Date.now() - (tokenData.timestamp || 0);
        const expiresIn = (tokenData.expires_in || 3600) * 1000; // Convert to milliseconds
        
        // Check if token is still valid (with 5 minute buffer)
        if (tokenAge < expiresIn - 300000) {
          accessToken = tokenData.access_token;
        }
      }

      // If no valid token, generate a new one
      if (!accessToken) {
        await new Promise<void>((resolve, reject) => {
          accessTokenMutation.mutate(undefined, {
            onSuccess: (tokenData) => {
              console.log("✅ Access token generated successfully");
              if (tokenData?.access_token) {
                accessToken = tokenData.access_token;
                
                // Save token for later use
                if (tokenData?.expires_in) {
                  const tokenInfo = {
                    access_token: tokenData.access_token,
                    expires_in: tokenData.expires_in,
                    timestamp: Date.now(),
                  };
                  sessionStorage.setItem("ping_access_token_data", JSON.stringify(tokenInfo));
                }
                resolve();
              }
            },
            onError: (err) => {
              const errorMessage = err?.message || "Failed to generate access token. Please check your configuration.";
              setLocalError(errorMessage);
              console.error("Token generation error:", err);
              reject(err);
            },
          });
        });
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      // Call customers API to get list of companies
      const response = await fetch(`/api/get-customers?nidNumber=${formData.directorId}`, { headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch customer data");
      }

      // Store customer data
      const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
      storedData.customersData = data;
      localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

      // Navigate to your-companies page
      router.push("/account-onboarding/your-companies");
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      setLocalError(err.message || "Failed to fetch customer data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationNext = async () => {
    // Get form data from localStorage and submit
    const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    const formData = storedData.businessDetails;
    
    if (formData) {
      await handleFormSubmit(formData);
    } else {
      setLocalError("Form data not found. Please go back and fill the form.");
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-700 font-medium">Processing your application...</p>
          </div>
        </div>
      )}

      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error || localError}
        </div>
      )}

      {currentStep === 0 && <TellusMore onNext={handleNext} onBack={handleBack} />}
      {currentStep === 1 && (
        <BusinessDetailsForm 
          onNext={handleBusinessDetailsNext} 
          onBack={handleBack} 
        />
      )}
      {currentStep === 2 && <VerifyBlock onNext={handleVerificationNext} />}
    </div>
  );
};

export default Page;