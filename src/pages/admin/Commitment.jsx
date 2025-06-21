import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

/**
 * WeeklyTaskCommitment component for managing user task commitments
 * @returns {JSX.Element} Rendered component
 */
const WeeklyTaskCommitment = () => {
  // Sample data with proper images
  const users = [
    {
      id: "1",
      name: "Rajesh Kumar",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: "2025-01-01",
      dateEnd: "2025-12-31",
      target: "100%",
      actualWorkDone: "85%",
      workDoneOnTime: "90%",
      totalWorkDone: "88%",
      weekPending: 2,
    },
    {
      id: "2",
      name: "Priya Sharma",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: "2025-02-01",
      dateEnd: "2025-12-31",
      target: "95%",
      actualWorkDone: "82%",
      workDoneOnTime: "85%",
      totalWorkDone: "84%",
      weekPending: 3,
    },
    {
      id: "3",
      name: "Amit Patel",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: "2025-03-01",
      dateEnd: "2025-12-31",
      target: "90%",
      actualWorkDone: "70%",
      workDoneOnTime: "75%",
      totalWorkDone: "73%",
      weekPending: 4,
    },
    {
      id: "4",
      name: "Neha Gupta",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: "2025-01-15",
      dateEnd: "2025-12-31",
      target: "100%",
      actualWorkDone: "95%",
      workDoneOnTime: "98%",
      totalWorkDone: "96%",
      weekPending: 1,
    },
    {
      id: "5",
      name: "Vikram Singh",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
      dateStart: "2025-02-15",
      dateEnd: "2025-12-31",
      target: "95%",
      actualWorkDone: "88%",
      workDoneOnTime: "90%",
      totalWorkDone: "89%",
      weekPending: 2,
    },
  ];

  // State for selected users and commitments
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [commitments, setCommitments] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  /**
   * Handle individual checkbox change
   * @param {string} userId - The user ID to toggle selection
   */
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  /**
   * Handle commitment input change
   * @param {string} userId - The user ID to update commitment for
   * @param {string} value - The new commitment value
   */
  const handleCommitmentChange = (userId, value) => {
    setCommitments((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  /**
   * Handle submit commitments
   */
  const handleSubmit = () => {
    const selectedCommitments = selectedUsers.map((userId) => {
      const user = users.find((u) => u.id === userId);
      return {
        userId,
        name: user?.name,
        commitment: commitments[userId] || "",
      };
    });

    console.log("Submitted commitments:", selectedCommitments);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Weekly Task Commitment</h1>
        <div className="text-sm text-gray-500">
          Week of May 1, 2025
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectAll}
                      onChange={() => {
                        setSelectAll(!selectAll);
                        if (!selectAll) {
                          setSelectedUsers(users.map((user) => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                    <span className="ml-2">Select</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Work Done</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Work Done On Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Work Done</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commitment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={selectedUsers.includes(user.id) ? "bg-blue-50" : ""}>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.image}
                        alt={user.name}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dateStart}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dateEnd}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: user.actualWorkDone }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{user.actualWorkDone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: user.workDoneOnTime }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{user.workDoneOnTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="h-2 rounded-full bg-purple-600"
                          style={{ width: user.totalWorkDone }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{user.totalWorkDone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.weekPending <= 1
                          ? "bg-green-100 text-green-800"
                          : user.weekPending <= 2
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.weekPending}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="text"
                      className={`border border-gray-300 rounded-md px-3 py-1 w-full ${
                        !selectedUsers.includes(user.id) ? "bg-gray-100" : ""
                      }`}
                      placeholder={selectedUsers.includes(user.id) ? "Enter commitment" : ""}
                      disabled={!selectedUsers.includes(user.id)}
                      value={commitments[user.id] || ""}
                      onChange={(e) => handleCommitmentChange(user.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0}
          >
            Submit Commitments
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTaskCommitment;