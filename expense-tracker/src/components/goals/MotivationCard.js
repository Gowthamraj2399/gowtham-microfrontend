import React from "react";

const MotivationCard = ({ motivation }) => {
  const { title, message, buttonText } = motivation;

  return (
    <div
      className="rounded-2xl p-5 text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(109,40,217,0.6) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(139,92,246,0.3)",
        boxShadow: "0 8px 32px rgba(139,92,246,0.2)",
      }}
    >
      <div
        className="absolute -right-4 -top-4"
        style={{ opacity: 0.15 }}
      >
        <span
          className="material-symbols-rounded"
          style={{ fontSize: "120px", fontVariationSettings: "'FILL' 1" }}
        >
          trophy
        </span>
      </div>
      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="font-bold text-base">{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
          {message}
        </p>
        <button
          className="mt-2 w-fit px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default MotivationCard;
