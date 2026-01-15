"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketingConsentSchema } from "@/lib/validationSchemas";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { updateCompanyDetailsWithConsent, buildRelatedPartiesUpdatePayload } from "@/lib/apiTransformers";
import axios from "axios";

type MarketingConsentData = {
  smsConsent: string;
  emailConsent: string;
  termsConsent: boolean;
};

interface Props {
  onNext?: () => void;
  onBack?: () => void;
}

const MarketingConsentForm = ({ onNext, onBack }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStep, setApiStep] = useState(0);

  const { mutate: updateCompanyDetails } = useCustomMutation({
    url: `/api/company-details`,
    method: "PUT",
  });

  const { mutate: updateRelatedParties } = useCustomMutation({
    url: `/api/related-parties-update`,
    method: "PUT",
  });

  const {
    control,
    formState: { errors, isValidating },
    handleSubmit,
    watch,
    reset,
  } = useForm<MarketingConsentData>({
    resolver: yupResolver(marketingConsentSchema) as any,
    mode: "onChange",
    defaultValues: {
      smsConsent: "",
      emailConsent: "",
      termsConsent: false,
    },
  });

  React.useEffect(() => {
    const data = localStorage.getItem("marketingConsentFormData");
    if (data) {
      reset(JSON.parse(data));
    }
  }, [reset]);

  // Sequential API execution
  useEffect(() => {
    const executeSequentialAPIs = async () => {
      if (apiStep === 1) {
        // Step 2: Get Related Parties after company details updated
        try {
          const token = sessionStorage.getItem("ping_access_token_data");
          const accessToken = token ? JSON.parse(token).access_token : null;
          const preApplicationResponse = JSON.parse(localStorage.getItem("preApplicationResponse") || "{}");
          const customerUUID = preApplicationResponse.businessBPGUID;
          
          const response = await axios.get(
            `/api/related-parties?customerUUID=${customerUUID}`,
            {
              headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
              },
            }
          );
          console.log("Related parties fetched:", response.data);
          
          // Store the related parties data for next step
          localStorage.setItem("relatedPartiesData", JSON.stringify(response.data));
          
          setApiStep(2); // Move to step 2: Update related parties
        } catch (error) {
          console.error("Error fetching related parties:", error);
          setIsLoading(false);
        }
      } else if (apiStep === 2) {
        // Step 3: Update Related Parties
        const preApplicationResponse = JSON.parse(localStorage.getItem("preApplicationResponse") || "{}");
        const relatedPartiesResponse = JSON.parse(localStorage.getItem("relatedPartiesData") || "{}");
        const relatedPartiesData = relatedPartiesResponse.mandRelatedPart || [];
        const initiatorBPGUID = preApplicationResponse.initiators?.[0]?.initiatorBPGUID;
        const inflightCustomerDataID = preApplicationResponse.inflightCustomerDataId;
        
        console.log("Related Parties Data from GET:", relatedPartiesResponse);
        console.log("Initiator BPGUID:", initiatorBPGUID);
        console.log("Inflight Customer Data ID:", inflightCustomerDataID);
        
        const updatePayload = buildRelatedPartiesUpdatePayload(
          relatedPartiesData,
          initiatorBPGUID,
          inflightCustomerDataID
        );
        
        console.log("Update Related Parties Payload:", JSON.stringify(updatePayload, null, 2));
        
        updateRelatedParties({ body: updatePayload }, {
          onSuccess: () => {
            setIsLoading(false);
            setApiStep(3);
          },
          onError: () => {
            setIsLoading(false);
            setApiStep(3);
          }
        });
      } else if (apiStep === 3) {
        // All APIs completed, navigate to next step
        if (onNext) {
          onNext();
        }
      }
    };

    if (apiStep > 0) {
      executeSequentialAPIs();
    }
  }, [apiStep, updateRelatedParties, onNext]);

  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("marketingConsentFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Expose validation through window object for Stepper to call
  useEffect(() => {
    (window as any).__marketingConsentValidate = async () => {
      const isValid = await new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
      return isValid;
    };
  }, [handleSubmit]);

  const handleFormSubmit = async (data: MarketingConsentData) => {
    setIsLoading(true);
    setApiStep(0);
    
    console.log("Marketing consent data:", data);
    localStorage.setItem("marketingConsentFormData", JSON.stringify(data));

    // Get the previously saved company details payload
    const savedPayload = localStorage.getItem("companyDetailsPayload");
    
    if (!savedPayload) {
      console.error("No company details payload found. Proceeding without API call.");
      setIsLoading(false);
      if (onNext) {
        onNext();
      }
      return;
    }

    const companyPayload = JSON.parse(savedPayload);
    
    // Build consent data
    const consentData = {
      consentForSharing: data.smsConsent === "yes" || data.emailConsent === "yes",
      consentForThirdPartySharing: data.termsConsent,
      consentForCrossBorderSharing: false,
    };

    // Update consent fields in the payload
    const updatedPayload = updateCompanyDetailsWithConsent(companyPayload, consentData);

    console.log("Updated company payload with consent:", updatedPayload);

    // Step 1: Update Company Details with consent values
    updateCompanyDetails({ body: updatedPayload }, {
      onSuccess: (res) => {
        console.log("Company details updated with consent:", res);
        setApiStep(1); // Move to step 1: Get related parties
      },
      onError: (error) => {
        console.error("Error updating company details:", error);
        setIsLoading(false);
        // Proceed anyway
        if (onNext) {
          onNext();
        }
      }
    });
  };

  return (
    <div className="py-6 md:py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
            Marketing consent
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            Before continuing, please select your business marketing preferences
          </p>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* SMS Consent */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-700">
              SMS Marketing Consent
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              May we send you SMS notifications about special offers and promotions?
            </p>
            <Controller
              name="smsConsent"
              control={control}
              render={({ field }) => (
                <>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sms-yes" />
                      <Label
                        htmlFor="sms-yes"
                        className="font-normal cursor-pointer text-gray-700"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sms-no" />
                      <Label
                        htmlFor="sms-no"
                        className="font-normal cursor-pointer text-gray-700"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.smsConsent && (
                    <p className="text-sm text-red-500">
                      {errors.smsConsent.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Email Consent */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-700">
              Email Marketing Consent
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              May we send you email notifications about special offers and promotions?
            </p>
            <Controller
              name="emailConsent"
              control={control}
              render={({ field }) => (
                <>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="email-yes" />
                      <Label
                        htmlFor="email-yes"
                        className="font-normal cursor-pointer text-gray-700"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="email-no" />
                      <Label
                        htmlFor="email-no"
                        className="font-normal cursor-pointer text-gray-700"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.emailConsent && (
                    <p className="text-sm text-red-500">
                      {errors.emailConsent.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Terms Consent */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-700">
              Terms and Conditions
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              I accept the terms and conditions of this service.
            </p>
            <Controller
              name="termsConsent"
              control={control}
              render={({ field }) => (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="termsConsent"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <Label
                      htmlFor="termsConsent"
                      className="font-normal cursor-pointer text-gray-700"
                    >
                      I accept the terms and conditions
                    </Label>
                  </div>
                  {errors.termsConsent && (
                    <p className="text-sm text-red-500">
                      {errors.termsConsent.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Information Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <div className="flex-shrink-0">
              <Info size={20} className="text-white fill-primary-dark" />
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              Please note that you have the right to change your consent and
              preferences at any time in the future by contacting us.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 !mt-12">
          <Button 
            variant="outline" 
            className="w-full md:max-w-40" 
            onClick={onBack} 
            disabled={isLoading}
          >
            Back
          </Button>
          <Button 
            className="w-full md:max-w-40" 
            onClick={async () => {
              const isValid = await (window as any).__marketingConsentValidate?.();
              if (isValid) {
                const formData = watch();
                handleFormSubmit(formData);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketingConsentForm;
