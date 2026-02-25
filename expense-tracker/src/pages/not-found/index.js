import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] w-full mx-auto px-6 py-8 pb-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-[-0.033em] text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-slate-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-text-secondary text-sm md:text-base max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
