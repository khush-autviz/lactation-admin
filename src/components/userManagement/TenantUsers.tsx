import { useState } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon, PencilIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTenantUser,
  getAllTenants,
  getTenantRole,
} from "../../api/tenants";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader } from "../ui/loader";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function TenantUsers() {
  const [isModalOpen, setisModalOpen] = useState(false);
  // const [selectedRoleId, setselectedRoleId] = useState<number | null>(null);
  const [isOpen, setisOpen] = useState(false);
  const [mode, setmode] = useState("Create");
  const queryClient = useQueryClient();

  const [formData, setformData] = useState({
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    position_in_company: "",
    role: "",
  });
  
  const [editFormData, seteditFormData] = useState({
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    position_in_company: "",
    role: "",
  });

  //handle form changes
  const handleFormChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "phone_number" && !/^\d*$/.test(value)) {
      return; // skip if not digits
    }
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  // handle Edit form changes
  const handleEditFormChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "phone_number" && !/^\d*$/.test(value)) {
      return; // skip if not digits
    }
    seteditFormData((prev) => ({ ...prev, [name]: value }));
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

    if (!phoneRegex.test(formData.phone_number)) {
      toast.warning("Contact number should contain 10 digits.");
      return;
    }
    createTenantMutation.mutateAsync(formData);
  };

  // fetching tenants roles
  const { data: tenantsRole } = useQuery({
    queryKey: ["tenantRoles"],
    queryFn: getTenantRole,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // get all tenants mutation
  const { data: allTenants } = useQuery({
    queryKey: ["AllTenants"],
    queryFn: getAllTenants,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // create tenant user mutation
  const createTenantMutation = useMutation({
    mutationFn: createTenantUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["AllTenants"] });
      console.log("create tenant user success", response);
      toast.success("Tenant Created!");
    },
    onError: (error: any) => {
      console.log("create tenant user error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  // edit button
  const handleEdit = (id: any) => {
    setisModalOpen(true)
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tenants" />
      {createTenantMutation.isPending && <Loader />}
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 ">
        <div className=" w-full ">
          <div className="flex justify-between items-center">
            <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              {mode}
            </h3>
            <div className="relative inline-block">
              <button
                className="dropdown-toggle"
                onClick={() => setisOpen(true)}
              >
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
              </button>
              <Dropdown
                isOpen={isOpen}
                onClose={() => setisOpen(false)}
                className="w-40 p-2"
              >
                <DropdownItem
                  onItemClick={() => setmode("Create")}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Create
                </DropdownItem>
                <DropdownItem
                  onItemClick={() => setmode("Show")}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Show
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
          {mode === "Create" && (
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
                      placeholder="Enter the first name"
                      name="first_name"
                      value={formData.first_name}
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
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleFormChange}
                      placeholder="Enter the last name"
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
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleFormChange}
                      placeholder="Enter the contact number"
                    />
                  </div>
                  {/* <!-- position --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Position<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="position_in_company"
                      value={formData.position_in_company}
                      onChange={handleFormChange}
                      placeholder="Enter the position"
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
                      placeholder="Enter the email"
                    />
                  </div>
                  {/* <!-- role --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Role<span className="text-error-500">*</span>
                    </Label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                        formData.role
                          ? "text-gray-800 dark:text-white/90"
                          : "text-gray-400 dark:text-blue-400"
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-gray-700 dark:bg-gray-900 dark:text-blue-400"
                      >
                        Select a Role
                      </option>
                      {tenantsRole?.data?.map((item: any) => (
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
                </div>
                {/* <!-- Button --> */}
                <button
                  onClick={handleRegistration}
                  disabled={createTenantMutation.isPending}
                  className="flex items-center justify-center w-1/4 px-4 py-3 mt-12 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  Register
                </button>
              </div>
            </form>
          )}
          {mode === "Show" && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  {/* Table Header */}
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-4 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Contact Number
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Position
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Role
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {allTenants?.data?.data?.users.map(
                      (item: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item.first_name + " " + item.last_name}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item.email}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item.phone_number}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item.position_in_company}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            {item?.role?.name ?? "No role"}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <button onClick={() => handleEdit(item.id) }>
                              <PencilIcon className="text-blue-300 hover:text-blue-500 dark:hover:text-blue-300 size-5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        showCloseButton={true}
        className="max-w-lg p-6 shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-5">Edit Role</h2>
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
                  placeholder="Enter the first name"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleEditFormChange}
                />
              </div>
              {/* <!-- Last Name --> */}
              <div className="sm:col-span-1">
                <Label>
                  Last Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleEditFormChange}
                  placeholder="Enter the last name"
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
                  name="phone_number"
                  value={editFormData.phone_number}
                  onChange={handleEditFormChange}
                  placeholder="Enter the contact number"
                />
              </div>
              {/* <!-- position --> */}
              <div className="sm:col-span-1">
                <Label>
                  Position<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="position_in_company"
                  value={editFormData.position_in_company}
                  onChange={handleEditFormChange}
                  placeholder="Enter the position"
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
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  placeholder="Enter the email"
                />
              </div>
              {/* <!-- role --> */}
              <div className="sm:col-span-1">
                <Label>
                  Role<span className="text-error-500">*</span>
                </Label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditFormChange}
                  className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                    editFormData.role
                      ? "text-gray-800 dark:text-white/90"
                      : "text-gray-400 dark:text-blue-400"
                  }`}
                >
                  <option
                    value=""
                    disabled
                    className="text-gray-700 dark:bg-gray-900 dark:text-blue-400"
                  >
                    Select a Role
                  </option>
                  {tenantsRole?.data?.map((item: any) => (
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
            </div>
            {/* <!-- Button --> */}
            <button
              onClick={handleRegistration}
              disabled={createTenantMutation.isPending}
              className="flex items-center justify-center w-1/4 px-4 py-3 mt-12 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
            >
              Register
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
