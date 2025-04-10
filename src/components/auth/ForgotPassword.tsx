import { useState } from "react";
import Input from "../form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordMail, forgotPasswordOtp, resetPassword } from "../../api/tenants";
import ThemeTogglerTwo from "../common/ThemeTogglerTwo";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
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
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    },
  });

  // resend otp api
  const resendOtpMutation = useMutation({
     mutationFn: forgotPasswordMail,
       onSuccess: (response) => {
         console.log("resend otp succes", response);
         toast.success('OTP Sent!')
       },
       onError: (error: any) => {
         console.log("resend otp error", error);
         toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
       },
     });

  // handles reset password value
  const handleResetPasswordValue = (e: any) => {
    const { name, value } = e.target;
    setResetPasswordValue((prev) => ({ ...prev, [name]: value }));
  };

  // forgot pass otp button
  const handleForgotPasswordOtp = () => {
    if (!otp.trim()) return toast.error("Please enter OTP");

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
      resendOtpMutation.mutateAsync({ email: localStorage.getItem('lactation-forgot-email ') });    
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="border border-gray-600 rounded-2xl p-8 max-w-1/3 bg-white">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-gray-700 mb-10">
          The one-time password is sent to your registered email.
        </p>

        {/* enter otp */}
        {!isOtpVerified && (
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP"
            className="mb-5 border border-black"
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
                type={resetPasswordShow.confirmPassword ? "text" : "password"}
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
          <div className="flex justify-between items-center">

          <button
            onClick={handleForgotPasswordOtp}
            disabled={forgotPasswordOtpMutation.isPending}
            className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            Verify OTP
          </button>
          <button
          onClick={handleResendOtp}
           className="underline underline-offset-2 cursor-pointer text-gray-700">Resend code</button>
            </div>
        )}

        {/* reset password button */}
        {isOtpVerified && (
          <button
            onClick={handleResetPassword}
            disabled={resetPasswordMutation.isPending}
            className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
        )}
      </div>
      <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
