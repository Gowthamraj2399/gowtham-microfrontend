import React from "react";

const inputStyle = {
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

const AccountInfo = ({ accountData, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };
    onSave && onSave(data);
  };

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
      <h2 className="text-white font-bold text-lg mb-4">Account Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#7B8FA8" }}>
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            defaultValue={accountData.fullName}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#7B8FA8" }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            defaultValue={accountData.email}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#7B8FA8" }}>
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={accountData.phone}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 text-white text-sm font-bold rounded-lg transition-all"
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
            boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountInfo;
