import { createContext, useMemo } from "react";

const ViewExpenseContext = createContext();

const ViewExpenseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({}), []);

  return <ViewExpenseContext.Provider value={value}>{children}</ViewExpenseContext.Provider>;
};

export default ViewExpenseContextProvider;
