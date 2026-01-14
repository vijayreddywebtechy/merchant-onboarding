import Image from "next/image";
import faceScan from "@/assets/images/general/face_scan.png";
import { Button } from "@/components/ui/button";

type Props = {};

const Instructions = (props: Props) => {
  return (
    <div className="max-w-4xl">
      <p className="text-base sm:text-lg md:text-xl text-neutral-800 mb-6 leading-relaxed">
        Select <strong>Scan</strong> to continue. Scanning your face helps the
        bank confirm your identity against official records or databases.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
        <div className="flex justify-center md:justify-start">
          <Image
            src={faceScan}
            alt="Face scan"
            width={272}
            height={314}
            className="max-w-full h-auto"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-base sm:text-lg md:text-xl text-neutral-700 font-medium">
            You'll be redirected to scan your face in 10s
          </p>

          <ul className="space-y-3 list-disc ml-5 marker:text-primary-dark">
            <li className="text-base sm:text-lg md:text-xl text-neutral-700">
              Remove your glasses
            </li>
            <li className="text-base sm:text-lg md:text-xl text-neutral-700">
              Avoid bright backgrounds
            </li>
            <li className="text-base sm:text-lg md:text-xl text-neutral-700">
              Ensure your face can be seen clearly
            </li>
            <li className="text-base sm:text-lg md:text-xl text-neutral-700">
              Don&apos;t wear a hat
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button variant="outline" className="w-60">
              Back
            </Button>
            <Button className="w-60">Scan</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
