'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const [timer, setTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    if (canResend) {
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '']);
      inputRefs.current[0]?.focus();
      // Add your resend OTP logic here
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 5) {
      console.log('Submitted OTP:', otpValue);
      // Add your submit logic here
    }
  };

  const handleBack = () => {
    console.log('Back button clicked');
    // Add your back navigation logic here
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
            SMS: <span className="font-medium">277l***35**</span>
          </p>
        </div>

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
            disabled={!canResend}
            className={`text-sm ${
              canResend
                ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
                : 'text-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            RESEND OTP
          </button>

          <p className="text-sm text-gray-600 mt-3">
            You'll be able to resend your OTP in:{' '}
            <span className="text-blue-600 font-medium">{timer}s</span>
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <Button className='w-full sm:w-1/6'
            onClick={handleBack}
            variant="outline">
            BACK
          </Button>
          <Button className='w-full sm:w-1/6'
            onClick={handleSubmit}
            disabled={otp.join('').length !== 5}>
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;