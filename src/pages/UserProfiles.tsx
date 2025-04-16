import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/tenants";
import { useAuthStore } from "../store/authStore";

export default function UserProfiles() {
  const { setUser } = useAuthStore();

  // fetching user profile
  const { data: userProfileData } = useQuery({
    queryKey: ["tenantTypes"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userProfileData) {
      console.log(userProfileData);
      const {
        last_name,
        phone_number,
        position_in_company,
        email,
        first_name,
        role,
      } = userProfileData.data.data;

      setUser({
        first_name,
        last_name,
        email,
        phone_number,
        role,
        position_in_company,
      });
    }
  }, [userProfileData]);

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-2">
          <UserMetaCard />
          <UserInfoCard />
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </>
  );
}
