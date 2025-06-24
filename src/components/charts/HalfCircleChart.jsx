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
    K: "Completed Work", // future use
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
          const pendingMap = new Map(); // Column J
          const completedMap = new Map(); // Column K (future use)

          data.table.rows.forEach((row) => {
            const columnD = row.c?.[3]?.v; // Name
            const name = String(columnD || "").trim();
            if (!name) return;

            // --------------------------
            // Pending Work (Column J)
            // --------------------------
            const columnJ = row.c?.[9]?.v;
            let pending = 0;
            if (typeof columnJ === "number") {
              pending = columnJ;
            } else if (typeof columnJ === "string") {
              pending = parseFloat(columnJ.replace(/[^\d.-]/g, ""));
            }
            if (!isNaN(pending) && pending > 0) {
              if (!pendingMap.has(name) || pending > pendingMap.get(name)) {
                pendingMap.set(name, pending);
              }
            }

            // --------------------------
            // Completed Work (Column K)
            // --------------------------
            const columnK = row.c?.[10]?.v;
            let completed = 0;
            if (typeof columnK === "number") {
              completed = columnK;
            } else if (typeof columnK === "string") {
              completed = parseFloat(columnK.replace(/[^\d.-]/g, ""));
            }
            if (!isNaN(completed) && completed > 0) {
              if (
                !completedMap.has(name) ||
                completed > completedMap.get(name)
              ) {
                completedMap.set(name, completed);
              }
            }
          });

          // Display Top 5 based on Pending Work (Column J)
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
          labels: ["Error"],
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
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const name = context.label;
            const value = context.parsed;
            return `${name}: ${value} (${columnHeaders.J})`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-full h-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
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
