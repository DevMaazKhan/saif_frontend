import { createContext, useMemo } from "react";

const ItemStockContext = createContext(null);

const ItemStockContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => null, []);

  return <ItemStockContext.Provider value={value}>{children}</ItemStockContext.Provider>;
};

export default ItemStockContextProvider;
