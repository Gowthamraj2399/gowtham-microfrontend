import React, { useState, useEffect } from "react";
import { Routes, Route, Router } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";

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
        </Routes>
      </Router>
    </div>
  );
};
