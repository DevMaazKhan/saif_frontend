import { createContext, useMemo } from "react";

const ProductContext = createContext();

const ProductContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(() => ({}), []);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default ProductContextProvider;
