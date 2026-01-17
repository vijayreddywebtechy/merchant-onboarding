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

    // Get additional data from localStorage
    const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    const companyInfo = storedData.companyInfo?.COMPANY_DATA;
    const companyDirectors = storedData.companyDirectors?.COMPANY_DATA?.Directors || [];
    const selectedCompany = storedData.selectedCompany;
    const isSoleProprietor = storedData.isSoleProprietor === true;

    // Get main director - try to find by ID first, otherwise use first director
    const mainDirector = companyDirectors.find((dir: any) => dir.ID_NO === formData.directorId) 
      || companyDirectors[0] 
      || {};

    // Determine business type and details - use isSoleProprietor flag first
    const businessType = isSoleProprietor 
      ? "SOLE PROPRIETOR" 
      : (companyInfo?.Registration?.ENT_TYPE || "SOLE PROPRIETOR");
    
    const businessName = isSoleProprietor 
      ? "Business"
      : (companyInfo?.Registration?.ENT_NAME || selectedCompany?.name || "Business");
    const businessRegNumber = isSoleProprietor 
      ? formData.directorId 
      : (companyInfo?.Registration?.ENT_NUMBER || selectedCompany?.registrationNumber || formData.directorId);

    // Extract first and last names from director ID (format: SURNAMEINTIALS)
    // For sole proprietor, derive names from identification number or use defaults
    let firstName = mainDirector.FIRST_NAMES || null;
    let lastName = mainDirector.SURNAME || null;
    const pipSurname = isSoleProprietor ? formData.directorId : (mainDirector.SURNAME || formData.directorId);
    const pipName = isSoleProprietor ? "Director" : (mainDirector.FIRST_NAMES || "Director");
    
    // Province mapping - use short codes (EC, GP, WC, etc.) instead of full names
    const provinceMap: Record<string, string> = {
      "eastern-cape": "EC",
      "ec": "EC",
      "eastern cape": "EC",
      "free state": "FS",
      "fs": "FS",
      "gauteng": "GP",
      "gp": "GP",
      "kwazulu-natal": "KN",
      "kn": "KN",
      "limpopo": "LP",
      "lp": "LP",
      "mpumalanga": "MP",
      "northern cape": "NC",
      "nc": "NC",
      "north west": "NW",
      "nw": "NW",
      "western cape": "WC",
      "wc": "WC",
    };
    const businessProvince = provinceMap[formData.province.toLowerCase()] || formData.province.toUpperCase().substring(0, 2);
    
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
              surname: pipSurname,
              relatedToPublicOfficial: null,
              name: pipName,
            },
            publicOfficial: false,
          },
          mainApplicant: true,
          loggedInUser: true,
          lastName: lastName,
          identificationType: "SAID",
          identificationNumber: formData.directorId,
          identificationCountryCode: "ZA",
          firstName: firstName,
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
          shareCustomerData: true,  // Default to true for better user experience
          receiveMarketing: true,
          marketResearch: true,
          externalMarketing: true,
        },
      },
      businessDetails: {
        soleShareholdingInd: true,  // Always true for sole proprietor onboarding
        createLead: false,
        businessType: businessType,
        businessTurnover: formData.grossTurnover,
        businessRegistrationNumber: businessRegNumber,
        businessProvince: businessProvince,
        businessName: businessName,
        businessCity: null,
      },
      applicationDetails: {
        inflightCustomerDataId: "MyMo Biz Account",  // Use consistent value
        bpGuid: null,
        applicationId: "a6h9M0000007909QAA",
      },
    };

    console.log("Pre-application payload:", JSON.stringify(payload, null, 2));

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
              // Technical error - for now, continue to customer onboarding to fill application
              console.warn(`Pre-application returned status ${status}: ${data?.responseStatusDesc}`);
              setIsLoading(false);
              setError(`Technical error (${status}): ${data?.responseStatusDesc || 'CreateDigitalOfferException'}. Continuing to application form...`);
              
              // Navigate to customer onboarding to continue the application
              setTimeout(() => {
                router.push("/account-onboarding/customer-onboarding");
              }, 2000);
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

  const submitPreApplicationOnly = async () => {
    console.log("Starting pre-application submission after OTP verification");

    setIsLoading(true);
    setError(null);

    // Get business details from localStorage
    const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    const businessDetails = storedData.businessDetails;

    if (!businessDetails) {
      setError("Business details not found. Please start from the beginning.");
      setIsLoading(false);
      return;
    }

    // Step 1: Get access token
    try {
      await new Promise<void>((resolve, reject) => {
        accessTokenMutation.mutate(undefined, {
          onSuccess: async (tokenData) => {
            console.log("✅ Access token generated successfully for pre-application");

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
              await submitPreApplication(businessDetails, tokenData.access_token);
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

  return {
    handleFormSubmit,
    submitPreApplicationOnly,
    isLoading,
    error,
  };
};
