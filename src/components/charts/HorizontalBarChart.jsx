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

const HorizontalBarChart = ({
  title,
  colors = [
    "#ef4444",
    "#f87171",
    "#fca5a5",
    "#fecaca",
    "#fee2e2",
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#c3ddfd",
    "#dbeafe",
  ],
  maxValue = null,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 28,
        minBarLength: 5,
      },
    ],
  });
  const [nameMap, setNameMap] = useState({});
  const [top5Info, setTop5Info] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/1KnflbDnevxgzPqsBfsduPWS75SiQq_l2V5lip6_KMog/gviz/tq?tqx=out:json&sheet=Data"
        );
        const text = await response.text();
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const jsonData = text.substring(jsonStart, jsonEnd);
        const data = JSON.parse(jsonData);

        if (data?.table?.rows) {
          const combinedData = new Map();
          const nameMapping = {};

          data.table.rows.forEach((row) => {
            const columnO = row.c?.[14]?.v;
            const columnK = row.c?.[10]?.v;
            const columnE = row.c?.[4]?.v;

            if (!columnO || !columnK) return;

            let cleanedValue = 0;
            if (typeof columnK === "number") {
              cleanedValue = columnK;
            } else if (typeof columnK === "string") {
              cleanedValue = parseFloat(columnK.replace(/[^\d.-]/g, ""));
            }

            if (isNaN(cleanedValue) || cleanedValue <= 0) return;

            const label = String(columnO).trim();
            combinedData.set(
              label,
              (combinedData.get(label) || 0) + cleanedValue
            );

            if (columnE && !nameMapping[label]) {
              nameMapping[label] = String(columnE).trim();
            }
          });

          const sortedData = Array.from(combinedData.entries()).sort(
            (a, b) => b[1] - a[1]
          );
          const labels = sortedData.map(([label]) => label);
          const values = sortedData.map(([, value]) => Math.round(value));

          setNameMap(nameMapping);

          // Save top 5 info
          const top5 = sortedData.slice(0, 5).map(([label, value], index) => ({
            label,
            value,
            name: nameMapping[label] || "No name",
            color: colors[index % colors.length],
          }));
          setTop5Info(top5);

          setChartData({
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: values.map(
                  (_, index) => colors[index % colors.length]
                ),
                borderWidth: 0,
                borderRadius: 6,
                borderSkipped: false,
                maxBarThickness: 28,
                minBarLength: 5,
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
              data: [0],
              backgroundColor: [colors[0]],
              borderWidth: 0,
              borderRadius: 6,
              borderSkipped: false,
              maxBarThickness: 28,
              minBarLength: 5,
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [colors, maxValue]);

  const chartHeight = Math.max(150, chartData.labels.length * 25);

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: !!title,
        text: title || "",
        font: { size: 16, weight: "600", family: "'Inter', sans-serif" },
        color: "#1F2937",
        padding: { bottom: 15 },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        boxPadding: 6,
        titleFont: { size: 13, weight: "600", family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const nameFromColumnE = nameMap[label] || "No name available";
            return [
              `Name: ${nameFromColumnE}`,
              `Value: ${context.raw.toLocaleString()}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max:
          maxValue || Math.max(...(chartData.datasets[0]?.data || [0])) * 1.1,
        grid: { display: true, color: "#f1f5f9" },
        ticks: {
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#64748B",
        },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 10, family: "'Inter', sans-serif" },
          color: "#64748B",
          maxRotation: 0,
          callback: (value, index) => {
            const label = chartData.labels[index];
            return label?.length > 15 ? label.substring(0, 15) + "..." : label;
          },
        },
        border: { display: false },
      },
    },
    animation: {
      duration: 800,
      easing: "easeInOutQuart",
    },
  };

  return (
    <div className="relative bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      )}

      <div className="overflow-y-auto max-h-36 border rounded-lg bg-gray-50">
        <div style={{ height: `${chartHeight}px`, minHeight: "150px" }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-1.5"></div>
                <p className="text-gray-600 text-sm">Loading...</p>
              </div>
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </div>

      {!isLoading && chartData.labels.length > 0 && (
        <>
          <div className="mt-3 text-xs text-gray-500">
            Showing {chartData.labels.length} items
          </div>

          {/* 👇 Top 5 Names Display */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Top 5 Names:
            </h4>
            <ul className="text-sm space-y-1">
              {top5Info.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-400">({item.value})</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

HorizontalBarChart.propTypes = {
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  maxValue: PropTypes.number,
};

export default HorizontalBarChart;
