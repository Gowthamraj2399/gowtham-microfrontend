import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const glassStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const tooltipStyle = {
  background: "rgba(13,17,23,0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "10px 14px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

// --- Daily Spending Trend (Area chart: this month vs last month) ---
export const SpendingTrendChart = ({ title, subtitle, data }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle}>
          <p style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 6, fontSize: 12 }}>Day {label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} style={{ color: entry.color, fontSize: 12, marginTop: 2 }}>
              {entry.dataKey === "thisMonth" ? "This month" : "Last month"}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl p-5 flex flex-col lg:col-span-2" style={glassStyle}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "#8B5CF6" }} />
            <span className="text-xs text-text-secondary">This month</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "#475569" }} />
            <span className="text-xs text-text-secondary">Last month</span>
          </div>
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorThis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7B8FA8", fontSize: 11, fontFamily: "Inter" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7B8FA8", fontSize: 11, fontFamily: "Inter" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(139,92,246,0.2)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="lastMonth"
              stroke="#475569"
              strokeWidth={1.5}
              fill="url(#colorLast)"
              strokeDasharray="4 2"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="thisMonth"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#colorThis)"
              dot={false}
              activeDot={{ r: 4, fill: "#8B5CF6", stroke: "#0D1117", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Monthly Comparison Bar Chart ---
export const MonthlyComparisonChart = ({ title, subtitle, data, previousAvg }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle}>
          <p style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: 4, fontSize: 12 }}>{label}</p>
          <p style={{ color: "#A78BFA", fontSize: 13, fontWeight: 700 }}>${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl p-5 flex flex-col" style={glassStyle}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-text-secondary">Avg</span>
          <span className="text-xs font-bold" style={{ color: "#F59E0B" }}>${previousAvg.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex-1" style={{ minHeight: "180px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 4, left: -15, bottom: 0 }} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7B8FA8", fontSize: 11, fontFamily: "Inter" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#7B8FA8", fontSize: 10, fontFamily: "Inter" }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.06)" }} />
            <ReferenceLine
              y={previousAvg}
              stroke="#F59E0B"
              strokeDasharray="4 2"
              strokeWidth={1.5}
            />
            <Bar
              dataKey="amount"
              radius={[6, 6, 0, 0]}
              fill="url(#barGrad)"
            >
              {data.map((entry, index) => {
                const isLatest = index === data.length - 1;
                return (
                  <rect
                    key={entry.month}
                    fill={isLatest ? "url(#barGradActive)" : "url(#barGrad)"}
                  />
                );
              })}
            </Bar>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#6D28D9" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity={1} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
