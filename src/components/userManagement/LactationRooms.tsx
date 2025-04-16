import { useEffect, useState } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { PencilIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader } from "../ui/loader";
import {
  createLactationRoom,
  EditLactationRoom,
  getLactationRoom,
  getSingleLactationRoom,
} from "../../api/Lactation";
import Badge from "../ui/badge/Badge";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function LactationRooms() {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [selectedRoleId, setselectedRoleId] = useState();
  const [mode, setmode] = useState("Records");
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

  const [editFormData, seteditFormData] = useState({
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

  const handleEditFormChange = (e: any) => {
    const { name, value } = e.target;
    seteditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    seteditFormData((prev) => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [name]: parseInt(value) || 0, // fallback to 0 if empty or invalid
      },
    }));
  };

  // fetching all lacatation rooms
  const { data: lactationRooms } = useQuery({
    queryKey: ["lactationRooms"],
    queryFn: getLactationRoom,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // create lactation room mutation
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

  // edit lactation room mutation
  const editLactationRoomMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      EditLactationRoom(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["lactationRooms"] });
      console.log("Update Lactation Room sucess", response);
      // setformData({ name: "", description: "" });
      toast.success("Lactation Room Updated!");
      setisModalOpen(false);
    },
    onError: (error: any) => {
      console.log("edit role error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

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

  // edit role button
  const handleEditRoleButton = () => {
    if (editFormData.name.trim() === "" || editFormData.description === "")
      return toast.warning("Empty Fields!");

    if (selectedRoleId) {
      editLactationRoomMutation.mutateAsync({
        id: selectedRoleId,
        payload: editFormData,
      });
    }
  };

  // edit pencil button
  const handleEditButton = (id: any) => {
    setselectedRoleId(id);
    setisModalOpen(true);
  };

  // to fetch a single role
  useEffect(() => {
    if (selectedRoleId) {
      queryClient
        .fetchQuery({
          queryKey: ["singleLactationRoom", selectedRoleId],
          queryFn: () => getSingleLactationRoom(selectedRoleId),
        })
        .then((response) => {
          console.log(" single room", response);

          const {
            name,
            description,
            location,
            amenities,
            capacity,
            is_active,
          } = response.data.data;
          seteditFormData({
            name,
            description,
            location,
            amenities,
            is_active,
            capacity: {
              per_capacity: capacity.per_capacity,
              total_capacity: capacity.total_capacity,
            },
          });
        });
    }
  }, [selectedRoleId]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Lactation Room" />
      {(createLactationRoomMutation.isPending ||
        editLactationRoomMutation.isPending) && <Loader />}
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 ">
        <div className=" w-full ">
          <div className="mb-5 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              {mode}
            </h3>
            <Button
              size="sm"
              className="bg-orange-600 font-semibold px-10 hover:bg-orange-700"
              onClick={() =>
                mode === "Create" ? setmode("Records") : setmode("Create")
              }
            >
              {mode === "Create" ? "Records" : "Create"}
            </Button>
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
                      type="text"
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
                          Total Capacity
                          <span className="text-error-500">*</span>
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
                      type="text"
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
                        value={"true"}
                        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                      >
                        True
                      </option>
                      <option
                        key={1}
                        value={"false"}
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
          {mode === "Records" && (
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
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 ">
                          {item.description}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={item.is_active ? "success" : "warning"}
                          >
                            {item.is_active ? "True" : "False"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item.amenities}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                            size="sm"
                            color={item.is_available ? "success" : "warning"}
                          >
                            {item.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <button onClick={() => handleEditButton(item.id)}>
                            <PencilIcon className="text-blue-300 hover:text-blue-500 dark:hover:text-blue-300 size-6" />
                          </button>
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

      {/* Edit Modal */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        showCloseButton={false}
        className="max-w-lg p-6 shadow-xl"
      >
        <h2 className="text-xl text-gray-800 font-semibold mb-5 ">Edit Room</h2>
        {/* <form> */}
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
                value={editFormData.name}
                onChange={handleEditFormChange}
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
                value={editFormData.location}
                onChange={handleEditFormChange}
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
                type="text"
                name="description"
                value={editFormData.description}
                onChange={handleEditFormChange}
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
                    value={editFormData.capacity.per_capacity}
                    onChange={handleEditCapacityChange}
                    placeholder="Enter the per capacity"
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    Total Capacity
                    <span className="text-error-500">*</span>
                  </Label>

                  <Input
                    type="number"
                    name="total_capacity"
                    value={editFormData.capacity.total_capacity}
                    onChange={handleEditCapacityChange}
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
                type="text"
                name="amenities"
                value={editFormData.amenities}
                onChange={handleEditFormChange}
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
                value={editFormData.is_active}
                onChange={handleEditFormChange}
                className={`h-11 w-full text-gray-800 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
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
                  value={"true"}
                  className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  True
                </option>
                <option
                  key={1}
                  value={"false"}
                  className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  False
                </option>
              </select>
            </div>
          </div>
          {/* <!-- Button --> */}
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleEditRoleButton}
          >
            Update
          </Button>
        </div>
        {/* </form> */}
      </Modal>
    </div>
  );
}
