import React from "react";
import PropTypes from "prop-types";
import dummyImg from "../../data/dummy-images.jpg"; // ✅ Correct way
// Date formatter function (keep same)
const formatDate = (value) => {
  if (!value) return "—";

  if (typeof value === "string" && value.startsWith("Date(")) {
    try {
      const dateParts = value.match(/Date\((\d+),(\d+),(\d+)\)/);
      if (dateParts && dateParts.length === 4) {
        const year = parseInt(dateParts[1]);
        const month = parseInt(dateParts[2]);
        const day = parseInt(dateParts[3]);
        const date = new Date(year, month, day);
        return date.toLocaleDateString("en-GB");
      }
    } catch (e) {
      console.error("Error parsing Date() string:", e);
    }
  }

  if (typeof value === "string" && value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    return value;
  }

  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB");
    }
    return value;
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB");
};

// Progress value formatter (keep same)
const getProgressValue = (value) => {
  if (!value && value !== 0) return null;

  let numValue;
  if (typeof value === "string") {
    numValue = parseFloat(value.replace("%", ""));
  } else {
    numValue = Number(value);
  }

  return !isNaN(numValue) ? numValue : null;
};

const EmployeesTable = ({ isCompact = false, filterTasks, dynamicHeaders }) => {
  const renderCell = (item, header) => {
    const value = item[header.id];

    // Handle progress columns
    if (header.isProgress) {
      const progressValue = getProgressValue(value);

      if (progressValue === null) {
        return (
          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
            <span className="text-gray-400">—</span>
          </td>
        );
      }

      // For negative values, show red bar
      const isNegative = progressValue < 0;
      const displayValue = Math.abs(progressValue);
      const barWidth = Math.min(100, displayValue);

      return (
        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className={`h-2 rounded-full ${
                  isNegative ? "bg-red-500" : "bg-blue-600"
                }`}
                style={{ width: `${barWidth}%` }}
              ></div>
            </div>
            <span
              className={`text-xs ${
                isNegative ? "text-red-600" : "text-blue-600"
              }`}
            >
              {progressValue}%
            </span>
          </div>
        </td>
      );
    }

    // Handle date columns
    if (header.id === "col0" || header.id === "col1") {
      return (
        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
          {value ? formatDate(value) : "—"}
        </td>
      );
    }

    // Handle regular columns
    return (
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
        {value || "—"}
      </td>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${
        isCompact ? "max-h-96" : ""
      }`}
    >
      <div className="overflow-scroll">
        <div className={`min-w-full ${isCompact ? "max-h-96" : ""}`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                {dynamicHeaders.map((header) => (
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
              {filterTasks.map((item, index) => (
                <tr
                  key={item._id || item.id || index}
                  className="hover:bg-gray-50"
                >
                  {/* Static circular image (customize src as needed) */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <img
                      src={dummyImg}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  {dynamicHeaders.map((header) => (
                    <React.Fragment key={header.id}>
                      {renderCell(item, header)}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

EmployeesTable.propTypes = {
  filterTasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  isCompact: PropTypes.bool,
  dynamicHeaders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isProgress: PropTypes.bool,
    })
  ).isRequired,
};

export default EmployeesTable;
