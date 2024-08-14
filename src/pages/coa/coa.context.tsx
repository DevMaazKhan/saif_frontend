import { createContext, useMemo } from "react";

const COAContext = createContext();

const COAContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({}), []);

  return <COAContext.Provider value={value}>{children}</COAContext.Provider>;
};

export default COAContextProvider;
