"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import merchantApp from "@/assets/images/general/mobile_app_device.png";
import cardMachineMd from "@/assets/images/general/card_machine_md.png";
import { Info, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cardMachineSummarySchema } from "@/lib/validationSchemas";

type CardMachineSummaryData = {
  cardMachineQuantity: string;
  monthlyTransactionVolume: string;
  acceptanceFee: string;
  agreementAccepted: boolean;
};

interface Props {
  onNext?: () => void;
  onBack?: () => void;
}

export default function CardMachineSummary({ onNext, onBack }: Props) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    control,
    formState: { errors, isValidating },
    handleSubmit,
    watch,
    reset,
  } = useForm<CardMachineSummaryData>({
    resolver: yupResolver(cardMachineSummarySchema) as any,
    mode: "onChange",
    defaultValues: {
      cardMachineQuantity: "1",
      monthlyTransactionVolume: "",
      acceptanceFee: "",
      agreementAccepted: false,
    },
  });

  useEffect(() => {
    const data = localStorage.getItem("cardMachineSummaryFormData");
    if (data) {
      reset(JSON.parse(data));
    }
  }, [reset]);

  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("cardMachineSummaryFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Expose validation through window object for Stepper to call
  useEffect(() => {
    (window as any).__cardMachineSummaryValidate = async () => {
      const isValid = await new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
      return isValid;
    };
  }, [handleSubmit]);

  return (
    <div>
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
            Card machine and merchant app
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            Confirm that the information for your card machine(s) is correct.
            You can download the Merchant App from Google Play or the Apple App
            Store.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Card Machine */}
          <>
            {/* Card Type One */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              {/* Card Machine Image */}
              <div>
                <div className="h-14 bg-gradient-to-tr from-blue-900 to-blue-600 relative">
                  <span className="absolute bg-gradient-to-tr from-primary to-blue-600 text-white px-4 py-1 rounded-br-2xl text-xs">
                    INCLUDES INSTALLATION
                  </span>
                </div>
                <div className="bg-primary-dark flex justify-center p-2">
                  <Image
                    src={cardMachineMd}
                    alt="card_machine_md"
                    width={386}
                    height={360}
                  />
                </div>
              </div>

              {/* Machine Name */}
              <div className="p-6">
                <h2 className="text-2xl font-medium text-gray-900">
                  SimplyBLU Pro
                </h2>
              </div>

              {/* Pricing Card */}
              <div className="bg-gray-100 rounded-lg p-6 space-y-6">
                {/* Quantity */}
                <div>
                  <div className="text-5xl font-medium text-gray-900 mb-2">
                    1
                  </div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Number of card
                    <br />
                    machine(s)
                  </p>
                </div>

                {/* Monthly Rental Fee */}
                <div>
                  <div className="flex items-start gap-1">
                    <span className="text-xl text-gray-900">R</span>
                    <span className="text-4xl font-medium text-gray-900">
                      380.00
                    </span>
                    <div className="relative inline-block ml-1">
                      <button type="button" className="focus:outline-none">
                        <Info size={18} className="text-white fill-primary" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mt-1">
                    Total monthly rental fee
                    <br />
                    (excl. VAT)
                  </p>
                </div>

                {/* Connectivity Fee */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl text-gray-900">R</span>
                    <span className="text-4xl font-medium text-gray-900">
                      0
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide mt-1">
                    Total monthly connectivity fee
                    <br />
                    (excl. VAT)
                  </p>
                </div>
              </div>
            </div>

            {/* Card Type Two */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              {/* Card Machine Image */}
              <div>
                <div className="h-14 bg-gradient-to-tr from-blue-900 to-blue-600 relative">
                  <span className="absolute bg-gradient-to-tr from-primary to-blue-600 text-white px-4 py-1 rounded-br-2xl text-xs">
                    INCLUDES INSTALLATION
                  </span>
                </div>
                <div className="bg-primary-dark flex justify-center p-2">
                  <Image
                    src={cardMachineMd}
                    alt="card_machine_md"
                    width={386}
                    height={360}
                  />
                </div>
              </div>

              {/* Machine Name */}
              <div className="p-6">
                <h2 className="text-2xl font-medium text-gray-900">
                  Merchant App
                </h2>
              </div>

              {/* Pricing Card */}
              <div className="bg-gray-100 rounded-lg p-6 space-y-6">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Download the SimplyBLU Merchant App and register with the
                  merchant number provided at the end of your application. A
                  merchant commission fee may apply for digital payments.
                </p>
                {/* Benefits Section */}
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Benefits
                </h3>

                <ul className="space-y-4">
                  {/* Benefit 1 */}
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Turn your Android phone into a card machine with Mobile
                      Pay. Send payment links or e-invoices to get paid
                      remotely.
                    </p>
                  </li>

                  {/* Benefit 2 */}
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Gain real-time insights to understand your customers
                      needs.
                    </p>
                  </li>

                  {/* Benefit 3 */}
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Access your sales report wherever and whenever you need.
                    </p>
                  </li>

                  {/* Benefit 4 */}
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Make quick sales, process refunds and manage stock at
                      lightning speed.
                    </p>
                  </li>

                  {/* Benefit 5 */}
                  <li className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Launch an online store with our Online Store Builder – no
                      coding required.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </>

          {/* Right Column - Merchant App */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              {/* App Icon */}
              <Image
                src={merchantApp}
                alt="Merchant App"
                className="w-24 md:w-28 rounded-lg shadow-md"
              />

              {/* App Info */}
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

            {/* Benefits Section */}
            <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits</h3>

            <ul className="space-y-4">
              {/* Benefit 1 */}
              <li className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Turn your Android phone into a card machine with Mobile Pay.
                  Send payment links or e-invoices to get paid remotely.
                </p>
              </li>

              {/* Benefit 2 */}
              <li className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Gain real-time insights to understand your customers needs.
                </p>
              </li>

              {/* Benefit 3 */}
              <li className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Access your sales report wherever and whenever you need.
                </p>
              </li>

              {/* Benefit 4 */}
              <li className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Make quick sales, process refunds and manage stock at
                  lightning speed.
                </p>
              </li>

              {/* Benefit 5 */}
              <li className="flex items-start gap-3">
                <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Launch an online store with our Online Store Builder – no
                  coding required.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex mt-10 gap-4">
        <Button variant="outline" className="w-full md:w-1/4" onClick={onBack} disabled={isValidating}>
          Back
        </Button>
        <Button 
          className="w-full md:w-1/4" 
          onClick={() => setOpen(true)}
          disabled={isValidating}
        >
          Confirm
        </Button>
      </div>


      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden border-none rounded-2xl [&>button]:hidden">
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-primary-dark to-primary p-4 sm:p-6 relative">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl text-center font-normal text-white pr-8">
              Sign legal agreements
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

          {/* Scrollable Content */}
          <div className="px-6 py-8 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-gray-800 text-lg md:text-xl font-medium leading-relaxed">
                By clicking sign, I (being the duly authorised representative of
                the company):
              </h3>

              <div className="space-y-6 text-gray-700">
                <div className="flex gap-4">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm md:text-base leading-relaxed">
                      Confirm that I have read, understood and accept the
                      agreement on behalf of the company
                    </p>
                    <button
                      className="text-primary hover:text-primary-dark underline text-sm md:text-base font-medium transition-colors"
                    >
                      SimplyBLU Application information, disclosures and T&Cs
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <div className="space-y-4 flex-1">
                    <p className="text-sm md:text-base leading-relaxed">
                      Acknowledge that even though I have accepted the agreement
                      on behalf of the company, it does not mean that the
                      process is finalised. The account application/s will only
                      be submitted for approval once I have successfully
                      completed the web facial recognition process.
                    </p>

                    <p className="text-sm md:text-base leading-relaxed">
                      Warrant on behalf of the company to the Bank on the date
                      of acceptance of the agreement and for the duration of the
                      agreement that:
                    </p>

                    <ul className="space-y-3 bg-gray-50 rounded-lg p-4">
                      {[
                        "I am duly authorised to act on behalf of the company.",
                        "The agreement constitutes valid and binding obligations on the company.",
                        "The account/s are subject to the terms of the agreement.",
                        "The terms of the agreement do not conflict with and are not in breach of the terms of any other agreement, undertaking or act that is binding on the company.",
                        "All information provided to the Bank on behalf of the company in connection with the agreement is accurate, current and complete.",
                        "The company is not in default in respect of any of its obligations in connection with the agreement and no default has occurred.",
                      ].map((text, idx) => (
                        <li key={idx} className="flex gap-3">
                          <span className="text-blue-600 text-sm mt-1">•</span>
                          <p className="text-sm md:text-base leading-relaxed flex-1">
                            {text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Action Button */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="max-w-3xl mx-auto flex justify-center gap-4">
              <Button
                variant="outline"
                className="w-full md:w-1/3"
                size="md"
                onClick={() => setOpen(false)}
              >
                CANCEL
              </Button>
              <Button
                variant="default"
                className="w-full md:w-1/3"
                size="md"
                onClick={async () => {
                  const isValid = await (window as any).__cardMachineSummaryValidate?.();
                  if (isValid) {
                    setOpen(false);
                    if (onNext) onNext();
                  }
                }}
                disabled={isValidating}
              >
                {isValidating ? "SIGNING..." : "SIGN"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
