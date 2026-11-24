import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Router, Navigate } from "react-router-dom";
import "./index.css";

// v2 (the game-style city) is the main site at "/". The original site lives
// on at "/v1". Each is its own lazy chunk, so neither downloads the other.
const HomeV2 = lazy(() => import("./v2"));
const HomeV1 = lazy(() => import("./pages/Home"));

const fallback = <div style={{ minHeight: "100vh", background: "#0B0B1E" }} />;

export default ({ history }) => {
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    // Listen to history changes and update location state
    const unlisten = history.listen((update) => {
      setLocation(update.location);
    });
    // A child (e.g. the /v2 → / redirect) may already have navigated before
    // this listener existed, since child effects run first. Catch up.
    setLocation(history.location);

    return unlisten; // Clean up the listener on unmount
  }, [history]);

  return (
    <div>
      <Router location={location} navigator={history}>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<HomeV2 />} />
            <Route path="/v1/*" element={<HomeV1 />} />
            {/* Old links to the v2 preview keep working. */}
            <Route path="/v2/*" element={<Navigate to={`/${location.search || ""}`} replace />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};
