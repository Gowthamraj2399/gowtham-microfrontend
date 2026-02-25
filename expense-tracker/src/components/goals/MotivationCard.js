import React from "react";

const MotivationCard = ({ motivation }) => {
  const { title, message, buttonText } = motivation;

  return (
    <div className="rounded-xl p-5 bg-gradient-to-br from-primary to-blue-700 text-white relative overflow-hidden">
      <div className="absolute -right-4 -top-4 text-white/10">
        <span className="material-symbols-outlined text-[120px]">trophy</span>
      </div>
      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-blue-100 leading-relaxed">{message}</p>
        <button className="mt-2 w-fit bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default MotivationCard;
