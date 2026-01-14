"use client";

import React, { useState, useRef, useEffect } from "react";
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
  id: number;
  code: string;
  name: string;
  color: string;
}

type Props = {};

/* ----------------------------------
 Component
-----------------------------------*/
const Page: React.FC<Props> = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );

  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const swiperRef = useRef<SwiperType | null>(null);

  /* ----------------------------------
   Data
  -----------------------------------*/
  const businesses: Business[] = [
    { id: 1, code: "AC", name: "ABC Consulting", color: "#0033AA" },
    {
      id: 2,
      code: "ZC",
      name: "Imperium Products & Solutions",
      color: "#E31E46",
    },
    { id: 3, code: "MR", name: "MMP Removals", color: "#00AF43" },
    { id: 4, code: "NT", name: "NewWave Transport", color: "#FF5C00" },
    { id: 5, code: "BX", name: "BX Solutions", color: "#8B00FF" },
    { id: 6, code: "TR", name: "Tech Resources", color: "#00B4D8" },
  ];

  /* ----------------------------------
   Handlers
  -----------------------------------*/
  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
    setDialogOpen(true);
  };

  const handleContinue = () => {
    if (selectedBusiness) {
      console.log("Continue with:", selectedBusiness);
      // Navigate to next step or handle continuation
      setDialogOpen(false);
    }
  };

  const handleDialogBack = () => {
    setDialogOpen(false);
    setSelectedBusiness(null);
  };

  const handleSoleProprietor = () => {
    console.log("Continue as sole proprietor");
  };

  const handleBack = () => {
    window.history.back();
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
