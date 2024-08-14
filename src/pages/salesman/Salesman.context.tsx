import { createContext, useMemo } from "react";

const CompanyContext = createContext();

const CompanyContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({}), []);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

export default CompanyContextProvider;
