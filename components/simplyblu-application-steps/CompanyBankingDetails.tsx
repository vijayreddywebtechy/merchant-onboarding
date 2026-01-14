import React, { useState, ChangeEvent } from "react";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BankingDetailsData {
  estimatedTurnover: string;
  bankName: string;
  accountHolderName: string;
  accountType: string;
  accountNumber: string;
  branchName: string;
  branchCode: string;
}

type Props = {};

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

const CompanyBankingDetails = (props: Props) => {
  const [formData, setFormData] = useState<BankingDetailsData>({
    estimatedTurnover: "R 300 000",
    bankName: "Nedbank",
    accountHolderName: "e.g John Doe",
    accountType: "",
    accountNumber: "e.g 51234652",
    branchName: "",
    branchCode: "0123456",
  });

  const [showAccountTypes, setShowAccountTypes] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankNameChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      bankName: selected ? selected.value : "",
    }));
  };

  const handleBranchNameChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      branchName: selected ? selected.value : "",
    }));
  };

  const handleAccountTypeChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      accountType: selected ? selected.value : "",
    }));
  };

  const handleAccountTypeSelect = (type: string): void => {
    setFormData((prev) => ({
      ...prev,
      accountType: type,
    }));
    setShowAccountTypes(false);
  };
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
                name="estimatedTurnover"
                value={formData.estimatedTurnover}
                onChange={handleInputChange}
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">
                Bank name
              </Label>
              <CustomSelect
                value={(() => {
                  const found = bankNameOptions.find(
                    (opt) => opt.value === formData.bankName
                  );
                  return found ? found : null;
                })()}
                onChange={handleBankNameChange}
                options={bankNameOptions}
                placeholder="Please select"
              />
            </div>

            {/* Account Holder's Name */}
            <div className="space-y-2">
              <Label
                htmlFor="accountHolderName"

              >
                Account holder's name
              </Label>
              <Input
                type="text"
                id="accountHolderName"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleInputChange}
              />
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="accountType">
                Account type
              </Label>
              <CustomSelect
                value={(() => {
                  const found = accountTypeOptions.find(
                    (opt) => opt.value === formData.accountType
                  );
                  return found ? found : null;
                })()}
                onChange={handleAccountTypeChange}
                options={accountTypeOptions}
                placeholder="Please select"
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                Account number
              </Label>
              <Input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
              />
            </div>

            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="branchName">
                Branch name
              </Label>
              <CustomSelect
                value={(() => {
                  const found = branchNameOptions.find(
                    (opt) => opt.value === formData.branchName
                  );
                  return found ? found : null;
                })()}
                onChange={handleBranchNameChange}
                options={branchNameOptions}
                placeholder="Please select"
              />
            </div>

            {/* Branch Code */}
            <div className="space-y-2">
              <Label htmlFor="branchCode">
                Branch code
              </Label>
              <Input
                type="text"
                id="branchCode"
                name="branchCode"
                value={formData.branchCode}
                onChange={handleInputChange}
              />
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
                  <span className="text-sm text-gray-900">0.5%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">
                    Credit card transaction costs
                  </span>
                  <span className="text-sm text-gray-900">1.84%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">
                    International transaction costs
                  </span>
                  <span className="text-sm text-gray-900">3.00%</span>
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
                    <span className="text-sm text-gray-900">0.5%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-700">
                      Credit card transaction costs
                    </span>
                    <span className="text-sm text-gray-900">1.4%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-700">
                      International transaction costs
                    </span>
                    <span className="text-sm text-gray-900">1.00%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className="flex flex-col md:flex-row gap-3 !mt-12">
            <Button variant="outline" className="w-full md:max-w-40">Back</Button>
            <Button className="w-full md:max-w-40">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyBankingDetails;
