import { createContext, useMemo } from "react";

const SalesmanCustomersContext = createContext(null);

const SalesmanCustomersContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => null, []);

  return <SalesmanCustomersContext.Provider value={value}>{children}</SalesmanCustomersContext.Provider>;
};

export default SalesmanCustomersContextProvider;
