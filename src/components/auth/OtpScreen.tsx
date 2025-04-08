import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../../api/createOrganisation";

export default function OtpScreen() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // post OTP verification
  const OtpVerificationMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
        console.log('otp vireified', response.data);
    },
    onError: (error: any) => {
        console.log("otp verification error", error);
    }
  })


  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleOtp(newOtp);
    }
  };

  const handleKeyBackspace = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtp = async (otpValue: any) => {
    const otpData = {
      email: useAuthStore.getState().user?.email,
      otp_code: otpValue.join(""),
    };

    OtpVerificationMutation.mutateAsync(otpData)
  };

  return (
    <div>
      {otp.map((item, index) => {
        return (
          <input
            type="text"
            value={item}
            className="w-12 h-12 me-2 text-center border border-gray-300 rounded-lg shadow-sm text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            inputMode="numeric"
            maxLength={1}
            key={index}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyBackspace(e, index)}
            ref={(el: any) => (inputsRef.current[index] = el)}
          />
        );
      })}
    </div>
  );
}
