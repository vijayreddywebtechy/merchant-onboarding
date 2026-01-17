"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import faceScan from "@/assets/images/general/face_scan.png";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

type Props = {
  onBack?: () => void;
  onVerificationComplete?: () => void;
};

const Instructions = ({ onBack, onVerificationComplete }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);

  // Listen for messages from the iIdentifii iframe
  useEffect(() => {
    if (verificationUrl && onVerificationComplete) {
      const handleMessage = (event: MessageEvent) => {
        // Check if the message is from iIdentifii
        if (event.origin === 'https://alphaweb.iidentifii.com' || event.origin === 'https://web.iidentifii.com') {
          console.log('Received message from iIdentifii:', event.data);
          // Assume any message indicates verification completion
          // You may need to check event.data for specific completion signals
          // onVerificationComplete();
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [verificationUrl, onVerificationComplete]);

  const handleScan = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get data from localStorage
      const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
      const idNumber = storedData.businessDetails?.directorId || "";
      
      // Generate Salesforce-like clientReference if not already present
      let clientReference = storedData.applicationId;
      if (!clientReference) {
        clientReference = `a6h9M${Date.now().toString().substring(0, 13)}QAO`;
        storedData.applicationId = clientReference;
        localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));
      }

      if (!idNumber) {
        throw new Error("Director ID not found. Please go back and complete the form.");
      }

      console.log('Initiating face verification for ID:', idNumber);
      console.log('Client Reference:', clientReference);

      // Call API to initialize iIdentifii
      const response = await fetch('/api/iidentifii-init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idNumber,
          clientReference
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize face verification');
      }

      console.log('iIdentifii initialization successful:', data);

      // Store the response
      storedData.iidentifiiResponse = data;
      localStorage.setItem("merchantOnboardingData", JSON.stringify(storedData));

      // Check if we got a token in the response
      if (data.message && typeof data.message === 'string' && data.message.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // This looks like a GUID token, set URL for iframe
        const token = data.message;
        const iidentifiiUrl = `https://alphaweb.iidentifii.com?token=${token}`;
        console.log('Loading iIdentifii in iframe with URL:', iidentifiiUrl);
        setVerificationUrl(iidentifiiUrl);
      } else if (data.verificationUrl || data.url) {
        // Fallback to URL-based iframe if available
        setVerificationUrl(data.verificationUrl || data.url);
      } else {
        // If no token or URL is provided, show success message
        console.log('Verification initialized successfully');
        // You may want to show a success message or handle differently
      }
    } catch (err: any) {
      console.error('Face verification error:', err);
      setError(err.message || 'Failed to start face verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <>
      <LoadingOverlay message="Initializing face verification..." isVisible={isLoading} />
      
      <div className="max-w-4xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {verificationUrl ? (
          // Show iframe with iIdentifii verification
          <div className="w-full">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Face Verification
              </h3>
              <p className="text-sm text-neutral-600">
                Please complete the face verification process below.
              </p>
            </div>
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <iframe
                src={verificationUrl}
                className="w-full h-[600px] border-0"
                title="Face Verification"
                allow="camera; microphone"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setVerificationUrl(null)}
              >
                Back to Instructions
              </Button>
            </div>
          </div>
        ) : (
          // Show instructions
          <>
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
                  <Button 
                    variant="outline" 
                    className="w-60"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    className="w-60"
                    onClick={handleScan}
                    disabled={isLoading}
                  >
                    Scan
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
  

export default Instructions;
