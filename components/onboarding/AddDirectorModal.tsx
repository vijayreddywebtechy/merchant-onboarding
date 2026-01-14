"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import CustomSelect, { SelectOption } from "@/components/dynamic/CustomSelect";
import { InfoIcon, X } from "lucide-react";

interface AddDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  surname: string;
  idNumber: string;
  relationship: SelectOption | null;
  sharePercentage: string;
  isShareholder: boolean;
  isBusinessController: boolean;
  cellNumber: string;
  email: string;
}

const AddDirectorModal: React.FC<AddDirectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      surname: "",
      idNumber: "",
      relationship: null,
      sharePercentage: "",
      isShareholder: false,
      isBusinessController: false,
      cellNumber: "",
      email: "",
    },
  });

  const onSubmit = (data: FormData): void => {
    console.log("Add director form data:", data);
    reset();
    onClose();
  };

  const handleClose = (): void => {
    reset();
    onClose();
  };

  const relationshipOptions: SelectOption[] = [
    { value: "director", label: "Director" },
    { value: "shareholder", label: "Shareholder" },
    { value: "trustee", label: "Trustee" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden border-none rounded-2xl [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-primary-dark to-primary p-4 sm:p-6 relative">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl text-center font-normal text-white pr-8">
            Add new director
          </DialogTitle>
          {/* Custom Close Button */}
          <DialogClose asChild>
            <button
              className="!mt-0 absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close dialog"
              onClick={handleClose}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </DialogClose>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="px-6 py-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-5">
                Personal information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Name</Label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter first name"
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Surname</Label>
                  <Controller
                    name="surname"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter surname"
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>ID number</Label>
                  <Controller
                    name="idNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter ID number"
                      />
                    )}
                  />
                </div>
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

            {/* Ownership Details */}
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-5">
                Ownership details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                <div>
                  <Label>Share percentage</Label>
                  <Controller
                    name="sharePercentage"
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
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-6">
                Contact details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Cell number</Label>
                  <Controller
                    name="cellNumber"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter your cell phone number"
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Email address</Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
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

        {/* Footer with Action Buttons */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto md:w-1/3"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full sm:w-auto md:w-1/3"
            >
              ADD DIRECTOR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDirectorModal;
