"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bankingDetailsSchema } from "@/lib/validationSchemas";
import { merchantCommissionRates } from "@/lib/data";

type BankingDetailsData = {
  estimatedTurnover: string;
  bankName: string;
  accountHolderName: string;
  accountType: string;
  accountNumber: string;
  branchName: string;
  branchCode: string;
};

interface CompanyBankingDetailsProps {
  onNext?: (data: BankingDetailsData) => Promise<void>;
  onBack?: () => void;
}

// Bank name options
const bankNameOptions = [
  { value: "Nedbank", label: "Nedbank" },
  { value: "Standard Bank", label: "Standard Bank" },
  { value: "FNB", label: "FNB" },
  { value: "ABSA", label: "ABSA" },
  { value: "Capitec", label: "Capitec" },
];

// Branch name options
const branchNameOptions = [
  { value: "Sandton", label: "Sandton" },
  { value: "Rosebank", label: "Rosebank" },
  { value: "Pretoria", label: "Pretoria" },
  { value: "Cape Town", label: "Cape Town" },
];

// Account type options
const accountTypeOptions = [
  { value: "Business Cheque Account", label: "Business Cheque Account" },
  { value: "Personal Cheque Account", label: "Personal Cheque Account" },
];

const CompanyBankingDetails = ({ onNext, onBack }: CompanyBankingDetailsProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(bankingDetailsSchema) as any,
    mode: "onChange",
    defaultValues: {
      estimatedTurnover: "",
      bankName: "",
      accountHolderName: "",
      accountType: "",
      accountNumber: "",
      branchName: "",
      branchCode: "",
    },
  });

  React.useEffect(() => {
    const data = localStorage.getItem("companyBankingDetailsFormData");
    if (data) {
      reset(JSON.parse(data));
    }
  }, [reset]);

  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("companyBankingDetailsFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Expose validation through window object for Stepper to call
  useEffect(() => {
    (window as any).__bankingDetailsValidate = async () => {
      const isValid = await new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
      return isValid;
    };
  }, [handleSubmit]);

  const estimatedTurnoverValue = watch("estimatedTurnover");

  const commissionRates = useMemo(() => {
    const isHighTurnover = Number(estimatedTurnoverValue) > 200_000;
    return isHighTurnover ? merchantCommissionRates.highTurnover : merchantCommissionRates.lowTurnover;
  }, [estimatedTurnoverValue]);

  return (
    <div className="py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}

        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
            Company banking details
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            We'll deposit your daily sales into this bank account. Enjoy better
            rates when you settle into a Standard Bank account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-9">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Estimated Annual Turnover */}
            <div className="space-y-2">
              <Label
                htmlFor="estimatedTurnover"
                className="text-sm text-gray-700"
              >
                What is the estimated annual turnover on your card machine(s)?
              </Label>
              <Input
                type="text"
                id="estimatedTurnover"
                {...register("estimatedTurnover")}
                className={errors.estimatedTurnover ? "border-red-500" : ""}
              />
              {errors.estimatedTurnover && (
                <p className="text-red-500 text-sm">{errors.estimatedTurnover.message as string}</p>
              )}
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank name</Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = bankNameOptions.find(
                        (opt) => opt.value === field.value
                      );
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={bankNameOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm">{errors.bankName.message as string}</p>
              )}
            </div>

            {/* Account Holder's Name */}
            <div className="space-y-2">
              <Label htmlFor="accountHolderName">Account holder's name</Label>
              <Input
                type="text"
                id="accountHolderName"
                {...register("accountHolderName")}
                className={errors.accountHolderName ? "border-red-500" : ""}
              />
              {errors.accountHolderName && (
                <p className="text-red-500 text-sm">{errors.accountHolderName.message as string}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="accountType">Account type</Label>
              <Controller
                name="accountType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = accountTypeOptions.find(
                        (opt) => opt.value === field.value
                      );
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={accountTypeOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.accountType && (
                <p className="text-red-500 text-sm">{errors.accountType.message as string}</p>
              )}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account number</Label>
              <Input
                type="text"
                id="accountNumber"
                {...register("accountNumber")}
                className={errors.accountNumber ? "border-red-500" : ""}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm">{errors.accountNumber.message as string}</p>
              )}
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch name</Label>
              <Controller
                name="branchName"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = branchNameOptions.find(
                        (opt) => opt.value === field.value
                      );
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={branchNameOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.branchName && (
                <p className="text-red-500 text-sm">{errors.branchName.message as string}</p>
              )}
            </div>

            {/* Branch Code */}
            <div className="space-y-2">
              <Label htmlFor="branchCode">Branch code</Label>
              <Input
                type="text"
                id="branchCode"
                {...register("branchCode")}
                className={errors.branchCode ? "border-red-500" : ""}
              />
              {errors.branchCode && (
                <p className="text-red-500 text-sm">{errors.branchCode.message as string}</p>
              )}
            </div>

            {/* Please Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Info size={20} className="text-white fill-primary-dark" />
                </div>
                <div className="text-sm text-blue-900 space-y-1">
                  <p className="font-medium">Please note:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Savings accounts are not permitted</li>
                    <li>
                      Personal bank accounts are only permitted if your company
                      is a sole proprietor
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Commission Rates */}
          <div className="space-y-3">
            <div className="bg-gradient-to-tr from-blue-950 via-blue-900 to-blue-800 text-white rounded-md p-6">
              <h2 className="text-xl">Merchant commission rates</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-md p-4 space-y-6">
              {/* Standard Rates */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">
                    Debit card transaction costs
                  </span>
                  <span className="text-sm text-gray-900">{commissionRates.nonSb.dr}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">
                    Credit card transaction costs
                  </span>
                  <span className="text-sm text-gray-900">{commissionRates.nonSb.cr}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">
                    International transaction costs
                  </span>
                  <span className="text-sm text-gray-900">{commissionRates.nonSb.fr}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 !mt-6">
              <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
                Rates for Standard Bank Account Holders
              </h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-4 space-y-6 relative">
              {/* Standard Bank Account Holders */}
              <div>
                <div className="absolute top-0 left-0 bg-gradient-to-tr from-primary to-primary-light text-white text-xs px-3 py-1 rounded-br-2xl inline-block mb-4">
                  Discounted rates
                </div>

                <div className="space-y-3 mt-5">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-700">
                      Debit card transaction costs
                    </span>
                    <span className="text-sm text-gray-900">{commissionRates.sb.dr}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-700">
                      Credit card transaction costs
                    </span>
                    <span className="text-sm text-gray-900">{commissionRates.sb.cr}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-700">
                      International transaction costs
                    </span>
                    <span className="text-sm text-gray-900">{commissionRates.sb.fr}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 !mt-12">
          {onBack && (
            <Button variant="outline" className="w-full md:max-w-40" onClick={onBack} type="button">
              Back
            </Button>
          )}
          <Button
            className="w-full md:max-w-40 ml-auto"
            onClick={async () => {
              const isValid = await (window as any).__bankingDetailsValidate?.();
              if (isValid && onNext) {
                const data = localStorage.getItem("companyBankingDetailsFormData");
                if (data) await onNext(JSON.parse(data));
              }
            }}
            type="button"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyBankingDetails;
