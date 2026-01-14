import Image from "next/image";
import Link from "next/link";
import successBlue from "@/assets/images/icons/success_blue.png";
import cardMachineShield from "@/assets/images/general/card_machine_shield.png";
import cardMachine from "@/assets/images/general/card_machine_md.png";
import GooglePlayBadge from "@/assets/images/general/google_play.png";
import appStoreBadge from "@/assets/images/general/app_store.png";
import mobileAppDevice from "@/assets/images/general/mobile_app_device_md.png";
import userAvatar from "@/assets/images/icons/user_avatar_primary.png";

import { CheckCircle, Clock, Info, User } from "lucide-react";
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

function page({}: Props) {
  return (
    <div className="page-container py-4 md:py-8 lg:py-12">
      <div className="bg-background px-4 py-6 sm:p-8 md:p-10 rounded-xl max-w-7xl mx-auto">
        {/* Banner */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-around gap-4 bg-gradient-to-tl from-primary-dark to-primary text-white rounded-xl p-6 md:p-8 mb-12">
          <div className="max-w-xl">
            <div className="flex items-start gap-3">
              <Image width={50} height={50} src={successBlue} alt="check" />
              <div>
                <h2 className="text-3xl md:text-3xl lg:text-4xl mb-6 lg:leading-tight">
                  Application submitted successfully
                </h2>
                <p className="text-base sm:text-lg md:text-xl">
                  Once the remaining directors have completed their part of the
                  application, we’ll email your account details to
                  name@gmail.com
                </p>
              </div>
            </div>
          </div>
          <Image
            width={256}
            height={298}
            src={cardMachineShield}
            alt="card shield image"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Card */}
          <div className="shadow rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r shadow text-white from-primary to-primary-dark p-3 sm:p-4 text-center font-medium text-sm sm:text-base">
              SimplyBLU Pro
            </div>
            <div className="p-2 sm:p-3 bg-primary-dark h-64 sm:h-80 md:h-96 flex items-center justify-center">
              <Image
                src={cardMachine}
                alt="card machine"
                width={320}
                height={298}
                className="w-auto h-auto max-h-full object-contain"
              />
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-sm sm:text-base text-gray-800">
                Enjoy seamless transactions with your new card machine.
              </p>
            </div>
          </div>
          {/* Card */}
          <div className="shadow rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r shadow text-white from-primary to-primary-dark p-3 sm:p-4 text-center font-medium text-sm sm:text-base">
              SimplyBLU Merchant App
            </div>
            <div className="p-2 sm:p-3 bg-primary-dark h-64 sm:h-80 md:h-96 flex items-center justify-around gap-3 sm:gap-4 flex-col sm:flex-row">
              <Image 
                src={mobileAppDevice} 
                alt="Mobile App" 
                className="w-auto h-auto max-h-[60%] sm:max-h-[80%] object-contain"
              />
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-3">
                <Link href="/" className="w-32 sm:w-36 md:w-auto">
                  <Image src={GooglePlayBadge} alt="Google Play" className="w-full h-auto" />
                </Link>
                <Link href="/" className="w-32 sm:w-36 md:w-auto">
                  <Image src={appStoreBadge} alt="App Store" className="w-full h-auto" />
                </Link>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-sm sm:text-base text-gray-800">
                Unlock the full SimplyBLU platform by downloading the Merchant
                App.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="w-full mx-auto px-3 sm:px-4 py-6 sm:py-8 border-y border-neutral-200 my-8 md:my-12">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-medium text-neutral-900">
              Next steps:
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600">
              To help speed things up, please let the other directors know to
              expect an email from us with the next steps to complete their part
              of the application.
            </p>
          </div>

          {/* Director Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {directors.map((director) => (
              <DirectorCard key={director.name} {...director} />
            ))}
          </div>

          {/* Info Alert */}
          <div className="mt-4 sm:mt-6 flex items-start gap-2 sm:gap-3 rounded-lg bg-blue-50 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-blue-700">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Once the other directors complete the application, their status
              will update automatically and you'll be notified.
            </p>
          </div>

          {/* Action */}
          <div className="mt-6 sm:mt-8 md:mt-10">
            <Button className="w-full sm:w-auto min-w-[200px] sm:min-w-60">Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;

interface DirectorCardProps extends Director {}

function DirectorCard({ name, phone, status }: DirectorCardProps) {
  const isDone = status === "done";

  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-xl border border-neutral-200 bg-white px-3 sm:px-4 py-4 sm:py-6">
      {/* Avatar */}
      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary-dark flex-shrink-0">
        <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{name}</p>
        <p className="text-xs text-neutral-500 my-1 truncate">{phone}</p>

        <div className="my-1 flex items-center gap-1">
          {isDone ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-xs text-green-600">Done</span>
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
              <span className="text-xs text-orange-500">Pending</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
