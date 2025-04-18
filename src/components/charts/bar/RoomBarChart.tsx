import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function RoomBarChart({ barData }: { barData: number[] }) {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Total", "Pending", "Not Attended", "Completed", "Cancelled"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        
        style: {
          fontSize: "15px",
          fontFamily: "Outfit",
          colors: "#333",
        },
        formatter: function (val: number) {
          return Number.isInteger(val) ? val.toString() : ""; // hide decimals
        },
      },
      title: {
        text: undefined,
      },
      floating: false
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Status",
      data: barData,
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" className="min-w-[500px]">
        <Chart options={options} series={series} type="bar" height={180} />
      </div>
    </div>
  );
}
