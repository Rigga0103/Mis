"use client";
import TasksTable from "../../components/tables/TasksTable";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const AdminPendingTasks = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [col2Filter, setCol2Filter] = useState("");
  const [col4Filter, setCol4Filter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const DISPLAY_COLUMNS = ["col2", "col3", "col4", "col14"];

  const SPREADSHEET_ID = "1KnflbDnevxgzPqsBfsduPWS75SiQq_l2V5lip6_KMog";

  const fetchPendingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=data`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch pending data: ${response.status}`);
      }

      const text = await response.text();
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid response format from pending sheet");
      }

      const data = JSON.parse(text.substring(jsonStart, jsonEnd + 1));

      if (!data.table || !data.table.rows) {
        throw new Error("No table data found in pending sheet");
      }

      const fmsItems = data.table.rows.map((row, rowIndex) => {
        const itemObj = {
          _id: `${rowIndex}-${Math.random().toString(36).substr(2, 9)}`,
          _rowIndex: rowIndex + 1,
        };

        if (row.c) {
          row.c.forEach((cell, i) => {
            itemObj[`col${i}`] = cell?.v ?? cell?.f ?? "";
          });
        }

        return itemObj;
      });

      const filteredItems = fmsItems.filter((item) => {
        return DISPLAY_COLUMNS.some((colId) => {
          const value = item[colId];
          return value && String(value).trim() !== "";
        });
      });

      setPendingTasks(filteredItems);
      toast.success(`Fetched ${filteredItems.length} pending tasks`, {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      console.error("❌ Error fetching pending data:", err);
      setError(err.message);
      toast.error(`Failed to load pending data: ${err.message}`, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  const filteredPendingTasks = pendingTasks.filter((item) => {
    const term = searchTerm.toLowerCase();
    const col2Val = String(item.col2 || "").toLowerCase();
    const col4Val = String(item.col4 || "").toLowerCase();

    const matchesSearchTerm = DISPLAY_COLUMNS.some((colId) => {
      const value = item[colId];
      return value && String(value).toLowerCase().includes(term);
    });

    const matchesCol2 = col2Filter
      ? col2Val.includes(col2Filter.toLowerCase())
      : true;

    const matchesCol4 = col4Filter
      ? col4Val.includes(col4Filter.toLowerCase())
      : true;

    return matchesSearchTerm && matchesCol2 && matchesCol4;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading pending tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-6 max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPendingData}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pending Tasks</h1>
        <div className="text-sm bg-yellow-100 text-yellow-800 font-medium px-2.5 py-0.5 rounded-full">
          {filteredPendingTasks.length} Pending Task
          {filteredPendingTasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border rounded-lg focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Filter by Fms Name"
            value={col2Filter}
            onChange={(e) => setCol2Filter(e.target.value)}
            className="min-w-[150px] px-3 py-2 border rounded-lg focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Filter by Person Name"
            value={col4Filter}
            onChange={(e) => setCol4Filter(e.target.value)}
            className="min-w-[150px] px-3 py-2 border rounded-lg focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      {filteredPendingTasks.length > 0 ? (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              All Pending Tasks
            </h2>
            <p className="text-sm text-gray-500">
              Tasks that require action and haven't been completed yet.
            </p>
          </div>
          <div className="h-[calc(100vh-280px)] overflow-hidden">
            <TasksTable isCompact={true} filterTasks={filteredPendingTasks} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
          <div className="py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Pending Tasks Found
            </h3>
            <p className="text-gray-500">
              {pendingTasks.length === 0
                ? "No data available or all tasks are completed."
                : "No tasks match your current filters."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingTasks;
