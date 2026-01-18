"use client";

import Link from "next/link";
import Image from "next/image";
import standartbankLogo from "@/assets/sb-logo.png";
import React from "react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();

  const handleExit = (): void => {
    // Clear all application data from localStorage
    localStorage.clear();
    // Redirect to account onboarding page
    router.push("/account-onboarding?prodId=ZPOS&prOpt=ZSIB");
  };

  return (
    <div className="w-full bg-primary-dark h-12 sm:h-14 md:h-16 flex items-center">
      <div className="page-container py-2 flex w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={standartbankLogo}
            alt="Standard Bank Logo"
            width={158}
            height={42}
            className="h-6 w-auto sm:h-8 md:h-[42px]"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={handleExit}
          className="text-white font-bspro font-medium text-lg md:text-xl uppercase cursor-pointer"
        >
          EXIT
        </button>
      </div>
    </div>
  );
};

export default Header;
