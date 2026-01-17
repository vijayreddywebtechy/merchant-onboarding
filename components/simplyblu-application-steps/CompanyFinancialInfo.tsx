"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyFinancialInfoSchema } from "@/lib/validationSchemas";
import { amountRangeOptions } from "@/lib/data_copy";
import { entClassifOptions,countryOptions,sourcOfFundsOptions } from "@/lib/data";

// Entity Classification options
// const entityClassificationOptions = [
//   { value: "sole-proprietor", label: "Sole Proprietor" },
//   { value: "partnership", label: "Partnership" },
//   { value: "private-company", label: "Private Company" },
//   { value: "public-company", label: "Public Company" },
//   { value: "non-profit", label: "Non-Profit Organization" },
//   { value: "trust", label: "Trust" },
// ];

// Country options
// const countryOptions = [
//   { value: "south-africa", label: "South Africa" },
//   { value: "united-states", label: "United States" },
//   { value: "united-kingdom", label: "United Kingdom" },
//   { value: "germany", label: "Germany" },
//   { value: "france", label: "France" },
//   { value: "australia", label: "Australia" },
//   { value: "canada", label: "Canada" },
// ];

// Reason for not having tax number options
const reasonForNoTaxNumberOptions = [
  { value: "not-required", label: "Not required in my country" },
  { value: "in-process", label: "Application in process" },
  { value: "exempt", label: "Exempt from tax registration" },
  { value: "other", label: "Other" },
];

type FinancialData = {
  annualTurnover: string;
  monthlyProfit: string;
  averageTransactionAmount: string;
  irregularIncome: string;
  fundingSource: string[];
  entityClassification: string;
  taxResidencyOutsideSA: string;
  bbeTransaction: string;
  profitFromBusiness: string;
  countryOfTaxResidency: string;
  foreignTaxNumber: string;
  reasonForNoTaxNumber: string;
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
      entityClassification: "",
      taxResidencyOutsideSA: "",
      bbeTransaction: "",
      profitFromBusiness: "",
      countryOfTaxResidency: "",
      foreignTaxNumber: "",
      reasonForNoTaxNumber: "",
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
  const taxResidencyOutsideSA = watch("taxResidencyOutsideSA");

  const [showTaxNumberReason, setShowTaxNumberReason] = React.useState(false);

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
            {/* Entity Classification */}
            <div className="space-y-2">
              <Label htmlFor="entityClassification">Entity classification</Label>
              <Controller
                name="entityClassification"
                control={control}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      value={(() => {
                        const found = entClassifOptions.find(
                          (opt) => opt.value === field.value
                        );
                        return found ? found : null;
                      })()}
                      onChange={(option: any) => {
                        const selected = Array.isArray(option) ? option[0] : option;
                        field.onChange(selected ? selected.value : "");
                      }}
                      options={entClassifOptions}
                      placeholder="Please select"
                    />
                    {errors.entityClassification && (
                      <p className="text-sm text-red-500">
                        {errors.entityClassification.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Tax Residency Question */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Label>
                  Does your company have tax residency outside of South Africa?
                </Label>
                <button className="flex-shrink-0">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <Controller
                name="taxResidencyOutsideSA"
                control={control}
                render={({ field }) => (
                  <>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="tax-residency-yes" />
                        <Label htmlFor="tax-residency-yes" className="cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="tax-residency-no" />
                        <Label htmlFor="tax-residency-no" className="cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.taxResidencyOutsideSA && (
                      <p className="text-sm text-red-500">
                        {errors.taxResidencyOutsideSA.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

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

          {/* Conditional Fields - Show when tax residency is Yes */}
          {taxResidencyOutsideSA === "yes" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Country of Tax Residency */}
                <div className="space-y-2">
                  <Label htmlFor="countryOfTaxResidency">
                    Country of tax residency
                  </Label>
                  <Controller
                    name="countryOfTaxResidency"
                    control={control}
                    render={({ field }) => (
                      <>
                        <CustomSelect
                          value={(() => {
                            const found = countryOptions.find(
                              (opt) => opt.value === field.value
                            );
                            return found ? found : null;
                          })()}
                          onChange={(option: any) => {
                            const selected = Array.isArray(option) ? option[0] : option;
                            field.onChange(selected ? selected.value : "");
                          }}
                          options={countryOptions}
                          placeholder="Please select"
                        />
                        {errors.countryOfTaxResidency && (
                          <p className="text-sm text-red-500">
                            {errors.countryOfTaxResidency.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                {/* Foreign Tax Number */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="foreignTaxNumber">
                      Foreign tax number
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowTaxNumberReason(!showTaxNumberReason)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      I DON'T HAVE A TAX NUMBER
                    </button>
                  </div>
                  <Controller
                    name="foreignTaxNumber"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          placeholder="Enter tax number"
                        />
                        {errors.foreignTaxNumber && (
                          <p className="text-sm text-red-500">
                            {errors.foreignTaxNumber.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Reason for not having tax number - conditional */}
              {showTaxNumberReason && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="reasonForNoTaxNumber">
                      Reason for not having a foreign tax number
                    </Label>
                    <Controller
                      name="reasonForNoTaxNumber"
                      control={control}
                      render={({ field }) => (
                        <>
                          <CustomSelect
                            value={(() => {
                              const found = reasonForNoTaxNumberOptions.find(
                                (opt) => opt.value === field.value
                              );
                              return found ? found : null;
                            })()}
                            onChange={(option: any) => {
                              const selected = Array.isArray(option) ? option[0] : option;
                              field.onChange(selected ? selected.value : "");
                            }}
                            options={reasonForNoTaxNumberOptions}
                            placeholder="Please select"
                          />
                          {errors.reasonForNoTaxNumber && (
                            <p className="text-sm text-red-500">
                              {errors.reasonForNoTaxNumber.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div></div>
                </div>
              )}

              {/* BBE Transaction and Funding Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="bbeTransaction">
                    BBE transaction (average monthly amount)
                  </Label>
                  <Controller
                    name="bbeTransaction"
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
                          placeholder="R"
                        />
                        {errors.bbeTransaction && (
                          <p className="text-sm text-red-500">
                            {errors.bbeTransaction.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

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
                          value={sourcOfFundsOptions.filter((opt) =>
                            field.value && field.value.includes(opt.value)
                          )}
                          onChange={(options: any) => {
                            const selected = Array.isArray(options) ? options : [];
                            field.onChange(selected.map((opt: any) => opt.value));
                          }}
                          options={sourcOfFundsOptions}
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

              {/* Irregular Income and Profit from Business */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="irregularIncome">
                    Irregular income (average monthly amount)
                  </Label>
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
                          placeholder="R"
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

                <div className="space-y-2">
                  <Label htmlFor="profitFromBusiness">
                    Profit from business activity (average monthly amount)
                  </Label>
                  <Controller
                    name="profitFromBusiness"
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
                          placeholder="R"
                        />
                        {errors.profitFromBusiness && (
                          <p className="text-sm text-red-500">
                            {errors.profitFromBusiness.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {/* Conditional Fields - Show when tax residency is No */}
          {taxResidencyOutsideSA === "no" && (
            <>
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
                          value={sourcOfFundsOptions.filter((opt) =>
                            field.value && field.value.includes(opt.value)
                          )}
                          onChange={(options: any) => {
                            const selected = Array.isArray(options) ? options : [];
                            field.onChange(selected.map((opt: any) => opt.value));
                          }}
                          options={sourcOfFundsOptions}
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

                {/* BBE Transaction */}
                <div className="space-y-2">
                  <Label htmlFor="bbeTransaction">
                    BBE transaction (average monthly amount)
                  </Label>
                  <Controller
                    name="bbeTransaction"
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
                          placeholder="R"
                        />
                        {errors.bbeTransaction && (
                          <p className="text-sm text-red-500">
                            {errors.bbeTransaction.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Profit and Irregular Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profit from Business Activity */}
                <div className="space-y-2">
                  <Label htmlFor="profitFromBusiness">
                    Profit from business activity (average monthly amount)
                  </Label>
                  <Controller
                    name="profitFromBusiness"
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
                          placeholder="R"
                        />
                        {errors.profitFromBusiness && (
                          <p className="text-sm text-red-500">
                            {errors.profitFromBusiness.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>

                {/* Irregular Income */}
                <div className="space-y-2">
                  <Label htmlFor="irregularIncome">
                    Irregular income (average monthly amount)
                  </Label>
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
                          placeholder="R"
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
            </>
          )}

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
