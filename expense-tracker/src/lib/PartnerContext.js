import React, { createContext, useContext, useState } from "react";
import { usePartnerConnection } from "./partner-query";
import { useAuth } from "./AuthContext";

const PartnerContext = createContext(null);
const STORAGE_KEY = "partner_show_combined";

export const PartnerProvider = ({ children }) => {
  const [showPartner, setShowPartnerState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
  });

  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data, isLoading } = usePartnerConnection();

  const conn = data?.active ?? null;
  const isInviter = conn?.inviter_id === userId;
  const partnerId    = conn ? (isInviter ? conn.invitee_id   : conn.inviter_id)   : null;
  const partnerName  = conn ? (isInviter ? conn.invitee_name : conn.inviter_name) : null;
  const connectionId = conn?.id ?? null;

  const setShowPartner = (val) => {
    const next = typeof val === "function" ? val(showPartner) : val;
    setShowPartnerState(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
  };

  // Auto-reset only after query has settled and there is definitely no partner
  React.useEffect(() => {
    if (!isLoading && !partnerId) {
      setShowPartnerState(false);
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  }, [isLoading, partnerId]);

  return (
    <PartnerContext.Provider value={{ showPartner, setShowPartner, partnerId, partnerName, connectionId, isPartnerConnLoading: isLoading }}>
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = () => {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error("usePartner must be used inside PartnerProvider");
  return ctx;
};
