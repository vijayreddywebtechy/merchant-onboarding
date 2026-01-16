"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyFinancialInfoSchema } from "@/lib/validationSchemas";
import { amountRangeOptions, businessFundingOptions } from "@/lib/data";

type FinancialData = {
  annualTurnover: string;
  monthlyProfit: string;
  averageTransactionAmount: string;
  irregularIncome: string;
  fundingSource: string[];
};

interface Props {
  onNext?: () => void;
  onBack?: () => void;
}

function CompanyFinancialInfo({ onNext, onBack }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    control,
    formState: { errors, isValidating },
    watch,
    handleSubmit,
    reset,
  } = useForm<FinancialData>({
    resolver: yupResolver(companyFinancialInfoSchema) as any,
    mode: "onChange",
    defaultValues: {
      annualTurnover: "",
      monthlyProfit: "",
      averageTransactionAmount: "",
      irregularIncome: "",
      fundingSource: [],
    },
  });

  React.useEffect(() => {
    const data = localStorage.getItem("companyFinancialInfoFormData");
    if (data) {
      reset(JSON.parse(data));
    } else {
      // Try to prefill from merchantOnboardingData
      const merchantData = localStorage.getItem("merchantOnboardingData");
      if (merchantData) {
        const parsed = JSON.parse(merchantData);
        const turnover = parsed.businessDetails?.grossTurnover;
        
        // Map turnover to range if possible
        let turnoverRange = "";
        if (turnover) {
          const amount = parseInt(turnover);
          if (amount < 50000) turnoverRange = "0-50000";
          else if (amount < 100000) turnoverRange = "50000-100000";
          else if (amount < 500000) turnoverRange = "100000-500000";
          else if (amount < 1000000) turnoverRange = "500000-1000000";
          else turnoverRange = "1000000+";
        }
        
        reset({
          annualTurnover: turnoverRange,
          monthlyProfit: "",
          averageTransactionAmount: "",
          irregularIncome: "",
          fundingSource: [],
        });
      }
    }
  }, [reset]);

  const fundingSource = watch("fundingSource");

  // Save form data in real-time to localStorage
  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("companyFinancialInfoFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Expose validation through window object for Stepper to call
  useEffect(() => {
    (window as any).__companyFinancialInfoValidate = async () => {
      const isValid = await new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
      return isValid;
    };
  }, [handleSubmit]);

  return (
    <div className="py-6 md:py-8">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
          Company financial details
        </h2>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
          Enter the information below
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-8 border border-gray-200 rounded-lg p-6 md:p-10 bg-white shadow-sm">
        {/* Financial Information Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            Financial Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Annual Turnover */}
            <div className="space-y-2">
              <Label htmlFor="annualTurnover">Annual turnover</Label>
              <Controller
                name="annualTurnover"
                control={control}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      value={(() => {
                        const found = amountRangeOptions.find(
                          (opt) => opt.value === field.value
                        );
                        return found ? found : null;
                      })()}
                      onChange={(option: any) => {
                        const selected = Array.isArray(option) ? option[0] : option;
                        field.onChange(selected ? selected.value : "");
                      }}
                      options={amountRangeOptions}
                      placeholder="Please select"
                    />
                    {errors.annualTurnover && (
                      <p className="text-sm text-red-500">
                        {errors.annualTurnover.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Monthly Profit */}
            <div className="space-y-2">
              <Label htmlFor="monthlyProfit">Monthly profit</Label>
              <Controller
                name="monthlyProfit"
                control={control}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      value={(() => {
                        const found = amountRangeOptions.find(
                          (opt) => opt.value === field.value
                        );
                        return found ? found : null;
                      })()}
                      onChange={(option: any) => {
                        const selected = Array.isArray(option) ? option[0] : option;
                        field.onChange(selected ? selected.value : "");
                      }}
                      options={amountRangeOptions}
                      placeholder="Please select"
                    />
                    {errors.monthlyProfit && (
                      <p className="text-sm text-red-500">
                        {errors.monthlyProfit.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Average Transaction Amount */}
            <div className="space-y-2">
              <Label htmlFor="averageTransactionAmount">Average transaction amount</Label>
              <Controller
                name="averageTransactionAmount"
                control={control}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      value={(() => {
                        const found = amountRangeOptions.find(
                          (opt) => opt.value === field.value
                        );
                        return found ? found : null;
                      })()}
                      onChange={(option: any) => {
                        const selected = Array.isArray(option) ? option[0] : option;
                        field.onChange(selected ? selected.value : "");
                      }}
                      options={amountRangeOptions}
                      placeholder="Please select"
                    />
                    {errors.averageTransactionAmount && (
                      <p className="text-sm text-red-500">
                        {errors.averageTransactionAmount.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Irregular Income */}
            <div className="space-y-2">
              <Label htmlFor="irregularIncome">Irregular income</Label>
              <Controller
                name="irregularIncome"
                control={control}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      value={(() => {
                        const found = amountRangeOptions.find(
                          (opt) => opt.value === field.value
                        );
                        return found ? found : null;
                      })()}
                      onChange={(option: any) => {
                        const selected = Array.isArray(option) ? option[0] : option;
                        field.onChange(selected ? selected.value : "");
                      }}
                      options={amountRangeOptions}
                      placeholder="Please select"
                    />
                    {errors.irregularIncome && (
                      <p className="text-sm text-red-500">
                        {errors.irregularIncome.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Funding Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fundingSource">
                How are you funding your business (choose one or more)
              </Label>
              <Controller
                name="fundingSource"
                control={control}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      value={businessFundingOptions.filter((opt) =>
                        field.value && field.value.includes(opt.value)
                      )}
                      onChange={(options: any) => {
                        const selected = Array.isArray(options) ? options : [];
                        field.onChange(selected.map((opt: any) => opt.value));
                      }}
                      options={businessFundingOptions}
                      placeholder="Please select"
                      isMulti={true}
                    />
                    {errors.fundingSource && (
                      <p className="text-sm text-red-500">
                        {errors.fundingSource.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 !mt-12">
          <Button variant="outline" className="w-full md:max-w-40" onClick={onBack}>
            Back
          </Button>
          <Button 
            className="w-full md:max-w-40" 
            onClick={async () => {
              const isValid = await (window as any).__companyFinancialInfoValidate?.();
              if (isValid && onNext) onNext();
            }}
            disabled={isValidating}
          >
            {isValidating ? "Validating..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CompanyFinancialInfo;
