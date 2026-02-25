import React, { lazy, Suspense, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";

import Progress from "./components/Progress";

const PortfolioLazy = lazy(() => import("./components/PortfolioApp"));
const AuthLazy = lazy(() => import("./components/AuthApp"));
const ExpenseTrackerLazy = lazy(() => import("./components/ExpenseTrackerApp"));
const PxelLazy = lazy(() => import("./components/PxelApp"));

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const navigate = useNavigate();

  const handleSignIn = () => {
    setIsSignedIn(true);
    navigate("/expense-tracker/dashboard");
  };

  return (
    <StyledEngineProvider injectFirst>
      <div>
        <Suspense fallback={<Progress />}>
          <Routes>
            <Route
              path="/auth/*"
              element={<AuthLazy onSignIn={handleSignIn} />}
            />

            <Route path="/*" element={<PortfolioLazy />} />
            <Route
              path="/expense-tracker/*"
              element={
                !isSignedIn ? <Navigate to="/" /> : <ExpenseTrackerLazy />
              }
            />
            <Route path="/pxel/*" element={<PxelLazy />} />
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
