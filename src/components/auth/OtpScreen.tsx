import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useMutation } from "@tanstack/react-query";
import { resendOtp, verifyOtp } from "../../api/createOrganisation";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader } from "../ui/loader";
import ComponentCard from "../common/ComponentCard";
import ThemeTogglerTwo from "../common/ThemeTogglerTwo";

export default function OtpScreen() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  // const [resetKey, setresetKey] = useState(0);
  const user = useAuthStore.getState().user;

  const navigate = useNavigate();

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
      toast.success("OTP Verified!");
      navigate("/");
    },
    onError: (error: any) => {
      console.log("otp verification error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  // POST Resend Otp
  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (response) => {
      console.log("resend otp", response);
      toast.success("OTP Sent!");
      // setresetKey((prev) => prev + 1);
    },
    onError: (error: any) => {
      console.log("resnd otp error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
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
    if (otp.every((digit) => digit !== "")) {
      const otpData = {
        email: useAuthStore.getState().user?.email,
        otp_code: otp.join(""),
      };

      otpVerificationMutation.mutateAsync(otpData);
    } else return toast.warning("Please enter the OTP");
  };

  const handleResendOtp = () => {
    const resendOtpData = {
      email: useAuthStore.getState().user?.email,
    };
    resendOtpMutation.mutateAsync(resendOtpData);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 ">
      {(otpVerificationMutation.isPending || resendOtpMutation.isPending) && (
        <Loader />
      )}
      <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md w-1/2">
        Enter the OTP sent to your Email.
      </h1>
      <div className=" rounded-2xl w-1/3 bg-white">
        <ComponentCard
          title="Lactation"
          desc="The OTP is valid for 10 minutes."
        >
          <div className="space-y-6">
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
              disabled={otpVerificationMutation.isPending}
              className="flex items-center justify-center w-full mb-8 mt-4 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
            >
              Verify
            </button>

            {/* Resend OTP */}
            <div className="mt-5">
              <p className="text-md font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Did not get OTP? {""}
                <button
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer"
                  onClick={handleResendOtp}
                  disabled={resendOtpMutation.isPending}
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
          {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
            <ThemeTogglerTwo />
          </div> */}
        </ComponentCard>
      </div>
    </div>
  );
}
