import { use, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useMutation } from "@tanstack/react-query";
import { resendOtp, verifyOtp } from "../../api/createOrganisation";
import Timer from "../common/Timer";
// import ThemeTogglerTwo from "../common/ThemeTogglerTwo";

export default function OtpScreen() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [resetKey, setresetKey] = useState(0);
  const user = useAuthStore.getState().user;

  console.log("vsd", user);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // post OTP verification
  const otpVerificationMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      console.log("otp verified", response.data);
      if (user) {
        useAuthStore.getState().setUser({
          ...user,
          isOtpVerified: true,
        });
      }
    },
    onError: (error: any) => {
      console.log("otp verification error", error);
    },
  });

  // POST Resend Otp
  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (response) => {
      console.log("resend otp", response);
      setresetKey((prev) => prev + 1);
    },
    onError: (error: any) => {
      console.log("resnd otp error", error);
    },
  });

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyBackspace = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();

    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);

    // Move focus to last field
    inputsRef.current[5]?.focus();
  };

  const handleOtp = async () => {
    console.log("hello");

    if (otp.every((digit) => digit !== "")) {
      const otpData = {
        email: useAuthStore.getState().user?.email,
        otp_code: otp.join(""),
      };

      otpVerificationMutation.mutateAsync(otpData);
    } else return;
  };

  const handleResendOtp = () => {
    const resendOtpData = {
      email: useAuthStore.getState().user?.email,
    };
    resendOtpMutation.mutateAsync(resendOtpData);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="border border-gray-600 rounded-2xl p-8 max-w-1/3 bg-white">
        <h1 className="text-2xl font-bold mb-2">OTP Verification</h1>
        <p className="text-gray-700 mb-10">
          Enter the 6-digit code sent to your email. The OTP is valid for 10
          minutes.
        </p>
        {otp.map((item, index) => {
          return (
            <input
              type="text"
              value={item}
              className="w-12 h-12 me-2 text-center border border-gray-300 rounded-lg shadow-sm text-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              inputMode="numeric"
              maxLength={1}
              key={index}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyBackspace(e, index)}
              onPaste={(e) => handlePaste(e)}
              ref={(el: any) => (inputsRef.current[index] = el)}
            />
          );
        })}

        {/* Button */}
        <button
          onClick={handleOtp}
          className="flex items-center justify-center w-full my-8 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
        >
          Verify
        </button>

        {/* Resend OTP */}
        <div className="mt-5">
          <span>Did not get OTP?</span>
          <span
            onClick={handleResendOtp}
            className="ms-1 cursor-pointer px-2 underline underline-offset-2 py-1 text-sm font-medium text-black transition"
          >
            Resend code
          </span>
          <span>
            in <Timer duration={10} resetKey={resetKey} />
          </span>
        </div>
      </div>
      {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                <ThemeTogglerTwo />
              </div> */}
    </div>
  );
}
