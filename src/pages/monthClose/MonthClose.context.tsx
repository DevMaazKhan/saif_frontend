import { createContext, useMemo } from "react";

const MonthCloseContext = createContext();

const MonthCloseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({}), []);

  return <MonthCloseContext.Provider value={value}>{children}</MonthCloseContext.Provider>;
};

export default MonthCloseContextProvider;
