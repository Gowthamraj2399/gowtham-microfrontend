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
        <div className="bg-white dark:bg-surface-dark border border-surface-highlight rounded-lg p-3 shadow-lg">
          <p className="font-medium text-slate-900 dark:text-white">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 rounded-xl bg-white dark:bg-surface-dark border border-[#e5e7eb] dark:border-surface-highlight p-5 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-text-secondary">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
          <span className="text-xs text-text-secondary">Income</span>
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ml-1"></span>
          <span className="text-xs text-text-secondary">Expense</span>
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 5,
            }}
            barCategoryGap="15%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-surface-highlight"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              className="dark:fill-text-secondary"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              className="dark:fill-text-secondary"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="Income"
              fill="#137fec"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
            <Bar
              dataKey="Expense"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomBarChart;
