"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect, { SelectOption } from "@/components/dynamic/CustomSelect";
import { InfoIcon, X } from "lucide-react";

interface Director {
  id: number;
  name: string;
  idNumber: string;
  relationship: string;
  shareStructure: string;
  status: string;
}

interface UpdateDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  director: Director | null;
  directorIndex: number | null;
  totalDirectors: number;
}

interface FormData {
  relationship: SelectOption | null;
  ownershipType: string[];
  shareStructure: string;
  cellNumber: string;
  email: string;
  isShareholder: boolean;
  isBusinessController: boolean;
}

const UpdateDirectorModal: React.FC<UpdateDirectorModalProps> = ({
  isOpen,
  onClose,
  director,
  directorIndex,
  totalDirectors,
}) => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      relationship: null,
      ownershipType: [],
      shareStructure: "",
      cellNumber: "",
      email: "",
      isShareholder: false,
      isBusinessController: false,
    },
  });

  const onSubmit = (data: FormData): void => {
    console.log("Submit form data:", data);
    onClose();
  };

  if (!director) return null;

  const relationshipOptions: SelectOption[] = [
    { value: "director", label: "Director" },
    { value: "shareholder", label: "Shareholder" },
    { value: "trustee", label: "Trustee" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col overflow-hidden border border-neutral-800 [&>button]:hidden sm:rounded-2xl">
        {/* Header - Sticky */}
        <div className="bg-primary-dark text-white sm:text-center p-4 relative">
          <h2 className="text-base sm:text-lg font-medium pr-6 sm:px-0">
            Update the following information
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition absolute top-1/2 -translate-y-1/2 right-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8">
          {/* Director Info */}
          <div className="flex items-start gap-4 py-4 mb-4">
            {/* Circular Progress Indicator */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#0033aa"
                  strokeWidth="3"
                  strokeDasharray={`${((directorIndex ?? 0) / totalDirectors) * 283} 283`}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dasharray 0.6s ease-in-out",
                  }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs font-bold text-primary-dark">{directorIndex ?? 0} of {totalDirectors}</p>
              </div>
            </div>
            <div className="flex-1">
              <div>
                <p className="text-2xl font-medium text-neutral-950">
                  {director.name}
                </p>
                <p className="text-base text-neutral-600">{director.idNumber}</p>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Relationships and roles */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-5">
                  Relationships and roles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Relationship */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Label>Relationship</Label>
                      <InfoIcon
                        size={20}
                        className="text-primary cursor-help"
                      />
                    </div>
                    <Controller
                      name="relationship"
                      control={control}
                      render={({ field }) => (
                        <CustomSelect
                          options={relationshipOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Please select"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ownership details */}
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-5">
                    Ownership details
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Controller
                        name="isShareholder"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="isShareholder"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="isShareholder"
                        className="text-base text-neutral-900 cursor-pointer font-normal"
                      >
                        Shareholder
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Controller
                        name="isBusinessController"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="isBusinessController"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="isBusinessController"
                        className="text-base text-neutral-900 cursor-pointer font-normal"
                      >
                        Business Controller
                      </Label>
                    </div>
                  </div>
                </div>
                {/* Share Structure */}
                <div>
                  <Label>Share structure</Label>
                  <Controller
                    name="shareStructure"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Add percentage e.g. 35%"
                      />
                    )}
                  />
                  <p className="text-sm text-neutral-800 mt-1">
                    Enter the percentage of the business owned by this director.
                    The combined total for all directors must equal 100%.
                  </p>
                </div>
              </div>
              {/* Contact details */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">
                  Contact details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>
                      Cell number
                    </Label>
                    <Controller
                      name="cellNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter your cell phone number"
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label>
                      Email address
                    </Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email address"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 px-6 md:px-8 py-6 flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 md:flex-none md:w-48"
          >
            BACK
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="flex-1 md:flex-none md:w-48"
          >
            NEXT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDirectorModal;
