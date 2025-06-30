import React, { useState } from "react";
import {
  Video,
  Users,
  MessageSquare,
  Target,
  Award,
  Briefcase,
  CheckSquare,
  Users2,
  Database,
  Link,
  PlayCircle,
} from "lucide-react";
import KpikraTable from "../../components/tables/KpikraTable";

const designations = ["CRM", "PURCHASER", "HR", "EA", "ACCOUNTANT"];

const KpiKra = () => {
  const [selectedDesignation, setSelectedDesignation] = useState("CRM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Function to submit dropdown selection to Google Sheets
  const handleDropdownChange = async (newDesignation) => {
    setSelectedDesignation(newDesignation);
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const formData = new FormData();
      formData.append("sheetName", "Dashboard");
      formData.append("action", "updateCell");
      formData.append("row", "2");
      formData.append("column", "1"); // Column A
      formData.append("value", newDesignation);

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzcGGAZCqsDQRRiRkzIWev2jgYjcuVDoHYac1C7ZGpt5VsfREYRcaOEwAcCLh59O2KV/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setSubmitMessage("✅ Selection saved successfully!");
      } else {
        setSubmitMessage("❌ Error saving selection: " + result.error);
      }
    } catch (error) {
      setSubmitMessage("❌ Error: " + error.message);
    } finally {
      setIsSubmitting(false);
      // Clear message after 3 seconds
      setTimeout(() => setSubmitMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-sm text-white">
        <div>
          <h1 className="text-2xl font-bold">KPI & KRA Dashboard</h1>
          <p className="text-blue-100 mt-1">
            Performance metrics and role information
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <select
            value={selectedDesignation}
            onChange={(e) => handleDropdownChange(e.target.value)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50"
          >
            {designations.map((designation) => (
              <option
                key={designation}
                value={designation}
                className="text-gray-900"
              >
                {designation}
              </option>
            ))}
          </select>

          {/* Status message */}
          {(isSubmitting || submitMessage) && (
            <div className="text-sm">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                <span
                  className={
                    submitMessage.includes("✅")
                      ? "text-green-200"
                      : "text-red-200"
                  }
                >
                  {submitMessage}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <KpikraTable />
    </div>
  );
};

export default KpiKra;
