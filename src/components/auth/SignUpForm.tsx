import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { Modal } from "../ui/modal";
import OtpScreen from "./OtpScreen";

export default function SignUpForm() {

  const navigate = useNavigate()

  const [isChecked, setIsChecked] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [otpModalOpen, setOtpModalOpen] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchTenant = async () => {
      const response = await axios.get(
        "http://localhost:8000/public/tenant-types/"
      );
      setTenants(response.data);
    };
    fetchTenant();
  }, []);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e: any) => {
    e.preventDefault();
    // Check if any field is empty
    const isFormValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );

    if (!isFormValid) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/public/register/", formData)
      console.log('Success:', response.data.data);
      useAuthStore.getState().setUser(response.data.data)
      setOtpModalOpen(true)
    } catch (error: any) {
      if (error.response) {
        console.log('Data:', error.response.data);          // the error message from the server
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
    
  };

  return (
    
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <Modal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        showCloseButton={true}
        className="max-w-lg mx-auto p-6" // customize your modal content width/padding
      >
        <h2 className="text-xl mb-3 font-semibold text-gray-900 dark:text-white mb-4">OTP Verification</h2>
        <div className="text-gray-700 dark:text-gray-300">
          <OtpScreen />
        </div >
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setOtpModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
          >
            Close
          </button>
        </div>
      </Modal>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-4">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Register your Organisation
            </h1>
          </div>
          <div>
            <form onSubmit={handleRegistration}>
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
                      type="text"
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
                      // defaultValue=""
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 bg-white"
                    >
                      <option value="" disabled>
                        Select a tenant
                      </option>
                      {tenants.map((item) => {
                        return <option key={item.id} value={item.id}>{item.name}</option>;
                      })}
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
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Register
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
