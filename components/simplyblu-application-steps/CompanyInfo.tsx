"use client";

import React, { useState } from "react";
import CompanyDetails from "./CompanyDetails";
import CompanyFinancialInfo from "./CompanyFinancialInfo";
import MarketingConsentForm from "./MarketingConsentForm";
import CompanyBankingDetails from "./CompanyBankingDetails";
import DeliveryDetails from "./DeliveryDetails";
import CardMachineSummary from "./CardMachineSummary";
import AcceptOffer from "./AcceptOffer";

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
  { id: 4, name: "Delivery Details", component: DeliveryDetails },
  { id: 5, name: "Card Machine Summary", component: CardMachineSummary },
];

function CompanyInfo({ onNext, onBack }: CompanyInfoProps) {
  const [currentSubStep, setCurrentSubStep] = useState(0);

  // Notify parent when substep changes
  React.useEffect(() => {
    const event = new CustomEvent('companyInfoSubStepChange', { 
      detail: { isLastSubStep: currentSubStep === COMPANY_STEPS.length - 1 } 
    });
    window.dispatchEvent(event);
  }, [currentSubStep]);

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