"use client";
import TasksTable from "../../components/tables/TasksTable";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

const AdminPendingTasks = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("col4"); // Default to person name
  const [filterValue, setFilterValue] = useState("");
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
      const text = await response.text();
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const data = JSON.parse(text.substring(jsonStart, jsonEnd + 1));

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

      const filteredItems = fmsItems.filter((item) =>
        DISPLAY_COLUMNS.some((colId) => {
          const value = item[colId];
          return value && String(value).trim() !== "";
        })
      );

      setPendingTasks(filteredItems);
      toast.success(`Fetched ${filteredItems.length} pending tasks`);
    } catch (err) {
      console.error("❌ Error fetching pending data:", err);
      setError(err.message);
      toast.error(`Failed to load: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  // Get unique values for dropdown based on selected filter type
  const getUniqueValues = (columnKey) => {
    const values = pendingTasks
      .map((item) => String(item[columnKey] || "").trim())
      .filter((value) => value !== "")
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return values;
  };

  const filteredTasks = pendingTasks.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = DISPLAY_COLUMNS.some((colId) =>
      String(item[colId] || "")
        .toLowerCase()
        .includes(term)
    );
    const matchesFilter = filterValue
      ? String(item[filterType] || "").trim() === filterValue
      : true;
    return matchesSearch && matchesFilter;
  });

  // Show all columns when no specific filter is selected, otherwise show filtered column
  const visibleColumns = filterValue ? [filterType] : DISPLAY_COLUMNS;

  // Reset other filter when one is selected
  const handleFilterChange = (newFilterType, newFilterValue) => {
    setFilterType(newFilterType);
    setFilterValue(newFilterValue);
  };

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pending Tasks</h1>
        <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
          {filteredTasks.length} Pending Task
          {filteredTasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Search + Inline Filter */}
      <div className="bg-white p-4 rounded border space-y-4">
        {/* Filter Options with Dropdowns */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 border rounded-md w-full max-w-xs focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* FMS Name Dropdown */}
          <div>
            <select
              value={filterType === "col2" ? filterValue : ""}
              onChange={(e) => {
                setFilterType("col2");
                setFilterValue(e.target.value);
              }}
              className="border px-3 py-2 rounded w-full focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All FMS Names</option>
              {getUniqueValues("col2").map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Person Name Dropdown */}
          <div>
            <select
              value={filterType === "col4" ? filterValue : ""}
              onChange={(e) => {
                setFilterType("col4");
                setFilterValue(e.target.value);
              }}
              className="border px-3 py-2 rounded w-full focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Person Names</option>
              {getUniqueValues("col4").map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={fetchPendingData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {filterValue
                ? `Showing ${
                    filterType === "col2" ? "FMS Name" : "Person Name"
                  }: ${filterValue}`
                : "All Tasks"}
            </h2>
            <p className="text-sm text-gray-500">
              {filterValue
                ? "Filtered tasks based on your selected criteria."
                : "Showing all available tasks."}
            </p>
          </div>
          <div className="h-[calc(100vh-280px)] overflow-hidden">
            <TasksTable
              isCompact={true}
              filterTasks={filteredTasks}
              visibleColumns={visibleColumns}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm p-6 text-center">
          <p className="text-gray-500">No tasks match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPendingTasks;
