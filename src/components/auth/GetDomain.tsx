import { useState } from "react";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useMutation } from "@tanstack/react-query";
import { getDomain } from "../../api/tenants";
import { toast } from "sonner";

export default function GetDomain() {
  const [email, setemail] = useState("");
  const [domain, setdomain] = useState([]);

  // validate email
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };


  const getDomainMutation = useMutation({
    mutationFn: getDomain,
    onSuccess: (response) => {
        toast.success("Domain Found!");
      setdomain(response.data.data.domains);
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          error?.message ||
          "Something went wrong"
      );
    },
  });

  const handleClick = () => {
    const cleanedEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanedEmail)) {
      toast.warning("Please enter a valid email address");
      return;
    }
    getDomainMutation.mutateAsync({ email: cleanedEmail });
  };

  const handleDomain = (subdomain: String) => {
    window.location.href = `http://${subdomain}:5173/signin`;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="border border-gray-600 rounded-2xl p-8 max-w-1/3 bg-white">
        <h1 className="text-2xl font-bold mb-2">Lactation</h1>
        <p className="text-gray-700 mb-10 text-lg">
          Find out the Lactation URL for your company
        </p>
        {!domain.length && (
          <>
            <Input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter your email"
              className="w-full"
            />
            <Button onClick={handleClick} className="mt-5">
              Search
            </Button>
          </>
        )}

        {domain.length > 0 && (
          <div className="flex flex-col justify-center items-center">
            <div
              className="border border-gray-500 rounded-lg py-2 px-10 my-4 cursor-pointer hover:bg-gray-100 transition"
            >
              {domain.map((item: any,index) => {
                return <>
                <div className="border border-black my-3 p-2" onClick={() => handleDomain(item.domain)}>{item.domain}</div>
                <hr />
                </>
              })}
            </div>
            <Button onClick={() => setdomain([])}>Find Another Domain</Button>
          </div>
        )}

        <div className="mt-5 flex justify-center items-center">
          <span>Don't have a lactation account?&nbsp;</span>
          <button className="text-gray-800 underline">register</button>
        </div>
      </div>
    </div>
  );
}
