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
import { ErrorIcon, PencilIcon, TrashBinIcon } from "../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader } from "../ui/loader";
import { Modal } from "../ui/modal";
import { getRolesPermissions } from "../../api/Lactation";

export default function Roles() {
  const [mode, setmode] = useState("Records");
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDeleteModalOpen, setisDeleteModalOpen] = useState(false);
  const [selectedRoleId, setselectedRoleId] = useState<number | null>(null);
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

  // fetches roles permissions
  const { data: permissions, refetch: permissionsRefetch } = useQuery({
    queryKey: ["permissions"],
    queryFn: getRolesPermissions,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // creates tenant roles mutation
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
      // setformData({ name: "", description: "" });
      toast.success("Role Edited!");
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

  // delete tenant role
  const deleteRoleMutation = useMutation({
    mutationFn: deleteTenantRole,
    onSuccess: async () => {
      toast.success("Role deleted successfully!");
      setisModalOpen(false);
      setisDeleteModalOpen(false);
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
    } else return toast.error("Something went wrong"); // no role id is selected
  };

  //edit pencil button
  const handleEditButton = (id: any) => {
    setselectedRoleId(id);
    setisModalOpen(true);
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
        });
    }
  }, [selectedRoleId]);

  console.log("tenantrole", tenantsRole);

  console.log("permissions", permissions);

  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      {createRoleMutation.isPending && deleteRoleMutation.isPending && (
        <Loader />
      )}
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className=" w-full ">
          <div className="flex justify-between items-center mb-5">
            <h3 className=" font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              {mode}
            </h3>
            <Button
              className="bg-orange-600 font-semibold px-10 hover:bg-orange-700"
              onClick={() =>
                mode === "Create" ? setmode("Records") : setmode("Create")
              }
            >
              {mode === "Create" ? "Records" : "Create"}
            </Button>
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
            <Button className="px-15" onClick={handleCreateRoleButton}>
              Create
            </Button>
          </div>
        )}

        {mode === "Records" && (
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
                      Permissions
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
                        {permissions?.data.data.map(
                          (role: any, roleIndex: any) => {
                            console.log(item.id);
                            if (item.id === role.id) {
                              // console.log(role.id);

                              // console.log(role.permissions.length);
                              if (role.permissions.length === 0)
                                return "No Perm";
                              role.permissions.map(
                                (perm: any, permIndex: any) => {
                                  return perm;
                                }
                              );
                            }
                          }
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <button onClick={() => handleEditButton(item.id)}>
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
          <h2 className="text-xl text-gray-800 font-semibold">Edit Role</h2>
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
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleEditRoleButton}
          >
            Update
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setisDeleteModalOpen(false)}
        showCloseButton={false}
        className="max-w-lg p-6 shadow-xl"
      >
        <div className="flex flex-col justify-between items-center mb-5">
          <ErrorIcon className="size-17 mb-5" />

          <h2 className="text-xl text-gray-700 mb-2">Are you sure?</h2>
          <p className="text-gray-500 text-center max-w-sm mx-auto mb-5">
            Do you really want to delete the role? This process cannot be
            undone.
          </p>
          <div className="space-y-6">
            <div className="flex justify-between items-center mt-4 space-x-10">
              <Button
                onClick={handleDeleteRole}
                className="px-10 text-[16px] font-medium text-white transition rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600"
                disabled={deleteRoleMutation.isPending}
              >
                Delete
              </Button>
              <Button
                onClick={() => setisDeleteModalOpen(false)}
                className="px-10 text-[16px] font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                disabled={deleteRoleMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
