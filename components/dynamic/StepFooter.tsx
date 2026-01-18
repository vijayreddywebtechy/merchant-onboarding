import React from "react";
import { Button } from "@/components/ui/button";

interface StepFooterProps {
  onBack?: () => void;
  isLoading?: boolean;
  nextLabel?: string;
  isBackDisabled?: boolean;
  isNextDisabled?: boolean;
}

export const StepFooter: React.FC<StepFooterProps> = ({
  onBack,
  isLoading = false,
  nextLabel = "Next",
  isBackDisabled = false,
  isNextDisabled = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mt-12 pt-6 border-t border-gray-100">
      {onBack && (
        <Button
          variant="outline"
          className="w-full md:max-w-40"
          onClick={onBack}
          type="button"
          disabled={isBackDisabled || isLoading}
        >
          Back
        </Button>
      )}
      <Button
        className="w-full md:max-w-40 ml-auto"
        type="submit"
        disabled={isNextDisabled || isLoading}
      >
        {isLoading ? "Loading..." : nextLabel}
      </Button>
    </div>
  );
};
