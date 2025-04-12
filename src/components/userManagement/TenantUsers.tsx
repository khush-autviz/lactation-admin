import { useState } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTenantUser, getAllTenants } from "../../api/tenants";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

export default function TenantUsers() {
  const [isOpen, setisOpen] = useState(false);
  const [mode, setmode] = useState("Create");

  const tableData = [
    {
      id: 1,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Lindsey Curtis",
        role: "Web Designer",
      },
      projectName: "Agency Website",
      team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
      budget: "3.9K",
      status: "Active",
    },
    {
      id: 2,
      user: {
        image: "/images/user/user-18.jpg",
        name: "Kaiya George",
        role: "Project Manager",
      },
      projectName: "Technology",
      team: {
        images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
      },
      budget: "24.9K",
      status: "Pending",
    },
    {
      id: 3,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Zain Geidt",
        role: "Content Writing",
      },
      projectName: "Blog Writing",
      team: {
        images: ["/images/user/user-27.jpg"],
      },
      budget: "12.7K",
      status: "Active",
    },
    {
      id: 4,
      user: {
        image: "/images/user/user-20.jpg",
        name: "Abram Schleifer",
        role: "Digital Marketer",
      },
      projectName: "Social Media",
      team: {
        images: [
          "/images/user/user-28.jpg",
          "/images/user/user-29.jpg",
          "/images/user/user-30.jpg",
        ],
      },
      budget: "2.8K",
      status: "Cancel",
    },
    {
      id: 5,
      user: {
        image: "/images/user/user-21.jpg",
        name: "Carla George",
        role: "Front-end Developer",
      },
      projectName: "Website",
      team: {
        images: [
          "/images/user/user-31.jpg",
          "/images/user/user-32.jpg",
          "/images/user/user-33.jpg",
        ],
      },
      budget: "4.5K",
      status: "Active",
    },
  ];

  const [formData, setformData] = useState({
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Tenants" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
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
                    <Input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      placeholder="Enter the role"
                    />
                  </div>
                </div>
                {/* <!-- Button --> */}
                <button
                  onClick={handleRegistration}
                  //   disabled={companyRegisterMutation.isPending}
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
                        First Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Last Name
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
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {tableData.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="px-4 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-500 text-theme-sm dark:text-white/90">
                                {order.user.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {order.projectName}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex -space-x-2">
                            {order.team.images.map((teamImage, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                              >
                                <img
                                  width={24}
                                  height={24}
                                  src={teamImage}
                                  alt={`Team member ${index + 1}`}
                                  className="w-full size-6"
                                />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              order.status === "Active"
                                ? "success"
                                : order.status === "Pending"
                                ? "warning"
                                : "error"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {order.budget}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          kdsljl
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
