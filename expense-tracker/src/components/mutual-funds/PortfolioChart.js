import React, { useState } from "react";

const PortfolioChart = ({ timeframes }) => {
  const [activeTimeframe, setActiveTimeframe] = useState("1y");

  return (
    <div className="lg:col-span-2 flex flex-col rounded-xl bg-white dark:bg-[#283039] shadow-sm border border-gray-100 dark:border-none p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Portfolio Growth
          </h3>
          <p className="text-sm text-slate-500 dark:text-[#9dabb9]">
            Performance over time
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-[#111418] rounded-lg p-1 gap-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setActiveTimeframe(timeframe.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTimeframe === timeframe.id
                  ? "bg-white dark:bg-[#283039] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-[#9dabb9] hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-[250px] relative">
        {/* SVG Chart */}
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 800 250"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#137fec" stopOpacity="0.3"></stop>
              <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          <line
            opacity="0.2"
            stroke="#374151"
            strokeDasharray="4 4"
            strokeWidth="1"
            x1="0"
            x2="800"
            y1="200"
            y2="200"
          ></line>
          <line
            opacity="0.2"
            stroke="#374151"
            strokeDasharray="4 4"
            strokeWidth="1"
            x1="0"
            x2="800"
            y1="150"
            y2="150"
          ></line>
          <line
            opacity="0.2"
            stroke="#374151"
            strokeDasharray="4 4"
            strokeWidth="1"
            x1="0"
            x2="800"
            y1="100"
            y2="100"
          ></line>
          <line
            opacity="0.2"
            stroke="#374151"
            strokeDasharray="4 4"
            strokeWidth="1"
            x1="0"
            x2="800"
            y1="50"
            y2="50"
          ></line>
          {/* Area Path */}
          <path
            d="M0,200 C100,180 150,210 250,150 C350,90 400,120 500,80 C600,40 650,70 800,20 V250 H0 Z"
            fill="url(#chartGradient)"
          ></path>
          {/* Line Path */}
          <path
            d="M0,200 C100,180 150,210 250,150 C350,90 400,120 500,80 C600,40 650,70 800,20"
            fill="none"
            stroke="#137fec"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          ></path>
          {/* Active Point */}
          <circle
            cx="500"
            cy="80"
            fill="#137fec"
            r="6"
            stroke="#ffffff"
            strokeWidth="2"
          ></circle>
        </svg>
        {/* Tooltip */}
        <div className="absolute top-[20%] left-[60%] bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1.5 rounded shadow-lg transform -translate-x-1/2 -translate-y-full mb-2">
          $42,105
        </div>
      </div>
      <div className="flex justify-between mt-4 px-2 text-xs font-medium text-slate-500 dark:text-[#9dabb9]">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </div>
  );
};

export default PortfolioChart;
