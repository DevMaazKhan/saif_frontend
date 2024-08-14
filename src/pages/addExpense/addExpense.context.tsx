import { createContext, useMemo } from "react";

const AddExpenseContext = createContext();

const AddExpenseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({}), []);

  return <AddExpenseContext.Provider value={value}>{children}</AddExpenseContext.Provider>;
};

export default AddExpenseContextProvider;
