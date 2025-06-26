import React from "react";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Download } from "lucide-react";
import {
  employees,
  getTopScorers,
  getLowestScorers,
  getEmployeesByPendingTasks,
  departments,
  getWeeklyCommitmentComparison,
} from "../../data/mockData";
import EmployeesTable from "../../components/tables/EmployeesTable";
import HalfCircleChart from "../../components/charts/HalfCircleChart";
import HorizontalBarChart from "../../components/charts/HorizontalBarChart";
import VerticalBarChart from "../../components/charts/VerticalBarChart";
import { generateDashboardPDF } from "../../utils/pdfGenerator";
import DepartmentScores from "../../components/charts/DepartmentScores";

/**
 * Admin Dashboard component that displays various data visualizations and tables
 * @returns {JSX.Element} The rendered dashboard
 */
const AdminDashboard = () => {
  // Get data for charts
  const topScorers = getTopScorers(5);
  const lowestScorers = getLowestScorers(5);
  const employeesByPending = getEmployeesByPendingTasks().slice(0, 5);
  const commitmentComparison = getWeeklyCommitmentComparison();

  // Prepare data for charts
  const topScorersData = topScorers.map((emp) => emp.score);
  const topScorersLabels = topScorers.map((emp) => emp.name);
  const lowestScorersData = lowestScorers.map((emp) => emp.score);
  const lowestScorersLabels = lowestScorers.map((emp) => emp.name);
  const pendingTasksData = employeesByPending.map((emp) => emp.pendingTasks);
  const pendingTasksLabels = employeesByPending.map((emp) => emp.name);
  const departmentScoresData = departments.map((dept) => dept.averageScore);
  const departmentScoresLabels = departments.map((dept) => dept.name);
  const [dashboardTasks, setDashboardTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated DISPLAY_COLUMNS to include col13
  const DISPLAY_COLUMNS = ["col2", "col3", "col4", "col13", "col14"];
  const ALLOWED_COLUMNS = [
    // "col0",
    "col2",
    "col3",
    "col4",
    "col5",
    "col6",
    "col7",
    "col8",
    "col9",
    "col10",
    "col11",
    "col12",
    // "col13",
  ];

  const SPREADSHEET_ID = "1KnflbDnevxgzPqsBfsduPWS75SiQq_l2V5lip6_KMog";

  const [dashboardHeaders, setDashboardHeaders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=For Records`
      );

      const text = await response.text();
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const data = JSON.parse(text.substring(jsonStart, jsonEnd + 1));

      if (!data.table || !data.table.rows)
        throw new Error("No table data found");

      // Define which columns should always be treated as progress columns
      const PROGRESS_COLUMNS = ["col5", "col6", "col10", "col11"];
      // Define which columns contain images
      const IMAGE_COLUMNS = ["col2"];
      console.log(IMAGE_COLUMNS, "IMAGE_COLUMNS");
      const headers = data.table.cols.map((col, colIndex) => {
        const columnId = `col${colIndex}`;
        const sampleValue = data.table.rows?.[0]?.c?.[colIndex]?.v ?? "";

        // Check if column should be progress (either by content or manual list)
        const isProgressColumn =
          PROGRESS_COLUMNS.includes(columnId) ||
          (typeof sampleValue === "string" && sampleValue.includes("%"));

        // Check if column contains images
        const isImageColumn = IMAGE_COLUMNS.includes(columnId);

        return {
          id: columnId,
          label: col.label || `Column ${colIndex + 1}`,
          isProgress: isProgressColumn,
          isImage: isImageColumn,
        };
      });

      const fmsItems = data.table.rows.map((row, rowIndex) => {
        const itemObj = {
          _id: `${rowIndex}-${Math.random().toString(36).substr(2, 9)}`,
          _rowIndex: rowIndex + 1,
        };
        if (row.c) {
          row.c.forEach((cell, cellIndex) => {
            itemObj[`col${cellIndex}`] = cell?.v ?? cell?.f ?? "";
          });
        }
        return itemObj;
      });

      setDashboardHeaders(headers);
      setDashboardTasks(fmsItems);
      toast.success(`Fetched ${fmsItems.length} dashboard tasks`);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
      toast.error(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredDashboard = dashboardTasks.filter((item) => {
    const term = searchTerm.toLowerCase();

    const matchesSearchTerm = DISPLAY_COLUMNS.some((colId) => {
      const value = item[colId];
      // For image columns, we might want to skip text search or handle differently
      if (colId === "col12") {
        // You can customize this logic based on how you want to handle image search
        return true; // Always include items with images, or implement custom logic
      }
      return value && String(value).toLowerCase().includes(term);
    });

    return matchesSearchTerm;
  });

  if (isLoading) {
    return (
      <div className="h-40 sm:h-96 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading Dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={generateDashboardPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </button>
      </div>

      {/* People List */}
      <div>
        {filteredDashboard.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              List of People
            </h2>
            <div className="relative h-[calc(100vh-300px)] overflow-hidden">
              {" "}
              {/* Fixed height container */}
              <div className="absolute inset-0 overflow-y-auto">
                {" "}
                {/* Scrollable area */}
                <EmployeesTable
                  isCompact={true}
                  filterTasks={filteredDashboard}
                  dynamicHeaders={dashboardHeaders.filter((header) =>
                    ALLOWED_COLUMNS.includes(header.id)
                  )}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
            <div className="py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No dashboard Tasks Found
              </h3>
              <p className="text-gray-500">
                {dashboardTasks.length === 0
                  ? "No data available or all tasks are completed."
                  : "No tasks match your current filters."}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Scorers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top 5 Scorers
          </h2>
          <div className="h-64">
            <HalfCircleChart
              data={topScorersData}
              labels={topScorersLabels}
              colors={["#8DD9D5", "#6BBBEA", "#BEA1E8", "#FFB77D", "#FF99A8"]}
            />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pending Tasks by User
          </h2>
          <div className="h-64">
            <HorizontalBarChart
              data={pendingTasksData}
              labels={pendingTasksLabels}
              colors={["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"]}
              maxValue={Math.max(...pendingTasksData) + 1}
            />
          </div>
        </div>

        {/* Lowest Scores */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Lowest Scores
          </h2>
          <div className="h-64">
            <VerticalBarChart
              data={lowestScorersData}
              labels={lowestScorersLabels}
              colors={["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"]}
              maxValue={100}
            />
          </div>
        </div>
      </div>

      {/* Department Scores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Department Scores
        </h2>
        <div className="h-80">
          <DepartmentScores
            data={departmentScoresData}
            labels={departmentScoresLabels}
            colors={["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]}
            maxValue={100}
          />
        </div>
      </div>

      {/* Weekly Commitment Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Weekly Commitment vs Actual Work
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Committed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Achievement Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commitmentComparison.map((item, index) => {
                const achievementRate = Math.round(
                  (item.actual / item.commitment) * 100
                );
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.commitment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.actual}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              achievementRate >= 100
                                ? "bg-green-600"
                                : achievementRate >= 75
                                ? "bg-blue-600"
                                : achievementRate >= 50
                                ? "bg-yellow-600"
                                : "bg-red-600"
                            }`}
                            style={{
                              width: `${Math.min(achievementRate, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {achievementRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
