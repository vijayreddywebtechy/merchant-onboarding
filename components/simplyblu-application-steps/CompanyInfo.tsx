"use client";

import React, { useState } from "react";
import CompanyDetails from "./CompanyDetails";
import CompanyFinancialInfo from "./CompanyFinancialInfo";
import MarketingConsentForm from "./MarketingConsentForm";
import CompanyBankingDetails from "./CompanyBankingDetails";


interface CompanyInfoProps {
  onNext?: () => Promise<void>;
  onBack?: () => void;
}

// Sub-steps within Company Info
const COMPANY_STEPS = [
  { id: 0, name: "Company Details", component: CompanyDetails },
  { id: 1, name: "Financial Info", component: CompanyFinancialInfo },
  { id: 2, name: "Marketing Consent", component: MarketingConsentForm },
  { id: 3, name: "Banking Details", component: CompanyBankingDetails },
];

function CompanyInfo({ onNext, onBack }: CompanyInfoProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);



  const handleSubStepNext = async () => {
    if (currentSubStep < COMPANY_STEPS.length - 1) {
      // Move to next sub-step
      setCurrentSubStep(currentSubStep + 1);
    } else {
      // Last sub-step completed, call parent's onNext
      if (onNext) {
        await onNext();
      }
    }
  };

  const handleSubStepBack = () => {
    if (currentSubStep > 0) {
      setCurrentSubStep(currentSubStep - 1);
    } else {
      // First sub-step, go back to parent
      if (onBack) {
        onBack();
      }
    }
  };

  const CurrentComponent = COMPANY_STEPS[currentSubStep].component;

  return (
    <div>
      <CurrentComponent onNext={handleSubStepNext} onBack={handleSubStepBack} />
    </div>
  );
}

export default CompanyInfo;