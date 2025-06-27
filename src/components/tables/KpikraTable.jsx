import React, { useEffect, useState } from "react";
import { Database } from "lucide-react";

function KpikraTable() {
  const [kpikraTable, setKpikraTable] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sheetHeaders, setSheetHeaders] = useState([]);
  const [error, setError] = useState(null);

  const SPREADSHEET_ID = "1h8lu66_hZlHm3tkaUhypmM_HhKP2WCaCfOPmAsisqKY";
  const DISPLAY_COLUMNS = [0, 1, 2, 3, 4, 5];
  const START_FROM_ROW = 9;

  const attendenceData = [
    { id: "col0", label: "System Name" },
    { id: "col1", label: "Task Name" },
    { id: "col2", label: "Description" },
    { id: "col3", label: "Link Of System" },
    { id: "col4", label: "DB LINK" },
    { id: "col5", label: "Training Video Link" },
  ];

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    if (typeof dateValue === "string" && dateValue.includes("/"))
      return dateValue;
    if (typeof dateValue === "number") {
      const date = new Date((dateValue - 25569) * 86400 * 1000);
      return date.toLocaleDateString();
    }
    return dateValue.toString();
  };

  const showToast = (message, type = "info") => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const fetchKpikraTableData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=Dashboard`
      );

      if (!response.ok)
        throw new Error(`Failed to fetch data: ${response.status}`);

      const text = await response.text();
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1)
        throw new Error("Invalid response format");

      const data = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      setSheetHeaders(attendenceData);

      const items = [];
      if (data.table?.rows && data.table.rows.length > START_FROM_ROW - 1) {
        data.table.rows.slice(START_FROM_ROW - 1).forEach((row, rowIndex) => {
          const item = {
            _id: `${rowIndex}-${Math.random().toString(36).substr(2, 9)}`,
            _rowIndex: rowIndex + START_FROM_ROW,
          };
          if (row.c) {
            row.c.forEach((cell, i) => {
              if (DISPLAY_COLUMNS.includes(i)) {
                item[`col${i}`] = cell?.v ?? cell?.f ?? "";
              }
            });
          }
          items.push(item);
        });
      }

      const filteredItems = items.filter((item) =>
        DISPLAY_COLUMNS.some((colIndex) => {
          const value = item[`col${colIndex}`];
          return value && String(value).trim() !== "";
        })
      );

      setKpikraTable(filteredItems);

      if (filteredItems.length > 0) {
        showToast(
          `${filteredItems.length} records loaded from row ${START_FROM_ROW} onwards`,
          "success"
        );
      } else {
        showToast(
          "No records found from the specified starting row",
          "warning"
        );
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      showToast(`Failed to load data: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKpikraTableData();
  }, []);

  const filteredKpikraTable = kpikraTable.filter((item) => {
    const term = searchTerm.toLowerCase();
    return DISPLAY_COLUMNS.some((colIndex) => {
      const value = item[`col${colIndex}`];
      return value && String(value).toLowerCase().includes(term);
    });
  });

  return (
    <div className="w-full max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Systems and Resources (Starting from Row {START_FROM_ROW})
          </h2>
        </div>
      </div>

      {/* Search Control */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredKpikraTable.length} records
        </div>
      </div>

      {/* Only table scrolls, not entire page */}
      <div
        className="overflow-x-auto w-full"
        style={{
          maxHeight: "400px",
        }}
      >
        <table className=" divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {attendenceData.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={attendenceData.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex justify-center items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    <span className="text-gray-600">
                      Loading data from row {START_FROM_ROW}...
                    </span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={attendenceData.length}
                  className="px-6 py-12 text-center text-red-500 font-medium"
                >
                  Error: {error}
                </td>
              </tr>
            ) : filteredKpikraTable.length === 0 ? (
              <tr>
                <td
                  colSpan={attendenceData.length}
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  No records found from row {START_FROM_ROW} onwards
                </td>
              </tr>
            ) : (
              filteredKpikraTable.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  {attendenceData.map((header, idx) => (
                    <td
                      key={`${item._id}-${header.id}-${idx}`}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900"
                    >
                      {(header.id === "col3" ||
                        header.id === "col4" ||
                        header.id === "col5") &&
                      item[header.id] &&
                      (String(item[header.id]).startsWith("http") ||
                        String(item[header.id]).includes("maps")) ? (
                        <a
                          href={item[header.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800 break-all"
                        >
                          {item[header.id]}
                        </a>
                      ) : header.id === "col1" || header.id === "col2" ? (
                        formatDate(item[header.id])
                      ) : (
                        <div
                          className="max-w-xs truncate"
                          title={item[header.id]}
                        >
                          {item[header.id] || "—"}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default KpikraTable;
