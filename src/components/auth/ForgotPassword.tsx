import { useState } from "react";
import Input from "../form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordMail,
  forgotPasswordOtp,
  resetPassword,
} from "../../api/tenants";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import ComponentCard from "../common/ComponentCard";
import { Loader } from "../ui/loader";

export default function ForgotPassword() {
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetPasswordValue, setResetPasswordValue] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [resetPasswordShow, setResetPasswordShow] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  
  
  //forgotpassword otp api
  const forgotPasswordOtpMutation = useMutation({
    mutationFn: forgotPasswordOtp,
    onSuccess: (response) => {
      console.log("forgot pass otp suchess", response);
      toast.success("OTP verified!");
      setIsOtpVerified(true);
      localStorage.setItem(
        "lactation-reset-token",
        response.data.data.reset_token
      );
    },
    onError: (error: any) => {
      console.log("forgotpass otp error", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    },
  });
  
  // reset password api
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success("Password changed!");
      console.log("reset pass success", response);
      localStorage.removeItem("lactation-reset-token");
      localStorage.removeItem("lactation-forgot-email");
      navigate("/signin");
    },
    onError: (error: any) => {
      console.log("reset pass error", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    },
  });
  
  // resend otp api
  const resendOtpMutation = useMutation({
    mutationFn: forgotPasswordMail,
    onSuccess: (response) => {
      console.log("resend otp succes", response);
      toast.success("OTP Sent!");
    },
    onError: (error: any) => {
      console.log("resend otp error", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    },
  });

  // handles reset password value
  const handleResetPasswordValue = (e: any) => {
    const { name, value } = e.target;
    setResetPasswordValue((prev) => ({ ...prev, [name]: value }));
  };

  // forgot pass otp button
  const handleForgotPasswordOtp = () => {
    // if (!otp.trim()) return toast.error("Please enter OTP");

    if (otp.length !== 4) return toast.warning('Please enter a 4 digit OTP!')

    forgotPasswordOtpMutation.mutateAsync({
      email: localStorage.getItem("lactation-forgot-email"),
      otp,
    });
  };

  // reset pass button
  const handleResetPassword = () => {
    if (
      !resetPasswordValue.newPassword ||
      !resetPasswordValue.confirmPassword
    ) {
      return toast.error("Please fill in both password fields");
    }

    if (resetPasswordValue.newPassword !== resetPasswordValue.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const resetPasswordData = {
      new_password: resetPasswordValue.newPassword,
      confirm_password: resetPasswordValue.confirmPassword,
      email: localStorage.getItem("lactation-forgot-email"),
      reset_token: localStorage.getItem("lactation-reset-token"),
    };

    resetPasswordMutation.mutateAsync(resetPasswordData);
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutateAsync({
      email: localStorage.getItem("lactation-forgot-email "),
    });
  };

  const handleChange = (e: any) => {
    const val = e.target.value
    if (/^\d{0,4}$/.test(val)) {
      setOtp(val);
    }
  }
 
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      {(forgotPasswordOtpMutation.isPending || resendOtpMutation.isPending || resetPasswordMutation.isPending) && <Loader />}
      <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md w-1/2">
        Enter the OTP sent to your registered Email.
      </h1>
      <div className=" rounded-2xl w-1/3 bg-white">
        <ComponentCard
          title="Forgot Password"
          desc="The OTP is valid for 10 minutes."
        >
          <div className="space-y-6">
            {/* enter otp */}
            {!isOtpVerified && (
              <Input
                value={otp}
                onChange={handleChange}
                placeholder="Enter the OTP"
                className="mb-4 border border-black"
              />
            )}

            {/* enter new password */}
            {isOtpVerified && (
              <>
                <div className="relative mb-5">
                  <Input
                    name="newPassword"
                    type={resetPasswordShow.newPassword ? "text" : "password"}
                    placeholder="New password"
                    onChange={handleResetPasswordValue}
                    value={resetPasswordValue.newPassword}
                  />
                  <span
                    onClick={() =>
                      setResetPasswordShow((prev) => ({
                        ...prev,
                        newPassword: !prev.newPassword,
                      }))
                    }
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {resetPasswordShow.newPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                <div className="relative mb-5">
                  <Input
                    name="confirmPassword"
                    type={
                      resetPasswordShow.confirmPassword ? "text" : "password"
                    }
                    placeholder="Confirm password"
                    onChange={handleResetPasswordValue}
                    value={resetPasswordValue.confirmPassword}
                  />
                  <span
                    onClick={() =>
                      setResetPasswordShow((prev) => ({
                        ...prev,
                        confirmPassword: !prev.confirmPassword,
                      }))
                    }
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {resetPasswordShow.confirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </>
            )}

            {/* mail and otp button */}
            {!isOtpVerified && (
              <>
                <button
                  onClick={handleForgotPasswordOtp}
                  disabled={forgotPasswordOtpMutation.isPending}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  Verify OTP
                </button>
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
              </>
            )}

            {/* reset password button */}
            {isOtpVerified && (
              <button
                onClick={handleResetPassword}
                disabled={resetPasswordMutation.isPending}
                className="flex items-center justify-center w-full px-4 mt-8 mb-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              >
                Reset Password
              </button>
            )}
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
