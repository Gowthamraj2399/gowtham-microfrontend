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
    <div className="group flex flex-col sm:flex-row items-stretch rounded-xl bg-[#1c2127] border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
      <div
        className="w-full sm:w-48 h-40 sm:h-auto bg-center bg-no-repeat bg-cover shrink-0 relative"
        style={{ backgroundImage: `url("${image}")` }}
        role="img"
        aria-label={imageAlt}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
      </div>
      <div className="flex flex-col flex-grow p-5 gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {title}
            </h3>
            <p className="text-[#9dabb9] text-sm">Target: {targetDate}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">
              {formatCurrency(saved)}{" "}
              <span className="text-[#9dabb9] text-sm font-normal">
                / {formatCurrency(target)}
              </span>
            </p>
            {monthlyContribution && (
              <p className="text-xs text-green-400 font-medium">
                + {formatCurrency(monthlyContribution)} this month
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex justify-between text-xs font-medium text-[#9dabb9]">
            <span>{percentage}% Saved</span>
            <span>{statusMessage || `${monthsLeft} months left`}</span>
          </div>
          <div className="h-2 w-full bg-[#283039] rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} rounded-full`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-auto pt-2">
          <button className="text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">
            Details
          </button>
          <button className="flex items-center justify-center rounded-lg h-8 px-4 bg-primary/10 hover:bg-primary text-primary hover:text-white text-sm font-bold transition-all">
            Add Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
