import React, { useState } from "react";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancialData {
  entityClassification: string;
  taxResidencyOutsideSA: string;
  fundingSource: string[];
  bbeTransaction: string;
  profitFromBusiness: string;
  irregularIncome: string;
  countryOfTaxResidency: string;
  foreignTaxNumber: string;
  reasonForNoTaxNumber: string;
}

type Props = {};

// Entity Classification options
const entityClassificationOptions = [
  { value: "sole-proprietor", label: "Sole Proprietor" },
  { value: "partnership", label: "Partnership" },
  { value: "private-company", label: "Private Company" },
  { value: "public-company", label: "Public Company" },
  { value: "non-profit", label: "Non-Profit Organization" },
  { value: "trust", label: "Trust" },
];

// Funding Source options
const fundingSourceOptions = [
  { value: "personal-savings", label: "Personal Savings" },
  { value: "bank-loan", label: "Bank Loan" },
  { value: "investors", label: "Investors" },
  { value: "grants", label: "Grants" },
  { value: "family-friends", label: "Family and Friends" },
  { value: "business-revenue", label: "Business Revenue" },
];

// Amount range options for financial fields
const amountOptions = [
  { value: "R 0 - R 5,000", label: "R 0 - R 5,000" },
  { value: "R 5,001 - R 10,000", label: "R 5,001 - R 10,000" },
  { value: "R 10,001 - R 25,000", label: "R 10,001 - R 25,000" },
  { value: "R 25,001 - R 50,000", label: "R 25,001 - R 50,000" },
  { value: "R 50,001 - R 100,000", label: "R 50,001 - R 100,000" },
  { value: "R 100,001+", label: "R 100,001+" },
];

// Country options
const countryOptions = [
  { value: "south-africa", label: "South Africa" },
  { value: "united-states", label: "United States" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "australia", label: "Australia" },
  { value: "canada", label: "Canada" },
];

// Reason for not having tax number options
const reasonForNoTaxNumberOptions = [
  { value: "not-required", label: "Not required in my country" },
  { value: "in-process", label: "Application in process" },
  { value: "exempt", label: "Exempt from tax registration" },
  { value: "other", label: "Other" },
];

function CompanyFinancialInfo({}: Props) {
  const [formData, setFormData] = useState<FinancialData>({
    entityClassification: "",
    taxResidencyOutsideSA: "",
    fundingSource: [],
    bbeTransaction: "",
    profitFromBusiness: "",
    irregularIncome: "",
    countryOfTaxResidency: "",
    foreignTaxNumber: "",
    reasonForNoTaxNumber: "",
  });

  const [showTaxNumberReason, setShowTaxNumberReason] = useState(false);

  const handleEntityClassificationChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      entityClassification: selected ? selected.value : "",
    }));
  };

  const handleFundingSourceChange = (options: any) => {
    const selected = Array.isArray(options) ? options : [];
    setFormData((prev) => ({
      ...prev,
      fundingSource: selected.map((opt: any) => opt.value),
    }));
  };

  const handleBBETransactionChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      bbeTransaction: selected ? selected.value : "",
    }));
  };

  const handleProfitFromBusinessChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      profitFromBusiness: selected ? selected.value : "",
    }));
  };

  const handleIrregularIncomeChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      irregularIncome: selected ? selected.value : "",
    }));
  };

  const handleCountryOfTaxResidencyChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      countryOfTaxResidency: selected ? selected.value : "",
    }));
  };

  const handleReasonForNoTaxNumberChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      reasonForNoTaxNumber: selected ? selected.value : "",
    }));
  };

  const handleRadioChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
              <Label htmlFor="entityClassification">
                Entity classification
              </Label>
              <CustomSelect
                value={(() => {
                  const found = entityClassificationOptions.find(
                    (opt) => opt.value === formData.entityClassification
                  );
                  return found ? found : null;
                })()}
                onChange={handleEntityClassificationChange}
                options={entityClassificationOptions}
                placeholder="Please select"
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
              <RadioGroup
                value={formData.taxResidencyOutsideSA}
                onValueChange={(value) =>
                  handleRadioChange("taxResidencyOutsideSA", value)
                }
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
            </div>
          </div>

          {/* Conditional Fields - Show when tax residency is Yes */}
          {formData.taxResidencyOutsideSA === "yes" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Country of Tax Residency */}
                <div className="space-y-2">
                  <Label htmlFor="countryOfTaxResidency">
                    Country of tax residency
                  </Label>
                  <CustomSelect
                    value={(() => {
                      const found = countryOptions.find(
                        (opt) => opt.value === formData.countryOfTaxResidency
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleCountryOfTaxResidencyChange}
                    options={countryOptions}
                    placeholder="Please select"
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
                  <CustomSelect
                    value={null}
                    onChange={() => {}}
                    options={[]}
                    placeholder="Please select"
                  />
                </div>
              </div>

              {/* Add Additional Country */}
              <div className="mb-6">
                <button
                  type="button"
                  className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">+</span>
                  ADD ADDITIONAL COUNTRY
                </button>
              </div>

              {/* Reason for not having tax number - conditional */}
              {showTaxNumberReason && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="reasonForNoTaxNumber">
                      Reason for not having a foreign tax number
                    </Label>
                    <CustomSelect
                      value={(() => {
                        const found = reasonForNoTaxNumberOptions.find(
                          (opt) => opt.value === formData.reasonForNoTaxNumber
                        );
                        return found ? found : null;
                      })()}
                      onChange={handleReasonForNoTaxNumberChange}
                      options={reasonForNoTaxNumberOptions}
                      placeholder="Please select"
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
                  <CustomSelect
                    value={(() => {
                      const found = amountOptions.find(
                        (opt) => opt.value === formData.bbeTransaction
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleBBETransactionChange}
                    options={amountOptions}
                    placeholder="R"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingSource">
                    How are you funding your business (choose one or more)
                  </Label>
                  <CustomSelect
                    value={fundingSourceOptions.filter((opt) =>
                      formData.fundingSource.includes(opt.value)
                    )}
                    onChange={handleFundingSourceChange}
                    options={fundingSourceOptions}
                    placeholder="Please select"
                    isMulti={true}
                  />
                </div>
              </div>

              {/* Irregular Income and Profit from Business */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="irregularIncome">
                    Irregular income (average monthly amount)
                  </Label>
                  <CustomSelect
                    value={(() => {
                      const found = amountOptions.find(
                        (opt) => opt.value === formData.irregularIncome
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleIrregularIncomeChange}
                    options={amountOptions}
                    placeholder="R"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profitFromBusiness">
                    Profit from business activity (average monthly amount)
                  </Label>
                  <CustomSelect
                    value={(() => {
                      const found = amountOptions.find(
                        (opt) => opt.value === formData.profitFromBusiness
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleProfitFromBusinessChange}
                    options={amountOptions}
                    placeholder="R"
                  />
                </div>
              </div>
            </>
          )}

          {/* Conditional Fields - Show when tax residency is No */}
          {formData.taxResidencyOutsideSA === "no" && (
            <>
              {/* Funding Source */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="fundingSource">
                    How are you funding your business (choose one or more)
                  </Label>
                  <CustomSelect
                    value={fundingSourceOptions.filter((opt) =>
                      formData.fundingSource.includes(opt.value)
                    )}
                    onChange={handleFundingSourceChange}
                    options={fundingSourceOptions}
                    placeholder="Please select"
                    isMulti={true}
                  />
                </div>

                {/* BBE Transaction */}
                <div className="space-y-2">
                  <Label htmlFor="bbeTransaction">
                    BBE transaction (average monthly amount)
                  </Label>
                  <CustomSelect
                    value={(() => {
                      const found = amountOptions.find(
                        (opt) => opt.value === formData.bbeTransaction
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleBBETransactionChange}
                    options={amountOptions}
                    placeholder="R"
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
                  <CustomSelect
                    value={(() => {
                      const found = amountOptions.find(
                        (opt) => opt.value === formData.profitFromBusiness
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleProfitFromBusinessChange}
                    options={amountOptions}
                    placeholder="R"
                  />
                </div>

                {/* Irregular Income */}
                <div className="space-y-2">
                  <Label htmlFor="irregularIncome">
                    Irregular income (average monthly amount)
                  </Label>
                  <CustomSelect
                    value={(() => {
                      const found = amountOptions.find(
                        (opt) => opt.value === formData.irregularIncome
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleIrregularIncomeChange}
                    options={amountOptions}
                    placeholder="R"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-3 !mt-12">
            <Button variant="outline" className="w-full md:max-w-40">Back</Button>
            <Button className="w-full md:max-w-40">Next</Button>
        </div>
      </div>
    </div>
  );
}

export default CompanyFinancialInfo;
