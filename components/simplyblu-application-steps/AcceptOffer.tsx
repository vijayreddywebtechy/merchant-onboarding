"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import Image from "next/image";
import cardMachine from "@/assets/images/general/card_machine.png";

interface AcceptOfferProps {
  onNext?: () => void;
  onBack?: () => void;
}

const AcceptOffer = ({ onNext, onBack }: AcceptOfferProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: setDigitalOffer } = useCustomMutation({
    url: `/api/set-digital-offer`,
    method: "PUT",
  });

  const handleAcceptOffer = async () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    // Get offer data from localStorage
    const preApplicationResponse = JSON.parse(
      localStorage.getItem("preApplicationResponse") || "{}"
    );
    const offerId = preApplicationResponse.offerId;

    if (!offerId) {
      console.error("No offer ID found");
      alert("Error: No offer ID found. Please try again.");
      setIsLoading(false);
      return;
    }

    // Prepare payload for set-digital-offer API
    const payload = {
      offerId: offerId,
      digitalOfferAccepted: true,
      acceptedTimestamp: new Date().toISOString(),
    };

    console.log("Accepting digital offer:", payload);

    setDigitalOffer(
      { body: payload },
      {
        onSuccess: (res) => {
          console.log("Digital offer accepted successfully:", res);
          setIsLoading(false);
          
          // Store acceptance in localStorage
          localStorage.setItem("digitalOfferAccepted", "true");
          
          if (onNext) {
            onNext();
          }
        },
        onError: (error) => {
          console.error("Error accepting digital offer:", error);
          setIsLoading(false);
          
          // Proceed anyway for demo purposes
          localStorage.setItem("digitalOfferAccepted", "true");
          if (onNext) {
            onNext();
          }
        },
      }
    );
  };

  return (
    <div className="py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
          Accept Your Offer
        </h2>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
          Review and accept your merchant account offer
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-8 border border-gray-200 rounded-lg p-6 md:p-10 bg-white shadow-sm">
        {/* Offer Summary */}
        <div>
          <h3 className="text-2xl font-medium text-gray-800 mb-6">
            Your Offer Summary
          </h3>

          <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-xl p-6 text-white mb-6">
            <div className="text-center">
              <p className="text-lg mb-2">Total Monthly Fee</p>
              <div className="flex items-baseline justify-center">
                <sup className="text-lg">R</sup>
                <span className="text-4xl font-bold mx-1">249.00</span>
                <sub className="text-sm">(Excl VAT)</sub>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Transaction Fee (Debit Cards)</span>
              <span className="font-medium">2.50%</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Transaction Fee (Credit Cards)</span>
              <span className="font-medium">2.50%</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Monthly Rental Fee</span>
              <span className="font-medium">R 199.00</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-700">Connectivity Fee</span>
              <span className="font-medium">R 50.00</span>
            </div>
          </div>

          {/* Card Machine Image */}
          <div className="flex justify-center mb-6">
            <Image
              src={cardMachine}
              alt="Card Machine"
              width={200}
              height={200}
            />
          </div>
        </div>

        <hr />

        {/* Terms and Conditions */}
        <div>
          <h3 className="text-2xl font-medium text-gray-800 mb-4">
            Terms and Conditions
          </h3>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
            <p className="text-sm text-gray-700 mb-3">
              By accepting this offer, you agree to the following terms and conditions:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>You will be charged the monthly rental fee for the card machine</li>
              <li>Transaction fees will be deducted from each transaction</li>
              <li>You are responsible for the card machine and must report any damage</li>
              <li>The agreement is subject to credit approval</li>
              <li>You can cancel at any time with 30 days notice</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3 mb-6">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <Label
              htmlFor="terms"
              className="text-sm cursor-pointer leading-relaxed"
            >
              I have read and accept the terms and conditions, and I authorize
              Standard Bank to proceed with my merchant account application
            </Label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 !mt-12">
          {onBack && (
            <Button
              variant="outline"
              className="w-full md:max-w-40"
              onClick={onBack}
              type="button"
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <Button
            className="w-full md:max-w-40 ml-auto"
            onClick={handleAcceptOffer}
            disabled={!termsAccepted || isLoading}
          >
            {isLoading ? "Processing..." : "Accept Offer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcceptOffer;