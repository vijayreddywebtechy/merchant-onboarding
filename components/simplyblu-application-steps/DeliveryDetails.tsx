import React, { useState } from 'react';
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

interface DeliveryDetailsData {
  deliveryLocation: 'company' | 'residential' | 'new';
  contactPersonName: string;
  contactPersonSurname: string;
  contactPersonNumber: string;
  deliveryDate: Date | undefined;
  addressSearch: string;
  streetNumber: string;
  suburb: string;
  complexName: string;
  province: string;
  cityTown: string;
  postalCode: string;
}

export default function DeliveryDetails() {
  const [formData, setFormData] = useState<DeliveryDetailsData>({
    deliveryLocation: 'company',
    contactPersonName: 'e.g Simz',
    contactPersonSurname: 'e.g Shabalala',
    contactPersonNumber: 'e.g 074 567 345',
    deliveryDate: undefined,
    addressSearch: '',
    streetNumber: '',
    suburb: '',
    complexName: '',
    province: '',
    cityTown: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string): void => {
    setFormData(prev => ({
      ...prev,
      deliveryLocation: value as 'company' | 'residential' | 'new',
    }));
  };

  return (
    <div className="py-6 md:py-8">
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
          <RadioGroup
            value={formData.deliveryLocation}
            onValueChange={handleRadioChange}
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
        </div>

        {/* Address Display - Only show for company or residential */}
        {formData.deliveryLocation !== 'new' && (
          <div className="bg-primary-dark text-white rounded-lg mb-8 flex items-center gap-4">
            <div className="flex-shrink-0 p-6 bg-blue-800 rounded-l-lg">
              <House className="w-8 h-8" />
            </div>
            <div className='p-2'>
              <p className="text-lg">
                25 B Katjiepiering Crescent, Amelia, Johannesburg, 0157
              </p>
            </div>
          </div>
        )}

        {/* New Address Form - Only show when 'new' is selected */}
        {formData.deliveryLocation === 'new' && (
          <div className="mb-8 space-y-6">
            {/* Address Search */}
            <div className="space-y-2">
              <Label htmlFor="addressSearch">
                Enter your address
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="addressSearch"
                  name="addressSearch"
                  value={formData.addressSearch}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="pr-12"
                />
                <button
                  className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Street Number and Suburb */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="streetNumber">
                  Street number and name
                </Label>
                <Input
                  type="text"
                  id="streetNumber"
                  name="streetNumber"
                  value={formData.streetNumber}
                  onChange={handleInputChange}
                  placeholder="e.g 134 Raglan street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suburb">
                  Suburb
                </Label>
                <Input
                  type="text"
                  id="suburb"
                  name="suburb"
                  value={formData.suburb}
                  onChange={handleInputChange}
                  placeholder="e.g Sandton"
                />
              </div>
            </div>

            {/* Complex Name */}
            <div className="space-y-2">
              <Label htmlFor="complexName">
                Complex/Building name (optional)
              </Label>
              <Input
                type="text"
                id="complexName"
                name="complexName"
                value={formData.complexName}
                onChange={handleInputChange}
                placeholder="e.g Green Valley Complex"
              />
            </div>

            {/* Province and City/Town */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="province">
                  Province
                </Label>
                <Input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  placeholder="e.g Gauteng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cityTown">
                  City/town
                </Label>
                <Input
                  type="text"
                  id="cityTown"
                  name="cityTown"
                  value={formData.cityTown}
                  onChange={handleInputChange}
                  placeholder="e.g Johannesburg"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postalCode">
                Postal code
              </Label>
              <Input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="e.g 2011"
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
                <Input
                  type="text"
                  id="contactPersonName"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  placeholder="e.g Simz"
                />
                <p className="text-xs text-gray-600">
                  The person expected to receive the card machine(s) upon delivery
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonSurname" className="text-sm text-gray-700">
                  Contact person surname
                </Label>
                <Input
                  type="text"
                  id="contactPersonSurname"
                  name="contactPersonSurname"
                  value={formData.contactPersonSurname}
                  onChange={handleInputChange}
                  placeholder="e.g Shabalala"
                />
              </div>
            </div>

            {/* Contact Person Number and Delivery Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactPersonNumber" className="text-sm text-gray-700">
                  Contact person number
                </Label>
                <Input
                  type="tel"
                  id="contactPersonNumber"
                  name="contactPersonNumber"
                  value={formData.contactPersonNumber}
                  onChange={handleInputChange}
                  placeholder="e.g 074 567 345"
                />
                <p className="text-xs text-gray-600">
                  The person expected to receive the card machine(s) upon delivery
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate" className="text-sm text-gray-700">
                  Delivery date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-between text-left font-normal rounded-lg border border-neutral-700 hover:border-primary focus:border-primary focus:outline-none bg-background px-3 py-2 text-sm md:text-base text-secondary",
                        !formData.deliveryDate && "text-neutral-700"
                      )}
                    >
                      {formData.deliveryDate ? (
                        format(formData.deliveryDate, "PPP")
                      ) : (
                        <span>Select</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.deliveryDate}
                      onSelect={(date) => 
                        setFormData(prev => ({
                          ...prev,
                          deliveryDate: date
                        }))
                      }
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
                <div className="flex flex-col md:flex-row gap-3 !mt-12">
                    <Button variant="outline" className="w-full md:max-w-40">Back</Button>
                    <Button className="w-full md:max-w-40">Next</Button>
                </div>
      </div>
    </div>
  );
}