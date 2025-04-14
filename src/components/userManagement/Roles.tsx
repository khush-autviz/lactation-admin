import { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import {createTenantRole, getTenantRole } from "../../api/tenants";
import { toast } from "sonner";
import PageBreadcrumb from "../common/PageBreadCrumb";
import Select from "../form/Select";

export default function Roles() {
  const [mode, setmode] = useState("Create");
  const [formData, setformData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
    setmode(value);
  };

  const options = [
    { value: "Create", label: "Create" },
    { value: "Show", label: "Show" },
  ];

    // fetching tenants roles
    const { data: tenantsRole } = useQuery({
        queryKey: ["tenantRoles"],
        queryFn: getTenantRole,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      });

  const createRoleMutation = useMutation({
    mutationFn: createTenantRole,
    onSuccess: (response) => {
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

  const handleCreateRoleButton = () => {
    if (formData.name === "" || formData.description === "")
      return toast.warning("Empty Fields!");
    createRoleMutation.mutateAsync(formData);
  };

  console.log(tenantsRole?.data);
  

  return (
    <>
      <PageBreadcrumb pageTitle="Roles" />

      <div className="mb-10 w-fit">
        <Label>Select</Label>
        <Select
          options={options}
          defaultValue={options[0].value}
          // placeholder="Select an option"
          onChange={handleSelectChange}
          className="dark:bg-dark-900"
        />
      </div>

      {mode === "Create" && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="input">Name</Label>
            <Input
              name="name"
              onChange={handleChange}
              type="text"
              value={formData.name}
              placeholder="Enter the name of role"
            />
          </div>
          <div>
            <Label htmlFor="inputTwo">Description</Label>
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

      {mode === 'Show' &&
        tenantsRole?.data &&
        tenantsRole.data.map((item: any, index: any) => {
            return   <div className=" w-full max-w-[630px] px-4 mb-4 ">
              <h3 className="font-semibold text-gray-800 text-theme-sm dark:text-white/90 sm:text-2xl">
                 {index+1}. {item.name}
              </h3>
    
              <p className="ms-10 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                {item.description ?? 'No Description'}
              </p>
            </div>
        })
      }
    </>
  );
}
