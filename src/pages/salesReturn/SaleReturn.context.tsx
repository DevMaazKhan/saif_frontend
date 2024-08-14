import { createContext, useMemo } from "react";

const SalesInvoiceContext = createContext(null);

const SalesInvoiceContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => null, []);

  return <SalesInvoiceContext.Provider value={value}>{children}</SalesInvoiceContext.Provider>;
};

export default SalesInvoiceContextProvider;
