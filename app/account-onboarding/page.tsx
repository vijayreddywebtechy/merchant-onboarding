"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BusinessDetailsForm from "@/components/onboarding/BusinessDetailsForm";
import TellusMore from "@/components/onboarding/TellusMore";
import VerifyBlock from "@/components/VerifyIdentity/VerifyBlock";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
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
    const step = searchParams.get("step");


    // Handle step parameter for direct navigation
    if (step === "verification") {
      setCurrentStep(2); // Show VerifyBlock
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

      // Extract customers array from response
      const customersList = data.customers || [];

      // For the first customer only, fetch their detailed information
      let customersWithDetails: any[] = [];
      
      if (Array.isArray(customersList) && customersList.length > 0) {
        // Get details only for the first customer
        try {
          const firstCustomer = customersList[0];
          const detailsResponse = await fetch(`/api/get-customer-details/${firstCustomer.uuid}`, { headers });
          
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            customersWithDetails = [
              {
                ...firstCustomer,
                customerDetails: detailsData,
              },
              ...customersList.slice(1), // Include remaining customers without details
            ];
          } else {
            console.error(`Failed to fetch details for customer ${firstCustomer.uuid}`);
            customersWithDetails = customersList;
          }
        } catch (err) {
          console.error(`Error fetching details for first customer:`, err);
          customersWithDetails = customersList;
        }
      }

      // Check if first customer has CUSTOMER role (existing customer)
      let hasExistingCustomer = false;
      if (customersWithDetails.length > 0) {
        const firstCustomer = customersWithDetails[0];
        const customerRoles = firstCustomer.customerDetails?.customer?.customerRole || [];
        hasExistingCustomer = customerRoles.some((role: any) => role.roleX === "CUSTOMER");
      }

      // Store customer data with details
      const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
      storedData.businessDetails = formData;
      storedData.customersData = customersWithDetails;
      storedData.hasExistingCustomer = hasExistingCustomer;
      localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

      // Navigate based on whether user is an existing customer
      if (hasExistingCustomer) {
        // Navigate to OTP if existing customer
        router.push("/account-onboarding/otp");
      } else {
        // Navigate to verification if not existing customer
        router.push("/account-onboarding?step=verification");
      }
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
      <LoadingOverlay message="Processing your application..." isVisible={isLoading} />

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