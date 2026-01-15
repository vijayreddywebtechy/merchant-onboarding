"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect from "@/components/dynamic/CustomSelect";
import Image from "next/image";
import RHFProvider from "@/app/providers/ReactHookFormProvider";
import { useFormWatch } from "@/hooks/useFormWatch";
import cardMachine from "@/assets/images/general/card_machine.png";

interface FormData {
  directorId: string;
  cellphone: string;
  email: string;
  grossTurnover: string;
  province: string;
  privacyAccepted: boolean;
}

// Validation schema
const schema = yup.object().shape({
  directorId: yup
    .string()
    .required("Director ID is required")
    .matches(/^\d{13}$/, "Director ID must be exactly 13 digits"),
  cellphone: yup
    .string()
    .required("Cellphone number is required")
    .matches(/^0[6-8][0-9]{8}$/, "Please enter a valid South African cellphone number (format: 0XXXXXXXXX)"),
  email: yup
    .string()
    .required("Email address is required")
    .email("Please enter a valid email address"),
  grossTurnover: yup
    .string()
    .required("Gross annual turnover is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  province: yup
    .string()
    .required("Province is required"),
  privacyAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the privacy statement"),
});

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

const BusinessDetailsFormFields = ({ onNext, onBack }: { onNext: (data: FormData) => Promise<void>; onBack: () => void }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useFormContext<FormData>();

  // Use centralized form watch hook
  useFormWatch();

  const watchedProvince = watch("province");
  const privacyAccepted = watch("privacyAccepted");

  const loadFormDataFromStorage = () => {
    const data = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    if (data.businessDetails) {
      Object.keys(data.businessDetails).forEach((key) => {
        setValue(key as keyof FormData, data.businessDetails[key]);
      });
    }
  };

  // Load saved data on mount
  useEffect(() => {
    loadFormDataFromStorage();
  }, []);

  const handlePrivacyChange = (checked: boolean) => {
    setValue("privacyAccepted", checked, { shouldValidate: true });
  };

  const handleProvinceChange = (option: any) => {
    setValue("province", option ? option.value : "");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="directorId">*Business director's ID number</Label>
              <Input
                type="text"
                id="directorId"
                {...register("directorId")}
                placeholder="Enter the director's ID number"
              />
              {errors.directorId && (
                <p className="text-red-500 text-sm">{errors.directorId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cellphone">*Cellphone number</Label>
              <Input
                type="tel"
                id="cellphone"
                {...register("cellphone")}
                placeholder="Enter your cellphone number"
              />
              {errors.cellphone && (
                <p className="text-red-500 text-sm">{errors.cellphone.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Email and Gross Turnover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">*Email address</Label>
              <Input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="grossTurnover">*Gross annual turnover</Label>
              <Input
                type="text"
                id="grossTurnover"
                {...register("grossTurnover")}
                placeholder="Enter gross annual turnover"
              />
              {errors.grossTurnover && (
                <p className="text-red-500 text-sm">{errors.grossTurnover.message}</p>
              )}
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
                    (opt) => opt.value === watchedProvince
                  );
                  return found ? found : null;
                })()}
                onChange={handleProvinceChange}
                options={provinceOptions}
                placeholder="Please select"
              />
              {errors.province && (
                <p className="text-red-500 text-sm">{errors.province.message}</p>
              )}
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
                checked={privacyAccepted}
                onCheckedChange={handlePrivacyChange}
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
            {errors.privacyAccepted && (
              <p className="text-red-500 text-sm">{errors.privacyAccepted.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-1/5"
              onClick={onBack}
            >
              BACK
            </Button>
            <Button
              type="submit"
              className="w-full md:w-1/5"
              disabled={!isValid}
            >
              NEXT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusinessDetailsForm = (props: { onNext: (data: FormData) => Promise<void>; onBack: () => void }) => {
  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    const existingData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    existingData.businessDetails = data;
    localStorage.setItem("merchantOnboardingData", JSON.stringify(existingData));
    
    // Call the onNext with form data, which will handle API submission
    await props.onNext(data);
  };

  return (
    <RHFProvider<FormData>
      resolver={yupResolver(schema) as any}
      defaultValues={{
        directorId: "6805175148085",
        cellphone: "0845484511",
        email: "jessica@gmail.com",
        grossTurnover: "32323",
        province: "eastern-cape",
        privacyAccepted: false,
      }}
      submitFn={onSubmit}
      mode="onChange"
    >
      <BusinessDetailsFormFields onNext={props.onNext} onBack={props.onBack} />
    </RHFProvider>
  );
};

export default BusinessDetailsForm;
