import { useEffect, useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTenantRole,
  deleteTenantRole,
  editTenantRole,
  getSingleTenantRole,
  getTenantRole,
} from "../../api/tenants";
import { toast } from "sonner";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { MoreDotIcon, PencilIcon, TrashBinIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader } from "../ui/loader";
import { Modal } from "../ui/modal";

export default function Roles() {
  const [mode, setmode] = useState("Create");
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [selectedRoleId, setselectedRoleId] = useState<number | null>(null);
  const [isOpen, setisOpen] = useState(false);
  const [formData, setformData] = useState({
    name: "",
    description: "",
  });
  const [editFormData, seteditFormData] = useState({
    name: "",
    description: "",
  });
  const queryClient = useQueryClient();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    seteditFormData({ ...editFormData, [name]: value });
  };

  // fetches all tenants roles
  const { data: tenantsRole, refetch: allTenantsRefetch } = useQuery({
    queryKey: ["tenantRoles"],
    queryFn: getTenantRole,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // creates tenant roles
  const createRoleMutation = useMutation({
    mutationFn: createTenantRole,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tenantRoles"] });
      console.log("create role sucess", response);
      setformData({ name: "", description: "" });
      toast.success("Role Created!");
    },
    onError: (error: any) => {
      console.log("create role error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  // edit role mutation
  const editRoleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      editTenantRole(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tenantRoles"] });
      console.log("edit role sucess", response);
      setformData({ name: "", description: "" });
      toast.success("Role Edited!");
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

  // delete tenant role
  const deleteRoleMutation = useMutation({
    mutationFn: deleteTenantRole,
    onSuccess: async () => {
      // Invalidate or refetch the roles list after successful deletion
      // queryClient.invalidateQueries({ queryKey: ["deleteTenantRole"] });
      toast.success("Role deleted successfully!");
      setisModalOpen(false);
      await allTenantsRefetch();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete role"
      );
    },
  });

  // create role button
  const handleCreateRoleButton = () => {
    if (formData.name === "" || formData.description === "")
      return toast.warning("Empty Fields!");
    createRoleMutation.mutateAsync(formData);
  };

  // edit pencil button
  const handleEdit = (id: any) => {
    setselectedRoleId(id);
  };

  // edit role button
  const handleEditRoleButton = () => {
    if (editFormData.name.trim() === "" || editFormData.description === "")
      return toast.warning("Empty Fields!");

    if (selectedRoleId) {
      editRoleMutation.mutateAsync({
        id: selectedRoleId,
        payload: editFormData,
      });
    }
  };

  // delete role button
  const handleDeleteRole = () => {
    if (selectedRoleId) {
      deleteRoleMutation.mutateAsync(selectedRoleId);
    }
  };

  // to fetch a single role
  useEffect(() => {
    if (selectedRoleId) {
      queryClient
        .fetchQuery({
          queryKey: ["singleTenantRole", selectedRoleId],
          queryFn: () => getSingleTenantRole(selectedRoleId),
        })
        .then((response) => {
          const { name, description } = response.data;
          seteditFormData({ name, description });
          setisModalOpen(true); // open modal only after data is set
        });
    }
  }, [selectedRoleId]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      {createRoleMutation.isPending && <Loader />}
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
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
        </div>
        {mode === "Create" && (
          <div className="space-y-6">
            <div>
              <Label>
                Name<span className="text-error-500">*</span>
              </Label>
              <Input
                name="name"
                onChange={handleChange}
                type="text"
                value={formData.name}
                placeholder="Enter the name of role"
              />
            </div>
            <div>
              <Label>
                Description<span className="text-error-500">*</span>
              </Label>
              <Input
                name="description"
                onChange={handleChange}
                type="text"
                value={formData.description}
                placeholder="Enter the description of role"
              />
            </div>
            <Button onClick={handleCreateRoleButton}>Create</Button>
          </div>
        )}

        {mode === "Show" && (
          <div className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-300 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-4 font-medium text-gray-800 text-start text-theme-md dark:text-gray-400"
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-800 text-start text-theme-md dark:text-gray-400"
                    >
                      Description
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-800 text-start text-theme-md dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
                  {tenantsRole?.data.map((item: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                        {item.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {item.description ?? "No Description"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button onClick={() => handleEdit(item.id)}>
                          <PencilIcon className="text-blue-300 hover:text-blue-500 dark:hover:text-blue-300 size-5" />
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

      {/* EDIT MODAL */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setisModalOpen(false)}
        showCloseButton={false}
        className="max-w-lg p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Edit Role</h2>
          <button onClick={() => setisDeleteModalOpen(true)}>
            <TrashBinIcon className="text-red-500 hover:text-red-600 dark:hover:text-red-500 size-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <Label>
              Name<span className="text-error-500">*</span>
            </Label>
            <Input
              name="name"
              onChange={handleEditChange}
              type="text"
              value={editFormData.name}
              placeholder="Enter the name of role"
            />
          </div>
          <div>
            <Label>
              Description<span className="text-error-500">*</span>
            </Label>
            <Input
              name="description"
              onChange={handleEditChange}
              type="text"
              value={editFormData.description}
              placeholder="Enter the description of role"
            />
          </div>
          <Button onClick={handleEditRoleButton}>Edit</Button>
        </div>
      </Modal>

      {/* Delete Modal */}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setisDeleteModalOpen(false)}
        showCloseButton={false}
        className="max-w-lg p-6 shadow-xl"
      >
        <div>
          <h2 className="text-xl font-semibold mb-5">Are you sure?</h2>
          <div className="space-y-6">
            <div>
            <Button onClick={handleDeleteRole} 
              className="flex items-center justify-center w-full mb-8 mt-4 px-4 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                disabled={deleteRoleMutation.isPending}
                >
                  Delete
                </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
