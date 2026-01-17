'use client'

import { useState } from "react";
import { Stepper } from "@/components/dynamic/Stepper";
import PersonalInfo from "@/components/simplyblu-application-steps/PersonalInfo";
import CompanyInfo from "@/components/simplyblu-application-steps/CompanyInfo";
import ProductSetupWithSummary from "@/components/simplyblu-application-steps/ProductSetupWithSummary";


type Props = {};

const steps = [
  {
    title: "Personal Info",
    content: <PersonalInfo/>,
  },
  {
    title: "Company Info",
    content: <CompanyInfo/>,
  },
  {
    title: "Product Setup",
    content: <ProductSetupWithSummary />,
  },
  {
    title: "Accept offer",
    content: (
      <div className="p-6 bg-neutral-50 rounded-lg">
        <h3 className="font-semibold mb-2">Accept Offer</h3>
        <p>Review and accept the offer terms</p>
      </div>
    ),
  },
];

const page = (props: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className="page-container py-8 md:py-12">
      <div className="bg-background px-4 py-8 sm:p-10 md:p-12 rounded-xl">
        <h2 className="text-lg md:text-xl text-secondary uppercase mb-6">
          MYMOBIZ APPLICATION
        </h2>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default page;
