import React, { useState } from 'react';
import { Video, Users, MessageSquare, Target, Award, Briefcase, CheckSquare, Users2, Database, Link, PlayCircle } from 'lucide-react';

const designations = [
  'CRM',
  'PURCHASE',
  'HR',
  'EA',
  'SALES Coordination',
  'AUDITOR',
  'ACCOUNTANT'
];

const designationData = {
  CRM: {
    actualRole: 'Customer Relationship Management Executive',
    totalTasks: '20 daily tasks',
    scoringWorks: 'https://youtu.be/scoring-crm',
    scoreBetter: 'https://youtu.be/improve-crm',
    keyPerson: 'Jayant Pandey (Marketing Manager)',
    communicationTeam: [
      'Jaidhish Pessary (Director and See Sales Operation Of Group)',
      'Kavit Passary (Director and See All Operations)',
      'Deyshree (Production Incharge)',
      'Himany Pandey (Purchaser and Transport, EA)'
    ],
    howToCommunicate: 'Introduction Through EA (Himani) and Get The Number Of All and Connect With Company\'s Phone Number',
    importanceScore: 'Critical for customer satisfaction and revenue generation',
    systems: [
      {
        systemName: 'New Crr Enquiry FMS',
        taskName: 'Crr Send Offer - Hiya',
        description: 'Make Offer And Send To Customer',
        systemLink: 'https://crm.example.com/enquiry',
        dbLink: 'https://db.example.com/crm',
        trainingVideo: 'https://youtu.be/l_sZZsU0dHU'
      },
      {
        systemName: 'New Order To Collection Fms Pmmp',
        taskName: 'Order Received',
        description: 'Received The Purchase Order Of Customer In System',
        systemLink: 'https://crm.example.com/orders',
        dbLink: 'https://db.example.com/orders',
        trainingVideo: 'https://youtu.be/FqR89slcsb8'
      }
    ]
  },
  PURCHASE: {
    actualRole: 'Procurement and Supply Chain Manager',
    totalTasks: '15 daily tasks',
    scoringWorks: 'Based on cost savings, vendor relationships, and procurement efficiency',
    scoreBetter: 'Optimize vendor negotiations, improve delivery times, and maintain quality standards',
    keyPerson: 'Rajesh Kumar (Head of Procurement)',
    communicationTeam: ['Vendors', 'Logistics', 'Finance Teams'],
    howToCommunicate: 'Vendor meetings, procurement system updates, and monthly reviews',
    importanceScore: 'Critical for cost management and supply chain efficiency',
    systems: [
      {
        systemName: 'Purchase Management System',
        taskName: 'Vendor Management',
        description: 'Handle vendor relationships and procurement processes',
        systemLink: 'https://purchase.example.com',
        dbLink: 'https://db.example.com/purchase',
        trainingVideo: 'https://youtu.be/purchase-training'
      }
    ]
  },
  HR: {
    actualRole: 'Human Resources Manager',
    totalTasks: '18 daily tasks',
    scoringWorks: 'Based on employee satisfaction, recruitment efficiency, and HR policy compliance',
    scoreBetter: 'Improve employee engagement, streamline HR processes, and enhance training programs',
    keyPerson: 'Priya Sharma (HR Director)',
    communicationTeam: ['All Departments', 'Management'],
    howToCommunicate: 'HR portal updates, department meetings, and employee newsletters',
    importanceScore: 'Essential for employee welfare and organizational development',
    systems: [
      {
        systemName: 'HR Management System',
        taskName: 'Employee Management',
        description: 'Handle employee records and HR processes',
        systemLink: 'https://hr.example.com',
        dbLink: 'https://db.example.com/hr',
        trainingVideo: 'https://youtu.be/hr-training'
      }
    ]
  },
  EA: {
    actualRole: 'Executive Assistant',
    totalTasks: '25 daily tasks',
    scoringWorks: 'Based on task completion, scheduling efficiency, and executive support quality',
    scoreBetter: 'Enhance organization skills, improve communication, and maintain confidentiality',
    keyPerson: 'Neha Gupta (Senior EA)',
    communicationTeam: ['Executive Team', 'Department Heads'],
    howToCommunicate: 'Direct communication, email updates, and calendar management',
    importanceScore: 'Critical for executive productivity and organizational coordination',
    systems: [
      {
        systemName: 'Executive Management System',
        taskName: 'Schedule Management',
        description: 'Handle executive calendars and meetings',
        systemLink: 'https://ea.example.com',
        dbLink: 'https://db.example.com/ea',
        trainingVideo: 'https://youtu.be/ea-training'
      }
    ]
  },
  'SALES Coordination': {
    actualRole: 'Sales Coordination Manager',
    totalTasks: '22 daily tasks',
    scoringWorks: 'Based on sales team support, coordination efficiency, and revenue impact',
    scoreBetter: 'Improve sales process coordination, enhance team communication, and optimize resource allocation',
    keyPerson: 'Amit Patel (Sales Director)',
    communicationTeam: ['Sales Teams', 'Support Departments'],
    howToCommunicate: 'Sales meetings, coordination reports, and team updates',
    importanceScore: 'Directly impacts sales performance and team efficiency',
    systems: [
      {
        systemName: 'Sales Coordination System',
        taskName: 'Team Coordination',
        description: 'Manage sales team coordination and support',
        systemLink: 'https://sales.example.com',
        dbLink: 'https://db.example.com/sales',
        trainingVideo: 'https://youtu.be/sales-training'
      }
    ]
  },
  AUDITOR: {
    actualRole: 'Internal Auditor',
    totalTasks: '12 daily tasks',
    scoringWorks: 'Based on audit accuracy, compliance adherence, and risk management',
    scoreBetter: 'Enhance audit procedures, improve documentation, and strengthen controls',
    keyPerson: 'Vikram Singh (Head of Audit)',
    communicationTeam: ['Finance Team', 'Department Heads'],
    howToCommunicate: 'Audit reports, compliance meetings, and risk assessments',
    importanceScore: 'Critical for organizational compliance and risk management',
    systems: [
      {
        systemName: 'Audit Management System',
        taskName: 'Compliance Audit',
        description: 'Conduct internal audits and compliance checks',
        systemLink: 'https://audit.example.com',
        dbLink: 'https://db.example.com/audit',
        trainingVideo: 'https://youtu.be/audit-training'
      }
    ]
  },
  ACCOUNTANT: {
    actualRole: 'Financial Accountant',
    totalTasks: '16 daily tasks',
    scoringWorks: 'Based on accuracy, timeliness, and compliance with accounting standards',
    scoreBetter: 'Improve financial reporting, enhance accuracy, and maintain compliance',
    keyPerson: 'Deepak Verma (Finance Head)',
    communicationTeam: ['Finance Department', 'Management'],
    howToCommunicate: 'Financial reports, accounting system updates, and team meetings',
    importanceScore: 'Essential for financial accuracy and organizational compliance',
    systems: [
      {
        systemName: 'Financial Management System',
        taskName: 'Financial Reporting',
        description: 'Handle financial records and reporting',
        systemLink: 'https://finance.example.com',
        dbLink: 'https://db.example.com/finance',
        trainingVideo: 'https://youtu.be/finance-training'
      }
    ]
  }
};

const KpiKra = () => {
  const [selectedDesignation, setSelectedDesignation] = useState('CRM');
  const currentData = designationData[selectedDesignation];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-sm text-white">
        <div>
          <h1 className="text-2xl font-bold">KPI & KRA Dashboard</h1>
          <p className="text-blue-100 mt-1">Performance metrics and role information</p>
        </div>
        <select
          value={selectedDesignation}
          onChange={(e) => setSelectedDesignation(e.target.value)}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent"
        >
          {designations.map((designation) => (
            <option key={designation} value={designation} className="text-gray-900">
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
            <h2 className="text-lg font-semibold text-gray-800">Role Details</h2>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-600 mb-2">Actual Role</h3>
            <p className="text-gray-800">{currentData.actualRole}</p>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-sm border border-emerald-100 p-6 transform transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800">Task Overview</h2>
          </div>
          <div className="bg-white rounded-lg p-6 border border-emerald-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">{currentData.totalTasks.split(' ')[0]}</p>
            </div>
          </div>
        </div>

        {/* Scoring Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100 p-6 transform transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">Performance Scoring</h2>
          </div>
          <div className="space-y-4">
            <a 
              href={currentData.scoringWorks}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-4 border border-purple-100 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-purple-600">How Scoring Works</span>
              </div>
            </a>
            <a 
              href={currentData.scoreBetter}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-4 border border-purple-100 hover:bg-purple-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-purple-600">How To Score Better</span>
              </div>
            </a>
          </div>
        </div>

        {/* Communication Section - Full Width */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Communication Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users2 className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-800">Team Communication</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-amber-100">
                <h3 className="text-sm font-medium text-amber-600 mb-3">Communication Team</h3>
                <ul className="space-y-2">
                  {currentData.communicationTeam.map((member, index) => (
                    <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-colors">
                      <Users className="w-4 h-4 text-amber-500" />
                      <span className="text-gray-700">{member}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Communication Process Card */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-sm border border-cyan-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-cyan-600" />
              <h2 className="text-lg font-semibold text-gray-800">Communication Process</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-cyan-100">
                <h3 className="text-sm font-medium text-cyan-600 mb-2">How to Communicate</h3>
                <p className="text-gray-700">{currentData.howToCommunicate}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-cyan-100">
                <h3 className="text-sm font-medium text-cyan-600 mb-2">Key Person</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-600" />
                  </div>
                  <p className="text-gray-700">{currentData.keyPerson}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Systems Table - Full Width */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">Systems and Resources</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentData.systems.map((system, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{system.systemName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{system.taskName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{system.description}</div>
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
        </div>
      </div>
    </div>
  );
};

export default KpiKra;