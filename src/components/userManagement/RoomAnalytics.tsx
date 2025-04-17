import PageBreadcrumb from "../common/PageBreadCrumb";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLactationRoom, getRoomAnalytics } from "../../api/Lactation";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function RoomAnalytics() {
  const [isOpen, setIsOpen] = useState(false);
  const [selctedRoomName, setselctedRoomName] = useState<String>();
  const [selctedRoomId, setselctedRoomId] = useState<number>();
  const queryClient = useQueryClient();


  const { data: lactationRooms } = useQuery({
    queryKey: ["lactationRooms"],
    queryFn: getLactationRoom,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleDropdownClick = (name: string, id: number) => {
    setIsOpen(false);
    setselctedRoomName(name);
    setselctedRoomId(id);
  };

    // fetch analytics of specific rooms
    const fetchAnalyticsOfRoom = async (roleId: number) => {
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["getRoomAnalytics", roleId],
          queryFn: () => getRoomAnalytics(roleId),
        });
  
        // setslotsArray(response.data.data.slots);
        console.log("room analytics:", response);
      } catch (error) {
        console.error("Error fetching room slots", error);
      }
    };

  console.log(lactationRooms);

  useEffect(() => {
        fetchAnalyticsOfRoom(lactationRooms?.data.data[0].id)
  }, [])
  

  return (
    <div>
      <PageBreadcrumb pageTitle="Room Analytics" />
      <div className=" rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 ">
        <div className=" w-full ">
          <div className="flex justify-between items-center mb-5">
            <h3 className=" font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            {selctedRoomName ?? lactationRooms?.data.data[0].name}
            </h3>
            <div className="relative inline-block">
              <button className="dropdown-toggle" onClick={toggleDropdown}>
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
              </button>
              <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="w-40 p-2"
              >
                {lactationRooms?.data.data.map((item: any, index: any) => {
                  return (
                    <DropdownItem
                      key={index}
                      onItemClick={() =>
                        handleDropdownClick(item.name, item.id)
                      }
                      className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                    >
                      {item.name}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
