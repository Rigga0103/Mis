import React from "react";
import {
  Calendar,
  Flag,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} fmsName
 * @property {string} taskName
 * @property {string} personName
 * @property {string} todayTask
 * @property {string} pendingTillDate
 * @property {'completed'|'in-progress'|'pending'} status
 * @property {'high'|'medium'|'low'} priority
 */

/**
 * @typedef {Object} TasksTableProps
 * @property {Task[]} filterTasks - Array of task objects
 * @property {boolean} [isCompact=false] - Compact table view
 * @property {'today'|'pending'} [type='today']
 */

// ✅ STATIC HEADERS for the TABLE (only affects <thead>)
const staticHeaders = [
  { id: "col3", label: "Task Name" },
  { id: "col4", label: "Person Name" },
  { id: "col15", label: "Today Task" },
  { id: "col21", label: "Attendence" },
];

const TodayTasksTable = ({
  isCompact = false,
  type = "today",
  filterTasks = [],
}) => {
  console.log(filterTasks, "filterTasks");
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${
        isCompact ? "max-h-96" : ""
      }`}
    >
      <div className="overflow-x-auto">
        <div
          className={`min-w-full ${
            isCompact ? "max-h-96 overflow-y-auto" : ""
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {staticHeaders.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={staticHeaders.length}
                    className="px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                filterTasks.map((item) => (
                  <tr key={item._id}>
                    {staticHeaders.map((header) => (
                      <td
                        key={header.id}
                        className="px-3 py-2 text-sm text-gray-700"
                      >
                        {item[header.id] || "—"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TodayTasksTable;
