import { useState } from "react";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useMutation } from "@tanstack/react-query";
import { getDomain } from "../../api/tenants";
import { toast } from "sonner";
import ComponentCard from "../common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router";
import { Loader } from "../ui/loader";

export default function GetDomain() {
  const [email, setemail] = useState("");
  const [domain, setdomain] = useState([]);

  // validate email
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  // gets the domain for that email
  const getDomainMutation = useMutation({
    mutationFn: getDomain,
    onSuccess: (response) => {
      toast.success("Domain Found!");
      setdomain(response.data.data.domains);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  // handle get domain button
  const handleClick = () => {
    const cleanedEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanedEmail)) {
      toast.warning("Please enter a valid email address");
      return;
    }
    getDomainMutation.mutateAsync({ email: cleanedEmail });
  };

  // handle subdomain click
  const handleDomain = (subdomain: String) => {
    window.location.href = `http://${subdomain}:5173/signin`;
  };

  console.log(domain);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      {getDomainMutation.isPending && <Loader />}
      <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md w-1/2">
        Find the Lactation URL of your company.
      </h1>
      <div className=" rounded-2xl w-1/3 bg-white text-center">
        <ComponentCard
          title="Lactation"
          desc="Enter the email of the registered account."
        >
          {!domain.length && (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter your email"
                className="w-full"
              />
              <Button
                onClick={handleClick}
                size="sm"
                className="flex items-center justify-center w-full mb-4  px-4 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                disabled={getDomainMutation.isPending}
              >
                Search
              </Button>
            </>
          )}

          {domain.length > 0 && (
            <>
              {/* <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"> */}
                {/* <div className="max-w-full overflow-x-auto"> */}
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                        >
                          Company Name
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                        >
                          Domain
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {domain.map((item: any, index) => (
                        <TableRow >
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              {item.company_name}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 font-semibold text-start text-purple-700">
                            <div
                              key={index}
                              onClick={() => handleDomain(item.domain)}
                              className="cursor-pointer"
                            >
                              {item.domain}
                        </div>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                {/* </div> */}
              {/* </div> */}
              <div className="flex justify-center items-center">
                <Button onClick={() => setdomain([])}>
                  Find Another Domain
                </Button>
              </div>
            </>
          )}
          <div>
            <p className="text-md font-normal text-center text-gray-700 dark:text-gray-400">
              Don't have a lactation account? {""}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Register
              </Link>
            </p>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
