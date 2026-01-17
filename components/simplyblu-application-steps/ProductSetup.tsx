import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Props } from "react-select";
import cardMachine from "@/assets/images/general/card_machine.png";
import pocketCardMachine from "@/assets/images/general/pocket_card_machine.png";
import mobileAppDevice from "@/assets/images/general/mobile_app_device.png";
import visaCard from "@/assets/images/general/visa_card.png";
import masterCard from "@/assets/images/general/master_card.png";
import unionPay from "@/assets/images/general/union_pay.png";
import dinersClub from "@/assets/images/general/diners_club.png";
import aeRcs from "@/assets/images/general/ae_rcs.png";
import recieptIcon from "@/assets/images/icons/icn_reciept.png";
import Link from "next/link";
import { Info } from "lucide-react";

interface CardMachineSelectionData {
  tradingName: string;
  purchaseType: "buy" | "rent";
  proMachineCount: string;
  pocketMachineCount: string;
  proSelected: boolean;
  pocketSelected: boolean;
  estimatedTurnover: string;
}

interface ProductSetupProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Number of machines options for CustomSelect
const numberOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
];

// Pricing configuration
const pricingConfig = {
  rent: {
    proDeviceFee: 399,
    pocketDeviceFee: 399,
    connectivityFee: 0,
    maxDevices: 4
  },
  buy: {
    proDeviceFee: 1999,
    pocketDeviceFee: 1999,
    connectivityFee: 40,
    maxDevices: 2
  }
};

const ProductSetup = ({ onNext, onBack }: ProductSetupProps) => {
  // Load saved data from localStorage
  const [formData, setFormData] = useState<CardMachineSelectionData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem("productSetupData");
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    return {
      tradingName: "",
      purchaseType: "rent",
      proMachineCount: "1",
      pocketMachineCount: "1",
      proSelected: false,
      pocketSelected: false,
      estimatedTurnover: "",
    };
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("productSetupData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProMachineChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      proMachineCount: selected ? selected.value : "",
    }));
  };

  const handlePocketMachineChange = (option: any) => {
    const selected = Array.isArray(option) ? option[0] : option;
    setFormData((prev) => ({
      ...prev,
      pocketMachineCount: selected ? selected.value : "",
    }));
  };

  const toggleProSelection = () => {
    setFormData((prev) => ({
      ...prev,
      proSelected: !prev.proSelected,
      proMachineCount: !prev.proSelected ? prev.proMachineCount : "0",
    }));
  };

  const togglePocketSelection = () => {
    setFormData((prev) => ({
      ...prev,
      pocketSelected: !prev.pocketSelected,
      pocketMachineCount: !prev.pocketSelected ? prev.pocketMachineCount : "0",
    }));
  };

  const getCurrentPricing = () => {
    return formData.purchaseType ? pricingConfig[formData.purchaseType] : pricingConfig.rent;
  };

  const calculateTotal = (): number => {
    const pricing = getCurrentPricing();
    const proCount = formData.proSelected ? parseInt(formData.proMachineCount) || 0 : 0;
    const pocketCount = formData.pocketSelected ? parseInt(formData.pocketMachineCount) || 0 : 0;
    
    const proDeviceFee = proCount * pricing.proDeviceFee;
    const pocketDeviceFee = pocketCount * pricing.pocketDeviceFee;
    const totalMachines = proCount + pocketCount;
    const connectivityFee = totalMachines * pricing.connectivityFee;
    
    return proDeviceFee + pocketDeviceFee + connectivityFee;
  };

  const calculateDeviceFees = (): number => {
    const pricing = getCurrentPricing();
    const proCount = formData.proSelected ? parseInt(formData.proMachineCount) || 0 : 0;
    const pocketCount = formData.pocketSelected ? parseInt(formData.pocketMachineCount) || 0 : 0;
    return (proCount * pricing.proDeviceFee) + (pocketCount * pricing.pocketDeviceFee);
  };

  const calculateConnectivityFees = (): number => {
    const pricing = getCurrentPricing();
    const proCount = formData.proSelected ? parseInt(formData.proMachineCount) || 0 : 0;
    const pocketCount = formData.pocketSelected ? parseInt(formData.pocketMachineCount) || 0 : 0;
    const totalMachines = proCount + pocketCount;
    return totalMachines * pricing.connectivityFee;
  };

  const handleSubmit = () => {
    console.log("ProductSetup handleSubmit called");
    console.log("Form Data:", formData);
    
    // Validate required fields
    if (!formData.tradingName.trim()) {
      alert("Please enter a company trading name");
      return;
    }

    if (formData.proSelected || formData.pocketSelected) {
      if (!formData.purchaseType) {
        alert("Please select buy or rent option");
        return;
      }
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("productSetupData", JSON.stringify(formData));
      console.log("Saved to localStorage:", formData);
    }

    // Call onNext if provided
    if (onNext) {
      console.log("Calling onNext callback");
      onNext();
    } else {
      console.warn("No onNext callback provided!");
    }
  };

  return (
    <div className="py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16 max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
            Product setup
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            SimplyBLU is an all-in-one payment solution for your business. It
            allows you to accept payments both in-store and online, manage
            inventory, track sales, and manage multiple sales channels, all from
            one central platform.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-9">
          {/* Left Column - Form */}
          <div className="space-y-8">
            {/* Estimated Annual Turnover */}
            <div className="space-y-2">
              <Label htmlFor="estimatedTurnover" className="text-sm text-gray-700">
                Estimated annual turnover on your card machine(s) and app
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                  R
                </span>
                <Input
                  type="number"
                  id="estimatedTurnover"
                  name="estimatedTurnover"
                  value={formData.estimatedTurnover}
                  onChange={handleInputChange}
                  className="pl-7"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Trading Name */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tradingName" className="text-sm text-gray-700">
                  Company trading name
                </Label>
                <span className="text-xs text-gray-500">
                  {formData.tradingName.length}/23
                </span>
              </div>
              <Input
                type="text"
                id="tradingName"
                name="tradingName"
                value={formData.tradingName}
                onChange={handleInputChange}
                maxLength={23}
                placeholder="Your preferred trading name"
              />
              <div className="flex items-start gap-2 mt-2">
                <Image src={recieptIcon} alt="bill" width={16} height={20} />
                <p className="text-xs text-gray-600 mt-1">
                  This trading name will appear on your customer's receipts and
                  bank statements
                </p>
              </div>
            </div>

            {/* Purchase Type - Only show if at least one machine is selected */}
            {(formData.proSelected || formData.pocketSelected) && (
              <div className="space-y-3">
                <Label className="text-sm text-gray-700">
                  Do you want to rent or buy your card machine(s)?
                </Label>
                <RadioGroup
                  value={formData.purchaseType}
                  onValueChange={(value) =>
                    handleRadioChange("purchaseType", value as "buy" | "rent")
                  }
                  className="flex gap-5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="purchase-buy" />
                    <Label
                      htmlFor="purchase-buy"
                      className="font-normal cursor-pointer"
                    >
                      Buy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="purchase-rent" />
                    <Label
                      htmlFor="purchase-rent"
                      className="font-normal cursor-pointer"
                    >
                      Rent
                    </Label>
                  </div>
                </RadioGroup>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Info className="text-primary-dark" size={30} />
                  <p className="text-xs text-primary-dark">
                    Rent a card machine and enjoy free maintenance, onsite
                    support, replacements, and upgrades at no extra cost!*
                    <br />
                    <Link href="/terms-and-conditions" className="underline">
                      T&Cs apply
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* SimplyBLU Pro Card Machine */}
            <div
              className={
                "border rounded-lg p-4 relative cursor-pointer transition-all bg-white"
              }
              onClick={toggleProSelection}
            >
              <div className="absolute -top-2 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-xl">
                Payment solutions
              </div>
              <div className="absolute top-4 right-4">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    formData.proSelected ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-white"
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
              </div>

              <div className="flex gap-4 my-4">
                <Image
                  src={cardMachine}
                  alt="SimplyBLU Pro"
                  width={80}
                  height={120}
                  className="w-20 h-30 object-contain"
                />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    SimplyBLU Pro Card Machine
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Smart. Seamless. Ready to scale.
                    <br />
                    Easily print, SMS or email receipts.
                  </p>
                  <div className="mt-3">
                    <p className="text-lg font-medium text-gray-900">
                      R {getCurrentPricing().proDeviceFee.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formData.purchaseType === "buy" ? "Purchase price" : "Monthly rental fee"}
                      <br />
                      (excl. VAT)
                    </p>
                  </div>
                </div>
              </div>

              {formData.proSelected && (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Label
                    htmlFor="proMachineCount"
                    className="text-sm text-gray-700"
                  >
                    Number of card machines
                  </Label>
                  <CustomSelect
                    options={numberOptions}
                    value={(() => {
                      const found = numberOptions.find(
                        (opt) => opt.value === formData.proMachineCount
                      );
                      return found ? found : null;
                    })()}
                    onChange={handleProMachineChange}
                    placeholder="Select quantity"
                  />
                </div>
              )}
            </div>

            {/* SimplyBLU Pocket Card Machine */}
            <div
              className={
                "border rounded-lg p-4 relative cursor-pointer transition-all bg-white"
              }
              onClick={togglePocketSelection}
            >
              <div className="absolute -top-2 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-xl">
                Payment solutions
              </div>
              <div className="absolute top-4 right-4">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    formData.pocketSelected ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-white"
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
              </div>

              <div className="flex gap-4 my-4">
                <Image
                  src={pocketCardMachine}
                  alt="SimplyBLU Pocket"
                  width={80}
                  height={120}
                  className="w-20 h-30 object-contain"
                />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    SimplyBLU Pocket Card Machine
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Mobile. Portable. Trade anywhere.
                    <br />
                    Conveniently SMS and email receipts.
                  </p>
                  <div className="mt-3">
                    <p className="text-lg font-medium text-gray-900">
                      R {getCurrentPricing().pocketDeviceFee.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formData.purchaseType === "buy" ? "Purchase price" : "Monthly rental fee"}
                      <br />
                      (excl. VAT)
                    </p>
                  </div>
                </div>
              </div>

              {formData.pocketSelected && (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Label
                    htmlFor="pocketMachineCount"
                    className="text-sm text-gray-700"
                  >
                    Number of card machines
                  </Label>
                  <CustomSelect
                    options={numberOptions}
                    value={(() => {
                      const found = numberOptions.find(
                        (opt) => opt.value === formData.pocketMachineCount
                      );
                      return found ? found : null;
                    })()}
                    onChange={handlePocketMachineChange}
                    placeholder="Select quantity"
                  />
                </div>
              )}
            </div>

            {/* Merchant App */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
              <div className="absolute -top-2 left-0 bg-gradient-to-tr from-primary to-primary-light min-w-32 text-white text-xs px-3 py-1 rounded-br-xl">
                Added bonus
              </div>

              <div className="flex gap-4 mt-4">
                <Image
                  src={mobileAppDevice}
                  alt="Merchant App"
                  width={52}
                  height={104}
                  className="w-14 h-26 object-contain"
                />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Merchant App
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Beyond just e-commerce, SimplyBLU is a fully integrated
                    solution that allows you to manage your business all in one
                    place, using your desktop or smart device. At no cost to
                    you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Info */}
          <div className="space-y-6">
            {/* Total Monthly Fee */}
            <div className="bg-blue-900 text-white rounded-lg p-6 text-center">
              <h2 className="text-lg font-medium mb-2">
                {formData.purchaseType === "buy" ? "Total cost" : "Total monthly fee"} for the
                <br />
                card machine(s):
              </h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl">R</span>
                <span className="text-5xl font-bold">
                  {calculateTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-sm mt-2">(excl. VAT)</p>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <div className="pb-4 border-b border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Debit card transactions cost 2.50%, credit card transactions
                  2.50%, and international transactions 2.50% (excluding VAT)
                </p>
              </div>

              <div>
                <h3 className="text-lg text-gray-500 mb-3">
                  {formData.purchaseType === "buy" ? "SimplyBLU Pro purchase price" : "SimplyBLU Pro monthly rental"}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl">R</span>
                  <span className="text-4xl font-medium text-gray-800">
                    {getCurrentPricing().proDeviceFee.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">(excl. VAT)</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg text-gray-500 mb-3">
                  {formData.purchaseType === "buy" ? "SimplyBLU Pocket purchase price" : "SimplyBLU Pocket monthly rental"}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl">R</span>
                  <span className="text-4xl font-medium text-gray-800">
                    {getCurrentPricing().pocketDeviceFee.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">(excl. VAT)</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg text-gray-500 mb-3">
                  Connectivity fee per card machine
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl">R</span>
                  <span className="text-4xl font-medium text-gray-800">
                    {getCurrentPricing().connectivityFee.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">(excl. VAT)</span>
                </div>
              </div>
              <hr />
              <p className="text-sm text-gray-600 text-center pt-4">
                This excludes your SimplyBLU commission fee.<br />
                The total will be charged on your business account.
              </p>
            </div>

            {/* Card Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <ul className="text-xs text-blue-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    Domestic refers to MasterCard and Visa cards issued in South
                    Africa
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    International refers to MasterCard and Visa cards issued
                    outside South Africa
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    The Diners Club® Credit Card rate will align with our credit
                    card rates
                  </span>
                </li>
              </ul>

              <div className="pt-4">
                <p className="text-sm font-medium text-gray-900 mb-4">
                  Your card machine can accept the following card types:
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200">
                    <Image
                      src={visaCard}
                      alt="Visa"
                      width={80}
                      height={60}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200">
                    <Image
                      src={masterCard}
                      alt="Mastercard"
                      width={80}
                      height={60}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200">
                    <Image
                      src={unionPay}
                      alt="UnionPay"
                      width={80}
                      height={60}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200">
                    <Image
                      src={dinersClub}
                      alt="Diners Club"
                      width={80}
                      height={60}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                  The card types below can also be accepted on your card
                  machine. Please contact the vendors directly using their
                  contact information provided at the end of your application.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200">
                    <Image
                      src={aeRcs}
                      alt="American Express & RCS"
                      width={240}
                      height={80}
                      className="w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

        {/* Footer Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 pt-6 border-t border-gray-200">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 w-full sm:w-auto"
              onClick={onBack}
            >
              BACK
            </Button>
          )}
          {onNext && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 w-full sm:w-auto ml-auto"
              onClick={handleSubmit}
            >
              NEXT
            </Button>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSetup;
