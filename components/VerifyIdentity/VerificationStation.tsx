import Image from "next/image";
import success from "@/assets/images/icons/success.png";
import { Button } from "@/components/ui/button";

type Props = {
  onNext?: () => void;
};

const VerificationStatus = (props: Props) => {
  const handleNext = () => {
    if (props.onNext) {
      props.onNext();
    }
  };

  return (
    <div className="w-full max-w-[976px] mx-auto">
      <div className="flex flex-col place-items-center py-10">
        <Image
          src={success}
          alt="face scan"
          width={150}
          height={150}
          className="max-w-full h-auto"
        />
        <div className="my-10 text-center">
          <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-secondary font-medium">
            Verification successful
          </h3>
          <p className="text-base text-neutral-600 mt-5">
            Please continue with the account application
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
         
          <Button variant="default" className="w-60" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
