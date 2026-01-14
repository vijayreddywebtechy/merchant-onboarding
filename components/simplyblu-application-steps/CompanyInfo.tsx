import React, { useState, ChangeEvent } from "react";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanyFinancialInfo from "./CompanyFinancialInfo";
import MarketingConsentForm from "./MarketingConsentForm";
import CompanyBankingDetails from "./CompanyBankingDetails";
import DeliveryDetails from "./DeliveryDetails";
import CardMachineSummary from "./CardMachineSummary";

interface CompanyDetailsData {
  registeredCompanyName: string;
  countryOfRegistration: string;
  addressType: "same" | "different";
  addressSearch: string;
  streetNumber: string;
  suburb: string;
  complexName: string;
  province: string;
  cityTown: string;
  postalCode: string;
  natureOfBusiness: string;
  industryClassification: string;
  preferredBranch: string;
  ownership: string;
  hasValidBBBEE: string;
}

type Props = {};

// Province options for CustomSelect
const provinceOptions = [
  { value: 'eastern-cape', label: 'Eastern Cape' },
  { value: 'free-state', label: 'Free State' },
  { value: 'gauteng', label: 'Gauteng' },
  { value: 'kwazulu-natal', label: 'KwaZulu-Natal' },
  { value: 'limpopo', label: 'Limpopo' },
  { value: 'mpumalanga', label: 'Mpumalanga' },
  { value: 'northern-cape', label: 'Northern Cape' },
  { value: 'north-west', label: 'North West' },
  { value: 'western-cape', label: 'Western Cape' },
];

// City/Town options for CustomSelect
const cityTownOptions = [
  { value: 'johannesburg', label: 'Johannesburg' },
  { value: 'pretoria', label: 'Pretoria' },
  { value: 'cape-town', label: 'Cape Town' },
  { value: 'durban', label: 'Durban' },
];

// Nature of Business options
const natureOfBusinessOptions = [
  { value: 'retail', label: 'Retail' },
  { value: 'services', label: 'Services' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
];

// Industry Classification options
const industryClassificationOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
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

function CompanyInfo({}: Props) {
  const [formData, setFormData] = useState<CompanyDetailsData>({
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
  });

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [streetError, setStreetError] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "streetNumber" && value) {
      setStreetError(false);
    }
  };

  const handleProvinceChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      province: selected ? selected.value : "",
    }));
  };

  const handleCityTownChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      cityTown: selected ? selected.value : "",
    }));
  };

  const handleNatureOfBusinessChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      natureOfBusiness: selected ? selected.value : "",
    }));
  };

  const handleIndustryClassificationChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      industryClassification: selected ? selected.value : "",
    }));
  };

  const handlePreferredBranchChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      preferredBranch: selected ? selected.value : "",
    }));
  };

  const handleOwnershipChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      ownership: selected ? selected.value : "",
    }));
  };

  const handleRadioChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSearch = (): void => {
    console.log("Searching for address:", formData.addressSearch);
  };

  const handleStreetBlur = (): void => {
    if (!formData.streetNumber) {
      setStreetError(true);
    }
  };

  return (
    <div className="py-6 md:py-8">
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
                name="registeredCompanyName"
                value={formData.registeredCompanyName}
                onChange={handleInputChange}
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
                name="countryOfRegistration"
                value={formData.countryOfRegistration}
                onChange={handleInputChange}
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
          <RadioGroup
            value={formData.addressType}
            onValueChange={(value) => handleRadioChange("addressType", value)}
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

          {formData.addressType === "same" ? (
            /* Display Address Summary */
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Your company's current physical address
              </h3>
              <p className="text-gray-800">
                12 Steyn City, Oiase complex, Johannesburg, 2011
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
                    name="addressSearch"
                    value={formData.addressSearch}
                    onChange={handleInputChange}
                    onFocus={() => setShowTooltip(true)}
                    onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
                    placeholder="Enter your address"
                    className="pr-12"
                  />
                  <button
                    onClick={handleAddressSearch}
                    className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Search size={18} />
                  </button>

                  {/* Tooltip */}
                  {showTooltip && (
                    <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white text-xs rounded px-3 py-2 z-10 max-w-xs">
                      If your address did not appear, please enter it.
                      <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Street Number and Suburb */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2 relative">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="streetNumber">
                      Street number and name
                    </Label>
                    <div className="relative">
                    <button className="flex-shrink-0 mt-1"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        >
                      <Info size={20} className="text-white fill-primary-dark" />
                    </button>
                    </div>
                  </div>
                  <Input
                    type="text"
                    id="streetNumber"
                    name="streetNumber"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    onBlur={handleStreetBlur}
                    placeholder="e.g 134 Raglan street"
                  />
                  {streetError && (
                    <p className="text-xs text-red-600">Please complete</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suburb">
                    Suburb
                  </Label>
                  <Input
                    type="text"
                    id="suburb"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleInputChange}
                    placeholder="e.g Sandton"
                  />
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
                    name="complexName"
                    value={formData.complexName}
                    onChange={handleInputChange}
                    placeholder="e.g. Eye of Africa Estate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">
                    Province
                  </Label>
                  <CustomSelect
                    value={(() => {
                      const found = provinceOptions.find(opt => opt.value === formData.province);
                      return found ? found : null;
                    })()}
                    onChange={handleProvinceChange}
                    options={provinceOptions}
                    placeholder="Please select"
                  />
                </div>
              </div>

              {/* City/Town and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cityTown">
                    City/town
                  </Label>
                  <CustomSelect
                    value={(() => {
                      const found = cityTownOptions.find(opt => opt.value === formData.cityTown);
                      return found ? found : null;
                    })()}
                    onChange={handleCityTownChange}
                    options={cityTownOptions}
                    placeholder="Please select"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    Postal code
                  </Label>
                  <Input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 2091"
                  />
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
              <CustomSelect
                value={(() => {
                  const found = natureOfBusinessOptions.find(opt => opt.value === formData.natureOfBusiness);
                  return found ? found : null;
                })()}
                onChange={handleNatureOfBusinessChange}
                options={natureOfBusinessOptions}
                placeholder="Please select"
              />
            </div>

            {/* Industry Classification */}
            <div className="space-y-2">
              <Label htmlFor="industryClassification">
                Industry classification
              </Label>
              <CustomSelect
                value={(() => {
                  const found = industryClassificationOptions.find(opt => opt.value === formData.industryClassification);
                  return found ? found : null;
                })()}
                onChange={handleIndustryClassificationChange}
                options={industryClassificationOptions}
                placeholder="Please select"
              />
            </div>
          </div>

          {/* Preferred Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="preferredBranch">
                Preferred branch (optional)
              </Label>
              <CustomSelect
                value={(() => {
                  const found = preferredBranchOptions.find(opt => opt.value === formData.preferredBranch);
                  return found ? found : null;
                })()}
                onChange={handlePreferredBranchChange}
                options={preferredBranchOptions}
                placeholder="Please select"
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
              <CustomSelect
                value={(() => {
                  const found = ownershipOptions.find(opt => opt.value === formData.ownership);
                  return found ? found : null;
                })()}
                onChange={handleOwnershipChange}
                options={ownershipOptions}
                placeholder="Owner"
              />
            </div>

            {/* Valid B-BBEE Certificate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>
                  Does the business have a valid B-BBEE Certificate?
                </Label>
                <button className="flex-shrink-0">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <RadioGroup
                value={formData.hasValidBBBEE}
                onValueChange={(value) =>
                  handleRadioChange("hasValidBBBEE", value)
                }
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
            </div>
          </div>
        </div>

        {/* Continue to Company financial details */}
        
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">Continue to Company financial details</p>
          <Button size="sm" className="flex ml-auto">
            Continue
          </Button>
        </div>


        <CompanyFinancialInfo/>
        <MarketingConsentForm />
        <CompanyBankingDetails />
        <DeliveryDetails /> 
        <CardMachineSummary />


      </div>
    </div>
  );
}

export default CompanyInfo;
