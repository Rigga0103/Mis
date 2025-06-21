import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Ensure Chart.js components are registered
ChartJS.register(ArcElement, Tooltip, Legend);

const HalfCircleChart = ({
  data,
  labels,
  colors = [
    '#8DD9D5',  // Light teal for Admin User
    '#6BBBEA',  // Light blue for Sarah Johnson
    '#BEA1E8',  // Light purple for Jessica Miller
    '#FFB77D',  // Light orange for Emily Wilson
    '#FF99A8'   // Light pink for John Smith
  ]
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, data.length),
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    circumference: 180,
    rotation: -90,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Arial, sans-serif',
            size: 12
          },
          color: '#333'
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            return `${context.label}: ${value}%`;
          }
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

HalfCircleChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string)
};

export default HalfCircleChart;