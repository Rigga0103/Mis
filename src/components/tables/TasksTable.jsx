import React from "react";
import { User } from "lucide-react";

import { useState, useEffect } from "react";
// ImgWithFallback Component (same as in EmployeesTable)
const ImgWithFallback = ({ src, alt, name, fallbackElement, className }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const getDriveImageUrls = (originalUrl) => {
    if (!originalUrl || typeof originalUrl !== "string") return [];

    const fileIdMatch = originalUrl.match(
      /\/file\/d\/([^/]+)|id=([^&]+)|\/d\/([^/]+)/
    );
    const fileId = fileIdMatch
      ? fileIdMatch[1] || fileIdMatch[2] || fileIdMatch[3]
      : null;

    if (!fileId) return [originalUrl];

    return [
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
      `https://lh3.googleusercontent.com/d/${fileId}=w400`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      originalUrl,
    ];
  };

  useEffect(() => {
    if (!src || src.trim() === "") {
      setLoadFailed(true);
      return;
    }

    const urls = getDriveImageUrls(src);
    if (urls.length === 0) {
      setLoadFailed(true);
      return;
    }

    setImgSrc(urls[0]);
    setLoadFailed(false);
    setAttempts(0);
  }, [src]);

  const handleError = () => {
    const urls = getDriveImageUrls(src);
    const nextAttempt = attempts + 1;

    if (nextAttempt < urls.length) {
      setImgSrc(urls[nextAttempt]);
      setAttempts(nextAttempt);
    } else {
      setLoadFailed(true);
    }
  };

  if (loadFailed || !src) {
    return (
      <div className="flex flex-col items-center justify-center space-y-1">
        {fallbackElement ? (
          fallbackElement
        ) : (
          <div
            className={`${className} bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center`}
          >
            <span className="text-white text-lg font-bold">
              {name
                ?.split(" ")
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join("")
                .toUpperCase() || "?"}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={`${className} object-cover`}
      loading="lazy"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
};

// Utility function to convert Google Drive URLs
const convertGoogleDriveImageUrl = (url) => {
  if (!url) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
    }
  }

  return url;
};

// Main Component
const TasksTable = ({
  isCompact = false,
  type = "today",
  filterTasks = [],
}) => {
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const processData = () => {
      return filterTasks.map((item) => {
        const rawValue = String(item.col23 || "").replace(/^"|"$/g, "");

        let imageUrl = "";
        let userName = "";

        if (rawValue.includes(",")) {
          const parts = rawValue.split(/,(.+)/);
          imageUrl = parts[0]?.trim() || "";
          userName = parts[1]?.trim() || "";
        } else if (rawValue.startsWith("http")) {
          imageUrl = rawValue.trim();
          userName = "";
        } else {
          imageUrl = "";
          userName = rawValue.trim();
        }

        const finalUrl = convertGoogleDriveImageUrl(imageUrl);

        return {
          ...item,
          _imageUrl: finalUrl,
          _userName: userName || "User",
        };
      });
    };

    setProcessedData(processData());
  }, [filterTasks]);

  const renderCell = (item, headerId) => {
    if (headerId === "col13") {
      const imageUrl = item._imageUrl || "";
      const userName = item._userName || "User";

      return (
        <div className="flex items-center space-x-2">
          <ImgWithFallback
            src={imageUrl}
            alt={`${userName} profile`}
            name={userName}
            className="w-8 h-8 rounded-full"
            fallbackElement={
              <div className="w-8 h-8 bg-gray-200 rounded-full p-1 flex items-center justify-center">
                <User size={14} className="text-gray-400" />
              </div>
            }
          />
          <span className="font-medium text-sm">{userName}</span>
        </div>
      );
    }

    return item[headerId] || "—";
  };

  const staticHeaders = [
    { id: "col13", label: "Link With Name" },
    { id: "col2", label: "Fms Name" },
    { id: "col3", label: "Task Name" },
    // { id: "col4", label: "Person Name" },
    { id: "col14", label: "Pending Till Date" },
  ];

  return (
    <div
      className={`w-full max-w-[1000px] mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${
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
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                {staticHeaders.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={staticHeaders.length}
                    className="px-4 py-6 text-base text-center text-gray-500"
                  >
                    No results found.
                  </td>
                </tr>
              ) : (
                processedData.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {staticHeaders.map((header) => (
                      <td
                        key={header.id}
                        className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap"
                      >
                        {renderCell(item, header.id)}
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

export default TasksTable;
