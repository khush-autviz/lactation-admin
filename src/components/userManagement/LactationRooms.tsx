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
import { createLactationRoom, getLactationRoom } from "../../api/Lactation";
import Badge from "../ui/badge/Badge";

export default function LactationRooms() {
  const [isOpen, setisOpen] = useState(false);
  const [mode, setmode] = useState("Create");
  const queryClient = useQueryClient();

  const [formData, setformData] = useState({
    name: "",
    description: "",
    location: "",
    amenities: "",
    is_active: "",
    capacity: {
      per_capacity: 0,
      total_capacity: 0,
    },
  });

  //handle form changes
  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformData((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [name]: parseInt(value) || 0, // fallback to 0 if empty or invalid
      },
    }));
  };

  // register button
  const handleRegistration = async (e: any) => {
    e.preventDefault();

    // Check if any field is empty
    const isFormValid =
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.amenities.trim() !== "" &&
      formData.is_active.trim() !== "" &&
      formData.capacity.per_capacity > 0 &&
      formData.capacity.total_capacity > 0;

    if (!isFormValid) {
      toast.warning("Please Fill all the Fields");
      return;
    }

    createLactationRoomMutation.mutateAsync(formData);

    // console.log(formData);
    
  };

  // fetching tenants roles
  const { data: lactationRooms } = useQuery({
    queryKey: ["lactationRooms"],
    queryFn: getLactationRoom,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // create tenant user mutation
  const createLactationRoomMutation = useMutation({
    mutationFn: createLactationRoom,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["lactationRooms"] });
      console.log("create tenant user success", response);
      toast.success("Lactation Room Created!");
    },
    onError: (error: any) => {
      console.log("create lactation room error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  console.log(lactationRooms);
  

  return (
    <div>
      <PageBreadcrumb pageTitle="Lactation Room" />
      {createLactationRoomMutation.isPending && <Loader />}
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
                      Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter the name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Location<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      placeholder="Enter the location"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Contact number --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Description<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Enter the Description"
                    />
                  </div>
                  {/* <!-- position --> */}
                  <div className="sm:col-span-1">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                    <Label>
                      Per Capacity<span className="text-error-500">*</span>
                    </Label>    
                        <Input
                          type="number"
                          name="per_capacity"
                          value={formData.capacity.per_capacity}
                          onChange={handleCapacityChange}
                          placeholder="Enter the per capacity"
                        />
                        </div>
                      <div className="sm:col-span-1">
                    <Label>
                      Total Capacity<span className="text-error-500">*</span>
                    </Label>

                        <Input
                          type="number"
                          name="total_capacity"
                          value={formData.capacity.total_capacity}
                          onChange={handleCapacityChange}
                          placeholder="Enter the total capacity"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Contact number --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Amenities<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleFormChange}
                      placeholder="Enter the amenities"
                    />
                  </div>
                  {/* <!-- position --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Active<span className="text-error-500">*</span>
                    </Label>
                    <select
                      name="is_active"
                      value={formData.is_active}
                      onChange={handleFormChange}
                      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
                        formData.is_active
                          ? "text-gray-800 dark:text-white/90"
                          : "text-gray-400 dark:text-blue-400"
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-gray-700 dark:bg-gray-900 dark:text-blue-400"
                      >
                        Select status
                      </option>
                        <option
                          key={0}
                          value={'true'}
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          True
                        </option>
                        <option
                          key={1}
                          value={'false'}
                          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                        >
                          False
                        </option>
                    </select> 
                  </div>
                </div>
                {/* <!-- Button --> */}
                <button
                  onClick={handleRegistration}
                  disabled={createLactationRoomMutation.isPending}
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
                        Location
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Description
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Active
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Amenities
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                      >
                        Available
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
                    {lactationRooms?.data.data.map((item: any, index: any) => (
                      <TableRow key={index}>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item.name}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item.location}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-[10px]">
                          {item.description}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                    size="sm"
                    color={
                      item.is_active
                        ? "success"
                        : "warning"
                    }
                  >
                    {item.is_active?"True":'False'}
                  </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item.amenities}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item.is_available?'True':'False'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <PencilIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                          
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
