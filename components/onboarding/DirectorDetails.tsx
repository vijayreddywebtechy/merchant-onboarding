"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import userIcon from "@/assets/images/icons/user_avatar_primary.png";
import UpdateDirectorModal from "./UpdateDirectorModal";
import AddDirectorModal from "./AddDirectorModal";

interface Director {
  id: number;
  name: string;
  idNumber: string;
  relationship: string;
  shareStructure: string;
  status: string;
}

const DirectorDetails: React.FC = () => {
  const [hasOtherShareholders, setHasOtherShareholders] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(
    null
  );
  const [selectedDirectorIndex, setSelectedDirectorIndex] = useState<
    number | null
  >(null);

  // Sample director data
  const directors = [
    {
      id: 1,
      name: "E Motaung",
      idNumber: "910814*****",
      relationship: "Required",
      shareStructure: "Required",
      status: "Incomplete",
    },
    {
      id: 2,
      name: "S Mkhize",
      idNumber: "910814*****",
      relationship: "Required",
      shareStructure: "Required",
      status: "Incomplete",
    },
    {
      id: 3,
      name: "J Williams",
      idNumber: "910814*****",
      relationship: "Required",
      shareStructure: "Required",
      status: "Incomplete",
    },
  ];

  const handleUpdate = (director: Director, index: number): void => {
    setSelectedDirector(director);
    setSelectedDirectorIndex(index + 1);
    setIsModalOpen(true);
  };

  const handleBack = (): void => {
    window.history.back();
  };

  const handleNext = (): void => {
    console.log("Continue to next step");
  };

  const handleSaveForLater = (): void => {
    console.log("Save for later");
  };

  return (
    <div className="page-container py-4 md:py-8">
      <div className="w-full bg-white rounded-[20px] shadow-lg p-6 md:p-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
              Director details
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
              These are the directors linked to the selected business. Each
              director will receive an email with steps to verify their
              identity, approve the application, and sign the contract online so
              we can open the account.
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
              Please update the required fields, and ensure all information is
              accurate before continuing.
            </p>
          </div>

          {/* Directors Table Section */}
          <div className="bg-white rounded-lg overflow-hidden mb-8">
            {/* Table Header - Desktop */}
            <div className="hidden md:block">
              <div
                className="bg-primary-dark text-white grid gap-4 p-5 text-sm rounded-t-xl"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr auto" }}
              >
                <div>Name & ID number</div>
                <div>Relationship</div>
                <div>Share structure</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {/* Table Rows - Desktop */}
              <div className="space-y-3 mt-3">
                {directors.map((director, index) => (
                  <div
                    key={director.id}
                    className="grid gap-4 p-5 items-center border border-neutral-200 rounded-lg hover:shadow-md transition"
                    style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr auto" }}
                  >
                    {/* Name & ID */}
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16">
                        <Image
                          src={userIcon}
                          alt={director.name}
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-medium text-neutral-900 mb-1">
                          {director.name}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {director.idNumber}
                        </p>
                      </div>
                    </div>

                    {/* Relationship */}
                    <div>
                      <span className="text-amber-600 text-sm md:text-base">
                        {director.relationship}
                      </span>
                    </div>

                    {/* Share Structure */}
                    <div>
                      <span className="text-amber-600 text-sm md:text-base">
                        {director.shareStructure}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                        {director.status}
                      </span>
                    </div>

                    {/* Action */}
                    <div>
                      <Button
                        variant="link"
                        onClick={() => handleUpdate(director, index)}
                      >
                        UPDATE
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View - Card Style */}
            <div className="md:hidden space-y-4">
              {directors.map((director, index) => (
                <div
                  key={director.id}
                  className="border border-neutral-200 rounded-lg p-4 space-y-4"
                >
                  {/* Name & ID */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {director.name}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {director.idNumber}
                      </p>
                    </div>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-neutral-600 text-xs mb-1">
                        Relationship
                      </p>
                      <p className="text-amber-600 font-medium">
                        {director.relationship}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 text-xs mb-1">
                        Share structure
                      </p>
                      <p className="text-amber-600 font-medium">
                        {director.shareStructure}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 text-xs mb-1">Status</p>
                      <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        {director.status}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleUpdate(director, index)}
                    className="w-full text-primary font-semibold text-sm hover:text-primary-dark transition py-2 text-center"
                  >
                    UPDATE
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button 
            variant="outline" 
            size="md" 
            className="flex ml-auto mb-10"
            onClick={() => setIsAddModalOpen(true)}
          >
            ADD DIRECTOR
          </Button>

          {/* Shareholders Question Section */}
          <div className="mb-10">
            <h3 className="text-sm sm:text-base text-neutral-900 mb-6">
              Does your business have any other shareholders not listed above?
            </h3>

            <RadioGroup
              value={hasOtherShareholders || ""}
              onValueChange={(value: string) => setHasOtherShareholders(value)}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="yes" id="shareholders-yes" />
                  <Label
                    htmlFor="shareholders-yes"
                    className="text-base md:text-lg text-neutral-700 cursor-pointer"
                  >
                    Yes
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <RadioGroupItem value="no" id="shareholders-no" />
                  <Label
                    htmlFor="shareholders-no"
                    className="text-base md:text-lg text-neutral-700 cursor-pointer"
                  >
                    No
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Button
              onClick={handleBack}
              variant="outline"
              className="w-full md:w-48"
            >
              BACK
            </Button>

            <Button onClick={handleNext} className="w-full md:w-48">
              NEXT
            </Button>
          </div>
        </div>
      </div>
      {/* Save for Later Button - Floating on mobile, inline on desktop */}
      <Button
        onClick={handleSaveForLater}
        className="flex w-full sm:w-48 ml-auto rounded-full mt-6 bg-green-700"
      >
        Save for later
      </Button>

      {/* Update Director Modal */}
      <UpdateDirectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        director={selectedDirector}
        directorIndex={selectedDirectorIndex}
        totalDirectors={directors.length}
      />

      {/* Add Director Modal */}
      <AddDirectorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default DirectorDetails;
