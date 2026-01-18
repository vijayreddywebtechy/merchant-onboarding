"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import merchantApp from "@/assets/images/general/mobile_app_device.png";
import cardMachineMd from "@/assets/images/general/card_machine_md.png";
import pocketCardMachine from "@/assets/images/general/pocket_card_machine.png";
import { Info, X, FileText, Download } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cardMachineSummarySchema } from "@/lib/validationSchemas";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useDocumentMutation } from "@/hooks/useDocumentMutation";

type CardMachineSummaryData = {
  cardMachineQuantity: string;
  monthlyTransactionVolume: string;
  acceptanceFee: string;
  agreementAccepted: boolean;
};

interface ProductSetupData {
  tradingName: string;
  businessEmail: string;
  
  // Merchant App
  merchantAppEnabled: boolean;

  // Takealot Flow
  takealotPocketSelected?: boolean;
  takealotLiteSelected?: boolean;
  selectedMachine?: "pocket" | "lite" | ""; 

  // Rent/Buy Flow
  purchaseType?: "buy" | "rent";
  proMachineCount?: string;
  pocketMachineCount?: string;
  proSelected?: boolean;
  pocketSelected?: boolean;
  estimatedTurnover?: string;
}

interface Props {
  onNext?: () => void;
  onBack?: () => void;
}

// Pricing configurations matching ProductSetup
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

// Industry classification mapping (ISIC4 codes)
const industryClassificationMap: { [key: string]: string } = {
  "agriculture": "74120",
  "forestry": "02100",
  "fishing": "03110",
  "mining-coal": "05100",
  "mining-metal": "07100",
  "mining-other": "08990",
  "food-manufacturing": "10100",
  "beverage-manufacturing": "11010",
  "textile-manufacturing": "13110",
  "clothing-manufacturing": "14100",
  "leather-manufacturing": "15110",
  "wood-manufacturing": "16100",
  "paper-manufacturing": "17010",
  "printing": "18110",
  "chemical-manufacturing": "20110",
  "pharmaceutical-manufacturing": "21000",
  "rubber-plastic-manufacturing": "22190",
  "metal-manufacturing": "24100",
  "electronics-manufacturing": "26100",
  "electrical-equipment": "27100",
  "machinery-manufacturing": "28130",
  "motor-vehicle-manufacturing": "29100",
  "furniture-manufacturing": "31000",
  "electricity-supply": "35100",
  "water-supply": "36000",
  "construction-buildings": "41000",
  "civil-engineering": "42100",
  "construction-specialized": "43900",
  "motor-vehicle-sales": "45100",
  "wholesale-trade": "46900",
  "retail-trade": "47110",
  "land-transport": "49210",
  "water-transport": "50110",
  "air-transport": "51100",
  "warehousing": "52100",
  "accommodation": "55100",
  "food-service": "56100",
  "publishing": "58110",
  "broadcasting": "60100",
  "telecommunications": "61100",
  "it-services": "62010",
  "information-services": "63110",
  "financial-services": "64190",
  "insurance": "65120",
  "financial-auxiliary": "66190",
  "real-estate": "68100",
  "legal-accounting": "69100",
  "consulting": "70200",
  "architecture-engineering": "71100",
  "research-development": "72100",
  "advertising": "73100",
  "veterinary": "75000",
  "rental-leasing": "77100",
  "employment-services": "78100",
  "travel-services": "79110",
  "security-services": "80100",
  "facilities-services": "81100",
  "office-support": "82190",
  "education": "85100",
  "healthcare": "86100",
  "social-work": "87100",
  "arts-entertainment": "90000",
  "gambling": "92000",
  "sports-recreation": "93110",
  "membership-organizations": "94110",
  "repair-services": "95110",
  "personal-services": "96020",
  "other": "99000",
};

export default function CardMachineSummary({ onNext, onBack }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [productData, setProductData] = useState<ProductSetupData | null>(null);
  const [flowType, setFlowType] = useState<"merchant-app" | "takealot" | "rent">("rent");

  const { mutate: createContract } = useCustomMutation({
    url: `/api/create-contract`,
    method: "POST",
  });

  const { mutate: retrieveDocument } = useDocumentMutation({
    url: `/api/retrieve-document`,
  });

  const { mutate: setDigitalOffer } = useCustomMutation({
    url: `/api/set-digital-offer`,
    method: "PUT",
  });

  const {
    control,
    formState: { errors, isValidating },
    handleSubmit,
    watch,
    reset,
    setValue,
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

  // Load product setup data from localStorage and determine flow type
  useEffect(() => {
    const savedProductData = localStorage.getItem("productSetupData");
    const savedMerchantData = localStorage.getItem("merchantOnboardingData");
    
    if (savedProductData) {
      setProductData(JSON.parse(savedProductData));
    }
    
    if (savedMerchantData) {
      try {
        const parsed = JSON.parse(savedMerchantData);
        if (parsed.selectedOption === "merchant-app") {
          setFlowType("merchant-app");
        } else if (parsed.selectedOption === "takealot") {
          setFlowType("takealot");
        } else {
          setFlowType("rent");
        }
      } catch (e) {
        setFlowType("rent");
      }
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("cardMachineSummaryFormData");
    if (data) {
      reset(JSON.parse(data));
    }
  }, [reset]);

  const calculateTotal = () => {
    if (!productData) return 0;
    
    if (flowType === "merchant-app") return 0;

    if (flowType === "takealot") {
      let total = 0;
      if (productData.takealotPocketSelected) total += takealotPricing.pocketDeviceFee;
      if (productData.takealotLiteSelected) total += takealotPricing.liteDeviceFee;
       // Backward compatibility if using old selectedMachine
      if (productData.selectedMachine && !productData.takealotPocketSelected && !productData.takealotLiteSelected) {
          if (productData.selectedMachine === "pocket") total += takealotPricing.pocketDeviceFee;
          if (productData.selectedMachine === "lite") total += takealotPricing.liteDeviceFee;
      }
      
      const machineCount = (productData.takealotPocketSelected ? 1 : 0) + (productData.takealotLiteSelected ? 1 : 0) || (productData.selectedMachine ? 1 : 0);
      return total + (machineCount * takealotPricing.connectivityFee);
    }

    // Rent/Buy Flow
    const pricing = productData.purchaseType && rentBuyPricing[productData.purchaseType] 
                    ? rentBuyPricing[productData.purchaseType] 
                    : rentBuyPricing.rent;

    const proCount = productData.proSelected ? parseInt(productData.proMachineCount || "0") : 0;
    const pocketCount = productData.pocketSelected ? parseInt(productData.pocketMachineCount || "0") : 0;
    
    const proDeviceFee = proCount * pricing.proDeviceFee;
    const pocketDeviceFee = pocketCount * pricing.pocketDeviceFee;
    const totalMachines = proCount + pocketCount;
    const connectivityFee = totalMachines * pricing.connectivityFee;
    
    return proDeviceFee + pocketDeviceFee + connectivityFee;
  };
  
  const selectedMachinesList = () => {
      const items = [];
      if (flowType === "takealot") {
          if (productData?.takealotPocketSelected) items.push({ type: "pocket", name: "SimplyBLU Pocket", count: 1 });
          if (productData?.takealotLiteSelected) items.push({ type: "lite", name: "SimplyBLU Lite", count: 1 });
          // Fallback
          if (items.length === 0 && productData?.selectedMachine) {
               items.push({ 
                   type: productData.selectedMachine, 
                   name: productData.selectedMachine === "pocket" ? "SimplyBLU Pocket" : "SimplyBLU Lite", 
                   count: 1 
               });
          }
      } else if (flowType === "rent") {
          if (productData?.proSelected) items.push({ type: "pro", name: "SimplyBLU Pro", count: parseInt(productData.proMachineCount || "0") });
          if (productData?.pocketSelected) items.push({ type: "pocket", name: "SimplyBLU Pocket", count: parseInt(productData.pocketMachineCount || "0") });
      }
      return items;
  };

  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("cardMachineSummaryFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Function to load the contract document (retrieves existing document)
  const loadContractDocument = async () => {
    setIsLoadingDocument(true);
    
    try {
      // Get preapplication data for document retrieval
      const preApplicationResponse = JSON.parse(
        localStorage.getItem("merchantOnboardingData") || "{}"
      );
      const businessBPGUID = preApplicationResponse.preApplicationResponse.businessBPGUID;
      const contractDocumentId = preApplicationResponse.contractDocumentId;

      if (!businessBPGUID) {
        alert("Business GUID not found. Please complete the application process.");
        setIsLoadingDocument(false);
        return;
      }

      if (!contractDocumentId) {
        alert("Contract document not found. Please refresh and try again.");
        setIsLoadingDocument(false);
        return;
      }

      console.log("Retrieving document with contentId:", contractDocumentId);

      // Prepare document retrieval payload
      const documentPayload = {
        guId: businessBPGUID,
        filename: "",
        documentId: "0",
        contentId: contractDocumentId,
        businessFlag: "P"
      };

      // Retrieve the document
      retrieveDocument(
        {
          body: documentPayload,
        },
        {
          onSuccess: (blob) => {
            console.log("Document retrieved successfully");
            
            // Create a blob URL for the PDF
            const url = URL.createObjectURL(blob);
            
            // Open PDF in new tab
            window.open(url, '_blank');
            
            // Also store the URL for download button
            setDocumentUrl(url);
            setIsLoadingDocument(false);

            // Clean up the URL after a delay
            setTimeout(() => {
              if (url) {
                URL.revokeObjectURL(url);
              }
            }, 1000);
          },
          onError: (error) => {
            console.error("Error retrieving document:", error);
            setIsLoadingDocument(false);
            alert("Error loading document. Please try again.");
          },
        }
      );
    } catch (error) {
      console.error("Error in loadContractDocument:", error);
      setIsLoadingDocument(false);
    }
  };

  // Load document when dialog opens
  useEffect(() => {
    if (open && !documentUrl && !isLoadingDocument) {
      loadContractDocument();
    }
  }, [open]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
      }
    };
  }, [documentUrl]);

  const handleSignContract = async () => {
    setIsSigning(true);
    
    try {
      // Set a flag to indicate that contract signing is pending OTP verification
      localStorage.setItem("contractPendingSign", "true");
      
      console.log("Redirecting to OTP verification for contract signing...");
      
      setIsSigning(false);
      setOpen(false);
      
      // Redirect to OTP verification page for contract signing
      router.push("/account-onboarding/contract-signing-otp");
    } catch (error: any) {
      console.error("Error initiating contract signing:", error);
      setIsSigning(false);
      alert(error.message || "Error initiating contract signing. Please try again.");
    }
  };

  // Function to handle confirm button - submits digital offer and creates contract
  const handleConfirm = async () => {
    setIsSubmittingOffer(true);

    try {
      // Get all required data from localStorage
      const preApplicationResponse = JSON.parse(
        localStorage.getItem("merchantOnboardingData") || "{}"
      );
      const productSetupData = localStorage.getItem("productSetupData");
      const companyDetailsData = localStorage.getItem("companyDetailsFormData");
      const deliveryDetailsData = localStorage.getItem("deliveryDetailsFormData");
      const bankingDetailsData = localStorage.getItem("companyBankingDetailsFormData");
      const personalDetailsData = localStorage.getItem("personalDetailsFormData");
      
      const offerId = preApplicationResponse.preApplicationResponse.digitalOfferId;

      if (!offerId) {
        console.error("No offer ID found");
        alert("Error: Offer ID not found. Please complete the pre-application process first.");
        setIsSubmittingOffer(false);
        return;
      }

      if (!productSetupData) {
        alert("Product setup data not found");
        setIsSubmittingOffer(false);
        return;
      }

      const productData = JSON.parse(productSetupData);
      const companyData = companyDetailsData ? JSON.parse(companyDetailsData) : {};
      const deliveryData = deliveryDetailsData ? JSON.parse(deliveryDetailsData) : {};
      const bankingData = bankingDetailsData ? JSON.parse(bankingDetailsData) : {};
      const personalData = personalDetailsData ? JSON.parse(personalDetailsData) : {};

      console.log("=== DATA FROM LOCALSTORAGE ===");
      console.log("productData:", productData);
      console.log("flowType:", flowType);
      
      // Build pricing conditions - empty array for now
      const pricCond: any[] = [];
      setOpen(true);

      // Build items array based on selection
      const items = [];
      const machines = [];
      
      if (flowType === "takealot") {
          if (productData.takealotPocketSelected) machines.push({ model: "SimplyBLU Pocket", qty: 1 });
          if (productData.takealotLiteSelected) machines.push({ model: "SimplyBLU Lite", qty: 1 });
          // Fallback
          if (machines.length === 0 && productData.selectedMachine) {
              machines.push({ 
                  model: productData.selectedMachine === "pocket" ? "SimplyBLU Pocket" : "SimplyBLU Lite", 
                  qty: 1 
              });
          }
      } else if (flowType === "rent") {
          if (productData.proSelected) machines.push({ model: "SimplyBLU Pro", qty: parseInt(productData.proMachineCount || "0") });
          if (productData.pocketSelected) machines.push({ model: "SimplyBLU Pocket", qty: parseInt(productData.pocketMachineCount || "0") });
      }

      const deviceReqdDate = deliveryData.deliveryDate 
        ? String(deliveryData.deliveryDate).split('T')[0] 
        : new Date().toISOString().split('T')[0];
      const merchantIndustryCode = industryClassificationMap[companyData.industryClassification] || companyData.industryClassification || "74120";

      // Common prod details
      const commonProdDetails = {
            tradingName: productData.tradingName || "",
            serviceDescription: "A compact POS device",
            rentOrBuy: productData.purchaseType ? (productData.purchaseType === "buy" ? "B" : "R") : "R",
            registrationEmailAddr: personalData.email || companyData.email || "",
            merchantIndustry: merchantIndustryCode, 
            instalCountydistrict: deliveryData.suburb || companyData.suburb || "To be confirmed",
            instalCountrycode: "ZA",
            deviceReqdDate: deviceReqdDate,
            contactTelephoneNbr: deliveryData.contactPersonNumber || personalData.phoneNumber || "",
            contactName: `${deliveryData.contactPersonName || ""} ${deliveryData.contactPersonSurname || ""}`.trim() || `${personalData.fname || ""} ${personalData.lname || ""}`.trim() || "",
            cashback: "N",
            businessMobileNbr: personalData.phoneNumber || "",
            businessEmailAddr: personalData.email || companyData.email || "",
            billingCycle: "D",
            bankingPorIbt: bankingData.branchCode || "",
            bankingBankName: bankingData.branchCode ? `000${String(bankingData.branchCode).trim()}` : "",
            bankingBank: "confirm mapping",
            bankingAccNo: (bankingData.accountNumber || "").trim(),
            bankingAccHolderName: bankingData.accountHolderName || "",
            allowRefunds: "N",
            accountNbr: "",
            acceptRCSNum: "true",
            acceptDinersNum: "true",
            acceptAmExpressNum: "true"
      };

      // Create an item for each machine type (if the API supports multiple items)
      // Alternatively, if API expects one 'merchantSolution' with multiple 'device' entries:
      const deviceEntries = machines.map(m => ({
          nbrOfDevices: m.qty,
          deviceModel: m.model
      }));
      
      if (deviceEntries.length > 0) {
           items.push({
            merchantSolution: {
              prodDetails: {
                  ...commonProdDetails,
                  numberOfDevices: String(machines.reduce((acc, curr) => acc + curr.qty, 0)), // Total count
              },
              pricCond: pricCond,
              device: deviceEntries, // Pass array of devices
              acceptFlag: true
            },
            itemID: preApplicationResponse.itemNo || preApplicationResponse.itemID || "0100" // Use same ID for main solution?
           });
           items.push(null); // The null second item requirement
      } else {
             items.push({
            merchantSolution: {
              prodDetails: {
                  ...commonProdDetails,
                  numberOfDevices: "0",
              },
              pricCond: pricCond,
              device: [],
              acceptFlag: true
            },
            itemID: preApplicationResponse.itemNo || preApplicationResponse.itemID || "0100"
           });
           items.push(null);
      }

      const digitalOfferPayload = {
        offerId: offerId,
        items: items
      };

      console.log("Digital Offer Payload:", digitalOfferPayload);
      console.log("Offer ID being used:", digitalOfferPayload.offerId);

      // STEP 1: Submit digital offer FIRST
      await new Promise<void>((resolve, reject) => {
        setDigitalOffer(
          {
            body: digitalOfferPayload,
          },
          {
            onSuccess: (res) => {
              console.log("Digital offer submitted successfully:", res);
              resolve();
            },
            onError: (error: any) => {
              console.error("Error submitting digital offer:", error);
              
              const errorData = error.response?.data;
              let errorMessage = "Failed to submit digital offer. Please try again.";
              if (errorData?.detail) {
                errorMessage = errorData.detail;
                if (errorMessage.includes("not in draft status")) {
                  errorMessage = "This offer has already been processed and cannot be modified.";
                }
              } else if (errorData?.error) {
                errorMessage = errorData.error;
              } else if (error.message) {
                errorMessage = error.message;
              }
              reject(new Error(errorMessage));
            },
          }
        );
      });

      console.log("Digital offer submitted, now creating contract...");

      // STEP 2: Create contract
      await new Promise<void>((resolve, reject) => {
        createContract(
          {
            body: {
              createContractRequest: {
                offerId: offerId,
                headerDetails: {
                  sourcePlatform: null,
                  securityDetails: {
                    tokenType: null,
                    generateToken: false,
                    accessToken: null
                  },
                  respondToAddress: null,
                  requestTraceId: null,
                  requestCorrelation: null,
                  processType: null,
                  originatorName: null,
                  isSynchronous: false,
                  digitalId: null,
                  customerInterface: null,
                  channelId: null
                }
              },
            },
          },
          {
            onSuccess: (res) => {
              console.log("Contract created successfully:", res);
              const contractDoc = res.contracts?.find(
                (doc: any) => doc.documentCode === "SHAREHOLDCT"
              );
              if (contractDoc?.documentId) {
                const updatedResponse = {
                  ...preApplicationResponse,
                  contractDocumentId: contractDoc.documentId
                };
                localStorage.setItem("merchantOnboardingData", JSON.stringify(updatedResponse));
              }
              resolve();
            },
            onError: (error) => {
              console.error("Error creating contract:", error);
              reject(error);
            },
          }
        );
      });

      console.log("Contract created successfully");
      setIsSubmittingOffer(false);
      setOpen(true);
    } catch (error: any) {
      console.error("Error in handleConfirm:", error);
      setIsSubmittingOffer(false);
      alert(error.message || "Error processing your request. Please try again.");
    }
  };

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

        {/* Summary Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Setup Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Trading Name:</span>
              <span className="ml-2 font-medium text-gray-900">{productData?.tradingName || "Not set"}</span>
            </div>
            <div>
              <span className="text-gray-600">Business Email:</span>
              <span className="ml-2 font-medium text-gray-900">{productData?.businessEmail || "Not set"}</span>
            </div>
            <div>
              <span className="text-gray-600">Selected Machines:</span>
              <div className="ml-2 inline-block align-top">
                 {selectedMachinesList().map((m, i) => (
                     <div key={i} className="font-medium text-gray-900">
                         {m.name} (x{m.count})
                     </div>
                 ))}
                 {selectedMachinesList().length === 0 && <span className="font-medium text-gray-900">None</span>}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Total {productData?.purchaseType === "buy" ? "" : "Monthly"} Fee:</span>
              <span className="ml-2 font-medium text-gray-900">R {calculateTotal().toFixed(2)} (excl. VAT)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selected Card Machine Display Loop */}
          {selectedMachinesList().map((machine, index) => {
              // Determine pricing for this machine type
              let deviceFee = 0;
              let connectivityFee = 0;
              let label = "Monthly rental fee";
              if (flowType === "takealot") {
                  deviceFee = machine.type === "pocket" ? takealotPricing.pocketDeviceFee : takealotPricing.liteDeviceFee;
                  connectivityFee = takealotPricing.connectivityFee;
                  label = "Monthly connectivity fee";
              } else {
                  // Rent/Buy
                  const pricing = productData?.purchaseType && rentBuyPricing[productData.purchaseType] 
                    ? rentBuyPricing[productData.purchaseType] 
                    : rentBuyPricing.rent;
                  deviceFee = machine.type === "pro" ? pricing.proDeviceFee : pricing.pocketDeviceFee;
                  connectivityFee = pricing.connectivityFee;
                  label = productData?.purchaseType === "buy" ? "Purchase price" : "Monthly rental fee";
              }

              return (
                <div key={`${machine.type}-${index}`} className="border border-gray-200 rounded-2xl overflow-hidden mb-8 lg:mb-0">
                  {/* Card Machine Image */}
                  <div>
                    <div className="h-14 bg-gradient-to-tr from-blue-900 to-blue-600 relative">
                      <span className="absolute bg-gradient-to-tr from-primary to-blue-600 text-white px-4 py-1 rounded-br-2xl text-xs uppercase" >
                        {(flowType === "rent" && productData?.purchaseType === "buy") ? "PURCHASE" : "RENTAL - INCLUDES ACTIVATION"}
                      </span>
                    </div>
                    <div className="bg-primary-dark flex justify-center p-2">
                      <Image
                        src={machine.type === "pocket" ? pocketCardMachine : (machine.type === "lite" ? cardMachineMd : cardMachineMd)}
                        alt={machine.name}
                        width={300} 
                        height={280}
                        className="object-contain max-h-[250px]"
                      />
                    </div>
                  </div>

                  {/* Machine Name */}
                  <div className="p-6">
                    <h2 className="text-2xl font-medium text-gray-900">
                      {machine.name}
                    </h2>
                  </div>

                  {/* Pricing Card */}
                  <div className="bg-gray-100 rounded-lg p-6 space-y-6">
                    {/* Quantity */}
                    <div>
                      <div className="text-5xl font-medium text-gray-900 mb-2">
                        {machine.count}
                      </div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">
                        Number of card
                        <br />
                        machine(s)
                      </p>
                    </div>

                    {/* Device Fee */}
                    <div>
                      <div className="flex items-start gap-1">
                        <span className="text-xl text-gray-900">R</span>
                        <span className="text-4xl font-medium text-gray-900">
                          {(deviceFee * machine.count).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide mt-1">
                        {label}
                        <br />
                        (excl. VAT)
                      </p>
                    </div>

                    {/* Connectivity Fee */}
                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl text-gray-900">R</span>
                        <span className="text-4xl font-medium text-gray-900">
                          {(connectivityFee * machine.count).toFixed(2)}
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
              );
          })}

          {/* Merchant App - Always show */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div>
              <div className="h-14 bg-gradient-to-tr from-blue-900 to-blue-600 relative">
                <span className="absolute bg-gradient-to-tr from-primary to-blue-600 text-white px-4 py-1 rounded-br-2xl text-xs">
                  FREE DOWNLOAD
                </span>
              </div>
              <div className="bg-primary-dark flex justify-center p-8">
                <Image
                  src={merchantApp}
                  alt="Merchant App"
                  width={200}
                  height={360}
                  className="object-contain"
                />
              </div>
            </div>

            {/* App Name */}
            <div className="p-6">
              <h2 className="text-2xl font-medium text-gray-900">
                Merchant App
              </h2>
              <p className="text-sm text-gray-600 mt-2">Free download</p>
            </div>

            {/* Benefits */}
            <div className="bg-gray-100 rounded-lg p-6 space-y-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                Download the SimplyBLU Merchant App and register with the
                merchant number provided at the end of your application. A
                merchant commission fee may apply for digital payments.
              </p>

              <h3 className="text-lg font-medium text-gray-900">Benefits</h3>

              <ul className="space-y-4">
                {[
                  "Turn your Android phone into a card machine with Mobile Pay. Send payment links or e-invoices to get paid remotely.",
                  "Gain real-time insights to understand your customers needs.",
                  "Access your sales report wherever and whenever you need.",
                  "Make quick sales, process refunds and manage stock at lightning speed.",
                  "Launch an online store with our Online Store Builder – no coding required."
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-primary-dark text-white rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{benefit}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-10 gap-4">
        <Button variant="outline" className="w-full md:w-1/4" onClick={onBack} disabled={isValidating || isSubmittingOffer}>
          Back
        </Button>
        <Button 
          className="w-full md:w-1/4" 
          onClick={handleConfirm}
          disabled={isValidating || isSubmittingOffer}
        >
          {isSubmittingOffer ? "PROCESSING..." : "CONFIRM"}
        </Button>
      </div>


      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden border-none rounded-2xl [&>button]:hidden">
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

          {/* Document Viewer */}
          <div className="flex-1 overflow-hidden flex flex-col max-h-[calc(90vh-180px)]">
            {isLoadingDocument ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading contract document...</p>
                  <p className="text-sm text-gray-500 mt-2">The document will open in a new tab</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6">
                  {documentUrl && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 text-green-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-medium">Contract document opened in new tab</p>
                      </div>
                      <button
                        type="button"
                        onClick={loadContractDocument}
                        className="mt-2 text-sm text-green-700 hover:text-green-900 underline"
                      >
                        Click here if the document didn't open
                      </button>
                    </div>
                  )}

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
                          type="button"
                          onClick={loadContractDocument}
                          className="flex items-center gap-2 text-primary hover:text-primary-dark underline text-sm md:text-base font-medium transition-colors"
                          disabled={isLoadingDocument}
                        >
                          <FileText className="w-4 h-4" />
                          {isLoadingDocument ? "Loading..." : "View SimplyBLU Application information, disclosures and T&Cs"}
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
            )}
          </div>

          {/* Footer with Action Buttons */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="max-w-3xl mx-auto">
              {documentUrl && (
                <div className="mb-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (documentUrl) {
                        const link = document.createElement('a');
                        link.href = documentUrl;
                        link.download = 'contract.pdf';
                        link.click();
                      }
                    }}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Contract
                  </button>
                </div>
              )}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="w-full md:w-1/3"
                  size="md"
                  onClick={() => setOpen(false)}
                  disabled={isSigning}
                >
                  CANCEL
                </Button>
                <Button
                  variant="default"
                  className="w-full md:w-1/3"
                  size="md"
                  onClick={handleSignContract}
                  disabled={isSigning || isLoadingDocument}
                >
                  {isSigning ? "SIGNING..." : "SIGN"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
