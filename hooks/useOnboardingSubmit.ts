import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAccessToken } from "./useAccessToken";
import { useCustomMutation } from "./useCustomMutation";

interface BusinessDetailsFormData {
  directorId: string;
  cellphone: string;
  email: string;
  grossTurnover: string;
  province: string;
  privacyAccepted: boolean;
}

export const useOnboardingSubmit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessTokenMutation = useAccessToken();
  const preApplicationSubmit = useCustomMutation({
    url: "/api/get-preapplication",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: BusinessDetailsFormData) => {
    console.log("Onboarding form data:", formData);

    setIsLoading(true);
    setError(null);

    // Save form data to localStorage
    const existingData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    existingData.businessDetails = formData;
    localStorage.setItem("merchantOnboardingData", JSON.stringify(existingData));

    // Step 1: Get access token
    try {
      await new Promise<void>((resolve, reject) => {
        accessTokenMutation.mutate(undefined, {
          onSuccess: async (tokenData) => {
            console.log("✅ Access token generated successfully");

            if (tokenData?.access_token) {
              // Save token for later use
              if (tokenData?.expires_in) {
                const tokenInfo = {
                  access_token: tokenData.access_token,
                  expires_in: tokenData.expires_in,
                  timestamp: Date.now(),
                };
                sessionStorage.setItem("ping_access_token_data", JSON.stringify(tokenInfo));
              }

              // Step 2: Submit pre-application with token
              await submitPreApplication(formData, tokenData.access_token);
              resolve();
            }
          },
          onError: (err) => {
            setIsLoading(false);
            const errorMessage = err?.message || "Failed to generate access token. Please check your configuration.";
            setError(errorMessage);
            console.error("Token generation error:", err);
            reject(err);
          },
        });
      });
    } catch (err) {
      setIsLoading(false);
      setError("Failed to process request. Please try again.");
      console.error("Error:", err);
    }
  };

  const submitPreApplication = async (
    formData: BusinessDetailsFormData,
    accessToken: string
  ) => {
    const productNumber = searchParams.get("prodId") || "ZPOS";
    const pricingOption = searchParams.get("prOpt") || "ZSIB";

    const payload = {
      productDetails: {
        productNumber: productNumber,
        productDescription: productNumber === "ZPOS" ? "MYMOBIZ" : "",
        productCategory: "optional",
        pricingOption: pricingOption,
      },
      directorDetails: [
        {
          status: null,
          preferredCommunicationMethod: null,
          pipDetails: {
            publicOfficialRelatedDetails: {
              typeOfRelationship: null,
              surname: formData.directorId,
              relatedToPublicOfficial: null,
              name: "Director",
            },
            publicOfficial: false,
          },
          mainApplicant: true,
          loggedInUser: true,
          lastName: null,
          identificationType: "SAID",
          identificationNumber: formData.directorId,
          identificationCountryCode: "ZA",
          firstName: null,
          emailAddress: formData.email,
          digitalId: null,
          cellphoneNumber: formData.cellphone,
          bpId: null,
          authorizedToApply: false,
        },
      ],
      consents: {
        partnerConsents: {
          creditFraudConsent: true,
          confirmIdentityConsent: true,
          collectShare: true,
        },
        marketingConsents: {
          shareCustomerData: false,
          receiveMarketing: false,
          marketResearch: false,
          externalMarketing: false,
        },
      },
      businessDetails: {
        soleShareholdingInd: true,
        createLead: false,
        businessType: "SOLE PROPRIETOR",
        businessTurnover: formData.grossTurnover,
        businessRegistrationNumber: formData.directorId,
        businessProvince: formData.province.toUpperCase(),
        businessName: "Business",
        businessCity: "City",
      },
      applicationDetails: {
        inflightCustomerDataId: "",
        bpGuid: null,
        applicationId: "a6h9M0000007909QAA",
      },
    };

    try {
      await preApplicationSubmit.mutate(
        { body: payload },
        {
          onSuccess: (data: any) => {
            console.log("✅ Pre-application submitted successfully:", data);
            setIsLoading(false);

            // Save response to localStorage
            localStorage.setItem("preApplicationResponse", JSON.stringify(data));

            // Handle different status codes
            const status = String(data?.businessStatus);
            if ([
              "52003", "52004", "52002", "52111", "52113", "52103", "52104",
            ].includes(status)) {
              router.push("/application/submission-status?type=moreInfo");
            } else if (status === "52105") {
              router.push("/application/submission-status?type=callBack");
            } else if (status === "52109") {
              router.push("/application/submission-status?type=unsuccessful");
            } else if (status === "52110") {
              router.push("/application/submission-status?type=inactiveCIPC");
            } else if (status === "52112") {
              router.push("/application/activeCIPC");
            } else if ([
              "52100", "52101", "52107", "52108",
            ].includes(status)) {
              setError("Technical difficulties. Please try again.");
            } else if (status === "52000") {
              // Pre-application successful, open PING authorization for login
              setIsLoading(false);
              const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_PING_REDIRECT_URI || "");
              const pingAuthUrl = `${process.env.NEXT_PUBLIC_PING_AUTHORIZATION_URL}?client_id=${process.env.NEXT_PUBLIC_PING_CLIENT_ID}&response_type=code&scope=openid%20profile%20email&redirect_uri=${redirectUri}&code_challenge=${process.env.NEXT_PUBLIC_CODE_CHALLENGE}&code_challenge_method=${process.env.NEXT_PUBLIC_CODE_CHALLENGE_METHOD}&nonce=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}&state=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}`;
              window.location.href = pingAuthUrl;
            } else {
              console.log("Unknown status:", status);
              // Default to PING authorization for unknown success-like statuses
              setIsLoading(false);
              const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_PING_REDIRECT_URI || "");
              const pingAuthUrl = `${process.env.NEXT_PUBLIC_PING_AUTHORIZATION_URL}?client_id=${process.env.NEXT_PUBLIC_PING_CLIENT_ID}&response_type=code&scope=openid%20profile%20email&redirect_uri=${redirectUri}&code_challenge=${process.env.NEXT_PUBLIC_CODE_CHALLENGE}&code_challenge_method=${process.env.NEXT_PUBLIC_CODE_CHALLENGE_METHOD}&nonce=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}&state=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}`;
              window.location.href = pingAuthUrl;
            }
          },
          onError: (err: any) => {
            setIsLoading(false);
            setError("Failed to submit pre-application. Please try again.");
            console.error("Pre-application error:", err);
          },
        }
      );
    } catch (err) {
      setIsLoading(false);
      setError("Failed to submit pre-application. Please try again.");
      console.error("Error:", err);
    }
  };

  return {
    handleFormSubmit,
    isLoading,
    error,
  };
};
