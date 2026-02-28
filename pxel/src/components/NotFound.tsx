import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-8">
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
    <p className="text-slate-500 dark:text-slate-400 mb-4">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="px-4 py-2 rounded-lg font-semibold text-primary hover:underline"
    >
      Go to home
    </Link>
  </div>
);
