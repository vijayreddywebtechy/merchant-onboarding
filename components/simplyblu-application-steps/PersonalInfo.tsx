"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { transformPersonalDetailsToAPI } from "@/lib/apiTransformers";
import { provinceOptions, cityOptions, nationalityOptions, countryOptions } from "@/lib/data";

// Validation Schema
const personalInfoSchema: yup.ObjectSchema<PersonalInfoFormData> = yup
  .object()
  .shape({
    fname: yup
      .string()
      .trim()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),

    lname: yup
      .string()
      .trim()
      .required("Surname is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),

    idNo: yup
      .string()
      .required("ID number is required")
      .matches(/^[0-9]{6,13}$/, "Enter a valid ID number"),

    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

    email: yup
      .string()
      .email("Enter a valid email address")
      .required("Email is required"),

    nationality: yup.string().required("Please select your nationality"),

    citizenship: yup
      .string()
      .required("Please select your country of citizenship"),

    isPublicOfficial: yup
      .string()
      .required("Please select whether you are a public official"),

    isSouthAfricaResident: yup
      .string()
      .required("Please select whether you are a tax resident outside SA"),

    street: yup
      .string()
      .trim()
      .required("Street number and name are required"),

    unit: yup.string().trim().nullable() as yup.Schema<string | null | undefined>,

    buildingName: yup
      .string()
      .trim()
      .nullable() as yup.Schema<string | null | undefined>,

    suburb: yup
      .string()
      .trim()
      .required("Suburb name is required"),

    city: yup.string().required("Please select a city/town"),

    province: yup.string().required("Please select a province"),

    postalCode: yup
      .string()
      .required("Postal code is required")
      .matches(/^[0-9]{4,6}$/, "Enter a valid postal code"),

    addressSearch: yup.string().trim(),
  })
  .required();

interface PersonalInfoFormData {
  fname: string;
  lname: string;
  idNo: string;
  phoneNumber: string;
  email: string;
  nationality: string;
  citizenship: string;
  isPublicOfficial: string;
  isSouthAfricaResident: string;
  street: string;
  unit?: string | null;
  buildingName?: string | null;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  addressSearch?: string;
}

interface PersonalInfoProps {
  onNext?: (data: PersonalInfoFormData) => Promise<void>;
  onBack?: () => void;
}

// City/Town options for CustomSelect
const cityTownOptions = [
  { value: "johannesburg", label: "Johannesburg" },
  { value: "pretoria", label: "Pretoria" },
  { value: "cape-town", label: "Cape Town" },
  { value: "durban", label: "Durban" },
  { value: "port-elizabeth", label: "Port Elizabeth" },
];

function PersonalInfo({ onNext, onBack }: PersonalInfoProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: updatePersonalDetails } = useCustomMutation({
    url: `/api/related-parties-update`,
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
  } = useForm<PersonalInfoFormData>({
    resolver: yupResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: {
      fname: "",
      lname: "",
      idNo: "",
      phoneNumber: "",
      email: "",
      nationality: "ZA",
      citizenship: "ZA",
      isPublicOfficial: "",
      isSouthAfricaResident: "",
      street: "",
      unit: "",
      buildingName: "",
      suburb: "",
      city: "",
      province: "",
      postalCode: "",
      addressSearch: "",
    },
  });

  React.useEffect(() => {
    // Try to load saved personal details first
    const savedPersonalData = localStorage.getItem("personalDetailsFormData");
    if (savedPersonalData) {
      reset(JSON.parse(savedPersonalData));
    } else {
      // If no saved data, try to prefill from merchantOnboardingData
      const merchantData = localStorage.getItem("merchantOnboardingData");
      if (merchantData) {
        const parsed = JSON.parse(merchantData);
        const businessDetails = parsed.businessDetails;
        const companyDirectors = parsed.companyDirectors?.COMPANY_DATA?.Directors || [];
        const companyInfo = parsed.companyInfo?.COMPANY_DATA?.Registration;
        
        // Find the director matching the director ID
        const director = companyDirectors.find((dir: any) => 
          dir.ID_NO === businessDetails?.directorId
        );
        
        // Get address from company or director
        const address = companyInfo || director || {};
        
        if (businessDetails) {
          reset({
            fname: director?.FIRST_NAMES || "",
            lname: director?.SURNAME || "",
            idNo: businessDetails.directorId || "",
            phoneNumber: businessDetails.cellphone?.replace(/^0/, "") || "",
            email: businessDetails.email || "",
            nationality: "ZA",
            citizenship: "ZA",
            isPublicOfficial: "",
            isSouthAfricaResident: "",
            street: address.PHYS_ADDR_1 || address.RES_ADDR_1 || "",
            unit: "",
            buildingName: "",
            suburb: address.PHYS_ADDR_2 || address.RES_ADDR_2 || "",
            city: address.PHYS_ADDR_2 || address.RES_ADDR_2 || "",
            province: businessDetails.province || address.REGION_CODE?.toLowerCase() || "",
            postalCode: address.PHYS_CODE || address.RES_POST_CODE || "",
            addressSearch: "",
          });
        }
      }
    }
  }, [reset]);

  // Save form data in real-time to localStorage
  React.useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("personalDetailsFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Expose validation through window object for Stepper to call
  React.useEffect(() => {
    (window as any).__personalInfoValidate = async () => {
      const isValid = await new Promise<boolean>((resolve) => {
        handleSubmit(
          () => {
            resolve(true);
          },
          () => resolve(false)
        )();
      });
      return isValid;
    };
  }, [trigger, handleSubmit]);

  const handleAddressSearch = (): void => {
    console.log("Searching for address");
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsSubmitting(true);
    console.log("Form data submitted:", data);
    localStorage.setItem("personalDetailsFormData", JSON.stringify(data));

    // Get preApplicationResponse data
    const preApplicationResponse = JSON.parse(
      localStorage.getItem("preApplicationResponse") || "{}"
    );
    const inflightCustomerDataID = preApplicationResponse.inflightCustomerDataId;
    const customerUUID = preApplicationResponse.initiators?.[0]?.initiatorBPGUID;

    if (!inflightCustomerDataID || !customerUUID) {
      console.warn("Missing preApplicationResponse data, proceeding without API call");
      setIsSubmitting(false);
      if (onNext) {
        await onNext(data);
      }
      return;
    }

    // Transform form data to API payload
    const payload = transformPersonalDetailsToAPI(
      data,
      inflightCustomerDataID,
      customerUUID
    );

    console.log("PersonalInfo API Payload:", payload);

    // Make API call
    updatePersonalDetails(
      { body: payload },
      {
        onSuccess: (res) => {
          console.log("Personal details updated successfully:", res);
          setIsSubmitting(false);
          if (onNext) {
            onNext(data);
          }
        },
        onError: (error) => {
          console.error("Error updating personal details:", error);
          setIsSubmitting(false);
          // Optionally still proceed to next step
          if (onNext) {
            onNext(data);
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
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="fname">Name</Label>
              <Input
                type="text"
                id="fname"
                placeholder="Enter your first name"
                {...register("fname")}
                className={errors.fname ? "border-red-500" : ""}
              />
              {errors.fname && (
                <p className="text-red-500 text-sm">{errors.fname?.message as string}</p>
              )}
            </div>

            {/* Surname */}
            <div className="space-y-2">
              <Label htmlFor="lname">Surname</Label>
              <Input
                type="text"
                id="lname"
                placeholder="Enter your surname"
                {...register("lname")}
                className={errors.lname ? "border-red-500" : ""}
              />
              {errors.lname && (
                <p className="text-red-500 text-sm">{errors.lname?.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* ID Number */}
            <div className="space-y-2">
              <Label htmlFor="idNo">ID Number</Label>
              <Input
                type="text"
                id="idNo"
                placeholder="Enter your ID number"
                {...register("idNo")}
                className={errors.idNo ? "border-red-500" : ""}
              />
              {errors.idNo && (
                <p className="text-red-500 text-sm">{errors.idNo?.message as string}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Cell Number</Label>
              <Input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber?.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email?.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={nationalityOptions.find(
                      (opt) => opt.value === field.value
                    ) || null}
                    onChange={(option) => {
                      const selected = Array.isArray(option)
                        ? option[0]
                        : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={nationalityOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.nationality && (
                <p className="text-red-500 text-sm">
                  {errors.nationality?.message as string}
                </p>
              )}
            </div>

            {/* Country of Citizenship */}
            <div className="space-y-2">
              <Label htmlFor="citizenship">Country of citizenship</Label>
              <Controller
                name="citizenship"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={countryOptions.find(
                      (opt) => opt.value === field.value
                    ) || null}
                    onChange={(option) => {
                      const selected = Array.isArray(option)
                        ? option[0]
                        : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={countryOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.citizenship && (
                <p className="text-red-500 text-sm">
                  {errors.citizenship?.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Radio Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Public Official Question */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Label>
                  Do you hold a senior or influential role in government, the
                  judiciary, military, or a major company?
                </Label>
                <button className="flex-shrink-0" type="button">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <Controller
                name="isPublicOfficial"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="official-yes" />
                      <Label htmlFor="official-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="official-no" />
                      <Label htmlFor="official-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.isPublicOfficial && (
                <p className="text-red-500 text-sm">
                  {errors.isPublicOfficial?.message as string}
                </p>
              )}
            </div>

            {/* Tax Resident Question */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Label>Are you a tax resident outside of South Africa?</Label>
                <button className="flex-shrink-0" type="button">
                  <Info size={20} className="text-white fill-primary-dark" />
                </button>
              </div>
              <Controller
                name="isSouthAfricaResident"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="resident-yes" />
                      <Label htmlFor="resident-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="resident-no" />
                      <Label htmlFor="resident-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.isSouthAfricaResident && (
                <p className="text-red-500 text-sm">
                  {errors.isSouthAfricaResident?.message as string}
                </p>
              )}
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
                placeholder="Search for your address"
                {...register("addressSearch")}
                className="flex-1"
              />
              <button
                type="button"
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
              <Label htmlFor="street">Street number and name</Label>
              <Input
                type="text"
                id="street"
                placeholder="E.g 36 rissik street"
                {...register("street")}
                className={errors.street ? "border-red-500" : ""}
              />
              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street?.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit number (optional)</Label>
              <Input
                type="text"
                id="unit"
                placeholder="e.g 123"
                {...register("unit")}
              />
            </div>
          </div>

          {/* Complex and Suburb */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="buildingName">
                Complex/Building name (optional)
              </Label>
              <Input
                type="text"
                id="buildingName"
                placeholder="e.g Eye of Africa Estate"
                {...register("buildingName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb</Label>
              <Input
                type="text"
                id="suburb"
                placeholder="e.g Sandton"
                {...register("suburb")}
                className={errors.suburb ? "border-red-500" : ""}
              />
              {errors.suburb && (
                <p className="text-red-500 text-sm">{errors.suburb?.message as string}</p>
              )}
            </div>
          </div>

          {/* Province and City/Town */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={provinceOptions.find(
                      (opt) => opt.value === field.value
                    ) || null}
                    onChange={(option) => {
                      const selected = Array.isArray(option)
                        ? option[0]
                        : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={provinceOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.province && (
                <p className="text-red-500 text-sm">
                  {errors.province?.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City/town</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={cityTownOptions.find(
                      (opt) => opt.value === field.value
                    ) || null}
                    onChange={(option) => {
                      const selected = Array.isArray(option)
                        ? option[0]
                        : option;
                      field.onChange(selected ? selected.value : "");
                    }}
                    options={cityTownOptions}
                    placeholder="Please select"
                  />
                )}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city?.message as string}</p>
              )}
            </div>
          </div>
          {/* Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input
                type="text"
                id="postalCode"
                placeholder="e.g 2001"
                {...register("postalCode")}
                className={errors.postalCode ? "border-red-500" : ""}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.postalCode?.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Form is hidden, navigation handled by Stepper */}
        </div>
      </div>
    </form>
  );
}

export default PersonalInfo;
