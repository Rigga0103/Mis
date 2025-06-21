import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon = LucideIcon, color = 'blue', trend }) => {
  // Use template literals for class names to avoid Tailwind purging issues
  const borderColorClass = `border-${color}-200`;
  const iconBgColorClass = `bg-${color}-100`;
  const iconTextColorClass = `text-${color}-600`;
  
  return (
    <div className={`bg-white rounded-lg p-6 border ${borderColorClass} shadow-sm`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconBgColorClass} mr-4`}>
          <Icon className={`w-6 h-6 ${iconTextColorClass}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-semibold text-gray-800 mt-1">{value}</h4>
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`flex items-center text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-sm text-gray-500 ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

// Add prop validation
StatsCard.defaultProps = {
  icon: LucideIcon,
  color: 'blue',
  trend: null,
};

export default StatsCard;