import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const HalfCircleChart = ({
  colors = ["#8DD9D5", "#6BBBEA", "#BEA1E8", "#FFB77D", "#FF99A8"],
}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);

  const columnHeaders = {
    J: "Pending Work",
    K: "Completed Work",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/1KnflbDnevxgzPqsBfsduPWS75SiQq_l2V5lip6_KMog/gviz/tq?tqx=out:json&sheet=For Records"
        );
        const text = await response.text();
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const jsonData = text.substring(jsonStart, jsonEnd);
        const data = JSON.parse(jsonData);

        if (data?.table?.rows) {
          const pendingMap = new Map();

          data.table.rows.forEach((row) => {
            // Skip if column D (index 3) is 0
            const columnD = row.c?.[3]?.v;
            if (columnD === 0 || columnD === "0") return;

            // Get name from column C (index 2)
            const nameCell = row.c?.[2]?.v;
            let name = "";

            if (typeof nameCell === "string") {
              name = nameCell.trim();
            } else if (nameCell && typeof nameCell === "object") {
              name = nameCell.label || "";
            }

            if (!name) return;

            // Priority order: E -> F -> I -> J
            let pendingValue = 0;

            // Check column E (index 4)
            const columnE = row.c?.[4]?.v;
            if (typeof columnE === "number") {
              pendingValue = columnE;
            } else if (typeof columnE === "string") {
              pendingValue = parseFloat(columnE.replace(/[^\d.-]/g, "")) || 0;
            }

            // If column E is 0 or empty, check column F (index 5)
            if (!pendingValue) {
              const columnF = row.c?.[5]?.v;
              if (typeof columnF === "number") {
                pendingValue = columnF;
              } else if (typeof columnF === "string") {
                pendingValue = parseFloat(columnF.replace(/[^\d.-]/g, "")) || 0;
              }
            }

            // If still no value, check column I (index 8)
            if (!pendingValue) {
              const columnI = row.c?.[8]?.v;
              if (typeof columnI === "number") {
                pendingValue = columnI;
              } else if (typeof columnI === "string") {
                pendingValue = parseFloat(columnI.replace(/[^\d.-]/g, "")) || 0;
              }
            }

            // Finally, fallback to column J (index 9)
            if (!pendingValue) {
              const columnJ = row.c?.[9]?.v;
              if (typeof columnJ === "number") {
                pendingValue = columnJ;
              } else if (typeof columnJ === "string") {
                pendingValue = parseFloat(columnJ.replace(/[^\d.-]/g, "")) || 0;
              }
            }

            if (pendingValue > 0) {
              // Keep the highest value for each name
              if (
                !pendingMap.has(name) ||
                pendingValue > pendingMap.get(name)
              ) {
                pendingMap.set(name, pendingValue);
              }
            }
          });

          // Get top 5 entries
          const sortedData = Array.from(pendingMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          const labels = sortedData.map(([name]) => name);
          const values = sortedData.map(([, val]) => Math.round(val));

          setChartData({
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: colors.slice(0, values.length),
                borderWidth: 0,
                borderRadius: 6,
                borderSkipped: false,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error:", err);
        setChartData({
          labels: ["Error loading data"],
          datasets: [
            {
              data: [100],
              backgroundColor: [colors[0]],
              borderWidth: 0,
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [colors]);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    circumference: 180,
    rotation: -90,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "Arial, sans-serif",
            size: 12,
          },
          color: "#333",
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: label,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                lineWidth: 0,
                strokeStyle: "rgba(0,0,0,0)",
                pointStyle: "circle",
              }));
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value} ${columnHeaders.J}`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-full h-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 bordeSr-b-2 border-gray-600"></div>
        </div>
      ) : (
        <div className="h-64">
          <Doughnut data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

HalfCircleChart.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default HalfCircleChart;
