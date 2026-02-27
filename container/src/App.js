import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";

import Progress from "./components/Progress";
import NotFound from "./components/NotFound";

const PortfolioLazy = lazy(() => import("./components/PortfolioApp"));
const AuthLazy = lazy(() => import("./components/AuthApp"));
const ExpenseTrackerLazy = lazy(() => import("./components/ExpenseTrackerApp"));
const PxelLazy = lazy(() => import("./components/PxelApp"));

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <div>
        <Suspense fallback={<Progress />}>
          <Routes>
            <Route path="/auth/*" element={<AuthLazy />} />
            <Route
              path="/expense-tracker"
              element={<Navigate to="/expense-tracker/dashboard" replace />}
            />
            <Route path="/expense-tracker/*" element={<ExpenseTrackerLazy />} />
            <Route path="/pxel/*" element={<PxelLazy />} />
            <Route path="/" element={<PortfolioLazy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </StyledEngineProvider>
  );
};

export default () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};
