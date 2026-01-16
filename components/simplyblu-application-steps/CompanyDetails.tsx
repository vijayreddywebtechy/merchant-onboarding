"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { companyDetailsSchema } from "@/lib/validationSchemas";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { transformCompanyDetailsToAPI } from "@/lib/apiTransformers";
import {
  provinceOptions,
  cityOptions,
  businessNatureOptions,
  businessIndustryOptions,
} from "@/lib/data";

type CompanyDetailsData = {
  registeredCompanyName: string;
  countryOfRegistration: string;
  addressType: "same" | "different";
  addressSearch?: string;
  streetNumber?: string;
  suburb?: string;
  complexName?: string | null;
  province?: string;
  cityTown?: string;
  postalCode?: string;
  natureOfBusiness: string;
  industryClassification: string;
  preferredBranch?: string | null;
  ownership: string;
  hasValidBBBEE: string;
};

interface CompanyDetailsProps {
  onNext?: (data: CompanyDetailsData) => Promise<void>;
  onBack?: () => void;
}

// City/Town options for CustomSelect
const cityTownOptions = [
  { value: 'johannesburg', label: 'Johannesburg' },
  { value: 'pretoria', label: 'Pretoria' },
  { value: 'cape-town', label: 'Cape Town' },
  { value: 'durban', label: 'Durban' },
];

// Preferred Branch options
const preferredBranchOptions = [
  { value: 'sandton', label: 'Sandton' },
  { value: 'rosebank', label: 'Rosebank' },
  { value: 'pretoria', label: 'Pretoria' },
  { value: 'cape-town', label: 'Cape Town' },
];

// Ownership options
const ownershipOptions = [
  { value: 'sole-proprietor', label: 'Sole Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'company', label: 'Company' },
];

function CompanyDetails({ onNext, onBack }: CompanyDetailsProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [residentialAddress, setResidentialAddress] = React.useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: updateCompanyDetails } = useCustomMutation({
    url: `/api/company-details`,
    method: "PUT",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(companyDetailsSchema) as any,
    mode: "onChange",
    defaultValues: {
      registeredCompanyName: "ABC Consulting",
      countryOfRegistration: "South Africa",
      addressType: "different",
      addressSearch: "",
      streetNumber: "",
      suburb: "",
      complexName: "",
      province: "",
      cityTown: "",
      postalCode: "",
      natureOfBusiness: "",
      industryClassification: "",
      preferredBranch: "",
      ownership: "",
      hasValidBBBEE: "",
    },
  });

  React.useEffect(() => {
    // Load saved company details first
    const data = localStorage.getItem("companyDetailsFormData");
    if (data) {
      reset(JSON.parse(data));
    } else {
      // If no saved data, try to prefill from merchantOnboardingData
      const merchantData = localStorage.getItem("merchantOnboardingData");
      if (merchantData) {
        const parsed = JSON.parse(merchantData);
        const businessDetails = parsed.businessDetails;
        const companyInfo = parsed.companyInfo?.COMPANY_DATA?.Registration;
        const selectedCompany = parsed.selectedCompany;
        const isSoleProprietor = parsed.isSoleProprietor;
        
        // Determine company name and address based on type
        const companyName = isSoleProprietor 
          ? businessDetails?.directorId || ""
          : (companyInfo?.ENT_NAME || selectedCompany?.name || "");
        
        const address = companyInfo || {};
        
        reset({
          registeredCompanyName: companyName,
          countryOfRegistration: "South Africa",
          addressType: "different",
          addressSearch: "",
          streetNumber: address.PHYS_ADDR_1 || "",
          suburb: address.PHYS_ADDR_2 || "",
          complexName: "",
          province: businessDetails?.province || address.REGION_CODE?.toLowerCase() || "",
          cityTown: address.PHYS_ADDR_2 || "",
          postalCode: address.PHYS_CODE || "",
          natureOfBusiness: address.SICC_DESCRIPTION || "",
          industryClassification: "",
          preferredBranch: "",
          ownership: isSoleProprietor ? "sole-proprietor" : "company",
          hasValidBBBEE: "",
        });
      }
    }

    // Load residential address from PersonalInfo
    const personalData = localStorage.getItem("personalDetailsFormData");
    if (personalData) {
      setResidentialAddress(JSON.parse(personalData));
    }
  }, [reset]);

  const addressType = watch("addressType");

  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      // Always save with merged residential address data when addressType is "same"
      if (data.addressType === "same" && residentialAddress) {
        const companyData = {
          ...data,
          streetNumber: residentialAddress.street || data.streetNumber,
          suburb: residentialAddress.suburb || data.suburb,
          complexName: residentialAddress.buildingName || data.complexName,
          province: residentialAddress.province || data.province,
          cityTown: residentialAddress.city || data.cityTown,
          postalCode: residentialAddress.postalCode || data.postalCode,
        };
        localStorage.setItem("companyDetailsFormData", JSON.stringify(companyData));
      } else {
        localStorage.setItem("companyDetailsFormData", JSON.stringify(data));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, residentialAddress]);

  // Also save immediately when residentialAddress loads (for initial state)
  useEffect(() => {
    if (residentialAddress) {
      const currentData = watch();
      if (currentData.addressType === "same") {
        const companyData = {
          ...currentData,
          streetNumber: residentialAddress.street || currentData.streetNumber,
          suburb: residentialAddress.suburb || currentData.suburb,
          complexName: residentialAddress.buildingName || currentData.complexName,
          province: residentialAddress.province || currentData.province,
          cityTown: residentialAddress.city || currentData.cityTown,
          postalCode: residentialAddress.postalCode || currentData.postalCode,
        };
        localStorage.setItem("companyDetailsFormData", JSON.stringify(companyData));
      }
    }
  }, [residentialAddress, watch]);

  // Expose validation through window object for Stepper to call
  useEffect(() => {
    (window as any).__companyDetailsValidate = async () => {
      const isValid = await new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
      return isValid;
    };
  }, [handleSubmit]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    console.log("Company details submitted:", data);

    // Merge residential address data if addressType is "same"
    let finalData = data;
    if (data.addressType === "same" && residentialAddress) {
      finalData = {
        ...data,
        streetNumber: residentialAddress.street || data.streetNumber,
        suburb: residentialAddress.suburb || data.suburb,
        complexName: residentialAddress.buildingName || data.complexName,
        province: residentialAddress.province || data.province,
        cityTown: residentialAddress.city || data.cityTown,
        postalCode: residentialAddress.postalCode || data.postalCode,
      };
    }

    localStorage.setItem("companyDetailsFormData", JSON.stringify(finalData));

    // Get preApplicationResponse data
    const preApplicationResponse = JSON.parse(
      localStorage.getItem("preApplicationResponse") || "{}"
    );
    const inflightCustomerDataID = preApplicationResponse.inflightCustomerDataId || "MyMo Biz Account";
    const customerUUID = preApplicationResponse.initiators?.[0]?.initiatorBPGUID || "temp-uuid";

    // Transform form data to API payload
    const payload = transformCompanyDetailsToAPI(
      finalData,
      inflightCustomerDataID,
      customerUUID
    );

    console.log("CompanyDetails API Payload:", payload);

    // Store the payload for later use in MarketingConsent
    localStorage.setItem("companyDetailsPayload", JSON.stringify(payload));

    if (!preApplicationResponse.inflightCustomerDataId || !preApplicationResponse.initiators?.[0]?.initiatorBPGUID) {
      console.warn("Pre-application data incomplete, skipping company details API call");
      setIsSubmitting(false);
      if (onNext) {
        await onNext(finalData as CompanyDetailsData);
      }
      return;
    }

    // Make API call
    updateCompanyDetails(
      { body: payload },
      {
        onSuccess: (res) => {
          console.log("Company details updated successfully:", res);
          setIsSubmitting(false);
          if (onNext) {
            onNext(finalData as CompanyDetailsData);
          }
        },
        onError: (error) => {
          console.error("Error updating company details:", error);
          setIsSubmitting(false);
          // Proceed to next step even if API fails
          if (onNext) {
            onNext(finalData as CompanyDetailsData);
          }
        },
      }
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
          Company Information
        </h2>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
          View or edit your company details
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-8 border border-gray-200 rounded-lg p-6 md:p-10 bg-white shadow-sm">
        {/* Company Details Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            Company details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registered Company Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="registeredCompanyName">
                  Registered company name
                </Label>
                <button className="flex-shrink-0">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <Input
                type="text"
                id="registeredCompanyName"
                {...register("registeredCompanyName")}
                className="bg-gray-50"
                readOnly
              />
            </div>

            {/* Country of Registration */}
            <div className="space-y-2">
              <Label htmlFor="countryOfRegistration">
                Country of registration
              </Label>
              <Input
                type="text"
                id="countryOfRegistration"
                {...register("countryOfRegistration")}
                className="bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>
        <hr />
        {/* Company Trading Address Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            Company trading address
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Select or edit your company's address below
          </p>

          {/* Address Type Radio */}
          <Controller
            name="addressType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex gap-6 mb-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="same" id="address-same" />
                  <Label
                    htmlFor="address-same"
                    className="font-normal cursor-pointer"
                  >
                    Same as residential address
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="different" id="address-different" />
                  <Label
                    htmlFor="address-different"
                    className="font-normal cursor-pointer"
                  >
                    Different address
                  </Label>
                </div>
              </RadioGroup>
            )}
          />

          {addressType === "same" ? (
            /* Display Address Summary */
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Your company's current physical address
              </h3>
              <p className="text-gray-800">
                {residentialAddress ? (
                  <>
                    {residentialAddress.street && <span>{residentialAddress.street}</span>}
                    {residentialAddress.unit && <span>, {residentialAddress.unit}</span>}
                    {residentialAddress.buildingName && <span>, {residentialAddress.buildingName}</span>}
                    {residentialAddress.suburb && <span>, {residentialAddress.suburb}</span>}
                    {residentialAddress.city && <span>, {residentialAddress.city}</span>}
                    {residentialAddress.postalCode && <span>, {residentialAddress.postalCode}</span>}
                  </>
                ) : (
                  "12 Steyn City, Oiase complex, Johannesburg, 2011"
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Address Search */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="addressSearch">
                  Enter your address
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    id="addressSearch"
                    {...register("addressSearch")}
                    placeholder="Enter your address"
                    className="pr-12"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Searching for address");
                    }}
                    className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </div>

              {/* Street Number and Suburb */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="streetNumber">
                      Street number and name
                    </Label>
                  </div>
                  <Input
                    type="text"
                    id="streetNumber"
                    {...register("streetNumber")}
                    placeholder="e.g 134 Raglan street"
                    className={errors.streetNumber ? "border-red-500" : ""}
                  />
                  {errors.streetNumber && (
                    <p className="text-red-500 text-sm">{errors.streetNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suburb">Suburb</Label>
                  <Input
                    type="text"
                    id="suburb"
                    {...register("suburb")}
                    placeholder="e.g Sandton"
                    className={errors.suburb ? "border-red-500" : ""}
                  />
                  {errors.suburb && (
                    <p className="text-red-500 text-sm">{errors.suburb.message}</p>
                  )}
                </div>
              </div>

              {/* Complex Name and Province */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="complexName">
                    Complex/Building name (optional)
                  </Label>
                  <Input
                    type="text"
                    id="complexName"
                    {...register("complexName")}
                    placeholder="e.g. Eye of Africa Estate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Controller
                    name="province"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={(() => {
                          const found = provinceOptions.find(opt => opt.value === field.value);
                          return found ? found : null;
                        })()}
                        onChange={(option) => {
                          const selected = Array.isArray(option) ? option[0] : option;
                          field.onChange(selected ? selected.value : "");
                        }}
                        options={provinceOptions}
                        placeholder="Please select"
                      />
                    )}
                  />
                  {errors.province && (
                    <p className="text-red-500 text-sm">{errors.province.message}</p>
                  )}
                </div>
              </div>

              {/* City/Town and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cityTown">City/town</Label>
                  <Controller
                    name="cityTown"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        value={(() => {
                          const found = cityTownOptions.find(opt => opt.value === field.value);
                          return found ? found : null;
                        })()}
                        onChange={(option) => {
                          const selected = Array.isArray(option) ? option[0] : option;
                          field.onChange(selected ? selected.value : "");
                        }}
                        options={cityTownOptions}
                        placeholder="Please select"
                      />
                    )}
                  />
                  {errors.cityTown && (
                    <p className="text-red-500 text-sm">{errors.cityTown.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal code</Label>
                  <Input
                    type="text"
                    id="postalCode"
                    {...register("postalCode")}
                    placeholder="e.g. 2091"
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <hr />
        {/* Enter the Following Information Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            Enter the following information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nature of Business */}
            <div className="space-y-2">
              <Label htmlFor="natureOfBusiness">
                Nature of the business
              </Label>
              <Controller
                name="natureOfBusiness"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = businessNatureOptions.find(opt => opt.value === field.value);
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={businessNatureOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.natureOfBusiness && (
                <p className="text-red-500 text-sm">{errors.natureOfBusiness.message}</p>
              )}
            </div>

            {/* Industry Classification */}
            <div className="space-y-2">
              <Label htmlFor="industryClassification">
                Industry classification
              </Label>
              <Controller
                name="industryClassification"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = businessIndustryOptions.find(opt => opt.value === field.value);
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={businessIndustryOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.industryClassification && (
                <p className="text-red-500 text-sm">{errors.industryClassification.message}</p>
              )}
            </div>
          </div>

          {/* Preferred Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="preferredBranch">
                Preferred branch (optional)
              </Label>
              <Controller
                name="preferredBranch"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = preferredBranchOptions.find(opt => opt.value === field.value);
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={preferredBranchOptions}
                    placeholder="Please select"
                  />
                )}
              />
            </div>
          </div>
        </div>
        <hr />
        {/* B-BBEE Details Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            B-BBEE details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ownership */}
            <div className="space-y-2">
              <Label htmlFor="ownership">
                Ownership
              </Label>
              <Controller
                name="ownership"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={(() => {
                      const found = ownershipOptions.find(opt => opt.value === field.value);
                      return found ? found : null;
                    })()}
                    onChange={(option) => {
                      const selected = Array.isArray(option) ? option[0] : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={ownershipOptions}
                    placeholder="Owner"
                  />
                )}
              />
              {errors.ownership && (
                <p className="text-red-500 text-sm">{errors.ownership.message}</p>
              )}
            </div>

            {/* Valid B-BBEE Certificate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>
                  Does the business have a valid B-BBEE Certificate?
                </Label>
                <button className="flex-shrink-0" type="button">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <Controller
                name="hasValidBBBEE"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6 py-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="bbbee-yes" />
                      <Label
                        htmlFor="bbbee-yes"
                        className="font-normal cursor-pointer"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="bbbee-no" />
                      <Label
                        htmlFor="bbbee-no"
                        className="font-normal cursor-pointer"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.hasValidBBBEE && (
                <p className="text-red-500 text-sm">{errors.hasValidBBBEE.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 !mt-12">
            {onBack && (
              <Button variant="outline" className="w-full md:max-w-40" onClick={onBack} type="button">
                Back
              </Button>
            )}
            <Button className="w-full md:max-w-40 ml-auto" type="submit">Next</Button>
        </div>
      </div>
    </form>
  );
}

export default CompanyDetails;
