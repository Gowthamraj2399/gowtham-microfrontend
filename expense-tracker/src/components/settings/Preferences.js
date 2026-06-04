import React from "react";

const selectStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "white",
  width: "100%",
  padding: "0.625rem 1rem",
  borderRadius: "0.5rem",
  fontSize: "0.875rem",
  outline: "none",
};

const handleFocus = (e) => {
  e.target.style.borderColor = "rgba(139,92,246,0.5)";
};

const handleBlur = (e) => {
  e.target.style.borderColor = "rgba(255,255,255,0.08)";
};

const Preferences = ({ preferences, options, onChange }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      <h2 className="text-white font-bold text-lg mb-4">Preferences</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#7B8FA8" }}>
            Currency
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => onChange("currency", e.target.value)}
            style={selectStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {options.currencies.map((currency) => (
              <option
                key={currency.value}
                value={currency.value}
                style={{ background: "#0D1117" }}
              >
                {currency.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#7B8FA8" }}>
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => onChange("language", e.target.value)}
            style={selectStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {options.languages.map((language) => (
              <option
                key={language.value}
                value={language.value}
                style={{ background: "#0D1117" }}
              >
                {language.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#7B8FA8" }}>
            Date Format
          </label>
          <select
            value={preferences.dateFormat}
            onChange={(e) => onChange("dateFormat", e.target.value)}
            style={selectStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {options.dateFormats.map((format) => (
              <option
                key={format.value}
                value={format.value}
                style={{ background: "#0D1117" }}
              >
                {format.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
