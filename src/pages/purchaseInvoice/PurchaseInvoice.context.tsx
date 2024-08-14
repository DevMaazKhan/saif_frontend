import { createContext, useMemo } from "react";

const PurchaseInvoiceContext = createContext(null);

const PurchaseInvoiceContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => null, []);

  return <PurchaseInvoiceContext.Provider value={value}>{children}</PurchaseInvoiceContext.Provider>;
};

export default PurchaseInvoiceContextProvider;
