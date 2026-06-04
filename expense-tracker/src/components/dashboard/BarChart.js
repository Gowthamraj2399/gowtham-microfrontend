import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomBarChart = ({ title, subtitle, data }) => {
  // Transform data for Recharts format
  const chartData = data.map((item) => ({
    month: item.month,
    Income: item.income,
    Expense: item.expense,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "rgba(13,17,23,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "10px 14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <p style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: 12, marginTop: 2 }}>
              {entry.dataKey}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="lg:col-span-2 rounded-2xl p-5 flex flex-col"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "#8B5CF6" }}></span>
            <span className="text-xs text-text-secondary">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }}></span>
            <span className="text-xs text-text-secondary">Expense</span>
          </div>
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7B8FA8", fontSize: 11, fontFamily: "Inter" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7B8FA8", fontSize: 11, fontFamily: "Inter" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} />
            <Bar dataKey="Income" fill="#8B5CF6" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Expense" fill="#F59E0B" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomBarChart;
