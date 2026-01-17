'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOnboardingSubmit } from '@/hooks/useOnboardingSubmit';

const OTP_MESSAGES: Record<string, string> = {
  "0000": "Success",
  "2001": "Technical error. Please try again later",
  "1001": "Invalid OTP",
  "1021": "OTP regenerated after 3 invalid attempts",
  "1022": "OTP regenerated after 3 invalid attempts",
  "1023": "Your OTP has expired and a new one has been sent",
  "1025": "No OTP specified",
  "1026": "You have exceeded the number of attempts. Please contact your branch.",
  "1030": "System error",
};

const getOtpMessage = (code: string) => {
  return OTP_MESSAGES[code] || "An unexpected error occurred.";
};

const OTPVerification: React.FC = () => {
  const router = useRouter();
  const { submitPreApplicationOnly, isLoading: isSubmittingPreApp, error: preAppError } = useOnboardingSubmit();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpMessage, setOtpMessage] = useState<string>("");
  const [otpQName, setOtpQName] = useState<string>("");
  const [mobile, setMobile] = useState<{ code: string; number: string }>({ code: "27", number: "" });
  const [maskedNumber, setMaskedNumber] = useState<string>("");
  const otpSentRef = useRef<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get mobile number from localStorage
    const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
    const cellphone = storedData.businessDetails?.cellphone || "";
    
    if (cellphone && !otpSentRef.current) {
      // Remove leading 0 and use country code 27
      const number = cellphone.startsWith("0") ? cellphone.substring(1) : cellphone;
      setMobile({ code: "27", number });
      
      // Mask the number for display (show first 2 and last 2 digits)
      const masked = number.replace(/^(\d{2})(\d+)(\d{2})$/, "$1***$3");
      setMaskedNumber(`+27${masked}`);
      
      otpSentRef.current = true;
      
      // Auto-generate token and send OTP
      generateToken(number);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const generateToken = async (number?: string) => {
    setIsLoading(true);
    setOtpMessage("");

    try {
      const response = await fetch("/api/otp-token", {
        method: "POST",
      });

      const data = await response.json();

      if (data?.access_token) {
        localStorage.setItem("otp_access_token", data.access_token);
        
        // Store token info with timestamp
        const tokenInfo = {
          access_token: data.access_token,
          timestamp: Date.now(),
        };
        localStorage.setItem("otp_token_data", JSON.stringify(tokenInfo));
        
        // Send OTP
        await sendOtp(data.access_token, number || mobile.number);
      } else {
        setOtpMessage("Failed to generate token. Please try again.");
      }
    } catch (error) {
      console.error("Error generating token:", error);
      setOtpMessage("Failed to generate token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (token: string, number: string) => {
    setIsLoading(true);
    setOtpMessage("");

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobile: {
            code: mobile.code,
            number: number,
          },
        }),
      });

      const data = await response.text();

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const responseCode = xmlDoc.getElementsByTagName("vers_v_response_code")[0]?.textContent;
      const cellNo = xmlDoc.getElementsByTagName("otp_cell_no")[0]?.textContent;
      const qName = xmlDoc.getElementsByTagName("otp_qname")[0]?.textContent;

      if (responseCode === "0000") {
        setOtpMessage(`OTP sent successfully to ${cellNo}`);
        setOtpQName(qName || "");
        
        // Store OTP session data
        const otpSessionData = {
          qName: qName || "",
          cellNo: cellNo || "",
          timestamp: Date.now(),
        };
        localStorage.setItem("otp_session_data", JSON.stringify(otpSessionData));
      } else {
        setOtpMessage(getOtpMessage(responseCode || ""));
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpMessage("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 5) {
      setOtpMessage("Please enter a valid 5-digit OTP");
      return;
    }

    setIsLoading(true);
    setOtpMessage("");

    try {
      const token = localStorage.getItem("otp_access_token");
      
      if (!token) {
        setOtpMessage("Session expired. Please resend OTP.");
        return;
      }

      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobile: mobile,
          otpValue: otpValue,
          otpQName: otpQName,
        }),
      });

      const data = await response.text();

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const responseCode = xmlDoc.getElementsByTagName("vers_v_response_code")[0]?.textContent;

      if (responseCode === "0000") {
        // Store verification success
        const verificationData = {
          verified: true,
          timestamp: Date.now(),
        };
        localStorage.setItem("otp_verification_data", JSON.stringify(verificationData));
        
        setOtpMessage("OTP verified successfully!");
        
        // Check if user came from customer selection with a CUSTOMER role
        const storedData = JSON.parse(localStorage.getItem("merchantOnboardingData") || "{}");
        const firstCustomer = storedData.customersData?.[0];
        const hasCustomerRole = firstCustomer?.customerDetails?.customer?.customerRole?.some((role: any) => role.roleX === "CUSTOMER");
        
        // Navigate based on context
        if (hasCustomerRole) {
          // User has CUSTOMER role, submit pre-application and go to your-companies
          router.push("/account-onboarding/your-companies");
          // setTimeout(async () => {
          //   await submitPreApplicationOnly();
          //   // Navigate to your-companies after pre-application
          // }, 1500);
        } else {
          // User doesn't have CUSTOMER role, just submit pre-application
          // setTimeout(async () => {
          //   await submitPreApplicationOnly();
          // }, 1000);
        }
      } else {
        setOtpMessage(getOtpMessage(responseCode || ""));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpMessage("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 5);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 5) newOtp[idx] = char;
    });
    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedData.length, 5) - 1;
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleResend = () => {
    if (canResend && !isLoading) {
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '']);
      setOtpMessage("");
      otpSentRef.current = false;
      inputRefs.current[0]?.focus();
      generateToken(mobile.number);
    }
  };

  const handleSubmit = () => {
    verifyOtp();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="page-container py-8 md:py-12">
      <div className="bg-background px-4 py-8 sm:p-10 md:p-12 rounded-xl">
        <div className="mb-8">
          <span className="block text-sm text-gray-600 mb-4">Verify your identity</span>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 mb-6">OTP verification</h1>
          <p className="text-gray-700 mb-6">
            Enter the One-Time PIN (OTP) we sent to your cellphone number. Never share your OTP with anyone.
          </p>
          <p className="text-gray-700">
            SMS: <span className="font-medium">{maskedNumber || "***"}</span>
          </p>
        </div>

        {otpMessage && (
          <div
            className={`mb-4 p-3 rounded ${
              otpMessage.includes("success") || otpMessage.includes("sent successfully")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {otpMessage}
          </div>
        )}

        {preAppError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
            {preAppError}
          </div>
        )}

        <div className="mb-6">
          <div className="flex gap-3 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-16 h-16 text-center text-2xl font-semibold"
              />
            ))}
          </div>

          <button
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`text-sm ${
              canResend && !isLoading
                ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            {isLoading ? "SENDING..." : "RESEND OTP"}
          </button>

          <p className="text-sm text-gray-600 mt-3">
            You'll be able to resend your OTP in:{' '}
            <span className="text-blue-600 font-medium">{timer}s</span>
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <Button className='w-full sm:w-1/6'
            onClick={handleBack}
            variant="outline"
            disabled={isLoading}>
            BACK
          </Button>
          <Button className='w-full sm:w-1/6'
            onClick={handleSubmit}
            disabled={otp.join('').length !== 5 || isLoading || isSubmittingPreApp}>
            {isSubmittingPreApp ? "SUBMITTING..." : isLoading ? "VERIFYING..." : "SUBMIT"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;