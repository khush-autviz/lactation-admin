import { useEffect, useState } from "react";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { CalenderIcon, PencilIcon, TrashBinIcon } from "../../icons";
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
  createSlots,
  deleteLactationRoom,
  deleteSlot,
  EditLactationRoom,
  getLactationRoom,
  getSingleLactationRoom,
  getSlotsOfSpecificRoom,
} from "../../api/Lactation";
import Badge from "../ui/badge/Badge";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { BigModal } from "../ui/bigModal";
import DeleteModal from "../ui/DeleteModal";

export default function LactationRooms() {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [isSlotDeleteModalOpen, setisSlotDeleteModalOpen] = useState(false);
  const [slotId, setslotId] = useState()
  const [slotsArray, setslotsArray] = useState([]);
  const [isSlotModalOpen, setisSlotModalOpen] = useState(false);
  const [selectedRoleId, setselectedRoleId] = useState();
  const [mode, setmode] = useState("Records");
  const [slotMode, setslotMode] = useState("Records");
  const queryClient = useQueryClient();

  const [times, setTimes] = useState({
    start_time: "",
    end_time: "",
  });

  const handleTimeChange = (e: any) => {
    const { name, value } = e.target;

    // Validates full HH:mm format from 00:00 to 23:59
    const isValid = /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

    if (isValid || value === "") {
      setTimes((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

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

  // fetch slots of specific rooms
  const fetchSlotsOfRoom = async (roleId: number) => {
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["slotsOfSpecificRoom", roleId],
        queryFn: () => getSlotsOfSpecificRoom(roleId),
      });

      setslotsArray(response.data.data.slots);
      console.log("Fetched slots:", response);
    } catch (error) {
      console.error("Error fetching room slots", error);
    }
  };

  // create lactation room mutation
  const createLactationRoomMutation = useMutation({
    mutationFn: createLactationRoom,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["lactationRooms"] });
      console.log("create tenant user success", response);
      toast.success("Lactation Room Created!");
      setmode("Records");
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

  // delete lactation room mutation
  const deleteLactationRoomMutation = useMutation({
    mutationFn: deleteLactationRoom,
    onSuccess: async () => {
      toast.success("Room deleted successfully!");
      setisModalOpen(false);
      setisDeleteModalOpen(false);
      // await allTenantsRefetch();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete room"
      );
    },
  });

  // create slots  mutation
  const createSlotsMutation = useMutation({
    mutationFn: createSlots,
    onSuccess: (response) => {
      console.log("create slot success", response);
      toast.success("Slot Created!");

      setslotMode("Records");
      if (selectedRoleId) {
        fetchSlotsOfRoom(selectedRoleId);
      }
    },
    onError: (error: any) => {
      console.log("create slot error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  // delete slot mutation
  const deleteSlotMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      deleteSlot(id, payload),
    onSuccess: (response) => {
      // queryClient.invalidateQueries({ queryKey: ["lactationRooms"] });
      console.log("delete slot sucess", response);
      // setformData({ name: "", description: "" });
      toast.success("Slot Deleted!!!");
      setisSlotDeleteModalOpen(false);
      if (selectedRoleId) {
        fetchSlotsOfRoom(selectedRoleId);
      }
    },
    onError: (error: any) => {
      console.log("delete slot error", error);
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

  //delete role button
  const handleDeleteRoleButton = () => {
    if (selectedRoleId) {
      deleteLactationRoomMutation.mutateAsync(selectedRoleId);
    } else return toast.error("Something went wrong"); // no role id is selected
  };

  // edit pencil button
  const handleEditButton = (id: any) => {
    setselectedRoleId(id);
    setisModalOpen(true);
  };

  // opens slot button
  const handleSlotButton = (id: any) => {
    setselectedRoleId(id);
    setisSlotModalOpen(true);
  };

  // create slot button
  const handleCreateSlotButton = () => {
    if (times.start_time === "" && times.end_time === "")
      return toast.warning("Empty Fields!");

    if (selectedRoleId) {
      createSlotsMutation.mutateAsync({
        ...times,
        lactation_room: selectedRoleId,
      });
    } else return toast.error("Something Went Wrong!");
  };

  // delete slot button
  const handleSlotDeleteButton = (id: any) => {
setisSlotDeleteModalOpen(true)
setslotId(id)
  };

  // delete slot 
  const handleSlotDelete = () => {
    if (selectedRoleId && slotId) {
      deleteSlotMutation.mutateAsync({
        id : slotId,
        payload: { lactation_room: selectedRoleId },
      });
    }
  }

  // to fetch a single room info
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

  // to update slots while creating and deleting
  useEffect(() => {
    if (selectedRoleId) {
      fetchSlotsOfRoom(selectedRoleId);
    }
  }, [selectedRoleId]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Lactation Room" />
      {(createLactationRoomMutation.isPending ||
        editLactationRoomMutation.isPending ||
        deleteLactationRoomMutation.isPending ||
        deleteSlotMutation.isPending) && <Loader />}
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
                        Slots
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
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {item.amenities}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                          <button onClick={() => handleSlotButton(item.id)}>
                            <CalenderIcon className="text-green-400 hover:text-green-500 dark:hover:text-green-300 size-5" />
                          </button>
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
        {/* <h2 className="text-xl text-gray-800 font-semibold mb-5 ">Edit Room</h2> */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl text-gray-800 font-semibold">Edit Room</h2>
          <button onClick={() => setisDeleteModalOpen(true)}>
            <TrashBinIcon className="text-red-500 hover:text-red-600 dark:hover:text-red-500 size-6" />
          </button>
        </div>
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

      {/* Room Delete Modal  */}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setisDeleteModalOpen(false)}
        text="room"
        isLoading={deleteLactationRoomMutation.isPending}
        onConfirm={handleDeleteRoleButton}
      />

      {/* Slot Modal */}

      <BigModal
        isOpen={isSlotModalOpen}
        onClose={() => setisSlotModalOpen(false)}
        showCloseButton={false}
        className="max-w-lg p-6 shadow-xl"
      >
        <div className="flex justify-between items_center mb-5">
          <h2 className="text-xl text-gray-800 font-semibold ">{slotMode}</h2>
          <Button
            size="sm"
            className="bg-green-600 font-semibold px-10 hover:bg-green-700"
            onClick={() =>
              slotMode === "Create"
                ? setslotMode("Records")
                : setslotMode("Create")
            }
          >
            {slotMode === "Create" ? "Records" : "Create Slot"}
          </Button>
        </div>

        {slotMode === "Records" && (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Start
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  End
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Full
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Active Bookings
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Cancelled Bookings
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-4 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Capacity
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Remaining
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-600 text-start text-theme-md dark:text-gray-400"
                >
                  Delete
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {slotsArray.map((item: any, index: any) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.start_time}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {item.end_time}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 ">
                    <Badge
                      size="sm"
                      color={item.is_available ? "success" : "warning"}
                    >
                      {item.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={item.is_fully_booked ? "success" : "warning"}
                    >
                      {item.is_fully_booked ? "Full" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {item.active_bookings}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {item.cancelled_bookings}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {item.max_capacity}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {item.remaining_capacity}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <button onClick={() => handleSlotDeleteButton(item.id)}>
                      <TrashBinIcon className="text-red-500 hover:text-red-600 dark:hover:text-red-500 size-6" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {slotMode === "Create" && (
          <div className="space-y-6">
            <div>
              <Label>
                Start Time (24 hour format)
                <span className="text-error-500">*</span>
              </Label>
              <Input
                name="start_time"
                onChange={handleTimeChange}
                type="time"
                value={times.start_time}
                placeholder="Enter the name of role"
              />
            </div>
            <div>
              <Label>
                End Time (24 hour format)
                <span className="text-error-500">*</span>
              </Label>
              <Input
                name="end_time"
                onChange={handleTimeChange}
                type="time"
                value={times.end_time}
                placeholder="Enter the description of role"
              />
            </div>
            <Button
              className="bg-purple-800 hover:bg-purple-900"
              onClick={handleCreateSlotButton}
            >
              Create
            </Button>
          </div>
        )}
      </BigModal>

      {/* Delete Slot Modal */}
      <DeleteModal
        isOpen={isSlotDeleteModalOpen}
        onClose={() => setisSlotDeleteModalOpen(false)}
        text="slot"
        isLoading={deleteSlotMutation.isPending}
        onConfirm={handleSlotDelete}
      />

    </div>
  );
}
