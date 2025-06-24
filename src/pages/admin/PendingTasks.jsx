"use client";
import TasksTable from "../../components/tables/TasksTable";
import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";

const AdminPendingTasks = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(""); // col2 or col4
  const [filterValue, setFilterValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterRef = useRef(null);

  const DISPLAY_COLUMNS = ["col2", "col3", "col4", "col14"];
  const SPREADSHEET_ID = "1KnflbDnevxgzPqsBfsduPWS75SiQq_l2V5lip6_KMog";

  // Fetch tasks
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

  // Outside click to close dialog
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsDialogOpen(false);
      }
    };

    if (isDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDialogOpen]);

  const filteredPendingTasks = pendingTasks.filter((item) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch = DISPLAY_COLUMNS.some((colId) =>
      String(item[colId] || "")
        .toLowerCase()
        .includes(term)
    );

    const filterColumn = filterType === "col2" ? item.col2 : item.col4;
    const matchesFilter = filterValue
      ? String(filterColumn || "")
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pending Tasks</h1>
        <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
          {filteredPendingTasks.length} Pending Task
          {filteredPendingTasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center bg-white p-4 rounded border relative">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded-md w-full max-w-xs focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="relative ml-4" ref={filterRef}>
          <button
            onClick={() => setIsDialogOpen((prev) => !prev)}
            className="px-10 py-2 border bg-white-600 text-black rounded hover:bg-grey-700"
          >
            Filter
          </button>

          {isDialogOpen && (
            <div className="absolute right-0 top-12 bg-white border shadow-lg rounded-lg w-72 p-4 z-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Filter Tasks
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Filter Column
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="filterType"
                        value="col2"
                        checked={filterType === "col2"}
                        onChange={() => setFilterType("col2")}
                      />
                      FMS Name (Col 2)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="filterType"
                        value="col4"
                        checked={filterType === "col4"}
                        onChange={() => setFilterType("col4")}
                      />
                      Person Name (Col 4)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Filter Value
                  </label>
                  <input
                    type="text"
                    placeholder="Enter filter value"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Table */}
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
          <p className="text-gray-500">No tasks match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPendingTasks;
