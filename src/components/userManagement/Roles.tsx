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
import {
  CheckLineIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader } from "../ui/loader";
import { Modal } from "../ui/modal";
import {
  assignPermissions,
  getAllPermissions,
  getRolesPermissions,
  unassignPermissions,
} from "../../api/Lactation";
import Badge from "../ui/badge/Badge";
import DeleteModal from "../ui/DeleteModal";

export default function Roles() {
  const [mode, setmode] = useState("Records");
  const [permissionIds, setPermissionIds] = useState<number[]>([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isPermissionsModalOpen, setisPermissionsModalOpen] = useState(false);
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

    // handle mode change
    const handleMode = () => {
      if (mode === "Records") return setmode("Create");
      else if (tenantsRole?.data.length === 0) {
        return toast.error("No Records");
      } else {
        setmode("Records");
      }
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
  const { data: allPermissions} = useQuery({
    queryKey: ["allPermissions"],
    queryFn: getAllPermissions,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // fetches roles permissions
  const { data: rolePermissions, refetch: permissionsRefetch } = useQuery({
    queryKey: ["permissions"],
    queryFn: getRolesPermissions,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // creates tenant roles mutation
  const createRoleMutation = useMutation({
    mutationFn: createTenantRole,
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["tenantRoles"] });
      console.log("create role sucess", response);
      setformData({ name: "", description: "" });
      setmode("Records");
      await permissionsRefetch();
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

  //assign permissions mutatation
  const assignPermissionMutation = useMutation({
    mutationFn: assignPermissions,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      console.log("assign permisison sucess", response);
      // setformData({ name: "", description: "" });
      toast.success("Assigned Permission!");
    },
    onError: (error: any) => {
      console.log("assign perm error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  //unassign permissions mutatation
  const unassignPermissionMutation = useMutation({
    mutationFn: unassignPermissions,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      console.log("unassign permisison sucess", response);
      // setformData({ name: "", description: "" });
      toast.success("Unassigned Permission!");
    },
    onError: (error: any) => {
      console.log("unassigned perm error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
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

  // assign permissions button
  const handleAssignPermissions = (id: any) => {
    // console.log(permissionIds);

    if (selectedRoleId) {
      assignPermissionMutation.mutateAsync({
        role_id: selectedRoleId,
        permission_ids: [...permissionIds, id],
      });
    }
  };

  // unassign permissions button
  const handleUnassignPermissions = (id: any) => {
    if (selectedRoleId) {
      unassignPermissionMutation.mutateAsync({
        role_id: selectedRoleId,
        permission_ids: [id],
      });
    }
  };

  //edit pencil info button
  const handleEditButton = (id: any) => {
    setselectedRoleId(id);
    setisModalOpen(true);
  };

  const handleEditPermissionsButton = (id: any) => {
    setselectedRoleId(id);
    setisPermissionsModalOpen(true);
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

  // to store permission ids to pass in assignpermission mutation
  useEffect(() => {
    if (!selectedRoleId || !rolePermissions) return;

    const selectedRole = rolePermissions.data.data.find(
      (role: any) => role.id === selectedRoleId
    );

    if (selectedRole) {
      const ids = selectedRole.permissions.map((perm: any) => perm.id);
      setPermissionIds(ids);
    }
  }, [selectedRoleId, rolePermissions]);

   // mode
   useEffect(() => {
    if (tenantsRole?.data.length === 0) {
      setmode("Create");
    }
  }, [tenantsRole]);

  console.log("perm id", permissionIds);

  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      {(createRoleMutation.isPending ||
        deleteRoleMutation.isPending ||
        unassignPermissionMutation.isPending ||
        assignPermissionMutation.isPending) && <Loader />}
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className=" w-full ">
          <div className="flex justify-between items-center mb-5">
            <h3 className=" font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              {mode}
            </h3>
            <Button
              size="sm"
              className="bg-[#2CBDCB] font-semibold px-10 hover:bg-[#2cbdcb]"
              // onClick={() =>
              //   mode === "Create" ? setmode("Records") : setmode("Create")
              // }
              onClick={handleMode}
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
                      Grant access
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-800 text-start text-theme-md dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
                  {tenantsRole?.data.map((item: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                        {item.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {item.description ?? "No Description"}
                      </TableCell>
                      <TableCell className="px-4 max-w-[200px] py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {item.name === "admin" ? (
                          <Badge size="sm" color="success">
                            admin
                          </Badge>
                        ) : (
                          rolePermissions?.data.data.map(
                            (role: any, roleIndex: any) => {
                              if (item.id === role.id) {
                                if (role.permissions.length === 0) {
                                  return (
                                    <Badge
                                      key={roleIndex}
                                      size="sm"
                                      color="error"
                                    >
                                      no permissions
                                    </Badge>
                                  );
                                }
                                return role.permissions.map(
                                  (perm: any, permIndex: any) => {
                                    return (
                                      <div className="mb-2">
                                        <Badge
                                          key={permIndex}
                                          size="sm"
                                          color="info"
                                        >
                                          {perm.codename}
                                        </Badge>
                                      </div>
                                    );
                                  }
                                );
                              }
                            }
                          )
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        <button
                          onClick={() => handleEditPermissionsButton(item.id)}
                        >
                          <PencilIcon className="text-green-400 hover:text-green-500 dark:hover:text-green-300 size-5" />
                        </button>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
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
            className="bg-pink-700 hover:bg-pink-800"
            onClick={handleEditRoleButton}
          >
            Update
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setisDeleteModalOpen(false)}
        text="role"
        isLoading={deleteRoleMutation.isPending}
        onConfirm={handleDeleteRole}
      />

      {/* Permissions modal */}

      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => setisPermissionsModalOpen(false)}
        showCloseButton={false}
        className="max-w-lg p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl text-gray-800 font-semibold">
            Edit Permissions
          </h2>
        </div>
        <div>
          <h3 className="text-gray-500 text-lg font-semibold mb-3">Assigned</h3>
          <div className="mb-3">
            {rolePermissions?.data?.data?.map((role: any, roleIndex: any) => {
              if (role.id === selectedRoleId) {
                if (role.permissions.length === 0) {
                  return (
                    <Badge key={roleIndex} size="md" color="error">
                      no permissions
                    </Badge>
                  );
                }
                return role?.permissions?.map((perm: any, permIndex: any) => {
                  return (
                    <div
                      key={permIndex}
                      className="mb-2"
                    >
                      <div className="flex justify-between w-full bg-[#f0f9ff]">
                        <Badge size="md" color="info">
                          {perm.codename}
                        </Badge>
                      <button
                      className="pe-2"
                        onClick={() => handleUnassignPermissions(perm.id)}
                      >
                        <TrashBinIcon className="text-red-500 hover:text-red-600 dark:hover:text-red-500 size-5" />
                      </button>
                      </div>
                    </div>
                  );
                });
              }
            })}
          </div>

          <h3 className="text-gray-500 text-lg font-semibold mt-5 mb-3">
            Unassigned
          </h3>

          <div className="mb-3">
            {(() => {
              const selectedRole = rolePermissions?.data.data.find(
                (role: any) => role.id === selectedRoleId
              );

              const assignedPermissionIds = selectedRole
                ? selectedRole.permissions.map((perm: any) => perm.id)
                : [];

              const unassignedPermissionsArray = allPermissions?.data.filter(
                (perm: any) => !assignedPermissionIds.includes(perm.id)
              );

              console.log("length", unassignedPermissionsArray);

              if (unassignedPermissionsArray?.length === 0) {
                return (
                  <Badge size="md" color="error">
                    no permissions
                  </Badge>
                );
              }

              return unassignedPermissionsArray?.map(
                (item: any, index: number) => (
                  <div
                    key={`perm-${index}`}
                    className="mb-2"
                  >
                    <div className="flex justify-between w-full rounded-md bg-[#f0f9ff]">
                      <Badge size="md" color="info">
                        {item.codename}
                      </Badge>
                    <button className="pe-2" onClick={() => handleAssignPermissions(item.id)}>
                      <CheckLineIcon className="text-green-500 hover:text-green-600 dark:hover:text-green-500 size-5" />
                    </button>
                    </div>
                  </div>
                )
              );
            })()}
          </div>
        </div>
      </Modal>
    </div>
  );
}
