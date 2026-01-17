"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ChevronLeftIcon,
  ChevronRight,
  InfoIcon,
  X,
} from "lucide-react";

/* ----------------------------------
 Types
-----------------------------------*/
interface Business {
  id: string;
  code: string;
  name: string;
  color: string;
  registrationNumber?: string;
  uuid?: string;
  customerType?: string;
  customerDetails?: any;
  companyData?: any; // Full COMPANY_DATA item
  isInactive?: boolean; // True if ENT_STATUS_CODE !== 'IN BUSINESS'
}

interface Company {
  bpId?: string;
  companyName?: string;
  companyRegNumber?: string;
  // Add other fields from the API response
}

type Props = {};

/* ----------------------------------
 Component
-----------------------------------*/
const Page: React.FC<Props> = () => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading companies...");
  const [error, setError] = useState<string | null>(null);

  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const swiperRef = useRef<SwiperType | null>(null);

  /* ----------------------------------
   Data Loading
  -----------------------------------*/
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        const customersData = storedData.customersData;
        
        // Get token - it might be stored as a string or as a JSON object
        let accessToken = null;
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            // Try to parse as JSON first
            const parsed = JSON.parse(token);
            accessToken = parsed.access_token || token;
          } catch {
            // If not JSON, use as-is (it's likely a JWT string)
            accessToken = token;
          }
        }

        console.log("Load Companies - accessToken:", accessToken ? "present" : "missing");
        console.log("Load Companies - customersData length:", customersData?.length);

        // Generate color for each company
        const colors = ["#0033AA", "#E31E46", "#00AF43", "#FF5C00", "#8B00FF", "#00B4D8"];
          const companies: Business[] = [];
        
        let mappedBusinesses: Business[] = [];
            const customer = customersData[0];
            
            if (customer.customerType === "INDIVIDUAL") {
              const firstName = customer.personDetails?.firstName || "";
              const lastName = customer.personDetails?.lastName || "";
              const fullName = `${firstName} ${lastName}`.trim();
              const idNumber = customer.identifications?.[0]?.number || "";

              console.log(`Fetching company info for ${fullName} (ID: ${idNumber})`);

              try {
                // Fetch company information from API
                const headers: HeadersInit = {};
                if (accessToken) {
                  headers['Authorization'] = `Bearer ${accessToken}`;
                }
                
                const companyRes = await fetch(
                  `/api/retrieve-company-information?idNumber=${encodeURIComponent(idNumber)}`,
                  { headers }
                );

                console.log(`Company API response status: ${companyRes.status}`);

                if (companyRes.ok) {
                  const companyData = await companyRes.json();
                  console.log(`Company data received:`, companyData);
                  
                  // Store the initial company data response
                  storedData.companyDataResponse = companyData;
                  localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));
                  
                  // Map ALL company registrations from ALL COMPANY_DATA items
                  const companyDataArray = companyData?.COMPANY_DATA || [];
                  
                  console.log(`Found ${companyDataArray.length} company data items for ${fullName}`);
                  
                  // Loop through each company data item
                  companyDataArray.forEach((companyItem: any) => {
                    const registrations = companyItem?.Registration || [];
                    
                    // Add each registration as a separate business
                    registrations.forEach((reg: any) => {
                      const registration = reg.Registration;
                      const isInactiveStatus = registration.ENT_STATUS_CODE !== 'IN BUSINESS';
                      companies.push({
                        id: registration.ENT_NUMBER || `${customer.partyId}-${companies.length}`,
                        code: (registration.ENT_NAME || "").substring(0, 2).toUpperCase() || "CO",
                        name: registration.ENT_NAME || "Unknown Company",
                        color: colors[companies.length % colors.length],
                        registrationNumber: registration.ENT_NUMBER,
                        uuid: customer.uuid,
                        customerType: customer.customerType,
                        customerDetails: customer.customerDetails,
                        companyData: companyItem, // Store full COMPANY_DATA item
                        isInactive: isInactiveStatus,
                      });
                    });
                  });
                  
                  console.log(`Total registrations mapped: ${companies.length}`);
                } else {
                  const errorData = await companyRes.json().catch(() => ({}));
                  console.error(`Company API error: ${companyRes.status}`, errorData);
                }
              } catch (err) {
                console.error(`Error fetching company info for ID ${idNumber}:`, err);
                // Continue with next customer even if this one fails
              }
            }
        if (customersData && Array.isArray(customersData) && customersData.length > 0) {
          // Fetch company information for each customer
          
          for (let index = 0; index < customersData.length; index++) {
           
          }
            
          console.log(`Total companies found: ${companies.length}`);
          mappedBusinesses = companies;
        } else if (customersData && customersData.customers && customersData.customers.length > 0) {
          // Fallback for old structure
          const apiBusinesses: Business[] = customersData.customers.map((company: any, index: number) => ({
            id: company.companyRegNumber || company.bpId || index.toString(),
            code: (company.companyName || "").substring(0, 2).toUpperCase() || "CO",
            name: company.companyName || "Unknown Company",
            color: colors[index % colors.length],
            registrationNumber: company.companyRegNumber,
          }));

          mappedBusinesses = apiBusinesses;
        } else {
          console.warn("No customers data found");
        }

        setBusinesses(mappedBusinesses);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading companies:", err);
        setError("Failed to load company data");
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  /* ----------------------------------
   Handlers
  -----------------------------------*/
  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
    setDialogOpen(true);
  };

  const handleContinue = async () => {
    if (selectedBusiness) {
      setIsLoading(true);
      setLoadingMessage("Processing application...");
      setError(null);
      setDialogOpen(false);
      try {
        // Get stored business details to check director ID
        const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        const userDirectorId = storedData.businessDetails?.directorId;

        // Get access token - it might be stored as a string or as a JSON object
        let accessToken = null;
        const token = localStorage.getItem("accessToken");
        if (token) {
          try {
            // Try to parse as JSON first
            const parsed = JSON.parse(token);
            accessToken = parsed.access_token || token;
          } catch {
            // If not JSON, use as-is (it's likely a JWT string)
            accessToken = token;
          }
        }

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // Check if this is an individual customer
        if (selectedBusiness.customerType === "INDIVIDUAL" && selectedBusiness.uuid) {
          // Get pre-fetched customer details from localStorage
          const customerDetailsData = selectedBusiness.customerDetails;

          if (!customerDetailsData) {
            throw new Error("Customer details not found");
          }

          // Fetch detailed company information for the selected company
          if (selectedBusiness.companyData && selectedBusiness.companyData.Registration?.[0]?.Registration?.ENT_NUMBER) {
            const entNumber = selectedBusiness.companyData.Registration[0].Registration.ENT_NUMBER;
            console.log(`Fetching detailed company info for ENT_NUMBER: ${entNumber}`);
            
            const detailedHeaders: HeadersInit = {};
            if (accessToken) {
              detailedHeaders['Authorization'] = `Bearer ${accessToken}`;
            }
            
            try {
              // Call API with ENT_NUMBER to get detailed company information
              const detailedCompanyRes = await fetch(
                `/api/retrieve-company-information?idNumber=${encodeURIComponent(entNumber)}`,
                { headers: detailedHeaders }
              );
              
              if (detailedCompanyRes.ok) {
                const detailedCompanyData = await detailedCompanyRes.json();
                console.log('Detailed company data received:', detailedCompanyData);
                
                // Store the selected company's detailed information
                storedData.selectedCompanyDetails = detailedCompanyData;
                localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));
              } else {
                console.error('Failed to fetch detailed company info:', detailedCompanyRes.status);
              }
            } catch (err) {
              console.error('Error fetching detailed company info:', err);
            }
          }

          // Check customer roles
          const customerRoles = customerDetailsData?.customer?.customerRole || [];
          const hasCustomerRole = customerRoles.some((role: any) => role.roleX === "CUSTOMER");

          // Store the customer details data
          storedData.selectedCustomer = selectedBusiness;
          storedData.customerDetails = customerDetailsData;
          localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

          // Call pre-application API with all collected data
          try {
            console.log('Submitting pre-application...');
            
            // Build director details from customer data
            const customersData = storedData.customersData;
            const customer = customersData[0];
            
            // Get preferred contact details
            const contacts = customer.customerDetails?.customer?.contacts || [];
            const preferredEmail = contacts.find((c: any) => c.type === 'EMAIL' && c.preferredInd === 'true')?.value || 
                                   storedData.businessDetails?.email || '';
            const preferredPhone = contacts.find((c: any) => c.type === 'PHONE' && c.preferredInd === 'true')?.value || 
                                   storedData.businessDetails?.cellphone || '';
            
            // Map province to 2-letter code
            const provinceMap: Record<string, string> = {
              'eastern-cape': 'EC',
              'eastern cape': 'EC',
              'free-state': 'FS',
              'free state': 'FS',
              'gauteng': 'GP',
              'kwazulu-natal': 'KZN',
              'kwazulu natal': 'KZN',
              'limpopo': 'LP',
              'mpumalanga': 'MP',
              'northern-cape': 'NC',
              'northern cape': 'NC',
              'north-west': 'NW',
              'north west': 'NW',
              'western-cape': 'WC',
              'western cape': 'WC'
            };
            const provinceFull = storedData.businessDetails?.province || '';
            const provinceCode = provinceMap[provinceFull.toLowerCase()] || '';
            
            const directorDetails = [{
              status: null,
              preferredCommunicationMethod: null,
              pipDetails: {
                publicOfficialRelatedDetails: {
                  typeOfRelationship: null,
                  surname: customer.personDetails?.lastName || "",
                  relatedToPublicOfficial: null,
                  name: customer.personDetails?.firstName || ""
                },
                publicOfficial: false
              },
              mainApplicant: true,
              loggedInUser: true,
              lastName: customer.personDetails?.lastName || "",
              identificationType: "SAID",
              identificationNumber: customer.identifications?.[0]?.number || "",
              identificationCountryCode: "ZA",
              firstName: customer.personDetails?.firstName || "",
              emailAddress: preferredEmail,
              digitalId: null,
              cellphoneNumber: preferredPhone,
              bpId: null,
              authorizedToApply: false
            }];

            // Generate applicationId if not present (Salesforce format)
            let applicationId = storedData.applicationId;
            if (!applicationId) {
              // Generate a Salesforce-like ID if not available
              applicationId = `a6h9M${Date.now().toString().substring(0, 13)}QAA`;
              storedData.applicationId = applicationId;
              localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));
            }
            
            // Determine if sole shareholder (if company has only one director)
            const directors = storedData.selectedCompanyDetails?.COMPANY_DATA?.Directors || [];
            const isSoleShareholder = directors.length === 1;
            
            // Build pre-application payload
            const preApplicationPayload = {
              productDetails: {
                productNumber: "ZPOS",
                productDescription: "MYMOBIZ",
                productCategory: "optional",
                pricingOption: "ZAKP"
              },
              directorDetails: directorDetails,
              consents: storedData.consents || {
                partnerConsents: {
                  creditFraudConsent: true,
                  confirmIdentityConsent: true,
                  collectShare: true
                },
                marketingConsents: {
                  shareCustomerData: true,
                  receiveMarketing: true,
                  marketResearch: true,
                  externalMarketing: true
                }
              },
              businessDetails: {
                soleShareholdingInd: isSoleShareholder,
                createLead: false,
                businessType: selectedBusiness.companyData?.Registration?.[0]?.Registration?.ENT_TYPE || "SOLE PROPRIETOR",
                businessTurnover: storedData.businessDetails?.grossTurnover || "",
                businessRegistrationNumber: selectedBusiness.registrationNumber || "",
                businessProvince: provinceCode,
                businessName: selectedBusiness.name || "",
                businessCity: null
              },
              applicationDetails: {
                inflightCustomerDataId: "MyMo Biz Account",
                bpGuid: storedData.customerDetails?.customer?.bpGuid || null,
                applicationId: applicationId
              }
            };

            console.log('Pre-application payload:', JSON.stringify(preApplicationPayload, null, 2));

            const preAppHeaders: HeadersInit = {
              "Content-Type": "application/json",
            };
            if (accessToken) {
              preAppHeaders["Authorization"] = `Bearer ${accessToken}`;
            }

            const preAppRes = await fetch('/api/pre-application', {
              method: 'POST',
              headers: preAppHeaders,
              body: JSON.stringify(preApplicationPayload)
            });

            if (preAppRes.ok) {
              const preAppData = await preAppRes.json();
              console.log('Pre-application submitted successfully:', preAppData);
              storedData.preApplicationResponse = preAppData;
              localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

              // Handle different status codes
              const status = String(preAppData?.businessStatus);
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
                // Technical error - continue to customer onboarding to fill application
                console.warn(`Pre-application returned status ${status}: ${preAppData?.responseStatusDesc}`);
                setError(`Technical error (${status}): ${preAppData?.responseStatusDesc || 'CreateDigitalOfferException'}. Continuing to application form...`);
                
                // Navigate to customer onboarding to continue the application
                setTimeout(() => {
                  router.push("/account-onboarding/customer-onboarding");
                }, 2000);
              } else if (status === "52000") {
                // Pre-application successful, open PING authorization for login
                const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_PING_REDIRECT_URI || "");
                const pingAuthUrl = `${process.env.NEXT_PUBLIC_PING_AUTHORIZATION_URL}?client_id=${process.env.NEXT_PUBLIC_PING_CLIENT_ID}&response_type=code&scope=openid%20profile%20email&redirect_uri=${redirectUri}&code_challenge=${process.env.NEXT_PUBLIC_CODE_CHALLENGE}&code_challenge_method=${process.env.NEXT_PUBLIC_CODE_CHALLENGE_METHOD}&nonce=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}&state=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}`;
                window.location.href = pingAuthUrl;
              } else {
                console.log("Unknown status:", status);
                // Default to PING authorization for unknown success-like statuses
                const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_PING_REDIRECT_URI || "");
                const pingAuthUrl = `${process.env.NEXT_PUBLIC_PING_AUTHORIZATION_URL}?client_id=${process.env.NEXT_PUBLIC_PING_CLIENT_ID}&response_type=code&scope=openid%20profile%20email&redirect_uri=${redirectUri}&code_challenge=${process.env.NEXT_PUBLIC_CODE_CHALLENGE}&code_challenge_method=${process.env.NEXT_PUBLIC_CODE_CHALLENGE_METHOD}&nonce=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}&state=${process.env.NEXT_PUBLIC_PING_NONCE_STATE}`;
                window.location.href = pingAuthUrl;
              }
            } else {
              const errorData = await preAppRes.json().catch(() => ({}));
              console.error('Pre-application failed:', errorData);
              throw new Error(errorData.responseStatusDesc || 'Pre-application submission failed');
            }
          } catch (preAppErr) {
            console.error('Error submitting pre-application:', preAppErr);
            throw preAppErr;
          }
        } else {
          // Existing logic for companies
          // Fetch company directors and company info
          const [directorsRes, companyInfoRes] = await Promise.all([
            fetch(`/api/get-company-directors?idNumber=${encodeURIComponent(selectedBusiness.registrationNumber || selectedBusiness.id)}`, { headers }),
            fetch(`/api/get-company-info?idNumber=${encodeURIComponent(selectedBusiness.registrationNumber || selectedBusiness.id)}`, { headers })
          ]);

          if (!directorsRes.ok || !companyInfoRes.ok) {
            throw new Error("Failed to fetch company details");
          }

          const directorsData = await directorsRes.json();
          const companyInfoData = await companyInfoRes.json();

          // Validate that the user is actually a director of this company
          const directors = directorsData?.COMPANY_DATA?.Directors || [];
          const isDirector = directors.some((dir: any) => dir.ID_NO === userDirectorId);

          if (!isDirector && userDirectorId) {
            setError(
              `You (ID: ${userDirectorId}) are not listed as a director of ${selectedBusiness.name}. ` +
              `Please select a company where you are a registered director, or continue as a sole proprietor.`
            );
            setDialogOpen(false);
            setIsLoading(false);
            return;
          }

          // Store the data in localStorage
          storedData.selectedCompany = selectedBusiness;
          storedData.companyDirectors = directorsData;
          storedData.companyInfo = companyInfoData;
          localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

          // Navigate to OTP
          router.push("/account-onboarding/otp");
        }
      } catch (err: any) {
        console.error("Error processing selection:", err);
        setError(err.message || "Failed to process selection. Please try again.");
      } finally {
        setIsLoading(false);
        setDialogOpen(false);
      }
    }
  };

  const handleDialogBack = () => {
    setDialogOpen(false);
    setSelectedBusiness(null);
  };

  const handleSoleProprietor = () => {
    console.log("Continue as sole proprietor");
    
    // Mark as sole proprietor in localStorage
    const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    storedData.isSoleProprietor = true;
    storedData.selectedCompany = null;
    storedData.companyDirectors = null;
    storedData.companyInfo = null;
    localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));
    
    // Navigate to OTP verification
    router.push("/account-onboarding/otp");
  };

  const handleBack = () => {
    router.back();
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setShowLeftArrow(!swiper.isBeginning);
    setShowRightArrow(!swiper.isEnd);
  };

  const handlePrevClick = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.slideNext();
  };

  useEffect(() => {
    if (swiperRef.current) {
      setShowLeftArrow(!swiperRef.current.isBeginning);
      setShowRightArrow(!swiperRef.current.isEnd);
    }
  }, []);

  /* ----------------------------------
   JSX
  -----------------------------------*/

  if (error) {
    return (
      <div className="page-container py-4 md:py-8">
        <div className="w-full bg-white rounded-[20px] shadow-lg p-6 md:p-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Button onClick={handleBack} variant="outline" className="w-full md:w-48">
            BACK
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay message={loadingMessage} isVisible={isLoading} />
      
      <div className="page-container py-4 md:py-8">
        <div className="w-full bg-white rounded-[20px] shadow-lg p-6 md:p-10">
          <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <span className="block text-sm text-gray-600 mb-2">
              Account application
            </span>
            <h2 className="text-2xl md:text-3xl font-medium text-secondary mb-6">
              Select a business to continue
            </h2>

            <p className="text-base md:text-lg text-neutral-600 max-w-2xl">
              Using your details, we've found the following registered companies
              linked to you
            </p>
          </div>

          {/* Swiper Section */}
          {businesses.length > 0 ? (
            <div className="bg-gray-50 rounded-xl p-6 md:p-10 mb-6 overflow-hidden">
              <h2 className="text-base md:text-lg font-medium text-neutral-900 mb-6">
                Please select the business you would like to apply for
              </h2>

              <div className="relative w-full">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                    576: { slidesPerView: 2, spaceBetween: 12 },
                    768: { slidesPerView: 2, spaceBetween: 16 },
                    1024: { slidesPerView: 3, spaceBetween: 16 },
                    1280: { slidesPerView: 4, spaceBetween: 20 },
                  }}
                  pagination={{
                    el: ".swiper-pagination-custom",
                    clickable: true,
                  }}
                  onSlideChange={handleSlideChange}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setShowLeftArrow(!swiper.isBeginning);
                    setShowRightArrow(!swiper.isEnd);
                  }}
                  className="swiper-business !overflow-visible"
                >
                  {businesses.map((business) => (
                    <SwiperSlide key={business.id}>
                      <button
                        type="button"
                        onClick={() => handleBusinessSelect(business)}
                        className={`relative w-full bg-white rounded-lg border border-neutral-200 hover:border-primary p-4 min-h-56 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all ${
                          business.isInactive ? 'opacity-60' : ''
                        }`}
                      >
                        {business.isInactive && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Inactive
                          </div>
                        )}
                        <div
                          className="min-w-14 min-h-14 rounded-full flex items-center justify-center text-white font-medium text-lg"
                          style={{
                            backgroundColor: business.color,
                            border: `7px solid ${business.color}4D`,
                          }}
                        >
                          {business.code}
                        </div>

                        <p className="text-sm font-medium text-neutral-900">
                          {business.name}
                        </p>
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {showLeftArrow && (
                  <button
                    onClick={handlePrevClick}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary text-primary-dark hover:text-white"
                  >
                    <ChevronLeftIcon className="w-8 h-8" strokeWidth={1} />
                  </button>
                )}

                {showRightArrow && (
                  <button
                    onClick={handleNextClick}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary text-primary-dark hover:text-white"
                  >
                    <ChevronRight className="w-8 h-8" strokeWidth={1} />
                  </button>
                )}
              </div>

              <div className="swiper-pagination-custom flex justify-center gap-3 mt-8" />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 md:p-10 mb-6">
              <p className="text-center text-gray-600">
                No registered companies found. Please continue as a sole proprietor.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="text-base md:text-lg font-medium text-neutral-900">
              Continue as a sole proprietor without a registered company
            </h3>
            <Button
              variant="outline"
              onClick={handleSoleProprietor}
              className="w-full md:w-48"
            >
              CONTINUE
            </Button>
          </div>

          <div className="flex items-start gap-2 py-4 mb-6">
            <InfoIcon className="text-white fill-primary -mt-0.5" />
            <div className="text-base text-primary font-normal">
              <h6>Please note:</h6>
              <ul className="list-disc ml-4">
                <li>Savings accounts are not permitted</li>
                <li>
                  Personal bank accounts are only permitted if your company is a
                  sole proprietor
                </li>
              </ul>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full md:w-48"
          >
            BACK
          </Button>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden border-none rounded-2xl [&>button]:hidden">
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-primary-dark to-primary p-4 sm:p-6 relative">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl text-center font-normal text-white pr-8">
              Continue the application with {selectedBusiness?.name}
            </DialogTitle>
            {/* Custom Close Button */}
            <DialogClose asChild>
              <button
                className="!mt-0 absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </DialogClose>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-8">
            <p className="text-center text-gray-700 text-base md:text-lg leading-relaxed">
              You are about to continue your application with{" "}
              <span className="font-medium text-gray-900">
                {selectedBusiness?.name}
              </span>
              .
            </p>
          </div>

          {/* Footer with Action Buttons */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleDialogBack}
                className="w-full sm:w-auto md:w-1/3"
              >
                BACK
              </Button>
              <Button
                onClick={handleContinue}
                className="w-full sm:w-auto md:w-1/3"
              >
                CONTINUE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        :global(.swiper-business) {
          overflow: visible !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        :global(.swiper-business .swiper-wrapper) {
          padding: 0;
        }

        :global(.swiper-business .swiper-slide) {
          height: auto;
        }

        :global(.swiper-pagination-custom) {
          display: flex !important;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
          position: static !important;
        }

        :global(.swiper-pagination-custom .swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          background: #d1d5db !important;
          opacity: 1 !important;
          margin: 0 !important;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 50%;
        }

        :global(.swiper-pagination-custom .swiper-pagination-bullet:hover) {
          background: #9ca3af !important;
        }

        :global(.swiper-pagination-custom .swiper-pagination-bullet-active) {
          background: #0051ff !important;
          width: 24px !important;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default Page;
