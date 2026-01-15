"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StepProps {
  title: string;
  description?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({
  title,
  description,
  isCompleted,
  isActive,
  stepNumber,
}) => {
  return (
    <div className="flex  items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full border-4 bg-gray-400 flex items-center justify-center text-white",
            isCompleted
              ? "border-primary bg-primary text-primary-foreground"
              : isActive
              ? "bg-primary text-white border-blue-200"
              : "border-muted"
          )}
        >
          {isCompleted ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="text-sm">{stepNumber}</span>
          )}
        </div>
      </div>
      <div className="mt-1 ml-3 text-center">
        <p
          className={cn(
            "text-sm",
            isActive || isCompleted
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

interface StepperProps {
  steps: Array<{
    title: string;
    description?: string;
    content?: React.ReactNode;
  }>;
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext?: () => Promise<boolean> | boolean;
  onBack?: () => Promise<boolean> | boolean;
}

export function Stepper({ steps, currentStep, onStepChange, onNext, onBack }: StepperProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showCompanyInfoNavigation, setShowCompanyInfoNavigation] = React.useState(false);

  // Listen for CompanyInfo substep changes
  React.useEffect(() => {
    const handleSubStepChange = (event: any) => {
      setShowCompanyInfoNavigation(event.detail.isLastSubStep);
    };
    
    window.addEventListener('companyInfoSubStepChange', handleSubStepChange);
    return () => window.removeEventListener('companyInfoSubStepChange', handleSubStepChange);
  }, []);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // Map step index to validation function names
      const validationFunctions: { [key: number]: string } = {
        0: "__personalInfoValidate",
        1: "__companyDetailsValidate",
        2: "__companyFinancialInfoValidate",
        3: "__marketingConsentValidate",
        4: "__bankingDetailsValidate",
        5: "__deliveryDetailsValidate",
        6: "__cardMachineSummaryValidate",
      };

      const validateFn = (window as any)[validationFunctions[currentStep]];
      if (validateFn) {
        const isValid = await validateFn();
        if (!isValid) {
          setIsLoading(false);
          return;
        }
      }

      if (onNext) {
        const isValid = await Promise.resolve(onNext());
        if (isValid) {
          onStepChange(currentStep + 1);
        }
      } else {
        onStepChange(currentStep + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    if (onBack) {
      setIsLoading(true);
      try {
        const isValid = await Promise.resolve(onBack());
        if (isValid) {
          onStepChange(currentStep - 1);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <Step
              title={step.title}
              description={step.description}
              isCompleted={index < currentStep}
              isActive={index === currentStep}
              stepNumber={index + 1}
            />
            {index < steps.length - 1 && (
              <div className="flex-1 h-[1px] bg-neutral-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="my-8 min-h-[300px]">{steps[currentStep]?.content}</div>

      {/* Navigation Buttons - Show in 2nd step only when on last substep */}
      {(currentStep !== 1 || showCompanyInfoNavigation) && (
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            size="md"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
          >
            Back
          </Button>
          <Button
            size="md"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1 || isLoading}
          >
            {isLoading ? "Loading..." : currentStep === steps.length - 1 ? "Finish" : "Next Step"}
          </Button>
        </div>
      )}
    </div>
  );
}
