"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import successBlue from "@/assets/images/icons/success_blue.png";
import cardMachine from "@/assets/images/general/card_machine_md.png";
import GooglePlayBadge from "@/assets/images/general/google_play.png";
import appStoreBadge from "@/assets/images/general/app_store.png";
import mobileAppDevice from "@/assets/images/general/mobile_app_device.png";
 
import { Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {};

type DirectorStatus = "done" | "pending";

interface Director {
  name: string;
  phone: string;
  status: DirectorStatus;
}

const directors: Director[] = [
  {
    name: "E Motaung",
    phone: "640929********",
    status: "done",
  },
  {
    name: "S Mkhize",
    phone: "901229********",
    status: "pending",
  },
  {
    name: "J Williams",
    phone: "910814********",
    status: "pending",
  },
];

export default function ApplicationCompletePage({}: Props) {
  const router = useRouter();
  const [merchantNumber, setMerchantNumber] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");

  useEffect(() => {
    // Retrieve data from localStorage
    const merchantData = localStorage.getItem("merchantOnboardingData");
    const personalData = localStorage.getItem("personalDetailsFormData");
    
    if (merchantData) {
      try {
        const parsed = JSON.parse(merchantData);
        
        const mNumber = parsed.preApplicationResponse?.merchantNumber || 
                        parsed.applicationProcessData?.merchantNumber || 
                        "2738920184"; // Fallback/Mock if not found in specific path during dev
        setMerchantNumber(mNumber);
      } catch (e) {
        console.error("Error parsing merchant data", e);
      }
    }

    if (personalData) {
        try {
            const parsed = JSON.parse(personalData);
            if (parsed.email) setEmail(parsed.email);
        } catch (e) {
            console.error("Error parsing personal data", e);
        }
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        
        {/* Header Section */}
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                <Check className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-medium text-gray-900">Application submitted</h1>
        </div>

        {/* Notification Banner */}
        <div className="bg-white border border-blue-200 rounded-lg p-6 flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400"></div> {/* Grey accent line on left */}
            <div className="shrink-0 mt-1">
                 <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">!</div>
            </div>
            <div>
                <h3 className="text-gray-900 font-medium">Your merchant number is {merchantNumber}</h3>
                <p className="text-gray-600 mt-1">
                    We’ve received your application. Next steps will be sent to your email address: {email}
                </p>
            </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Left Card - SimplyBLU Pro */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-blue-700 p-4">
                    <h3 className="text-white font-medium text-lg">SimplyBLU Pro</h3>
                </div>
                <div className="bg-blue-900 flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                     {/* Gradient background effect */}
                     <div className="absolute inset-0 bg-gradient-to-b from-blue-800 to-blue-900"></div>
                     <div className="relative z-10">
                        <Image 
                            src={cardMachine} 
                            alt="SimplyBLU Pro Machine" 
                            width={200}
                            height={300}
                            className="object-contain drop-shadow-xl transform rotate-[-10deg]"
                        />
                     </div>
                </div>
                <div className="p-6 bg-white">
                    <p className="text-gray-700">Enjoy seamless transactions with your new card machine.</p>
                </div>
            </div>

            {/* Right Card - Merchant App */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-blue-800 p-4">
                    <h3 className="text-white font-medium text-lg">Download the SimplyBLU Merchant App</h3>
                </div>
                <div className="bg-blue-900 flex-1 p-8 text-white relative flex flex-col justify-between">
                    <div className="mb-6">
                        <p className="text-sm mb-6 text-blue-100">Unlock the full SimplyBLU platform by downloading the Merchant App.</p>
                        <div className="flex gap-3">
                            <Link href="#" className="w-32">
                                <Image src={GooglePlayBadge} alt="Get it on Google Play" width={128} height={38} className="w-full h-auto" />
                            </Link>
                            <Link href="#" className="w-32">
                                <Image src={appStoreBadge} alt="Download on the App Store" width={128} height={38} className="w-full h-auto" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-blue-800/50">
                        <p className="text-sm font-medium mb-2">Your card machine also accepts American Express and RCS.</p>
                        <p className="text-xs text-blue-200 mb-3">To set this up, please contact these providers.</p>
                        <div className="flex gap-3 items-center bg-white/10 p-2 rounded w-fit">
                             {/* Placeholder for logos if actual files missed, using text styling to look decent */}
                             <span className="bg-blue-600 text-white text-[10px] font-bold px-1 py-0.5 rounded border border-white/20">AMERICAN EXPRESS</span>
                             <span className="bg-orange-500 text-white text-[10px] font-bold px-1 py-0.5 rounded border border-white/20">RCS</span>
                             {/* If Amex logo image is available in assets, could use: <Image src={amexLogo} ... /> */}
                        </div>
                    </div>
                    
                    {/* Floating phone image often part of this design, positioned absolutely */}
                    <div className="absolute top-4 right-4 w-16 opacity-80 hidden sm:block">
                         <Image src={mobileAppDevice} alt="App" width={60} height={100} className="object-contain" />
                    </div>
                </div>
            </div>
        </div>

        {/* Done Button */}
        <div className="mt-8">
            <Button 
                onClick={() => router.push("/")} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md"
            >
                DONE
            </Button>
        </div>

      </div>
    </div>
  );
}

