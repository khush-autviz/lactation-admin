import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordMail, tenantLogin } from "../../api/tenants";
import { Modal } from "../ui/modal";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [forgotModalOpen, setforgotModalOpen] = useState(false);
  const [forgotEmail, setforgotEmail] = useState("");
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const globalState = useAuthStore.getState()

// fetches subdomain
const getSubdomain = () => {
  const hostname = window.location.hostname; // e.g. "test.example.com"
  const parts = hostname.split(".");
  return parts[0]
}
  
  // validate email
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };



  // login api
  const tenantLoginMutation = useMutation({
    mutationFn: tenantLogin,
    onSuccess: (response) => {
      toast.success('login')
      console.log("tenantlog sicess", response);
      globalState.setUser(response.data.data.user);
      globalState.setToken(response.data.data.access);
      setformData({ email: "", password: "" });
      window.location.href = `http://${getSubdomain()}.localhost:5173/profile`;
    },
    onError: (error: any) => {
      console.log("tenant log eror", error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    },
  });

  // forgotpassword mail api
  const forgotPasswordMailMutation = useMutation({
    mutationFn: forgotPasswordMail,
    onSuccess: (response) => {
      console.log("forgot pass succes", response);
      localStorage.setItem("lactation-forgot-email", forgotEmail);
      navigate("/forgot-password");
    },
    onError: (error: any) => {
      console.log("forgot pass error", error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    },
  });

  // handles form data
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  // login button
  const handleLogin =  (e: any) => {
    e.preventDefault();
    const cleanedEmail = formData.email.trim().toLowerCase();
    if (cleanedEmail === "" || formData.password === "") {
      toast.warning("Empty Fields");
      return;
    }

    if (!isValidEmail(cleanedEmail)) {
      toast.warning("Please enter a valid email address");
      return;
    }

       tenantLoginMutation.mutateAsync({...formData, email: cleanedEmail});

  };

  // forgot pass send button
  const handleForgotPasswordMail = () => {
    const cleanedEmail = forgotEmail.trim().toLowerCase();

    if (!isValidEmail(cleanedEmail)) {
      toast.warning("Please enter a valid email address");
      return;
    }

      forgotPasswordMailMutation.mutateAsync({ email: cleanedEmail });
    
  };

  return (
    <div className="flex flex-col flex-1">
      {(tenantLoginMutation.isPending || forgotPasswordMailMutation.isPending) && <Loader />}
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
                    placeholder="Enter your email"
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
                    onClick={() => setforgotModalOpen(true)}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 cursor-pointer"
                  >
                    Forgot password?
                  </span>
                </div>
                <div>
                  <button
                    onClick={handleLogin}
                    disabled={tenantLoginMutation.isPending}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
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
            The one-time password will be sent to your registered email.
          </p>

          {/* enter mail */}
          <Input
            type="email"
            value={forgotEmail}
            onChange={(e) => setforgotEmail(e.target.value)}
            placeholder="Enter your email"
            className="mb-5"
          />

          {/* mail and otp button */}
          <button
            onClick={handleForgotPasswordMail}
            className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </Modal>
      )}
    </div>
  );
}
