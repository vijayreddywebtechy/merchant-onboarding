import React, { useState, ChangeEvent } from "react";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info, Search } from "lucide-react";

interface DirectorDetailsData {
  name: string;
  surname: string;
  nationality: string;
  countryOfCitizenship: string;
  seniorRole: string;
  taxResident: string;
  streetNumber: string;
  unitNumber: string;
  complexName: string;
  suburb: string;
  province: string;
  cityTown: string;
  postalCode: string;
  addressSearch: string;
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
  { value: 'port-elizabeth', label: 'Port Elizabeth' },
];

function PersonalInfo({}: Props) {
  const [formData, setFormData] = useState<DirectorDetailsData>({
    name: "Khutso",
    surname: "Buthelezi",
    nationality: "South African",
    countryOfCitizenship: "South Africa",
    seniorRole: "",
    taxResident: "",
    streetNumber: "",
    unitNumber: "",
    complexName: "",
    suburb: "",
    province: "",
    cityTown: "",
    postalCode: "",
    addressSearch: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (option: any) => {
    // react-select passes (option, actionMeta)
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

  const handleRadioChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSearch = (): void => {
    console.log("Searching for address:", formData.addressSearch);
  };

  return (
    <div className="py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
          Personal Information
        </h2>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
          View or edit your personal or company details
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-8 border border-gray-200 rounded-lg p-6 md:p-10 bg-white shadow-sm">
        {/* Director's Details Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            Director's details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-50"
                readOnly
              />
            </div>

            {/* Surname */}
            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="bg-gray-50"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="bg-gray-50"
                readOnly
              />
            </div>

            {/* Country of Citizenship */}
            <div className="space-y-2">
              <Label htmlFor="countryOfCitizenship">
                Country of citizenship
              </Label>
              <Input
                type="text"
                id="countryOfCitizenship"
                name="countryOfCitizenship"
                value={formData.countryOfCitizenship}
                onChange={handleInputChange}
                className="bg-gray-50"
                readOnly
              />
            </div>
          </div>

          {/* Radio Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Senior Role Question */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Label>
                  Do you hold a senior or influential role in government, the
                  judiciary, military, or a major company?
                </Label>
                <button className="flex-shrink-0">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <RadioGroup
                value={formData.seniorRole}
                onValueChange={(value) =>
                  handleRadioChange("seniorRole", value)
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="senior-yes" />
                  <Label htmlFor="senior-yes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="senior-no" />
                  <Label htmlFor="senior-no" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Tax Resident Question */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Label>Are you a tax resident outside of South Africa?</Label>
                <button className="flex-shrink-0">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <RadioGroup
                value={formData.taxResident}
                onValueChange={(value) =>
                  handleRadioChange("taxResident", value)
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="tax-yes" />
                  <Label htmlFor="tax-yes" className="cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="tax-no" />
                  <Label htmlFor="tax-no" className="cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <hr />
        {/* Residential Address Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            Residential address
          </h2>

          {/* Address Search */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="addressSearch">Enter your address</Label>
            <div className="flex gap-2 relative">
              <Input
                type="text"
                id="addressSearch"
                name="addressSearch"
                value={formData.addressSearch}
                onChange={handleInputChange}
                placeholder="Search for your address"
                className="flex-1"
              />
              <button
                onClick={handleAddressSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 hover:text-primary-dark focus:outline-none"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Street and Unit Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="streetNumber">Street number and name</Label>
              <Input
                type="text"
                id="streetNumber"
                name="streetNumber"
                value={formData.streetNumber}
                onChange={handleInputChange}
                placeholder="E.g 36 rissik street"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitNumber">Unit number (optional)</Label>
              <Input
                type="text"
                id="unitNumber"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleInputChange}
                placeholder="e.g 123"
              />
            </div>
          </div>

          {/* Complex and Suburb */}
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
                placeholder="e.g Eye of Africa Estate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb</Label>
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

          {/* Province and City/Town */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
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

            <div className="space-y-2">
              <Label htmlFor="cityTown">City/town</Label>
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
          </div>
          {/* Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="e.g 2001"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
