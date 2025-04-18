import { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { MoreDotIcon } from "../../icons";
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
import { createVenueTypes, getVenueTypes } from "../../api/createOrganisation";

export default function VenueTypes() {
  const [mode, setmode] = useState("Create");
  const [isOpen, setisOpen] = useState(false);
    const [name, setname] = useState("")
  const queryClient = useQueryClient()


    // fetching venue types
    const { data: venueTypes } = useQuery({
        queryKey: ["venueTypes"],
        queryFn: getVenueTypes,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
      });

  const CreateVenueTypeMutation = useMutation({
    mutationFn: createVenueTypes,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["venueTypes"] });
      console.log("create venue sucess", response);
      toast.success("Venue Created!");
    },
    onError: (error: any) => {
      console.log("create venue error", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  const handleMode = () => {
    mode === "Create" ? setmode('Records') : setmode('Create')
  }

  const handleCreateButton = () => {
    if (name.trim() === '') return toast.warning('Please enter the name')
    
    CreateVenueTypeMutation.mutateAsync({name})

  };

  console.log("ven ye", venueTypes);
  

  return (
    <div>
      <PageBreadcrumb pageTitle="Venue Types" />
      {/* {createRoleMutation.isPending && <Loader />} */}
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className=" w-full ">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              {mode}
            </h3>
            <Button className="bg-[f9fafb73]
 font-semibold px-10 hover:bg-orange-700" onClick={handleMode}>{mode === "Create"? "Records" : "Create"}</Button>
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
                onChange={(e) => setname(e.target.value)}
                type="text"
                value={name}
                placeholder="Enter the name of role"
              />
            </div>
            <Button onClick={handleCreateButton}>Create</Button>
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
                      Index
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-800 text-start text-theme-md dark:text-gray-400"
                    >
                      Name
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
                  {venueTypes?.data.map((item: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-400">
                      {index+1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {item.name}
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
  );
}
