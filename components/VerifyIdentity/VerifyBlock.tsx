import Image from "next/image";
import faceScan from "@/assets/images/general/face_scan.png";
import { Button } from "@/components/ui/button";
import VerificationStatus from "./VerificationStation";
import Instructions from "./Instructions";

type Props = {};

const VerifyBlock = (props: Props) => {
  return (
    <div className="page-container py-4 md:py-8">
      <div className="w-full bg-white rounded-[20px] shadow-lg p-6 md:p-10">
        <div>
          <span className="block text-sm text-gray-600 mb-2">
            Verify your identity{" "}
          </span>
          <h2 className="text-2xl md:text-3xl font-medium text-secondary mb-6">
            Scan your face
          </h2>

          {/* Instructions Start */}
          <Instructions />

          {/* Successfull */}
          <VerificationStatus />
        </div>
      </div>
    </div>
  );
};

export default VerifyBlock;
