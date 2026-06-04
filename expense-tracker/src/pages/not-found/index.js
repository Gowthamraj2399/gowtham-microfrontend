import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] w-full mx-auto px-6 py-8 pb-8 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-8">
        <h1
          className="text-7xl sm:text-9xl font-black leading-none mb-4"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-text-secondary text-sm sm:text-base max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 justify-center rounded-xl h-12 px-6 text-white text-sm font-bold transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
          boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>home</span>
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
