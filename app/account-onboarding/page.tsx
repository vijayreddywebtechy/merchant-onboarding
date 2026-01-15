"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BusinessDetailsForm from "@/components/onboarding/BusinessDetailsForm";
import TellusMore from "@/components/onboarding/TellusMore";
import VerifyBlock from "@/components/VerifyIdentity/VerifyBlock";
import { useOnboardingSubmit } from "@/hooks/useOnboardingSubmit";

type Props = {};

const Page = (props: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { handleFormSubmit, isLoading, error } = useOnboardingSubmit();

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
    // Just navigate to verification step, don't submit yet
    setCurrentStep(2);
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