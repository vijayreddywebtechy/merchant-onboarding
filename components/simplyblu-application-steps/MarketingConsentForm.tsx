import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Props } from "react-select";
import { Info } from "lucide-react";

interface MarketingConsentData {
  dataSharingGroup: string;
  dataSharingThirdParty: string;
  dataSharingBoarders: string;
}

const MarketingConsentForm = (props: Props) => {
  const [formData, setFormData] = useState<MarketingConsentData>({
    dataSharingGroup: "",
    dataSharingThirdParty: "",
    dataSharingBoarders: "",
  });

  const handleRadioChange = (name: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="py-6 md:py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
            Marketing consent
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            Before continuing, please select your business marketing preferences
          </p>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Data Sharing within Our Group */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-700">
              Data Sharing within Our Group
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              A member of{" "}
              <a href="#" className="text-blue-600 hover:underline">
                The Group
              </a>{" "}
              may wish to bring you exclusive offers and/or services that may
              benefit you. Are you happy for us to share your data within our
              group for this purpose?
            </p>
            <RadioGroup
              value={formData.dataSharingGroup}
              onValueChange={(value) =>
                handleRadioChange("dataSharingGroup", value)
              }
              className="flex gap-6 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="group-yes" />
                <Label
                  htmlFor="group-yes"
                  className="font-normal cursor-pointer text-gray-700"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="group-no" />
                <Label
                  htmlFor="group-no"
                  className="font-normal cursor-pointer text-gray-700"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Data Sharing with Third Parties */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-700">
              Data Sharing with Third Parties
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We may partner with third parties outside of our Group in order to
              bring you exclusive offers and/or services that may benefit you.
              Are you happy for us to share your data with these third parties
              for this purpose?
            </p>
            <RadioGroup
              value={formData.dataSharingThirdParty}
              onValueChange={(value) =>
                handleRadioChange("dataSharingThirdParty", value)
              }
              className="flex gap-6 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="third-party-yes" />
                <Label
                  htmlFor="third-party-yes"
                  className="font-normal cursor-pointer text-gray-700"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="third-party-no" />
                <Label
                  htmlFor="third-party-no"
                  className="font-normal cursor-pointer text-gray-700"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Data Sharing Across Boarders Within The Group */}
          <div className="space-y-4">
            <h2 className="text-base font-medium text-gray-700">
              Data Sharing Across Boarders Within The Group
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              A member of The group outside of this country may wish to send you
              exclusive offers and/or services that may benefit you. your
              information will be protected the same way it is protected
              locally. are you happy for us to share your data for this purpose?
            </p>
            <RadioGroup
              value={formData.dataSharingBoarders}
              onValueChange={(value) =>
                handleRadioChange("dataSharingBoarders", value)
              }
              className="flex gap-6 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="boarders-yes" />
                <Label
                  htmlFor="boarders-yes"
                  className="font-normal cursor-pointer text-gray-700"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="boarders-no" />
                <Label
                  htmlFor="boarders-no"
                  className="font-normal cursor-pointer text-gray-700"
                >
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Information Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <div className="flex-shrink-0">
              <Info size={20} className="text-white fill-primary-dark" />
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              Please note that you have the right to change your consent and
              preferences at any time in the future at any branch, by contacting
              your relationship manager, calling us on 0860 123 000, emailing us
              on{" "}
              <a
                href="mailto:information@standardbank.co.za"
                className="text-blue-600 hover:underline font-medium break-words"
              >
                information@standardbank.co.za
              </a>{" "}
              or logging to our banking channels to update your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingConsentForm;
