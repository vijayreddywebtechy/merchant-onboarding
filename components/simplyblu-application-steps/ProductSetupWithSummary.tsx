"use client";

import { useState, useEffect } from "react";
import ProductSetup from "./ProductSetup";
import CardMachineSummary from "./CardMachineSummary";

interface ProductSetupWithSummaryProps {
  onNext?: () => void;
  onBack?: () => void;
}

const ProductSetupWithSummary = ({ onNext, onBack }: ProductSetupWithSummaryProps) => {
  const [showSummary, setShowSummary] = useState(false);

  const handleProductSetupNext = () => {
    console.log("ProductSetup Next clicked - showing summary");
    // When product setup is completed, show the summary
    setShowSummary(true);
  };

  const handleSummaryBack = () => {
    console.log("Summary Back clicked - showing product setup");
    // Go back to product setup
    setShowSummary(false);
  };

  return (
    <div>
      {!showSummary ? (
        <ProductSetup 
          onNext={handleProductSetupNext}
          onBack={onBack}
        />
      ) : (
        <CardMachineSummary 
          onNext={onNext}
          onBack={handleSummaryBack}
        />
      )}
    </div>
  );
};

export default ProductSetupWithSummary;
