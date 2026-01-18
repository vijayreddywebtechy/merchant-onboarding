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

  const handleNext = async (data?: any) => {
    // If the parent provided an onNext handler, call it first
    if (onNext) {
      setIsLoading(true);
      try {
        const shouldProceed = await Promise.resolve(onNext());
        if (!shouldProceed) return;
      } catch (error) {
        console.error("Error in onNext handler:", error);
        return;
      } finally {
        setIsLoading(false);
      }
    }
    
    // Advance to the next step
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = async () => {
    // If the parent provided an onBack handler, call it first
    if (onBack) {
       setIsLoading(true);
      try {
        const shouldGoBack = await Promise.resolve(onBack());
        if (!shouldGoBack) return;
      } catch (error) {
        console.error("Error in onBack handler:", error);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Go back to the previous step
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const activeStepContent = steps[currentStep]?.content;

  // Clone the active step content to inject props
  const contentWithProps = React.isValidElement(activeStepContent)
    ? React.cloneElement(activeStepContent as React.ReactElement<any>, {
        onNext: handleNext,
        onBack: currentStep > 0 ? handleBack : undefined,
        isLastStep: currentStep === steps.length - 1,
      })
    : activeStepContent;

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
      <div className="my-8 min-h-[300px]">{contentWithProps}</div>
    </div>
  );
}
