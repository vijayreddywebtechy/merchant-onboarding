"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import merchantApp from "@/assets/images/general/mobile_app_device.png"

type OptionType = "rent" | "activate" | "merchant-app";
type Props = {};

const TellusMore = (props: Props) => {
  const [selectedOption, setSelectedOption] = useState<OptionType>("rent");

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedOption(e.target.value as OptionType);
  };
  return (
    <div className="page-container py-4 md:py-8">
      <div className="w-full bg-white rounded-[20px] shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-medium text-secondary mb-6">
          Tell us more
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Form */}
          <div className="flex flex-col">
            <p className="text-gray-700 font-medium mb-6">
              Do you want to order a new card machine, set up one you already
              have, or get access to the Merchant App?
            </p>

            <div>
              <p className="text-sm text-gray-600 mb-4">Please select</p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    value: "rent",
                    label: "I want to rent or buy a new card machine",
                  },
                  {
                    value: "activate",
                    label:
                      "I want to activate card machine(s) I've bought from Takealot",
                  },
                  {
                    value: "merchant-app",
                    label:
                      "I want to accept payments using only the Merchant App",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="option"
                      value={option.value}
                      checked={selectedOption === option.value}
                      onChange={handleOptionChange}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button
                variant="outline"
                className="flex-1 h-12 text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                BACK
              </Button>

              <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700">
                NEXT
              </Button>
            </div>
          </div>

          {/* Right Column - Merchant App Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <Image
                src={merchantApp}
                alt="Merchant App"
                className="w-24 md:w-28 rounded-lg shadow-md"
              />

              <div>
                <h2 className="text-xl font-medium text-secondary mb-1">
                  Merchant App
                </h2>
                <p className="text-sm text-gray-600 mb-3">Free download</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Download the SimplyBLU Merchant App and register with the
                  merchant number provided at the end of your application. A
                  merchant commission fee may apply for digital payments.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Benefits
            </h3>

            <ul className="space-y-4">
              {[
                "Turn your Android phone into a card machine with Mobile Pay. Send payment links or e-invoices to get paid remotely.",
                "Gain real-time insights to understand your customers needs.",
                "Access your sales report wherever and whenever you need.",
                "Make quick sales, process refunds and manage stock at lightning speed.",
                "Launch an online store with our Online Store Builder – no coding required.",
              ].map((text, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                    <Check size={16} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TellusMore;
