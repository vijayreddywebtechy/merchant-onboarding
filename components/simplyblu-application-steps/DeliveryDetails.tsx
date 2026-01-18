"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { House, Search } from 'lucide-react';
import { deliveryDetailsSchema } from '@/lib/validationSchemas';
import { StepFooter } from "@/components/dynamic/StepFooter";

type DeliveryDetailsData = {
  deliveryLocation: 'company' | 'residential' | 'new';
  contactPersonName: string;
  contactPersonSurname: string;
  contactPersonNumber: string;
  deliveryDate: Date;
  addressSearch: string;
  streetNumber: string;
  suburb: string;
  complexName?: string;
  province: string;
  cityTown: string;
  postalCode?: string;
};

interface Props {
  onNext?: () => void;
  onBack?: () => void;
}

export default function DeliveryDetails({ onNext, onBack }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [companyAddress, setCompanyAddress] = React.useState<any>(null);
  const [residentialAddress, setResidentialAddress] = React.useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const {
    control,
    formState: { errors, isValidating },
    watch,
    handleSubmit,
    reset,
    getValues,
  } = useForm<DeliveryDetailsData>({
    resolver: yupResolver(deliveryDetailsSchema) as any,
    mode: "onChange",
    defaultValues: {
      deliveryLocation: 'company',
      contactPersonName: '',
      contactPersonSurname: '',
      contactPersonNumber: '',
      deliveryDate: undefined as any,
      addressSearch: '',
      streetNumber: '',
      suburb: '',
      complexName: '',
      province: '',
      cityTown: '',
    },
  });


  React.useEffect(() => {
    const data = localStorage.getItem("deliveryDetailsFormData");
    if (data) {
      reset(JSON.parse(data));
    }
    
    // Load company address from CompanyDetails
    const companyData = localStorage.getItem("companyDetailsFormData");
    if (companyData) {
      setCompanyAddress(JSON.parse(companyData));
    }
    
    // Load residential address from PersonalInfo
    const personalData = localStorage.getItem("personalDetailsFormData");
    if (personalData) {
      setResidentialAddress(JSON.parse(personalData));
    }
  }, [reset]);

  const deliveryLocation = watch("deliveryLocation");

  // Save form data in real-time to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem("deliveryDetailsFormData", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleAddressSearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    const searchTerm = getValues("addressSearch");
    if (!searchTerm || searchTerm.length < 3) return;

    setIsSearchingAddress(true);
    setSearchResults([]);
    setShowResults(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/address-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          streetValue: searchTerm,
          province: "", // Optional
        }),
      });

      const data = await response.json();

      // Check for error response format
      if (data && data.streetAddresses && Array.isArray(data.streetAddresses) && data.streetAddresses[0] === 'error') {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      
      let results = [];
      if (data && Array.isArray(data.addressList)) {
        results = data.addressList;
      } else if (data && Array.isArray(data)) {
        results = data;
      } else if (data && typeof data === 'object' && !data.streetAddresses) {
         results = [data]; 
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error("Address search error:", error);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const selectAddress = (address: any) => {
    const currentValues = getValues();
    const street = address.streetName || address.streetValue || "";

    reset({
      ...currentValues,
      streetNumber: street,
      suburb: address.suburb || "",
      cityTown: address.city || address.cityTown || "",
      province: address.province || "",
      postalCode: address.postalCode || "",
      addressSearch: address.formattedAddress || street,
    });
    
    setShowResults(false);
  };



  return (
    <form onSubmit={handleSubmit((data) => { if (onNext) onNext(); })} className="py-6 md:py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}

                <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-3">
            Delivery details
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
            Please complete the information below
          </p>
        </div>

        {/* Delivery Location */}
        <div className="space-y-4 mb-8">
          <Label className="font-medium">
            Where would you like your card machines(s) to be delivered?
          </Label>
          <Controller
            name="deliveryLocation"
            control={control}
            render={({ field }) => (
              <>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as 'company' | 'residential' | 'new')}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="location-company" />
                    <Label htmlFor="location-company" className="cursor-pointer">
                      Company trading address
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residential" id="location-residential" />
                    <Label htmlFor="location-residential" className="cursor-pointer">
                      Residential address
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="location-new" />
                    <Label htmlFor="location-new" className="cursor-pointer">
                      Add new address
                    </Label>
                  </div>
                </RadioGroup>
                {errors.deliveryLocation && (
                  <p className="text-sm text-red-500">{errors.deliveryLocation.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Address Display - Only show for company or residential */}
        {deliveryLocation !== 'new' && (
          <div className="bg-primary-dark text-white rounded-lg mb-8 flex items-center gap-4">
            <div className="flex-shrink-0 p-6 bg-blue-800 rounded-l-lg">
              <House className="w-8 h-8" />
            </div>
            <div className='p-2'>
              <p className="text-lg">
                {deliveryLocation === 'company' ? (
                  companyAddress ? (
                    <>
                      {companyAddress.streetNumber && <span>{companyAddress.streetNumber}</span>}
                      {companyAddress.suburb && <span>, {companyAddress.suburb}</span>}
                      {companyAddress.complexName && <span>, {companyAddress.complexName}</span>}
                      {companyAddress.cityTown && <span>, {companyAddress.cityTown}</span>}
                      {companyAddress.postalCode && <span>, {companyAddress.postalCode}</span>}
                    </>
                  ) : (
                    "Company address not found"
                  )
                ) : (
                  residentialAddress ? (
                    <>
                      {residentialAddress.street && <span>{residentialAddress.street}</span>}
                      {residentialAddress.unit && <span>, {residentialAddress.unit}</span>}
                      {residentialAddress.buildingName && <span>, {residentialAddress.buildingName}</span>}
                      {residentialAddress.suburb && <span>, {residentialAddress.suburb}</span>}
                      {residentialAddress.city && <span>, {residentialAddress.city}</span>}
                      {residentialAddress.postalCode && <span>, {residentialAddress.postalCode}</span>}
                    </>
                  ) : (
                    "Residential address not found"
                  )
                )}
              </p>
            </div>
          </div>
        )}

        {/* New Address Form - Only show when 'new' is selected */}
        {deliveryLocation === 'new' && (
          <div className="mb-8 space-y-6">
            {/* Address Search */}
            <div className="space-y-2">
              <Label htmlFor="addressSearch">
                Enter your address
              </Label>
              <div className="relative">
                <Controller
                  name="addressSearch"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        id="addressSearch"
                        {...field}
                        placeholder="Enter your address"
                        className="pr-12"
                      />
                      {errors.addressSearch && (
                        <p className="text-sm text-red-500">{errors.addressSearch.message}</p>
                      )}
                    </>
                  )}
                />
                <button
                  onClick={handleAddressSearch}
                  disabled={isSearchingAddress}
                  className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-400"
                >
                  {isSearchingAddress ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                </button>
            
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => selectAddress(result)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {result.streetName || result.streetValue}
                        </div>
                        <div className="text-xs text-gray-500">
                          {[result.suburb, result.city, result.province, result.postalCode].filter(Boolean).join(", ")}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {showResults && !isSearchingAddress && searchResults.length === 0 && (
                   <div className="text-sm text-gray-500 mt-1">No results found.</div>
                )}
              </div>
            </div>

            {/* Street Number and Suburb */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="streetNumber">
                  Street number and name
                </Label>
                <Controller
                  name="streetNumber"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        id="streetNumber"
                        {...field}
                        placeholder="e.g 134 Raglan street"
                      />
                      {errors.streetNumber && (
                        <p className="text-sm text-red-500">{errors.streetNumber.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suburb">
                  Suburb
                </Label>
                <Controller
                  name="suburb"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        id="suburb"
                        {...field}
                        placeholder="e.g Sandton"
                      />
                      {errors.suburb && (
                        <p className="text-sm text-red-500">{errors.suburb.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Complex Name */}
            <div className="space-y-2">
              <Label htmlFor="complexName">
                Complex/Building name (optional)
              </Label>
              <Controller
                name="complexName"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="complexName"
                    {...field}
                    placeholder="e.g Green Valley Complex"
                  />
                )}
              />
            </div>

            {/* Province and City/Town */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="province">
                  Province
                </Label>
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        id="province"
                        {...field}
                        placeholder="e.g Gauteng"
                      />
                      {errors.province && (
                        <p className="text-sm text-red-500">{errors.province.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cityTown">
                  City/town
                </Label>
                <Controller
                  name="cityTown"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        id="cityTown"
                        {...field}
                        placeholder="e.g Johannesburg"
                      />
                      {errors.cityTown && (
                        <p className="text-sm text-red-500">{errors.cityTown.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postalCode">
                Postal code
              </Label>
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      type="text"
                      id="postalCode"
                      {...field}
                      placeholder="e.g 2011"
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        )}
        {/* Recipient and Delivery Date */}
        <div className="my-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">
            Recipient and delivery date
          </h2>

          <div className="space-y-6">
            {/* Contact Person Name and Surname */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactPersonName" className="text-sm text-gray-700">
                  Contact person name
                </Label>
                <Controller
                  name="contactPersonName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        id="contactPersonName"
                        {...field}
                        placeholder="e.g Simz"
                      />
                      {errors.contactPersonName && (
                        <p className="text-sm text-red-500">{errors.contactPersonName.message}</p>
                      )}
                    </>
                  )}
                />
                <p className="text-xs text-gray-600">
                  The person expected to receive the card machine(s) upon delivery
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonSurname" className="text-sm text-gray-700">
                  Contact person surname
                </Label>
                <Controller
                  name="contactPersonSurname"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="text"
                        id="contactPersonSurname"
                        {...field}
                        placeholder="e.g Shabalala"
                      />
                      {errors.contactPersonSurname && (
                        <p className="text-sm text-red-500">{errors.contactPersonSurname.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Contact Person Number and Delivery Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactPersonNumber" className="text-sm text-gray-700">
                  Contact person number
                </Label>
                <Controller
                  name="contactPersonNumber"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="tel"
                        id="contactPersonNumber"
                        {...field}
                        placeholder="e.g 074 567 345"
                      />
                      {errors.contactPersonNumber && (
                        <p className="text-sm text-red-500">{errors.contactPersonNumber.message}</p>
                      )}
                    </>
                  )}
                />
                <p className="text-xs text-gray-600">
                  The person expected to receive the card machine(s) upon delivery
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="text-sm text-gray-700">
                  Delivery date
                </Label>
                <Controller
                  name="deliveryDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 w-full justify-between text-left font-normal rounded-lg border border-neutral-700 hover:border-primary focus:border-primary focus:outline-none bg-background px-3 py-2 text-sm md:text-base text-secondary",
                              !field.value && "text-neutral-700"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select</span>
                            )}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              const tomorrow = new Date(today);
                              tomorrow.setDate(tomorrow.getDate() + 1);
                              
                              // Disable today and tomorrow
                              return date < new Date(tomorrow.setHours(0, 0, 0, 0));
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.deliveryDate && (
                        <p className="text-sm text-red-500">{errors.deliveryDate.message}</p>
                      )}
                    </>
                  )}
                />
                <p className="text-xs text-gray-600">
                  Today and tomorrow are disabled for selection
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <div className="flex-shrink-0">
              <Info size={20} className="text-white fill-primary-dark" />
          </div>
          <p className="text-sm text-blue-900">
            If your application is successful, your delivery will be processed after 48 hours.
          </p>
        </div>

        <StepFooter 
          onBack={onBack}
          isLoading={isValidating}
        />
      </div>
    </form>
  );
}