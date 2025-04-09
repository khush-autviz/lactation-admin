import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordMail,
  tenantLogin,
  forgotPasswordOtp,
} from "../../api/tenants";
import { Modal } from "../ui/modal";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [forgotModalOpen, setforgotModalOpen] = useState(false);
  const [forgotEmail, setforgotEmail] = useState("");
  const [isotpSent, setisotpSent] = useState(false);
  const [isOtpVerified, setisOtpVerified] = useState(false);
  const [otp, setotp] = useState("");
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  // login api
  const tenantLoginMutation = useMutation({
    mutationFn: tenantLogin,
    onSuccess: (response) => {
      console.log("tenantlog sicess", response);
      setformData({ email: "", password: "" });
    },
    onError: (error: any) => {
      console.log("tenant log eror", error);
    },
  });

  // forgotpassword mail api
  const forgotPasswordMailMutation = useMutation({
    mutationFn: forgotPasswordMail,
    onSuccess: (response) => {
      console.log("forgot pass succes", response);
      setisotpSent(true);
    },
    onError: (error) => {
      console.log("forgot pass error", error);
    },
  });

  //forgotpassword otp api
  const forgotPasswordOtpMutation = useMutation({
    mutationFn: forgotPasswordOtp,
    onSuccess: (response) => {
      console.log("forgot pass otp suchess", response);
    },
    onError: (error: any) => {
      console.log("forgotpass otp error", error);
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: any) => {
    // const tenantDomain = "tenant1.lvh.me:5173"; // hardcoded for now
    // window.location.href = `http://${tenantDomain}`;

    e.preventDefault();
    if (formData.email === "" || formData.password === "") {
      console.log("fill fields");

      return;
    }
    tenantLoginMutation.mutateAsync(formData);
  };

  const handleForgotPasswordMail = () => {
    const forgotPasswordMailData = {
      email: forgotEmail,
    };
    forgotPasswordMailMutation.mutateAsync(forgotPasswordMailData);
  };

  const handleForgotPasswordOtp = () => {
    const forgotPasswordOtpData = {
      email: forgotEmail,
      otp,
    };

    forgotPasswordOtpMutation.mutateAsync(forgotPasswordOtpData);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@gmail.com"
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={handleChange}
                      value={formData.password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <span
                    // to="/reset-password"
                    onClick={() => setforgotModalOpen(true)}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer"
                  >
                    Forgot password?
                  </span>
                </div>
                <div>
                  {/* <Button onClick={(e: any) => handleLogin(e)} className="w-full" size="sm">
                    Sign in
                  </Button> */}
                  <button
                    onClick={handleLogin}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* forgot password modal */}
      {forgotModalOpen && (
        <Modal
          isOpen={forgotModalOpen}
          onClose={() => setforgotModalOpen(false)}
          showCloseButton={true}
          className="max-w-lg p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold mb-5">Forgot Email?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-5">
            You will receive an OTP on the email.
          </p>

          {/* enter mail */}
          {!isotpSent && (
            <Input
              type="email"
              value={forgotEmail}
              onChange={(e) => setforgotEmail(e.target.value)}
              placeholder="info@gmail.com"
              className="mb-5"
            />
          )}

          {/* enter otp */}
          {isotpSent && !isOtpVerified && (
            <Input
              value={otp}
              onChange={(e) => setotp(e.target.value)}
              placeholder="Enter the OTP"
              className="mb-5 border border-black"
            />
          )}

          {/* enter new password */}
          {isotpSent && isOtpVerified && (
            <Input
              value={otp}
              onChange={(e) => setotp(e.target.value)}
              placeholder="Enter the OTP"
              className="mb-5 border border-black"
            />
          )}

          {/* mail and otp button */}
          {!isOtpVerified && (
            <button
              onClick={
                !isotpSent ? handleForgotPasswordMail : handleForgotPasswordOtp
              }
              className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isotpSent ? "Verify OTP" : "Send   "}
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}
