import { createContext, useMemo, useState, useContext } from "react";

interface AppContext {
  currentContext: string;
  onContextChange(newContext: string): void;
}

const appContextDefaultValues: AppContext = {
  currentContext: "",
  onContextChange: () => {},
};

const AppContext = createContext(appContextDefaultValues);

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [context, setContext] = useState("");

  function onContextChange(newContext: string) {
    setContext(newContext);
  }

  const value: AppContext = useMemo(
    () => ({
      currentContext: context,
      onContextChange,
    }),
    [context]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
