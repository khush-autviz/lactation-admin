import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function RoomPieChart({ pieData, text }: { pieData?: number[], text: string[] }) {
  // 🔹 Static fallback data (remove when using dynamic data)
  const staticData = [15,85];

  // 🔹 Replace staticData below with `pieData` when passing dynamic props
  const series = pieData ?? staticData;

  const options: ApexOptions = {
    chart: {
      type: "pie",
      fontFamily: "Outfit, sans-serif",
    },
    labels:text,
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Outfit",
      labels: {
        colors: "#333",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
    },
    theme: "light"
    },
    colors: ["#465fff", "#6c7fff"],
    dataLabels: {
      style: {
        fontSize: "14px",
        fontFamily: "Outfit",
      },
    },
    stroke: {
        show: false
    }
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="pieChart" className="min-w-[300px]">
        <Chart options={options} series={series} type="pie" height={280} />
      </div>
    </div>
  );
}
