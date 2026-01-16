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
  const [error, setError] = useState<string | null>(null);

  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const swiperRef = useRef<SwiperType | null>(null);

  /* ----------------------------------
   Data Loading
  -----------------------------------*/
  useEffect(() => {
    const loadCompanies = () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        const customersData = storedData.customersData;

        // Generate color for each company
        const colors = ["#0033AA", "#E31E46", "#00AF43", "#FF5C00", "#8B00FF", "#00B4D8"];
        
        // Dummy company for testing
        const dummyCompany: Business = {
          id: "2010/144143/23",
          code: "LH",
          name: "LAVENDER HILL TRADING 532",
          color: "#0033AA",
          registrationNumber: "2010/144143/23",
        };

        let mappedBusinesses: Business[] = [dummyCompany];

        if (customersData && customersData.customers && customersData.customers.length > 0) {
          const apiBusinesses: Business[] = customersData.customers.map((company: any, index: number) => ({
            id: company.companyRegNumber || company.bpId || index.toString(),
            code: (company.companyName || "").substring(0, 2).toUpperCase() || "CO",
            name: company.companyName || "Unknown Company",
            color: colors[(index + 1) % colors.length],
            registrationNumber: company.companyRegNumber,
          }));

          mappedBusinesses = [dummyCompany, ...apiBusinesses];
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
      setError(null);

      try {
        // Get stored business details to check director ID
        const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        const userDirectorId = storedData.businessDetails?.directorId;

        // Get access token from sessionStorage
        const token = sessionStorage.getItem("ping_access_token_data");
        const accessToken = token ? JSON.parse(token).access_token : null;

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

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

        // Navigate to verification or next step
        router.push("/account-onboarding/otp");
      } catch (err: any) {
        console.error("Error fetching company details:", err);
        setError(err.message || "Failed to fetch company details. Please try again.");
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
  if (isLoading) {
    return (
      <div className="page-container py-4 md:py-8">
        <div className="w-full bg-white rounded-[20px] shadow-lg p-6 md:p-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Loading companies...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                        className="relative w-full bg-white rounded-lg border border-neutral-200 hover:border-primary p-4 min-h-56 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all"
                      >
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

            :global(
                .swiper-pagination-custom .swiper-pagination-bullet-active
              ) {
              background: #0051ff !important;
              width: 24px !important;
              border-radius: 4px;
            }
          `}</style>
    </div>
  );
};

export default Page;
