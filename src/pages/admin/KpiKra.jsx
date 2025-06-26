import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  Users,
  MessageSquare,
  Users2,
  Briefcase,
  CheckSquare,
  Target,
  Video,
} from "lucide-react";

const KpiKra = () => {
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [designationDataMap, setDesignationDataMap] = useState({});
  const SPREADSHEET_ID = "1h8lu66_hZlHm3tkaUhypmM_HhKP2WCaCfOPmAsisqKY";

  const fetchKPIData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDesignations([]);
      setDesignationDataMap({});

      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=Designation Brief`;

      const response = await fetch(url);
      const rawText = await response.text();
      console.log("✅ Raw gviz text:", rawText);

      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      const rows = parsed.table.rows;

      const extractedData = {};
      const extractedDesignations = [];

      for (let i = 1; i < rows.length; i++) {
        // skip row 1 (index 0 = headers)
        const row = rows[i];
        const cells = row.c;

        const designation = cells?.[0]?.v;
        const team = cells?.[2]?.v?.split(",").map((t) => t.trim()) || [];
        const how = cells?.[4]?.v || "";

        if (designation) {
          extractedData[designation] = {
            communicationTeam: team,
            howToCommunicate: how,
          };
          extractedDesignations.push(designation);
        }
      }

      if (extractedDesignations.length === 0) {
        throw new Error("No valid designations found in sheet");
      }

      setDesignations(extractedDesignations);
      setDesignationDataMap(extractedData);
      setSelectedDesignation(extractedDesignations[0]);

      toast.success(`✅ Loaded ${extractedDesignations.length} designations`);
    } catch (err) {
      console.error("❌ Error fetching data:", err.message);
      setError(err.message);
      toast.error(`Failed to load data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (data) => {
    // Verify data structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format received");
    }

    // Extract designations from Column A
    const validDesignations = Object.keys(data).filter((designation) => {
      const item = data[designation];
      return (
        designation &&
        Array.isArray(item.communicationTeam) &&
        typeof item.howToCommunicate === "string"
      );
    });

    if (validDesignations.length === 0) {
      throw new Error("No valid designations found");
    }

    setDesignations(validDesignations);
    setDesignationDataMap(data);
    setSelectedDesignation(validDesignations[0]);
    toast.success(`Loaded ${validDesignations.length} designations`);
  };

  useEffect(() => {
    fetchKPIData();
  }, []);

  const currentData = designationDataMap[selectedDesignation] || {
    communicationTeam: [],
    howToCommunicate: "No data available",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-lg mb-4">Error: {error}</div>
        <button
          onClick={fetchKPIData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry Loading Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-sm text-white gap-4">
        <div>
          <h1 className="text-2xl font-bold">Communication Dashboard</h1>
          <p className="text-blue-100 mt-1">
            Team communication information by designation
          </p>
        </div>
        <select
          value={selectedDesignation}
          onChange={(e) => setSelectedDesignation(e.target.value)}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent w-full md:w-auto"
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
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Information Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6 transform transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Role Details
            </h2>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-600 mb-2">
              Actual Role
            </h3>
            <p className="text-gray-800">{currentData.actualRole}</p>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-sm border border-emerald-100 p-6 transform transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Task Overview
            </h2>
          </div>
          <div className="bg-white rounded-lg p-6 border border-emerald-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">
                testing
                {/* {currentData.totalTasks.split(" ")[0]} */}
              </p>
            </div>
          </div>
        </div>

        {/* Scoring Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100 p-6 transform transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Performance Scoring
            </h2>
          </div>
          <div className="space-y-4">
            <a
              // href={currentData.scoringWorks}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-4 border border-purple-100 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-purple-600">
                  How Scoring Works
                </span>
              </div>
            </a>
            <a
              // href={currentData.scoreBetter}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-4 border border-purple-100 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-purple-600">
                  How To Score Better
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users2 className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Team Communication (Column C)
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-amber-100">
              <h3 className="text-sm font-medium text-amber-600 mb-3">
                Communication Team Members
              </h3>
              <ul className="space-y-2">
                {currentData.communicationTeam.map((member, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <Users className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-700">{member}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-sm border border-cyan-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-cyan-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Communication Process (Column E)
            </h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-cyan-100">
              <h3 className="text-sm font-medium text-cyan-600 mb-2">
                How to Communicate
              </h3>
              <p className="text-gray-700">{currentData.howToCommunicate}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Systems Table - Full Width */}
      {/* <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Systems and Resources
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentData.systems.map((system, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {system.systemName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {system.taskName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">
                      {system.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <a
                        href={system.systemLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                        <span className="text-sm font-medium">System</span>
                      </a>
                      <a
                        href={system.dbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        <Database className="w-4 h-4" />
                        <span className="text-sm font-medium">Dashboard</span>
                      </a>
                      <a
                        href={system.trainingVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Training</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default KpiKra;
