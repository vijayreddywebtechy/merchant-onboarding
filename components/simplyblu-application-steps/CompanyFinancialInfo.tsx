"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Info, XCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepFooter } from "@/components/dynamic/StepFooter";
import { companyFinancialInfoSchema } from "@/lib/validationSchemas";
import { amountRangeOptions } from "@/lib/data_copy";
import { entClassifOptions, countryOptions, sourcOfFundsOptions, taxTypeOptions } from "@/lib/data";

// Reason for not having tax number options
const reasonForNoTaxNumberOptions = [
  { value: "not-required", label: "Not required in my country" },
  { value: "in-process", label: "Application in process" },
  { value: "exempt", label: "Exempt from tax registration" },
  { value: "other", label: "Other" },
];

// Type for a single country tax entry
type CountryTaxEntry = {
  country: string;
  taxNumber: string;
  noTaxNumberReason: string;
  showNoTaxReason: boolean;
};

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
  // Multiple countries support
  taxCountries: CountryTaxEntry[];
  // Deprecated but kept for backwards compatibility
  countryOfTaxResidency: string;
  foreignTaxNumber: string;
  reasonForNoTaxNumber: string;
  passiveIncomeQuestion: string;
  // Track which optional fields are visible
  showBbeTransaction: boolean;
  showIrregularIncome: boolean;
  showProfitFromBusiness: boolean;
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
    setValue,
    getValues,
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
      taxCountries: [{ country: "", taxNumber: "", noTaxNumberReason: "", showNoTaxReason: false }],
      countryOfTaxResidency: "",
      foreignTaxNumber: "",
      reasonForNoTaxNumber: "",
      passiveIncomeQuestion: "",
      showBbeTransaction: true,
      showIrregularIncome: true,
      showProfitFromBusiness: true,
    },
  });

  // Field array for managing multiple tax countries
  const { fields: taxCountryFields, append: appendCountry, remove: removeCountry } = useFieldArray({
    control,
    name: "taxCountries",
  });

  React.useEffect(() => {
    const data = localStorage.getItem("companyFinancialInfoFormData");
    if (data) {
      const parsedData = JSON.parse(data);
      // Ensure visibility flags default to true if not present in saved data
      reset({
        ...parsedData,
        showBbeTransaction: parsedData.showBbeTransaction !== false,
        showIrregularIncome: parsedData.showIrregularIncome !== false,
        showProfitFromBusiness: parsedData.showProfitFromBusiness !== false,
        taxCountries: parsedData.taxCountries || [{ country: "", taxNumber: "", noTaxNumberReason: "", showNoTaxReason: false }],
      });
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
          entityClassification: "",
          taxResidencyOutsideSA: "",
          bbeTransaction: "",
          profitFromBusiness: "",
          taxCountries: [{ country: "", taxNumber: "", noTaxNumberReason: "", showNoTaxReason: false }],
          countryOfTaxResidency: "",
          foreignTaxNumber: "",
          reasonForNoTaxNumber: "",
          passiveIncomeQuestion: "",
          showBbeTransaction: true,
          showIrregularIncome: true,
          showProfitFromBusiness: true,
        });
      }
    }
  }, [reset]);

  const fundingSource = watch("fundingSource");
  const taxResidencyOutsideSA = watch("taxResidencyOutsideSA");
  const entityClassification = watch("entityClassification");
  // Default to true if undefined (for backwards compatibility with old saved data)
  const showBbeTransaction = watch("showBbeTransaction") !== false;
  const showIrregularIncome = watch("showIrregularIncome") !== false;
  const showProfitFromBusiness = watch("showProfitFromBusiness") !== false;
  const taxCountries = watch("taxCountries");

  // Helper function to toggle no tax reason for a specific country
  const toggleNoTaxReason = (index: number) => {
    const countries = getValues("taxCountries");
    if (countries[index]) {
      setValue(`taxCountries.${index}.showNoTaxReason`, !countries[index].showNoTaxReason);
    }
  };

  // Helper function to add a new country
  const handleAddCountry = () => {
    appendCountry({ country: "", taxNumber: "", noTaxNumberReason: "", showNoTaxReason: false });
  };

  // Helper function to remove a country (keep at least one)
  const handleRemoveCountry = (index: number) => {
    if (taxCountryFields.length > 1) {
      removeCountry(index);
    }
  };

  // Save form data in real-time to localStorage
  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("companyFinancialInfoFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);



  return (
    <form onSubmit={handleSubmit(() => { if (onNext) onNext(); })} className="py-6 md:py-8">
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
              <Label htmlFor="entityClassification" className="uppercase text-xs font-medium tracking-wider text-gray-600">Entity classification</Label>
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

            {/* Financial Institution - Passive Income Question Panel */}
            {entityClassification === "FI" && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
                <div className="flex items-start gap-2">
                  <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <h3 className="font-medium text-gray-800 uppercase text-sm tracking-wide">
                    Does your company
                  </h3>
                </div>
                
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▲</span>
                    <span>Earn more than 50% of its gross income from passive sources such as interest, dividends, royalties, etc.?</span>
                  </li>
                  <li className="text-center font-medium text-gray-500">OR</li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">▲</span>
                    <span>Hold more than 50% of its assets to generate passive income such as interest, dividends, royalties, etc.?</span>
                  </li>
                </ul>

                <Controller
                  name="passiveIncomeQuestion"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                      className="flex gap-6 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="passive-income-yes" />
                        <Label htmlFor="passive-income-yes" className="cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="passive-income-no" />
                        <Label htmlFor="passive-income-no" className="cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            )}
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
              {/* Multiple Countries Tax Residency */}
              {taxCountryFields.map((field, index) => (
                <div key={field.id} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Country of Tax Residency */}
                    <div className="space-y-2">
                      <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
                        Country of tax residency
                      </Label>
                      <Controller
                        name={`taxCountries.${index}.country`}
                        control={control}
                        render={({ field }) => (
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
                        )}
                      />
                    </div>

                    {/* Foreign Tax Number */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
                          Foreign tax number
                        </Label>
                        <button
                          type="button"
                          onClick={() => toggleNoTaxReason(index)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          I DON'T HAVE A TAX NUMBER
                        </button>
                      </div>
                      <Controller
                        name={`taxCountries.${index}.taxNumber`}
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            value={(() => {
                              const found = taxTypeOptions.find(
                                (opt) => opt.value === field.value
                              );
                              return found ? found : null;
                            })()}
                            onChange={(option: any) => {
                              const selected = Array.isArray(option) ? option[0] : option;
                              field.onChange(selected ? selected.value : "");
                            }}
                            options={taxTypeOptions}
                            placeholder="Please select"
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Remove country button (only show if more than one country) */}
                  {taxCountryFields.length > 1 && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveCountry(index)}
                        className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <XCircle size={16} />
                        Remove this country
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Additional Country Button */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleAddCountry}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
                >
                  <PlusCircle size={18} />
                  ADD ADDITIONAL COUNTRY
                </button>
              </div>

              {/* Row: Reason for not having tax number + BBE Transaction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Reason for not having a foreign tax number - shown when any country has it enabled */}
                {taxCountries?.some(c => c.showNoTaxReason) && (
                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
                        Reason for not having a foreign tax number
                      </Label>
                      <button
                        type="button"
                        onClick={() => {
                          // Hide all no tax reasons
                          taxCountries?.forEach((_, idx) => {
                            setValue(`taxCountries.${idx}.showNoTaxReason`, false);
                          });
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                    <Controller
                      name="taxCountries.0.noTaxNumberReason"
                      control={control}
                      render={({ field }) => (
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
                      )}
                    />
                  </div>
                )}

                {/* BBE Transaction with X button */}
                {showBbeTransaction && (
                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
                        BBE transaction (average monthly amount)
                      </Label>
                      <button
                        type="button"
                        onClick={() => setValue("showBbeTransaction", false)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
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
                )}
              </div>

              {/* Row: Funding Source + Irregular Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
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

                {/* Irregular Income */}
                {showIrregularIncome && (
                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
                        Irregular income (average monthly amount)
                      </Label>
                      <button
                        type="button"
                        onClick={() => setValue("showIrregularIncome", false)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
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
                )}
              </div>

              {/* Row: Profit from Business Activity (alone) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profit from Business Activity */}
                {showProfitFromBusiness && (
                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
                        Profit from business activity (average monthly amount)
                      </Label>
                      <button
                        type="button"
                        onClick={() => setValue("showProfitFromBusiness", false)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
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
                )}
              </div>
            </>
          )}

          {/* Conditional Fields - Show when tax residency is No */}
          {taxResidencyOutsideSA === "no" && (
            <>
              {/* Row: Funding Source + BBE Transaction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
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

                {/* BBE Transaction - No X button when Tax Residency = No */}
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
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

              {/* Row: Profit + Irregular Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profit from Business Activity - No X button when Tax Residency = No */}
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
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

                {/* Irregular Income - No X button when Tax Residency = No */}
                <div className="space-y-2">
                  <Label className="uppercase text-xs font-medium tracking-wider text-gray-600">
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

        <StepFooter 
          onBack={onBack}
          isLoading={isValidating}
        />
      </div>
    </form>
  );
}

export default CompanyFinancialInfo;
