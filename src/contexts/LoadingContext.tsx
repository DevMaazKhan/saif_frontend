import { createContext, useMemo, useState, useContext } from "react";

interface LoadingContext {
  isLoading: boolean;
  loadingReason: string;
  startLoading: (reason: string) => void;
  endLoading: () => void;
}

const loadingContextDefaultValues: LoadingContext = {
  isLoading: false,
  loadingReason: "",
  startLoading: () => {},
  endLoading: () => {},
};

const LoadingContext = createContext(loadingContextDefaultValues);

export const useLoadingContext = () => useContext(LoadingContext);

const LoadingContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState("");

  function startLoading(reason: string) {
    setIsLoading(true);
    setLoading(reason);
  }

  function endLoading() {
    setIsLoading(false);
    setLoading("");
  }

  const value: LoadingContext = useMemo(
    () => ({
      endLoading,
      startLoading,
      isLoading,
      loadingReason: loading,
    }),
    [isLoading, loading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export default LoadingContextProvider;
