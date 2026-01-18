"use client";

import { useState, useEffect } from "react";
import ProductSetup from "./ProductSetup";
import DeliveryDetails from "./DeliveryDetails";
import CardMachineSummary from "./CardMachineSummary";

interface ProductSetupWithSummaryProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Steps: 0 = ProductSetup, 1 = DeliveryDetails, 2 = CardMachineSummary
type Step = "product-setup" | "delivery-details" | "summary";

const ProductSetupWithSummary = ({ onNext, onBack }: ProductSetupWithSummaryProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("product-setup");

  const handleProductSetupNext = () => {
    console.log("ProductSetup Next clicked - showing delivery details");
    // When product setup is completed, show delivery details
    setCurrentStep("delivery-details");
  };

  const handleDeliveryDetailsNext = () => {
    console.log("DeliveryDetails Next clicked - showing summary");
    // When delivery details is completed, show the summary
    setCurrentStep("summary");
  };

  const handleDeliveryDetailsBack = () => {
    console.log("DeliveryDetails Back clicked - showing product setup");
    // Go back to product setup
    setCurrentStep("product-setup");
  };

  const handleSummaryBack = () => {
    console.log("Summary Back clicked - showing delivery details");
    // Go back to delivery details
    setCurrentStep("delivery-details");
  };

  return (
    <div>
      {currentStep === "product-setup" && (
        <ProductSetup 
          onNext={handleProductSetupNext}
          onBack={onBack}
        />
      )}
      {currentStep === "delivery-details" && (
        <DeliveryDetails 
          onNext={handleDeliveryDetailsNext}
          onBack={handleDeliveryDetailsBack}
        />
      )}
      {currentStep === "summary" && (
        <CardMachineSummary 
          onNext={onNext}
          onBack={handleSummaryBack}
        />
      )}
    </div>
  );
};

export default ProductSetupWithSummary;
