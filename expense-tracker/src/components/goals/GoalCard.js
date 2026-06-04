import React from "react";

const GoalCard = ({ goal }) => {
  const {
    title,
    targetDate,
    saved,
    target,
    percentage,
    progressColor,
    monthlyContribution,
    monthsLeft,
    statusMessage,
    image,
    imageAlt,
  } = goal;

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div
      className="group flex flex-col sm:flex-row items-stretch rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="w-full sm:w-44 h-40 sm:h-auto bg-center bg-no-repeat bg-cover shrink-0 relative"
        style={{ backgroundImage: `url("${image}")` }}
        role="img"
        aria-label={imageAlt}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent, rgba(8,11,20,0.4))" }} />
      </div>
      <div className="flex flex-col flex-grow p-5 gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
            <p className="text-text-secondary text-xs mt-0.5">Target: {targetDate}</p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-white">
              {formatCurrency(saved)}{" "}
              <span className="text-text-secondary text-xs font-normal">/ {formatCurrency(target)}</span>
            </p>
            {monthlyContribution && (
              <p className="text-xs font-semibold mt-0.5" style={{ color: "#34D399" }}>
                +{formatCurrency(monthlyContribution)} this month
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{percentage}% Saved</span>
            <span>{statusMessage || `${monthsLeft} months left`}</span>
          </div>
          <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-auto pt-1">
          <button className="text-xs font-semibold text-text-secondary hover:text-white transition-colors">
            Details
          </button>
          <button
            className="flex items-center justify-center rounded-xl h-8 px-4 text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}
          >
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
