import React from "react";

const RecentActivity = ({ activities }) => {
  const formatCurrency = (amount) => {
    return `$${amount}`;
  };

  return (
    <div className="flex flex-col rounded-xl bg-[#283039] p-5 border border-white/5 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">Recent Contributions</h3>
        <button className="p-1 hover:bg-white/5 rounded-full text-[#9dabb9]">
          <span className="material-symbols-outlined text-[20px]">
            more_horiz
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 ${
              activity.isOld ? "opacity-50" : ""
            }`}
          >
            <div
              className={`flex items-center justify-center size-10 rounded-full ${activity.iconBg} ${activity.iconColor} shrink-0`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {activity.icon}
              </span>
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-white">
                  {activity.goalName}
                </p>
                <p className="text-sm font-bold text-green-400">
                  +{formatCurrency(activity.amount)}
                </p>
              </div>
              <p className="text-xs text-[#9dabb9]">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-2 text-sm text-[#9dabb9] hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all">
        View All History
      </button>
    </div>
  );
};

export default RecentActivity;
