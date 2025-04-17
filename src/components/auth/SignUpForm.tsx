import { useState } from "react";
import { Link, useNavigate } from "react-router";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useAuthStore } from "../../store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getVenueTypes, registerCompany } from "../../api/createOrganisation";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [formData, setformData] = useState({
    company_name: "",
    tenant_type: "",
    email: "",
    contact_number: "",
    admin_first_name: "",
    admin_last_name: "",
    admin_position: "",
    domain_url: "",
  });


  // fetching tenant types
  const { data: venueTypesData } = useQuery({
    queryKey: ["venueTypes"],
    queryFn: getVenueTypes,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // POST registering company
  const companyRegisterMutation = useMutation({
    mutationFn: registerCompany,
    onSuccess: (response) => {
      console.log("success", response);
      useAuthStore
        .getState()
        .setUser({ ...response.data.data, isOtpVerified: false });
      // setOtpModalOpen(true)
      navigate("/verify-otp");
      toast.success("OTP Sent!");
    },
    onError: (error: any) => {
      console.log("company creation error", error.message);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  // handle form changes
  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "contact_number" && !/^\d*$/.test(value)) {
      return; // skip if not digits
    }
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  // register button
  const handleRegistration = async (e: any) => {
    e.preventDefault();

    // Check if any field is empty
    const isFormValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );

    if (!isFormValid) {
      toast.warning("Please Fill all the Fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(formData.email)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(formData.contact_number)) {
      toast.warning("Contact number should contain 10 digits.");
      return;
    }

    if (!isChecked) {
      toast.warning("Please agree to the terms & conditions");
      return;
    }

    companyRegisterMutation.mutateAsync(formData);
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      {companyRegisterMutation.isPending && <Loader />}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-4">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Register your Organisation
            </h1>
          </div>
          <div>
            <form>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter your company first name"
                      name="admin_first_name"
                      value={formData.admin_first_name}
                      onChange={handleFormChange}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="admin_last_name"
                      value={formData.admin_last_name}
                      onChange={handleFormChange}
                      placeholder="Enter your company last name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Contact number --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Contact Number<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleFormChange}
                      placeholder="Enter your contact number"
                    />
                  </div>
                  {/* <!-- position --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Position<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="admin_position"
                      value={formData.admin_position}
                      onChange={handleFormChange}
                      placeholder="Enter your position"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Email --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  {/* <!-- Company Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Company Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleFormChange}
                      placeholder="Enter your Company Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Tenant type --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Tenant type<span className="text-error-500">*</span>
                    </Label>
                    <select
                      name="tenant_type"
                      value={formData.tenant_type}
                      onChange={handleFormChange}
                      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                        formData.tenant_type
                          ? "text-gray-800 dark:text-white/90"
                          : "text-gray-400 dark:text-blue-400"
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-gray-700 dark:bg-gray-900 dark:text-blue-400"
                      >
                        Select a tenant
                      </option>
                      {venueTypesData?.data?.map((item: any) => (
                        <option
                          key={item.id}
                          value={item.id}
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          {item.name}
                        </option>
                      ))}
                    </select> 
                  </div>
                  {/* <!-- Domain Url --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Domain Url<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="domain_url"
                      value={formData.domain_url}
                      onChange={handleFormChange}
                      placeholder="Enter your Domain Url"
                    />
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <button
                  onClick={handleRegistration}
                  disabled={companyRegisterMutation.isPending}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  Register
                </button>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-md font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Find you domain
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
