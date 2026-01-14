"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Props } from "react-select";
import CustomSelect from "@/components/dynamic/CustomSelect";
import Image from "next/image";
import cardMachine from "@/assets/images/general/card_machine.png";

interface FormData {
  directorId: string;
  cellphone: string;
  email: string;
  grossTurnover: string;
  province: string;
  privacyAccepted: boolean;
}

// Province options for CustomSelect
const provinceOptions = [
  { value: "eastern-cape", label: "Eastern Cape" },
  { value: "free-state", label: "Free State" },
  { value: "gauteng", label: "Gauteng" },
  { value: "kwazulu-natal", label: "KwaZulu-Natal" },
  { value: "limpopo", label: "Limpopo" },
  { value: "mpumalanga", label: "Mpumalanga" },
  { value: "northern-cape", label: "Northern Cape" },
  { value: "north-west", label: "North West" },
  { value: "western-cape", label: "Western Cape" },
];

const BusinessDetailsForm = (props: Props) => {
  const [formData, setFormData] = useState<FormData>({
    directorId: "",
    cellphone: "",
    email: "",
    grossTurnover: "",
    province: "",
    privacyAccepted: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (option: any): void => {
    setFormData((prev) => ({
      ...prev,
      province: option ? option.value : "",
    }));
  };

  const handleCheckboxChange = (checked: boolean): void => {
    setFormData((prev) => ({
      ...prev,
      privacyAccepted: checked,
    }));
  };

  const handleSubmit = (): void => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="page-container py-4 md:py-8">
      <div className="w-full bg-white rounded-[20px] shadow-lg p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <span className="block text-sm text-gray-600 mb-2">SimplyBLU Application</span>
          <h2 className="text-2xl md:text-3xl font-medium text-secondary mb-6">
            All-in-one payment solution
          </h2>
          <div className="mb-6">
            <Image
              src={cardMachine}
              width={158}
              height={154}
              alt="Payment device"
              className="max-w-full h-auto"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-3">
            Please provide your business details
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We'll use this information to find your business(es) so you won't
            need to upload any documents, and to make your application faster.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Row 1: Director ID and Cellphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="directorId">*Business director's ID number</Label>
              <Input
                type="text"
                id="directorId"
                name="directorId"
                value={formData.directorId}
                onChange={handleInputChange}
                placeholder="Enter the director's ID number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cellphone">*Cellphone number</Label>
              <Input
                type="tel"
                id="cellphone"
                name="cellphone"
                value={formData.cellphone}
                onChange={handleInputChange}
                placeholder="Enter your cellphone number"
              />
            </div>
          </div>

          {/* Row 2: Email and Gross Turnover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">*Email address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grossTurnover">*Gross annual turnover</Label>
              <Input
                type="text"
                id="grossTurnover"
                name="grossTurnover"
                value={formData.grossTurnover}
                onChange={handleInputChange}
                placeholder="Enter gross annual turnover"
              />
            </div>
          </div>

          {/* Province Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">
                *Province (where the device will be delivered)
              </Label>
              <CustomSelect
                value={(() => {
                  const found = provinceOptions.find(
                    (opt) => opt.value === formData.province
                  );
                  return found ? found : null;
                })()}
                onChange={handleProvinceChange}
                options={provinceOptions}
                placeholder="Please select"
              />
            </div>
          </div>

          {/* Data Privacy Section */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-base font-medium text-gray-700 mb-3">
              Data Privacy
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Please be advised that{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Standard Bank
              </a>{" "}
              will process your personal information collected from internal and
              external sources to administer your products and/or services...{" "}
              <a href="#" className="text-blue-600 hover:underline">
                See More
              </a>
            </p>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={formData.privacyAccepted}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor="privacy"
                className="text-sm font-normal text-gray-700 leading-relaxed cursor-pointer"
              >
                I have read and understood the above and accept the terms of
                your{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Statement
                </a>
                .
              </Label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-1/5"
              onClick={() => console.log("Back clicked")}
            >
              BACK
            </Button>
            <Button
              type="button"
              className="w-full md:w-1/5"
              onClick={handleSubmit}
            >
              NEXT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsForm;
