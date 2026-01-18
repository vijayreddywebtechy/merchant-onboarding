import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import CustomSelect from "@/components/dynamic/CustomSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
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
import { Info, CheckCircle2 } from "lucide-react";
import { StepFooter } from "@/components/dynamic/StepFooter";

interface CardMachineSelectionData {
  // Common
  tradingName: string;
  businessEmail: string;
  
  // Merchant App
  merchantAppEnabled: boolean;

  // Takealot Flow (Multiple Selection)
  takealotPocketSelected: boolean;
  takealotLiteSelected: boolean;
  // Deprecated single selection field (kept for safety if needed, but unused in new logic)
  selectedMachine: "pocket" | "lite" | "";

  // Rent/Buy Flow
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
];

// Pricing configurations
const rentBuyPricing = {
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

const takealotPricing = {
  pocketDeviceFee: 40,
  liteDeviceFee: 40,
  connectivityFee: 40,
};

const ProductSetup = ({ onNext, onBack }: ProductSetupProps) => {
  const [isMerchantApp, setIsMerchantApp] = useState(false);
  const [isRent, setIsRent] = useState(true); // Default to Rent flow
  const [isTakelot, setIsTakelot] = useState(false);

  // Load saved data from localStorage
  const [formData, setFormData] = useState<CardMachineSelectionData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem("productSetupData");
      if (savedData) {
        return {
           // Default fallback values if fields are missing in saved data
           tradingName: "",
           businessEmail: "",
           selectedMachine: "",
           merchantAppEnabled: true,
           takealotPocketSelected: false,
           takealotLiteSelected: false,
           purchaseType: "rent",
           proMachineCount: "1",
           pocketMachineCount: "1",
           proSelected: false,
           pocketSelected: false,
           estimatedTurnover: "",
           ...JSON.parse(savedData)
        };
      }
    }
    return {
      tradingName: "",
      businessEmail: "",
      selectedMachine: "",
      merchantAppEnabled: true,
      takealotPocketSelected: false,
      takealotLiteSelected: false,
      purchaseType: "rent",
      proMachineCount: "1",
      pocketMachineCount: "1",
      proSelected: false,
      pocketSelected: false,
      estimatedTurnover: "",
    };
  });

  // Check for flow selection in merchantOnboardingData
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem("merchantOnboardingData");
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.selectedOption === "merchant-app") {
            setIsMerchantApp(true);
            setIsRent(false);
          } else if (parsed.selectedOption === "takealot") { // updated to match user code
            setIsTakelot(true);
            setIsRent(false);
          } else if (parsed.selectedOption === "rent") {
            setIsRent(true);
          }
        } catch (e) {
          console.error("Error parsing merchantOnboardingData", e);
        }
      }
    }
  }, []);

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

  // --- Handlers for Rent/Buy Flow ---
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

  const getCurrentRentBuyPricing = () => {
    return formData.purchaseType ? rentBuyPricing[formData.purchaseType] : rentBuyPricing.rent;
  };

  // --- Handlers for Takealot/Merchant App Flow ---
  // Updated to support multiple selection via toggles
  const toggleTakealotMachine = (machine: "pocket" | "lite"): void => {
    if (machine === "pocket") {
        setFormData(prev => ({ 
            ...prev, 
            takealotPocketSelected: !prev.takealotPocketSelected 
        }));
    } else {
        setFormData(prev => ({ 
            ...prev, 
            takealotLiteSelected: !prev.takealotLiteSelected 
        }));
    }
  };

  // --- Calculators ---
  const calculateTotal = (): number => {
    if (isMerchantApp) return 0;

    if (isTakelot) {
      let total = 0;
      if (formData.takealotPocketSelected) total += takealotPricing.pocketDeviceFee;
      if (formData.takealotLiteSelected) total += takealotPricing.liteDeviceFee;
      
      const machineCount = (formData.takealotPocketSelected ? 1 : 0) + (formData.takealotLiteSelected ? 1 : 0);
      return total + (machineCount * takealotPricing.connectivityFee);
    }

    // Default: Rent/Buy
    const pricing = getCurrentRentBuyPricing();
    const proCount = formData.proSelected ? parseInt(formData.proMachineCount) || 0 : 0;
    const pocketCount = formData.pocketSelected ? parseInt(formData.pocketMachineCount) || 0 : 0;
    
    const proDeviceFee = proCount * pricing.proDeviceFee;
    const pocketDeviceFee = pocketCount * pricing.pocketDeviceFee;
    const totalMachines = proCount + pocketCount;
    const connectivityFee = totalMachines * pricing.connectivityFee;
    
    return proDeviceFee + pocketDeviceFee + connectivityFee;
  };

  const calculateConnectivityFee = (): number => {
    if (isTakelot) {
       const machineCount = (formData.takealotPocketSelected ? 1 : 0) + (formData.takealotLiteSelected ? 1 : 0);
       return machineCount * takealotPricing.connectivityFee;
    }
    // For Rent/Buy logic
    const pricing = getCurrentRentBuyPricing();
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
    
    // Validate Business Email dependent on flow
    if ((isMerchantApp || isTakelot) && !formData.businessEmail.trim()) {
      alert("Please enter a business email address");
      return;
    }

    // Flow specific validation
    if (isMerchantApp) {
       // Only trading name and email required
    } else if (isTakelot) {
       if (!formData.takealotPocketSelected && !formData.takealotLiteSelected) {
         alert("Please select at least one card machine");
         return;
       }
    } else {
       // Rent/Buy Validation
       if (formData.proSelected || formData.pocketSelected) {
         if (!formData.purchaseType) {
           alert("Please select buy or rent option");
           return;
         }
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


  // --- LAYOUTS ---

  // 1. Merchant App Layout
  if (isMerchantApp) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="py-6 md:py-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-2">Product setup</h2>
            <p className="text-gray-500">Complete the information below</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-gray-700">App activation</h3>
              <div className="space-y-2">
                <Label htmlFor="tradingName" className="text-xs text-gray-600 font-medium">Company trading name</Label>
                <Input
                  type="text"
                  id="tradingName"
                  name="tradingName"
                  value={formData.tradingName}
                  onChange={handleInputChange}
                  maxLength={23}
                  className="bg-white border-gray-300"
                />
                <div className="flex items-start gap-2 mt-1">
                  <div className="min-w-[16px] pt-0.5">
                     <Image src={recieptIcon} alt="bill" width={14} height={18} />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">This trading name will appear on your customer's receipts and bank statements</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="businessEmail" className="text-xs text-gray-600 font-medium">Business email address</Label>
                  <Info className="text-blue-600" size={14} />
                </div>
                <Input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <p className="text-xs text-gray-600 mb-4 font-medium">Your merchant app can accept the following card types:</p>
                <div className="flex gap-4">
                  <div className="bg-white px-4 py-2 rounded shadow-sm border border-gray-100 flex items-center justify-center">
                    <Image src={visaCard} alt="Visa" width={60} height={40} className="h-6 w-auto object-contain" />
                  </div>
                  <div className="bg-white px-4 py-2 rounded shadow-sm border border-gray-100 flex items-center justify-center">
                    <Image src={masterCard} alt="Mastercard" width={60} height={40} className="h-6 w-auto object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-[#0033A1] py-12 px-8 flex justify-center items-center relative min-h-[300px]">
                   <Image src={mobileAppDevice} alt="Merchant App Devices" width={300} height={400} className="w-full max-w-[280px] object-contain relative z-10 drop-shadow-2xl translate-y-4" />
               </div>
               <div className="p-6 md:p-8">
                 <p className="text-xs text-gray-500 leading-relaxed text-center">Beyond just e-commerce, SimplyBLU is a fully integrated solution that allows you to manage your business all in one place, using your desktop or smart device.</p>
               </div>
            </div>
          </div>

          <StepFooter onBack={onBack} />
          
          <div className="flex justify-end">
            <Button variant="ghost" className="bg-green-700 hover:bg-green-800 text-white rounded-full px-8 py-2 h-auto text-sm font-medium">Save for later</Button>
          </div>
        </div>
      </form>
    );
  }

  // 2. Takealot Layout
  if (isTakelot) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="py-6 md:py-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-16 max-w-xl mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">Product setup</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
              SimplyBLU is an all-in-one payment solution for your business. It allows you to accept payments both in-store and online, manage inventory, track sales, and manage multiple sales channels, all from one central platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-9">
            {/* Left Column - Form */}
            <div className="space-y-8">
              {/* Trading Name */}
              <div className="space-y-2">
                <Label htmlFor="tradingName" className="text-sm text-gray-700 uppercase tracking-wider">Company trading name</Label>
                <Input
                  type="text"
                  id="tradingName"
                  name="tradingName"
                  value={formData.tradingName}
                  onChange={handleInputChange}
                  maxLength={23}
                  placeholder="Enter company trading name"
                />
                <div className="flex items-start gap-2 mt-2">
                  <Image src={recieptIcon} alt="bill" width={16} height={20} />
                  <p className="text-xs text-gray-600 mt-1">This trading name will appear on your customer's receipts and bank statements</p>
                </div>
              </div>

              {/* Business Email */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="businessEmail" className="text-sm text-gray-700 uppercase tracking-wider">Business email address</Label>
                  <Info className="text-blue-600" size={16} />
                </div>
                <Input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com"
                />
              </div>

              {/* Card Machine Selection Info */}
              <div className="space-y-4">
                <p className="text-sm text-gray-700">Please select the card machine(s) you have bought from Takealot below:</p>

                {/* SimplyBLU Pocket Card Machine */}
                <div
                  className={`border rounded-lg p-4 relative cursor-pointer transition-all ${
                    formData.takealotPocketSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                  onClick={() => toggleTakealotMachine("pocket")}
                >
                  <div className="absolute -top-2 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-xl">Payment solutions</div>
                  <div className="absolute top-4 right-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.takealotPocketSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                      {formData.takealotPocketSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div className="flex gap-4 my-4">
                    <Image src={pocketCardMachine} alt="SimplyBLU Pocket" width={80} height={120} className="w-20 h-30 object-contain" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">SimplyBLU Pocket Card Machine</h3>
                      <p className="text-sm text-gray-600 mb-2">Mobile. Portable. Trade anywhere.<br />Conveniently SMS and email receipts.</p>
                      <div className="mt-3">
                        <p className="text-lg font-medium text-gray-900">R {takealotPricing.pocketDeviceFee.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">Monthly connectivity fee<br />(excl. VAT)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SimplyBLU Lite Card Machine */}
                <div
                  className={`border rounded-lg p-4 relative cursor-pointer transition-all ${
                    formData.takealotLiteSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                  onClick={() => toggleTakealotMachine("lite")}
                >
                  <div className="absolute -top-2 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-xl">Payment solutions</div>
                  <div className="absolute top-4 right-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.takealotLiteSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                      {formData.takealotLiteSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div className="flex gap-4 my-4">
                    <Image src={cardMachine} alt="SimplyBLU Lite" width={80} height={120} className="w-20 h-30 object-contain" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">SimplyBLU Lite Card Machine</h3>
                      <p className="text-sm text-gray-600 mb-2">Smart. Reliable. Built for everyday business.<br />Easily print, SMS or email receipts.</p>
                      <div className="mt-3">
                        <p className="text-lg font-medium text-gray-900">R {takealotPricing.liteDeviceFee.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">Monthly connectivity fee<br />(excl. VAT)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Merchant App */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
                  <div className="flex gap-4 mt-2">
                    <Image src={mobileAppDevice} alt="Merchant App" width={52} height={104} className="w-14 h-26 object-contain" />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Merchant App</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Beyond just e-commerce, SimplyBLU is a fully integrated solution that allows you to manage your business all in one place, using your desktop or smart device. At no cost to you.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing & Info */}
            <div className="space-y-6">
              <div className="bg-blue-900 text-white rounded-lg p-6 text-center">
                <h2 className="text-lg font-medium mb-2">Total payment:</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xl">R</span>
                  <span className="text-5xl font-bold">{calculateTotal().toFixed(2)}</span>
                </div>
                <p className="text-sm mt-2">(excl. VAT)</p>
                <div className="border-t border-white/30 mt-4 pt-4">
                  <p className="text-sm mb-2">Total monthly connectivity fee</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg">R</span>
                    <span className="text-4xl font-bold">{calculateConnectivityFee().toFixed(2)}</span>
                    <span className="text-sm">(excl. VAT per month)</span>
                  </div>
                </div>
                <p className="text-xs mt-4 opacity-80">This total will be charged to your business account.</p>
              </div>

               {/* Please Note Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Info className="text-blue-600 mt-0.5" size={18} />
                <span className="text-sm font-medium text-blue-800">Please note:</span>
              </div>
              <ul className="text-xs text-blue-700 space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>The total connectivity fee is dependant on the number of card machines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>The card machine activation code(s) will be sent the provided business email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Domestic refers to MasterCard and Visa cards issued in South Africa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>International refers to MasterCard and Visa cards issued outside South Africa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>The Diners Club® Credit Card rate will align with our credit card rates</span>
                </li>
              </ul>
            </div>

            {/* Card Types Accepted */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-sm font-medium text-gray-900">Your card machine can accept the following card types:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={visaCard} alt="Visa" width={80} height={60} className="h-8 w-auto object-contain" /></div>
                <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={masterCard} alt="Mastercard" width={80} height={60} className="h-8 w-auto object-contain" /></div>
                <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={unionPay} alt="UnionPay" width={80} height={60} className="h-8 w-auto object-contain" /></div>
                <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={dinersClub} alt="Diners Club" width={80} height={60} className="h-8 w-auto object-contain" /></div>
              </div>
              <p className="text-xs text-gray-600 mt-4 leading-relaxed">The card types below can also be accepted on your card machine. Please contact the vendors directly using their contact information provided at the end of your application.</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={aeRcs} alt="American Express & RCS" width={240} height={80} className="w-auto object-contain" /></div>
              </div>
            </div>

            <StepFooter onBack={onBack} />
          </div>
        </div>
      </div>
      </form>
    );
  }

  // 3. Default: Rent Layout
  // This is the restored Rent flow layout
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-16 max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">Product setup</h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            SimplyBLU is an all-in-one payment solution for your business. It allows you to accept payments both in-store and online, manage inventory, track sales, and manage multiple sales channels, all from one central platform.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-9">
          {/* Left Column - Form */}
          <div className="space-y-8">
            {/* Estimated Annual Turnover */}
            <div className="space-y-2">
              <Label htmlFor="estimatedTurnover" className="text-sm text-gray-700">Estimated annual turnover on your card machine(s) and app</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R</span>
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
                <Label htmlFor="tradingName" className="text-sm text-gray-700">Company trading name</Label>
                <span className="text-xs text-gray-500">{formData.tradingName.length}/23</span>
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
                <p className="text-xs text-gray-600 mt-1">This trading name will appear on your customer's receipts and bank statements</p>
              </div>
            </div>

            {/* Purchase Type */}
            {(formData.proSelected || formData.pocketSelected) && (
              <div className="space-y-3">
                <Label className="text-sm text-gray-700">Do you want to rent or buy your card machine(s)?</Label>
                <RadioGroup value={formData.purchaseType} onValueChange={(value) => handleRadioChange("purchaseType", value)} className="flex gap-5">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="purchase-buy" />
                    <Label htmlFor="purchase-buy" className="font-normal cursor-pointer">Buy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="purchase-rent" />
                    <Label htmlFor="purchase-rent" className="font-normal cursor-pointer">Rent</Label>
                  </div>
                </RadioGroup>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Info className="text-primary-dark" size={30} />
                  <p className="text-xs text-primary-dark">Rent a card machine and enjoy free maintenance, onsite support, replacements, and upgrades at no extra cost!*<br /><Link href="/terms-and-conditions" className="underline">T&Cs apply</Link></p>
                </div>
              </div>
            )}

            {/* SimplyBLU Pro Card Machine */}
            <div className={`border rounded-lg p-4 relative cursor-pointer transition-all bg-white`} onClick={toggleProSelection}>
              <div className="absolute -top-2 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-xl">Payment solutions</div>
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.proSelected ? "bg-blue-600" : "bg-gray-300"}`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div className="flex gap-4 my-4">
                <Image src={cardMachine} alt="SimplyBLU Pro" width={80} height={120} className="w-20 h-30 object-contain" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">SimplyBLU Pro Card Machine</h3>
                  <p className="text-sm text-gray-600 mb-2">Smart. Seamless. Ready to scale.<br />Easily print, SMS or email receipts.</p>
                  <div className="mt-3">
                    <p className="text-lg font-medium text-gray-900">R {getCurrentRentBuyPricing().proDeviceFee.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{formData.purchaseType === "buy" ? "Purchase price" : "Monthly rental fee"}<br />(excl. VAT)</p>
                  </div>
                </div>
              </div>
              {formData.proSelected && (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Label htmlFor="proMachineCount" className="text-sm text-gray-700">Number of card machines</Label>
                  <CustomSelect
                    options={numberOptions}
                    value={numberOptions.find((opt) => opt.value === formData.proMachineCount) || null}
                    onChange={handleProMachineChange}
                    placeholder="Select quantity"
                  />
                </div>
              )}
            </div>

            {/* SimplyBLU Pocket Card Machine */}
            <div className={`border rounded-lg p-4 relative cursor-pointer transition-all bg-white`} onClick={togglePocketSelection}>
              <div className="absolute -top-2 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-xl">Payment solutions</div>
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formData.pocketSelected ? "bg-blue-600" : "bg-gray-300"}`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div className="flex gap-4 my-4">
                <Image src={pocketCardMachine} alt="SimplyBLU Pocket" width={80} height={120} className="w-20 h-30 object-contain" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">SimplyBLU Pocket Card Machine</h3>
                  <p className="text-sm text-gray-600 mb-2">Mobile. Portable. Trade anywhere.<br />Conveniently SMS and email receipts.</p>
                  <div className="mt-3">
                    <p className="text-lg font-medium text-gray-900">R {getCurrentRentBuyPricing().pocketDeviceFee.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{formData.purchaseType === "buy" ? "Purchase price" : "Monthly rental fee"}<br />(excl. VAT)</p>
                  </div>
                </div>
              </div>
              {formData.pocketSelected && (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <Label htmlFor="pocketMachineCount" className="text-sm text-gray-700">Number of card machines</Label>
                  <CustomSelect
                    options={numberOptions}
                    value={numberOptions.find((opt) => opt.value === formData.pocketMachineCount) || null}
                    onChange={handlePocketMachineChange}
                    placeholder="Select quantity"
                  />
                </div>
              )}
            </div>

            {/* Merchant App */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
              <div className="absolute -top-2 left-0 bg-gradient-to-tr from-primary to-primary-light min-w-32 text-white text-xs px-3 py-1 rounded-br-xl">Added bonus</div>
              <div className="flex gap-4 mt-4">
                <Image src={mobileAppDevice} alt="Merchant App" width={52} height={104} className="w-14 h-26 object-contain" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Merchant App</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Beyond just e-commerce, SimplyBLU is a fully integrated solution that allows you to manage your business all in one place, using your desktop or smart device. At no cost to you.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Info */}
          <div className="space-y-6">
            <div className="bg-blue-900 text-white rounded-lg p-6 text-center">
              <h2 className="text-lg font-medium mb-2">{formData.purchaseType === "buy" ? "Total cost" : "Total monthly fee"} for the<br />card machine(s):</h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl">R</span>
                <span className="text-5xl font-bold">{calculateTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm mt-2">(excl. VAT)</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <div className="pb-4 border-b border-gray-200 text-center">
                <p className="text-sm text-gray-600">Debit card transactions cost 2.50%, credit card transactions 2.50%, and international transactions 2.50% (excluding VAT)</p>
              </div>

              <div>
                <h3 className="text-lg text-gray-500 mb-3">{formData.purchaseType === "buy" ? "SimplyBLU Pro purchase price" : "SimplyBLU Pro monthly rental"}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl">R</span>
                  <span className="text-4xl font-medium text-gray-800">{getCurrentRentBuyPricing().proDeviceFee.toFixed(2)}</span>
                  <span className="text-sm text-gray-600">(excl. VAT)</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg text-gray-500 mb-3">{formData.purchaseType === "buy" ? "SimplyBLU Pocket purchase price" : "SimplyBLU Pocket monthly rental"}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl">R</span>
                  <span className="text-4xl font-medium text-gray-800">{getCurrentRentBuyPricing().pocketDeviceFee.toFixed(2)}</span>
                  <span className="text-sm text-gray-600">(excl. VAT)</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg text-gray-500 mb-3">Connectivity fee per card machine</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl">R</span>
                  <span className="text-4xl font-medium text-gray-800">{getCurrentRentBuyPricing().connectivityFee.toFixed(2)}</span>
                  <span className="text-sm text-gray-600">(excl. VAT)</span>
                </div>
              </div>
              <hr />
              <p className="text-sm text-gray-600 text-center pt-4">This excludes your SimplyBLU commission fee.<br />The total will be charged on your business account.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <ul className="text-xs text-blue-600 space-y-2">
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">•</span><span>Domestic refers to MasterCard and Visa cards issued in South Africa</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">•</span><span>International refers to MasterCard and Visa cards issued outside South Africa</span></li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">•</span><span>The Diners Club® Credit Card rate will align with our credit card rates</span></li>
              </ul>

              <div className="pt-4">
                <p className="text-sm font-medium text-gray-900 mb-4">Your card machine can accept the following card types:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={visaCard} alt="Visa" width={80} height={60} className="h-8 w-auto object-contain" /></div>
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={masterCard} alt="Mastercard" width={80} height={60} className="h-8 w-auto object-contain" /></div>
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={unionPay} alt="UnionPay" width={80} height={60} className="h-8 w-auto object-contain" /></div>
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={dinersClub} alt="Diners Club" width={80} height={60} className="h-8 w-auto object-contain" /></div>
                </div>
                <p className="text-xs text-gray-600 mt-4 leading-relaxed">The card types below can also be accepted on your card machine. Please contact the vendors directly using their contact information provided at the end of your application.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center justify-center p-3 rounded border border-gray-200"><Image src={aeRcs} alt="American Express & RCS" width={240} height={80} className="w-auto object-contain" /></div>
                </div>
              </div>
            </div>

            <StepFooter onBack={onBack} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductSetup;
