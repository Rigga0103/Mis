import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalBarChart = ({
  data,
  labels,
  title,
  colors = ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
  maxValue = 10
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: data.map((_, index) => colors[index % colors.length]),
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 24,
        minBarLength: 6
      }
    ]
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: !!title,
        text: title || '',
        font: {
          size: 16,
          weight: '600',
          family: "'Inter', sans-serif"
        },
        color: '#1F2937',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        boxPadding: 8,
        titleFont: {
          size: 14,
          weight: '600',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        callbacks: {
          label: function(context) {
            return `Tasks: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: maxValue,
        grid: {
          display: false
        },
        ticks: {
          stepSize: 2,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: '#64748B'
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: '#64748B'
        },
        border: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

HorizontalBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  maxValue: PropTypes.number
};

export default HorizontalBarChart;