import { createContext, useMemo } from "react";

const CompanyLedgerContext = createContext(null);

const CompanyLedgerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => null, []);

  return <CompanyLedgerContext.Provider value={value}>{children}</CompanyLedgerContext.Provider>;
};

export default CompanyLedgerContextProvider;
