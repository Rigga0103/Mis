import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VerticalBarChart = ({
  title,
  colors = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"],
  maxValue = 100,
}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
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
            const name = String(row.c?.[3]?.v || "").trim(); // Column D (Name)
            if (!name) return;

            const colJ = row.c?.[9]?.v;
            let pending = 0;
            if (typeof colJ === "number") pending = colJ;
            else if (typeof colJ === "string")
              pending = parseFloat(colJ.replace(/[^\d.-]/g, ""));
            if (!isNaN(pending) && pending > 0) {
              if (!pendingMap.has(name) || pending > pendingMap.get(name)) {
                pendingMap.set(name, pending);
              }
            }
          });

          const sorted = Array.from(pendingMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          const labels = sorted.map(([name]) => name);
          const values = sorted.map(([, val]) => Math.round(val));

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
        console.error("Error fetching chart data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [colors]);

  const options = {
    indexAxis: "x", // <-- Horizontal names, vertical bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: "600",
          family: "'Inter', sans-serif",
        },
        color: "#1F2937",
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.y} (${columnHeaders.J})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxValue,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#64748B",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#64748B",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="relative bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      <div className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

VerticalBarChart.propTypes = {
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  maxValue: PropTypes.number,
};

export default VerticalBarChart;
