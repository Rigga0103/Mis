// Mock data for the MIS system

export const employees = [
  {
    id: 'emp-001',
    name: 'Rajesh Kumar',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Engineering',
    score: 92,
    totalTasks: 24,
    completedTasks: 21,
    pendingTasks: 3,
    dateStart: '2025-01-01',
    dateEnd: '2025-12-31',
    target: 100,
    actualWorkDone: 85,
    workDoneOnTime: 90,
    totalWorkDone: 88,
    weekPending: 2,
    weeklyCommitment: 10
  },
  {
    id: 'emp-002',
    name: 'Priya Sharma',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Design',
    score: 88,
    totalTasks: 18,
    completedTasks: 15,
    pendingTasks: 3,
    dateStart: '2025-02-01',
    dateEnd: '2025-12-31',
    target: 95,
    actualWorkDone: 82,
    workDoneOnTime: 85,
    totalWorkDone: 84,
    weekPending: 3,
    weeklyCommitment: 8
  },
  {
    id: 'emp-003',
    name: 'Amit Patel',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Marketing',
    score: 75,
    totalTasks: 15,
    completedTasks: 10,
    pendingTasks: 5,
    dateStart: '2025-03-01',
    dateEnd: '2025-12-31',
    target: 90,
    actualWorkDone: 70,
    workDoneOnTime: 75,
    totalWorkDone: 73,
    weekPending: 4,
    weeklyCommitment: 7
  },
  {
    id: 'emp-004',
    name: 'Neha Gupta',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Sales',
    score: 95,
    totalTasks: 20,
    completedTasks: 19,
    pendingTasks: 1,
    dateStart: '2025-01-15',
    dateEnd: '2025-12-31',
    target: 100,
    actualWorkDone: 95,
    workDoneOnTime: 98,
    totalWorkDone: 96,
    weekPending: 1,
    weeklyCommitment: 12
  },
  {
    id: 'emp-005',
    name: 'Vikram Singh',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    department: 'Engineering',
    score: 89,
    totalTasks: 22,
    completedTasks: 19,
    pendingTasks: 3,
    dateStart: '2025-02-15',
    dateEnd: '2025-12-31',
    target: 95,
    actualWorkDone: 88,
    workDoneOnTime: 90,
    totalWorkDone: 89,
    weekPending: 2,
    weeklyCommitment: 9
  }
];

export const tasks = [
  {
    id: 'task-001',
    fmsName: 'Project Alpha',
    taskName: 'Frontend Development',
    personName: 'Rajesh Kumar',
    description: 'Implement new dashboard features',
    assignedTo: 'emp-001',
    dueDate: '2025-05-01',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2025-04-28',
    todayTask: 'Complete user authentication module'
  },
  {
    id: 'task-002',
    fmsName: 'Project Beta',
    taskName: 'UI Design',
    personName: 'Priya Sharma',
    description: 'Design new user interface components',
    assignedTo: 'emp-002',
    dueDate: '2025-05-01',
    status: 'completed',
    priority: 'high',
    createdAt: '2025-04-29',
    todayTask: 'Create wireframes for mobile app'
  },
  {
    id: 'task-003',
    fmsName: 'Project Gamma',
    taskName: 'Marketing Campaign',
    personName: 'Amit Patel',
    description: 'Launch social media campaign',
    assignedTo: 'emp-003',
    dueDate: '2025-05-01',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-04-30',
    todayTask: 'Content creation for social media'
  },
  {
    id: 'task-004',
    fmsName: 'Project Delta',
    taskName: 'Sales Presentation',
    personName: 'Neha Gupta',
    description: 'Prepare client presentation',
    assignedTo: 'emp-004',
    dueDate: '2025-05-01',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2025-04-30',
    todayTask: 'Client meeting preparation'
  },
  {
    id: 'task-005',
    fmsName: 'Project Epsilon',
    taskName: 'Backend Development',
    personName: 'Vikram Singh',
    description: 'Optimize database performance',
    assignedTo: 'emp-005',
    dueDate: '2025-05-01',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-04-29',
    todayTask: 'Database optimization'
  }
];

export const departments = [
  {
    id: 'dept-001',
    name: 'Engineering',
    employeeCount: 5,
    averageScore: 88
  },
  {
    id: 'dept-002',
    name: 'Design',
    employeeCount: 4,
    averageScore: 82
  },
  {
    id: 'dept-003',
    name: 'Marketing',
    employeeCount: 4,
    averageScore: 76
  },
  {
    id: 'dept-004',
    name: 'Sales',
    employeeCount: 4,
    averageScore: 91
  }
];

// Helper functions
export const getEmployeeById = (id) => {
  return employees.find(emp => emp.id === id);
};

export const getTasksByEmployeeId = (employeeId) => {
  return tasks.filter(task => task.assignedTo === employeeId);
};

export const getTasksForToday = (employeeId) => {
  const today = new Date().toISOString().split('T')[0];
  const filteredTasks = tasks.filter(task => task.dueDate === today);
  
  if (employeeId) {
    return filteredTasks.filter(task => task.assignedTo === employeeId);
  }
  
  return filteredTasks;
};

export const getPendingTasks = (employeeId) => {
  const filteredTasks = tasks.filter(task => task.status === 'pending');
  
  if (employeeId) {
    return filteredTasks.filter(task => task.assignedTo === employeeId);
  }
  
  return filteredTasks;
};

export const getTopScorers = (count) => {
  return [...employees].sort((a, b) => b.score - a.score).slice(0, count);
};

export const getLowestScorers = (count) => {
  return [...employees].sort((a, b) => a.score - b.score).slice(0, count);
};

export const getEmployeesByPendingTasks = () => {
  return [...employees].sort((a, b) => b.pendingTasks - a.pendingTasks);
};

export const getDepartmentScores = () => {
  return [...departments].sort((a, b) => b.averageScore - a.averageScore);
};

export const getWeeklyCommitmentComparison = () => {
  return employees.map(emp => ({
    name: emp.name,
    commitment: emp.weeklyCommitment || 0,
    actual: emp.completedTasks
  }));
};