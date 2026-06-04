import React, { useState } from "react";

const PortfolioChart = ({ timeframes }) => {
  const [activeTimeframe, setActiveTimeframe] = useState("1y");

  return (
    <div
      className="lg:col-span-2 flex flex-col rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="text-white font-bold text-lg">Portfolio Growth</h3>
          <p className="text-sm" style={{ color: "#7B8FA8" }}>Performance over time</p>
        </div>
        <div
          className="flex rounded-lg p-1 gap-1"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setActiveTimeframe(timeframe.id)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all"
              style={
                activeTimeframe === timeframe.id
                  ? {
                      background: "rgba(139,92,246,0.25)",
                      color: "#A78BFA",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }
                  : { color: "#7B8FA8" }
              }
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-[250px] relative">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 250">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35"></stop>
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
          <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
          <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
          <line stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
          {/* Area Path */}
          <path
            d="M0,200 C100,180 150,210 250,150 C350,90 400,120 500,80 C600,40 650,70 800,20 V250 H0 Z"
            fill="url(#chartGradient)"
          ></path>
          {/* Line Path */}
          <path
            d="M0,200 C100,180 150,210 250,150 C350,90 400,120 500,80 C600,40 650,70 800,20"
            fill="none"
            stroke="#8B5CF6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          ></path>
          {/* Active Point */}
          <circle cx="500" cy="80" fill="#8B5CF6" r="6" stroke="rgba(255,255,255,0.8)" strokeWidth="2"></circle>
        </svg>
        {/* Tooltip */}
        <div
          className="absolute top-[20%] left-[60%] text-white text-xs font-bold px-3 py-1.5 rounded transform -translate-x-1/2 -translate-y-full"
          style={{
            background: "#0D1117",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          $42,105
        </div>
      </div>
      <div className="flex justify-between mt-4 px-2 text-xs font-medium" style={{ color: "#7B8FA8" }}>
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
