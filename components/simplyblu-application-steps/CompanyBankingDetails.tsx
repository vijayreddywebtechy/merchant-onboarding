"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bankingDetailsSchema } from "@/lib/validationSchemas";
import { merchantCommissionRates, bankNamesOptions, getBranchesForBank } from "@/lib/data";

type BankingDetailsData = {
  estimatedTurnover: string;
  bankName: string;
  accountHolderName: string;
  accountType: string;
  accountNumber: string;
  branchName: string;
  branchCode: string;
  selectedStandardBankAccount?: string; // For Standard Bank linked accounts
};

interface CompanyBankingDetailsProps {
  onNext?: (data: BankingDetailsData) => Promise<void>;
  onBack?: () => void;
}

// Valid Standard Bank product codes for cheque accounts
const VALID_SB_PRODUCT_CODES = ["4477", "69", "4478", "161", "4648", "200", "9258", "100", "129"];

// Product code to label mapping
const SB_PRODUCT_LABELS: Record<string, string> = {
  "4477": "Bizlaunch",
  "69": "BusinessLink Current Account",
  "4478": "Business Current Account",
  "161": "Legacy Business Current Account",
  "4648": "MYMoBiz Current Account",
  "200": "Personal Current Account",
  "9258": "Puresave",
  "100": "Save Business",
  "129": "Shari'ah Business Current Account",
};

// Account type options - will be filtered based on sole proprietor status
const allAccountTypeOptions = [
  { value: "Business Cheque Account", label: "Business Cheque Account" },
  { value: "Personal Cheque Account", label: "Personal Cheque Account" },
];

// Verification status type
type VerificationStatus = "idle" | "verifying" | "success" | "error";

// Standard Bank account type from API
interface StandardBankAccount {
  bankCtry: string;
  bankCtryiso: string;
  bankKey: string;
  bankAcct: string;
  ctrlKey: string;
  systemId: string;
  productId: string;
  credDebt: string;
  productDesc: string;
}

const CompanyBankingDetails = ({ onNext, onBack }: CompanyBankingDetailsProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  
  // New state for Standard Bank accounts
  const [standardBankAccounts, setStandardBankAccounts] = useState<StandardBankAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [hasStandardBankAccount, setHasStandardBankAccount] = useState<boolean | null>(null);
  const [isSoleProprietor, setIsSoleProprietor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
    setValue,
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
      selectedStandardBankAccount: "",
    },
  });

  // Fetch Standard Bank accounts on load
  useEffect(() => {
    const fetchStandardBankAccounts = async () => {
      setIsLoadingAccounts(true);
      
      // ========================================
      // MOCK DATA FLAG - Set to true for testing
      // Set to false to use real API
      // ========================================
      const USE_MOCK_DATA = true;
      
      if (USE_MOCK_DATA) {
        console.log("Using MOCK Standard Bank accounts data");
        
        // Mock Standard Bank accounts for testing
        const mockAccounts: StandardBankAccount[] = [
          {
            bankCtry: "ZA",
            bankCtryiso: "ZA",
            bankKey: "051001",
            bankAcct: "0000010008003236",
            ctrlKey: "00",
            systemId: "999",
            productId: "4477",
            credDebt: "B",
            productDesc: "Bizlaunch"
          },
          {
            bankCtry: "ZA",
            bankCtryiso: "ZA",
            bankKey: "051001",
            bankAcct: "0000062504789123",
            ctrlKey: "00",
            systemId: "999",
            productId: "4648",
            credDebt: "B",
            productDesc: "MYMoBiz Current Account"
          },
          {
            bankCtry: "ZA",
            bankCtryiso: "ZA",
            bankKey: "051001",
            bankAcct: "0000010006781916",
            ctrlKey: "00",
            systemId: "999",
            productId: "4478",
            credDebt: "B",
            productDesc: "Business Current Account"
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStandardBankAccounts(mockAccounts);
        setHasStandardBankAccount(true);
        setIsSoleProprietor(false);
        setIsLoadingAccounts(false);
        return;
      }
      // ========================================
      // END MOCK DATA
      // ========================================
      
      try {
        const merchantData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        const preAppResponse = merchantData.preApplicationResponse;
        const offerId = preAppResponse?.digitalOfferId;
        
        // Determine if sole proprietor
        const isSoleProp = merchantData.isSoleProprietor === true;
        setIsSoleProprietor(isSoleProp);
        
        // Get the appropriate GUID based on business type
        // For sole proprietor: use customer GUID (initiator GUID)
        // For other business types: use business GUID
        let partnerGuid = "";
        if (isSoleProp) {
          // Use the initiator/customer GUID
          partnerGuid = preAppResponse?.initiators?.[0]?.initiatorBPGUID || 
                        merchantData.customerDetails?.customer?.uuid || 
                        "";
        } else {
          // Use the business GUID
          partnerGuid = preAppResponse?.businessBPGUID || "";
        }
        
        console.log("Fetching Standard Bank accounts:", { partnerGuid, offerId, isSoleProp });
        
        if (!partnerGuid || !offerId) {
          console.log("Missing partnerGuid or offerId, skipping account fetch");
          setHasStandardBankAccount(false);
          setIsLoadingAccounts(false);
          return;
        }
        
        // Get access token
        let accessToken = "";
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            const parsed = JSON.parse(token);
            accessToken = parsed.access_token || token;
          } catch {
            accessToken = token;
          }
        }
        
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
        
        const response = await fetch(
          `/api/get-pay-account?partnerGuid=${partnerGuid}&offerId=${offerId}`,
          { method: "GET", headers }
        );
        
        const data = await response.json();
        console.log("Standard Bank accounts response:", data);
        
        if (data.accounts && Array.isArray(data.accounts)) {
          // Filter accounts to only include valid Standard Bank product codes
          const validAccounts = data.accounts.filter(
            (acc: StandardBankAccount) => VALID_SB_PRODUCT_CODES.includes(acc.productId)
          );
          
          console.log("Valid Standard Bank accounts:", validAccounts);
          
          setStandardBankAccounts(validAccounts);
          setHasStandardBankAccount(validAccounts.length > 0);
        } else {
          setStandardBankAccounts([]);
          setHasStandardBankAccount(false);
        }
      } catch (error) {
        console.error("Error fetching Standard Bank accounts:", error);
        setStandardBankAccounts([]);
        setHasStandardBankAccount(false);
      } finally {
        setIsLoadingAccounts(false);
      }
    };
    
    fetchStandardBankAccounts();
  }, []);

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
  const selectedBankName = watch("bankName");
  const selectedStandardBankAccount = watch("selectedStandardBankAccount");

  // Get branches for selected bank
  const availableBranches = useMemo(() => {
    if (!selectedBankName) return [];
    return getBranchesForBank(selectedBankName);
  }, [selectedBankName]);

  // Filter bank options - remove Standard Bank if no valid accounts
  const filteredBankOptions = useMemo(() => {
    if (hasStandardBankAccount === null) {
      // Still loading, show all options
      return bankNamesOptions;
    }
    
    if (!hasStandardBankAccount) {
      // No Standard Bank accounts, filter out Standard Bank
      return bankNamesOptions.filter(
        (opt) => opt.value !== "STANDARD BANK"
      );
    }
    
    return bankNamesOptions;
  }, [hasStandardBankAccount]);

  // Account type options - only Business Cheque for non-sole proprietors
  const accountTypeOptions = useMemo(() => {
    if (!isSoleProprietor) {
      // Non-sole proprietor: only Business Cheque Account
      return allAccountTypeOptions.filter(
        (opt) => opt.value === "Business Cheque Account"
      );
    }
    return allAccountTypeOptions;
  }, [isSoleProprietor]);

  // Standard Bank account options for dropdown
  const standardBankAccountOptions = useMemo(() => {
    return standardBankAccounts.map((acc) => ({
      value: acc.bankAcct,
      label: `${acc.bankAcct.replace(/^0+/, '')} - ${SB_PRODUCT_LABELS[acc.productId] || acc.productDesc}`,
      account: acc,
    }));
  }, [standardBankAccounts]);

  // Check if Standard Bank is selected and has linked accounts
  const isStandardBankWithAccounts = selectedBankName === "STANDARD BANK" && standardBankAccounts.length > 0;

  // Auto-fill account details when a Standard Bank account is selected
  useEffect(() => {
    if (selectedStandardBankAccount && isStandardBankWithAccounts) {
      const selectedAccount = standardBankAccounts.find(
        (acc) => acc.bankAcct === selectedStandardBankAccount
      );
      
      if (selectedAccount) {
        // Remove leading zeros from account number for display
        const accountNo = selectedAccount.bankAcct.replace(/^0+/, '');
        setValue("accountNumber", accountNo);
        setValue("branchCode", selectedAccount.bankKey);
        // Set account type based on product
        setValue("accountType", "Business Cheque Account");
      }
    }
  }, [selectedStandardBankAccount, isStandardBankWithAccounts, standardBankAccounts, setValue]);

  // Reset branch when bank changes
  useEffect(() => {
    setValue("branchName", "");
    setValue("branchCode", "");
  }, [selectedBankName, setValue]);

  const commissionRates = useMemo(() => {
    const isHighTurnover = Number(estimatedTurnoverValue) > 200_000;
    return isHighTurnover ? merchantCommissionRates.highTurnover : merchantCommissionRates.lowTurnover;
  }, [estimatedTurnoverValue]);

  // Reset verification status when bank details change
  useEffect(() => {
    setVerificationStatus("idle");
    setVerificationMessage("");
  }, [selectedBankName, watch("accountNumber"), watch("branchCode")]);

  // Verify bank account function
  const verifyBankAccount = async () => {
    const bankName = watch("bankName");
    const accountNumber = watch("accountNumber");
    const branchCode = watch("branchCode");
    const accountHolderName = watch("accountHolderName");

    if (!bankName || !accountNumber || !branchCode || !accountHolderName) {
      setVerificationStatus("error");
      setVerificationMessage("Please fill in all bank details before verifying.");
      return;
    }

    // Get ID number from localStorage
    const merchantData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    const personalData = JSON.parse(localStorage.getItem("personalDetailsFormData") || "{}");
    const idNumber = personalData.idNo || merchantData.businessDetails?.directorId || "";

    if (!idNumber) {
      setVerificationStatus("error");
      setVerificationMessage("ID number not found. Please complete personal details first.");
      return;
    }

    setVerificationStatus("verifying");
    setVerificationMessage("");

    try {
      // Get access token
      let accessToken = "";
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const parsed = JSON.parse(token);
          accessToken = parsed.access_token || token;
        } catch {
          accessToken = token;
        }
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const verificationPayload = {
        account_number: accountNumber,
        bank: bankName,
        branch_code: branchCode,
        id_number: idNumber,
        id_type: "01", // National ID
        account_name: accountHolderName,
      };

      console.log("Account Verification Payload:", verificationPayload);

      const response = await fetch("/api/verify-account", {
        method: "POST",
        headers,
        body: JSON.stringify(verificationPayload),
      });

      const data = await response.json();
      console.log("Account Verification Response:", data);

      if (response.ok && data.verified !== false) {
        setVerificationStatus("success");
        setVerificationMessage(data.message || "Bank account verified successfully!");
        // Store verified status
        localStorage.setItem("bankAccountVerified", "true");
      } else {
        setVerificationStatus("error");
        setVerificationMessage(data.message || data.error || "Bank account verification failed. Please check your details.");
        localStorage.setItem("bankAccountVerified", "false");
      }
    } catch (error: any) {
      console.error("Account verification error:", error);
      setVerificationStatus("error");
      setVerificationMessage(error.message || "An error occurred during verification. Please try again.");
      localStorage.setItem("bankAccountVerified", "false");
    }
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
              {isLoadingAccounts && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking for linked Standard Bank accounts...</span>
                </div>
              )}
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = filteredBankOptions.find(
                        (opt) => opt.value === field.value
                      );
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                      // Reset Standard Bank account selection when bank changes
                      setValue("selectedStandardBankAccount", "");
                    }}
                    options={filteredBankOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm">{errors.bankName.message as string}</p>
              )}
            </div>

            {/* Standard Bank Account Selection - Only show when Standard Bank is selected and has linked accounts */}
            {isStandardBankWithAccounts && (
              <div className="space-y-2">
                <Label htmlFor="selectedStandardBankAccount">Select your Standard Bank account</Label>
                <Controller
                  name="selectedStandardBankAccount"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      value={(() => {
                        const found = standardBankAccountOptions.find(
                          (opt) => opt.value === field.value
                        );
                        return found ? found : null;
                      })()}
                      onChange={(option) => {
                        const selected = Array.isArray(option) ? option[0] : option;
                        field.onChange(selected ? selected.value : "");
                      }}
                      options={standardBankAccountOptions}
                      placeholder="Select your account"
                    />
                  )}
                />
                <p className="text-sm text-gray-500">
                  Your linked Standard Bank accounts are shown above. Select one to auto-fill account details.
                </p>
              </div>
            )}

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
                readOnly={isStandardBankWithAccounts && !!selectedStandardBankAccount}
              />
              {isStandardBankWithAccounts && selectedStandardBankAccount && (
                <p className="text-sm text-gray-500">Account number auto-filled from selected Standard Bank account.</p>
              )}
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
                      // Match by label since we store the label in field.value
                      const found = availableBranches.find(
                        (opt) => opt.label === field.value || opt.value === field.value
                      );
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.label : "");
                      // Also set the branch code
                      setValue("branchCode", selected ? selected.value : "");
                    }}
                    options={availableBranches}
                    placeholder={selectedBankName ? "Please select" : "Select a bank first"}
                  />
                )}
              />
              {errors.branchName && (
                <p className="text-red-500 text-sm">{errors.branchName.message as string}</p>
              )}
              {!selectedBankName && (
                <p className="text-gray-500 text-sm">Please select a bank first</p>
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
                readOnly={isStandardBankWithAccounts && !!selectedStandardBankAccount}
              />
              {isStandardBankWithAccounts && selectedStandardBankAccount && (
                <p className="text-sm text-gray-500">Branch code auto-filled from selected Standard Bank account.</p>
              )}
              {errors.branchCode && (
                <p className="text-red-500 text-sm">{errors.branchCode.message as string}</p>
              )}
            </div>

            {/* Verify Account Button */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={verifyBankAccount}
                disabled={verificationStatus === "verifying"}
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                {verificationStatus === "verifying" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Bank Account"
                )}
              </Button>

              {/* Verification Status */}
              {verificationStatus === "success" && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">{verificationMessage}</span>
                </div>
              )}
              {verificationStatus === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm text-red-700">{verificationMessage}</span>
                </div>
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

            {/* Show rates based on bank selection */}
            <div className="bg-white border border-gray-200 rounded-md p-4 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">
                    Debit card transaction costs
                  </span>
                  <span className="text-sm text-gray-900">
                    {selectedBankName === "STANDARD BANK" ? commissionRates.sb.dr : commissionRates.nonSb.dr}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">
                    Credit card transaction costs
                  </span>
                  <span className="text-sm text-gray-900">
                    {selectedBankName === "STANDARD BANK" ? commissionRates.sb.cr : commissionRates.nonSb.cr}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">
                    International transaction costs
                  </span>
                  <span className="text-sm text-gray-900">
                    {selectedBankName === "STANDARD BANK" ? commissionRates.sb.fr : commissionRates.nonSb.fr}%
                  </span>
                </div>
              </div>
            </div>

            {/* Show Standard Bank rates as incentive only when non-SB bank selected */}
            {selectedBankName !== "STANDARD BANK" && (
              <>
                <div className="flex items-center gap-2 !mt-6">
                  <h3 className="text-sm font-medium text-primary uppercase tracking-wide">
                    Rates for Standard Bank Account Holders
                  </h3>
                </div>
                <div className="bg-white border border-gray-200 rounded-md p-4 space-y-6 relative">
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
              </>
            )}
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
