import React from 'react';
import { getEmployeeById, getTasksByEmployeeId } from '../../data/mockData';
import StatsCard from '../../components/dashboard/StatsCard';
import DoughnutChart from '../../components/charts/DoughnutChart';
import { Award, CheckSquare, ClipboardList, Clock } from 'lucide-react';

const UserDashboard = () => {
  const userId = 'emp-001';
  const employee = getEmployeeById(userId);
  
  if (!employee) {
    return <div>User not found</div>;
  }
  
  const userTasks = getTasksByEmployeeId(userId);
  const completedTasks = userTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = userTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = userTasks.filter(task => task.status === 'in-progress').length;
  
  const taskCompletionData = [completedTasks, inProgressTasks, pendingTasks];
  const taskCompletionLabels = ['Completed', 'In Progress', 'Pending'];
  const taskCompletionColors = ['#10b981', '#3b82f6', '#f59e0b'];
  
  const completionPercentage = Math.round((completedTasks / userTasks.length) * 100);

  // Commitment comparison data
  const commitmentData = {
    actual: completedTasks,
    committed: employee.weeklyCommitment || 0,
    percentage: Math.round((completedTasks / (employee.weeklyCommitment || 1)) * 100)
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Performance Score" 
          value={employee.score} 
          icon={Award} 
          color="green"
          trend={{ value: 3.2, label: "vs last week", positive: true }}
        />
        
        <StatsCard 
          title="Total Tasks" 
          value={userTasks.length} 
          icon={ClipboardList} 
          color="blue"
        />
        
        <StatsCard 
          title="Completed Tasks" 
          value={completedTasks} 
          icon={CheckSquare} 
          color="green"
          trend={{ value: 8.1, label: "vs last week", positive: true }}
        />
        
        <StatsCard 
          title="Pending Tasks" 
          value={pendingTasks} 
          icon={Clock} 
          color="amber"
          trend={{ value: 1.5, label: "vs last week", positive: false }}
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Task Completion */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Task Completion</h2>
          <DoughnutChart 
            data={taskCompletionData} 
            labels={taskCompletionLabels}
            colors={taskCompletionColors}
          />
        </div>
        
        {/* Commitment Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Weekly Commitment Progress</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Committed Tasks</span>
                <span className="text-sm font-bold text-gray-800">{commitmentData.committed}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Completed Tasks</span>
                <span className="text-sm font-bold text-gray-800">{commitmentData.actual}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${
                    commitmentData.percentage >= 100 ? 'bg-green-500' :
                    commitmentData.percentage >= 75 ? 'bg-blue-500' :
                    commitmentData.percentage >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(commitmentData.percentage, 100)}%` }}
                />
              </div>
              <div className="mt-2 text-center">
                <span className={`text-sm font-medium ${
                  commitmentData.percentage >= 100 ? 'text-green-600' :
                  commitmentData.percentage >= 75 ? 'text-blue-600' :
                  commitmentData.percentage >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {commitmentData.percentage}% of weekly commitment completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Recent Performance Feedback</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2">
            <p className="text-sm sm:text-base text-gray-700">
              Great job completing the UI Design task ahead of schedule! Your attention to detail and creativity were exceptional.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manager Feedback - 3 days ago</p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2">
            <p className="text-sm sm:text-base text-gray-700">
              Your collaboration with the design team has been excellent. Continue to maintain this level of communication.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Team Lead Feedback - 1 week ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;