import React from "react";
import Link from "next/link";
import Image from "next/image";
import googlePlayBadge from "@/assets/images/general/google-play-badge.png";
import appStoreBadge from "@/assets/images/general/app-store-badge.png";
import deviceApp from "@/assets/images/general/device-app.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-dark">
      <div className="page-container py-6 md:py-2 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-16">
          <h5 className="font-bspro text-2xl md:text-3xl text-white mb-4 md:mb-0 leading-tight">
            Standard Bank App
          </h5>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Link href="#" className="hover:opacity-90 transition">
              <Image
                src={googlePlayBadge}
                alt="Google Play"
                width={175}
                height={46}
                className="max-w-full h-auto"
              />
            </Link>

            <Link href="#" className="hover:opacity-90 transition">
              <Image
                src={appStoreBadge}
                alt="App Store"
                width={175}
                height={46}
                className="max-w-full h-auto"
              />
            </Link>
          </div>
        </div>

        {/* Right Section - Device Image */}
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <Image
            src={deviceApp}
            alt="Devices"
            width={230}
            height={228}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
