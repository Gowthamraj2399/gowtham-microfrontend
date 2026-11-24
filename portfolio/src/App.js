import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Router } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";

// v2 is split into its own chunk so nothing it loads (later: three.js) lands on "/".
const HomeV2 = lazy(() => import("./v2"));

export default ({ history }) => {
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    // Listen to history changes and update location state
    const unlisten = history.listen((update) => {
      setLocation(update.location);
    });

    return unlisten; // Clean up the listener on unmount
  }, [history]);

  return (
    <div>
      <Router location={location} navigator={history}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/v2/*"
            element={
              <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0B0B1E" }} />}>
                <HomeV2 />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};
