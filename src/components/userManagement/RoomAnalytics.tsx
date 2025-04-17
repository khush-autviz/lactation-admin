import PageBreadcrumb from "../common/PageBreadCrumb";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLactationRoom, getRoomAnalytics } from "../../api/Lactation";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import ComponentCard from "../common/ComponentCard";
import RoomBarChart from "../charts/bar/RoomBarChart";
import RoomPieChart from "../charts/pie/RoomPieChart";

export default function RoomAnalytics() {
  const [isOpen, setIsOpen] = useState(false);
  const [selctedRoomName, setselctedRoomName] = useState<String>();
  const [selctedRoomId, setselctedRoomId] = useState<number>();
  const [barRoomData, setBarRoomData] = useState<any>([]);
  const [pieData, setpieData] = useState({
    cancel: 0,
    complete: 0,
    utilize: 0,
  });
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
    fetchAnalyticsOfRoom(id);
  };

  // fetch analytics of specific rooms
  const fetchAnalyticsOfRoom = async (roleId: number) => {
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["getRoomAnalytics", roleId],
        queryFn: () => getRoomAnalytics(roleId),
      });

      const {
        cancelled_bookings,
        completed_bookings,
        not_attended_bookings,
        pending_bookings,
        total_bookings,
        cancellation_rate,
        completion_rate,
        utilization_percentage,
      } = await response.data.data.statistics;
      setBarRoomData([
        total_bookings,
        pending_bookings,
        not_attended_bookings,
        completed_bookings,
        cancelled_bookings,
      ]);
      setpieData({
        cancel: cancellation_rate,
        complete: completion_rate,
        utilize: utilization_percentage,
      });

      console.log("room analytics:", response);
    } catch (error) {
      console.error("Error fetching room slots", error);
    }
  };

  console.log(lactationRooms);

  useEffect(() => {
    if (lactationRooms?.data?.data?.[0]?.id) {
      console.log("stats", lactationRooms.data.data.statistics);

      fetchAnalyticsOfRoom(lactationRooms.data.data[0].id);
    }
  }, [lactationRooms]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Room Analytics" />
      {lactationRooms?.data.data.length === 0 && (
        <div className="flex items-center justify-center h-[calc(100vh-184px)] bg-gray-100 ">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md w-1/2">
           No Lactation Room Found.
          </h1>
        </div>
      )}
      {lactationRooms?.data.data.length > 0 && (
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

            <div className="space-y-6">
              {/* <ComponentCard title="Bookings"> */}
              <RoomBarChart barData={barRoomData} />
              <div className=" flex">
                {/* {pieData.cancel > 0 &&
                pieData.complete > 0 &&
                pieData.utilize > 0 && (
                  <> */}
                <RoomPieChart
                  pieData={[pieData.complete, 100 - pieData.complete]}
                  text={["completed", "Incompleted"]}
                />
                <RoomPieChart
                  pieData={[pieData.cancel, 100 - pieData.cancel]}
                  text={["cancelled", "Approve"]}
                />
                <RoomPieChart
                  pieData={[pieData.utilize, 100 - pieData.utilize]}
                  text={["Utilized", "Unutilized"]}
                />
                {/* </>
                )} */}
              </div>
              {/* </ComponentCard> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
